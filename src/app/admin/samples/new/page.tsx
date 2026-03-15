import SampleForm from "@/components/admin/SampleForm";

export default function NewSamplePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">새 샘플 추가</h1>
      <SampleForm mode="create" />
    </div>
  );
}
