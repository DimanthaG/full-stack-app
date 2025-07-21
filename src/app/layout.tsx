import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-gray-100 text-gray-900">
        <Providers>
          <NavBar />
          <main className="p-6">{children}</main>
          <footer className="bg-white text-center text-sm border-t">
            &copy; 2025 MERN Full-Stack Tutorial
          </footer>
        </Providers>
      </body>
    </html>
  );
}
