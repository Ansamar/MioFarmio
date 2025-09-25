import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import { useMioFarmo, Farmaco, Rifornimento } from "../context/MioFarmoContext";

export default function ReportPage() {
  const { farmaci, rifornimenti, setFarmaci, setRifornimenti } = useMioFarmo();

  const [importError, setImportError] = useState<string | null>(null);
  const fileInputFarmaci = useRef<HTMLInputElement | null>(null);
  const fileInputRifornimenti = useRef<HTMLInputElement | null>(null);

  // ========================
  // Funzioni Export CSV
  // ========================

  function arrayToCSV(data: object[]): string {
    if(data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(field => JSON.stringify((row as any)[field], replacer)).join(",")
    );
    return [headers.join(","), ...rows].join("\r\n");

    function replacer(key: string, value: any) {
      return value === null ? "" : value;
    }
  }

  function exportCSV(data: object[], filename: string) {
    const csvData = arrayToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.click();
    URL.revokeObjectURL(url);
  }

  // ========================
  // Funzioni Import CSV
  // ========================

  function parseCSV(text: string): any[] {
    // Semplice parsing CSV (non gestisce casi complessi come virgole in campi, ma è base)
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = values[i];
      });
      return obj;
    });
  }

  function onImportFarmaci(e: React.ChangeEvent<HTMLInputElement>) {
    setImportError(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = parseCSV(text);
        // Converte i valori numerici dove serve
        const nuoviFarmaci: Farmaco[] = parsed.map((row) => ({
          id: Date.now().toString() + Math.random(),
          nome: row.nome || "",
          forzaQuantita: Number(row.forzaQuantita) || 0,
          forzaUnita: row.forzaUnita || "",
          unitaPerConfezione: Number(row.unitaPerConfezione) || 0,
          numeroConfezioni: Number(row.numeroConfezioni) || 0,
          posologia: Number(row.posologia) || 0,
          difficolta: (row.difficolta as any) || "facile",
        }));
        setFarmaci((f) => [...f, ...nuoviFarmaci]);
      } catch {
        setImportError("Errore durante l'importazione del file farmaci.");
      }
      if (fileInputFarmaci.current) fileInputFarmaci.current.value = "";
    };
    reader.readAsText(file);
  }

  function onImportRifornimenti(e: React.ChangeEvent<HTMLInputElement>) {
    setImportError(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = parseCSV(text);
        const nuoviRifornimenti: Rifornimento[] = parsed.map((row) => ({
          id: Date.now().toString() + Math.random(),
          nomeFarmaco: row.nomeFarmaco || "",
          quantitaRichiesta: Number(row.quantitaRichiesta) || 0,
          stato: row.stato || "richiesto",
          dataRichiesta: row.dataRichiesta || new Date().toISOString(),
        }));
        setRifornimenti((r) => [...r, ...nuoviRifornimenti]);
      } catch {
        setImportError("Errore durante l'importazione del file rifornimenti.");
      }
      if (fileInputRifornimenti.current) fileInputRifornimenti.current.value = "";
    };
    reader.readAsText(file);
  }

  // ========================
  // Generazione Report TXT
  // ========================

  function generaReportTesto() {
    let report = "=== Report Farmaci ===\n";
    farmaci.forEach((f) => {
      report += `- ${f.nome}, forza: ${f.forzaQuantita}${f.forzaUnita}, quantità: ${f.numeroConfezioni} confezioni da ${f.unitaPerConfezione} unità, posologia: ${f.posologia}, difficoltà reperimento: ${f.difficolta}\n`;
    });
    report += "\n=== Report Rifornimenti ===\n";
    rifornimenti.forEach((r) => {
      report += `- ${r.nomeFarmaco}, quantità: ${r.quantitaRichiesta}, stato: ${r.stato}, data richiesta: ${r.dataRichiesta}\n`;
    });
    return report;
  }

  function scaricaReportTxt() {
    const report = generaReportTesto();
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "miofarmo_report.txt");
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout>
      <h1>Report</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>Dati Farmaci</h2>
        <button onClick={() => exportCSV(farmaci, "farmaci.csv")} style={{ marginBottom: 12 }}>
          Esporta Farmaci CSV
        </button>
        <br />
        <input type="file" accept=".csv" onChange={onImportFarmaci} ref={fileInputFarmaci} />
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Dati Rifornimenti</h2>
        <button onClick={() => exportCSV(rifornimenti, "rifornimenti.csv")} style={{ marginBottom: 12 }}>
          Esporta Rifornimenti CSV
        </button>
        <br />
        <input type="file" accept=".csv" onChange={onImportRifornimenti} ref={fileInputRifornimenti} />
      </section>

      {importError && <p style={{ color: "red" }}>{importError}</p>}

      <section>
        <h2>Genera e scarica report `.txt`</h2>
        <button onClick={scaricaReportTxt} style={{ padding: "8px 16px", fontWeight: "bold" }}>
          Scarica Report
        </button>
      </section>
    </Layout>
  );
}

