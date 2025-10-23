// HistoricoPesquisas.tsx
import { useEffect, useState } from "react";

export default function HistoricoPesquisas() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/historico")
      .then(res => res.json())
      .then(data => setHistorico(data));
  }, []);

  const salvar = async (termo: string) => {
    await fetch("http://localhost:5000/api/historico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termo }),
    });
    const atualizado = await fetch("http://localhost:5000/api/historico").then(res => res.json());
    setHistorico(atualizado);
  };

  return (
    <div>
      <h2>Histórico de pesquisas</h2>
      <button onClick={() => salvar("Teste " + Date.now())}>Salvar pesquisa</button>
      <ul>
        {historico.map((item: any) => (
          <li key={item.id}>
            {item.termo} - {new Date(item.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
