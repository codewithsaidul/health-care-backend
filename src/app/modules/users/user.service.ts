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
       const { email, ...patientData } = payload.patient; 

      await tnx.user.create({
        data: {
          email: email,
          password: hashPassword,
        },
      });

      return await tnx.patient.create({
        data: {
          ...patientData,
          user: {
            connect: { email: email}
          }
        },
      });
    });

    return result;
  },
};
