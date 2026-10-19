import { useState } from "react";
import styles from "../../styles/userProfile/AddressList.module.css";

const INITIAL_ADDRESSES = [
  {
    id: 1,
    type: "Home",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "Flat 402, Sai Residency, Near Railway Station",
    city: "Ulhasnagar",
    state: "Maharashtra",
    pincode: "421001",
    isDefault: true,
  },
];

const EMPTY_FORM = {
  type: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressList() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleOpenAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Edit case
      setAddresses(prev => prev.map(a => {
        if (a.id === editingId) return { ...formData, id: editingId };
        if (formData.isDefault) return { ...a, isDefault: false };
        return a;
      }));
    } else {
      // Add case
      const newAddress = { ...formData, id: Date.now() };
      if (addresses.length === 0 || newAddress.isDefault) {
        newAddress.isDefault = true;
        setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newAddress]);
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
    }
    
    setIsFormOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>My Addresses</h2>
          <p>Manage your delivery locations</p>
        </div>
        {!isFormOpen && (
          <button className={styles.addBtn} onClick={handleOpenAdd}>
            + Add New Address
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>
            <button className={styles.closeBtn} onClick={() => setIsFormOpen(false)}>✕</button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Address (House No, Street, Area)</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className={styles.rowThree}>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Address Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.checkboxGroup}>
                <label>
                  <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} />
                  Set as default address
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                {editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      ) : addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No addresses saved yet. Add one to get started.</p>
        </div>
      ) : (
        <div className={styles.addressGrid}>
          {addresses.map((addr) => (
            <div key={addr.id} className={`${styles.addressCard} ${addr.isDefault ? styles.defaultCard : ""}`}>
              {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
              
              <div className={styles.cardTop}>
                <h4>{addr.type}</h4>
              </div>
              
              <div className={styles.addressDetails}>
                <strong>{addr.name}</strong>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className={styles.phone}>Phone: {addr.phone}</p>
              </div>

              <div className={styles.cardActions}>
                <button onClick={() => handleOpenEdit(addr)} className={styles.editBtn}>Edit</button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className={styles.defaultBtn}>Set Default</button>
                )}
                <button onClick={() => handleDelete(addr.id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}