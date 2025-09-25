import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-layout">
      <header className="header">
        {/* Logo in alto */}
        <img
          src="/miofarmo_logo_placeholder.png"
          alt="Logo MioFarmo"
          className="header-logo"
        />
        <h1 className="header-title">FarMio</h1>
        <nav className="nav-menu">
          <a href="/dashboard">Dashboard</a>
          <a href="/farmaci">Farmaci</a>
          <a href="/rifornimenti">Rifornimenti</a>
          <a href="/report">Report</a>
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        {/* Logo nel footer */}
        <img
          src="/your_brand_placeholder.png"
          alt="Logo NabhaWorks"
          className="footer-logo"
        />
      </footer>
    </div>
  );
}
