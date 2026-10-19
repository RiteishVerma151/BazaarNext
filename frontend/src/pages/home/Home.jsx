import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Hero from "../../components/HomeComponents/Hero.jsx";
import CategorySection from "../../components/HomeComponents/CategorySection.jsx";
import ProductSection from "../../components/HomeComponents/ProductSection.jsx";
import HowItWorks from "../../components/HomeComponents/HowItWorks.jsx";
import SellCTA from "../../components/HomeComponents/SellCTA.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import { freshProducts, topProducts } from "../../data/products.js";

export default function Home() {
  return (
    <>
      <Navbar/>
      <main>
        <Hero />
        <CategorySection />
        <ProductSection id="products" title="Fresh near you" products={freshProducts} />
        <ProductSection id="top" title="Top selling products" products={topProducts} />
        <HowItWorks />
        <SellCTA />
      </main>
      <Footer />
    </>
  );
}
