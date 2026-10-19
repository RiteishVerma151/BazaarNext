
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../lib/axios.js";




const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

// Common API function: GET, POST, PUT, DELETE sab ke liye.
async function apiRequest(endpoint, options = {}) {
  try {
    const { body, ...config } = options;

    const response = await api({
      url: endpoint,
      ...config,
      data: body ? JSON.parse(body) : undefined,
    });

    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong."
    );
  }
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [authLoading, setAuthLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState("");

  // Backend se current logged-in user check karo.
  const checkAuth = useCallback(async () => {
    try {
      // TODO: Apne backend ka current-user endpoint daalna.
      const data = await apiRequest("/auth/me");

      setCurrentUser(data.user ?? data.data?.user ?? null);
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Backend se products fetch karo.
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setError("");

    try {
      // TODO: Apne backend ka products endpoint daalna.
      const data = await apiRequest("/products");

      const list = Array.isArray(data)
        ? data
        : data.products ?? data.data?.products ?? data.data ?? [];

      setProducts(Array.isArray(list) ? list : []);

      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // Login API.
  const login = useCallback(async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const user = data.user ?? data.data?.user ?? null;

    if (user) {
      setCurrentUser(user);
    } else {
      // Agar login response user nahi deta, /auth/me se check karo.
      await checkAuth();
    }

    return { ok: true, data };
  }, [checkAuth]);

  // Registration API.
  const register = useCallback(
    async ({ name, email, phone, password }) => {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password }),
      });

      // Agar backend registration ke baad user return karta hai.
      const user = data.user ?? data.data?.user ?? null;

      if (user) {
        setCurrentUser(user);
      }

      return { ok: true, data };
    },
    []
  );

  // Logout API.
  const logout = useCallback(async () => {
    try {
      // TODO: Backend logout route ke according update karna.
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      setCurrentUser(null);
      setOrders([]);
    }
  }, []);

  // User profile backend se update karo.
  const updateUser = useCallback(async (changes) => {
    const data = await apiRequest("/auth/me", {
      method: "PUT",
      body: JSON.stringify(changes),
    });

    const updatedUser = data.user ?? data.data?.user;

    if (updatedUser) {
      setCurrentUser(updatedUser);
    }

    return updatedUser;
  }, []);

  // Initial load: login status aur products check karo.
  useEffect(() => {
    checkAuth();

    fetchProducts().catch(() => {
      // Error already fetchProducts mein set ho chuka hai.
    });
  }, [checkAuth, fetchProducts]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      authLoading,

      products,
      productsLoading,
      error,

      orders,
      setOrders,

      login,
      register,
      logout,
      checkAuth,
      fetchProducts,
      updateUser,
    }),
    [
      currentUser,
      authLoading,
      products,
      productsLoading,
      error,
      orders,
      login,
      register,
      logout,
      checkAuth,
      fetchProducts,
      updateUser,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
