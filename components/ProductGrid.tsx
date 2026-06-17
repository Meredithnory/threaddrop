"use client";

import { useCallback, useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import type { Product, ProductCategory } from "@/lib/types/product";

interface ProductsResponse {
  products: Product[];
  count: number;
  source?: "api" | "mock";
  unavailable?: string[];
  error?: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [dataSource, setDataSource] = useState<"api" | "mock">("mock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (category) params.set("category", category);

    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ProductsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load products");
      }

      setProducts(data.products);
      setDataSource(data.source ?? "mock");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        productCount={products.length}
        dataSource={dataSource}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-200 bg-white"
              >
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="font-medium text-red-800">{error}</p>
            <p className="mt-2 text-sm text-red-700">
              Check your retailer API keys in <code>.env.local</code> and try
              again.
            </p>
            <button
              onClick={fetchProducts}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium text-gray-900">
              No deals found right now
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try a different category or check back — new sale drops land all
              the time.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
