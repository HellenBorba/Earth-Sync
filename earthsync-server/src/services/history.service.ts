import { prisma } from "../prismaClient";

export const historyService = {
  // Retorna todo o histórico, por ordem de criação
  getAll: async () => {
    return await prisma.searchHistory.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // Cria um item no histórico ou atualiza
  create: async (query: string) => {
    if (!query.trim()) return;

    // Verifica se já existe esse termo no histórico
    const existing = await prisma.searchHistory.findFirst({
      where: { query },
    });

    if (existing) {
      // Atualiza apenas o createdAt para mover para o topo
      await prisma.searchHistory.update({
        where: { id: existing.id },
        data: { createdAt: new Date() },
      });
      return existing;
    }

    // Caso não exista, cria um novo registro
    return await prisma.searchHistory.create({
      data: { query },
    });
  },

  // Deleta um item específico do histórico
  delete: async (id: number) => {
    return await prisma.searchHistory.delete({
      where: { id },
    });
  },

  // Limpa todo o histórico
  clearAll: async () => {
    return await prisma.searchHistory.deleteMany();
  },

  // Sincroniza histórico em massa
  sync: async (terms: string[]) => {
    const filteredTerms = terms
      .filter((t) => !!t && t.trim() !== "")
      .map((t) => t.trim());

    if (filteredTerms.length === 0) return;

    // Evita duplicar no banco
    for (const term of filteredTerms) {
      await historyService.create(term);
    }
  },
};
