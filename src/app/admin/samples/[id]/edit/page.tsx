import { notFound } from "next/navigation";
import { getSample } from "@/actions/samples";
import SampleForm from "@/components/admin/SampleForm";

interface EditSamplePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSamplePage({
  params,
}: EditSamplePageProps) {
  const { id } = await params;
  const sample = await getSample(id);

  if (!sample) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">샘플 수정</h1>
      <SampleForm mode="edit" initialData={sample} />
    </div>
  );
}
