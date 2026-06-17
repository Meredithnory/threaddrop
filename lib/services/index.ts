import { fetchHmProducts } from "@/lib/services/hm";
import type { Product, ProductCategory, RetailerFetchResult } from "@/lib/types/product";
import { filterProducts } from "@/lib/utils/products";

export async function fetchAllProducts(category?: ProductCategory): Promise<{
  products: Product[];
  retailers: RetailerFetchResult[];
}> {
  const hasApiKey = Boolean(
    process.env.HM_API_KEY ?? process.env.RAPIDAPI_KEY
  );

  try {
    const products = await fetchHmProducts(category);

    return {
      products: filterProducts(products),
      retailers: [
        {
          products,
          source: hasApiKey ? "api" : "mock",
        },
      ],
    };
  } catch (error) {
    return {
      products: [],
      retailers: [
        {
          products: [],
          source: "api",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    };
  }
}
