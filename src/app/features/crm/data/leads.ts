export interface Leads {
  accountCode: number;
  activityCodes: [];
  annualRevenue: number;
  campCode: number;
  campTel: string;
  clientType: string;
  code: number;
  companyName: string;
  converted: string;
  countryCode: number;
  currencyCode: number;
  dateOfBirth: string;
  description: string;
  divisionCode: number;
  emailAddress: string;
  gender: string;
  idNumber: string;
  industry: string;
  leadComments: LeadCommentDto[];
  leadDate: string;
  leadSourceCode: number;
  leadStatusCode: number;
  mobileNumber: string;
  modeOfIdentity: string;
  occupation: string;
  organizationCode: number;
  otherNames: string;
  physicalAddress: string;
  postalAddress: string;
  postalCode: string;
  potentialAmount: number;
  potentialCloseDate: string;
  potentialContributor: string;
  potentialName: string;
  potentialSaleStage: string;
  productCode: number;
  stateCode: number;
  surname: string;
  systemCode: number;
  teamCode: number;
  title: string;
  townCode: number;
  userCode: number;
  userName: string;
  website: string;
}

export interface LeadSourceDto {
  code: number;
  description: string;
}

export interface LeadStatusDto {
  code: number;
  description: string;
}

export interface LeadActivityDto {
  activityCode: number;
  code: number;
  leadCode: number;
}

export interface LeadCommentDto {
  code: number;
  comment: string;
  date: string;
  disposition: string;
  leadCode: number;
  userCode: number;
}
