"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  async function handleConvert() {
    if (!file) return;

    setStatus("Upload en cours...");
    setDownloadUrl("");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/convert", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      setStatus("Erreur pendant la conversion.");
      return;
    }

    const data = await res.json();
    setStatus("Conversion terminée.");
    setDownloadUrl(`http://127.0.0.1:8000${data.download_url}`);
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>BrailleScore (MVP)</h1>
      <p>Upload un fichier MusicXML (.xml/.musicxml) ou MuseScore (.mscz/.mscx).</p>

      <input
        type="file"
        accept=".xml,.musicxml,.mscz,.mscx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={handleConvert} disabled={!file}>
          Convertir en BRF
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Statut :</strong> {status}
      </div>

      {downloadUrl && (
        <div style={{ marginTop: 16 }}>
          <a href={downloadUrl}>Télécharger le fichier BRF</a>
        </div>
      )}
    </main>
  );
}
