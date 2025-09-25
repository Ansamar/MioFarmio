import React from "react";
import { Farmaco } from "../context/MioFarmoContext";

interface FarmacoDettaglioProps {
  farmaco: Farmaco;
}

export default function FarmacoDettaglio({ farmaco }: FarmacoDettaglioProps) {
  return (
    <div style={{ backgroundColor: "#222", borderRadius: 6, padding: 12, color: "#FFD700", maxWidth: 600, margin: "0 auto" }}>
      <h2>{farmaco.nome_commerciale.toUpperCase()}</h2>
      <p><strong>Forza:</strong> {farmaco.forza}</p>
      <p><strong>Quantità Unità:</strong> {farmaco.quantita_unita}</p>
      <p><strong>Posologia:</strong> {farmaco.posologia ?? "N/D"} al giorno</p>
      <p><strong>Stato:</strong> {farmaco.stato}</p>
    </div>
  );
}
