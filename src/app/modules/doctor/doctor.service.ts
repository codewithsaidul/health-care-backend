import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";

export const DoctorServices = {
  getAllDoctor: async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
      andConditions.push({
        OR: doctorSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      });
    }

    // "", "medicine"
    if (specialties && specialties.length > 0) {
      andConditions.push({
        DoctorSpecialties: {
          some: {
            specialities: {
              title: {
                contains: specialties,
                mode: "insensitive",
              },
            },
          },
        },
      });
    }

    if (Object.keys(filterData).length > 0) {
      const filterConditions = Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      }));

      andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.DoctorWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        DoctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });

    const total = await prisma.doctor.count({
      where: whereConditions,
    });

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: result,
    };
  },
};
