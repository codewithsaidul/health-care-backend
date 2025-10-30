import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prismaInstance";
import { fileUploader } from "../../helpers/fileUploader";
import { IJWTPayload } from "../../types/common.types";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constants";
import {
  ICreateAdminInput,
  ICreateDoctorInput,
  ICreatePatientInput,
} from "./user.interface";

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

  getMyProfile: async (user: IJWTPayload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        email: true,
        needPasswordChange: true,
        role: true,
        status: true,
      },
    });

    let profileData;

    if (userInfo.role === UserRole.PATIENT) {
      profileData = await prisma.patient.findUnique({
        where: {
          email: userInfo.email,
        },
      });
    } else if (userInfo.role === UserRole.DOCTOR) {
      profileData = await prisma.doctor.findUnique({
        where: {
          email: userInfo.email,
        },
      });
    } else if (userInfo.role === UserRole.ADMIN) {
      profileData = await prisma.admin.findUnique({
        where: {
          email: userInfo.email,
        },
      });
    }

    return {
      ...userInfo,
      ...profileData,
    };
  },

  updateMyProfile: async (
    user: IJWTPayload,
    payload: any,
    file: Express.Multer.File
  ) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
        email: user?.email,
        status: UserStatus.ACTIVE,
      },
    });

    if (file) {
      const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
      payload.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.ADMIN) {
      profileInfo = await prisma.admin.update({
        where: {
          email: userInfo.email,
        },
        data: payload,
      });
    } else if (userInfo.role === UserRole.DOCTOR) {
      profileInfo = await prisma.doctor.update({
        where: {
          email: userInfo.email,
        },
        data: payload,
      });
    } else if (userInfo.role === UserRole.PATIENT) {
      profileInfo = await prisma.patient.update({
        where: {
          email: userInfo.email,
        },
        data: payload,
      });
    }

    return { ...profileInfo };
  },

  changeProfileStatus: async (id: string, payload: { status: UserStatus }) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const updateUserStatus = await prisma.user.update({
      where: {
        id,
      },
      data: payload,
    });

    return updateUserStatus;
  },
};
