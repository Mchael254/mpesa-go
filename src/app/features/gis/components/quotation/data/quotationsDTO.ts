export interface quotationDTO{
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
    withEffectiveToDate:string
}
export interface quotationRisk{

    binderCode: number;
    coverTypeCode: number;
    coverTypeShortDescription: string;
    wef: string;
    wet: string;
    dateRange: string;
    prpCode: number;
    isNoClaimDiscountApplicable: string;
    itemDescription: string;
    location: string;
    noClaimDiscountLevel: string;
    quotProCode: number;
    propertyId: string;
    itemDesc: string;
    riskPremAmount: string;
    quotationCode: string;
    sclCode: string;
    town: string;
    value: number;
    coverTypeDescription: string;


}
export interface riskSection{
    calcGroup: number,
    code: number,
    compute: string,
    description: string,
    freeLimit: number,
    limitAmount: number,
    multiplierDivisionFactor: number,
    multiplierRate: number,
    premiumAmount: number,
    premiumRate: number,
    quotRiskCode: number,
    rateDivisionFactor: number,
    rateType: string,
    rowNumber: number,
    sectionCode: number,
    sectionShortDescription: string,
    sectionType: string,
    sumInsuredLimitType: string,
    sumInsuredRate: number
}
export interface QuotationDetails {
    agentCode: number;
    clientCode: number;
    coverFrom: string;
    coverTo: string;
    currency: string;
    expiryDate: string;
    no: string;
    premium: number;
    quotationProduct: QuotationProduct[];
    riskInformation: RiskInformation[];
    status: string;
    taxInformation: TaxInformation[];
  }

  export interface QuotationProduct {
    WEF: string;
    WET: string;
    agentShortDescription: string;
    binder: string;
    code: number;
    commission: number;
    premium: number;
    product: number;
    productShortDescription: string;
    quotCode: number;
    quotationNo: string;
    revisionNo: number;
    totalSumInsured: number;
    wef: string;
    wet: string;
  }

  export interface RiskInformation {
    code: number;
    covertypeShortDescription: string;
    covertypecode: number;
    quotationCode: number;
    quotationRiskNo: string;
    sectionsDetails: SectionDetail[];
    value: number;
  }

  export interface SectionDetail {
    description: string;
    freeLimit: number;
    limitAmount: number;
    premium: number;
    rate: number;
  }

  export interface TaxInformation {
    amount: number;
    description: string;
    quotationRate: number;
    rateType: string;
  }
  export interface subclassCovertypeSection{
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
  export interface scheduleDetails{
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
  riskCode: number,
  transactionType: string,
  version: number
  }

  ///////////////////////////////////////////
  export interface PremiumComputationRequest {
    entityUniqueCode?: number
    interfaceType?: any
    frequencyOfPayment: string
    transactionStatus?: any
    quotationStatus?: string
    product: Product
    taxes:Tax[]
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
    code: number
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
    subclassCode:number
    coverTypeCode:number
    minimumAnnualPremium: number
    minimumPremium: number
    coverTypeShortDescription:string
    coverTypeDescription: string

  }
  export interface PremiumRate {
    sectionCode:number
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
    riskIdFormat:string
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
  quotationProductCode:number;
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
}

export interface riskLevelPremiums {
  code: string;
  premium: number;
  limitPremiumDtos: limitPremiumDto[];
}

export interface premiumPayloadData {
  productPremium: string;
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
  Draft = 'Draft'
}

export interface Status {
  status: StatusEnum;
}


