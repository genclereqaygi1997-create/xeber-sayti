import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Xəbər Portalı",
  description: "Son xəbərlər, təhlillər və analitika bir yerdə.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az" className={inter.variable}>
      <body className="bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
