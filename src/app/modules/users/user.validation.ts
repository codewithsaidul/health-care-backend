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
export const createAdminZodSchema = z.object({
    password: z.string({ error: "Password is required"}),
    email: z.string().nonempty("Email is required"),
    admin: z.object({
        name: z.string().nonempty("Name is required"),
        contactNumber: z.string().nonempty("Contact Number is required"),
    })
})



export const createDoctorZodSchema = z.object({
    password: z.string({ error: "Password is required"}),
    email: z.string().nonempty("Email is required"),
    doctor: z.object({
        name: z.string().nonempty("Name is required"),
        contactNumber: z.string().nonempty("Contact Number is required"),
        address: z.string().nonempty("Address is required"),
        experience: z.string().nonempty("Address is required"),
        gender: z.enum(["MALE", "FEMALE"]),
        registrationNumber: z.string().nonempty("Registration number is required"),
        appointmentFee: z.number().min(0).positive("Appointment fee must be a positive number"),
        qualification: z.string().nonempty("Qualification is required"),
        currentWorkPlace: z.string().nonempty("Current WorkPlace is required"),
        designation: z.string().nonempty("Designation is required")
    })
})