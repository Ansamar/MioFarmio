import React, { useState } from "react";
import { useMioFarmo, Farmaco } from "../context/MioFarmoContext";

function calcolaDataEsaurimento(farmaco: Farmaco): string {
  const oggi = new Date();
  if (!farmaco.posologia || farmaco.posologia <= 0) return "N/D";
  const giorniScorta = Math.floor(farmaco.quantita_unita / farmaco.posologia);
  const dataEsaurimento = new Date(oggi);
  dataEsaurimento.setDate(oggi.getDate() + giorniScorta);
  return dataEsaurimento.toLocaleDateString("it-IT");
}

function generaReportMinimale(farmaci: Farmaco[]): string {
  const righe = farmaci.map((f) => {
    const dataEsaur = calcolaDataEsaurimento(f);
    return `${f.id},${f.nome_commerciale.toUpperCase()},${f.forza},${f.posologia} al di,${dataEsaur}`;
  });
  return righe.join("\n");
}

function generaReportScadenze(farmaci: Farmaco[], giorniInclusi: number): string {
  const oggi = new Date();
  const farmaciFiltrati = farmaci.filter((f) => {
    if (!f.posologia || f.posologia <= 0) return false;
    const giorniScorta = Math.floor(f.quantita_unita / f.posologia);
    return giorniScorta <= giorniInclusi;
  });
  if (farmaciFiltrati.length === 0) return "Nessun farmaco in scadenza entro l'intervallo specificato.";

  const righe = farmaciFiltrati.map((f) => {
    const dataEsaur = calcolaDataEsaurimento(f);
    return `FARMACO: ${f.nome_commerciale.toUpperCase()}\nFORZA: ${f.forza}\nUNITÀ IN CONFEZIONE: ${f.quantita_unita}\nPOSOLOGIA: ${f.posologia} al giorno\nDATA STIMATA ESAURIMENTO: ${dataEsaur}\nSTATO: ${f.stato}\n---------------------`;
  });
  return righe.join("\n");
}

function generaReportRichieste(farmaci: Farmaco[]): string {
  const richieste = farmaci.filter((f) => f.stato !== "a magazzino");
  if (richieste.length === 0) return "Nessuna richiesta in corso.";

  const righe = richieste.map((f) => {
    return `${f.id},${f.nome_commerciale.toUpperCase()},${f.forza},STATO:${f.stato}`;
  });
  return righe.join("\n");
}

export default function ReportGenerator() {
  const { farmaci } = useMioFarmo();
  const [tipoReport, setTipoReport] = useState<"minimale" | "scadenze" | "richieste">("minimale");
  const [giorniScadenza, setGiorniScadenza] = useState(30);

  function generaReportTesto(): string {
    switch (tipoReport) {
      case "minimale":
        return generaReportMinimale(farmaci);
      case "scadenze":
        return generaReportScadenze(farmaci, giorniScadenza);
      case "richieste":
        return generaReportRichieste(farmaci);
      default:
        return "";
    }
  }

  function downloadReport() {
    const testo = generaReportTesto();
    const blob = new Blob([testo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    let nomeFile: string;
    switch (tipoReport) {
      case "minimale":
        nomeFile = "report_farmaci_minimale.txt";
        break;
      case "scadenze":
        nomeFile = `report_farmaci_scadenze_${giorniScadenza}gg.txt`;
        break;
      case "richieste":
        nomeFile = "report_farmaci_richieste.txt";
        break;
      default:
        nomeFile = "report_farmaci.txt";
    }

    a.download = nomeFile;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ backgroundColor: "#222", color: "#FFD700", padding: 16, borderRadius: 8, maxWidth: 600, margin: "20px auto" }}>
      <h3>Genera Report Farmaci</h3>

      <label>
        Tipo report:{" "}
        <select value={tipoReport} onChange={(e) => setTipoReport(e.target.value as any)}>
          <option value="minimale">Report Mininale (CSV-like)</option>
          <option value="scadenze">Scadenze Imminenti</option>
          <option value="richieste">Richieste & Stato</option>
        </select>
      </label>

      {tipoReport === "scadenze" && (
        <div style={{ marginTop: 8 }}>
          <label>
            Mostra farmaci che si esauriranno entro{" "}
            <input
              type="number"
              min={1}
              value={giorniScadenza}
              onChange={(e) => setGiorniScadenza(Number(e.target.value))}
              style={{ width: 60, marginLeft: 8 }}
            />{" "}
            giorni
          </label>
        </div>
      )}

      <button onClick={downloadReport} style={{ marginTop: 12, padding: "6px 12px", cursor: "pointer", backgroundColor: "#FFD700", border: "none", borderRadius: 4 }}>
        Scarica Report .txt
      </button>
    </div>
  );
}
