import { EditorialForm } from "@/components/admin/editorial-form";

export default function NewEditorialPage() {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">
          Editorial
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900">New Editorial</h1>
      </div>
      <EditorialForm />
    </div>
  );
}