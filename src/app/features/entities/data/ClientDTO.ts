import {ContactDetailsDTO} from "./AgentDTO";
import {ContactDetails} from "./accountDTO";

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
  clientTypeName: string
  clientFullName: string
  code:number, //added
  address?: AddressModel,
  contactDetails?: any,
  paymentDetails?: any,
  wealthAmlDetails?: any,
  clientCode?: number,
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
