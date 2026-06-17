import type { Product, ProductCategory } from "@/lib/types/product";
import { normalizeProduct } from "@/lib/utils/products";

const RAPIDAPI_HOST = "abercrombie-api.p.rapidapi.com";

interface RapidApiSaleItem {
  id?: string;
  productId?: string;
  name?: string;
  title?: string;
  originalPrice?: number;
  salePrice?: number;
  price?: number;
  compareAtPrice?: number;
  imageUrl?: string;
  image?: string;
  url?: string;
  productUrl?: string;
  category?: string;
  gender?: string;
}

function mapCategory(raw?: string): ProductCategory {
  const value = (raw ?? "").toLowerCase();
  if (value.includes("kid") || value.includes("child")) return "kids";
  if (value.includes("men") || value.includes("male")) return "men";
  return "women";
}

function mapApiItem(item: RapidApiSaleItem, index: number): Product | null {
  const originalPrice = item.originalPrice ?? item.compareAtPrice;
  const salePrice = item.salePrice ?? item.price;

  if (!originalPrice || !salePrice || salePrice >= originalPrice) return null;

  const name = item.name ?? item.title;
  if (!name) return null;

  return normalizeProduct({
    id: item.id ?? item.productId ?? `abercrombie-${index}`,
    name,
    brand: "Abercrombie & Fitch",
    originalPrice,
    salePrice,
    imageUrl:
      item.imageUrl ??
      item.image ??
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
    productUrl: item.productUrl ?? item.url ?? "https://www.abercrombie.com",
    category: mapCategory(item.category ?? item.gender),
  });
}

export const MOCK_ABERCROMBIE_PRODUCTS: Product[] = [
  normalizeProduct({
    id: "abercrombie-mock-1",
    name: "Essential Popover Hoodie",
    brand: "Abercrombie & Fitch",
    originalPrice: 79.95,
    salePrice: 49.95,
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    productUrl: "https://www.abercrombie.com",
    category: "men",
  }),
  normalizeProduct({
    id: "abercrombie-mock-2",
    name: "Curve Love High Rise Jeans",
    brand: "Abercrombie & Fitch",
    originalPrice: 99.95,
    salePrice: 69.95,
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
    productUrl: "https://www.abercrombie.com",
    category: "women",
  }),
  normalizeProduct({
    id: "abercrombie-mock-3",
    name: "Kids Logo Graphic Tee",
    brand: "Abercrombie & Fitch",
    originalPrice: 34.95,
    salePrice: 19.95,
    imageUrl:
      "https://images.unsplash.com/photo-1503341450422-f64e7241ce1e?w=600",
    productUrl: "https://www.abercrombie.com",
    category: "kids",
  }),
];

export async function fetchAbercrombieProducts(): Promise<Product[]> {
  const apiKey = process.env.ABERCROMBIE_API_KEY ?? process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return MOCK_ABERCROMBIE_PRODUCTS;
  }

  const response = await fetch(
    `https://${RAPIDAPI_HOST}/sale/clearance?country=US&limit=24`,
    {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Abercrombie API returned ${response.status}`);
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
