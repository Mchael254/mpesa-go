import {ContactDetailsDTO} from "./AgentDTO";


export interface AddressModel {
  id: number;
  accountId: number;
  houseNumber: string;
  road: string;
  estate: string | null;
  townId: number;
  stateId: number;
  countryId: number;
  phoneNumber: string;
  fax: string | null;
  postalCode: string;
  zip: string | null;
  boxNumber: string;
  physicalAddress: string;
  residentialAddress: string;
  isUtilityAddress: 'Y' | 'N';
  utilityAddressProof: string;
  createdBy: string | null;
  createdDate: string | null;
  modifiedBy: string | null;
  modifiedDate: string | null;
  countryName?: string;
  stateName?: string;
  townName?: string;
}

export interface ContactPerson {
  code: number;
  clientCode: number;
  clientTitleCode: number;
  clientTitle: string | null;
  name: string;
  idNumber: string;
  email: string;
  mobileNumber: string;
  wef: string; // ISO date string
  wet: string; // ISO date string
  postalAddress: string;
  physicalAddress: string;
  sectorCode: number;
}

export interface ContactPersonsResponse {
  contactPersons: ContactPerson[];
}

export interface ContactDetails {
  id: number;
  title: ClientTitlesDto;
  titleId: number | null;
  principalContactName: string;
  receivedDocuments: string;
  emailAddress: string;
  smsNumber: string;
  phoneNumber: string;
  accountId: number;
  socialMediaUrl: string;
  websiteUrl: string;
  contactChannel: string;
  whatsappNumber: string;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
  faxNumber: string;
  emailVerified: string;
  phoneVerified: string;
  branchName?: string;
  branchId?: number;
  telephoneNumber?: string;
  email?: string;
}

export interface Branch {
  code: number;
  clientCode: number;
  shortDesc: string;
  countryId: number;
  stateId: number;
  townId: number;
  physicalAddress: string;
  postalAddress: string;
  postalCode: string;
  email: string;
  landlineNumber: string;
  mobileNumber: string;
  countryName: string;
  townName: string;
  stateName: string;
  branchName: string;
}



export interface ClientDTO {
  branchCode: number,
  category: string,
  clientTitle: string,
  clientType: ClientTypeDTO,
  country: number,
  mobileNumber: string | null;
  state: string | null;
  town: string | null;
  createdBy: string,
  dateOfBirth: string,
  emailAddress: string,
  firstName: string,
  gender: string,
  id: number,
  idNumber: string,
  lastName: string,
  modeOfIdentity: string,
  occupation: {
    id: number,
    name: string,
    sector_id: number,
    short_description: string
  },
  passportNumber: string,
  phoneNumber: string,
  physicalAddress: string,
  pinNumber: string,
  shortDescription: string,
  status: string,
  withEffectFromDate: string,
  withEffectToDate: string,
  clientTypeName: string
  clientFullName: string
  code:number, //added
  address?: AddressModel,
  branches?: Branch[],
  contactDetails?: ContactDetails,
  contactPersons?: ContactPerson[],
  paymentDetails?: any,
  wealthAmlDetails?: any,
  clientCode?: number,
  organizationBranchId?: number,
  organizationBranchName?: string,
  citizenshipCountryName?: string,
  citizenshipCountryId?: string,
  maritalStatus?: string,
}

export interface ClientTypeDTO {
  category: string,
  clientTypeName: string,
  code: number,
  description: string,
  organizationId: number,
  person: string,
  type: string
}

export interface ClientBranchesDto {
  id: number,
  shortDescription: string,
  name: string,
  physicalAddress: null,
  emailAddress: null,
  postAddress: null,
  town: null,
  country: null,
  contact: null,
  manager: null,
  telephoneNumber: null,
  fax: null,
  state: null,
  account: null,
  region: null,
  postalCode: null,
  logo: null,
  emailSource: null,
  sms_source: null,
  organizationId: null
}
export interface ClientPostDTO {
  createdBy: string;
  firstName: string;
  gender: string;
  id: number;
  lastName: string;
  pinNumber: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  partyId: number;
  status: string;
  partyTypeShortDesc: string;
  category: string;
  countryId: number,
  dateCreated: string,
  accountType: number,
  dateOfBirth: string,
  organizationId: number,
  modeOfIdentityid: number,
  nextOfKinDetailsList: null,
  // wealthAmlDetails:WealthDTO;
  // address: AddressDTO;
  // contactDetails:ContactsDTO;
  // paymentDetails:PaymentDTO;
  clientDetails:ClientDetailsDto;
}
export interface ClientDetailsDto {
  clientBranchCode: number,
}
export interface ClientTitlesDto {
  id: number,
  shortDescription: string,
  description: string,
  gender: string,
  organizationId: number
}
