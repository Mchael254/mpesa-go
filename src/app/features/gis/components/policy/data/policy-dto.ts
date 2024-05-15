export interface Policy {
  actionType: string;
  addEdit: string;
  agentCode: number;
  agentShortDescription: string;
  batchNumber: number;
  bdivCode: number;
  bindCode: number;
  branchCode: number;
  branchShortDescription: string;
  clientCode: number;
  clientType: string;
  coinLeaderCombined: string;
  coinsuranceFacultativeCession: string;
  comments: string;
  consCode: string;
  currencyCode: number;
  currencySymbol: string;
  frequencyOfPayment: string;
  internalComments: string;
  introducerCode: number;
  isAdminFeeAllowed: string;
  isBinderPolicy: string;
  isCashbackApplicable: string;
  isCoinsurance: string;
  isCommissionAllowed: string;
  isExchangeRateFixed: string;
  isOpenCover: string;
  paymentMode: string;
  proInterfaceType: string;
  productCode: number;
  source: string;
  transactionType: string;
  withEffectiveFromDate: string;
  withEffectiveToDate: string;
}

export interface InsuredClient {
  first_name: string;
  id: number;
  last_name: string;
}

export interface Section {
  divFactor: number;
  freeLimit: number;
  limitAmount: number;
  multiplierRate: number;
  pilPremRate: number;
  premium: number;
  rateType: string;
  sectCode: number;
  sectIpuCode: number;
  sectionCode: number;
  sectionDesc: string;
  sectionShortDesc: string;
}

export interface PolicyRisk {
  allowed_commission_rate: number;
  basic_premium: number;
  binder_code: number;
  commission_amount: number;
  commission_rate: number;
  cover_type_code: number;
  cover_type_short_description: string;
  currency_code: number;
  date_cover_from: string;
  date_cover_to: string;
  del_sect: string;
  gross_premium: number;
  insureds: {
    client: InsuredClient;
    prp_code: number;
  };
  ipu_ncd_cert_no: string;
  loaded: string;
  lta_commission: number;
  net_premium: number;
  paid_premium: number;
  policy_batch_no: number;
  policy_number: string;
  policy_status: string;
  product_code: number;
  property_description: string;
  property_id: string;
  quantity: number;
  reinsurance_endorsement_number: string;
  renewal_area: string;
  risk_fp_override: number;
  risk_ipu_code: number;
  sections: Section[];
  stamp_duty: number;
  sub_class_code: number;
  sub_class_description: string;
  transaction_type: string;
  underwriting_year: number;
  value: number;
}
export interface PolicyResponseDTO {
  content: PolicyContent[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  number_of_elements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  total_elements: number;
  total_pages: number;
}

export interface Pageable {
  offset: number;
  page_number: number;
  page_size: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PolicyContent {
  agency: number;
  authorizedStatus: string;
  basicPremium: number;
  batchNo: number;
  clientCode: number;
  currency: string;
  debitOwner: string;
  endorsementNo: string;
  insureds: Insured[];
  introducerCode: number;
  marketerCode: number;
  policyNo: string;
  policyRemarks: string;
  policyStatus: string;
  policyType: string;
  premium: number;
  preparedBy: string;
  preparedDate: string;
  product: Product;
  promiseDate: string;
  renewalDate: string;
  riskInformation: RiskInformation[];
  taxInformation: TaxInformation[];
  totalPremium: number;
  totalSumInsured: number;
  transactionType: string;
  type: string;
  underWritingOnly: string;
  wefDt: string;
  wetDt: string;
}


export interface Insured {
  client: Client;
  prpCode: number;
}

export interface Client {
  firstName: string;
  id: number;
  lastName: string;
}

export interface Product {
  acceptUniqueRisks: string;
  acceptsMultipleClasses: string;
  allowAccommodation: string;
  allowMotorClass: string;
  allowOpenPolicy: string;
  allowSameDayRenewal: string;
  areInstallmentAllowed: string;
  autoGenerateCoverNote: string;
  autoPostReinsurance: string;
  checkSchedule: string;
  claimPrefix: string;
  claimScreenCode: string;
  code: number;
  commissionRate: number;
  description: string;
  doFullRemittance: string;
  doesEscalationReductionApply: string;
  enableSpareParts: string;
  enableWeb: string;
  endorsementMinimumPremium: number;
  expires: string;
  industryCode: number;
  insuranceType: string;
  insuredAccumulationLimit: number;
  interfaceType: string;
  isAssignmentAllowed: string;
  isDefault: string;
  isLoanApplicable: string;
  isMarine: string;
  isPinRequired: string;
  isPolicyNumberEditable: string;
  isRenewable: string;
  maximumAge: number;
  maximumExtensions: number;
  maximumTerm: number;
  minimumAge: number;
  minimumPremium: number;
  minimumSubClasses: number;
  minimumTerm: number;
  openCover: string;
  order: number;
  organizationCode: number;
  policyAccumulationLimit: number;
  policyCodePages: number;
  policyDocumentPages: number;
  policyPrefix: string;
  policyWordDocument: string;
  prerequisiteProductCode: number;
  productGroupCode: number;
  productReportGroupsCode: number;
  productType: string;
  prorataType: string;
  scheduleOrder: number;
  shortDescription: number;
  shortName: string;
  showFap: string;
  showOnWebPortal: string;
  showSumInsured: string;
  termDistribution: number;
  totalCompanyAccumulationLimit: number;
  underwritingScreenCode: string;
  webDetails: string;
  withEffectFrom: string;
  withEffectTo: string;
  years: number;
}


export interface RiskInformation {
  allowedCommissionRate: number;
  basicPremium: number;
  binderCode: number;
  commissionAmount: number;
  commissionRate: number;
  coverTypeCode: number;
  coverTypeShortDescription: string;
  currencyCode: number;
  dateCoverFrom: string;
  dateCoverTo: string;
  delSect: string;
  grossPremium: number;
  insureds: Insured;
  ipuNcdCertNo: string;
  loaded: string;
  ltaCommission: number;
  netPremium: number;
  paidPremium: number;
  policyBatchNo: number;
  policyNumber: string;
  policyStatus: string;
  productCode: number;
  propertyDescription: string;
  propertyId: string;
  quantity: number;
  reinsuranceEndorsementNumber: string;
  renewalArea: string;
  riskFpOverride: number;
  riskIpuCode: number;
  sections: Section[];
  stampDuty: number;
  subClassCode: number;
  subClassDescription: string;
  transactionType: string;
  underwritingYear: number;
  value: number;
}


export interface Section {
  divFactor: number;
  freeLimit: number;
  limitAmount: number;
  multiplierRate: number;
  pilPremRate: number;
  premium: number;
  rateType: string;
  sectCode: number;
  sectIpuCode: number;
  sectionCode: number;
  sectionDesc: string;
  sectionShortDesc: string;
}

export interface TaxInformation {
  amount: number;
  batchNo: number;
  description: string;
  rate: number;
  rateType: string;
  transactionTypeCode: string;
}

export interface RiskSection {
  bindCode: number;
  coverTypeCode: number;
  group: number;
  limit: number;
  ncdLevel: number | null;
  renewal: string;
  riskCode: number;
  row: number;
  sectionCode: number;
  subClassCode: number;
}
export interface Coinsurance {
  shortDescription: string;
  code: number;
  name: string;
  branchCode: number;
  branchName: string;
  commissionAllowed: string;
  runoff: string;
  physicalAddress: string;
  emailAddress: string;
  smsTelephone: string;
}
export interface CoinsuranceDetail {
  agaCode: number;
  agaShortDesc: string;
  agentCode: number;
  agentShortDesc: string;
  annualPremium: number;
  coinPolBatchNo: number;
  coinPolNo: string;
  commission: number;
  commissionRate: number;
  commissionType: string;
  duties: number;
  facPc: number;
  facSession: string;
  feeAmount: number;
  feeRate: number;
  feeType: string;
  forceSfCompute: string;
  glCode: string;
  lead: string;
  name: string;
  optionalCommision: string;
  percentage: number;
  policyNo: string;
  premium: number;
  premiumTax: number;
  proposalNo: string;
  renEndorsementNo: string;
  sumInsured: number;
  whtx: number;
}


