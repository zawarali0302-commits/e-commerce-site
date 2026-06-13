import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });



// Reliable Unsplash image URLs (direct source links)
const imgs = {
  fashion1: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&q=80",
  fashion2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  fashion3: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=600&q=80",
  fashion4: "https://images.unsplash.com/photo-1629927607897-7c4f2e6e3a90?w=600&q=80",
  fashion5: "https://images.unsplash.com/photo-1597983073550-b9b1d4f64b35?w=600&q=80",
  fashion6: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80",
  fashion7: "https://images.unsplash.com/photo-1622122204035-4ab67b6ab5e0?w=600&q=80",
  fashion8: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
  fashion9: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
  fashion10: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
  accessory1: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
  accessory2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  accessory3: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80",
  hero1: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80",
  hero2: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
  hero3: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&q=80",
  editorial: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  cat1: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&q=80",
  cat2: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80",
  cat3: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
  cat4: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
};

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Clean existing data ───────────────────────────────────────────────────
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.editorial.deleteMany();
  await prisma.announcement.deleteMany();
  console.log("✓ Cleared existing data");

  // ─── Announcement ──────────────────────────────────────────────────────────
  await prisma.announcement.create({
    data: {
      text: "Eid Collection Now Live — Free Shipping on Orders Over PKR 3,000",
      isActive: true,
    },
  });
  console.log("✓ Announcement created");

  // ─── Hero Slides ───────────────────────────────────────────────────────────
  await prisma.heroSlide.createMany({
    data: [
      {
        title: "Where",
        titleItalic: "Silence",
        subtitle: "Meets Style",
        label: "Summer Collection 2026",
        ctaText: "Explore Collection",
        ctaHref: "/products",
        imageUrl: imgs.hero1,
        bgColor: "#f0ebe3",
        position: 0,
        isActive: true,
      },
      {
        title: "Eid Edit",
        titleItalic: "Now Live",
        label: "Ready to Wear",
        ctaText: "Shop Now",
        ctaHref: "/products?category=ready-to-wear",
        imageUrl: imgs.hero2,
        bgColor: "#2a1f18",
        position: 1,
        isActive: true,
      },
      {
        title: "Summer",
        titleItalic: "Florals",
        label: "Unstitched",
        ctaText: "Discover",
        ctaHref: "/products?category=unstitched",
        imageUrl: imgs.hero3,
        bgColor: "#e8ddd0",
        position: 2,
        isActive: true,
      },
    ],
  });
  console.log("✓ Hero slides created");

  // ─── Editorial ─────────────────────────────────────────────────────────────
  await prisma.editorial.create({
    data: {
      eyebrow: "The Edit · Summer 2026",
      title: "Dressed in",
      titleItalic: "Morning Light",
      body: "This season, we turn to the quieter hours — the soft warmth of early sun, the unhurried ritual of getting dressed with intention. Explore our curated edit of pieces made for women who move through the world with grace.",
      ctaText: "Read the Story",
      ctaHref: "/products",
      imageUrl: imgs.editorial,
      isActive: true,
    },
  });
  console.log("✓ Editorial created");

  // ─── Categories ────────────────────────────────────────────────────────────
  const readyToWear = await prisma.category.create({ data: { name: "Ready to Wear", slug: "ready-to-wear", imageUrl: imgs.cat1 } });
  const unstitched = await prisma.category.create({ data: { name: "Unstitched", slug: "unstitched", imageUrl: imgs.cat2 } });
  const accessories = await prisma.category.create({ data: { name: "Accessories", slug: "accessories", imageUrl: imgs.cat3 } });
  const luxuryPret = await prisma.category.create({ data: { name: "Luxury Pret", slug: "luxury-pret", imageUrl: imgs.cat4 } });
  console.log("✓ Categories created");

  // ─── Products ──────────────────────────────────────────────────────────────
  const products = await Promise.all([

    // ── Ready to Wear ────────────────────────────────────────────────────────
    prisma.product.create({
      data: {
        name: "Ivory Lawn Shirt",
        slug: "ivory-lawn-shirt",
        description: "A beautifully crafted ivory lawn shirt with delicate embroidery on the neckline. Perfect for casual outings and family gatherings. Made from premium quality lawn fabric that keeps you cool in the summer heat.",
        price: 4990,
        stock: 45,
        categoryId: readyToWear.id,
        isFeatured: true,
        images: [imgs.fashion1, imgs.fashion2],
      },
    }),
    prisma.product.create({
      data: {
        name: "Blush Pink Kurta",
        slug: "blush-pink-kurta",
        description: "An elegant blush pink kurta with subtle thread work and a flattering silhouette. Pair with wide-leg trousers for a modern look or traditional shalwar for a classic ensemble.",
        price: 6490,
        stock: 32,
        categoryId: readyToWear.id,
        isFeatured: true,
        images: [imgs.fashion8, imgs.fashion3],
      },
    }),
    prisma.product.create({
      data: {
        name: "Sage Green Co-ord Set",
        slug: "sage-green-coord-set",
        description: "A stunning sage green co-ord set featuring a flowy kurta and matching trousers. Adorned with subtle floral embroidery on the hem. A versatile outfit that transitions effortlessly from day to evening.",
        price: 8990,
        stock: 18,
        categoryId: readyToWear.id,
        isFeatured: false,
        images: [imgs.fashion3, imgs.fashion4],
      },
    }),
    prisma.product.create({
      data: {
        name: "Midnight Blue Formal Dress",
        slug: "midnight-blue-formal-dress",
        description: "A breathtaking midnight blue formal dress with intricate zardozi work on the bodice and hem. Perfect for weddings and formal occasions. Crafted from premium net with a silk lining.",
        price: 18500,
        stock: 8,
        categoryId: readyToWear.id,
        isFeatured: true,
        images: [imgs.fashion9, imgs.fashion10],
      },
    }),
    prisma.product.create({
      data: {
        name: "Lavender Eid Special",
        slug: "lavender-eid-special",
        description: "Celebrate Eid in style with this gorgeous lavender three-piece ensemble. Features a heavily embroidered shirt with a contrasting dupatta and matching trousers.",
        price: 12990,
        stock: 22,
        categoryId: readyToWear.id,
        isFeatured: true,
        images: [imgs.fashion5, imgs.fashion6],
      },
    }),
    prisma.product.create({
      data: {
        name: "White Casual Linen Shirt",
        slug: "white-casual-linen-shirt",
        description: "A relaxed white linen shirt perfect for everyday wear. Features a classic collar, subtle texture, and a breezy fit. Pairs beautifully with jeans or cotton trousers.",
        price: 3490,
        stock: 60,
        categoryId: readyToWear.id,
        isFeatured: false,
        images: [imgs.fashion7],
      },
    }),

    // ── Unstitched ───────────────────────────────────────────────────────────
    prisma.product.create({
      data: {
        name: "Rose Gold Embroidered 3-Piece",
        slug: "rose-gold-embroidered-3-piece",
        description: "A luxurious rose gold unstitched 3-piece suit featuring a heavily embroidered shirt fabric, printed silk dupatta, and dyed trouser fabric. Perfect for weddings and formal events.",
        price: 10990,
        stock: 35,
        categoryId: unstitched.id,
        isFeatured: true,
        images: [imgs.fashion6, imgs.fashion5],
      },
    }),
    prisma.product.create({
      data: {
        name: "Coral Summer Lawn 3-Piece",
        slug: "coral-summer-lawn-3-piece",
        description: "A vibrant coral lawn 3-piece suit with digital print shirt, embroidered chiffon dupatta, and dyed cambric trouser. Ideal for summer occasions and casual gatherings.",
        price: 5490,
        stock: 50,
        categoryId: unstitched.id,
        isFeatured: false,
        images: [imgs.fashion2, imgs.fashion1],
      },
    }),
    prisma.product.create({
      data: {
        name: "Teal Embroidered Luxury 3-Piece",
        slug: "teal-embroidered-luxury-3-piece",
        description: "An exquisite teal luxury 3-piece featuring intricate thread embroidery on premium cotton silk. Comes with a printed chiffon dupatta and trouser fabric.",
        price: 14500,
        stock: 15,
        categoryId: unstitched.id,
        isFeatured: true,
        images: [imgs.fashion10, imgs.fashion9],
      },
    }),
    prisma.product.create({
      data: {
        name: "Mint Green Printed Lawn 2-Piece",
        slug: "mint-green-printed-lawn-2-piece",
        description: "A fresh mint green digital print lawn 2-piece featuring a beautifully printed shirt and coordinated trouser fabric. Light and breathable — perfect for summer.",
        price: 3990,
        stock: 70,
        categoryId: unstitched.id,
        isFeatured: false,
        images: [imgs.fashion4],
      },
    }),

    // ── Accessories ──────────────────────────────────────────────────────────
    prisma.product.create({
      data: {
        name: "Ivory Silk Dupatta",
        slug: "ivory-silk-dupatta",
        description: "A beautifully crafted ivory silk dupatta with delicate gota work on the border. Adds an elegant finishing touch to any outfit. Can be styled in multiple ways.",
        price: 2490,
        stock: 40,
        categoryId: accessories.id,
        isFeatured: false,
        images: [imgs.accessory3],
      },
    }),
    prisma.product.create({
      data: {
        name: "Gold Kundan Earrings",
        slug: "gold-kundan-earrings",
        description: "Stunning gold-toned kundan earrings with emerald green stone accents. Handcrafted by skilled artisans. The perfect accessory to elevate your formal and festive looks.",
        price: 3200,
        stock: 25,
        categoryId: accessories.id,
        isFeatured: false,
        images: [imgs.accessory1, imgs.accessory3],
      },
    }),
    prisma.product.create({
      data: {
        name: "Embroidered Clutch Bag",
        slug: "embroidered-clutch-bag",
        description: "A gorgeous hand-embroidered clutch bag in ivory with gold thread work. Features a secure magnetic closure and a detachable chain strap. Fits essentials for evening events.",
        price: 4500,
        stock: 20,
        categoryId: accessories.id,
        isFeatured: true,
        images: [imgs.accessory2, imgs.accessory1],
      },
    }),

    // ── Luxury Pret ──────────────────────────────────────────────────────────
    prisma.product.create({
      data: {
        name: "Ruby Red Velvet Lehenga",
        slug: "ruby-red-velvet-lehenga",
        description: "A show-stopping ruby red velvet lehenga with heavy zardozi and stonework. Features a matching embroidered blouse and a net dupatta with scalloped border. The ultimate bridal statement piece.",
        price: 45000,
        stock: 5,
        categoryId: luxuryPret.id,
        isFeatured: true,
        images: [imgs.fashion9, imgs.fashion10],
      },
    }),
    prisma.product.create({
      data: {
        name: "Champagne Gharara Set",
        slug: "champagne-gharara-set",
        description: "An heirloom-quality champagne gharara set crafted from pure organza with intricate hand embroidery. The flared gharara is paired with a heavily embellished short kurta and matching dupatta.",
        price: 38000,
        stock: 4,
        categoryId: luxuryPret.id,
        isFeatured: false,
        images: [imgs.fashion7, imgs.fashion8],
      },
    }),
    prisma.product.create({
      data: {
        name: "Forest Green Sharara",
        slug: "forest-green-sharara",
        description: "A regal forest green sharara set featuring a hand-embroidered georgette kurta with mirror work and a flowy sharara. Perfect for engagement ceremonies and formal weddings.",
        price: 32000,
        stock: 6,
        categoryId: luxuryPret.id,
        isFeatured: true,
        images: [imgs.fashion5, imgs.fashion6],
      },
    }),
  ]);

  console.log(`✓ ${products.length} products created`);
  console.log("\n✅ Seeding complete!");
  console.log(`\n  • 1 announcement`);
  console.log(`  • 3 hero slides`);
  console.log(`  • 1 editorial`);
  console.log(`  • 4 categories`);
  console.log(`  • ${products.length} products`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());