import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SYSTEM_SLUGS = [
  'admin', 'api', 'login', 'register', 'signup', 'dashboard',
  'settings', 'account', 'profile', 'help', 'support', 'contact',
  'about', 'privacy', 'terms', 'blog', 'news', 'faq',
  'sitemap', 'robots', 'favicon', 'static', 'assets', 'uploads',
  'images', 'css', 'js', 'fonts', 'media', 'download', 'downloads',
  'app', 'www', 'mail', 'email', 'status', 'health',
]

const UK_CITY_SLUGS = [
  'london', 'birmingham', 'manchester', 'leeds', 'liverpool',
  'sheffield', 'bristol', 'newcastle', 'nottingham', 'leicester',
  'coventry', 'bradford', 'cardiff', 'belfast', 'edinburgh',
  'glasgow', 'aberdeen', 'dundee', 'exeter', 'oxford',
  'cambridge', 'bath', 'york', 'chester', 'canterbury',
  'winchester', 'brighton', 'bournemouth', 'southampton', 'portsmouth',
  'plymouth', 'norwich', 'derby', 'stoke', 'wolverhampton',
  'sunderland', 'swansea', 'middlesbrough', 'hull', 'reading',
  'luton', 'milton-keynes', 'northampton', 'swindon', 'warrington',
  'huddersfield', 'slough', 'watford', 'ipswich', 'peterborough',
]

async function main() {
  console.log('Seeding database...')

  // 1. Create Settings with hashed admin password
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'admin@averyfastsale.co.uk'
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { adminPasswordHash, notifyAdminEmail: adminEmail },
    create: { adminPasswordHash, notifyAdminEmail: adminEmail },
  })
  console.log('✓ Settings created')

  // 2. Create reserved subdomains
  const allReservedSlugs = [
    ...SYSTEM_SLUGS.map(slug => ({ slug, reason: 'system' })),
    ...UK_CITY_SLUGS.map(slug => ({ slug, reason: 'uk-city' })),
  ]

  for (const { slug, reason } of allReservedSlugs) {
    await prisma.reservedSubdomain.upsert({
      where: { slug },
      update: {},
      create: { slug, reason },
    })
  }
  console.log(`✓ ${allReservedSlugs.length} reserved subdomains created`)

  // 3. Create sample students
  const students = [
    {
      slug: 'john-smith',
      displayName: 'John Smith',
      phone: '07700900001',
      email: 'john@example.com',
      bio: 'Local property specialist covering the West Midlands.',
      isActive: true,
      isAtCapacity: false,
    },
    {
      slug: 'sarah-jones',
      displayName: 'Sarah Jones',
      phone: '07700900002',
      email: 'sarah@example.com',
      bio: 'Helping homeowners in Greater Manchester sell quickly.',
      isActive: true,
      isAtCapacity: false,
    },
    {
      slug: 'mike-wilson',
      displayName: 'Mike Wilson',
      phone: '07700900003',
      email: 'mike@example.com',
      bio: 'Property solutions in the Leeds and Yorkshire area.',
      isActive: true,
      isAtCapacity: true,
    },
  ]

  const createdStudents: Record<string, number> = {}
  for (const student of students) {
    const created = await prisma.student.upsert({
      where: { slug: student.slug },
      update: student,
      create: student,
    })
    createdStudents[student.slug] = created.id
  }
  console.log('✓ 3 sample students created')

  // 4. Create routing rules
  const rules = [
    { type: 'POSTCODE_PREFIX', value: 'B1', students: [{ slug: 'john-smith', priority: 0 }] },
    { type: 'POSTCODE_PREFIX', value: 'B', students: [{ slug: 'john-smith', priority: 0 }, { slug: 'sarah-jones', priority: 1 }] },
    { type: 'POSTCODE_PREFIX', value: 'M', students: [{ slug: 'sarah-jones', priority: 0 }] },
    { type: 'POSTCODE_PREFIX', value: 'LS', students: [{ slug: 'mike-wilson', priority: 0 }] },
  ]

  for (const rule of rules) {
    const routingRule = await prisma.routingRule.upsert({
      where: { type_value: { type: rule.type, value: rule.value } },
      update: {},
      create: { type: rule.type, value: rule.value },
    })

    for (const student of rule.students) {
      const studentId = createdStudents[student.slug]
      if (studentId) {
        await prisma.routingRuleStudent.upsert({
          where: { routingRuleId_studentId: { routingRuleId: routingRule.id, studentId } },
          update: { priority: student.priority },
          create: { routingRuleId: routingRule.id, studentId, priority: student.priority },
        })
      }
    }
  }
  console.log('✓ Routing rules created')

  // 5. Create homepage CMS page
  await prisma.cmsPage.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home',
      isPublished: true,
      sections: JSON.parse(JSON.stringify([
        {
          id: 'hero',
          type: 'hero',
          content: {
            heading: 'Sell Your House Fast',
            subheading: 'Get a cash offer in 24 hours. No fees, no chains, no hassle.',
            ctaText: 'Get Your Free Offer',
          },
        },
        {
          id: 'how-it-works',
          type: 'steps',
          content: {
            heading: 'How It Works',
            steps: [
              { title: 'Tell Us About Your Property', description: 'Fill in our quick form with your property details.' },
              { title: 'Get Your Free Offer', description: 'We\'ll provide a no-obligation cash offer within 24 hours.' },
              { title: 'Complete In Days', description: 'Choose your completion date. We can complete in as little as 7 days.' },
            ],
          },
        },
        {
          id: 'benefits',
          type: 'features',
          content: {
            heading: 'Why Choose Us',
            features: [
              { title: 'No Fees', description: 'We cover all costs including legal fees.' },
              { title: 'Fast Completion', description: 'Complete in as little as 7 days.' },
              { title: 'Cash Buyer', description: 'No chains, no mortgage delays.' },
            ],
          },
        },
      ])),
    },
  })
  console.log('✓ Homepage CMS page created')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
