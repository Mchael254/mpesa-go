/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/
import {Agent} from "./common/agent";
import {Authority} from "./common/authority";


export interface AccountContact {
  acccCode: number;
  acccName: string;
  acccOtherNames: string;
  acccDob?: any;
  acccTel?: any;
  acccEmailAddr: string;
  acccSmsTel?: any;
  acccUsername: string;
  acccLoginAllowed: string;
  acccPwdChanged: string;
  acccPwdReset: string;
  acccDtCreated: string;
  acccStatus: string;
  acccLoginAttempts: number;
  acccPersonelRank: string;
  acccLastLoginDate: string;
  acccCreatedBy: string;
  acccAccType: string;
  acccAccCode: number;
  acccAgnCode: number;
  acccSysCode?: any;
  acccTsaCode?: any;
  acccUserType?: string;
  acccIdNumber?: string;
  agent?: Agent;
  // authorities
  authorities: Authority[];
  emailAddress?: string;
}
