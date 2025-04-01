import { ClientDTO } from "src/app/features/entities/data/ClientDTO";

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
  addEdit: string;
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
  taxComputation:taxComputation[];
  vehicleModel:number;
  vehicleMake:number;

}
export interface taxComputation{
  code:number,
  premium:number
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
  agentWithin: string;
  newAgent?: any;
  quotIncsCode?: any;
  web: string;
  introducerCode?: any;
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
}

export interface QuotationProduct {
  code: number;
  proCode: number;
  quotCode: number;
  productShortDescription: string;
  quotationNo?: any;
  premium: number;
  revisionNo: number;
  totalSumInsured: number;
  commission?: any;
  binder?: any;
  agentShortDescription?: any;
  productName: string;
  wef: string;
  wet: string;
  taxInformation: TaxInformation[];
  riskInformation: RiskInformation[];
}

export interface TaxInformation {
  rateDescription: string;
  quotationRate: number;
  rateType: string;
  taxAmount?: any;
  productCode?: any;
}

export interface RiskInformation {
  insuredCode?: any;
  location?: any;
  town?: any;
  ncdLevel?: any;
  schedules?: any;
  coverTypeCode: number;
  addEdit?: any;
  quotationRevisionNumber: number;
  code: number;
  quotationProductCode: number;
  quotationRiskNo: string;
  quotationCode: number;
  productCode?: any;
  propertyId: string;
  value?: any;
  coverTypeShortDescription: string;
  sectionsDetails: SectionDetail[];
  scheduleDetails: ScheduleDetails;
  premium: number;
  subclassCode: number;
  itemDesc: string;
  binderCode: number;
  wef: string;
  wet: string;
  commissionRate?: any;
  commissionAmount?: any;
  clientCode?: any;
  clientShortDescription?: any;
  annualPremium?: any;
  coverDays: number;
  clientType: string;
  prospectCode?: any;
  coverTypeDescription: string;
  subclass: SubclassDetails;
}

export interface SectionDetail {
  code: number;
  quotationRiskCode: number;
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
  level1: Level1;
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
  noCertificate: string;
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
      code: number,
      geographicalLimits: string,
      deductibleDesc: string,
      limitationUse: string,
      authorisedDriver: string
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
  code: number
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
export interface LimitsOfLiability {
  code: number;
  narration: string | null;
  value: string;
  subclassCode: number;
  quotationValueCode: number;
}
export interface CreateLimitsOfLiability {
  code: number;
  scheduleValueCode: number;
  quotationProductCode: number;
  value: string;
  narration: string | null;
  type: string;
}
export interface Excesses {
  code: number;
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
  quotationCode: number;
  quotationNumber: string;
  source: string;
  user: string;
  clientCode: number;
  productCode: number;
  currencyCode: number;
  currencyRate: number;
  agentCode: number;
  agentShortDescription: string;
  gisPolicyNumber: string;
  multiUser: string;
  unitCode: number;
  locationCode: number;
  wefDate: string; // ISO date format (YYYY-MM-DD)
  wetDate: string; // ISO date format (YYYY-MM-DD)
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
  creditDateNotified: string; // ISO date format (YYYY-MM-DD)
  introducerCode: number;
  internalComments: string;
  polPropHoldingCoPrpCode: number;
  chequeRequisition: boolean;
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
  computationPayloadCode?:number

}
export interface QuotationSource{
  code:number;
  description:string;
  applicableModule:string;
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



export interface RiskValidationDto{
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





