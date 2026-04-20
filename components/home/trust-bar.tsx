export function TrustBar() {
  const items = [
    {
      icon: "✦",
      title: "Free Shipping",
      desc: "On all orders above PKR 3,000 nationwide",
    },
    {
      icon: "◈",
      title: "Easy Returns",
      desc: "7-day hassle-free return policy",
    },
    {
      icon: "◉",
      title: "Secure Payment",
      desc: "Easypaisa, JazzCash, card & COD",
    },
    {
      icon: "✧",
      title: "Authentic Quality",
      desc: "Premium fabrics, thoughtfully crafted",
    },
  ];
 
  return (
    <div className="border-y border-stone-100 bg-stone-50 px-6 md:px-10 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.title} className="text-center">
            <div className="text-lg text-stone-400 mb-2.5">{item.icon}</div>
            <p className="text-[10px] tracking-[0.18em] uppercase font-medium text-stone-900 mb-1">
              {item.title}
            </p>
            <p className="text-[11px] text-stone-400 font-light leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}