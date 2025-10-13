import { useEffect, useState } from "react";

export default function HistoricoPesquisas() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + '/historico')
      .then(res => res.json())
      .then(data => setHistorico(data));
  }, []);

  return (
    <div>
      <h2>Histórico de pesquisas</h2>
      <ul>
        {historico.map((item: any) => (
          <li key={item.id}>{item.termo} - {new Date(item.data).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}