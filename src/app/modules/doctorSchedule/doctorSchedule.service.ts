import { prisma } from "../../config/prismaInstance";
import { IJWTPayload } from "../../types/common.types";

export const DoctorScheduleServices = {
  createDoctorSchedules: async (
    user: IJWTPayload,
    payload: { scheduleIds: string[] }
  ) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
      doctorId: doctorData.id,
      scheduleId,
    }));

    return await prisma.doctorSchedules.createMany({
      data: doctorScheduleData,
    });
  },
};
