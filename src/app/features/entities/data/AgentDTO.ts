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
  // address: AddressDTO;
  agentRequestDto: AgentRequestDTO;
  // contactDetails: ContactDetailsDTO;
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

