/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/
import {Authority} from "./common/authority";

export interface WebAdmin {
  id: number;

  name: string;

  username: string;

  email: string;

  status: string;

  userType: string;

  telNo: string;

  phoneNumber: string;

  otherPhone: string;

  personelRank: string;

  countryCode: number;

  townCode: number;

  physicalAddress: string;

  postalCode: string;

  departmentCode: number;

  activatedBy: string;

  updateBy: string;

  dateCreated: Date ;

  granter: number;
  authorities: Authority[];
  emailAddress?: string;
  pinNumber: string;
}
