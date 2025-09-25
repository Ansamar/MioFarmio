import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0px 24px",
          backgroundColor: "#111",
          color: "#FFD700",
        }}
      >
        {/* Logo grande a sinistra */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src="/miofarmo_logo_placeholder.png"
            alt="Logo MioFarmo"
            width={200}
            height={200

            }
            priority
          />
        </div>

        {/* Scritta centrale */}
        <div style={{ fontSize: 28, fontWeight: "bold" }}>F a r M i o</div>

        {/* Logo brand a destra */}
        <div>
          <Image
            src="/your_brand_placeholder.png"
            alt="Your Brand"
            width={140}
            height={42}
            priority
          />
        </div>
      </div>

      {/* Navbar riga sottostante */}
      <nav
        style={{
          background: "#111",
          color: "#FFD700",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "center",
          gap: 32,
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        <Link href="/" style={{ color: "#FFD700", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link href="/farmaci" style={{ color: "#FFD700", textDecoration: "none" }}>
          Farmaci
        </Link>
        <Link href="/rifornimenti" style={{ color: "#FFD700", textDecoration: "none" }}>
          Rifornimenti
        </Link>
        <Link href="/report" style={{ color: "#FFD700", textDecoration: "none" }}>
          Report
        </Link>
      </nav>
    </>
  );
}
