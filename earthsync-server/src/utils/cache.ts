import NodeCache from "node-cache";

// Cria o cache com TTL padrão de 5 minutos
const cache: NodeCache = new NodeCache({ stdTTL: 300 });

export default cache;
