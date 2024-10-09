export interface Leads {
  accountCode: number;
  activityCodes: [];
  annualRevenue: number;
  campCode: number;
  campTel: string;
  code: number;
  companyName: string;
  converted: string;
  countryCode: number;
  currencyCode: number;
  description: string;
  divisionCode: number;
  emailAddress: string;
  clientType: string;
  industry: string;
  leadDate: string;
  leadSourceCode: number;
  leadStatusCode: number;
  mobileNumber: string;
  occupation: string;
  organizationCode: number;
  otherNames: string;
  physicalAddress: string;
  postalAddress: string;
  postalCode: string;
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
