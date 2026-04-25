"use client";

import { useTransition, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteSubscriberAction } from "@/lib/actions/newsletter.actions";
import { cn } from "@/lib/utils";

export function SubscriberActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  return (
    <button
      onClick={() => {
        if (!confirm) { setConfirm(true); return; }
        startTransition(() => deleteSubscriberAction(id));
      }}
      disabled={isPending}
      title={confirm ? "Click again to confirm" : "Remove subscriber"}
      className={cn(
        "w-7 h-7 flex items-center justify-center transition-colors disabled:opacity-50",
        confirm ? "text-red-500" : "text-stone-300 hover:text-red-400"
      )}
      onBlur={() => setConfirm(false)}
    >
      <Trash2 size={13} />
    </button>
  );
}