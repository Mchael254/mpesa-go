import { CountryDto } from "src/app/shared/data/common/countryDto"
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
  modeOfIdentityDto: IdentityModeDTO,
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
export interface CreateServiceProviderDTO {
  tradeName: string,
  parentCompany: string,
  systemShtDesc: string,
  systemId: number,
  providerLicenseNo: string,
  vatNumber: string
  id: number,
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


