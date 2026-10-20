
import { useEffect, useState } from "react";
import api from "../../lib/axios.js";
import styles from "../../styles/userProfile/ProfileForm.module.css";

export default function ProfileForm({ profile, onProfileUpdated }) {
  const [name, setName] = useState(profile?.name || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(profile?.name || "");
    setLocation(profile?.location || "");
  }, [profile]);

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const accountType = profile?.role
    ? profile.role.charAt(0) + profile.role.slice(1).toLowerCase()
    : "User";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedLocation = location.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setError("Name must be between 2 and 50 characters.");
      return;
    }

    if (trimmedLocation.length > 150) {
      setError("Location must be 150 characters or fewer.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/users/me", {
        name: trimmedName,
        location: trimmedLocation,
      });

      onProfileUpdated?.(response.data.user);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2>My Profile</h2>
        <p>Manage your personal and account information</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <p className={styles.errorText} role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className={styles.successText} role="status">
            {success}
          </p>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            minLength={2}
            maxLength={50}
            autoComplete="name"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            type="email"
            value={profile?.email || ""}
            readOnly
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profile-role">Account Type</label>
          <input
            id="profile-role"
            type="text"
            value={accountType}
            readOnly
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profile-member-since">Member Since</label>
          <input
            id="profile-member-since"
            type="text"
            value={memberSince}
            readOnly
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profile-location">Location</label>
          <input
            id="profile-location"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. Ulhasnagar, Thane"
            maxLength={150}
            autoComplete="address-level2"
          />
          <small className={styles.fieldHint}>
            Enter your city, area, or address.
          </small>
        </div>

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
