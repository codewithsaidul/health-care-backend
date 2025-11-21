import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  UserRole,
} from "@prisma/client";
import { AppError } from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prismaInstance";
import { IJWTPayload } from "../../types/common.types";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";

export const PrescriptionService = {
  createPrescription: async (
    user: IJWTPayload,
    payload: Partial<Prescription>
  ) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
      where: {
        id: payload.appointmentId,
        status: AppointmentStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
      },
      include: {
        doctor: true,
      },
    });

    if (user.role === UserRole.DOCTOR) {
      if (!(user.email === appointmentData.doctor.email))
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "This is not your appointment"
        );
    }

    const result = await prisma.prescription.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        instructions: payload.instructions as string,
        followUpDate: payload.followUpDate || null,
      },
      include: {
        patient: true,
      },
    });

    return result;
  },

  myPrescription: async (user: IJWTPayload, options: IOptions) => {
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
      where: {
        patient: {
          email: user.email,
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        doctor: true,
        patient: true,
        appointment: true,
      },
    });

    const total = await prisma.prescription.count({
      where: {
        patient: {
          email: user.email,
        },
      },
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
