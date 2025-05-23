import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * DetailsSidebarModal - slides in from right to collect Buy/Request details, confirmation UI.
 *
 * Props:
 *   open {boolean}          // Controls display of the sidebar
 *   mode {"buy"|"request"}  // Type of action ("buy" or "request")
 *   item {Object|null}      // The listing being acted on
 *   onSubmit {fn(data)}     // Called with input data when form is submitted
 *   onClose {fn()}          // Close handler
 */
function DetailsSidebarModal({ open, mode, item, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    msg: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Reset on open/item change
  useEffect(() => {
    if (open) {
      setForm({ name: "", contact: "", msg: "" });
      setSubmitted(false);
    }
  }, [open, item]);

  if (!open || !item) return null;

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handle submit (mock update; confirmation)
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({ ...form, mode, id: item.id });
      setSubmitted(false);
    }, 650);
  }

  // Label and contextual hints
  const verb = mode === "buy" ? "Buy" : "Request";
  const itemLabel = item.title || item.name || "this item";

  return (
    <>
      <div
        className={`eco-sidebar-modal-backdrop${open ? " open" : ""}`}
        tabIndex={-1}
        aria-label="Close details form"
        onClick={onClose}
      />
      <aside
        className={`eco-sidebar-modal${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${verb} details form`}
        tabIndex={0}
      >
        <button
          type="button"
          className="sidebar-close-btn"
          aria-label="Close"
          onClick={onClose}
          disabled={submitted}
        >
          ×
        </button>
        <div className="sidebar-header">
          <h2 style={{ margin: "0 0 7px 0", fontWeight: 700, color: "var(--kavia-dark)" }}>
            {verb} <span style={{ color: "var(--kavia-orange)" }}>{itemLabel}</span>
          </h2>
          <div className="sidebar-subheader" style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {mode === "buy"
              ? "One quick step to confirm your purchase. Please provide delivery details."
              : "Request this free item. Enter your info for the donor to contact you."}
          </div>
        </div>
        <div className="sidebar-form-content">
          {submitted ? (
            <div className="sidebar-confirm">
              <span role="img" aria-label="success" style={{ fontSize: 48 }}>✅</span>
              <div style={{ marginTop: 14, fontSize: 18, color: "var(--vivid-blue)" }}>
                {mode === "buy" ? "Purchase Successful!" : "Request Submitted!"}
              </div>
              <div style={{ fontSize: 15, color: "#999", marginTop: 6 }}>
                This is a demo confirmation. The seller/donor will see your info in the future.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sidebar-form-fields" autoComplete="off" style={{display:'flex',flexDirection:'column',gap:16}}>
              <label style={{ fontWeight: 500 }}>
                <span>Your Name</span>
                <input
                  className="eco-input"
                  name="name"
                  type="text"
                  autoFocus
                  maxLength={64}
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  autoComplete="off"
                />
              </label>
              <label style={{ fontWeight: 500 }}>
                <span>Contact Info</span>
                <input
                  className="eco-input"
                  name="contact"
                  type="text"
                  value={form.contact}
                  maxLength={64}
                  onChange={handleChange}
                  required
                  placeholder="Email or phone"
                  autoComplete="off"
                />
              </label>
              <label style={{ fontWeight: 500 }}>
                <span>{mode === "buy" ? "Delivery Address" : "Message"}</span>
                <textarea
                  className="eco-input"
                  name="msg"
                  value={form.msg}
                  maxLength={220}
                  onChange={handleChange}
                  required={mode==="buy"}
                  placeholder={mode === "buy"
                    ? "Delivery address (required)"
                    : "Short message (e.g., why you need this, or pickup availability)"}
                  style={{ minHeight: 56, maxHeight: 100, resize: "vertical" }}
                />
              </label>
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
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
                  {verb}
                </button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}

export default DetailsSidebarModal;
