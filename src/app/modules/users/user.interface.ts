export type ICreatePatientInput = {
  password: string;
  patient: ICreatePatient
};

export interface ICreatePatient {
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  profilePhoto?: string
}
