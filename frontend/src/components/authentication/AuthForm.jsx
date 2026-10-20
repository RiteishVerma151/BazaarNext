import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import styles from "../../styles/authentication/Auth.module.css";

export default function AuthForm({ mode, onToggle }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { login, register } = useApp();

  const [f, setF] = useState({
    name: "",
    email: "",
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

    setLoading(true);

    try {
      if (isLogin) {
        await login(f.email.trim(), f.password);
        navigate("/");
      } else {
        const result = await register({
          name: f.name.trim(),
          email: f.email.trim(),
          password: f.password,
        });

        setMessage(
          result.data?.message || "Registration successful. Please sign in."
        );

        setF({
          name: "",
          email: f.email.trim(),
          password: "",
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError("");
    setMessage("Google login will be connected after the main integration.");
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