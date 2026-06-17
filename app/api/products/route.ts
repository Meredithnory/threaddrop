import { NextRequest, NextResponse } from "next/server";
import { fetchAllProducts } from "@/lib/services";
import type { ProductCategory } from "@/lib/types/product";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: ProductCategory[] = ["men", "women", "kids"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoryParam = searchParams.get("category");

  const category =
    categoryParam && VALID_CATEGORIES.includes(categoryParam as ProductCategory)
      ? (categoryParam as ProductCategory)
      : undefined;

  if (categoryParam && !category) {
    return NextResponse.json(
      { error: "Invalid category filter" },
      { status: 400 }
    );
  }

  try {
    const { products, retailers } = await fetchAllProducts(category);

    const unavailable = retailers
      .filter((r) => r.error)
      .map((r) => r.error as string);

    return NextResponse.json({
      products,
      count: products.length,
      source: retailers[0]?.source ?? "mock",
      unavailable,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
