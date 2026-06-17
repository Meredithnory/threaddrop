import type { Product, ProductCategory } from "@/lib/types/product";
import { normalizeProduct } from "@/lib/utils/products";

const RAPIDAPI_HOST = "zara-products.p.rapidapi.com";

interface RapidApiSaleItem {
  id?: string;
  productId?: string;
  name?: string;
  title?: string;
  originalPrice?: number;
  salePrice?: number;
  price?: number;
  oldPrice?: number;
  imageUrl?: string;
  image?: string;
  url?: string;
  productUrl?: string;
  category?: string;
  section?: string;
}

function mapCategory(raw?: string): ProductCategory {
  const value = (raw ?? "").toLowerCase();
  if (value.includes("kid") || value.includes("child")) return "kids";
  if (value.includes("man") || value.includes("men")) return "men";
  return "women";
}

function mapApiItem(item: RapidApiSaleItem, index: number): Product | null {
  const originalPrice = item.originalPrice ?? item.oldPrice;
  const salePrice = item.salePrice ?? item.price;

  if (!originalPrice || !salePrice || salePrice >= originalPrice) return null;

  const name = item.name ?? item.title;
  if (!name) return null;

  return normalizeProduct({
    id: item.id ?? item.productId ?? `zara-${index}`,
    name,
    brand: "Zara",
    originalPrice,
    salePrice,
    imageUrl:
      item.imageUrl ??
      item.image ??
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c790?w=600",
    productUrl: item.productUrl ?? item.url ?? "https://www.zara.com",
    category: mapCategory(item.category ?? item.section),
  });
}

export const MOCK_ZARA_PRODUCTS: Product[] = [
  normalizeProduct({
    id: "zara-mock-1",
    name: "Textured Oversized Blazer",
    brand: "Zara",
    originalPrice: 129.0,
    salePrice: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1594938298600-c8148c4dae35?w=600",
    productUrl: "https://www.zara.com",
    category: "women",
  }),
  normalizeProduct({
    id: "zara-mock-2",
    name: "Relaxed Fit Cargo Trousers",
    brand: "Zara",
    originalPrice: 59.9,
    salePrice: 39.99,
    imageUrl:
      "https://images.unsplash.com/photo-1624378515194-6db6121717f8?w=600",
    productUrl: "https://www.zara.com",
    category: "men",
  }),
  normalizeProduct({
    id: "zara-mock-3",
    name: "Kids Printed Sweatshirt",
    brand: "Zara",
    originalPrice: 29.9,
    salePrice: 17.99,
    imageUrl:
      "https://images.unsplash.com/photo-1503919008450-4814f7f4e609?w=600",
    productUrl: "https://www.zara.com",
    category: "kids",
  }),
];

export async function fetchZaraProducts(): Promise<Product[]> {
  const apiKey = process.env.ZARA_API_KEY ?? process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return MOCK_ZARA_PRODUCTS;
  }

  const response = await fetch(
    `https://${RAPIDAPI_HOST}/sale?country=us&limit=24`,
    {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Zara API returned ${response.status}`);
  }

  const data = (await response.json()) as {
    products?: RapidApiSaleItem[];
    data?: RapidApiSaleItem[];
  };

  const items = data.products ?? data.data ?? [];
  return items
    .map((item, index) => mapApiItem(item, index))
    .filter((item): item is Product => item !== null);
}
