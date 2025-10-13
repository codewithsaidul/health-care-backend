

export interface IUser {
  email: string;
  password: string;
  patient?: ICreatePatient
}

export interface ICreatePatientInput extends IUser {
  patient: ICreatePatient
};

export interface ICreatePatient {
  name: string;
  address: string;
  contactNumber: string;
  profilePhoto?: string
}
