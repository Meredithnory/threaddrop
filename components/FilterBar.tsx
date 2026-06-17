"use client";

import type { ProductCategory } from "@/lib/types/product";

export const CATEGORY_OPTIONS: { value: ProductCategory | ""; label: string }[] =
  [
    { value: "", label: "All categories" },
    { value: "women", label: "Women" },
    { value: "men", label: "Men" },
    { value: "kids", label: "Kids" },
  ];

interface FilterBarProps {
  category: ProductCategory | "";
  onCategoryChange: (value: ProductCategory | "") => void;
  productCount: number;
  dataSource?: "api" | "mock";
}

export default function FilterBar({
  category,
  onCategoryChange,
  productCount,
  dataSource,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category-filter"
            className="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as ProductCategory | "")
            }
            className="min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{productCount}</span>{" "}
            sale {productCount === 1 ? "item" : "items"}
          </p>
          {dataSource === "mock" && (
            <p className="text-xs text-amber-700">
              Showing sample deals — add your RapidAPI key to load live sale
              inventory.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
