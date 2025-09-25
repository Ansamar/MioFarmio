import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useMioFarmo, Farmaco } from "../context/MioFarmoContext";

const labelStyle = {
  color: "#FFD700",
  fontWeight: 500,
  fontSize: "1.05rem",
  marginBottom: "4px",
  display: "block",
};

const campoStyle = {
  backgroundColor: "#222",
  color: "#FFD700",
  border: "2px solid #FFD700",
  borderRadius: "5px",
  padding: "7px",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "0px",
};

export default function FarmaciPage() {
  const {
    farmaci,
    aggiungiFarmaco,
    aggiornaFarmaco,
    rimuoviFarmaco,
  } = useMioFarmo();

  const [form, setForm] = useState<Omit<Farmaco, "id"> & { unita?: string }>({
    nome_commerciale: "",
    forza: "",
    unita: "",
    unitaPerConfezione: undefined,
    numeroConfezioni: undefined,
    posologia: undefined,
    stato: "a magazzino",
  });

  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const farmaco = farmaci.find(f => f.id === editId);
      if (farmaco) {
        const splitForza = farmaco.forza.split(" ");
        const valoreForza = splitForza[0] || "";
        const unitaForza = splitForza[1] || "";

        setForm({
          nome_commerciale: farmaco.nome_commerciale,
          forza: valoreForza,
          unita: unitaForza,
          unitaPerConfezione: farmaco.unitaPerConfezione,
          numeroConfezioni: farmaco.numeroConfezioni,
          posologia: farmaco.posologia,
          stato: farmaco.stato,
        });
      }
    } else {
      setForm({
        nome_commerciale: "",
        forza: "",
        unita: "",
        unitaPerConfezione: undefined,
        numeroConfezioni: undefined,
        posologia: undefined,
        stato: "a magazzino",
      });
    }
  }, [editId, farmaci]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === "unitaPerConfezione" ||
        name === "numeroConfezioni" ||
        name === "posologia"
          ? value === "" ? undefined : Number(value)
          : value,
    }));
  };

  const handleStatoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      stato: e.target.value as Farmaco["stato"],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const forzaCompleta = form.unita ? `${form.forza} ${form.unita}` : form.forza;

    const farmacoDaSalvare: Omit<Farmaco, "id"> = {
      nome_commerciale: form.nome_commerciale,
      forza: forzaCompleta,
      unitaPerConfezione: form.unitaPerConfezione,
      numeroConfezioni: form.numeroConfezioni,
      posologia: form.posologia,
      stato: form.stato,
    };

    if (editId) {
      await aggiornaFarmaco({ id: editId, ...farmacoDaSalvare });
      setEditId(null);
    } else {
      await aggiungiFarmaco(farmacoDaSalvare);
    }

    setForm({
      nome_commerciale: "",
      forza: "",
      unita: "",
      unitaPerConfezione: undefined,
      numeroConfezioni: undefined,
      posologia: undefined,
      stato: "a magazzino",
    });
  };

  const handleEditClick = (id: string) => {
    setEditId(id);
  };

  const handleRemoveClick = async (id: string) => {
    if (window.confirm("Confermi la cancellazione?")) {
      await rimuoviFarmaco(id);
    }
  };

  return (
    <Layout>
      <h2>Gestione Farmaci</h2>

      <form onSubmit={handleSubmit} style={{ padding: 16, backgroundColor: "#111", borderRadius: 6, color: "#FFD700" }}>
        <h3>{editId ? "Modifica farmaco" : "Aggiungi nuovo farmaco"}</h3>

        <label style={labelStyle}>Nome commerciale:</label>
        <input
          name="nome_commerciale"
          value={form.nome_commerciale}
          onChange={handleInputChange}
          required
          style={{...campoStyle, marginBottom: "16px"}}
        />

        <div style={{ display: "flex", gap: "16px", marginBottom: "18px", alignItems: "flex-end" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Forza:</label>
            <input
              name="forza"
              value={form.forza}
              onChange={handleInputChange}
              required
              style={campoStyle}
              placeholder="Inserisci valore (es. 500)"
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Misura:</label>
            <select
              name="unita"
              value={form.unita}
              onChange={handleInputChange}
              required
              style={campoStyle}
            >
              <option value="" disabled>Seleziona misura</option>
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="gr">gr</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>Unità per confezione:</label>
        <select
          name="unitaPerConfezione"
          value={form.unitaPerConfezione ?? ""}
          onChange={handleInputChange}
          style={{...campoStyle, marginBottom: "16px"}}
        >
          <option value="">Seleziona unità</option>
          {[5, 6, 12, 20, 24, 28, 30, 56, 60, 84].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <label style={labelStyle}>Numero confezioni:</label>
        <input
          name="numeroConfezioni"
          type="number"
          value={form.numeroConfezioni ?? ""}
          onChange={handleInputChange}
          style={{...campoStyle, marginBottom: "16px"}}
        />

        <label style={labelStyle}>Posologia:</label>
        <input
          name="posologia"
          type="number"
          value={form.posologia ?? ""}
          onChange={handleInputChange}
          style={{...campoStyle, marginBottom: "16px"}}
        />

        <label style={labelStyle}>Stato:</label>
        <select name="stato" value={form.stato} onChange={handleStatoChange} style={{...campoStyle, marginBottom: "16px"}}>
          <option value="a magazzino">A magazzino</option>
          <option value="richiesto">Richiesto</option>
          <option value="approvato">Approvato</option>
          <option value="fornito">Fornito</option>
        </select>

        <button type="submit"
          style={{
            marginTop: 12,
            cursor: "pointer",
            backgroundColor: "#FFD700",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            color: "#222"
          }}
        >
          {editId ? "Salva modifiche" : "Aggiungi farmaco"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => setEditId(null)}
            style={{
              marginLeft: 12,
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#444",
              borderRadius: 4,
              color: "#FFD700",
              border: "none"
            }}
          >
            Annulla modifica
          </button>
        )}
      </form>

      <h3 style={{ marginTop: 32 }}>Elenco Farmaci</h3>
      {farmaci.length === 0 ? (
        <p>Nessun farmaco presente.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {farmaci.map(f => (
            <li key={f.id} style={{ backgroundColor: "#222", color: "#FFD700", marginBottom: 10, padding: 12, borderRadius: 6, display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{f.nome_commerciale}</strong> ({f.forza})
              </div>
              <div>
                <button onClick={() => handleEditClick(f.id)} style={{ marginRight: 8, cursor: "pointer" }}>Modifica</button>
                <button onClick={() => handleRemoveClick(f.id)} style={{ cursor: "pointer" }}>Elimina</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
