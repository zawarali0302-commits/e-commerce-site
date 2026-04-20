import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eclat.pk";
const SITE_NAME = "Éclat";
const DEFAULT_DESCRIPTION =
  "Premium unstitched and ready-to-wear Pakistani fashion. Shop the latest collections from Éclat.";

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const url = `${BASE_URL}${path}`;
  const ogImage = image ?? `${BASE_URL}/og-default.jpg`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function buildProductMetadata({
  name,
  description,
  price,
  image,
  slug,
  categoryName,
}: {
  name: string;
  description: string;
  price: number;
  image?: string;
  slug: string;
  categoryName: string;
}): Metadata {
  const shortDescription = description.slice(0, 155);

  return {
    ...buildMetadata({
      title: name,
      description: shortDescription,
      image,
      path: `/product/${slug}`,
    }),
    openGraph: {
      ...buildMetadata({ title: name, description: shortDescription, image }).openGraph,
      type: "website",
    },
    other: {
      "product:price:amount": price.toString(),
      "product:price:currency": "PKR",
    },
  };
}