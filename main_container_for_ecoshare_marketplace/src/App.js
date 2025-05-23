import React, { useState } from 'react';
import './App.css';
import EcoShareMainContainer from "./EcoShareMainContainer";
import LoginModal from "./LoginModal";

// PUBLIC_INTERFACE
function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Inline SVG for shopping cart icon ensures vector & scalability without extra dependencies
  const cartSvg = (
    <svg
      className="logo-symbol"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Shopping cart"
      style={{ verticalAlign: "middle", display: "inline-block" }}
    >
      <rect x="2.5" y="7" width="21" height="13" rx="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      <circle cx="8.25" cy="22.5" r="1.8" fill="currentColor"/>
      <circle cx="19.25" cy="22.5" r="1.8" fill="currentColor"/>
      <path d="M5 11L6.2 17.9C6.42 19.06 7.39 19.96 8.61 19.96H17.89C19.11 19.96 20.08 19.06 20.3 17.9L21.5 11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  );

  function handleLogout() {
    setUser(null);
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="logo">
              {cartSvg}
              EcoShare
            </div>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#2176FF", fontWeight: 600 }}>Hi, {user.name}</span>
                <button
                  className="btn btn-small"
                  style={{ fontSize: "1rem", background: "#bbb", color: "#222" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="btn btn-small"
                style={{ fontSize: "1rem" }}
                onClick={() => setLoginOpen(true)}
                data-testid="login-btn"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <main>
        <EcoShareMainContainer loggedInUser={user} />
      </main>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={setUser}
      />
    </div>
  );
}

export default App;