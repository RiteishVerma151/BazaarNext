import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider, useApp } from "./context/AppContext.jsx";

import OffersPage from "./pages/offers/OffersPage.jsx";
import MyOffersPage from "./pages/myOffers/MyOffersPage.jsx";
import Home from "./pages/home/Home.jsx";
import AuthPage from "./pages/authentication/AuthPage.jsx";
import ProductListingPage from "./pages/productlist/ProductListingPage.jsx";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage.jsx";
import MyOrdersPage from "./pages/myOrders/MyOrdersPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import UserProfilePage from "./pages/userProfile/UserProfilePage";
import SellProductPage from "./pages/sellProduct/SellProductPage.jsx";
import MyListingsPage from "./pages/myListings/MyListingsPage.jsx";
import SalesReportPage from "./pages/salesReport/SalesReportPage.jsx";
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, authLoading, currentUser } = useApp();
  const location = useLocation();

  if (authLoading) {
    return <div>Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role-based access check
  if (allowedRoles) {
    const role = currentUser?.role?.toString().trim().toUpperCase();

    const permittedRoles = allowedRoles.map((r) =>
      r.toString().trim().toUpperCase(),
    );

    if (!role || !permittedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
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
        path="/checkout/:productId"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

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

      <Route path="/seller/dashboard" element={<SellerDashboard />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#1a2b4c",
              padding: "16px 18px",
              border: "1px solid #e5eaf2",
              borderRadius: "14px",
              boxShadow: "0 12px 35px rgba(26, 43, 76, 0.12)",
              fontSize: "14px",
              fontWeight: 500,
              maxWidth: "380px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#16a34a",
                secondary: "#ffffff",
              },
              style: {
                borderLeft: "4px solid #16a34a",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
              style: {
                borderLeft: "4px solid #dc2626",
              },
            },
            loading: {
              iconTheme: {
                primary: "#d99a22",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  );
}
