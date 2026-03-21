import { getSamples } from "@/actions/samples";
import { SampleFilter } from "@/components/samples/SampleFilter";
import { SampleGrid } from "@/components/samples/SampleGrid";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "인조대리석 샘플",
  description: "다양한 인조대리석 샘플을 확인하고 원하는 컬러와 패턴을 선택해보세요.",
};

export default async function SamplesPage({
  searchParams,
}: {
  searchParams: Promise<{ color?: string }>;
}) {
  const params = await searchParams;
  const colorCategory = params.color || "all";
  const samples = await getSamples(
    colorCategory !== "all" ? { colorCategory } : undefined
  );

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        label="Samples"
        title="인조대리석 샘플"
        description="다양한 컬러와 패턴의 인조대리석 샘플을 확인해보세요"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SampleFilter currentColor={colorCategory} />

        {samples.length > 0 ? (
          <SampleGrid samples={samples} />
        ) : (
          <div className="py-20 text-center text-secondary">
            <p className="text-lg">등록된 샘플이 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}
