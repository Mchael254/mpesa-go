import { Authority } from "../common/authority";

export interface Profile {
  code: number,
  emailAddress: string,
  firstName: string,
  fullName: string,
  idNo: string,
  surName: string,
  teleponeNo: string,
  authorities?: Authority[],
  image?: any,
}