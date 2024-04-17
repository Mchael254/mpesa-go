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
    accept_unique_risks: string;
    accepts_multiple_classes: string;
    allow_accommodation: string;
    allow_motor_class: string;
    allow_open_policy: string;
    allow_same_day_renewal: string;
    are_installment_allowed: string;
    auto_generate_cover_note: string;
    auto_post_reinsurance: string;
    check_schedule: string;
    claim_prefix: string;
    claim_screen_code: string;
    code: number;
    commission_rate: number;
    description: string;
    do_full_remittance: string;
    does_escalation_reduction_apply: string;
    enable_spare_parts: string;
    enable_web: string;
    endorsement_minimum_premium: number;
    expires: string;
    industry_code: number;
    insurance_type: string;
    insured_accumulation_limit: number;
    interface_type: string;
    is_assignment_allowed: string;
    is_default: string;
    is_loan_applicable: string;
    is_marine: string;
    is_pin_required: string;
    is_policy_number_editable: string;
    is_renewable: string;
    maximum_age: number;
    maximum_extensions: number;
    maximum_term: number;
    minimum_age: number;
    minimum_premium: number;
    minimum_sub_classes: number;
    minimum_term: number;
    open_cover: string;
    order: number;
    organization_code: number;
    policy_accumulation_limit: number;
    policy_code_pages: number;
    policy_document_pages: number;
    policy_prefix: string;
    policy_word_document: string;
    prerequisite_product_code: number;
    product_group_code: number;
    product_report_groups_code: number;
    product_type: string;
    prorata_type: string;
    schedule_order: number;
    short_description: number;
    short_name: string;
    show_fap: string;
    show_on_web_portal: string;
    show_sum_insured: string;
    term_distribution: number;
    total_company_accumulation_limit: number;
    underwriting_screen_code: string;
    web_details: string;
    with_effect_from: string;
    with_effect_to: string;
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
  
