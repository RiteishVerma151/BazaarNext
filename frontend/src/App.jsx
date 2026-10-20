import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import OffersPage from "./pages/offers/OffersPage.jsx";
import MyOffersPage from "./pages/myOffers/MyOffersPage.jsx";

import Home from "./pages/home/Home.jsx";
import AuthPage from "./pages/authentication/AuthPage.jsx";
import ProductListingPage from "./pages/productlist/ProductListingPage.jsx";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage.jsx";
import MyOrdersPage from "./pages/myOrders/MyOrdersPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import UserProfilePage from "./pages/userProfile/UserProfilePage";
import SellProductPage from "./pages/sellProduct/SellProductPage";
import MyListingsPage from "./pages/myListings/MyListingsPage.jsx";
import SalesReportPage from "./pages/salesReport/SalesReportPage.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return <div>Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellProductPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/:id"
        element={
          <ProtectedRoute>
            <SellProductPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-listings"
        element={
          <ProtectedRoute>
            <MyListingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales-report"
        element={
          <ProtectedRoute>
            <SalesReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <OffersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-offers"
        element={
          <ProtectedRoute>
            <MyOffersPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </CartProvider>
  );
}
