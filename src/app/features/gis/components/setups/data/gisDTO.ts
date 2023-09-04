/**
 * Screen Code interface
 */
export interface ScreenCode {
    code: string,
    coverSummaryName: null,
    screenName: string,
    screenDescription: string,
    claimScheduleReport: null,
    endorsementSchedule: string,
    fleetName: null,
    helpContent: null,
    level: string,
    numberOfRisks: null,
    policyDocumentName: null,
    policyDocumentRiskNoteName: null,
    policySchedule: null,
    riskReportName: string,
    renewalCertificates: null,
    renewalNotice:string,
    riskNoteName: null,
    xmlRiskNoteName: null,
    scheduleReportName: string,
    isScheduleRequired: string,
    showDefaultRisks: string,
    screenTitle: null,
    screenType: null,
    showSumInsured: string,
    screenId: number,
    organizationCode: number,
    version: number,
}
export class ScreenCodes {
    _embedded!: {
        screen_dto_list: ScreenCode[]
    }
}
export interface Sequence {

    branch_code: number;
    level?: string;
    country_code: number;
    date: number;
    month: number;
    next_number: number;
    number_type: string;
    product_prefix: string;
    reg: number;
    type: string;
    underwriting_year: number;
    version: number;
}
export interface agent {
    name: string
}
export class Agents {
    content!: agent[];
}

export class Sequences {
    _embedded!: {
        system_sequence_dto_list: Sequence[]
    }
}

export class AuthResponse {
    access_token!: string;
    expires_in!: number;
    refresh_expires_in!: number;
    refresh_token!: string;
    token_type!: string;
    id_token!: string;
    not_before_policy!: number;
    session_state!: string;
    scope!: string;
    organizationId!: string;
}
export class changeForm {
    newNextValue!: number;
    oldNextValue!: number;
    remarks!: string;
    user!: string;
}
export class allocateform {
    agentCode!: number;
    branch_code!: number;
    nextNumberFrom!: number;
    nextNumberTo!: number;
    sequenceCode!: number;
}
/**PRODUCT SETUP */
export interface productsDTO{
    code: number;
    shortDescription: string;
    description: string;
    minimumSubClasses: number;
    policyPrefix: string;
    productReportGroupsCode: number;
    check_schedule: string;
    policy_accumulation_limit: number;
    prerequisite_product_code: number;
    enable_spare_parts:string;
    minimum_premium:number;
    prorata_type: string;
    are_installment_allowed: string;
    with_effect_from:string;
    with_effect_to:string;
    endorsement_minimum_premium: number;
    insured_accumulation_limit: number;
    total_company_accumulation_limit: number;
    productsFields: Products[];
}
export interface TreeNode {
    name: string;
    code: string;
    children: TreeNode[];
  }
  export interface SelectOption {
    id?: number,
    value: string,
    text: string | null,
    isSelected:string,
    isHidden:string,
    isEnabled:string
  }
export interface Field {
    id?: number,
    defaultValue: string,
    name: string,
    min: number,
    isMandatory: string,
    label: string,
    max: number,
    placeholder: string,
    toolTip: string,
    type: string 
    formId: number,
    isEnabled: string,
    isHidden:string,
    isReadOnly:string,
    selectOptions: SelectOption[]
  }
  export interface FormScreen {
    id?: number,
    name: string,
    shortDescription: string,
    description: string,
    module: number,
    fields: Field []
  }
  export interface productDocument {
    dateWithEffectFrom: Date,
    dateWithEffectTo: Date,
    document: string,
    isDefault: string,
    name: string,
    precedence: string,
    productCode: number,
    version: number
  }
export interface Products {

    code: number;
    shortDescription: string;
    description: string;
    productGroupCode: number;
    withEffectFrom: number;
    withEffectTo: number;
    doesCashBackApply: string,
    policyPrefix: string;
    claimPrefix: number;
    underwritingScreenCode: string;
    claimScreenCode: number;
    expires: string;
    minimumSubClasses: number;
    acceptsMultipleClasses: number;
    minimumPremium: number;
    isRenewable: string;
    allowAccommodation: string;
    openCover: string;
    productReportGroupsCode: number;
    policyWordDocument: number;
    shortName: string;
    endorsementMinimumPremium: number;
    showSumInsured: string;
    showFAP: string;
    policyCodePages: number;
    policyDocumentPages: number;
    isPolicyNumberEditable: string;
    policyAccumulationLimit: number;
    insuredAccumulationLimit: number;
    totalCompanyAccumulationLimit: number;
    enableSpareParts: string;
    prerequisiteProductCode: number;
    allowMotorClass: string;
    allowSameDayRenewal: string;
    acceptUniqueRisks: number;
    industryCode: number;
    webDetails: number;
    showOnWebPortal: string;
    areInstallmentAllowed: string;
    interfaceType: string;
    isMarine: number;
    allowOpenPolicy: string;
    order: number;
    isDefault: string;
    prorataType: string;
    doFullRemittance: number;
    productType: number;
    checkSchedule: number;
    scheduleOrder: number;
    isPinRequired: string;
    maximumExtensions: number;
    autoGenerateCoverNote: string;
    commissionRate: number;
    autoPostReinsurance: string;
    insuranceType: string;
    years: number;
    enableWeb: number;
    doesEscalationReductionApply: number;
    isLoanApplicable: number;
    isAssignmentAllowed: number;
    minimumAge: number;
    maximumAge: number;
    minimumTerm: number;
    maximumTerm: number;
    termDistribution: number;
    organizationCode: number;
}
export interface otherdetails{
    code: number;
    expires: string;
    acceptsMultipleClasses: number;
    minimumPremium: number;
    isRenewable: string;
    openCover: string;
    policyWordDocument: number;
    showSumInsured: string;
    showFAP: string;
    allowMotorClass: string;
    allowSameDayRenewal: string;
    areInstallmentAllowed: string;
}
export interface Product_group {
    name(name: any): unknown;
    id(id: any): unknown;
    code: number;
    description: string;
    type: string;
    organizationCode: number;
    prod?: Products[];
}
export interface Subclass {
    code: number;
    is_mandatory: string;
    sub_class_code: number;
    policy_document_order_number: number;
    product_group_code: number;
    product_code: number;
    productShortDescription: string;
    underwriting_screen_code: string;
    date_with_effect_from: string; 
    date_with_effect_to: string;
    version: number;
}
export class SubclassesDTO {
    _embedded!: {
    product_subclass_dto_list: Subclass[]
}
}
export interface Product {
    id?:string;
    code?:string;
    name?:string;
    description?:string;
    price?:number;
    quantity?:number;
    inventoryStatus?:string;
    category?:string;
    image?:string;
    rating?:number;
}

export interface newProductGroupProduct{
    product?: Products,
    product_group?: Product_group

}
/**SUBCLASS COVERTYPE SETUP */
export interface subclasses{
    code: number,
    subClassCode: number,
    coverTypeCode: number,
    coverTypeShortDescription: null,
    sectionCode: number,
    sectionShortDescription: string,
    subClassCoverTypeCode: number,
    order: null,
    isMandatory: string,
    organizationCode: null

}
export interface subclassCoverSections{
  code: number,
  coverTypeCode: number,
  coverTypeShortDescription: string,
  isMandatory: string,
  order: number,
  organizationCode: number,
  sectionCode: number,
  sectionShortDescription: string,
  subClassCode: number,
  subClassCoverTypeCode: number
}

export interface coverType{

  certificateTypeCode: number,
  certificateTypeShortDescription: string,
  code: number,
  coverTypeCode:number,
  coverTypeShortdescription: string,
  defaultSumInsured: number,
  description: string,
  installmentPeriod: string,
  installmentType: string,
  isDefault: string,
  maximumInstallments: number,
  minimumPremium: number,
  organizationCode: number,
  paymentInstallmentPercentage: number,
  subClassCode: number,
  sumInsuredCurrencyCode: number,
  sumInsuredExchangeRate: number,
  surveyEvaluationRequired: string
}
export interface subSections{
  description: any;
  name: any;
  code: number,
  declaration: string,
  excessDetails: string,
  newSectionCode: 0,
  newSectionShortDescription: string,
  sectionCode: number,
  sectionShortDescription: string,
  sectionType: string,
  subclassCode: number,
  szaCode: 0,
  szaShortDesc: string,
  version: 0,
  wef: string,
  wet: string
}
/**SECTIONS SETUP */
export interface Sections{
    code: number,
    shortDescription: string,
    description: string,
    classCode: null,
    type: string,
    excessDetails: null,
    section: null,
    webDescription: string,
    dtlDescription: null,
    organizationCode: number
}
/**CLAUSES SETUP */
export interface Clause {
    code: number,
    short_description: string,
    heading: string,
    wording: string,
    type: string,
    is_editable: string,
    is_current: string,
    is_lien: string,
    ins: string,
    merge: string,
    organization_code: number,
    version: number,
    updated_at: string,
    updated_by: string,
}
export class Clauses {
    _embedded!: {
        clause_dto_list: Clause[]
    }
}
export interface Record1 {
    id: number;
    name: string;
    dateEdited: Date;
    editedBy: string;
  }
  export interface Params{
    description: String,
    name: String,
    organizationCode:number,
    status: String,
    value: String,
    version:number
}

export interface CoverTypes{
    code: number,
    short_description:String ,
    description:String,
    details: String,
    minimum_sum_insured: number,
    downgrade_on_suspension: String,
    downgrade_on_suspension_to: String,
    organization_code: number,
    version:number,
}
export interface ClientInsured{
    branch_name:String,
    code: number,
    date_of_birth: String,
    email: String,
    name: String,
    organization_code: number,
    polin_code: number,
    postal_address: String,
    postal_code: number,
    remark: String,
    type: String,
    version: number
}
export interface InterestedParties{
    branch_name:String,
    code: number,
    date_of_birth: String,
    email: String,
    name: String,
    organization_code: number,
    polin_code: number,
    postal_address: String,
    postal_code: number,
    remark: String,
    type: String,
    version: number
}

export interface ClientRemarks{
    code: number,
    comment: String,
    comment_date: String
    status: String,
    commented_by: String,
    date_with_effect_from: String,
    date_with_effect_to: String,
    proposer_code: number,
    agent_code: number,
    policy_code: String,
    claim_code: String,
    organization_code: number,
    version: number,
}

export interface Clients{
    id:number,
    firstName: String,
    lastName: String,
}
export interface Agents{
    id: number,
    name:string,
}
export  interface TaxRates{
    code: number,
    amount: number,
    rate: number,
    dateWithEffectFrom: string,
    dateWithEffectTo: string,
    subClassCode: number,
    rangeFrom: number,
    rangeTo: number,
    calMode: string,
    minimumAmount: number,
    roundNext: number,
    transactionTypeCode: string,
    transactionLevelCode: string,
    rateCategory:string,
    rateDescription: String,
    divisionFactor: number,
    rateType: string,
    applicationArea: string,
    applicationLevel: string,
    taxType: string,
    isMultiplierApplicable: string,
    organizationCode: number
}
export interface TransactionType{
    code: string,
    description: string,
    generalLegerCode: string,
    type: string,
    applicationLevel:string,
    isItApplicableToSubclass: string,
    isMandatory: string,
    contraGeneralLegerCode: string,
    accountType: string,
    appliesToNewBusiness: string,
    appliesToShortPeriod: string,
    appliesToRenewal: string,
    appliesToEndorsement: string,
    appliesToCancellation: string,
    appliesToExtension: string,
    appliesToDeclaration: string,
    appliesToReinstatement: string,
    organizationCode: number
}
export interface ProductsExcludedTaxes{
    productCode: number,
    transactionTypeCode: string
}
export interface Subclasses{
    accomodation: String,
    allowsDeclaration: String,
    bondSubclass: String,
    certificatePrefix: String,
    claimGracePeriod:String,
    claimPrefix: String,
    claimReviewDays: String,
    claimScreenCode: String,
    classCode: String,
    code: String,
    declarationPenaltyPercentage: String,
    description: String,
    doesDisabilityScaleApply: String,
    doesLoanApply: String,
    doesReinsurancePoolApply: String,
    doesTerritoryApply: String,
    enableSchedule: String,
    expiryPeriod: String,
    freeCoverLimit: String,
    generateCertificateAutomatically: String,
    glAccountGroupCode: String,
    isConveyanceTypeRequired: String,
    isExcessOfLossApplicable: String,
    isMandatory: String,
    isQuakeRegionRequired: String,
    isRenewable: String,
    isRescueMandatory: String,
    isRiskAddressRequired:String,
    isRiskClassMandatory: String,
    isStraightFlowEnabled: String,
    isSurveyValuationRequired: String,
    maxDeclarationPercentage:String,
    maxInsuredAccumulationLimit: String,
    maxNoClaimDiscountLevel: String,
    maxPolicyAccumulationLimit: String,
    noCertificate: String,
    noRiSi: String,
    organizationCode: String,
    overrideReq: String,
    policyPrefix: String,
    prereqSubclassCode:String,
    reinsureWotRiProg: String,
    reportParameter: String,
    riskDummy: String,
    riskExpireTotalLoss: String,
    riskIdFormat:String,
    screenCode: String,
    shortDescription: String,
    showButcharge: String,
    showNoClaimDiscount: String,
    subClassId: String,
    surveyLimitAccumulation:String,
    totalCompanyAccumulationLimit: String,
    underwritingScreenCode: String,
    uniqueRisk: String,
    useCoverPeriodRate: String,
    webSubclassDetails: String,
    withEffectFrom: String,
    withEffectTo: String
}

export interface Classes{

    classCode: string,
    classDescription: string,
    dateWithEffectFrom:string,
    dateWithEffectTo: string,
    claCrgCode: string,
    claReinCrgCode: string,
    shortDescription: string,
    maxPolicyAccumulationLimit: string,
    maxInsuredAccumulationLimit:string,
    organizationCode:string,
    subClasses:[]


}
export interface Vessel{
    code:number
    name:string
    organizationCode:number
    version:number

}


export interface Conditions{
    code: number,
    description:string,
    name: string
}

export interface UWScreens{
    code:string,
    coverSummaryName: string,
    screenName:string,
    screenDescription:string,
    claimScheduleReport:string,
    endorsementSchedule:string,
    fleetName:string,
    helpContent:string,
    level:string,
    numberOfRisks:string,
    policyDocumentName:string,
    policyDocumentRiskNoteName:string,
    policySchedule:string,
    riskReportName:string,
    renewalCertificates:string,
    renewalNotice:string,
    riskNoteName:string,
    xmlRiskNoteName:string,
    scheduleReportName:string,
    isScheduleRequired:string,
    showDefaultRisks:string,
    screenTitle: string,
    screenType:string,
    showSumInsured:string,
    screenId: number,
    organizationCode: number,
    version: number,
}

export interface classPeril{
    
    code: number,
    bindCode: String,
    bindType: String,
    classCode: number,
    claimExcessMax: String,
    claimExcessMin: String,
    claimExcessType: String,
    claimLimit: String,
    dependLossType: String,
    depreciationPercentage: String,
    description: String,
    excess: String,
    excessMax: String,
    excessMin: String,
    excessSectCode: String,
    excessType: String,
    expireOnClaim: String,
    mandatory: String,
    maxClaimPeriod: String,
    maxClaimType: String,
    perCode: String,
    perShtDescription: String,
    perType: String,
    perilLimit:String,
    perilLimitScope: String,
    perilType: String,
    personLimit: String,
    plExcess: String,
    plExcessMax: String,
    plExcessMin:String,
    plExcessType: String,
    salvagePct: String,
    sclCode: String,
    secCode: String,
    sectCode: String,
    sectShtDesc: String,
    sumInsuredOrLimit: String,
    subClPerilShtDesc: String,
    tlExcess: String,
    tlExcessMax: String,
    tlExcessMin:String,
    tlExcessType: String,
    totaledPrl: String,
    ttBenPcts: String

  
}

export interface Peril{
    code:String,
    shortDescription: String,
    description: String,
    fullDescription: String,
    paymentType: String,
    dateWithEffectFrom: String,
    dateWithEffectTo:String,
    perilType: String,
    organizationCode: String
}

export interface Excesses{
    code: Number,
    desc: String,
    classCode: Number,
    dependLossType: String,
    tlExcessRateType: String,
    tlExcessRate: Number,
    tlExcessMin: Number,
    tlExcessMax: Number,
    tlClaimExRateType: String,
    tlClaimExRate: Number,
    tlClaimExMin: Number,
    tlClaimExMax: Number,
    plExcessRateType: String,
    plExcessRate: String,
    plExcessMin: String,
    plExcessMax: String,
    plClaimExRateType: String,
    plClaimExRate: String,
    plClaimExMin: String,
    plClaimExMax: String,
    conditions: String,
    computationType: String,
    wef: String,
    wet: String

}
export interface shortPeriod{
    annualPremiumRate:string,
    code:string,
    dateWithEffectFrom:string,
    dateWithEffectTo:string,
    maximumDays:string,
    minimumDays:string,
    organizationCode:string,
    rateDivisionFactor:string,
    version:string
}
export interface subPerils{
    code:number,
    bindCode:number,
    bindType:string,
    perilCode:number,
    perilShortDescription:string,
    perilType:string,
    subclassCode:number,
    subclassSectionCode:number,
    sectionCode:number,
    sectionShortDescription: string,
    subclassSectionPerilsCode: number,
    subclassSectionPerilsMapCode: string
}
 
export interface territories{
    code: number,
    description: string,
    details:string,
    organization_code:number
}
export interface zones{
    code:number,
    shortDescription:string,
    quakeZoneName:string,
    areaCoveredByQuakeZone: string
}

export interface fields{
  id: number,
  screenName: string,
  shortDescription:string,
  description: string,
  targetSystem: number,
  screenFields: string,
  fields: []
}
export interface Binders{
    code: number,
    date_with_effect_from: String
    date_with_effect_to: String,
    bind_remarks: String,
    maximum_exposure: String,
    contract_document: String,
    binder_short_description: String,
    binder_type:String
    binder_name: String,
    is_default: String,
    is_web_default:String,
    lta_type: String,
    commission_type: String,
    maximum_refund_premium: number,
    minimum_refund_premium: number,
    minimum_premium: number,
    age_limit: number,
    is_aa_applicable: String,
    web_name: String,
    escalation_percentage: number,
    broker_code: number,
    max_number_of_beneficiaries: number,
    can_edit_premium_items: String,
    agent_code: number,
    agent_short_description: String,
    sub_class_code: number,
    account_type_code: string,
    product_code: number,
    product_short_description: String,
    policy_code: String,
    policy_batch_number: number,
    agency_account_code: String,
    currency_code: number,
    certificate_type_code: number,
    organization_code: number,
    version: number,
}
export interface Premiums{
    
    code: number,
    sectionCode: number,
    sectionShortDescription: string,
    sectionType: string,
    rate: number,
    dateWithEffectFrom: string,
    dateWithEffectTo: string,
    subClassCode: number,
    binderCode: number,
    rangeFrom: number,
    rangeTo: number,
    rateDescription: string,
    divisionFactor: number,
    rateType: string,
    premiumMinimumAmount: number,
    territoryCode: number,
    proratedOrFull: string,
    premiumEndorsementMinimumAmount: number,
    multiplierRate: number,
    multiplierDivisionFactor: number,
    maximumRate: number,
    minimumRate: number,
    freeLimit: number,
    isExProtectorApplication: string,
    isSumInsuredLimitApplicable: string,
    sumInsuredLimitType: string,
    sumInsuredRate: string,
    grpCode: string,
    isNoClaimDiscountApplicable: string,
    currencyCode: number,
    agentName: string,
    rangeType: string,
    limitAmount: number,
    noClaimDiscountLevel: string
    doesCashBackApply: string,
    cashBackLevel: number,
    rateFrequencyType: string,
}
export interface report{
        code:number,
        description:string,
        organizationCode:number
      
}

export interface subclassClauses{
    clauseCode:number,
    shortDescription:string,
    subClassCode:number,
    isMandatory: string,
    isLienClause: string,
    clauseExpires: string,
    isRescueClause: string,
    version: number
}
export interface coverPeriods{
    code: number,
    coverFrom: number,
    coverTo: number,
    subclassCode: number,
    sectionCode: number,
    binderCode: number
}
export interface specialPremiumRates{
    code: number,
    subclassCode: number,
    bindercode: number,
    rate: number,
    dateWithEffectFrom:string,
    dateWithEffectTo: string,
    multiplierDivFactor: number,
    rateType: string,
    sectionCode: number,
    coverPeriodsCode: number,
    rateDescription: string,
    minimumPremiumAmount: number,
    divisionFactor: number,
    endorsementMinimumAmount: number,
    proratedOrFull: String,
    multiplierRate: number,
    rangeFrom: number,
    rangeTo: number,
    ncdlevel: string
}
export interface subclassCoverTypes{
    code: number,
    coverTypeCode: number,
    coverTypeShortDescription: string,
    subClassCode: number,
    certificateTypeCode: string,
    certificateTypeShortDescription: string,
    minimumPremium: string,
    description: string,
    isDefault: string,
    defaultSumInsured: string,
    sumInsuredCurrencyCode: number,
    sumInsuredExchangeRate: string,
    installmentType: string,
    paymentInstallmentPercentage: string,
    maximumInstallments: string,
    installmentPeriod: string,
    surveyEvaluationRequired: string,
    organizationCode: string
}

export interface subclassCoverTypeToClauses{
    code:number,
    subClassCode: number,
    subClassCoverTypeCode: number,
    clausesShortDescription: string,
    clauseCode: number,
    isMandatory: string,
    version: number
}
export interface PremiumRatesTable{
    code: number,
    description: string,
    row: string,
    column: string
    type: string,
    ratesTableColumn: string
}