import type { Product, ProductCategory } from "@/lib/types/product";

export function calculateDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function normalizeProduct(
  partial: Omit<Product, "discountPercent"> & { discountPercent?: number }
): Product {
  const discountPercent =
    partial.discountPercent ??
    calculateDiscountPercent(partial.originalPrice, partial.salePrice);

  return {
    ...partial,
    discountPercent,
  };
}

export function isSaleItem(product: Product): boolean {
  return product.salePrice < product.originalPrice && product.discountPercent > 0;
}

export function filterProducts(
  products: Product[],
  retailer?: string,
  category?: ProductCategory
): Product[] {
  return products.filter((product) => {
    if (retailer && product.brand !== retailer) return false;
    if (category && product.category !== category) return false;
    return isSaleItem(product);
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
