import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            AI-powered personal styling
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            ThreadDrop
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Upload a photo of yourself and get complete outfits styled for you —
            built from real clearance, sale, and discounted items across top
            clothing stores.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white opacity-60"
              aria-disabled="true"
            >
              Get styled — coming soon
            </button>
            <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
              Sale deals live now
            </span>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <li>Photo-based outfit generation</li>
            <li>Multi-store sale aggregation</li>
            <li>Shop real discounted items</li>
          </ul>
        </div>
      </header>

      <section aria-labelledby="deals-heading">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h2
            id="deals-heading"
            className="text-sm font-semibold uppercase tracking-widest text-gray-500"
          >
            Today&apos;s deals
          </h2>
          <p className="mt-1 text-base text-gray-600">
            Browse sale and clearance picks while we build your AI stylist.
          </p>
        </div>
        <ProductGrid />
      </section>
    </div>
  );
}
