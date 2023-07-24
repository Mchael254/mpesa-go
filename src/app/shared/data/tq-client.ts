/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/
export interface TqClient {
  clntId: string;
  clntCode: number;
  clntShtDesc: string;
  clntName: string;
  clntSurname: string;
  clntOtherNames: string;
  clntIdRegDoc: string;
  clntIdRegNo: string;
  clntDob: Date;
  clntCountry: string;
  clntTelNo: string;
  clntMoblNo: string;
  clntPin: string;
  clntEmailAddrs: string;
  clntSmsTel: string;
  clntStatus: string;
  clntType: string;
  clntTitle?: any;
  clntGender: string;
  clntPassportNo: string;
  clntMaritalStatus: string;
  clntPostalAddrs: string;
  clntPwd?: string;
  clntDateCreated?: string;
  clntCreatedBy?: string;
  clntUpdateDt?: string;
  clntUpdatedBy?: string;
  clntWef?: string;
}

