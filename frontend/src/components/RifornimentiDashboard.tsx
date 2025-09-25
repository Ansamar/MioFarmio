import React from "react";
import { useMioFarmo } from "../context/MioFarmoContext";

export default function RifornimentiDashboard() {
  const { rifornimenti } = useMioFarmo();

  const ultimeRichieste = [...rifornimenti]
    .sort((a, b) => new Date(b.dataRichiesta).getTime() - new Date(a.dataRichiesta).getTime())
    .slice(0, 5);

  return (
    <div style={{ backgroundColor: "#222", color: "#FFD700", padding: 16, borderRadius: 6 }}>
      {ultimeRichieste.length === 0 ? (
        <p>Nessuna richiesta recente.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {ultimeRichieste.map((r) => (
            <li key={r.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>{r.nomeFarmaco.toUpperCase()} — {r.quantitaRichiesta} unità</span>
              <span
                style={{
                  color:
                    r.stato === "richiesto"
                      ? "orange"
                      : r.stato === "approvato"
                      ? "goldenrod"
                      : r.stato === "fornito"
                      ? "limegreen"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {r.stato.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
