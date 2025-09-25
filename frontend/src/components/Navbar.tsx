import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#111",
        color: "#FFD700",
        padding: "8px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: "bold",
      }}
    >
      {/* Logo a sinistra */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Image
          src="/miofarmo_logo_placeholder.png"
          alt="Logo MioFarmo"
          width={40}
          height={40}
          priority
        />
        <Link
          href="/"
          style={{ color: "#FFD700", textDecoration: "none", fontSize: 24 }}
        >
          MioFarmo
        </Link>
      </div>

      {/* Menu di navigazione centrale */}
      <div style={{ display: "flex", gap: 24 }}>
        <Link href="/farmaci" style={{ color: "#FFD700", textDecoration: "none" }}>
          Farmaci
        </Link>
        <Link
          href="/rifornimenti"
          style={{ color: "#FFD700", textDecoration: "none" }}
        >
          Rifornimenti
        </Link>
        <Link href="/report" style={{ color: "#FFD700", textDecoration: "none" }}>
          Report
        </Link>
      </div>

      {/* Brand a destra */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: "normal" }}>Powered by</span>
        <Image
          src="/your_brand_placeholder.png"
          alt="Your Brand"
          width={100}
          height={30}
          priority
        />
      </div>
    </nav>
  );
}
