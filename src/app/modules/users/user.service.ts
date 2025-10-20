import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prismaInstance";
import { fileUploader } from "../../helpers/fileUploader";
import { ICreateAdminInput, ICreateDoctorInput, ICreatePatientInput } from "./user.interface";

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
          role: UserRole.DOCTOR
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
};
