import PortfolioForm from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        새 시공사례 추가
      </h1>
      <PortfolioForm mode="create" />
    </div>
  );
}
