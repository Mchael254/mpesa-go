export interface Policy {
    action_type: string;
    add_edit: string;
    agent_code: number;
    agent_short_description: string;
    batch_number: number;
    bdiv_code: number;
    bind_code: number;
    branch_code: number;
    branch_short_description: string;
    client_code: number;
    client_type: string;
    coin_leader_combined: string;
    coinsurance_facultative_cession: string;
    comments: string;
    cons_code: string;
    currency_code: number;
    currency_symbol: string;
    fequency_of_payment: string;
    internal_comments: string;
    introducer_code: number;
    is_admin_fee_allowed: string;
    is_binder_policy: string;
    is_cashback_applicable: string;
    is_coinsurance: string;
    is_commission_allowed: string;
    is_exchange_rate_fixed: string;
    is_open_cover: string;
    payment_mode: string;
    pro_interface_type: string;
    product_code: number;
    source: string;
    transaction_type: string;
    with_effective_from_date: string;
    with_effective_to_date: string;
}
export interface InsuredClient {
    first_name: string;
    id: number;
    last_name: string;
  }
  
  export interface Section {
    div_factor: number;
    free_limit: number;
    limit_amount: number;
    multiplier_rate: number;
    pil_prem_rate: number;
    premium: number;
    rate_type: string;
    sect_code: number;
    sect_ipu_code: number;
    section_code: number;
    section_desc: string;
    section_short_desc: string;
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
    authorized_status: string;
    basic_premium: number;
    batch_no: number;
    client_code: number;
    currency: string;
    debit_owner: string;
    endorsement_no: string;
    insureds: Insured[];
    introducer_code: number;
    marketer_code: number;
    policy_no: string;
    policy_remarks: string;
    policy_status: string;
    policy_type: string;
    premium: number;
    prepared_by: string;
    prepared_date: string;
    product: Product;
    promise_date: string;
    renewal_date: string;
    risk_information: RiskInformation[];
    tax_information: TaxInformation[];
    total_premium: number;
    total_sum_insured: number;
    transaction_type: string;
    type: string;
    under_writing_only: string;
    wef_dt: string;
    wet_dt: string;
  }
  
  export interface Insured {
    client: Client;
    prp_code: number;
  }
  
  export interface Client {
    first_name: string;
    id: number;
    last_name: string;
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
    insureds: Insured;
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
  
  export interface Section {
    div_factor: number;
    free_limit: number;
    limit_amount: number;
    multiplier_rate: number;
    pil_prem_rate: number;
    premium: number;
    rate_type: string;
    sect_code: number;
    sect_ipu_code: number;
    section_code: number;
    section_desc: string;
    section_short_desc: string;
  }
  
  export interface TaxInformation {
    amount: number;
    batch_no: number;
    description: string;
    rate: number;
    rate_type: string;
    transaction_type_code: string;
  }
  
