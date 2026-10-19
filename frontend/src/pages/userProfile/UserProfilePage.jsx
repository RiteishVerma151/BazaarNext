import { useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProfileSidebar from "../../components/userProfile/ProfileSidebar.jsx";
import ProfileForm from "../../components/userProfile/ProfileForm.jsx";
import AddressList from "../../components/userProfile/AddressList.jsx";
import styles from "../../styles/userProfile/UserProfilePage.module.css";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          
          <div className={styles.header}>
            <h1>My Account</h1>
            <p>Manage your profile and account settings</p>
          </div>

          <div className={styles.layout}>
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className={styles.contentArea}>
              {activeTab === "profile" && <ProfileForm />}
              {activeTab === "addresses" && <AddressList />}
              
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}