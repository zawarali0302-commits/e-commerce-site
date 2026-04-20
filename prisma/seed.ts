import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up in dependency order
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Seed Categories
  const laptops = await prisma.category.create({
    data: { name: "Laptops", slug: "laptops" },
  });
  const phones = await prisma.category.create({
    data: { name: "Phones", slug: "phones" },
  });
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories" },
  });

  // Seed Products
const probook = await prisma.product.create({
  data: {
    name: "ProBook 15",
    slug: "probook-15",
    description: "A powerful 15-inch laptop for professionals.",
    price: 1299.99,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    ],
    isFeatured: true,
    isArchived: false,
    categoryId: laptops.id,
  },
});

const ultraphone = await prisma.product.create({
  data: {
    name: "UltraPhone X",
    slug: "ultraphone-x",
    description: "Flagship smartphone with cutting-edge features.",
    price: 999.99,
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
    ],
    isFeatured: true,
    isArchived: false,
    categoryId: phones.id,
  },
});

const headphones = await prisma.product.create({
  data: {
    name: "SoundMax Pro",
    slug: "soundmax-pro",
    description: "Noise-cancelling wireless headphones.",
    price: 249.99,
    stock: 200,
    images: [
      "https://images.unsplash.com/photo-1518441902110-72a5be62c3a0?w=1200&q=80",
    ],
    isFeatured: false,
    isArchived: false,
    categoryId: accessories.id,
  },
});

  // Seed Users
  await prisma.user.create({
    data: {
      externalId: "user_3C4ci1sKcqNQ99LvpC0JRPtb83l",
      email: "zawarali0302@gmail.com",
      name: "Zawar Ali",
      role: "ADMIN",
    },
  });


  const admin = await prisma.user.create({
    data: {
      externalId: "clerk_admin_001",
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const alice = await prisma.user.create({
    data: {
      externalId: "clerk_customer_001",
      email: "alice@example.com",
      name: "Alice Johnson",
      role: "CUSTOMER",
    },
  });

  const bob = await prisma.user.create({
    data: {
      externalId: "clerk_customer_002",
      email: "bob@example.com",
      name: "Bob Smith",
      role: "CUSTOMER",
    },
  });

  // Seed Orders
  await prisma.order.create({
    data: {
      userId: alice.id,
      isPaid: true,
      phone: "+1234567890",
      address: "123 Main St, Springfield",
      totalAmount: 1299.99,
      orderItems: {
        create: [
          {
            productId: probook.id,
            quantity: 1,
            priceAtPurchase: 1299.99,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: bob.id,
      isPaid: false,
      phone: "+0987654321",
      address: "456 Elm St, Shelbyville",
      totalAmount: 1249.98,
      orderItems: {
        create: [
          {
            productId: ultraphone.id,
            quantity: 1,
            priceAtPurchase: 999.99,
          },
          {
            productId: headphones.id,
            quantity: 1,
            priceAtPurchase: 249.99,
          },
        ],
      },
    },
  });

  // Seed Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Excellent laptop, very fast and reliable!",
      productId: probook.id,
      userId: alice.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: "Great phone, battery life could be better.",
      productId: ultraphone.id,
      userId: bob.id,
    },
  });

  // Seed Wishlists
  await prisma.wishlist.create({
    data: {
      userId: alice.id,
      products: {
        connect: [{ id: ultraphone.id }, { id: headphones.id }],
      },
    },
  });

  await prisma.wishlist.create({
    data: {
      userId: bob.id,
      products: {
        connect: [{ id: probook.id }],
      },
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
