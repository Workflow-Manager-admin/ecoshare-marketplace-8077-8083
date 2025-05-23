import React from 'react';
import './App.css';
import EcoShareMainContainer from "./EcoShareMainContainer";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> EcoShare Marketplace
            </div>
            <button className="btn">Login</button>
          </div>
        </div>
      </nav>
      <main>
        <EcoShareMainContainer />
      </main>
    </div>
  );
}

export default App;