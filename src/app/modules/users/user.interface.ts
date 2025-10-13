export interface IUser {
  email: string;
  password: string;
  patient?: ICreatePatient;
  doctor?: ICreateDoctor;
  admin?: ICreateAdmin;
}

export interface ICreatePatientInput extends IUser {
  patient: ICreatePatient;
}

export interface ICreateDoctorInput extends IUser {
  doctor: ICreateDoctor;
}

export interface ICreateAdminInput extends IUser {
  email: string;
  password: string;
  admin: ICreateAdmin;
}

export interface ICreatePatient {
  name: string;
  address: string;
  contactNumber: string;
  profilePhoto?: string;
}

export interface ICreateDoctor {
  name: string;
  address: string;
  contactNumber: string;
  profilePhoto?: string;
  experience: string;
  gender: "MALE" | "FEMALE";
  registrationNumber: string;
  appointmentFee: number;
  qualification: string;
  currentWorkPlace: string;
  designation: string;
}

export interface ICreateAdmin {
  name: string;
  contactNumber: string;
  profilePhoto?: string;
}
