//
//  AlertList.tsx
//  
//
//  Created by Mario Ansaldi on 10/09/25.
//
// frontend/src/components/AlertList.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const AlertList = ({ userId }: { userId: number }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      const res = await axios.get(`/api/users/${userId}/alerts`);
      setAlerts(res.data);
    }
    loadAlerts();
  }, [userId]);

  return (
    <ul>
      {alerts.map((a: any) => (
        <li key={a.farmaco_id}>
          {a.nome_commerciale}: scorte per {a.giorni_rimanenti} giorni
        </li>
      ))}
    </ul>
  );
};

export default AlertList;
