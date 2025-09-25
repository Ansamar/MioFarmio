import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../utils/firestore";

interface Farmaco {
  id: string;
  nome_commerciale: string;
  forza: string;
}

export default function TestFirestore() {
  const [farmaci, setFarmaci] = useState<Farmaco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const farmaciCol = collection(db, "farmaci");
    const q = query(farmaciCol, orderBy("nome_commerciale", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dati = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Farmaco, "id">),
        }));
        setFarmaci(dati);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Caricamento farmaci...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div>
      <h2>Farmaci in Firestore</h2>
      {farmaci.length === 0 ? (
        <p>Nessun farmaco trovato.</p>
      ) : (
        <ul>
          {farmaci.map((f) => (
            <li key={f.id}>
              {f.nome_commerciale} - {f.forza}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
