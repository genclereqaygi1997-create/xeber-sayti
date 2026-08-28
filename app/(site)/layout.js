import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
