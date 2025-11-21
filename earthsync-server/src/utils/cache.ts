import NodeCache from "node-cache";

// Create cache with default TTL of 5 minutes
const cache: NodeCache = new NodeCache({ stdTTL: 300 });

export default cache;
