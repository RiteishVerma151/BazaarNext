import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/authentication/Auth.module.css";

// TODO: Backend ready hone par sirf ye API URLs change karna.
const API_URLS = {
  login: "http://localhost:5000/api/auth/login",
  register: "http://localhost:5000/api/auth/register",
};

export default function AuthForm({ mode, onToggle }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();

  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setF((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!f.email.trim() || !f.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isLogin && !f.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!isLogin && !/^\d{10}$/.test(f.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin
        ? API_URLS.login
        : API_URLS.register;

      const payload = isLogin
        ? {
            email: f.email.trim(),
            password: f.password,
          }
        : {
            name: f.name.trim(),
            email: f.email.trim(),
            phone: f.phone.trim(),
            password: f.password,
          };

      // POST request: form data backend ko bhejo.
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Backend ka JSON response read karo.
      const data = await response.json();

      // API error ko UI par show karo.
      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Something went wrong."
        );
      }

      setMessage(
        data.message ||
          (isLogin
            ? "Login successful!"
            : "Registration successful!")
      );

      // TODO: Agar backend token return karta hai, toh apne
      // authentication setup ke according securely handle karna.
      // Login state ko baad mein Context/AuthProvider mein update karna.

      // Successful action ke baad redirect.
      // Backend ke response ke according route change kar sakti ho.
      if (isLogin) {
        navigate("/");
      } else {
        setF({
          name: "",
          email: "",
          phone: "",
          password: "",
        });
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // TODO: Google OAuth provider/backend endpoint yahan connect karna.
    setError("");
    setMessage("Google login is not connected yet.");
  };

  return (
    <section className={styles.authCard}>
      <div className={styles.authBrand}>
        <div className={styles.authBrandIcon}>B</div>
        <span>BazaarNext</span>
      </div>

      <div className={styles.authHeading}>
        <h1>{isLogin ? "Welcome back!" : "Create your account"}</h1>

        <p className={styles.authSub}>
          {isLogin
            ? "Sign in and get back to great deals."
            : "Buy and sell easily in your neighbourhood."}
        </p>
      </div>

      <form onSubmit={submit} className={styles.authForm} noValidate>
        {!isLogin && (
          <>
            <div className={styles.field}>
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                value={f.name}
                onChange={set("name")}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="auth-phone">Phone number</label>
              <input
                id="auth-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={f.phone}
                onChange={set("phone")}
                placeholder="10-digit phone number"
                autoComplete="tel"
                required
              />
            </div>
          </>
        )}

        <div className={styles.field}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            value={f.email}
            onChange={set("email")}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={f.password}
            onChange={set("password")}
            placeholder="Enter your password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
        </div>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}

        <button
          className={`btn btn-primary ${styles.btnBlock} ${styles.authSubmit}`}
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isLogin
              ? "Sign In →"
              : "Create Account →"}
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          type="button"
          className={`btn btn-ghost ${styles.btnBlock} ${styles.authGoogle}`}
          onClick={handleGoogle}
          disabled={loading}
        >
          <span className={styles.googleG}>G</span>
          Continue with Google
        </button>

        <div className={styles.authSwitch}>
          <span>
            {isLogin
              ? "New to BazaarNext?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            className={styles.authSwitchBtn}
            onClick={onToggle}
            disabled={loading}
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </div>
      </form>
    </section>
  );
}
