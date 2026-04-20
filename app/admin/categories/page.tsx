import { CategoryActions, CategoryForm } from "@/components/admin/category-form";
import { getAdminCategories } from "@/lib/services/admin.service";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">Categories</h1>
        <p className="text-sm text-stone-400 font-light mt-1">
          {categories.length} total
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Category list */}
        <div className="lg:col-span-2 border border-stone-100">
          <div className="grid grid-cols-[2fr_1fr_80px] gap-4 px-5 py-3 border-b border-stone-100 bg-stone-50">
            {["Name", "Products", ""].map((h) => (
              <p
                key={h}
                className="text-[9px] tracking-[0.18em] uppercase text-stone-400 font-medium"
              >
                {h}
              </p>
            ))}
          </div>

          {categories.length === 0 ? (
            <p className="text-sm text-stone-300 font-light text-center py-12">
              No categories yet
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="grid grid-cols-[2fr_1fr_80px] gap-4 px-5 py-3.5 items-center hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-normal text-stone-900">{cat.name}</p>
                    <p className="text-[10px] text-stone-400 font-light mt-0.5">
                      /{cat.slug}
                    </p>
                  </div>
                  <p className="text-sm text-stone-500 font-light">
                    {cat.productCount}
                  </p>
                  <CategoryActions category={cat} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create form */}
        <div className="border border-stone-100 p-6">
          <h2 className="text-[10px] tracking-[0.18em] uppercase text-stone-700 font-medium mb-5">
            New Category
          </h2>
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}