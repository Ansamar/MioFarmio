import React from "react";
import Layout from "../components/Layout";
import { useMioFarmo } from "../context/MioFarmoContext";

export default function DashboardPage() {
  const { farmaci, rifornimenti = [] } = useMioFarmo();

  // Filtra richieste attive
  const richiesteAttive = rifornimenti.filter(
    (r) => r.stato === "richiesto" || r.stato === "approvato"
  );

  function barraColore(quantita: number): string {
    if (quantita < 10) return "red";
    if (quantita < 30) return "orange";
    return "limegreen";
  }

  function quantitaTotale(farmaco: typeof farmaci[0]) {
    return (farmaco.unitaPerConfezione || 0) * (farmaco.numeroConfezioni || 0);
  }

  return (
    <Layout>
      <h1>Dashboard MioFarmo</h1>

      <section style={{ marginBottom: 40 }}>
        <h2>Farmaci Disponibili (Sintesi)</h2>
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {farmaci.length === 0 ? (
            <li>Nessun farmaco disponibile.</li>
          ) : (
            farmaci.map((f) => {
              const quantita = quantitaTotale(f);
              const colore = barraColore(quantita);
              return (
                <li
                  key={f.id}
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    backgroundColor: "#222",
                    borderRadius: 6,
                    color: "#FFD700",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: 18 }}>{f.nome_commerciale}</div>
                  <div>Disponibilità: {quantita} {f.unitaPerConfezione}</div>
                  <div
                    style={{
                      height: 16,
                      width: `${Math.min(quantita, 100)}%`,
                      backgroundColor: colore,
                      borderRadius: 4,
                      marginTop: 4,
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section>
        <h2>Richieste in Elaborazione</h2>
        {richiesteAttive.length === 0 ? (
          <p>Nessuna richiesta attiva.</p>
        ) : (
          <ul style={{ paddingLeft: 0, listStyle: "none" }}>
            {richiesteAttive.map((r) => (
              <li
                key={r.id}
                style={{
                  backgroundColor: "#222",
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 6,
                  color: "#FFD700",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{r.nomeFarmaco}</div>
                <div>Stato: <em>{r.stato}</em></div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}
