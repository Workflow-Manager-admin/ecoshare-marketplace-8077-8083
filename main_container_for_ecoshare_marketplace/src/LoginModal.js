import React, { useState } from "react";
import "./App.css";

// Mock users for demo only:
const MOCK_USERS = [
  { username: "alice", password: "password123", name: "Alice" },
  { username: "ben", password: "donate456", name: "Ben" },
];

// PUBLIC_INTERFACE
function LoginModal({ open, onClose, onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [wrong, setWrong] = useState(false);

  if (!open) return null;

  function handleChange(e) {
    setWrong(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const user = MOCK_USERS.find(
      (u) =>
        (u.username === form.username.toLowerCase() ||
          u.name.toLowerCase() === form.username.toLowerCase()) &&
        u.password === form.password
    );
    if (user) {
      onLogin(user);
      setForm({ username: "", password: "" });
      setWrong(false);
      onClose();
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="eco-modal-backdrop" tabIndex={-1}>
      <div className="eco-modal" style={{ minWidth: 320, maxWidth: 370 }}>
        <h2 style={{ margin: "0 0 19px 0", color: "var(--kavia-dark)" }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 17 }}>
          <label>
            <span>Username</span>
            <input
              type="text"
              name="username"
              autoFocus
              autoComplete="username"
              maxLength={32}
              required
              className="eco-input"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. alice"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              maxLength={32}
              required
              className="eco-input"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
            />
          </label>
          {wrong && (
            <div style={{ color: "#cb1b1b", fontSize: 14, marginTop: -7 }}>
              Invalid credentials. Try <b>alice/password123</b> or <b>ben/donate456</b>
            </div>
          )}
          <div style={{ display: "flex", gap: 9 }}>
            <button
              type="button"
              className="btn btn-small"
              style={{ background: "#bbb", color: "#333" }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-small"
              style={{ flex: 1 }}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
