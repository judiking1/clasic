import { notFound } from "next/navigation";
import { getPortfolio } from "@/actions/portfolio";
import PortfolioForm from "@/components/admin/PortfolioForm";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">시공사례 수정</h1>
      <PortfolioForm mode="edit" initialData={portfolio} />
    </div>
  );
}
