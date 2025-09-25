import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firestore";

export interface Farmaco {
  id: string;
  nome_commerciale: string;
  forza: string;
  unitaPerConfezione?: number;
  numeroConfezioni?: number;
  quantita_unita?: number;
  posologia?: number;
  stato: string;
}

export interface Rifornimento {
  id: string;
  idFarmaco: string;
  nomeFarmaco: string;
  quantitaRichiesta: number;
  stato: "richiesto" | "approvato" | "fornito" | "rifiutato";
  note?: string;
  dataRichiesta?: string; // ISO date string
}

interface MioFarmoContextType {
  farmaci: Farmaco[];
  rifornimenti: Rifornimento[];
  aggiungiFarmaco: (farmaco: Omit<Farmaco, "id">) => Promise<string>;
  aggiornaFarmaco: (farmaco: Farmaco) => Promise<void>;
  rimuoviFarmaco: (id: string) => Promise<void>;

  aggiungiRifornimento: (rifornimento: Omit<Rifornimento, "id" | "dataRichiesta">) => Promise<string>;
  aggiornaRifornimento: (rifornimento: Rifornimento) => Promise<void>;
  rimuoviRifornimento: (id: string) => Promise<void>;
}

const MioFarmoContext = createContext<MioFarmoContextType | undefined>(undefined);

export const MioFarmoProvider = ({ children }: { children: ReactNode }) => {
  const [farmaci, setFarmaci] = useState<Farmaco[]>([]);
  const [rifornimenti, setRifornimenti] = useState<Rifornimento[]>([]);

  useEffect(() => {
    const farmaciCol = collection(db, "farmaci");
    const qFarmaci = query(farmaciCol, orderBy("nome_commerciale", "asc"));
    const unsubscribeFarmaci = onSnapshot(qFarmaci, (snapshot) => {
      const dati = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Farmaco) }));
      setFarmaci(dati);
    });

    const rifornimentiCol = collection(db, "rifornimenti");
    const qRifornimenti = query(rifornimentiCol, orderBy("dataRichiesta", "desc"));
    const unsubscribeRifornimenti = onSnapshot(qRifornimenti, (snapshot) => {
      const dati = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Rifornimento) }));
      setRifornimenti(dati);
    });

    return () => {
      unsubscribeFarmaci();
      unsubscribeRifornimenti();
    };
  }, []);

  const aggiungiFarmaco = async (farmaco: Omit<Farmaco, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "farmaci"), farmaco);
      return docRef.id;
    } catch (error) {
      console.error("Errore aggiunta farmaco:", error);
      throw error;
    }
  };

  const aggiornaFarmaco = async (farmaco: Farmaco) => {
    try {
      const docRef = doc(db, "farmaci", farmaco.id);
      const farmacoData = { ...farmaco };
      await updateDoc(docRef, farmacoData);
    } catch (error) {
      console.error("Errore aggiornamento farmaco:", error);
      throw error;
    }
  };

  const rimuoviFarmaco = async (id: string) => {
    try {
      const docRef = doc(db, "farmaci", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Errore rimozione farmaco:", error);
      throw error;
    }
  };

  const aggiungiRifornimento = async (rifornimento: Omit<Rifornimento, "id" | "dataRichiesta">) => {
    try {
      const rifornimentoConData = { ...rifornimento, dataRichiesta: new Date().toISOString() };
      const docRef = await addDoc(collection(db, "rifornimenti"), rifornimentoConData);
      return docRef.id;
    } catch (error) {
      console.error("Errore aggiunta rifornimento:", error);
      throw error;
    }
  };

  const aggiornaRifornimento = async (rifornimento: Rifornimento) => {
    try {
      const docRef = doc(db, "rifornimenti", rifornimento.id);
      await updateDoc(docRef, rifornimento);
    } catch (error) {
      console.error("Errore aggiornamento rifornimento:", error);
      throw error;
    }
  };

  const rimuoviRifornimento = async (id: string) => {
    try {
      const docRef = doc(db, "rifornimenti", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Errore rimozione rifornimento:", error);
      throw error;
    }
  };

  return (
    <MioFarmoContext.Provider
      value={{
        farmaci,
        rifornimenti,
        aggiungiFarmaco,
        aggiornaFarmaco,
        rimuoviFarmaco,
        aggiungiRifornimento,
        aggiornaRifornimento,
        rimuoviRifornimento,
      }}
    >
      {children}
    </MioFarmoContext.Provider>
  );
};

export const useMioFarmo = () => {
  const context = useContext(MioFarmoContext);
  if (!context) throw new Error("useMioFarmo deve essere usato dentro MioFarmoProvider");
  return context;
};
