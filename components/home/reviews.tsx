const REVIEWS = [
  {
    text: "The fabric quality is just remarkable. I've been shopping here for two seasons and each piece feels more considered than the last.",
    author: "Aisha K., Lahore",
  },
  {
    text: "Ordered the Eid collection and it arrived beautifully packaged. The fit was perfect and the colour exactly as shown.",
    author: "Sana R., Karachi",
  },
  {
    text: "Finally, a Pakistani brand that feels truly premium online. The experience from browsing to delivery was flawless.",
    author: "Maryam T., Islamabad",
  },
];
 
export function Reviews() {
  return (
    <section className="bg-[#2a1f18] px-6 md:px-10 py-16 md:py-20">
      <h2 className="font-serif text-4xl md:text-5xl font-light text-[#f0ebe3] leading-[1.1]">
        What Our <em className="text-[#c9bba8]">Customers</em> Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {REVIEWS.map((r) => (
          <div
            key={r.author}
            className="bg-white/5 p-7 border border-white/5"
          >
            <p className="text-[#c9bba8] text-xs tracking-[4px] mb-4">★ ★ ★ ★ ★</p>
            <p className="font-serif text-lg font-light text-[#e8ddd0] leading-[1.65] mb-4 italic">
              "{r.text}"
            </p>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#8a7a6e]">
              — {r.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}