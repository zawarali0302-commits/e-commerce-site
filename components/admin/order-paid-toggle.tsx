"use client";

import { useTransition } from "react";
import { toggleOrderPaidAction } from "@/lib/actions/admin.actions";
import { cn } from "@/lib/utils";

export function OrderPaidToggle({ id, isPaid }: { id: string; isPaid: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleOrderPaidAction(id, !isPaid))}
      disabled={isPending}
      className={cn(
        "text-[9px] tracking-[0.12em] uppercase px-2.5 py-1.5 font-normal border transition-colors disabled:opacity-50",
        isPaid
          ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
          : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
      )}
    >
      {isPaid ? "Paid" : "COD"}
    </button>
  );
}