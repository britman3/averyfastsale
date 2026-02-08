import { Suspense } from "react";
import type { Metadata } from "next";
import TrustBar from "@/components/sections/TrustBar";
import LeadForm from "@/components/sections/LeadForm";

export const metadata: Metadata = {
  title: "Get Your Free Cash Offer | A Very Fast Sale",
  description:
    "Fill in a few details and receive a fair, no-obligation cash offer within 24-48 hours.",
};

export default function GetOfferPage() {
  return (
    <>
      <TrustBar />
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-xl px-4 md:px-8">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-light-grey" />}>
            <LeadForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
