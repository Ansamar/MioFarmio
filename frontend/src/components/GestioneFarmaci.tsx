import React, { useState } from "react";

type Difficolta = "facile" | "1" | "2" | "difficile" | "molto difficile";

interface Farmaco {
  id: string;
  nome: string;
  forzaQuantita: number;
  forzaUnita: string;
  unitaPerConfezione: number;
  numeroConfezioni: number;
  posologia: number;
  difficolta: Difficolta;
}

interface Props {
  farmaci: Farmaco[];
  setFarmaci: React.Dispatch<React.SetStateAction<Farmaco[]>>;
}

export default function GestioneFarmaci({ farmaci, setFarmaci }: Props) {
  const [form, setForm] = useState<Omit<Farmaco, "id">>({
    nome: "",
    forzaQuantita: 0,
    forzaUnita: "",
    unitaPerConfezione: 0,
    numeroConfezioni: 0,
    posologia: 0,
    difficolta: "facile",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "difficolta"
          ? value
          : name === "nome" || name === "forzaUnita"
          ? value
          : Number(value),
    }));
  }

  function resetForm() {
    setForm({
      nome: "",
      forzaQuantita: 0,
      forzaUnita: "",
      unitaPerConfezione: 0,
      numeroConfezioni: 0,
      posologia: 0,
      difficolta: "facile",
    });
    setEditId(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || form.forzaQuantita <= 0 || form.unitaPerConfezione <= 0 || form.numeroConfezioni <= 0) {
      alert("Inserisci almeno: nome, forza, unità confezione e numero confezioni correttamente");
      return;
    }
    if (editId) {
      setFarmaci((f) =>
        f.map((farmaco) => (farmaco.id === editId ? { ...form, id: editId } : farmaco))
      );
    } else {
      const newId = Date.now().toString();
      setFarmaci((f) => [...f, { ...form, id: newId }]);
      setLastAddedId(newId);
    }
    resetForm();
  }

  function onEdit(id: string) {
    const farmaco = farmaci.find((f) => f.id === id);
    if (!farmaco) return;
    setForm({ ...farmaco });
    setEditId(id);
  }

  function onDelete(id: string) {
    setFarmaci((f) => f.filter((farmaco) => farmaco.id !== id));
    if (lastAddedId === id) setLastAddedId(null);
    if (editId === id) resetForm();
  }

  function onUndo() {
    if (!lastAddedId) return;
    setFarmaci((f) => f.filter((farmaco) => farmaco.id !== lastAddedId));
    setLastAddedId(null);
    if (editId === lastAddedId) resetForm();
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", paddingTop: 20 }}>
      <h2>Inserisci o Modifica Farmaco</h2>
      <form onSubmit={onSubmit} style={{ background: "#222", padding: 16, borderRadius: 8, color: "#FFD700" }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Nome farmaco:
            <input
              name="nome"
              value={form.nome}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 6, borderRadius: 4, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <label style={{ flex: 1 }}>
            Forza (quantità):
            <input
              type="number"
              min={0}
              name="forzaQuantita"
              value={form.forzaQuantita}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 6, borderRadius: 4, marginTop: 4 }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Unità (es. mg, ml):
            <input
              name="forzaUnita"
              value={form.forzaUnita}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 6, borderRadius: 4, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <label style={{ flex: 1 }}>
            Unità per confezione:
            <input
              type="number"
              min={0}
              name="unitaPerConfezione"
              value={form.unitaPerConfezione}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 6, borderRadius: 4, marginTop: 4 }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Numero confezioni:
            <input
              type="number"
              min={0}
              name="numeroConfezioni"
              value={form.numeroConfezioni}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 6, borderRadius: 4, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Posologia (unità al giorno):
            <input
              type="number"
              min={0}
              name="posologia"
              value={form.posologia}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 6, borderRadius: 4, marginTop: 4 }}
            />
          </label>
        </div>
        <fieldset style={{ marginBottom: 16 }}>
          <legend>Difficoltà reperimento</legend>
          {["facile", "1", "2", "difficile", "molto difficile"].map((val) => (
            <label key={val} style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="difficolta"
                value={val}
                checked={form.difficolta === val}
                onChange={onChange}
              />{" "}
              {val}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#FFD700",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {editId ? "Salva Modifica" : "Aggiungi Farmaco"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              marginLeft: 12,
              padding: "10px 20px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Annulla
          </button>
        )}
      </form>

      {farmaci.length > 0 && (
        <>
          <button
            onClick={onUndo}
            disabled={!lastAddedId}
            style={{
              marginTop: 20,
              marginBottom: 12,
              backgroundColor: lastAddedId ? "#FF4500" : "#555",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              cursor: lastAddedId ? "pointer" : "not-allowed",
              fontWeight: "bold",
            }}
          >
            Undo Ultimo Inserimento
          </button>

          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {farmaci.map((f) => {
              const quantita = f.unitaPerConfezione * f.numeroConfezioni;
              const barraColore = quantita < 10 ? "red" : quantita < 30 ? "orange" : "limegreen";

              return (
                <li
                  key={f.id}
                  style={{
                    backgroundColor: "#222",
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 12,
                    color: "#FFD700",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: 18 }}>{f.nome}</div>
                  <div>
                    Quantità in magazzino: {quantita} {f.forzaUnita}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#555",
                      borderRadius: 4,
                      height: 20,
                      overflow: "hidden",
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(quantita, 100)}%`,
                        height: "100%",
                        backgroundColor: barraColore,
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
                    <button
                      onClick={() => onEdit(f.id)}
                      style={{
                        backgroundColor: "#FFD700",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        color: "#222",
                        padding: "6px 12px",
                        fontWeight: "bold",
                      }}
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => onDelete(f.id)}
                      style={{
                        backgroundColor: "#FF4500",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        color: "white",
                        padding: "6px 12px",
                        fontWeight: "bold",
                      }}
                    >
                      Cancella
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
