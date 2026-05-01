import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";

export const metadata: Metadata = {
  title: "Queue Token – Admin Panel",
  description: "Healthcare appointment booking platform admin dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
