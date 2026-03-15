import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSamples } from "@/actions/samples";
import { SampleFilter } from "@/components/samples/SampleFilter";
import { SampleGrid } from "@/components/samples/SampleGrid";

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
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              인조대리석 샘플
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              다양한 컬러와 패턴의 인조대리석 샘플을 확인해보세요
            </p>
          </div>

          <SampleFilter currentColor={colorCategory} />

          {samples.length > 0 ? (
            <SampleGrid samples={samples} />
          ) : (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg">등록된 샘플이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
