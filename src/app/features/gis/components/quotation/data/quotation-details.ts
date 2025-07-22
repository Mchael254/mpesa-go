import { QuotationProduct } from "./quotationsDTO";

export interface QuotationDetailsRequestDto {
  quotationCode?: number;
  quotationNumber?: string;
  source: number;
  user: string;
  clientCode?: number;
  currencyCode: number;
  currencyRate: number;
  agentCode: number;
  agentShortDescription: string;
  gisPolicyNumber?: string;
  multiUser?: string;
  unitCode?: number;
  locationCode?: number;
  wefDate: string;
  wetDate: string;
  bindCode?: number;
  binderPolicy?: string;
  divisionCode?: number;
  subAgentCode?: number;
  clientType: string;
  prospectCode?: number;
  branchCode: number;
  marketerAgentCode?: number;
  comments: string;
  polPipPfCode?: number;
  endorsementStatus?: string;
  polEnforceSfParam?: string;
  creditDateNotified?: string;
  introducerCode?: number;
  internalComments?: string;
  polPropHoldingCoPrpCode?: number;
  chequeRequisition?: string;
  premium: number;
  quotationProducts: QuotationProduct[];
}

interface SectionsDetail {
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
interface RiskInformation {
  insuredCode: number;
  location: string;
  town: string;
  ncdLevel: number;
  schedules: object;
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
  sectionsDetails: SectionsDetail[];
  scheduleDetails: scheduleDetails;
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
}
export interface scheduleDetails {
  details: {
    level1: {
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

