import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const IMPACT_VERIFICATION_ID = "c864ff41-a166-4b3f-914b-5190ec1bee4c";

export const metadata: Metadata = {
  title: "ThreadDrop | AI Outfits from Real Store Deals",
  description:
    "Upload your photo and let AI style complete outfits from clearance and sale items across your favorite clothing stores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="impact-site-verification"
          {...{ value: IMPACT_VERIFICATION_ID }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
