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
import ChatPage from "./pages/chat/ChatPage.jsx";
import MyListingsPage from "./pages/myListings/MyListingsPage";
import SalesReportPage from "./pages/salesReport/SalesReportPage.jsx";
import CartPage from "./pages/cart/CartPage.jsx";          
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";
import { CartProvider } from "./context/CartContext.jsx"; 



export default function App() {
  return (
     <CartProvider>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/sell" element={<SellProductPage />} />
          <Route path="/sell/:id" element={<SellProductPage/>}/>
          <Route path="/chat/:productId" element={<ChatPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/sales-report" element={<SalesReportPage />} />
          <Route path="/cart" element={<CartPage />} />      
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
    </CartProvider>
  );
}