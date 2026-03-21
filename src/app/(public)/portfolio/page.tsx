import { Suspense } from "react";
import { PortfolioListClient } from "@/components/portfolio/PortfolioListClient";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "시공사례",
  description: "클레식의 인조대리석 시공사례를 확인해보세요.",
};

function PortfolioSkeleton() {
  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        label="Portfolio"
        title="시공사례"
        description="정성을 다해 시공한 인조대리석 작업물을 확인해보세요"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Suspense fallback={<PortfolioSkeleton />}>
          <PortfolioListClient />
        </Suspense>
      </section>
    </main>
  );
}
