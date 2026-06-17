export type ProductCategory = "men" | "women" | "kids";

export type RetailerBrand = "Abercrombie & Fitch" | "Zara" | "H&M";

export interface Product {
  id: string;
  name: string;
  brand: RetailerBrand;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  imageUrl: string;
  productUrl: string;
  category: ProductCategory;
}

export interface ProductFilters {
  retailer?: string;
  category?: ProductCategory;
}

export interface RetailerFetchResult {
  products: Product[];
  source: "api" | "mock";
  error?: string;
}
