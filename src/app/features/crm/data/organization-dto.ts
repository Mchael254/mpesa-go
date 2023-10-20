import { CountryDTO } from "../../../shared/data/common/countryDto"

export interface OrganizationDTO {
  address: {
    box_number: string,
    country_id: number,
    estate: string,
    fax: string,
    house_number: string,
    id: number,
    is_utility_address: string,
    phone_number: string,
    physical_address: string,
    postal_code: string,
    residential_address: string,
    road: string,
    state_id: number,
    town_id: number,
    utility_address_proof: string,
    zip: string
  },
  country: CountryDTO,
  currency_id: number,
  emailAddress: string,
  faxNumber: string,
  groupId: number,
  id: number,
  license_number: string,
  manager: number,
  motto: string,
  name: string,
  organization_type: string,
  paybill: number,
  physicalAddress: string,
  pin_number: string,
  postalAddress: number,
  postalCode: string,
  primaryTelephoneNo: string,
  primarymobileNumber: string,
  registrationNo: string,
  secondaryMobileNumber: string,
  secondaryTelephoneNo: string,
  short_description: string,
  state: {
    country: CountryDTO,
    id: number,
    name: string,
    shortDescription: string
  },
  town: {
    country: string,
    id: number,
    name: string,
    shortDescription: string,
    state: string
  },
  vatNumber: string,
  webAddress: string,
  bankBranchId: number,
  bankId: number,
  swiftCode: string,
  bank_account_name: string,
  bank_account_number: string,
  customer_care_email: string,
  customer_care_name: string,
  customer_care_primary_phone_number: number,
  customer_care_secondary_phone_number: number,
}

export interface PostOrganizationDTO {
  countryId: number,
  currency_id: number,
  emailAddress: string,
  faxNumber: string,
  groupId: number,
  id: number,
  license_number: string,
  manager: number,
  motto: string,
  name: string,
  organization_type: string,
  physicalAddress: string,
  pin_number: string,
  postalAddress: string,
  postalCode: string,
  primaryTelephoneNo: string,
  primarymobileNumber: string,
  registrationNo: string,
  secondaryMobileNumber: string,
  secondaryTelephoneNo: string,
  short_description: string,
  stateId: number,
  townId: number,
  vatNumber: string,
  webAddress: string,
  bank_account_name: string,
  bank_account_number: string,
  swiftCode: string,
  bankId: number,
  bankBranchId: number,
  paybill: string,
  customer_care_email: string,
  customer_care_name: string,
  customer_care_primary_phone_number: string,
  customer_care_secondary_phone_number: string,
}

export interface OrganizationDivisionDTO {
  id: number,
  is_default_division: string,
  name: string,
  order: number,
  organization_id: number,
  short_description: string,
  status: string
}

export interface OrganizationRegionDTO {
  agentSeqNo: string,
  branchMgrSeqNo: string,
  clientSequence: number,
  code: number,
  computeOverOwnBusiness: string,
  dateFrom: string,
  dateTo: string,
  managerAllowed: string,
  managerId: number,
  name: string,
  organization: string,
  overrideCommissionEarned: string,
  policySeqNo: number,
  postingLevel: string,
  preContractAgentSeqNo: number,
  shortDescription: string
}

export interface PostOrganizationRegionDto {
  agentSeqNo: string,
  branchMgrSeqNo: string,
  clientSequence: number,
  code: number,
  computeOverOwnBusiness: string,
  dateFrom: string,
  dateTo: string,
  managerAllowed: string,
  managerId: number,
  name: string,
  organizationId: number,
  overrideCommissionEarned: string,
  policySeqNo: number,
  postingLevel: string,
  preContractAgentSeqNo: number,
  shortDescription: string
}

export interface YesNoDTO {
  name: string,
  value: string
}

export interface ManagersDTO {
  agentShortDescription: string,
  id: number,
  name: string,
  townCode: number
}
