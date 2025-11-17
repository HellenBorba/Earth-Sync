// src/hooks/useHistorico.ts
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api/config";

interface HistoricoItem {
  id: number;
  query: string;
  createdAt: string;
}

/**
 Hook responsible for fetching and saving the search history.
 */
export function useHistorico() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    fetchHistorico();
  }, []);

  const fetchHistorico = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const data = await response.json();
      setHistorico(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  const salvarPesquisa = async (termo: string) => {
    try {
      await fetch(`${API_BASE_URL}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terms: [termo] }),
      });
      await fetchHistorico(); // update list
    } catch (error) {
      console.error("Erro ao salvar pesquisa:", error);
    }
  };

  return { historico, salvarPesquisa };
}
