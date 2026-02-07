import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/sections/LeadForm'
import CTAPanel from '@/components/sections/CTAPanel'

const situations: Record<string, { title: string; heading: string; description: string; content: string; seoDescription: string }> = {
  probate: {
    title: 'Selling a Probate Property',
    heading: 'Sell Your Inherited or Probate Property Fast',
    description: 'Dealing with probate can be overwhelming. We make selling the property simple and stress-free.',
    seoDescription: 'Need to sell a probate or inherited property? Get a fast cash offer with no fees. We handle the complexity so you don\'t have to.',
    content: 'Losing a loved one is difficult enough without the added stress of managing property. Whether you\'ve inherited a house, are the executor of an estate, or are dealing with a probate property that needs selling, we can help.\n\nWe buy probate properties in any condition — no need for expensive repairs, clearing, or decorating. We can work alongside your solicitor to ensure a smooth process, and we can complete on a timeline that works for you.',
  },
  divorce: {
    title: 'Selling Due to Divorce or Separation',
    heading: 'Sell Your House Fast During Divorce or Separation',
    description: 'A quick, clean sale lets both parties move on. No drawn-out estate agent process.',
    seoDescription: 'Need to sell your house due to divorce? Get a fair cash offer and complete quickly so both parties can move on.',
    content: 'Divorce and separation are stressful enough without a property sale dragging on for months. A fast cash sale means both parties can split the proceeds and move forward with their lives.\n\nWe work discreetly and can deal with both parties\' solicitors to ensure a fair, transparent process. There are no estate agent viewings, no chains, and no uncertainty.',
  },
  arrears: {
    title: 'Selling Due to Mortgage Arrears',
    heading: 'Sell Your House Fast to Avoid Repossession',
    description: 'Behind on your mortgage? A fast sale can help you avoid repossession and protect your credit.',
    seoDescription: 'Facing mortgage arrears or repossession? Sell your house fast for cash and take control of your situation.',
    content: 'If you\'re behind on your mortgage payments, time is not on your side. A fast cash sale can help you settle your mortgage, avoid repossession, and protect your credit rating.\n\nWe understand the urgency and can move quickly — in some cases completing in as little as 7 days. We\'ll work with your lender and solicitor to make the process as smooth as possible.',
  },
  tenants: {
    title: 'Selling a Property with Tenant Issues',
    heading: 'Sell a Tenanted Property — Even with Problem Tenants',
    description: 'We buy properties with sitting tenants, problem tenants, or tenant damage.',
    seoDescription: 'Problem tenants? We buy tenanted properties as-is. Get a cash offer regardless of tenant issues.',
    content: 'Problem tenants can make selling through traditional channels nearly impossible. Whether you have non-paying tenants, property damage, or simply want to exit the rental market, we can help.\n\nWe buy tenanted properties as-is and can handle the tenant situation after purchase. No need for eviction proceedings or costly repairs before selling.',
  },
  relocating: {
    title: 'Selling Because You\'re Relocating',
    heading: 'Need to Sell Fast Because You\'re Relocating?',
    description: 'Moving for work or personal reasons? Sell your house quickly without the long wait.',
    seoDescription: 'Relocating and need to sell your house fast? Get a cash offer within 48 hours and complete on your schedule.',
    content: 'Whether you\'re moving for a new job, family reasons, or a fresh start, waiting months for a traditional sale isn\'t always an option. A cash sale gives you certainty and speed.\n\nWe can complete on your timeline — whether you need to sell in a week or a month. No chains, no fall-throughs, and no uncertainty.',
  },
  downsizing: {
    title: 'Selling to Downsize',
    heading: 'Sell Your House Fast and Downsize with Ease',
    description: 'Ready to downsize? Get a quick cash sale so you can move to your next home on your terms.',
    seoDescription: 'Downsizing your home? Get a fast cash offer with no fees and move on your own terms.',
    content: 'Downsizing should be an exciting new chapter, not a stressful ordeal. If your house is too big, too expensive to maintain, or you simply want a change, we can help you sell quickly.\n\nWith a cash sale, there\'s no chain to worry about and no uncertainty. You\'ll know exactly how much you\'re getting and when, so you can plan your next move with confidence.',
  },
  inherited: {
    title: 'Selling an Inherited Property',
    heading: 'Sell Your Inherited Property Quickly',
    description: 'Inherited a house you don\'t want or can\'t maintain? We\'ll buy it fast, in any condition.',
    seoDescription: 'Inherited a property? Sell it fast for cash with no fees. We buy houses in any condition across England and Wales.',
    content: 'Inheriting a property can come with unexpected costs and responsibilities — council tax, insurance, maintenance, and more. If you\'ve inherited a house you don\'t want to keep, we can take it off your hands quickly.\n\nWe buy inherited properties in any condition. No need for repairs, clearing, or decorating. We handle everything so you can focus on what matters.',
  },
}

export async function generateStaticParams() {
  return Object.keys(situations).map((situation) => ({ situation }))
}

export async function generateMetadata(
  props: { params: Promise<{ situation: string }> }
): Promise<Metadata> {
  const { situation } = await props.params
  const data = situations[situation]
  if (!data) return {}
  return {
    title: `${data.title} | A Very Fast Sale`,
    description: data.seoDescription,
  }
}

export default async function SituationPage(
  props: { params: Promise<{ situation: string }> }
) {
  const { situation } = await props.params
  const data = situations[situation]
  if (!data) notFound()

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-white">
              {data.heading}
            </h1>
            <p className="mt-4 text-lg text-white/80">{data.description}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-[1fr_400px]">
            <div className="prose max-w-none">
              {data.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-ink/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-[20px] bg-light-grey" />}>
                <LeadForm />
              </Suspense>
            </div>
          </div>
        </section>

        <CTAPanel />
      </main>
      <Footer />
    </>
  )
}
