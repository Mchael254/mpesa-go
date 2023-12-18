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
    binderCode: number,
    coverTypeCode: number,
    coverTypeShortDescription: string,
    dateWithEffectFrom: string,
    dateWithEffectTo: string,
    insuredCode: number,
    isNoClaimDiscountApplicable: string,
    itemDescription: string,
    location: string,
    noClaimDiscountLevel: number,
    productCode: number,
    propertyId: string,
    riskPremAmount: number,
    // schedules: {},
    subClassCode: number,
    town: string
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
        value: number
      }
  },
  riskCode: number,
  transactionType: string,
  version: number
  }
  