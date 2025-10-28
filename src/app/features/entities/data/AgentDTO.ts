export interface IntermediaryDTO {
  accountCode: number;
  // address: AddressDTO,
  agentRequestDto: AgentRequestDTO,
  clientDetails: {
    category: string;
    citizenshipCountry: number;
    clientId: number;
    clientType: {
      category: string;
      clientTypeName: string;
      code: number;
      description: string;
      person: string;
    },
    clientTypeId: number;
    firstName: string;
    gender: string;
    lastName: string;
    nextOfKinDetails: {
      accountId: number;
      emailAddress: string;
      fullName: string;
      id: number;
      identityNumber: string;
      modeOfIdentityId: number;
      phoneNumber: string;
      relationship: string;
      smsNumber: string;
    },
    // wealthDetails: WealthDetailsDTO
  },
  // contactDetails: ContactDetailsDTO,
  createdBy: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  id: number;
  partyId: number;
  partyTypeShortDesc: string;
  // paymentDetails: PaymentDetailsDTO
}

export interface AgentDTO {
  id?: number;
  name?: string;
  shortDesc?: string;
  emailAddress?: string;
  insurerId?: number;
  organizationId?: number;
  agentLicenceNo?: string;
  withHoldingTax?: number;
  agentStatus?: string;
  blackListReason?: string;
  accountTypeId?: number;
  accountType?: string;
  businessUnit?: string;
  country?: string;
  countryCode?: number;
  createdBy?: string;
  creditLimit?: number;
  dateOfBirth?: string;
  faxNo?: string;
  gender?: string;
  is_credit_allowed?: string;
  modeOfIdentity?: string;
  phoneNumber?: string;
  physicalAddress?: string;
  pinNo?: string;
  primaryType?: string;
  smsNumber?: string;
  stateCode?: number;
  townCode?: number;
  vatApplicable?: string;
  withEffectFromDate?: string;
  withHoldingTaxApplicable?: string;
  status?: string;

  agentIdNo?: string;
  branchId?: number;
  category?: string;

}

export interface AgentRequestDTO {
  /*accountTypeId: number;
  agentIdNo: string;
  agentLicenceNo: string;
  agentStatus: string;
  category: string;
  creditLimit: number
  gender: string;
  is_credit_allowed: string;
  name: string;
  vatApplicable: string;
  withHoldingTax: number;
  withHoldingTaxApplicable: string;*/
  agentLicenceNo: string,
  is_credit_allowed: string,
  creditLimit: string,
  systemId: number,
  vatApplicable: string,
  withHoldingTax: number,
  agentIdNo: string,
  branchId: string
}
export interface AccountTypeDTO {
  accountType: string;
  id: number;
  shortDescription: string;
  typeId: string;
}

export interface AgentPostDTO {
  address: AddressDTO;
  agentRequestDto: AgentRequestDTO;
  contactDetails: ContactDetailsDTO;
  partyId: number;
  partyTypeShortDesc: string;
  createdBy: string,
  effectiveDateFrom: string,
  effectiveDateTo: string,
  modeOfIdentityid: number,
  category: string,
  countryId: string,
  gender: string,
  status: string,
  dateCreated: string,
  pinNumber: string,
  accountType: number,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  organizationId: number
}

export interface ContactDetailsDTO {
  emailAddress: string;
  id: number;
  phoneNumber: string;
  receivedDocuments: string;
  smsNumber: string;
  titleShortDescription: string;
}

export interface AddressDTO {
  box_number: string;
  country_id: number;
  estate: string;
  fax: string;
  house_number: string;
  id: number;
  is_utility_address: string;
  physical_address: string;
  postal_code: string;
  residential_address: string;
  road: string;
  state_id: number;
  town_id: string;
  zip: string;
}

export interface AgentV2DTO {
  intermediaryCode?: number,
  partyId?: number,
  category: string,
  dateOfBirth: string,
  withEffectFromDate: string,
  withEffectToDate: string,
  name: string,
  shortDescription?: string,
  accountManagerCode?: number,
  businessChannelCode?: number,
  licenced?: string,
  licenceNumber: string,
  countryId: number,
  idNumber: string,
  pinNumber: string,
  modeOfIdentityId?: number,
  organizationId?: string,
  accountTypeId: number,
  gender: string,
  branchId?: number,
  address: AddressV2DTO,
  contactDetails: ContactDetailsV2DTO[],
  paymentDetails: PaymentDetailsDTO,
  wealthAmlDetails: WealthAmlDetailsDTO[],
  ownershipDetails?: OwnershipDTO[],
  referees: IntermediaryRefereeDTO[],
  status?: string,
  maritalStatus: string,
}

export interface AddressV2DTO {
  id?: number,
  boxNumber?: string,
  postalCode: string,
  townId: number,
  stateId: number,
  countryId: number,
  physicalAddress: string,
  residentialAddress?: string,
  road?: string,
  estate?: string,
  houseNumber?: string,
  isUtilityAddress?: string,
  utilityAddressProof?: string,
  fax?: string,
  zip?: string,
  phoneNumber?: string,
  accountId?: number
}

export interface ContactDetailsV2DTO {
  id?: number,
  titleId: number,
  principalContactName?: string,
  receivedDocuments?: string,
  emailAddress: string,
  smsNumber: string,
  phoneNumber: string,
  accountId?: number,
  socialMediaUrl?: string,
  websiteUrl?: string,
  contactChannel: string,
  whatsappNumber: string,
  faxNumber?: string,
  emailVerified?: string,
  phoneVerified?: string
}

export interface PaymentDetailsDTO {
  id?: number,
  bankBranchId: number,
  currencyId?: number,
  accountNumber: string,
  effectiveFromDate?: string,
  effectiveToDate?: string,
  isDefaultChannel?: string,
  partyAccountId?: number,
  preferredChannel?: string,
  swiftCode?: string,
  vatApplicable: string,
  commissionAllowed: string,
  creditAllowed?: string,
  commissionStatusDate: string,
  commissionEffectiveDate: string,
  creditLimit: number,
  taxAuthorityCode: string,
  paymentTerms: string,
  paymentFrequency: string,
  glAccountNumber: string,
  withholdingTax?: number,
  withholdingTaxApplicable?: string,
  mpayno?: string,
  iban?: string
}

export interface IntermediaryRefereeDTO {
  id?: number,
  name: string,
  physicalAddress: string,
  postalAddress: string,
  townCode?: number,
  countryCode?: number,
  emailAddress: string,
  telephone: string,
  idNumber: string,
  agencyCode?: number,
  preferredCommunicationChannel: number,
  status: string,
}

export interface WealthAmlDetailsDTO {
  id?: number,
  nationalityCountryId: number,
  citizenshipCountryId?: number,
  fundsSource: string,
  employmentStatus?: string,
  maritalStatus?: string,
  occupationId?: number,
  sectorId?: number,
  tradingName?: string,
  registeredName?: string,
  certificateRegistrationNumber?: string,
  certificateYearOfRegistration?: string,
  sourceOfWealthId?: number,
  parentCountryId?: number,
  operatingCountryId?: number,
  crFormRequired?: string,
  crFormYear?: number,
  partyAccountId?: number,
  insurancePurpose?: string,
  premiumFrequency?: string,
  distributeChannel?: string,
  parentCompany?: string,
  category?: string,
  modeOfIdentity: number,
  idNumber: string,
  cr12Details?: Cr12DetailsDTO[],
}

export interface Cr12DetailsDTO {
  directorName: string,
  directorIdRegNo: string,
  directorDob: string,
  directorTitle: string,
  cr12Code: number,
  clientCode: number,
  amlCode: number,
  wealthDetailsCode: number,
  certificateReferenceNo: string,
  certificateRegistrationYear: string,
  createdBy: string,
  createdDate: string,
  certificateName: string,
  address: string,
  category: string
}

export interface OwnershipDTO {
  code: number,
  accountCode: number,
  idNumber: string,
  name: string,
  contactPersonPhone: string,
  percentOwnership: number,
}
