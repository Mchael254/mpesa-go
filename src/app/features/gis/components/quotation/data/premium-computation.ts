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
  taxes: Tax[];
  code: string
  binderCode: number
  sumInsured: number
  withEffectFrom: string;
  withEffectTo: string;
  prorata: string;
  subclassSection: {
    code: number;
  };
  itemDescription: string;
  noClaimDiscountLevel: number;
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
}

export interface RiskLevelPremium {
  code: string | null;
  propertyId: string | null;
  propertyDescription: string;
  minimumPremiumUsed: number | null;
  coverTypeDetails: CoverTypeDetail[];
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
}

export interface LimitPremium {
  sectCode: number;
  premium: number;
  description: string;
  limitAmount: number;
  isMandatory: string;
}
export interface TaxComputation {
  code: number;
  premium: number;
}

