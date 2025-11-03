import { useHistorico } from "../hooks/useHistorico";

export default function HistoricoPesquisas() {
  const { historico, salvarPesquisa } = useHistorico();

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Histórico de Pesquisas</h2>

      <button
        onClick={() => salvarPesquisa("Teste " + Date.now())}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg mb-4"
      >
        Salvar pesquisa
      </button>

      {historico.length === 0 ? (
        <p className="text-gray-400">Nenhum histórico encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {historico.map((item) => (
            <li
              key={item.id}
              className="bg-slate-800/70 p-3 rounded-lg border border-slate-700"
            >
              <span className="block text-lg font-medium text-blue-400">
                {item.query}
              </span>
              <span className="text-sm text-slate-400">
                {new Date(item.createdAt).toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
