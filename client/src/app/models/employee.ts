import { Company } from "./company";

export interface Employee {
    id?: any;
    firstName: string;
    lastName: string;
    title: string;
    companyId: any;
    companyName: string;
    company?: Company; 
    email: string;
    phoneNumber: string;
  }