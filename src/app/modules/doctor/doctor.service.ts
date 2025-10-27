import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../config/prismaInstance";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";
import { AppError } from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { openAi } from "../../config/openAi.config";
import { extractJsonFromMessage } from "../../utils/extractJsonFromMessage";

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
        DoctorSchedules: {
          include: {
            schedule: true
          }
        }
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
        totalPages: Math.ceil(total / limit),
      },
      data: result,
    };
  },

  getAiDoctorSuggestion: async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Symptom is required");
    }

    const doctors = await prisma.doctor.findMany({
      where: { isDeleted: false },
      include: {
        DoctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });

    const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

    const completion = await openAi.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI medical assistant that provides doctor suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = await extractJsonFromMessage(completion.choices[0].message);
    return result;
  },

  getSingleDoctor: async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        DoctorSpecialties: {
          include: {
            specialities: true,
          },
        },
        DoctorSchedules: {
          include: {
            schedule: true,
          },
        },
      },
    });
    return result;
  },

  updateDoctor: async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
      if (specialties && specialties.length > 0) {
        const deleteSpecialtyIds = specialties.filter(
          (specialty) => specialty.isDeleted
        );

        for (const specialty of deleteSpecialtyIds) {
          await tnx.doctorSpecialties.deleteMany({
            where: {
              doctorId: id,
              specialitiesId: specialty.specialtyId,
            },
          });
        }

        const createSpecialtyIds = specialties.filter(
          (specialty) => !specialty.isDeleted
        );

        for (const specialty of createSpecialtyIds) {
          await tnx.doctorSpecialties.create({
            data: {
              doctorId: id,
              specialitiesId: specialty.specialtyId,
            },
          });
        }
      }

      const updatedData = await tnx.doctor.update({
        where: {
          id: doctorInfo.id,
        },
        data: doctorData,
        include: {
          DoctorSpecialties: {
            include: {
              specialities: true,
            },
          },
        },

        //  doctor - doctorSpecailties - specialities
      });

      return updatedData;
    });
  },

  deleteDoctor: async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
      const deleteDoctor = await transactionClient.doctor.delete({
        where: {
          id,
        },
      });

      await transactionClient.user.delete({
        where: {
          email: deleteDoctor.email,
        },
      });

      return deleteDoctor;
    });
  },

  softDelete: async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
      const deleteDoctor = await transactionClient.doctor.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });

      await transactionClient.user.update({
        where: {
          email: deleteDoctor.email,
        },
        data: {
          status: UserStatus.DELETED,
        },
      });

      return deleteDoctor;
    });
  },
};
