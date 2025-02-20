export interface Policy {
  actionType: string;
  addEdit: string;
  adminFeeApplicable: string;
  agentCode: number;
  agentShortDescription: string;
  authorised: string;
  batchNumber: number;
  binderPolicy: string;
  bindCode: number;
  bindDivisionCode: number;
  bindProductCode: number;
  bdivCode: number;
  branchCode: number;
  branchShortDescription: string;
  cancellationDate: string;
  clientPolicyNumber: string;
  commissionAllowed: string;
  commissionEndorsementDifferenceAmount: number;
  consCode: string;
  currencyCode: number;
  currencySymbol: string;
  currentStatus: string;
  divisionCode: number;
  frequencyOfPayment: string;
  inceptionUnderwritingYear: number;
  introductionCode: number;
  isAdminFeeAllowed: string;
  isBinderPolicy: string;
  isCashbackApplicable: string;
  isCoinsurance: string;
  isCommissionAllowed: string;
  isExchangeRateFixed: string;
  isOpenCover: string;
  isRenewable: string;
  marketerAgentCode: number;
  marketerCommissionAmount: number;
  minimumPremium: number;
  paymentMode: string;
  paymentModeCode: number;
  policyCoverFrom: string;
  policyCoverTo: string;
  policyNumber: string;
  policyStatus: string;
  populateTaxes: string;
  postStatus: string;
  preparedBy: string;
  preparedDate: string;
  previousBatchNumber: number;
  productCode: number;
  productHoldingCoPrpCode: number;
  productInterfaceType: string;
  productShortDescription: string;
  proInterfaceType: string;
  prpCode: number;
  quotationNumber: string;
  reference: string;
  renewalDate: string;
  renewalEndorsementNumber: string;
  riAgentCode: number;
  riAgentShortDescription: string;
  source: string;
  subAgentCode: number;
  subAgentCommissionAmount: number;
  subAgentShortDescription: string;
  totalGp: number;
  totalSumInsured: number;
  transactionType: string;
  transactionWithEffectFrom: string;
  underwritingYear: number;
  underwritingYearLength: number;
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
  addOrEdit: string;
  allowedCommissionRate: number;
  autogenerateCert: string;
  basicPremium: number;
  binderCode: number;
  cashApplicable: string;
  cashLevel: number;
  commissionAmount: number;
  commissionRate: number;
  computeMaxExposure: string;
  conveyanceType: string;
  coverDays: number;
  coverTypeCode: number;
  coverTypeShortDescription: string;
  currencyCode: number;
  dateCoverFrom: string;
  dateCoverTo: string;
  delSect: string;
  grossPremium: number;
  installmentPaymentPercentage: string;
  installmentPeriod: number;
  insureds: Insured;
  ipuNcdCertNo: string;
  loaded: string;
  logbook: string;
  logbookAvailable: string;
  logbookUnderInsuredName: string;
  ltaCommission: number;
  maintenanceCover: string;
  maxExposureAmount: number;
  modelYear: number;
  ncdApplicable: number;
  ncdLevel: number;
  netPremium: number;
  newRisk: boolean;
  paidPremium: number;
  periodRate: string;
  policyNumber: string;
  policyStatus: string;
  productCode: number;
  propertyDescription: string;
  propertyId: string;
  quakeFloodZone: number;
  quantity: number;
  regularDriver: string;
  reinsuranceEndorsementNumber: string;
  renewalArea: string;
  retroactiveCover: string;
  riskAddress: string;
  riskClass: number;
  riskDetails: string;
  riskFpOverride: number;
  riskIpuCode: number;
  riskLocation: string;
  sections: Section[];
  stampDuty: number;
  subClassCode: number;
  subClassDescription: string;
  surveyDate: string;
  territory: string;
  topLocationLevel: string;
  town: string;
  transactionType: string;
  underwritingYear: number;
  value: number;
  vehicleMake: string;
  vehicleModel: string;
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
export interface PremiumFinanciers {
  branchName: string;
  emailAddress: string;
  partyCode: number;
  partyName: string;
  partyType: string;
  polingCode: number;
  remarks: string;
}

export interface CoinsuranceEdit{

    agencyAccountCode: number,
    agentCode: number,
    batchNo: number,
    commissionRate: number,
    commissionType: string,
    facultativePercentage: number,
    facultativeSession: string,
    feeRate: number,
    forceCompute: string,
    leader: string,
    optimalCommission: string,
    percentage: number,
    policyNo: string

}
export interface Insured {
  code: number;
  prpCode: number;
  name: string;
  newInsured: string;
  interestedParties: string;
  clientShortDescription: string;
  address: string | null;
  pinNo: string;
  otherNames: string;
  telephoneNo: string | null;
  emailAddress: string;
  dateOfBirth: string;
  business: string | null;
  idNo: string;
  town: string | null;
  passPortNumber: string | null;
}

export interface InsuredApiResponse {
  status: string;
  message: string;
  _embedded: Insured[][];
}
export interface editInsured {
  clientCode: number,
  idNo: string,
  passportNo: string,
  pinNo: string,
  // type: string
}
export interface RequiredDocuments{
  code:number,
  description:string,
  dateCreated: string;
  isMandatory: string;
  isSubmitted: string;
  referenceNumber: string;
  remark: string;
  riskUniqueCode: number;
  subClassCode: number;
  submissionDate: string;
}
export interface EditRequiredDocuments {
  action: string; // added new field
  code: number;
  dateCreated: string;
  dateSubmitted: string; // renamed 'submissionDate' to 'dateSubmitted'
  isMandatory: string;
  isSubmitted: string;
  referenceNumber: string;
  remark: string;
  riskCode: number; // renamed 'riskUniqueCode' to 'riskCode'
  subClassCode: number;
  userReceived: string; // added new field
}

export interface commission{
  ipuCode:number;
  transactionCode:string;
  transactionTypeCode:string;
}
export interface PolicyTaxes{
  addOrEdit: string;
  amount: number;
  batchNo: number;
  companyLevel: string;
  endorsementNumber: string;
  overrideRate: string;
  polBinder: string;
  policyNumber: string;
  proCode: number;
  rate: number;
  taxRateCode: string;
  taxType: string;
  transactionLevel: string;
}
export interface populatePolicyTaxes{
  batchNo: number;
  endorsementNumber: string;
  polBinder: string;
  policyNumber: string;
  proCode: number;
  transactionType: string;
}
export interface RelatedRisk {
  propertyId: string;
  value: number ;
  withEffectFrom: string;
  withEffectTo: string;
  policyNumber: string;
  endorsementDifferentAmount: number;
}
export interface PolicyScheduleDetails{
  code:number;
  details: {
    level1: {
      bodyType: string,
      yearOfManufacture: number,
      color: string,
      engineNumber: string,
      cubicCapacity: number,
      Make: string,
      coverType: string,
      registrationNumber: string,
      chasisNumber: string,
      tonnage: string,
      carryCapacity: number,
      logBook: string,
      value: number,
      age:number,
      itemNo:number,
      terrorismApplicable:string,
      securityDevice1:string,
      motorAccessories:string,
      model:string,
      securityDevice:string,
      regularDriverName:string,
      schActive:string,
      licenceNo:string,
      driverLicenceDate:string,
      driverSmsNo:number,
      driverRelationInsured:string,
      driverEmailAddress:string

    }
},
organizationCode:any;
riskCode: number,
transactionType: string,
version: number
}
export interface Certificates {
  agentCode: number;
  branchCertLot: string;
  branchCode: number;
  coverTypeCode: number;
  ipuCode: number;
  printStatus: string;
  subClassCode: number;
  user: string;
}
export interface AddCertificates {
  batchNo: number;
  cancellationDate: string;
  certificateCode: number;
  certificateNo: number;
  certificateShortDescription: string;
  certificateYear: number;
  checkCertificate: string;
  code: number;
  endorsementNo: string;
  issueDate: string;
  lotId: string;
  policyNo: string;
  printStatus: string;
  printedDate: string;
  reasonCancelled: string;
  riskCode: number;
  riskId: number;
  status: string;
  user: string;
  withEffectFrom: string;
  withEffectTo: string;
}
export interface PolicyClause {
  heading: string;
  shortDescription: string | null;
  clauseCode: string | null;
  type: string;
  typeDescription: string | null;
  proCode: number;
  productShortDescription: string;
  subClassCode: string | null;
  editable: string;
  wording: string | null;
  clauseMandantory: string;
  subClassDescription: string | null;
}
export interface AddPolicyClauses{
  batchNo: number;
  clauseCode: string;
  endorsementNo: string;
  policyNo: string;
  productCode: number;
}
export interface EditPolicyClause {
  clause: string;
  clauseHeading: string;
  clauseItemNo: number;
  policyClauseCode: number;
  policyCode: number;
}
export interface SubclassesClauses {
  clause: string;
  clauseCode: number;
  clauseType: string;
  code: number;
  description: string;
  editable: string;
  heading: string;
  isNew: string;
  policyBatchNumber: number;
  policyNumber: string;
  subclassCode: number;
}
export interface ClientDD {
  accountName: string;
  accountNo: string;
  bankBranchCode: number;
  clientCode: number;
}
export interface SelectedSubclassClause {
  code: number;
  shortDescription: string;
  heading: string;
  clauseType: string;
  typeDescription: string;
  productCode: number;
  productShortDescription: string;
  subClassCode: number;
  editable: string;
  wording: string;
  mandatory: any;
  subclassDesc: string;
}
export interface RiskPeril {
  action: string;
  annualPremium: number;
  claimExcess: number;
  claimExcessMaximum: number;
  claimExcessMinimum: number;
  claimExcessType: string;
  claimLimit: number;
  code: number;
  computationType: string;
  dependLossType: string;
  description: string;
  excess: number;
  excessMaximum: number;
  excessMinimum: number;
  excessType: string;
  expireOnClaim: string;
  freeLimitAmt: number;
  ipuCode: number;
  perilDescription: string;
  perilLimit: number;
  perilType: string;
  personLimit: number;
  plExcess: number;
  plExcessMaximum: number;
  plExcessMinimum: number;
  plExcessType: string;
  polBatchNo: number;
  premRate: number;
  premiumAmt: number;
  prorataFull: string;
  salvagePercentage: number;
  sectShtDesc: string;
  subClassPerilCode: number;
  subClassPerilMapCode: number;
  sumInsuredOrLimit: string;
  tlExcess: number;
  tlExcessMaximum: number;
  tlExcessMinimum: number;
  tlExcessType: string;
  ttdBenPercentage: string;
}
export interface ClientDDdetails{
  accountName: string;
  accountNo: string;
  bankBranchCode: number;
  clientCode: number;
}
export interface ExternalClaimExp {
  account: string | null;
  action: string;
  claimPaid: string;
  clientCode: number;
  code: number;
  damageAmount: number;
  insurer: string;
  lossAmount: number;
  otherAmount: number;
  policyNumber: string;
  remark: string;
  riskDetails: string;
  tpAmount: number;
  eceYear: number;
}
export interface RiskService {
  rssCode: number;
  rssRsCode: number;
  rsDesc: string;
  sclDesc: string;
  rssMandatory: string;
  rssRemarks: string | null;
  rssDoneDate: string;
  rssDoneBy: string;
  rssSectCode: number;
  sectDesc: string;
  rssSectType: string;
  covtShtDesc: string;
}
export interface InternalClaimExp {
  cmbPolClientPolicyNo: string;
  claimNo: string;
  ostReserve: number;
  totalReserve: number;
  recoveries: number;
  salvages: number;
  totalPayments: number;
  netPaid: number;
}














