import "./globals.css";
import { getSiteUrl, SITE_NAME } from "../lib/site";

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Son xəbərlər, təhlil və analitika`,
    template: `%s — ${SITE_NAME}`,
  },
  description: "Ölkə və dünya xəbərləri bir yerdə.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body className="bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
