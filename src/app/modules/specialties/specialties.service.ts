import { prisma } from "../../config/prismaInstance";

export const SpecialtiesServices = {
  createSpecialties: async (payload: { title: string; icon: string }) => {
    const result = await prisma.specialties.create({
      data: payload
    });

    return result;
  },
};
