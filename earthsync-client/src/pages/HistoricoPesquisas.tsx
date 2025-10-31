// HistoryResearch.tsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api/config";


export default function HistoricoPesquisas() {
  // state to store history
  const [historico, setHistorico] = useState([]);

  // fetch history on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/history`)
      .then((res) => res.json())
      .then((data) => setHistorico(data));
  }, []);

  // save a search term
  const salvar = async (termo: string) => {
    await fetch(`${API_BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: termo }),
    });
    // update history after saving
    const atualizado = await fetch(`${API_BASE_URL}/history`).then((res) => res.json());
    setHistorico(atualizado);
  };

  return (
    <div>
      <h2>Histórico de pesquisas</h2>
      <button onClick={() => salvar("Teste " + Date.now())}>Salvar pesquisa</button>
      <ul>
        {historico.map((item: any) => (
          <li key={item.id}>
            {item.query} - {new Date(item.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
