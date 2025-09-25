import React from "react";
import FarmaciDashboard from "./FarmaciDashboard";

interface User {
  id: number;
  nome: string;
  cognome: string;
}

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div>
      <h2>Benvenuto, {user.nome} {user.cognome}</h2>
      <p>
        Qui puoi visualizzare lo stato del magazzino farmaci, ricevere alert di scadenza e scorte basse.<br/>
        Puoi aggiungere o gestire i tuoi farmaci tramite i pulsanti qui sotto e navigare le varie pagine dal menu.
      </p>
      <hr />
      <FarmaciDashboard />
      <button style={{
        marginTop: 20,
        padding: "8px 16px",
        backgroundColor: "#FFD700",
        color: "#222",
        border: "none",
        borderRadius: 4,
        fontWeight: "bold"
      }}>
        + Aggiungi Farmaco (demo)
      </button>
    </div>
  );
}
