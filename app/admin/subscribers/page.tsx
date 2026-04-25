import { getAllSubscribers, getSubscriberCount } from "@/lib/services/newsletter.service";
import { SubscriberActions } from "@/components/admin/subscriber-actions";
import { Download } from "lucide-react";

export default async function AdminSubscribersPage() {
  const [subscribers, count] = await Promise.all([
    getAllSubscribers(),
    getSubscriberCount(),
  ]);

  // Build CSV download data
  const csvData = encodeURIComponent(
    ["Email,Date Subscribed"]
      .concat(
        subscribers.map(
          (s) => `${s.email},${new Date(s.createdAt).toLocaleDateString("en-PK")}`
        )
      )
      .join("\n")
  );

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-stone-900">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-stone-400 font-light mt-1">
            {count} {count === 1 ? "subscriber" : "subscribers"}
          </p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`data:text/csv;charset=utf-8,${csvData}`}
            download="subscribers.csv"
            className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 text-[10px] tracking-[0.18em] uppercase text-stone-600 font-normal hover:border-stone-900 hover:text-stone-900 transition-colors"
          >
            <Download size={13} />
            Export CSV
          </a>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="border border-stone-100 py-20 text-center">
          <p className="text-sm text-stone-300 font-light">No subscribers yet</p>
        </div>
      ) : (
        <div className="border border-stone-100">
          <div className="grid grid-cols-[1fr_180px_60px] gap-4 px-5 py-3 border-b border-stone-100 bg-stone-50">
            {["Email", "Subscribed", ""].map((h) => (
              <p key={h} className="text-[9px] tracking-[0.18em] uppercase text-stone-400 font-medium">
                {h}
              </p>
            ))}
          </div>
          <div className="divide-y divide-stone-100">
            {subscribers.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[1fr_180px_60px] gap-4 px-5 py-3.5 items-center hover:bg-stone-50 transition-colors"
              >
                <p className="text-sm text-stone-900 font-light">{s.email}</p>
                <p className="text-xs text-stone-400 font-light">
                  {new Date(s.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <SubscriberActions id={s.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}