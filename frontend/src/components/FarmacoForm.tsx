import React, { useState } from "react";
import { useMioFarmo, Farmaco } from "../context/MioFarmoContext";

export default function FarmacoForm() {
  const { aggiungiFarmaco } = useMioFarmo();

  const [nome, setNome] = useState("");
  const [forza, setForza] = useState("");
  const [quantitaUnita, setQuantitaUnita] = useState(1);
  const [posologia, setPosologia] = useState(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !forza || quantitaUnita < 1 || posologia < 1) return;

    await aggiungiFarmaco({
      nome_commerciale: nome,
      forza,
      quantita_unita: quantitaUnita,
      posologia,
      stato: "a magazzino", // default
    });

    // Reset form
    setNome("");
    setForza("");
    setQuantitaUnita(1);
    setPosologia(1);
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#222", padding: 12, borderRadius: 6 }}>
      <label>
        Nome farmaco:&nbsp;
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          placeholder="EsempioFarmaco"
        />
      </label>
      <br />
      <label>
        Forza (dosaggio, es: 20 mg):&nbsp;
        <input
          type="text"
          value={forza}
          onChange={e => setForza(e.target.value)}
          required
          placeholder="20 mg"
        />
      </label>
      <br />
      <label>
        Unità per confezione:&nbsp;
        <input
          type="number"
          value={quantitaUnita}
          min={1}
          onChange={e => setQuantitaUnita(Number(e.target.value))}
          required
          placeholder="20"
        />
      </label>
      <br />
      <label>
        Posologia (compresse al giorno):&nbsp;
        <input
          type="number"
          value={posologia}
          min={1}
          onChange={e => setPosologia(Number(e.target.value))}
          required
          placeholder="2"
        />
      </label>
      <br />
      <button
        type="submit"
        style={{ marginTop: 10, background: "#FFD700", color: "#222", border: "none", padding: "6px 12px", borderRadius: 4 }}
      >
        Aggiungi farmaco
      </button>
    </form>
  );
}

