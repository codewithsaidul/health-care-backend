import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prismaInstance";
import { fileUploader } from "../../helpers/fileUploader";
import {
  ICreateAdminInput,
  ICreateDoctorInput,
  ICreatePatientInput,
} from "./user.interface";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constants";

export const UserServices = {
  // create patient
  createPatient: async (
    payload: ICreatePatientInput,
    file?: Express.Multer.File
  ) => {
    if (file) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      payload.patient.profilePhoto = uploadResult?.secure_url;
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
      await tnx.user.create({
        data: {
          email: payload.email,
          password: hashPassword,
        },
      });

      return await tnx.patient.create({
        data: {
          ...payload.patient,
          user: {
            connect: { email: payload.email },
          },
        },
      });
    });

    return result;
  },

  // create Admin
  createAdmin: async (
    payload: ICreateAdminInput,
    file?: Express.Multer.File
  ) => {
    if (file) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      payload.admin.profilePhoto = uploadResult?.secure_url;
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
      await tnx.user.create({
        data: {
          email: payload.email,
          password: hashPassword,
          role: UserRole.ADMIN,
        },
      });

      return await tnx.admin.create({
        data: {
          ...payload.admin,
          user: {
            connect: { email: payload.email },
          },
        },
      });
    });

    return result;
  },

  // create doctor
  createDoctor: async (
    payload: ICreateDoctorInput,
    file?: Express.Multer.File
  ) => {
    if (file) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      payload.doctor.profilePhoto = uploadResult?.secure_url;
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
      await tnx.user.create({
        data: {
          email: payload.email,
          password: hashPassword,
          role: UserRole.DOCTOR,
        },
      });

      return await tnx.doctor.create({
        data: {
          ...payload.doctor,
          user: {
            connect: { email: payload.email },
          },
        },
      });
    });

    return result;
  },

  // get all user
  getAllUsers: async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
      andConditions.push({
        OR: userSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      });
    }

    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: (filterData as any)[key],
          },
        })),
      });
    }

    const whereConditions: Prisma.UserWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const result = await prisma.user.findMany({
      skip,
      take: limit,

      where: whereConditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await prisma.user.count({
      where: whereConditions,
    });
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  },
};
