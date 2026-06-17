# ThreadDrop

ThreadDrop is an AI-powered personal stylist that builds complete outfits from real clearance, sale, and discounted items across top clothing stores. Upload a photo of yourself and get looks styled for you — every piece shoppable at a deal.

## Vision

- **AI outfit generation** — upload your photo and receive styled looks tailored to you
- **Multi-store sale aggregation** — pull discounted inventory from retailers like H&M, Zara, and Abercrombie & Fitch
- **Shop real deals** — every outfit is built from items you can actually buy on sale

## Current status

The sale deals feed is live. AI styling and photo upload are coming next.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API routes
- **Data:** Retailer APIs via RapidAPI (H&M live; Zara and Abercrombie wired for expansion)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Subscribe to retailer APIs on RapidAPI, then add your key:

```
RAPIDAPI_KEY=your_key_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a key, the app shows sample sale data.

## H&M API setup

1. Create a free [RapidAPI account](https://rapidapi.com)
2. Open [HM - Hennes Mauritz](https://rapidapi.com/apidojo/api/hm-hennes-mauritz)
3. Go to **Pricing** → subscribe to **Basic** (free tier)
4. Copy your **Application Key** from [Developer Security](https://rapidapi.com/developer/security)
5. Paste it into `.env.local` as `RAPIDAPI_KEY`
6. Restart the dev server

## Project Structure

```
/app
  /page.tsx              → landing + sale deals feed
  /api/products/route.ts → sale inventory API
/lib
  /services/             → retailer adapters (H&M, Zara, Abercrombie)
  /types/product.ts      → shared Product type
/components
  /ProductCard.tsx       → image, name, prices, discount badge
  /FilterBar.tsx         → category filter (women / men / kids)
```

## Features

- Sale and clearance items from connected retailers
- Product image, name, original price, sale price, discount %
- Filter by category (women, men, kids)
- Responsive image grid layout
- API keys kept server-side only
- Mock data fallback when no key is configured
