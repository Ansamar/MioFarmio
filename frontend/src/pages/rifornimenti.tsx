import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useMioFarmo, Rifornimento } from "../context/MioFarmoContext";

const campoStyle = {
  backgroundColor: "#222",
  color: "#FFD700",
  border: "1px solid #FFD700",
  borderRadius: "4px",
  padding: "8px",
  marginBottom: "12px",
  width: "100%",
  boxSizing: "border-box",
};

export default function RifornimentiPage() {
  const { farmaci, rifornimenti, aggiungiRifornimento, aggiornaRifornimento, rimuoviRifornimento } = useMioFarmo();

  const [farmacoSelezionatoId, setFarmacoSelezionatoId] = useState<string>("");
  const [quantita, setQuantita] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (farmaci.length > 0 && !farmacoSelezionatoId) {
      setFarmacoSelezionatoId(farmaci[0].id);
    }
  }, [farmaci, farmacoSelezionatoId]);

  const resetForm = () => {
    setFarmacoSelezionatoId(farmaci.length > 0 ? farmaci[0].id : "");
    setQuantita(1);
    setNote("");
    setEditId(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmacoSelezionatoId || quantita < 1) return;

    const farmaco = farmaci.find(f => f.id === farmacoSelezionatoId);
    if (!farmaco) return;

    if (editId !== null) {
      aggiornaRifornimento({
        id: editId,
        idFarmaco: farmaco.id,
        nomeFarmaco: farmaco.nome_commerciale,
        quantitaRichiesta: quantita,
        note,
        stato: "richiesto",
        dataRichiesta: new Date().toISOString(),
      });
    } else {
      aggiungiRifornimento({
        idFarmaco: farmaco.id,
        nomeFarmaco: farmaco.nome_commerciale,
        quantitaRichiesta: quantita,
        note,
        stato: "richiesto",
      });
    }
    resetForm();
  };

  const startEdit = (r: Rifornimento) => {
    setEditId(r.id.toString());
    setFarmacoSelezionatoId(r.idFarmaco);
    setQuantita(r.quantitaRichiesta);
    setNote(r.note ?? "");
  };

  const canModify = (r: Rifornimento) => r.stato === "richiesto";

  return (
    <Layout>
      <h2>Gestione Rifornimenti</h2>

      <form onSubmit={onSubmit} style={{ backgroundColor: "#222", padding: 16, borderRadius: 6, marginBottom: 24, color: "#FFD700" }}>
        <label>Farmaco:</label>
        <select
          value={farmacoSelezionatoId}
          onChange={e => setFarmacoSelezionatoId(e.target.value)}
          required
          style={campoStyle}
        >
          <option value="" disabled>Seleziona un farmaco</option>
          {farmaci.map(f => (
            <option key={f.id} value={f.id}>
              {f.nome_commerciale.toUpperCase()} ({f.forza})
            </option>
          ))}
        </select>

        <label>Quantità richiesta:</label>
        <input
          type="number"
          min={1}
          value={quantita}
          onChange={e => setQuantita(Number(e.target.value))}
          required
          style={campoStyle}
        />

        <label>Note (opzionali):</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ ...campoStyle, resize: "vertical", minHeight: "60px" }}
        />

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#FFD700",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            color: "#222",
          }}
        >
          {editId !== null ? "Salva Modifica" : "Nuova Richiesta"}
        </button>

        {editId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: 12, padding: "8px 16px", cursor: "pointer", borderRadius: 4, backgroundColor: "#444", color: "#FFD700", border: "none" }}
          >
            Annulla
          </button>
        )}
      </form>

      <h3>Elenco Richieste</h3>
      {rifornimenti.length === 0 ? (
        <p>Nessuna richiesta effettuata.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {rifornimenti.map(r => (
            <li
              key={r.id}
              style={{
                backgroundColor: "#222",
                marginBottom: 10,
                padding: 12,
                borderRadius: 6,
                color: "#FFD700",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 60%" }}>
                <div><strong>{r.nomeFarmaco?.toUpperCase() ?? "-"}</strong> — Quantità: {r.quantitaRichiesta ?? "-"}</div>
                <div>Note: {r.note || "-"}</div>
                <div>
                  Stato:{" "}
                  <select
                    value={r.stato}
                    onChange={e =>
                      aggiornaRifornimento({ ...r, stato: e.target.value as Rifornimento["stato"] })
                    }
                    style={{ ...campoStyle, width: "auto", marginLeft: 4, display: "inline-block" }}
                  >
                    <option value="richiesto">Richiesto</option>
                    <option value="approvato">Approvato</option>
                    <option value="fornito">Fornito</option>
                    <option value="rifiutato">Rifiutato</option>
                  </select>
                </div>
                <div>Data richiesta: {new Date(r.dataRichiesta).toLocaleString()}</div>
              </div>
              {canModify(r) && (
                <div style={{ flex: "1 1 30%", textAlign: "right" }}>
                  <button onClick={() => startEdit(r)} style={{ marginRight: 8, cursor: "pointer" }}>Modifica</button>
                  <button
                    onClick={() => window.confirm("Confermi la cancellazione?") && rimuoviRifornimento(r.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Cancella
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
