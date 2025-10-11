import { prisma } from "../../config/prismaInstance";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";




export const UserServices = {
    createPatient: async (payload: createPatientInput) => {
        const hashPassword = await bcrypt.hash(payload.password, 10)

        const result = await prisma.$transaction(async (tnx) => {
            await tnx.user.create({
                data: {
                    email: payload.email,
                    password: hashPassword
                }
            });


           return await tnx.patient.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    address: payload.address,
                    contactNumber: payload.contactNumber
                }
            })
        })

        return result
    }
}