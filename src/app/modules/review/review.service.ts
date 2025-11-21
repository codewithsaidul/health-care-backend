import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prismaInstance";
import { AppError } from "../../errorHelper/AppError";
import { IJWTPayload } from "../../types/common.types";
import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";

export const ReviewServices = {
  createReview: async (user: IJWTPayload, payload: any) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
      where: {
        id: payload.appointmentId,
      },
    });

    if (patientData.id !== appointmentData.patientId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "This is not your appointment!"
      );
    }

    return await prisma.$transaction(async (tnx) => {
      const result = await tnx.review.create({
        data: {
          appointmentId: appointmentData.id,
          doctorId: appointmentData.doctorId,
          patientId: appointmentData.patientId,
          rating: payload.rating,
          comment: payload.comment,
        },
      });

      const avgRating = await tnx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          doctorId: appointmentData.doctorId,
        },
      });

      await tnx.doctor.update({
        where: {
          id: appointmentData.doctorId,
        },
        data: {
          averageRating: avgRating._avg.rating as number,
        },
      });

      return result;
    });
  },

  getAllReviews: async (filters: any, options: IOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail } = filters;
    const andConditions = [];

    if (patientEmail) {
      andConditions.push({
        patient: {
          email: patientEmail,
        },
      });
    }

    if (doctorEmail) {
      andConditions.push({
        doctor: {
          email: doctorEmail,
        },
      });
    }

    const whereConditions: Prisma.ReviewWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.review.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : {
              createdAt: "desc",
            },
      include: {
        doctor: true,
        patient: true,
        //appointment: true,
      },
    });
    const total = await prisma.review.count({
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
