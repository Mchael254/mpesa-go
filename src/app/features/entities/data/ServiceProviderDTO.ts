import { IdentityModeDTO } from "./entityDto"

export interface ServiceProviderDTO {
    category?: string,
    country?: {
      id?: number,
      name?: string,
      short_description?: string
    },
    createdBy?: string,
    dateCreated?: string,
    dateOfRegistration?: string,
    effectiveDateFrom?: string,
    emailAddress?: string,
    gender?: string,
    id?: number,
    idNumber?: string,
    modeOfIdentity?: string,
    modeOfIdentityDto?: string,
    name?: string,
    organizationId?: number,
    parentCompany?: string,
    partyId?: number,
    phoneNumber?: string,
    physicalAddress?: string,
    pinNumber?: string,
    postalAddress?: string,
    providerLicenseNo?: string,
    providerStatus?: string,
    spEntityType?:string,
    providerType?: {
      code?: number,
      name?: string,
      providerTypeSuffixes?: string,
      shortDescription?: string,
      shortDescriptionNextNo?: string,
      shortDescriptionSerialFormat?: string,
      status?: string,
      vatTaxRate?: string,
      witholdingTaxRate?: string
    },
    shortDescription?: string,
    smsNumber?: string,
    status?: string,
    system?: string,
    systemCode?: number,
    title?: string,
    tradeName?: string,
    type?: string,
    vatNumber?: string
}


export interface ServiceProviderRes {
  category: string,
  country: CountryDto,
  createdBy: string,
  dateCreated: string,
  effectiveDateFrom: string,
  emailAddress: string,
  gender: string,
  id: number,
  idNumber: string,
  modeOfIdentity: string,
  modeOfIdentityDto: IdentityModeDto,
  name: string,
  parentCompany: string,
  partyId: number,
  phoneNumber: string,
  physicalAddress: string,
  pinNumber: string,
  postalAddress: string,
  providerLicenseNo: string,
  providerStatus: string,
  providerType: ProviderTypeDto,
  shortDescription: string,
  smsNumber: string,
  system: string,
  systemCode: number,
  title:  string,
  tradeName: string,
  type: string,
  vatNumber: string,
  status?: string,
}
  /*name: string;
  entityType: string;
  category: string;
  idType: string;
  idNumber: string;*/

  // countryId: 0
 /* effectiveDateFrom: string,
  gender: string,
  id: number,
  phoneNumber: string,
  physicalAddress: string,
  pinNumber: string,
  postalAddress: string,
  providerLicenseNo: string,
  providerStatus: string,
  providerTypeId: number,
  shortDescription: string,
  smsNumber: string,
  type: string,
  vatNumber: string,
  citizenship_country_id: number,
  dateCreated: string
  modeOfIdentity: string,
  status: string,*/

export interface ServiceProviderRequestDTO {
  /*category: string,
  citizenship_country_id: number,
  dateCreated: string,
  effectiveDateFrom: string,
  gender: string,
  id: number,
  idNumber: string,
  modeOfIdentity: string,
  // name: string,
  parentCompany: string,
  pinNumber: string,
  providerLicenseNo: null,
  providerStatus: string,
  providerTypeId: number,
  shortDescription: null,
  status: string,
  systemId: number,
  systemShtDesc: string,
  tradeName: string,
  type: string,
  vatNumber: string,
  yearOfRegistration: string,*/
  tradeName: string,
  parentCompany: string,
  systemShtDesc: string,
  systemId: number,
  providerLicenseNo: string,
  vatNumber: string
  id: number,
}
//mode of identity is provider type
export interface ProviderTypeDto {
  /*id: number,
  identityFormat: string,
  identityFormatError: string,
  name: string,
  organizationId: number*/
  code: number,
  shortDescription: string,
  name: string,
  status: string,
  witholdingTaxRate: null,
  vatTaxRate: null,
  providerTypeSuffixes: string,
  accountNextNo: null,
  accountSerialFormat: null,
  shortDescriptionSerialFormat: string,
  shortDescriptionNextNo: string
}
export interface AddressDTO {
  box_number: string;
  country_id: number;
  estate: string;
  fax: string;
  house_number: string;
  id: number;
  is_utility_address: string;
  phoneNumber: string;
  physical_address: string;
  postal_code: string;
  residential_address: string;
  road: string;
  state_id: number;
  town_id: number;
  zip: string;
  utility_address_proof: string;
}
export interface ContactsDTO {
  emailAddress: string;
  id: number;
  phoneNumber: string;
  receivedDocuments: string;
  smsNumber: string;
  titleShortDescription: string;
  preferredChannel: string
}
export interface PaymentDTO {
  account_number: string;
  bank_branch_id: number;
  currency_id: number;
  effective_from_date: string;
  effective_to_date: string;
  id: number;
  is_default_channel: string;
}
export interface WealthDTO {
  citizenship_country_id: number;
  cr_form_required: string;
  cr_form_year: number;
  funds_source: string;
  id: number;
  is_employed: string;
  is_self_employed: string;
  marital_status: string;
  nationality_country_id: number;
  occupation_id: number;
  partyAccountId: number;
  sector_id: number;
}
export interface SectorDto {
  id: number,
  shortDescription: string,
  name: string,
  sectorWefDate: string,
  sectorWetDate: string
}

export interface CountryDto {
  id: number,
  short_description: string,
  name: string
}

export interface CurrenciesDto {
  id: number,
  symbol: string,
  name: string,
  roundingOff: number,
  numberWord: string,
  decimalWord: string
}

export interface BanksDto {
  id: number,
  name: string,
  short_description: string
}

export interface BankBranchesDto {
  id: number,
  name: string,
  short_description: string,
  bank_id: number,
  createdBy: string
}

export interface ClientTitlesDto {
  id: number,
  shortDescription: string,
  description: string,
  gender: string
}

export interface CountyDto {
  id: number,
  name: string,
  short_description: string
}

export interface TownDto {
  id: number,
  name: string,
  short_description: string
}

export interface OccupationDto {
  id: number,
  shortDescription: string,
  name: string,
  wefDate: string,
  wetDate: string
}

export interface IdentityModeDto {
  id: number,
  identityFormat: string,
  identityFormatError: string,
  name: string,
  organizationId: number
}
 export interface MandatoryFieldsDTO {
   id: number,
   fieldName: string,
   fieldLabel: string,
   mandatoryStatus: string,
   visibleStatus: string,
   disabledStatus: string,
   frontedId: string,
   screenName: string,
   groupId: string,
   module: string
 }
 export interface EntityDto {
  categoryName: string;
  countryId: number;
  dateOfBirth: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  id: number;
  modeOfIdentity: IdentityModeDTO,
  identityNumber: number;
  name: string;
  organizationId: number;
  pinNumber: string;
  profilePicture: string;
  profileImage: string;
  partyTypeId?: number;
}
