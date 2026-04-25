"use client";

import { useState } from "react";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter.actions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const result = await subscribeToNewsletterAction(email);

    if (result.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  };

  return (
    <section className="bg-[#f0ebe3] px-6 md:px-10 py-20 md:py-24 text-center">
      <h2 className="font-serif text-4xl md:text-5xl font-light text-[#2a1f18] mb-2">
        Stay in the Edit
      </h2>
      <p className="text-sm text-[#6b5d52] mb-8 font-light">
        New arrivals, exclusive offers, and style inspiration — straight to your inbox.
      </p>

      {status === "success" ? (
        <p className="text-sm text-[#2a1f18] font-light tracking-[0.05em]">
          Thank you for subscribing. ✓
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Your email address"
            className="flex-1 px-5 py-3.5 border border-[#c9bba8] bg-white text-sm text-[#2a1f18] outline-none focus:border-[#2a1f18] transition-colors font-light placeholder:text-[#a89080]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3.5 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-xs text-red-400 font-light mt-3">{message}</p>
      )}
    </section>
  );
}