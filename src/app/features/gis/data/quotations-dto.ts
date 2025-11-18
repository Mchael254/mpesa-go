interface QuotationProduct {
  agentShortDescription: string;
  binder: string;
  code: number;
  commission: number;
  proCode: number;
  productShortDescription: string;
  quotCode: number;
  quotationNo: string;
  revisionNo: number;
  totalSumInsured: number;
  wef: string;
  wet: string;
}

interface SectionDetails {
  calculationGroup: number;
  code: number;
  description: string;
  freeLimit: any;
  limitAmount: number;
  premium: number;
  rate: number;
  rateType: string;
  rowNumber: number;
  sectionShortDescription: string;
}

interface RiskInformation {
  code: number;
  covertypeShortDescription: string;
  covertypecode: number;
  propertyId: string;
  quotationCode: number;
  quotationRiskNo: string;
  scheduleDetails: any;
  sectionDetails: SectionDetails[];
  value: number;
}

interface Source {
  applicableModule: string;
  code: number;
  description: string;
  status: string;
  sumInsured: number;
}

interface TaxInformation {
  amount: number;
  description: number;
  quotationRate: number;
  rateType: string;
}

export interface QuotationsDTO_2 {
  agentCode: number;
  branch: any;
  clientCode: number;
  commissionAmount: number;
  coverFrom: string;
  coverTo: string;
  currency: string;
  dateCreated: string;
  expiryDate: string;
  frequencyOfPayment: string;
  likelihood: string;
  marketerCommissionAmount: any;
  no: string;
  premium: number;
  quotationProduct: QuotationProduct[];
  riskInformation: RiskInformation[];
  source: Source;
  status: string;
  sumInsured: number;
  taxInformation: TaxInformation[];
}

export interface QuotationsDTO {
  /*quotationNumber: string,
  product: string,
  status: string,
  coverFrom: string,
  coverTo: string,
  premium: string*/
  expiry_date: string;
  no: string;
  premium: number;
  quotation_product: [
    {
      code: number;
      product: {
        accept_unique_risks: string;
        accepts_multiple_classes: string;
        allow_accommodation: string;
        allow_motor_class: string;
        allow_open_policy: string;
        allow_same_day_renewal: string;
        are_installment_allowed: string;
        auto_generate_cover_note: string;
        auto_post_reinsurance: string;
        check_schedule: string;
        claim_prefix: string;
        claim_screen_code: string;
        code: number;
        commission_rate: number;
        description: string;
        do_full_remittance: string;
        does_escalation_reduction_apply: string;
        enable_spare_parts: string;
        enable_web: string;
        endorsement_minimum_premium: number;
        expires: string;
        industry_code: number;
        insurance_type: string;
        insured_accumulation_limit: number;
        interface_type: string;
        is_assignment_allowed: string;
        is_default: string;
        is_loan_applicable: string;
        is_marine: string;
        is_pin_required: string;
        is_policy_number_editable: string;
        is_renewable: string;
        maximum_age: number;
        maximum_extensions: number;
        maximum_term: number;
        minimum_age: number;
        minimum_premium: number;
        minimum_sub_classes: number;
        minimum_term: number;
        open_cover: string;
        order: number;
        organization_code: number;
        policy_accumulation_limit: number;
        policy_code_pages: number;
        policy_document_pages: number;
        policy_prefix: string;
        policy_word_document: string;
        prerequisite_product_code: number;
        product_group_code: number;
        product_report_groups_code: number;
        product_type: string;
        prorata_type: string;
        schedule_order: 2;
        short_description: number;
        short_name: string;
        show_fap: string;
        show_on_web_portal: string;
        show_sum_insured: string;
        term_distribution: 2;
        total_company_accumulation_limit: number;
        underwriting_screen_code: string;
        web_details: string;
        with_effect_from: string;
        with_effect_to: string;
        years: number;
      };
    }
  ];
  status: string;
  cover_from: string;
  cover_to: string;
  client_code: number;
}
export interface PolicyData {
  wefDate: string;
  wetDate: string;
  productCode: number;
  binderPolicy: string;
  bindCode: number;
  branchCode: number;
  action: string;
  currencyCode: number;
  currencyRate: number;
  agentCode: number;
  agentShortDescription: string;
  introducerCode: number;
  internalComments: string;
  source: string;
  clientCode: number;
  polPropHoldingCoPrpCode: number;
  chequeRequisition: boolean;
  divisionCode: number;
  polSubAgnCode: number;
  clientType: string;
  quotPrsCode: number;
  polMktrAgnCode: number;
  comments: string;
  gisPolicyNumber: string;
  polPipPfCode: number;
  endorsementStatus: string;
  polEnforceSfParam: string;
  polCrDateNotified: string;
  multiUser: string;
  unitCode: number;
  locationCode: number;
}

export interface QuotationDTO {
  quotationCode: number;
  quotationNo: string;
  policyData: PolicyData[];
  user: string;
  quotStage: string;
}

export interface riskClause {
  clauseCode: number;
  clauseShortDescription: string;
  quotationCode: number;
  riskCode: number;
  clause: string;
  clauseEditable: string;
  clauseType: string;
  clauseHeading: string;
}

export interface riskPeril {
  code?:number;
  quotationCode: number;
  quotationRiskCode: number;
  subclassSectionPerilCode?: number;
  perilLimit: number;
  perilType: string;
  sumInsuredOrLimit: string;
  excessType: string;
  excess: number;
  excessMinimum: number;
  excessMaximum: number;
  expireOnClaim: string;
  personLimit: number;
  claimLimit: number;
  description: string;
}


export interface LimitPremiumDto {
  sectCode: number;
  premium: number;
}

export interface RiskLevelPremiumDto {
  code: number;
  premium: number;
  limitPremiumDtos: LimitPremiumDto[];
}

export interface TaxDto {
  code: number;
  premium: number;
  description: string;
}

export interface UpdatePremiumDto {
  premiumAmount: number;
  productCode: number;
  quotProductCode: number;
  productPremium: number;
  riskLevelPremiums: RiskLevelPremiumDto[];
  taxes: TaxDto[];
}

export interface AgentDto {
  id: number;
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  businessUnit: string;
  primaryType: string;
  countryCode: number;
  gender: string;
  status: string;
  accountTypeId: number;
  accountType: string;
  is_credit_allowed?: string;
  creditLimit?: number;
  category: string;
  shortDesc: string;
}

export interface SortDto {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: boolean;
  descending: boolean;
}

export interface PageableDto {
  pageNumber: number;
  pageSize: number;
  sort: SortDto[];
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface AgentResponseDto {
  content: AgentDto[];
  pageable: PageableDto;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: SortDto[];
  numberOfElements: number;
  empty: boolean;
}


export interface PolicyElectronicDataDTO {
  id: number;
  policyBatchNo: number;
  transactionType: string;
  agentClientId: string;
  agentClientName: string;
  agentClientSurname: string;
  withEffectFrom: string;
  agentPolicyId: string;
  insuranceClass: string;
  coverType: string;
  withEffectTo: string;
  transactionDateString: string;
  transactionNo: string;
  premium: number;
  taxes: number;
  propertyId: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  cubicCapacity: string;
  engineNumber: string;
  chassisNumber: string;
  sumInsured: number;
  sectionColumn1: number;
  sectionColumn3: number;
  sectionColumn2: number;
  propertyCode: number;
  subclassCode: string;
  coverTypeCode: number;
  coverTypeShortDesc: string;
  gisIpuPropertyId: string;
  transactOnlyCheck: string;
  sectionColumn4: number;
  transferred: string;
  gisClientCode: number;
  gisIpuCode: number;
  policyNumber: string;
  notTransferredReason: string;
  authorized: string;
  authorizationDate: string;
  pdcTransferred: string;
  certificateNumber: string;
  clientTypeCode: number;
  agentCode: number;
  lotId: string;
  clientTypeShortDesc: string;
  quotationCode: number;
  quotationProductCode: number;
  binderCode: number;
  productCode: number;
  sectionColumn5: number;
  sectionColumn6: number;
  sectionColumn7: number;
  sectionColumn8: number;
  sectionColumn9: number;
  sectionColumn10: number;
  newClientFlag: string;
  sectionColumn1Rate: number;
  sectionColumn2Rate: number;
  sectionColumn3Rate: number;
  sectionColumn4Rate: number;
  sectionColumn5Rate: number;
  sectionColumn6Rate: number;
  sectionColumn7Rate: number;
  sectionColumn8Rate: number;
  sectionColumn9Rate: number;
  sectionColumn10Rate: number;
  proRataFlag: string;
  duplicatedFlag: string;
  formMNumber: string;
  cfValue: string;
  marineValue: number;
  sectionColumn11: number;
  sectionColumn12: number;
  sectionColumn13: number;
  sectionColumn14: number;
  sectionColumn15: number;
  sectionColumn16: number;
  sectionColumn17: number;
  sectionColumn18: number;
  sectionColumn19: number;
  sectionColumn20: number;
  sectionColumn11Rate: number;
  sectionColumn12Rate: number;
  sectionColumn13Rate: number;
  sectionColumn14Rate: number;
  sectionColumn15Rate: number;
  sectionColumn16Rate: number;
  sectionColumn17Rate: number;
  sectionColumn18Rate: number;
  sectionColumn19Rate: number;
  sectionColumn20Rate: number;
  color: string;
  engine: string;
  suspendCancelledFlag: string;
  dateSuspendCancelled: string;
  policyCoverFrom: string;
  policyCoverTo: string;
  currency: string;
  policyCoinsuranceFlag: string;
  policyCoinsuranceLeaderFlag: string;
  policyCoinsurancePercentage: number;
  clientName: string;
  clientShortDesc: string;
  nationalId: string;
  clientPin: string;
  postalAddress: string;
  postalTown: string;
  postalCode: string;
  clientTelephoneNumber: string;
  clientMobileNumber: string;
  clientCountry: string;
  policyRenewableFlag: string;
  policySumInsured: number;
  facultativePolicyFlag: string;
  branch: string;
  insuredName: string;
  insuredNationalId: string;
  insuredPin: string;
  insuredPostalAddress: string;
  insuredPostalTown: string;
  insuredPostalCode: string;
  insuredTelephoneNumber: string;
  insuredMobileNumber: string;
  policyRiskCoverFrom: string;
  policyRiskCoverTo: string;
  policyLoadedFlag: string;
  commissionRate: number;
  preparedBy: string;
  authorisedBy: string;
  stampDuty: number;
  trainingLevy: number;
  phf: number;
  commission: number;
  endorsementNumber: string;
  debitCreditNoteNumber: string;
  underwritingYear: number;
  riskDescription: string;
  temp: string;
  policyClientType: string;
  policyClientTitle: string;
  gisSubclassCode: number;
  postedDate: string;
  loadedFlag: string;
  subclassShortDesc2: string;
  subclassShortDesc3: string;
  subclassShortDesc4: string;
  subclassShortDesc5: string;
  subclassShortDesc6: string;
  subclassPremium: number;
  subclassPremium2: number;
  subclassPremium3: number;
  subclassPremium4: number;
  subclassPremium5: number;
  subclassPremium6: number;
  totalPremium: number;
  totalSubclass: number;
  policyUnderwritingYear: number;
  transactionDate: string;
  transactionNumber: number;
  policyUnderwritingOnlyFlag: string;
  ipuRiskNote: string;
  insuredEmailAddress: string;
  clientDateOfBirth: string;
  insuredDateOfBirth: string;
  awrCode: number;
  awpCode: number;
  emailAddress: string;
  origin: string;
  pecCarryCapacity: string;
  bodyType: string;
  registrationNumber: string;
  branchShortDesc: string;
  livestockOwnerMark: string;
  livestockInsurerTag: string;
  livestockPurpose: string;
  livestockStockType: string;
  livestockBreed: string;
  livestockSex: string;
  livestockAge: number;
  livestockNumber: number;
  livestockValue: number;
  riskNote: string;
  carryingCapacity: number;
  driverEmail: string;
  driverName: string;
  driverTelephoneNumber: string;
  insuredIsDriverFlag: string;
  yearOfBuilt: number;
  vesselType: string;
  clause: string;
  category: string;
  conveyance: string;
  country: string;
  proformaInvoiceValue: number;
  proformaInvoiceNumber: string;
  proformaInvoiceDate: string;
  portOfDestination: string;
  paymentDate: string;
  certNo: string;
  tin: string;
  excess: string;
  subCategory: string;
  riskLocation: string;
  riskTown: string;
  territory: string;
  isNewRisk: string;
  partShipment: string;
  riskAddress: string;
  calcMaxExposure: string;
  maxExposureAmount: number;
  surveyRisk: string;
  certificateDate: string;
  dischargePort: string;
  shipmentPercentage: number;
  landingStatus: string;
  scheduleBasicRate: number;
  scheduleCargoDescription: string;
  scheduleContainerizedFlag: string;
  scheduleCurrency: string;
  scheduleInvoicedValue: number;
  scheduleMarinePolicyType: string;
  scheduleNatureOfCargo: string;
  scheduleSailingFrom: string;
  scheduleSailingTo: string;
  scheduleVesselName: string;
  sectionColumn1BaseAmount: number;
  sectionColumn1BaseExchangeRate: number;
  sectionColumn1LoadingRate: number;
}
