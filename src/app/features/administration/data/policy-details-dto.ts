export interface PolicyDetailsDTO {
  batch_no: number;
  policy_no: string;
  endorsement_no: string;
  wef_dt: string;
  wet_dt: string;
  policy_status: string;
  renewal_date: string;
  policy_remarks: string;
  agency: string;
  currency: string;
  total_sum_insured: number;
  basic_premium: number;
  product: Product;
  premium: number;
  insureds: {first_name: string; last_name: string}[];
  total_premium: number;
  authorizedStatus: string;
  riskInformation: RiskInformation[];
  taxInformation: TaxInformation[];
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
  autoPostReinsurance: string
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
  endorsementMinimumPremium: string;
  expires: string;
  industryCode: string;
  insuranceType: string;
  insuredAccumulationLimit: string;
  interfaceType: string;
  isAssignmentAllowed: string;
  isDefault: string;
  isMarine: string;
  isPinRequired: string;
  isPolicyNumberEditable: string;
  isRenewable: string;
  is_loan_applicable: string;
  maximumAge: string;
  maximumExtensions: string;
  maximumTerm: string;
  minimumAge: number;
  minimumPremium: number;
  minimumSubClasses: number;
  minimumTerm: number
  openCover: string;
  order: string;
  organizationCode: string;
  policyAccumulationLimit: string;
  policyCodePages: string;
  policyDocumentPages: string;
  policyPrefix: string;
  policyWordDocument: string;
  prerequisiteProductCode: string;
  productGroupCode: number;
  productReportGroupsCode: number;
  productType: string;
  prorataType: string;
  scheduleOrder: number;
  shortDescription: string;
  shortName: string;
  showFAP: string;
  showOnWebPortal: string;
  showSumInsured: string;
  termDistribution: string;
  totalCompanyAccumulationLimit: string;
  underwritingScreenCode: string;
  webDetails: string;
  withEffectFrom: string;
  withEffectTo: string;
  years: number;
}

export interface RiskInformation {
  coverfromDate: string;
  covertoDate: string;
  covertypeCode: string;
  covertypeDesc: string;
  propertyDesc: string;
  propertyId: string;
  riskIpuCode: number;
  riskbatchNo: number;
  sectionsDetails: SectionDetails[];
  subclassCode: string;
  subclassDesc: string;
}

export interface SectionDetails {
  coverfromDate: string;
  covertoDate: string;
  covertypeCode: string;
  covertypeDesc: string;
  propertyDesc: string;
  propertyId: string;
  riskIpuCode: number;
  riskbatchNo: number;
}

export interface TaxInformation {
  coverfromDate: string;
  covertoDate: string;
  covertypeCode: string;
  covertypeDesc: string;
  propertyDesc: string;
  propertyId: string;
  riskIpuCode: number;
  riskbatchNo: number;
}
