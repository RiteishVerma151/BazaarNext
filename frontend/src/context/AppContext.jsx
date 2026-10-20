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
        "Something went wrong.",
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

  const checkAuth = useCallback(async () => {
    try {
      const data = await apiRequest("/users/me");

      setCurrentUser(data.user ?? data.data?.user ?? data);
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setError("");

    try {
      const data = await apiRequest("/products");

      const list = Array.isArray(data)
        ? data
        : (data.products ?? data.data?.products ?? data.data ?? []);

      setProducts(Array.isArray(list) ? list : []);

      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const user = data.user ?? data.data?.user ?? null;

      if (user) {
        setCurrentUser(user);
      } else {
        await checkAuth();
      }

      return { ok: true, data };
    },
    [checkAuth],
  );

  const register = useCallback(async ({ name, email, password, location }) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        ...(location ? { location } : {}),
      }),
    });

    const user = data.user ?? data.data?.user ?? null;

    if (user) {
      setCurrentUser(user);
    }

    return { ok: true, data };
  }, []);

const logout = useCallback(async () => {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    setCurrentUser(null);
    setOrders([]);
  }
}, []);

  const updateUser = useCallback(async (changes) => {
    const data = await apiRequest("/users/me", {
      method: "PUT",
      body: JSON.stringify(changes),
    });

    const updatedUser = data.user ?? data.data?.user;

    if (updatedUser) {
      setCurrentUser(updatedUser);
    }

    return updatedUser;
  }, []);

  useEffect(() => {
    checkAuth();

    fetchProducts().catch(() => {});
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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
