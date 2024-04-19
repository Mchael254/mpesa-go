import { Authority } from "../common/authority";

export interface Profile {
  code: number,
  emailAddress: string,
  fullName: string,
  idNo: string,
  userName: string,
  teleponeNo: string,
  authorities?: Authority[],
  image?: any,
}
