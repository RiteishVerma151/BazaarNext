import styles from "../../styles/userProfile/ProfileForm.module.css";

export default function ProfileForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved successfully! (Backend integration pending)");
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2>Personal Information</h2>
        <p>Update your basic account details</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" defaultValue="Rahul Sharma" placeholder="Enter your name" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input type="tel" defaultValue="+91 98765 43210" placeholder="Enter phone number" required />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input type="email" defaultValue="rahul.sharma@example.com" placeholder="Enter email" required />
        </div>


        <div className={styles.formFooter}>
          <button type="submit" className={styles.saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>
  );
}