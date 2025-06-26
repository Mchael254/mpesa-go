export interface ComputationPayloadDto {
  payload: PremiumComputationRequest,
  quotationCode: number
}

export interface PremiumComputationRequest {
  dateWithEffectFrom: string;
  dateWithEffectTo: string;
  underwritingYear: number;
  age: number | null;
  coinsuranceLeader: string | null;
  coinsurancePercentage: number | null;
  entityUniqueCode: string | null;
  interfaceType: string | null;
  frequencyOfPayment: string;
  quotationStatus: string;
  transactionStatus: string;
  products: Product[];
  currency: {
    rate: number;
  };
}

export interface Product {
  code: number;
  description: string
  expiryPeriod: string;
  withEffectFrom: string;
  withEffectTo: string;
  risks: Risk[];
}

export interface Tax {
  taxRate: string;
  code: string;
  taxCode: string;
  divisionFactor: string;
  applicationLevel: string;
  taxRateType: string;
}

export interface Risk {
  useOfProperty?: string
  taxes: Tax[];
  code: string
  binderCode: number
  sumInsured: number
  withEffectFrom: string;
  withEffectTo: string;
  propertyId?: string
  prorata: string;
  subclassSection: {
    code: number;
  };
  itemDescription: string;
  noClaimDiscountLevel: number;
  propertyDescription?: string
  enforceCovertypeMinimumPremium: string;
  binderDto: {
    code: number;
    currencyCode: number;
    maxExposure: number | null;
    currencyRate: number;
  };
  subclassCoverTypeDto: CoverType[];
}

export interface CoverType {
  subclassCode: number;
  coverTypeCode: number;
  minimumAnnualPremium: number;
  minimumPremium: number | null;
  coverTypeShortDescription: string;
  coverTypeDescription: string;
  limits: Limit[];
}

export interface Limit {
  calculationGroup: number;
  declarationSection: string;
  rowNumber: number;
  rateDivisionFactor: number;
  premiumRate: number;
  rateType: string;
  minimumPremium: number | null;
  annualPremium: number;
  multiplierDivisionFactor: number | null;
  multiplierRate: number | null;
  description: string;
  shortDescription: string
  sumInsuredRate?: number
  section: {
    limitAmount: number;
    description: string;
    code: number;
    isMandatory: string;
  };
  sectionType: string;
  riskCode: number | null;
  limitAmount: number;
  compute: string;
  dualBasis: string;
  freeLimit?: number;
  limitPeriod?: number;
}


export interface ProductLevelPremium {
  productLevelPremiums: ProductPremium[];
}

export interface ProductPremium {
  riskLevelPremiums: RiskLevelPremium[];
  description: string
  code: number
  coverFrom?: string,
  coverTo?: string,
  quotationNo?:string,
}

export interface RiskLevelPremium {
  code: string | null;
  propertyId: string | null;
  propertyDescription: string;
  minimumPremiumUsed: number | null;
  coverTypeDetails: CoverTypeDetail[];
  selectCoverType?: CoverTypeDetail
  binderCode?: number
  sumInsured?: number
}

export interface CoverTypeDetail {
  subclassCode: number;
  coverTypeCode: number;
  minimumAnnualPremium: number | null;
  minimumPremium: number | null;
  coverTypeShortDescription: string;
  coverTypeDescription: string;
  limits: any | null;
  computedPremium: number;
  limitPremium: LimitPremium[];
  taxComputation: TaxComputation[];
  clauses?: any
  excesses?: any
  limitOfLiabilities?: any
  additionalBenefits?: any[]
}

export interface LimitPremium {
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

export interface TaxComputation {
  code: number;
  premium: number;
  taxRate?: number
  taxRateType?: string
  description?: string
  levelCode?: string
  taxType?: string
  applicationLevel?: string
}

