import bcrypt from "bcryptjs";
import { prisma } from "../../config/prismaInstance";
import { fileUploader } from "../../helpers/fileUploader";
import { ICreatePatientInput } from "./user.interface";

export const UserServices = {
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
            connect: { email: payload.email}
          }
        },
      });
    });

    return result;
  },
};
