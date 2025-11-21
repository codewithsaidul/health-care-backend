import { prisma } from "../../config/prismaInstance";

export const SpecialtiesServices = {
  createSpecialties: async (payload: { title: string; icon: string }) => {
    const result = await prisma.specialties.create({
      data: payload,
    });

    return result;
  },

  getAllSpecialties: async () => {
    return await prisma.specialties.findMany();
  },

  deleteSchedule: async (id: string) => {
    const result = await prisma.specialties.delete({
      where: {
        id,
      },
    });
    return result;
  },
};
