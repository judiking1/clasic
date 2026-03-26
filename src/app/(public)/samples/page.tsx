import { getSamples } from "@/actions/samples";
import { SampleFilter } from "@/components/samples/SampleFilter";
import { SampleGrid } from "@/components/samples/SampleGrid";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "인조대리석 샘플 - 컬러·패턴 선택 가이드",
  description:
    "화이트, 베이지, 그레이 등 다양한 인조대리석 샘플을 확인해보세요. 솔리드, 무늬결, 칩 패턴별로 싱크대·세면대·카운터에 어울리는 인조대리석을 선택할 수 있습니다.",
  keywords: [
    "인조대리석 샘플",
    "인조대리석 컬러",
    "인조대리석 패턴",
    "인조대리석 종류",
    "대리석 색상",
  ],
  alternates: {
    canonical: "/samples",
  },
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
