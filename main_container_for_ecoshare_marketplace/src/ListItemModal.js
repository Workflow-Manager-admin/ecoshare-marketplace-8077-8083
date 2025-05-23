import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function ListItemModal({ open, onClose, onSubmit }) {
  // Local state for form fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    isDonation: false,
  });
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      // If toggling donation, clear price
      ...(name === "isDonation" && checked ? { price: "" } : {}),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        ...form,
        price: form.isDonation ? undefined : Number(form.price) || undefined,
        id: Date.now(),
        img: "https://images.unsplash.com/photo-1526178613658-3d07e1b13149?auto=format&fit=crop&w=300&q=80", // Placeholder image
      });
      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        isDonation: false,
      });
      setSubmitted(false);
      onClose();
    }, 700);
  }

  return (
    <div className="eco-modal-backdrop" tabIndex={-1}>
      <div className="eco-modal" style={{ minWidth: 360, maxWidth: 440 }}>
        <h2 style={{ margin: "0 0 15px 0", color: "var(--kavia-dark)" }}>List an Item</h2>
        {submitted ? (
          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <span role="img" aria-label="success" style={{ fontSize: 44 }}>✅</span>
            <div style={{ marginTop: 9 }}>Item submitted!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label>
              <span>Item Name</span>
              <input
                type="text"
                name="title"
                required
                maxLength={64}
                value={form.title}
                autoFocus
                onChange={handleChange}
                placeholder="E.g. Wooden Desk"
                className="eco-input"
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                name="description"
                required
                maxLength={220}
                value={form.description}
                onChange={handleChange}
                className="eco-input"
                style={{ resize: "vertical", minHeight: 56, maxHeight: 110 }}
              />
            </label>
            <label>
              <span>Category</span>
              <input
                name="category"
                value={form.category}
                maxLength={36}
                onChange={handleChange}
                className="eco-input"
                placeholder="E.g. Furniture"
                required
              />
            </label>
            <div style={{ display: "flex", gap: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <input
                  type="checkbox"
                  name="isDonation"
                  checked={form.isDonation}
                  onChange={handleChange}
                  style={{ accentColor: "var(--kavia-orange)" }}
                />
                Donation (free)
              </label>
              <label style={{ flex: 1 }}>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  min={0}
                  step={1}
                  disabled={form.isDonation}
                  onChange={handleChange}
                  className="eco-input"
                  placeholder="Price $"
                  style={{ width: 98 }}
                  required={!form.isDonation}
                />
              </label>
            </div>
            <div>
              <div
                style={{
                  width: 68,
                  height: 48,
                  background: "#f0f1f5",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#a5a7a9",
                  marginBottom: 6,
                  marginTop: 2,
                  cursor: "not-allowed",
                  border: "1.5px dashed var(--border-color)"
                }}
                aria-label="Image upload"
                title="Image uploads coming soon"
              >
                <span role="img" aria-label="camera">📷</span>
              </div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                <i>Image upload coming soon</i>
              </span>
            </div>
            <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
              <button
                type="button"
                className="btn btn-small"
                style={{ background: "#bbb", color: "#333" }}
                onClick={onClose}
                disabled={submitted}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-small"
                style={{ flex: 1 }}
                disabled={submitted}
              >
                List Item
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ListItemModal;
