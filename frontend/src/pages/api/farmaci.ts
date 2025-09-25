import type { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Metodo non supportato" });
  }

  try {
    console.log("[API /farmaci] Inizio recupero farmaci da Firestore");
    const farmaciCol = collection(db, "farmaci");
    console.log("[API /farmaci] Collezione farmaci ottenuta");

    const snapshot = await getDocs(farmaciCol);
    console.log(`[API /farmaci] Documenti trovati: ${snapshot.size}`);

    const farmaci = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as object),
    }));

    console.log(`[API /farmaci] Farmaci letti con successo: ${farmaci.length}`);
    return res.status(200).json({ farmaci });
  } catch (error) {
    console.error("[API /farmaci] Errore durante il recupero farmaci:", error);
    return res.status(500).json({ error: "Errore nel caricamento farmaci" });
  }
}
