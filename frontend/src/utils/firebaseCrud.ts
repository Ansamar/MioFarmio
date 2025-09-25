import { collection, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import db from "./firestore";

export async function fetchFarmaci(): Promise<Array<{ id: string; [key: string]: any }>> {
  try {
    const farmaciCol = collection(db, "farmaci");
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(farmaciCol);

    const farmaci = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as object),
    }));

    console.log(`[firebaseCrud] Recuperati ${farmaci.length} farmaci`);
    return farmaci;
  } catch (error) {
    console.error("[firebaseCrud] Errore fetchFarmaci:", error);
    throw error;
  }
}
