import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ЧЕРТА — барбершоп для своих",
  description: "Выберите барбершоп, услуги и время для визита. Хорошая стрижка начинается с записи.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}<SiteFooter /></body>
    </html>
  );
}
