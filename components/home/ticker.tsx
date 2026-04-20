const ITEMS = [
  "New In",
  "Eid Collection",
  "Free Shipping PKR 3000+",
  "Lawn 2026",
  "Easy Returns",
  "Nationwide Delivery",
  "New In",
  "Eid Collection",
  "Free Shipping PKR 3000+",
  "Lawn 2026",
  "Easy Returns",
  "Nationwide Delivery",
];

export function Ticker() {
  return (
    <div className="border-y border-stone-100 py-3 overflow-hidden whitespace-nowrap">
      <div className="inline-flex gap-14 animate-ticker">
        {ITEMS.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-light">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// Add to tailwind.config.ts:
// animation: { ticker: "ticker 20s linear infinite" }
// keyframes: { ticker: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } } }