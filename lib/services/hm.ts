import type { Product, ProductCategory } from "@/lib/types/product";
import { normalizeProduct } from "@/lib/utils/products";

const RAPIDAPI_HOST = "hm-hennes-mauritz.p.rapidapi.com";

interface HmPrice {
  priceType?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface HmApiProduct {
  id?: string;
  productName?: string;
  brandName?: string;
  url?: string;
  prices?: HmPrice[];
  images?: { url?: string }[];
  swatches?: { productImage?: string }[];
  mainCatCode?: string;
}

interface HmListResponse {
  products?: HmApiProduct[];
  results?: HmApiProduct[];
}

const SALE_CATEGORIES: Record<ProductCategory, string> = {
  women: "ladies_sale",
  men: "men_sale",
  kids: "kids_sale",
};

function mapCategory(
  category: ProductCategory,
  mainCatCode?: string
): ProductCategory {
  const code = (mainCatCode ?? "").toLowerCase();
  if (code.includes("kid") || code.includes("baby")) return "kids";
  if (code.includes("men") || code.includes("man")) return "men";
  if (code.includes("ladies") || code.includes("women")) return "women";
  return category;
}

function extractPrices(prices: HmPrice[] = []): {
  originalPrice?: number;
  salePrice?: number;
} {
  const white = prices.find((p) => p.priceType === "whitePrice");
  const red = prices.find((p) => p.priceType === "redPrice");

  const originalPrice = white?.price ?? white?.minPrice;
  const salePrice = red?.price ?? red?.minPrice;

  return { originalPrice, salePrice };
}

function mapApiItem(
  item: HmApiProduct,
  category: ProductCategory,
  index: number
): Product | null {
  const { originalPrice, salePrice } = extractPrices(item.prices);

  if (!originalPrice || !salePrice || salePrice >= originalPrice) return null;
  if (!item.productName) return null;

  const imageUrl =
    item.images?.[0]?.url ??
    item.swatches?.[0]?.productImage ??
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600";

  return normalizeProduct({
    id: item.id ?? `hm-${category}-${index}`,
    name: item.productName,
    brand: "H&M",
    originalPrice,
    salePrice,
    imageUrl,
    productUrl: item.url ?? "https://www2.hm.com",
    category: mapCategory(category, item.mainCatCode),
  });
}

async function fetchSaleCategory(
  apiKey: string,
  category: ProductCategory
): Promise<Product[]> {
  const params = new URLSearchParams({
    categories: SALE_CATEGORIES[category],
    country: "us",
    lang: "en",
    currentpage: "0",
    pagesize: "30",
  });

  const response = await fetch(
    `https://${RAPIDAPI_HOST}/products/list?${params.toString()}`,
    {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `H&M API (${SALE_CATEGORIES[category]}) returned ${response.status}`
    );
  }

  const data = (await response.json()) as HmListResponse;
  const items = data.products ?? data.results ?? [];

  return items
    .map((item, index) => mapApiItem(item, category, index))
    .filter((item): item is Product => item !== null);
}

export const MOCK_HM_PRODUCTS: Product[] = [
  normalizeProduct({
    id: "hm-mock-1",
    name: "Ribbed Knit Cardigan",
    brand: "H&M",
    originalPrice: 39.99,
    salePrice: 24.99,
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
    productUrl: "https://www2.hm.com",
    category: "women",
  }),
  normalizeProduct({
    id: "hm-mock-2",
    name: "Regular Fit Oxford Shirt",
    brand: "H&M",
    originalPrice: 34.99,
    salePrice: 19.99,
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b56?w=600",
    productUrl: "https://www2.hm.com",
    category: "men",
  }),
  normalizeProduct({
    id: "hm-mock-3",
    name: "Kids Cotton Hoodie",
    brand: "H&M",
    originalPrice: 24.99,
    salePrice: 14.99,
    imageUrl:
      "https://images.unsplash.com/photo-1519238263530-abb2f71d436b?w=600",
    productUrl: "https://www2.hm.com",
    category: "kids",
  }),
  normalizeProduct({
    id: "hm-mock-4",
    name: "Satin Slip Dress",
    brand: "H&M",
    originalPrice: 49.99,
    salePrice: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    productUrl: "https://www2.hm.com",
    category: "women",
  }),
  normalizeProduct({
    id: "hm-mock-5",
    name: "Slim Fit Chinos",
    brand: "H&M",
    originalPrice: 29.99,
    salePrice: 17.99,
    imageUrl:
      "https://images.unsplash.com/photo-1473966968600-fa801b279a1a?w=600",
    productUrl: "https://www2.hm.com",
    category: "men",
  }),
  normalizeProduct({
    id: "hm-mock-6",
    name: "Printed Leggings",
    brand: "H&M",
    originalPrice: 14.99,
    salePrice: 7.99,
    imageUrl:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
    productUrl: "https://www2.hm.com",
    category: "kids",
  }),
];

export async function fetchHmProducts(
  category?: ProductCategory
): Promise<Product[]> {
  const apiKey = process.env.HM_API_KEY ?? process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    if (category) {
      return MOCK_HM_PRODUCTS.filter((p) => p.category === category);
    }
    return MOCK_HM_PRODUCTS;
  }

  const categoriesToFetch: ProductCategory[] = category
    ? [category]
    : ["women", "men", "kids"];

  const results = await Promise.allSettled(
    categoriesToFetch.map((cat) => fetchSaleCategory(apiKey, cat))
  );

  const products = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  if (products.length === 0) {
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => r.reason?.message ?? "Unknown error");

    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
  }

  return products;
}
