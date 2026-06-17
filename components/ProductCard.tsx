import Image from "next/image";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <a
        href={product.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[3/4] overflow-hidden bg-gray-100"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
          -{product.discountPercent}%
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600"
          >
            {product.name}
          </a>
        </h3>
        <p className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-700">
            {formatPrice(product.salePrice)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </p>
        <span className="inline-flex w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
          {product.category}
        </span>
      </div>
    </article>
  );
}
