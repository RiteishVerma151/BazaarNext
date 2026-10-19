import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../components/authentication/AuthForm.jsx";
import { useApp } from "../../context/AppContext.jsx";
import styles from "../../styles/authentication/Auth.module.css";


export default function AuthPage() {
  const { currentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.pathname === "/login" ? "login" : "register";
  const from = location.state?.from;
  const dest = from ? from.pathname + (from.search || "") : "/";

  if (currentUser) return <Navigate to={dest} replace />;

  const toggle = () =>
    navigate(mode === "login" ? "/register" : "/login", {
      replace: true,
      state: location.state,
    });

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <AuthForm key={mode} mode={mode} onToggle={toggle} />
      </div>
    </div>
  );
}