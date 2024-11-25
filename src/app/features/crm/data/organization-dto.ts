import { CountryDto } from '../../../shared/data/common/countryDto';

export interface OrganizationDTO {
  address: {
    box_number: string;
    country_id: number;
    estate: string;
    fax: string;
    house_number: string;
    id: number;
    is_utility_address: string;
    phone_number: string;
    physical_address: string;
    postal_code: string;
    residential_address: string;
    road: string;
    state_id: number;
    town_id: number;
    utility_address_proof: string;
    zip: string;
  };
  country: CountryDto;
  currency_id: number;
  emailAddress: string;
  faxNumber: string;
  groupId: number;
  id: number;
  license_number: string;
  manager: number;
  motto: string;
  name: string;
  organizationGroupLogo: string;
  organizationLogo: string;
  organization_type: string;
  paybill: number;
  physicalAddress: string;
  pin_number: string;
  postalAddress: number;
  postalCode: string;
  primaryTelephoneNo: string;
  primarymobileNumber: string;
  registrationNo: string;
  secondaryMobileNumber: string;
  secondaryTelephoneNo: string;
  short_description: string;
  state: {
    country: CountryDto;
    id: number;
    name: string;
    shortDescription: string;
  };
  town: {
    country: string;
    id: number;
    name: string;
    shortDescription: string;
    state: string;
  };
  vatNumber: string;
  webAddress: string;
  bankBranchId: number;
  bankId: number;
  swiftCode: string;
  bank_account_name: string;
  bank_account_number: string;
  customer_care_email: string;
  customer_care_name: string;
  customer_care_primary_phone_number: number;
  customer_care_secondary_phone_number: number;
}

export interface PostOrganizationDTO {
  countryId: number;
  currency_id: number;
  emailAddress: string;
  faxNumber: string;
  groupId: number;
  id: number;
  license_number: string;
  manager: number;
  motto: string;
  name: string;
  organizationGroupLogo: string;
  organizationLogo: string;
  organization_type: string;
  physicalAddress: string;
  pin_number: string;
  postalAddress: string;
  postalCode: string;
  primaryTelephoneNo: string;
  primarymobileNumber: string;
  registrationNo: string;
  secondaryMobileNumber: string;
  secondaryTelephoneNo: string;
  short_description: string;
  stateId: number;
  townId: number;
  vatNumber: string;
  webAddress: string;
  bank_account_name: string;
  bank_account_number: string;
  swiftCode: string;
  bankId: number;
  bankBranchId: number;
  paybill: string;
  customer_care_email: string;
  customer_care_name: string;
  customer_care_primary_phone_number: string;
  customer_care_secondary_phone_number: string;
}

export interface OrganizationDivisionDTO {
  id: number;
  is_default_division: string;
  name: string;
  order: number;
  organization_id: number;
  short_description: string;
  status: string;
}

export interface OrganizationRegionDTO {
  agentSeqNo: string;
  branchMgrSeqNo: string;
  clientSequence: number;
  code: number;
  computeOverOwnBusiness: string;
  dateFrom: string;
  dateTo: string;
  managerAllowed: string;
  managerId: number;
  name: string;
  organization: string;
  overrideCommissionEarned: string;
  policySeqNo: number;
  postingLevel: string;
  preContractAgentSeqNo: number;
  shortDescription: string;
}

export interface PostOrganizationRegionDTO {
  agentSeqNo: string;
  branchMgrSeqNo: string;
  clientSequence: number;
  code: number;
  computeOverOwnBusiness: string;
  dateFrom: string;
  dateTo: string;
  managerAllowed: string;
  managerId: number;
  name: string;
  organizationId: number;
  overrideCommissionEarned: string;
  policySeqNo: number;
  postingLevel: string;
  preContractAgentSeqNo: number;
  shortDescription: string;
}

export interface YesNoDTO {
  name: string;
  value: string;
}

export interface ManagersDTO {
  agentShortDescription: string;
  id: number;
  name: string;
  townCode: number;
}

export interface OrganizationBranchDTO {
  bnsCode: number;
  countryId: number;
  countryName: string;
  emailAddress: string;
  generalPolicyClaim: string;
  id: number;
  logo: string;
  managerAllowed: string;
  managerId: number;
  managerName: string;
  managerSeqNo: string;
  name: string;
  organizationId: number;
  overrideCommissionAllowed: string;
  physicalAddress: string;
  policyPrefix: string;
  policySequence: number;
  postalAddress: string;
  postalCode: number;
  regionId: number;
  regionName: string;
  shortDescription: string;
  stateId: number;
  stateName: string;
  telephone: string;
  townId: number;
  townName: string;
}

export interface BranchDivisionDTO {
  branchId: number;
  branchName: string;
  divisionId: number;
  divisionName: string;
  id: number;
  withEffectiveFrom: string;
  withEffectiveTo: string;
}

export interface BranchContactDTO {
  branchId: number;
  designation: string;
  emailAddress: string;
  id: number;
  idNumber: string;
  mobile: string;
  name: string;
  physicalAddress: string;
  telephone: string;
}

export interface BranchAgencyDTO {
  agentCode: number;
  branchId: number;
  code: number;
  manager: string;
  managerAllowed: string;
  managerSequenceNo: string;
  name: string;
  overrideCommEarned: string;
  policySequenceNo: number;
  postLevel: string;
  propertySequenceNo: number;
  sequenceNo: string;
  shortDescription?: string;
  status: string;
}

export interface CrmApiResponse {
  message: string;
  status: number;
}

export interface OrgDivisionLevelTypesDTO {
  accountTypeCode: number,
  code: number,
  description: string,
  intermediaryCode: number,
  managerCode: number,
  payIntermediary: string,
  systemCode: number,
  type: string
}

export interface OrgDivisionLevelsDTO {
  code: number,
  description: string,
  divisionLevelTypeCode: number,
  ranking: number,
  type: string
}

export interface OrgPreviousSubDivHeadsDTO {
  agentCode: number,
  code: number,
  subdivisionCode: string,
  wef: string,
  wet: string
}
