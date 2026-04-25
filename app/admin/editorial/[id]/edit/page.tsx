import { notFound } from "next/navigation";
import { getEditorialById } from "@/lib/services/editorial.service";
import { EditorialForm } from "@/components/admin/editorial-form";

interface EditEditorialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEditorialPage({ params }: EditEditorialPageProps) {
  const { id } = await params;
  if (id === "new") notFound();

  const editorial = await getEditorialById(id);
  if (!editorial) notFound();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">
          Editorial
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900">Edit Editorial</h1>
      </div>
      <EditorialForm editorial={editorial} />
    </div>
  );
}