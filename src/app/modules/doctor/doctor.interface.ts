import { Gender } from "@prisma/client";

export interface IDoctorUpdateInput {
  contactNumber: string;
  gender: Gender;
  appointmentFee: number;
  name: string;
  address: string;
  registrationNumber: string;
  experience: string;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  specialties: {
    specialtyId: string;
    isDeleted?: boolean;
  }[];
}
