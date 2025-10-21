import z from "zod";




export const createDoctorScheduleZodSchema = z.object({
    scheduleIds: z.array(z.string({ error: "Schedule Id must be a string"})).min(1, "Minimum 1 Schedule Required")
})