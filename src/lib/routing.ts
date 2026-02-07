import { prisma } from '@/lib/db'
import { parsePostcode } from '@/lib/postcode'
import type { RoutingRule, RoutingRuleTarget, Student } from '@prisma/client'

export type MatchLevel =
  | 'EXACT_OUTWARD'
  | 'DISTRICT'
  | 'TOWN'
  | 'COUNTY'
  | 'FALLBACK'
  | 'NONE'

export interface TriedRule {
  rule: RoutingRule
  targets: (RoutingRuleTarget & { student: Student })[]
  skipReason?: string
}

export interface RouteResult {
  matchedRule: RoutingRule | null
  assignedStudent: Student | null
  matchLevel: MatchLevel
  triedRules: TriedRule[]
}

/**
 * Find a valid student from a routing rule's targets.
 * For PRIORITY strategy: pick the first active, non-capacity student ordered by priority ASC.
 * For ROUND_ROBIN strategy: among tied-priority targets, rotate using lastAssignedIndex.
 */
async function pickStudentFromRule(
  rule: RoutingRule & {
    targets: (RoutingRuleTarget & { student: Student })[]
    roundRobinState: { id: string; lastAssignedIndex: number } | null
  },
  triedRules: TriedRule[],
): Promise<Student | null> {
  const activeTargets = rule.targets
    .filter(t => t.isActive)
    .sort((a, b) => a.priority - b.priority)

  if (activeTargets.length === 0) {
    triedRules.push({
      rule,
      targets: rule.targets,
      skipReason: 'No active targets',
    })
    return null
  }

  if (rule.strategy === 'ROUND_ROBIN') {
    return pickRoundRobin(rule, activeTargets, triedRules)
  }

  // PRIORITY strategy (default)
  for (const target of activeTargets) {
    if (!target.student.isActive) {
      continue
    }
    if (target.student.isAtCapacity) {
      continue
    }
    triedRules.push({ rule, targets: rule.targets })
    return target.student
  }

  triedRules.push({
    rule,
    targets: rule.targets,
    skipReason: 'All targets at capacity or inactive',
  })
  return null
}

/**
 * Round-robin selection among tied-priority targets.
 */
async function pickRoundRobin(
  rule: RoutingRule & {
    targets: (RoutingRuleTarget & { student: Student })[]
    roundRobinState: { id: string; lastAssignedIndex: number } | null
  },
  activeTargets: (RoutingRuleTarget & { student: Student })[],
  triedRules: TriedRule[],
): Promise<Student | null> {
  // Group by priority
  const minPriority = activeTargets[0]!.priority
  const tiedTargets = activeTargets.filter(t => t.priority === minPriority)

  // Filter to eligible students
  const eligible = tiedTargets.filter(
    t => t.student.isActive && !t.student.isAtCapacity,
  )

  if (eligible.length === 0) {
    triedRules.push({
      rule,
      targets: rule.targets,
      skipReason: 'All tied-priority targets at capacity or inactive',
    })
    return null
  }

  const lastIndex = rule.roundRobinState?.lastAssignedIndex ?? -1
  const nextIndex = (lastIndex + 1) % eligible.length

  // Update or create round-robin state
  if (rule.roundRobinState) {
    await prisma.routingRoundRobinState.update({
      where: { id: rule.roundRobinState.id },
      data: { lastAssignedIndex: nextIndex },
    })
  } else {
    await prisma.routingRoundRobinState.create({
      data: {
        routingRuleId: rule.id,
        lastAssignedIndex: nextIndex,
      },
    })
  }

  triedRules.push({ rule, targets: rule.targets })
  return eligible[nextIndex]!.student
}

/**
 * Find a matching routing rule for a given ruleType and matchValue.
 */
async function findRule(ruleType: 'POSTCODE_PREFIX' | 'TOWN' | 'COUNTY', matchValue: string) {
  return prisma.routingRule.findFirst({
    where: {
      ruleType,
      matchValue: matchValue.toUpperCase(),
      isActive: true,
    },
    include: {
      targets: {
        include: { student: true },
        orderBy: { priority: 'asc' },
      },
      roundRobinState: true,
    },
  })
}

/**
 * Route a lead by postcode: try exact outward code, then district prefix.
 */
async function routeByPostcode(
  postcode: string,
  triedRules: TriedRule[],
): Promise<{ student: Student | null; matchLevel: MatchLevel; rule: RoutingRule | null }> {
  const parsed = parsePostcode(postcode)
  if (!parsed) {
    return { student: null, matchLevel: 'NONE', rule: null }
  }

  // 1. Exact outward code (e.g. "B1")
  const exactRule = await findRule('POSTCODE_PREFIX', parsed.outward)
  if (exactRule) {
    const student = await pickStudentFromRule(exactRule, triedRules)
    if (student) {
      return { student, matchLevel: 'EXACT_OUTWARD', rule: exactRule }
    }
  }

  // 2. District prefix (e.g. "B") — only if different from outward
  if (parsed.district !== parsed.outward) {
    const districtRule = await findRule('POSTCODE_PREFIX', parsed.district)
    if (districtRule) {
      const student = await pickStudentFromRule(districtRule, triedRules)
      if (student) {
        return { student, matchLevel: 'DISTRICT', rule: districtRule }
      }
    }
  }

  return { student: null, matchLevel: 'NONE', rule: null }
}

/**
 * Route a lead by area type (TOWN or COUNTY).
 */
async function routeByArea(
  areaType: 'TOWN' | 'COUNTY',
  areaValue: string,
  triedRules: TriedRule[],
): Promise<{ student: Student | null; matchLevel: MatchLevel; rule: RoutingRule | null }> {
  const rule = await findRule(areaType, areaValue)
  if (rule) {
    const student = await pickStudentFromRule(rule, triedRules)
    if (student) {
      const matchLevel: MatchLevel = areaType === 'TOWN' ? 'TOWN' : 'COUNTY'
      return { student, matchLevel, rule }
    }
  }
  return { student: null, matchLevel: 'NONE', rule: null }
}

/**
 * Simple routing: returns studentId or null.
 */
export async function routeLead(postcode: string): Promise<string | null> {
  const triedRules: TriedRule[] = []
  const result = await routeByPostcode(postcode, triedRules)
  if (result.student) {
    return result.student.id
  }

  // Fallback
  const settings = await prisma.settings.findFirst()
  return settings?.fallbackStudentId || null
}

/**
 * Full routing: postcode → town → fallback.
 * Returns studentId or null.
 */
export async function routeLeadFull(
  postcode: string,
  townCity?: string,
): Promise<string | null> {
  const triedRules: TriedRule[] = []

  // 1. Try postcode routing (exact outward → district)
  const postcodeResult = await routeByPostcode(postcode, triedRules)
  if (postcodeResult.student) {
    return postcodeResult.student.id
  }

  // 2. Try town match
  if (townCity) {
    const townResult = await routeByArea('TOWN', townCity, triedRules)
    if (townResult.student) {
      return townResult.student.id
    }
  }

  // 3. Fallback
  const settings = await prisma.settings.findFirst()
  return settings?.fallbackStudentId || null
}

/**
 * Detailed routing trace — returns full info about what happened during routing.
 * Used for debugging and admin test tool.
 */
export async function testRoute(
  postcode: string,
  townCity?: string,
): Promise<RouteResult> {
  const triedRules: TriedRule[] = []

  // 1. Try postcode routing (exact outward → district)
  const postcodeResult = await routeByPostcode(postcode, triedRules)
  if (postcodeResult.student) {
    return {
      matchedRule: postcodeResult.rule,
      assignedStudent: postcodeResult.student,
      matchLevel: postcodeResult.matchLevel,
      triedRules,
    }
  }

  // 2. Try town match
  if (townCity) {
    const townResult = await routeByArea('TOWN', townCity, triedRules)
    if (townResult.student) {
      return {
        matchedRule: townResult.rule,
        assignedStudent: townResult.student,
        matchLevel: townResult.matchLevel,
        triedRules,
      }
    }
  }

  // 3. Fallback
  const settings = await prisma.settings.findFirst()
  if (settings?.fallbackStudentId) {
    const fallbackStudent = await prisma.student.findUnique({
      where: { id: settings.fallbackStudentId },
    })
    if (fallbackStudent && fallbackStudent.isActive && !fallbackStudent.isAtCapacity) {
      return {
        matchedRule: null,
        assignedStudent: fallbackStudent,
        matchLevel: 'FALLBACK',
        triedRules,
      }
    }
  }

  // 4. Nothing matched
  return {
    matchedRule: null,
    assignedStudent: null,
    matchLevel: 'NONE',
    triedRules,
  }
}
