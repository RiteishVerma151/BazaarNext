import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/userProfile/ProfileSidebar.module.css";

const USER = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  initials: "RS",
};

export default function ProfileSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    },
    {
      id: "addresses",
      label: "My Addresses",
      icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    },
    {
      id: "my-listings",
      label: "My Listings",
      icon: "M3 3h18v18H3z M8 8h8 M8 12h8 M8 16h5",
      route: "/my-listings",
    },
    {
      id: "sales-report",
      label: "Sales Report",
      icon: "M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3",
      route: "/sales-report",
    },
  ];

  const handleClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{USER.initials}</div>
        <div className={styles.userText}>
          <h3>{USER.name}</h3>
          <p>{USER.email}</p>
        </div>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.menuBtn} ${activeTab === item.id ? styles.active : ""}`}
            onClick={() => handleClick(item)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.logoutWrap}>
        <Link to="/" className={styles.logoutBtn}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log Out
        </Link>
      </div>
    </div>
  );
}