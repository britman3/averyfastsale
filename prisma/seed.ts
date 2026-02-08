import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

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
  const johnSmith = await prisma.student.upsert({
    where: { slug: 'john-smith' },
    update: {},
    create: {
      slug: 'john-smith',
      displayName: 'John Smith',
      phone: '07700900001',
      email: 'john@example.com',
      bio: 'Local property specialist covering the West Midlands.',
      isActive: true,
      isAtCapacity: false,
    },
  })

  const sarahJones = await prisma.student.upsert({
    where: { slug: 'sarah-jones' },
    update: {},
    create: {
      slug: 'sarah-jones',
      displayName: 'Sarah Jones',
      phone: '07700900002',
      email: 'sarah@example.com',
      bio: 'Helping homeowners in Greater Manchester sell quickly.',
      isActive: true,
      isAtCapacity: false,
    },
  })

  const mikeWilson = await prisma.student.upsert({
    where: { slug: 'mike-wilson' },
    update: {},
    create: {
      slug: 'mike-wilson',
      displayName: 'Mike Wilson',
      phone: '07700900003',
      email: 'mike@example.com',
      bio: 'Property solutions in the Leeds and Yorkshire area.',
      isActive: true,
      isAtCapacity: true,
    },
  })
  console.log('✓ 3 sample students created')

  // 3b. Create student service areas
  await prisma.studentServiceArea.createMany({
    data: [
      { studentId: johnSmith.id, areaType: 'POSTCODE_PREFIX', areaValue: 'West Midlands', priority: 0 },
      { studentId: johnSmith.id, areaType: 'TOWN', areaValue: 'Birmingham', priority: 1 },
      { studentId: johnSmith.id, areaType: 'TOWN', areaValue: 'Wolverhampton', priority: 2 },
      { studentId: sarahJones.id, areaType: 'POSTCODE_PREFIX', areaValue: 'Greater Manchester', priority: 0 },
      { studentId: sarahJones.id, areaType: 'TOWN', areaValue: 'Manchester', priority: 1 },
      { studentId: sarahJones.id, areaType: 'TOWN', areaValue: 'Salford', priority: 2 },
      { studentId: mikeWilson.id, areaType: 'POSTCODE_PREFIX', areaValue: 'West Yorkshire', priority: 0 },
      { studentId: mikeWilson.id, areaType: 'TOWN', areaValue: 'Leeds', priority: 1 },
    ],
    skipDuplicates: true,
  })
  console.log('✓ Student service areas created')

  // 4. Create routing rules with targets
  // Rule: B1 exact outward → john-smith (priority 0)
  const ruleB1 = await prisma.routingRule.create({
    data: {
      ruleType: 'POSTCODE_PREFIX',
      matchValue: 'B1',
      strategy: 'PRIORITY',
      isActive: true,
      targets: {
        create: [
          { studentId: johnSmith.id, priority: 0, isActive: true },
        ],
      },
    },
  })

  // Rule: B district → john-smith (priority 0), sarah-jones (priority 1)
  const ruleB = await prisma.routingRule.create({
    data: {
      ruleType: 'POSTCODE_PREFIX',
      matchValue: 'B',
      strategy: 'PRIORITY',
      isActive: true,
      targets: {
        create: [
          { studentId: johnSmith.id, priority: 0, isActive: true },
          { studentId: sarahJones.id, priority: 1, isActive: true },
        ],
      },
    },
  })

  // Rule: M district → sarah-jones (priority 0)
  const ruleM = await prisma.routingRule.create({
    data: {
      ruleType: 'POSTCODE_PREFIX',
      matchValue: 'M',
      strategy: 'PRIORITY',
      isActive: true,
      targets: {
        create: [
          { studentId: sarahJones.id, priority: 0, isActive: true },
        ],
      },
    },
  })

  // Rule: LS district → mike-wilson (priority 0) — but mike is at capacity
  const ruleLS = await prisma.routingRule.create({
    data: {
      ruleType: 'POSTCODE_PREFIX',
      matchValue: 'LS',
      strategy: 'PRIORITY',
      isActive: true,
      targets: {
        create: [
          { studentId: mikeWilson.id, priority: 0, isActive: true },
        ],
      },
    },
  })
  console.log('✓ Routing rules created')

  // 5. Create homepage CMS page
  const homePage = await prisma.page.upsert({
    where: { scope_slug: { scope: 'MAIN', slug: 'home' } },
    update: {},
    create: {
      scope: 'MAIN',
      slug: 'home',
      title: 'Home',
      isPublished: true,
      sections: {
        create: [
          {
            sectionType: 'HERO',
            sortOrder: 0,
            content: {
              heading: 'Sell Your House Fast',
              subheading: 'Get a cash offer in 24 hours. No fees, no chains, no hassle.',
              ctaText: 'Get Your Free Offer',
            },
          },
          {
            sectionType: 'HOW_IT_WORKS',
            sortOrder: 1,
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
            sectionType: 'CONTENT',
            sortOrder: 2,
            content: {
              heading: 'Why Choose Us',
              features: [
                { title: 'No Fees', description: 'We cover all costs including legal fees.' },
                { title: 'Fast Completion', description: 'Complete in as little as 7 days.' },
                { title: 'Cash Buyer', description: 'No chains, no mortgage delays.' },
              ],
            },
          },
        ],
      },
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
