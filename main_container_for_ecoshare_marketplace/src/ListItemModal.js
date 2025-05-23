import React, { useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * ListItemModal - Modal dialog for listing an item, now with image upload and preview support.
 */
function ListItemModal({ open, onClose, onSubmit }) {
  // Local state for form fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    isDonation: false,
  });
  const [imageFile, setImageFile] = useState(null); // actual File object
  const [imageDataUrl, setImageDataUrl] = useState(""); // base64 for preview/submit
  const [imageError, setImageError] = useState(""); // UI feedback for invalid images
  const [submitted, setSubmitted] = useState(false);

  // To manually clear input value when image is removed
  const imageInputRef = React.useRef();

  // Reset form and image on modal close/open toggle
  React.useEffect(() => {
    if (open) {
      setImageFile(null);
      setImageDataUrl("");
      setImageError("");
      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        isDonation: false,
      });
      setSubmitted(false);
    }
    // eslint-disable-next-line
  }, [open]);

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

  // PUBLIC_INTERFACE
  function handleImageChange(e) {
    setImageError("");
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImageDataUrl("");
      return;
    }
    // Only allow image files under 4MB
    if (!file.type.startsWith("image/")) {
      setImageFile(null);
      setImageDataUrl("");
      setImageError("File is not an image");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setImageFile(null);
      setImageDataUrl("");
      setImageError("Image must be less than 4MB");
      return;
    }
    setImageFile(file);

    // Read as dataURL for preview
    const reader = new window.FileReader();
    reader.onload = (loadEvt) => {
      setImageDataUrl(loadEvt.target.result);
    };
    reader.readAsDataURL(file);
  }

  // PUBLIC_INTERFACE
  function handleRemoveImage(e) {
    e.preventDefault();
    setImageFile(null);
    setImageDataUrl("");
    setImageError("");
    // Clear the file input value (need to trigger new selection for same file)
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        ...form,
        price: form.isDonation ? undefined : Number(form.price) || undefined,
        id: Date.now(),
        img: imageDataUrl ||
          "https://images.unsplash.com/photo-1526178613658-3d07e1b13149?auto=format&fit=crop&w=300&q=80", // Fallback
      });
      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        isDonation: false,
      });
      setImageFile(null);
      setImageDataUrl("");
      setImageError("");
      setSubmitted(false);
      onClose();
    }, 700);
  }

  // To manually clear input value when image is removed
  // const imageInputRef = React.useRef();

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

            {/* Image upload with preview */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                Item Image&nbsp;
                <span style={{ color: "#aaa", fontWeight: 400, fontSize: 13 }}>
                  (optional&nbsp;—&nbsp;max 4MB)
                </span>
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 2,
              }}>
                {imageDataUrl ? (
                  <div style={{
                    width: 64, height: 48,
                    borderRadius: 9,
                    overflow: "hidden",
                    border: "1.5px solid var(--border-color)",
                    background: "#f8f8f8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img
                      src={imageDataUrl}
                      alt="Preview"
                      style={{
                        display: "block",
                        width: "100%", height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: 64, height: 48,
                    borderRadius: 9,
                    background: "#f0f1f5",
                    border: "1.5px dashed var(--border-color)",
                    color: "#a5a7a9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    <span role="img" aria-label="camera">📷</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  aria-label="Choose item image"
                  tabIndex={-1}
                />
                <button
                  type="button"
                  className="btn btn-small"
                  style={{
                    padding: "6px 16px",
                    fontSize: 15,
                    border: "1.1px solid #c2c6cf",
                    background: "var(--vivid-blue)",
                    color: "#fff",
                  }}
                  onClick={() => {
                    if (imageInputRef.current) {
                      imageInputRef.current.click();
                    }
                  }}
                  disabled={submitted}
                >
                  {imageDataUrl ? "Change" : "Upload"}
                </button>
                {imageDataUrl && (
                  <button
                    type="button"
                    className="btn btn-small"
                    style={{
                      background: "#bbb", color: "#333",
                      marginLeft: 0,
                      padding: "6px 12px",
                      fontSize: 14,
                    }}
                    onClick={handleRemoveImage}
                    aria-label="Remove image"
                    disabled={submitted}
                  >Remove</button>
                )}
              </div>
              {imageError && (
                <div style={{ color: "#c0373d", fontSize: 13, marginTop: 2 }}>{imageError}</div>
              )}
              {!imageDataUrl && (
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  <i>JPG, PNG, and GIF are supported. For best results, use 4:3 landscape images.</i>
                </span>
              )}
            </div>
            {/* End image upload */}

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
