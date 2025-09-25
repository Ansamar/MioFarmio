import React from "react";
import { useMioFarmo } from "../context/MioFarmoContext";

export default function FarmaciDashboard() {
  const { farmaci } = useMioFarmo();

  return (
    <div>
      <h3>Farmaci disponibili</h3>
      {farmaci.length === 0 ? (
        <p>Nessun farmaco disponibile</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {farmaci.map(f => (
            <li
              key={f.id}
              style={{
                background: "#222",
                color: "#FFD700",
                marginBottom: 10,
                padding: 12,
                borderRadius: 6,
              }}
            >
              <strong>{f.nome_commerciale ?? "-"}</strong> ({f.forza ?? "-"})
              <br />
              Disponibilità: {f.numeroConfezioni && f.unitaPerConfezione
                ? f.numeroConfezioni * f.unitaPerConfezione
                : "-"}
              <br />
              Unità per confezione: {f.unitaPerConfezione ?? "-"}
              <br />
              Numero confezioni: {f.numeroConfezioni ?? "-"}
              <br />
              Posologia: {f.posologia ?? "-"}
              <br />
              Stato: <em>{f.stato ?? "-"}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
