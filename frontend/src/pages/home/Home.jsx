import { useEffect, useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Hero from "../../components/HomeComponents/Hero.jsx";
import CategorySection from "../../components/HomeComponents/CategorySection.jsx";
import ProductSection from "../../components/HomeComponents/ProductSection.jsx";
import HowItWorks from "../../components/HomeComponents/HowItWorks.jsx";
import SellCTA from "../../components/HomeComponents/SellCTA.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import { useApp } from "../../context/AppContext.jsx";
import api from "../../lib/axios.js";

export default function Home() {
  const { products, productsLoading } = useApp();
  const [topProducts, setTopProducts] = useState([]);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchTopProducts() {
      try {
        const response = await api.get("/products/top-selling");
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data.products ??
            data.data?.products ??
            data.data ??
            [];

        if (active) {
          setTopProducts(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        if (active) {
          setTopProducts([]);
        }
      } finally {
        if (active) {
          setTopLoading(false);
        }
      }
    }

    fetchTopProducts();

    return () => {
      active = false;
    };
  }, []);

  const freshProducts = products.filter(
    (product) => product.status !== "SOLD" && product.status !== "REMOVED"
  );

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <CategorySection />

        <ProductSection
          id="products"
          title="Fresh near you"
          products={freshProducts}
          loading={productsLoading}
        />

        <ProductSection
          id="top"
          title="Top selling products"
          products={topProducts}
          loading={topLoading}
        />

        <HowItWorks />
        <SellCTA />
      </main>

      <Footer />
    </>
  );
}