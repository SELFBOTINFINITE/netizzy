import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meu Site",
  description: "Meu primeiro site com Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}