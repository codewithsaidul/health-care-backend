import { UserRole } from "@prisma/client";






export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}


export type IJWTPayload = {
  email: string;
  role: UserRole;
};
