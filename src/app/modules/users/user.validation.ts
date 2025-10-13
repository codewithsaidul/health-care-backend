import z from "zod";



export const createPatientZodSchema = z.object({
    password: z.string({ error: "Password is required"}),
    email: z.string().nonempty("Email is required"),
    patient: z.object({
        name: z.string().nonempty("Name is required"),
        contactNumber: z.string().nonempty("Contact Number is required"),
        address: z.string().nonempty("Address is required"),
    })
})