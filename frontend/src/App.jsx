import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import Home from "./pages/home/Home.jsx";
import AuthPage from "./pages/authentication/AuthPage.jsx";
import ProductListingPage from "./pages/productlist/ProductListingPage.jsx";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage.jsx";
import MyOrdersPage from "./pages/myOrders/MyOrdersPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import UserProfilePage from "./pages/userProfile/UserProfilePage";
import SellProductPage from "./pages/sellProduct/SellProductPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product-detail" element={<ProductDetailPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/sell" element={<SellProductPage />} />
          <Route path="/sell/:id" element={<SellProductPage />} /> 
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}