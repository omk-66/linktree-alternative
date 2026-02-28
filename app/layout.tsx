import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkTree Clone - Your All-in-One Link Page",
  description: "Create your own link-in-bio page with customizable themes, links, and social media icons.",
  keywords: ["linktree", "link in bio", "social links", "personal page"],
  authors: [{ name: "LinkTree Clone" }],
  openGraph: {
    title: "LinkTree Clone - Your All-in-One Link Page",
    description: "Create your own link-in-bio page with customizable themes, links, and social media icons.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-black">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
