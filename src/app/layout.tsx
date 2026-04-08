import type { Metadata } from "next";
import { Space_Grotesk, Archivo } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdul Saboor | Portfolio",
  description: "Crafting modern, scalable, and responsive web apps.",
};

import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ cursor: "none" }}>
      <body
        className={`${spaceGrotesk.variable} ${archivo.variable} antialiased bg-background text-foreground`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
