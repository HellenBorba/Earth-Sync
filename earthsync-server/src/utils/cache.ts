import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutos de cache

export default cache;