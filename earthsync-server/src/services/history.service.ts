import { prisma } from "../prismaClient";

export const historyService = {
  getAll: async () => {
    return await prisma.searchHistory.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  create: async (query: string) => {
    return await prisma.searchHistory.create({
      data: { query },
    });
  },

  delete: async (id: number) => {
    return await prisma.searchHistory.delete({
      where: { id },
    });
  },

  clearAll: async () => {
    return await prisma.searchHistory.deleteMany();
  },
};
