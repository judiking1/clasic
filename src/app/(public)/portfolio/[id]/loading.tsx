export default function PortfolioDetailLoading() {
  return (
    <main className="min-h-screen bg-background pt-20 lg:pt-24">
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link skeleton */}
        <div className="mb-10 h-5 w-32 animate-pulse rounded bg-muted" />

        {/* Title skeleton */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
        </div>

        {/* Image carousel skeleton */}
        <div className="mb-12">
          <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-muted" />
        </div>

        {/* Description skeleton */}
        <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
          <div className="mb-4 h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="mb-6 h-px w-12 bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </article>
    </main>
  );
}
