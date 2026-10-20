
import { useEffect, useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProfileForm from "../../components/userProfile/ProfileForm.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/userProfile/UserProfilePage.module.css";

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setProfile(response.data.user);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your profile. Please log in again if your session has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>YOUR ACCOUNT</span>
            <h1>My Profile</h1>
            <p>Manage your personal information and account details.</p>
          </header>

          {loading ? (
            <div className={styles.statusCard}>
              <span className={styles.loader} />
              <p>Loading your profile...</p>
            </div>
          ) : error ? (
            <div className={styles.errorCard} role="alert">
              <h2>Unable to load profile</h2>
              <p>{error}</p>
              <button
                type="button"
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : profile ? (
            <div className={styles.contentArea}>
              <ProfileForm
                profile={profile}
                onProfileUpdated={setProfile}
              />
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
