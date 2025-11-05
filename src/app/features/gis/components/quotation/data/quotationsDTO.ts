import { ClientDTO } from "src/app/features/entities/data/ClientDTO";
import { ProductLevelPremium, ProductPremium } from "./premium-computation";

export interface quotationDTO {
  actionType: string,
  addEdit: string,
  agentCode: number,
  agentShortDescription: string,
  bdivCode: number,
  bindCode: number,
  branchCode: number,
  clientCode: number,
  clientType: string,
  coinLeaderCombined: string,
  comments: string,
  consCode: string,
  currencyCode: number,
  currencySymbol: string,
  fequencyOfPayment: string,
  internalComments: string,
  introducerCode: number,
  ipayReferenceNumber?: string,
  isBinderPolicy: string,
  paymentMode: string,
  proInterfaceType: string,
  productCode: number,
  source: string,
  withEffectiveFromDate: string,
  withEffectiveToDate: string
}

export interface quotationRisk {

  insuredCode: number;
  location: string;
  town: string;
  ncdLevel: number;
  // schedules: Record<string, unknown>;
  coverTypeCode: number;
  action: string;
  quotationRevisionNumber: number;
  code: number;
  quotationProductCode: number;
  quotationRiskNo: string;
  quotationCode: number;
  productCode: number;
  propertyId: string;
  value: number;
  coverTypeShortDescription: string;
  premium: number;
  subclassCode: number;
  itemDesc: string;
  binderCode: number;
  wef: string;
  wet: string;
  commissionRate: number;
  commissionAmount: number;
  prpCode: number;
  clientShortDescription: string;
  annualPremium: number;
  coverDays: number;
  clientType: string;
  prospectCode: number;
  coverTypeDescription: string;
  taxComputation: taxComputation[];
  vehicleModel: number;
  vehicleMake: number;

}

export interface taxComputation {
  code: number,
  premium: number
}

export interface riskSection {
  sectionCode: number;
  sectionShortDescription: string;
  description: string | null;
  rateType: string;
  limitAmount: number | null;
  quotRiskCode: number;
  premiumRate: number;
  freeLimit: number;
  premiumAmount: number;
  rateDivisionFactor: number;
  multiplierRate: number | null;
  multiplierDivisionFactor: number | null;
  compute: string;
  sumInsuredLimitType: string | null;
  sumInsuredRate: number | null;
  sectionType: string;
  calcGroup: number;
  rowNumber: number;
  code: number;
  quotationCode: number;
}

export interface QuotationDetails {
  code: number;
  clientCode: number;
  quotationNo: string;
  revisionNo: number;
  quotPropHoldingCoPrpCode?: any;
  agentShortDescription: string;
  currencyCode: number;
  coverFrom: string;
  coverTo: string;
  totalPropertyValue?: any;
  comments?: any;
  status: string;
  expiryDate: string;
  ok: string;
  premium: number;
  commissionAmount?: any;
  internalComments?: any;
  authorisedBy?: any;
  authorisedDate?: any;
  confirmed?: any;
  confirmedBy?: any;
  confirmedDate?: any;
  ready: string;
  madeReadyBy?: any;
  madeReadyDate?: any;
  revised?: any;
  preparedBy: string;
  quotFactor?: any;
  quotGspCode?: any;
  divisionCode?: any;
  creditDateNotified?
  agentWithin: string;
  newAgent?: any;
  quotIncsCode?: any;
  web: string;
  introducerCode?: any;
  ipayReferenceNumber?: string
  sourceCode: string;
  chequeRequisition?: any;
  parentRevision?: any;
  subAgentCode?: any;
  subAgentShortDescription?: any;
  subCommissionAmount?: any;
  prospectCode?: any;
  marketerAgentCode?: any;
  clientType: string;
  marketerCommissionAmount?: any;
  originalQuotationNumber: string;
  quotTrvDstCouCode?: any;
  remarks?: any;
  reasonCancelled?: any;
  webClientCode?: any;
  quotTcbCode?: any;
  clientRef?: any;
  loanDisbursed: string;
  tenderNumber?: any;
  preparedDate: string;
  quotCancelReason?: any;
  quotCmpCode?: any;
  sourceCampaign?: any;
  frequencyOfPayment: string;
  currencyRate?: any;
  webPolId?: any;
  travelQuote: string;
  likelihood?: any;
  quotQscCode: number;
  quotLtaCommAmt?: any;
  ginQuotations?: any;
  quotPipCode?: any;
  organizationCode?: any;
  rfqDate?: any;
  multiUser: string;
  subQuote: string;
  premiumFixed: string;
  dateCreated?: any;
  agentCode: number;
  currency: string;
  quotationProducts: QuotationProduct[];
  branchCode: number;
  source: {
    code: number;
    description: string;
    applicableModule: string;
  };
  agentName: string;
  clientName: string;
  sumInsured: number;
  taxInformation?: TaxInformation[];
}

export interface QuotationProduct {
  code: number;
  productCode: number;
  quotationCode: number;
  productShortDescription: string;
  premium: number;
  wef: string;
  wet: string;
  revisionNo?: number;
  totalSumInsured: number;
  commission?: number;
  binder: string;
  agentShortDescription: string;
  productName: string;
  converted: string;
  policyNumber?: string;
  taxInformation: TaxInformation[];
  riskInformation: RiskInformation[];
  limitsOfLiability?: LimitsOfLiability[];
  productClauses?: ProductClauses[]
}

export interface TaxInformation {
  code: number;
  rateDescription: string;
  rate: number;
  productCode?: number;
  quotationCode: number;
  rateType: string;
  taxAmount: number;
  transactionCode: string;
  renewalEndorsement: string;
  taxRateCode: number;
  levelCode: string;
  taxType: string;
  riskProductLevel: string;
}

export interface RiskInformation {
  riskCode?: string
  coverTypeCode: number;
  coverTypeShortDescription: string;
  coverTypeDescription: string;
  productCode: number;
  premium: number;
  value: number;
  clientType: string;
  itemDesc: string;
  wef: string;
  wet: string;
  code?: number
  propertyId: string;
  annualPremium: number;
  sectionsDetails: any; // Replace with actual structure if known
  subclassCode: number;
  binderCode: number;
  action: string;
  riskLimits: RiskLimit[];
  clauseCodes: number[];
  subclass: Subclass;
  coverDays: number;
  fp: number;
  quotationCode?: number
  quotationProductCode?: number
  scheduleDetails?: scheduleDetails;
  location?: any
  town?: any
  quotationRevisionNumber?: any
  quotationRiskNo?: any
  commissionRate?: number
  ncdLevel?: any
  clientShortDescription?: any
  prospectCode?: any
  commissionAmount?: any
}

export interface RiskLimit {
  code: number;
  description: string;
  sectionCode: number;
  sectionType: string;
  sectionShortDescription: string;
  quotationRiskCode: number;
  quotationCode: number;
  limitAmount: number;
  premiumRate: number;
  premiumAmount: number;
  productCode: number;
  quotationProCode: number;
  minimumPremium: number;
  rateType: string;
  rateDescription: string;
  rateDivisionFactor: number;
  multiplierRate: number;
  multiplierDivisionFactor: number;
  rowNumber: number;
  calcGroup: number;
  compute: string;
  annualPremium: number;
  usedLimit: number;
  dualBasis: string;
  freeLimit: number;
  setupPremiumRate: number;
  indemnityRemainingPeriodPct: number;
  indemnityFirstPeriodPct: number;
  indemnityFirstPeriod: number;
  periodType: string;
  indemnityPeriod: number;
  minimumPremiumRate: number;
  maxPremiumRate: number;
  sumInsuredRate: number | null;
}

export interface LimitsOfLiability {
  scheduleValueCode: number;
  value: string;
  narration: string;
  type: string;
  code?: number
  quotationValueCode?: number
}
export interface ProductClauses {
  productCode: number;
  clauseCode: number;
  quotationProductCode: number;
  quotationCode: number;
  quotationNumber: string;
  clause: string;
  clauseIsEditable: string;
  clauseShortDescription: string;
  clauseHeading: string;
  clauseType: string;
  quotationRevisionNumber: number;
  subclassCode: number;

}

export interface SectionDetail {
  code?: number;
  quotationRiskCode?: number;
  sectionDescription: string;
  limitAmount: number;
  freeLimit: number;
  rate: number;
  premium: number;
  rateType: string;
  sectionShortDescription: string;
  rowNumber: number;
  calculationGroup: number;
  sectionCode: number;
  rateDivisionFactor: number;
}

export interface ScheduleDetails {
  code: number;
  riskCode: number;
  details: {
    level1: {
      bodyType: string | null;
      yearOfManufacture: number | null;
      color: string;
      engineNumber: string | null;
      cubicCapacity: number | null;
      Make: string;
      coverType: string;
      registrationNumber: string;
      chasisNumber: string | null;
      tonnage: number | null;
      carryCapacity: number | null;
      logBook: string | null;
      value: number | null;
    };
  };
  transactionType: string;
  organizationCode: number;
  version: number;
}

export interface Level1 {
  bodyType?: any;
  yearOfManufacture?: any;
  color: string;
  engineNumber?: any;
  cubicCapacity?: any;
  Make: string;
  coverType: string;
  registrationNumber: string;
  chasisNumber?: any;
  tonnage?: any;
  carryCapacity?: any;
  logBook?: any;
  value?: any;
  age: string;
  itemNo: string;
}

export interface SubclassDetails {
  code: number;
  sclNewSclCode?: any;
  sclClaimPrefix?: any;
  description: string;
  shortDescription: string;
  sclPrgCode?: any;
  productCode: number;
  noCertificate?: string;
}

export interface subclassCovertypeSection {
  code: number;
  cover_type_code: number;
  cover_type_short_description: string;
  is_mandatory: string;
  order: number;
  organization_code: number;
  section_code: number;
  section_short_description: string;
  sub_class_code: number;
  sub_class_cover_type_code: number;
}

export interface scheduleDetails {
  details: {
    level1?: {
      bodyType: string,
      yearOfManufacture: number,
      color: string,
      engineNumber: string,
      cubicCapacity: number,
      make: string,
      coverType: string,
      registrationNumber: string,
      chasisNumber: string,
      tonnage: string,
      carryCapacity: number,
      logBook: string,
      value: number,
      age: number,
      itemNo: number,
      terrorismApplicable: string,
      securityDevice1: string,
      motorAccessories: string,
      model: string,
      securityDevice: string,
      regularDriverName: string,
      schActive: string,
      licenceNo: string,
      driverLicenceDate: string,
      driverSmsNo: number,
      driverRelationInsured: string,
      driverEmailAddress: string

    },
    level2?: {  // Making level2 optional

      geographicalLimits: string,
      deductibleDesc: string,
      limitationUse: string,
      authorisedDriver: string,
      garageCapacity: string
    }

  },
  riskCode: number,
  transactionType: string,
  version: number,
  code?: number,
  organizationCode?: number
}

///////////////////////////////////////////
export interface PremiumComputationRequest {
  entityUniqueCode?: number
  interfaceType?: any
  frequencyOfPayment: string
  transactionStatus?: any
  quotationStatus?: string
  product: Product
  taxes: Tax[]
  currency: Currency
  risks: Risk[]
  dateWithEffectTo: string
  dateWithEffectFrom: string
  underwritingYear: number
  age: any
  coinsuranceLeader: string
  coinsurancePercentage: number
}

export interface Product {
  code: number
  expiryPeriod: string
}

export interface Currency {
  rate: number
}

export interface Risk {
  code?: number
  limits: Limit[]
  propertyId?: string
  binderDto: BinderDto
  baseCurrencyCode?: any
  withEffectFrom: string
  withEffectTo: string
  prorata: string
  rescueServiceDto?: any
  subclassSection: Subclass
  // subClassSectionCode: number
  itemDescription?: string
  emlBasedOn?: any
  noClaimDiscountLevel: number
  subclassCoverTypeDto: SubclassCoverTypeDto
  enforceCovertypeMinimumPremium: string
  futurePremium?: any
  commissionRate?: any
  effectiveDateWithEffectTo?: any
  endorseRemove?: any
}

export interface Limit {
  description: string
  code?: number
  riskCode: number
  calculationGroup: number
  declarationSection: any
  rowNumber: number
  rateDivisionFactor: number
  premiumRate: number
  rateType: string
  sectionType: string
  firstLoss?: any
  firstLossAmountPercent?: any
  firstLossValue?: any
  limitAmount: number
  freeLimit?: any
  topLocRate?: any
  topLocDivFact?: any
  emlPercentage?: any
  compute: string
  section: Section
  multiplierRate?: any
  multiplierDivisionFactor?: any
  minimumPremium?: number
  annualPremium?: number
  premiumAmount?: number
  dualBasis: string
  limitPeriod?: any
  indemFstPeriod?: any
  indemPeriod?: any
  indemFstPeriodPercentage?: any
  indemRemPeriodPercentage?: any
}

export interface Section {
  description?: string
  limitAmount?: number
  code: number
  isMandatory?: string
}

export interface BinderDto {
  code: number
  maxExposure?: any
  currencyCode: number
  currencyRate: number
}

export interface Subclass {
  code: number;
  description: string;
  shortDescription: string | null;
  productCode: number;
}

export interface SubclassCoverTypeDto {
  subclassCode: number
  coverTypeCode: number
  minimumAnnualPremium: number
  minimumPremium: number
  coverTypeShortDescription: string
  coverTypeDescription: string

}

export interface PremiumRate {
  sectionCode: number
  sectionShortDescription: string | null;
  multiplierDivisionFactor: number | null;
  multiplierRate: number | null;
  rate: number | null;
  divisionFactor: number | null;
  rateType: string | null;
  sumInsuredLimitType: string | null;
  sumInsuredRate: string | null; // Change to string since it's coming as a string
  limitAmount: number | string | null; // Allow limitAmount to be string or number
}

export interface RegexPattern {
  riskIdFormat: string
}

export interface Clause {
  code: number;
  coverTypeCode: number;
  subclassCode: number;
  classShortDescription: string;
  heading: string;
  isMandatory: string;
}


export interface CreateLimitsOfLiability {
  code?: number;
  scheduleValueCode: number;
  value: string;
  narration: string | null;
  type: string;
  displayValue?: number | null;
}

export interface Excesses {
  code?: number;
  narration: string | null;
  value: string;
  subclassCode: number;
  quotationValueCode: number;
}

export interface EditRisk {
  code: number;
  covertypeShortDescription: string;
  covertypecode: number;
  propertyId: string;
  quotationCode: number;
  quotationRiskNo: string;
  value: number;
}

export interface Tax {
  taxRate: string;
  code: string;
  taxCode: string;
  divisionFactor: string;
  applicationLevel: string;
  taxRateType: string;
}

export interface tax {
  code: string;
  premium: number;
}

export interface limitPremiumDto {
  sectCode: number;
  premium: number;
  sectionDescription: string;
}

export interface riskLevelPremiums {
  code: string;
  premium: number;
  limitPremiumDtos: limitPremiumDto[];
}

export interface premiumPayloadData {
  productPremium: number;
  productCode: number;
  quotProductCode: string;
  taxes: tax[];
  riskLevelPremiums: riskLevelPremiums[];
}

export interface ClientPhone {
  number: string;
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
}

export enum StatusEnum {
  Lapsed = 'Lapsed',
  Rejected = 'Rejected',
  Pending = 'Pending',
  None = 'None',
  Confirmed = 'Confirmed',
  Draft = 'Draft',
  Accepted = 'Accepted'
}

export enum SystemEnum {
  GIS = 'GIS',
  LMS = 'LMS',
  CRM = 'CRM'
}

export interface Status {
  status: StatusEnum;
}

export interface QuotationList {
  quotationCode: number;
  quotationNumber: string;
  clientCode: number;
  clientName: string;
  fromDate: string;
  toDate: string;
  expiryDate: string;
  status: string;
  quotDate: string;
}

export interface UserDetails {
  code: number;
  idNo: string;
  fullName: string;
  emailAddress: string;
  telephoneNo: string;
  userName: string;
  currencyDelimiter: string;
  orgDateFormat: string;

}

export interface Sources {
  code: number;
  description: string;
  applicableModule: string;
}


export interface QuotationPayload {
  quotationNumber: string;
  source: string;
  user: string;
  clientCode: number;
  currencyCode: number;
  currencyRate: number;
  agentCode: number;
  agentShortDescription: string;
  gisPolicyNumber: string;
  multiUser: string;
  unitCode: number;
  locationCode: number;
  wefDate: string;
  wetDate: string;
  bindCode: number;
  binderPolicy: string;
  divisionCode: number;
  subAgentCode: number;
  clientType: string;
  prospectCode: number;
  branchCode: number;
  marketerAgentCode: number;
  comments: string;
  polPipPfCode: number;
  endorsementStatus: string;
  polEnforceSfParam: string;
  creditDateNotified: string;
  introducerCode: number;
  internalComments: string;
  polPropHoldingCoPrpCode: number;
  chequeRequisition: string;
  premium: number;
  quotationProducts: QuotationProductPayload[];
}

export interface QuotationProductPayload {
  code: number;
  productCode: number;
  quotationCode: number;
  productShortDescription: string;
  quotationNo: string;
  premium: number;
  wef: string;
  wet: string;
  revisionNo: number;
  totalSumInsured: number;
  commission: number;
  binder: string;
  agentShortDescription: string;
  productName: string;
  converted: string;
  policyNumber: string;
  taxInformation: TaxInformationPayload[];
}

export interface TaxInformationPayload {
  rateDescription: string;
  quotationRate: number;
  rateType: string;
  taxAmount: number;
  productCode: number;
}


export interface UserDetail {
  id: number;
  name: string;
  username: string;
  emailAddress: string;
  dateOfBirth: string | null;
  status: string;
  userType: string;
  telNo: string;
  phoneNumber: string;
  otherPhone: string | null;
  personelRank: string;
  countryCode: number;
  townCode: number | null;
  physicalAddress: string | null;
  postalCode: string | null;
  departmentCode: string | null;
  activatedBy: string | null;
  updateBy: string;
  dateCreated: string;
  profilePicture: string | null;
  organizationId: number;
  organizationGroupId: number | null;
  supervisorId: number | null;
  branchId: number;
  gender: string | null;
  pinNumber: string | null;
  idNumber: string | null;
}

export interface QuickQuoteData {
  yearOfManufacture: number;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string
  carRegNo: string;
  product: any
  subClass: any;
  currency: any;
  effectiveDateFrom: Date
  selfDeclaredValue: number
  modeOfTransport: number
  value: number;
  riskId: string;
  coverTo: Date
  existingClientSelected: boolean
  selectedClient?: ClientDTO
  selectedBinderCode?: number
  computationPayloadCode?: number

}

export interface QuotationSource {
  code: number;
  description: string;
  applicableModule: string;
}

export interface ScheduleDetailsDto {
  code: number;
  riskCode: number;
  details: {
    level1: {
      bodyType: string | null;
      yearOfManufacture: number | null;
      color: string;
      engineNumber: string | null;
      cubicCapacity: number | null;
      Make: string;
      coverType: string;
      registrationNumber: string;
      chasisNumber: string | null;
      tonnage: number | null;
      carryCapacity: number | null;
      logBook: string | null;
      value: number | null;
    };
  };
  transactionType: string;
  organizationCode: number;
  version: number;
}

export interface RiskValidationDto {
  riskId?: string
  batchNumber?: number
  subClassCode: number
  withEffectFrom: string
  withEffectTo: string
  addOrEdit: string
  propertyId: string
}

export interface SubclassSectionPeril {
  code: number;
  subclassCode: number;
  sectionCode: number;
  sectionShortDescription: string;
  perCode: number;
  shortDescription: string;
  description: string;
  sectionDescription: string;
  excess: number | null;
  excessMin: number | null;
  excessMax: number | null;
  personLimit: number | null;
  perilLimit: number | null;
  claimLimit: number | null;
  tlExcessType: string | null;
  plExcessType: string | null;
  expireOnClaim: string;
  multiplier: number | null;
  claimExcessType: string;
  tlExcess: number | null;
  tlExcessMin: number | null;
  tlExcessMax: number | null;
  plExcess: number | null;
  plExcessMin: number | null;
  plExcessMax: number | null;
  claimExcessMin: number | null;
  claimExcessMax: number | null;
  dependLossType: string;
  benefitPerPeriod: number | null;
}

export interface DynamicRiskField {
  type: string;
  name: string;
  max: number;
  min: number;
  isMandatory: string;
  disabled: boolean;
  readonly: boolean;
  regexPattern: string;
  placeholder: string;
  label: string;
}

export interface PremiumComputationResponse {
  premiumAmount: number;
  riskLevelPremiums: RiskLevelPremium[];
}


export interface RiskLevelPremium {
  code: number | null;
  propertyId: string | null;
  propertyDescription: string;
  // premium?: number;
  minimumPremiumUsed: number | null;
  coverTypeDetails: CoverTypeDetails[];
}

export interface CoverTypeDetails {
  subclassCode: number | null;
  coverTypeCode: number | null;
  minimumAnnualPremium: number | null;
  minimumPremium: number | null;
  coverTypeShortDescription: string | null;
  coverTypeDescription: string | null;
  limits: any; // update if needed
  computedPremium: number;
  limitPremium: LimitPremium[];
  taxComputation: TaxComputation[];
}


export interface LimitPremium {
  sectCode: number;
  premium: number;
  description: string | null;
  limitAmount: number | null;
  isMandatory: string | null;
}

export interface TaxComputation {
  code: number;
  premium: number;
  rateDescription: string
}


// src/app/models/quotation.dto.ts

export interface ProductDTO {
  product: string;
  risk: string;
  coverType: string;
  effectiveDate: string;
  sumInsured: number;
  premium: number;
}

export interface QuotationDTO {
  number: string;
  status: string;
  reference: string;
  ticket: string;
  notes: string;
  currency: string;
  products: ProductDTO[];
}

export interface ShareQuoteDTO {
  selectedMethod: 'email' | 'sms' | 'whatsapp';
  email?: string;
  smsNumber?: string;
  whatsappNumber?: string;
  clientName?: string;
}

// src/app/models/quotation.dto.ts

export interface ProductDTO {
  product: string;
  risk: string;
  coverType: string;
  effectiveDate: string;
  sumInsured: number;
  premium: number;
}

export interface QuotationDTO {
  number: string;
  status: string;
  reference: string;
  ticket: string;
  notes: string;
  currency: string;
  products: ProductDTO[];
}

export interface ShareQuoteDTO {
  selectedMethod: 'email' | 'sms' | 'whatsapp';
  email?: string;
  smsNumber?: string;
  whatsappNumber?: string;
  clientName?: string;
}


// src/app/models/payment-advice.dto.ts
export interface PaymentMethodDTO {
  title: string;
  details: string[];
}

export interface PaymentAdviceDTO {
  paymentMethods: PaymentMethodDTO[];
  footerInfo: string[];
}

// quote-report.dto.ts

export interface CoverageDTO {
  premium: string;
  clauses: string[];
  limitsOfLiability: string[];
  excess: string[];
  benefits: string[];
}

export interface MotorPrivateDTO {
  useOfProperty: string;
  value: string;
  comprehensive: CoverageDTO;   // comprehensive coverage details
  thirdParty: CoverageDTO;      // third party coverage details
}

export interface DomesticDTO {
  useOfProperty: string;
  value: string;
  premium: CoverageDTO;         // single coverage details for domestic
}

export interface QuotationHeaderDTO {
  quotationStatus: string;
  proposalIssued: string;
  period: string;
  quoteTime: string;
  agencyName: string;
  logo: string;
}

export interface QuoteReportDTO {
  header: QuotationHeaderDTO;
  motorPrivateList: MotorPrivateDTO[];
  domesticList: DomesticDTO[];
}


// src/app/models/payment-advice.dto.ts
export interface PaymentMethodDTO {
  title: string;
  details: string[];
}

export interface PaymentAdviceDTO {
  paymentMethods: PaymentMethodDTO[];
  footerInfo: string[];
}

// quote-report.dto.ts

export interface CoverageDTO {
  premium: string;            // renamed from 'premium' to 'amount' for clarity
  clauses: string[];
  limitsOfLiability: string[];
  excess: string[];
  benefits: string[];
}

export interface MotorPrivateDTO {
  useOfProperty: string;
  value: string;
  comprehensive: CoverageDTO;   // comprehensive coverage details
  thirdParty: CoverageDTO;      // third party coverage details
}

export interface DomesticDTO {
  useOfProperty: string;
  value: string;
  premium: CoverageDTO;         // single coverage details for domestic
}

export interface QuotationHeaderDTO {
  quotationStatus: string;
  proposalIssued: string;
  period: string;
  quoteTime: string;
  agencyName: string;
  logo: string;
}

export interface QuoteReportDTO {
  header: QuotationHeaderDTO;
  motorPrivateList: MotorPrivateDTO[];
  domesticList: DomesticDTO[];
}

export interface QuotationComment {
  comment: string
  quotationCode: number
}

export interface QuotationUpdate {
  quotationCode: number
  clientCode: number
}

export interface OrganizationDto {
  organizationName: string
  organizationLogo: string
}

export interface QuotationDetailsDto {
  quotationPeriod: string
  quotationStatus: string
  quotationTime: string
  quotationAgent?: string
  insuredName?: string
  quotationNo?: string
  ipayReferenceNumber?: string
}

export interface QuotationReportDto {
  paymentLink?: string,
  products?: {
    code: number
    description: string
    riskLevelPremiums: {
      sumInsured: number
      coverTypeDetails: {
        subclasscode: number,
        description: string,
        coverTypeShortDescription: string;
        coverTypeDescription: string,
        limits: {
          narration: string;
          value: string
        }[]
        computedPremium: number,
        taxComputation: {
          premium: number,
          code: number
          rateDescription: string
        }[]
        clauses: {
          heading: string,
          wording: string
        }[]
        limitOfLiabilities: {
          narration: string,
          value: string
        }[]
        excesses: {
          narration: string,
          value: string
        }[]
        limitPremium: {
          sectCode: number;
          premium: number;
          description: string;
          limitAmount: number;
          isMandatory: string;
          calculationGroup?: number;
          compute?: string;
          dualBasis?: string;
          rateDivisionFactor?: number;
          rateType?: string;
          rowNumber?: number;
          premiumRate?: number;
          multiplierDivisionFactor?: number
          multiplierRate?: number
          sectionType?: string
          shortDescription?: string
          freeLimit?: number
        }

      }
    }[]
  }[]
  organization?: OrganizationDto
  quotation?: QuotationDetailsDto
}
export class UsersDetailsDto {
  id: number;
  name: string;
  username: string;
  emailAddress: string;
  dateOfBirth: Date | null;
  status: string;
  userType: string;
  telNo: string | null;
  phoneNumber: string;
  otherPhone: string | null;
  personelRank: string;
  countryCode: string | null;
  townCode: string | null;
  physicalAddress: string | null;
  postalCode: string | null;
  departmentCode: string | null;
  activatedBy: string | null;
  updateBy: string | null;
  dateCreated: Date;
  profilePicture: string | null;
  organizationId: number | null;
  organizationGroupId: number | null;
  supervisorId: number | null;
  branchId: number | null;
  gender: string | null;
  pinNumber: string | null;
  idNumber: string | null;
}

export interface TaxPayload {
  code: number;
  rateDescription: string;
  rate: number;
  rateType: string;
  taxAmount: number;
  productCode: number;
  quotationCode: number;
  transactionCode: string;
  renewalEndorsement: string;
  taxRateCode: string;
  levelCode: string;
  taxType: string;
  riskProductLevel: string;
}
export interface ScheduleLevels {
  dslCode: number;
  levelName: string;
  tableName: string;
  levelNumber: number;
  tablePrefix: string;
  tableForeignKeySequence: string;
  tableLevelQuery: string | null;
}
export interface ScheduleTab {
  levelNumber: number;
  levelName: string;
}



export interface ProductDetails {
  coverFrom: Date;
  coverTo: Date;
  productName: string;

}


export interface ProductDetails {
  coverFrom: Date;
  coverTo: Date;
  productName: string;
  premium: number;
  commission: number;

}



export interface TaxDetails {
  code: number;
  levelCode: string;
  productCode?: number;
  quotationCode: number;
  rate: number;
  rateDescription: string;
  rateType: string;
  renewalEndorsement: string | null;
  riskProductLevel: string;
  taxAmount: number;
  taxRateCode: number | null;
  taxType: string;
  transactionCode: string;
}
export interface UserDetails {
  id: number;
  name: string;
  username: string;
  emailAddress: string;
  dateOfBirth: string | null;
  status: string;
  userType: string;
  telNo: string | null;
  phoneNumber: string | null;
  otherPhone: string | null;
  personelRank: string | null;
  countryCode: string | null;
  townCode: string | null;
  physicalAddress: string | null;
  postalCode: string | null;
  departmentCode: string | null;
  activatedBy: string | null;
  updateBy: string | null;
  dateCreated: string;
  profilePicture: string | null;
  organizationId: number | null;
  organizationGroupId: number | null;
  supervisorId: number | null;
  branchId: number | null;
  gender: string | null;
  pinNumber: string | null;
  idNumber: string | null;
}

export interface GroupedUser {
  groupId: number;
  groupUserId: number;
  isTeamLeader: 'Y' | 'N'; // explicitly "Y" or "N"
  userDetails: UserDetails;
  id: number;
}
export interface OtpPayload {
  email: string,
  subject: string,
  body: string
}
export interface OtpResponse {
  id: number;
  userIdentifier: string;
  otpValue: number;
  generationTime: string;
  expiryTime: string;
  verified: number;
}
export interface ReportResponse {
  code: number;
  systemCode: number;
  name: string;
  description: string;
  datafile: string | null;
  applicationLevel: string;
  status: string;
  subModuleCode: string | null;
  order: number | null;
  printSrvAppl: string;
  printSrvcAppl: string;
  type: string | null;
  visible: string | null;
  shortDescription: string | null;
  update: string;
}
export interface ReportParam {
  name: string;
  value: string;
}

export interface ReportPayload {
  params: ReportParam[];
  rptCode: number;
  system: string;
  reportFormat: string;
  encodeFormat: string;
}
export interface ReportParamItem {
  code: number;
  rptCode: number;
  name: string;
  desc: string;
  prompt: string;
  type: string;
  userRequired: string;
}

export interface ReportParams {
  rptCode: number;
  reportName: string;
  dataFile: string;
  rptTmplCode: number;
  templateFile: string;
  styleFile: string;
  rptPrntSrvAppl: string;
  params: ReportParamItem[];
}

export interface IntroducerDto {
  code: number;
  surName: string;
  otherNames: string;
  staffNo: number;
  groupCompany: string | null;
  postalAddress: string | null;
  introducerTown: string | null;
  pin: string | null;
  idRegistration: string | null;
  dateOfBirth: string | null;
  remarks: string | null;
  introducerZip: string | null;
  introducerZipName: string | null;
  userID: string | null;
  bruCode: string | null;
  email: string | null;
  WEF: string | null;
  WET: string | null;
  agentCode: string | null;
  type: string;
  feeAllowed: string;
  mobileNumber: string | null;
  telephoneNumber: string | null;
  wef: string | null;
  wet: string | null;
}

export interface CreateRiskCommission {
  quotationRiskCode: number;
  quotationCode: number;
  agentCode: number;
  transCode: string;
  accountCode: number;
  trntCode: string;
  group: string;
}


export interface RiskCommissionDto {
  code: number;
  quotationRiskCode: number;
  quotationCode: number;
  agentCode: number;
  transCode: string;
  accountCode: number;
  trntCode: string;
  group: string;
  transDescription?: string;
  usedRate?: number;
  setupRate?: number;
  discRate?: number;
  discType?: string;
  amount?: number;
  discAmount?: number;
  accountType?: string;
  commissionAmount?: number;
  withHoldingRate?: number;
  withHoldingTax?: number;
}
export interface SystemDetails {
  id: number;
  shortDesc: string;
  systemName: string;
  isCoreSystem: string;
  organizationId?: number;
  organizationGroupId?: number;
}
export interface ExceptionPayload {
  code: number;
  gisExceptionCode: string;
  policyBatchNumber: number;
  policyNumber: string;
  exceptionBy: string;
  isAuthorized: string;
  authorizedBy: string;
  authorizedDate: string; // or Date if you parse it
  riskCode: number;
  transactionDate: string; // or Date
  transactionNumber: number;
  transactionType: string;
  agentCode: number;
  agentShortDescription: string;
  setStandard: number;
  usedStandard: number;
  description: string;
  systemModule: string;
  decision: string;
  quotationCode: number;
  quotationNumber: string;
  sectionCode: number;
  reiCode: number;
  claimNumber: string;
  mtranNumber: number;
  accountBalance: number;
}
export interface RiskLimitPayload {
  riskSections: RiskSection[];
  addOrEdit: string;
  quotationRiskCode: number;
}

export interface RiskSection {
  code: number;
  description: string;
  riskCode: number;
  sectionCode: number;
  sectionType: string;
  sectionShortDescription: string;
  quotationRiskCode: number;
  quotationCode: number;
  limitAmount: number;
  premiumRate: number;
  premiumAmount: number;
  productCode: number;
  quotationProCode: number;
  minimumPremium: number;
  rateType: string;
  rateDescription: string;
  rateDivisionFactor: number;
  multiplierRate: number;
  multiplierDivisionFactor: number;
  rowNumber: number;
  calcGroup: number;
  compute: string;
  annualPremium: number;
  usedLimit: number;
  dualBasis: string;
  freeLimit: number;
  setupPremiumRate: number;
  indemnityRemainingPeriodPct: number;
  indemnityFirstPeriodPct: number;
  indemnityFirstPeriod: number;
  periodType: string;
  indemnityPeriod: number;
  minimumPremiumRate: number;
  maxPremiumRate: number;
  sumInsuredRate: number;
}






