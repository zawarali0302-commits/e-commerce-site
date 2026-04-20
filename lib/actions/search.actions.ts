"use server";

import { searchProducts } from "@/lib/services/search.service";

export async function searchAction(query: string) {
  if (!query || query.trim().length < 2) return [];
  return searchProducts(query.trim());
}