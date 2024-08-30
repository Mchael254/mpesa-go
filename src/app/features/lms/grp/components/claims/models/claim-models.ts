export class CausationTypesDTO {
    cause_code: number;
    cause_short_desc: string;
    cause_desc: string;
    cause_type: string;
    main_cover?: string;
}

export class ActualCauseDTO {
    causation_cause_code: number;
    death_disability_cause_code: number;
    death_disability_short_desc: string;
    death_disability_description: string;
    gender?: string;
    min_claimable_prd?: string;
}

export class ProductListDTO {
    calculate_from: string;
    class_type: string;
    code: number;
    description: string;
    escalation_compulsory: number | null;
    escalation_minimum_rate: number | null;
    is_escalation_allowed: boolean;
    type: string;
}

export class PolicyMemberDTO {
    policy_member_code: number;
    member_unique_code: number;
    member_name: string;
}

export class ClaimDetailsDTO {
    claim_number: string;
    status: string;
    member_number: string;
    member_name: string;
    death_disability_age: number;
    date_reported: string;
    date_of_accident: string;
    cause_description: string;
    cause_type: string;
    ddc_code: number;
    ddc_description: string;
    reserve_amount: number;
    retention_percentage: number;
    remarks: string;
    amount_claimed: number;
    amount_to_pay: number;
    paid_amount: number;
    ri_total_amount: number;
    pension_amount_to_pay: number;
    pension_paid_amount: number;
    within_system: string;
    claim_date: string;
    gross_retention_amount: number;
    retention_amount: number;
    recovery_amount: number;
    recovered_amount: number;
    os_prem_basis: string;
    cause_code: number;
    endr_coinsurance: string;
    exgratia: number;
    exgratia_remarks: string;
    product_code: number;
    death_location: string;
    client_prop_code: number;
    pay_in_installments: string;
    number_of_installments: number;
    installment_frequency: string;
    member_dob: string;
    claim_member_dob: string;
    admitted: string;
    date_admitted: string;
    no_admit_reason: string;
    reviewed: string;
    reviewed_by: string;
    reviewed_date: string;
    decline_remarks: string;
    no_claim_reason: string;
    close_no_claim: string;
    loan_outstanding_amount: number;
    hospital_days: number;
    hospital_date_from: string;
    hospital_date_to: string;
    hospital_invoice_amount: number;
    hospital_claim: string;
    rejection_reason: string;
    all_premiums_paid: string;
    payout_prorata_formula: string;
    monthly_work_days: number;
    outstanding_loan_calculation: number;
    percentage_of_incapacity: number;
    investigation_needed: string;
    investigation_sent: string;
    investigation_report_received: string;
    is_joint: string;
    member_uid: string;
    early_access: string;
}

export interface DocumentsToUploadDTO {
    document_description: string;
    short_description: string;
    is_document_submitted: boolean;
    date_given: string;
    document_number: string;
    document_code: number;
  }

  export interface FileDetailsDTO {
    lastModified: number;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
  }

  export interface ClaimPoliciesDTO {
    policy_code: number | null;
    endorsement_code: number;
    product_code: number | null;
    product_type: string;
    policy_no: string;
    client: string;
    status: string;
  }

  export interface ClaimCoverTypesDTO {
    cover_type_code: number;
    cover_type_description?: string;
    multiplier_earnings_period?: string;
    earnings: number;
    sum_assured?: number;
    payable_amount?: number;
    amount_claimed: number;
    actual_amount_being_paid?: number;
    button_pay_amount?: number;
    paid_amount?: number;
    remarks: string;
    is_paid?: string;
    payee?: string;
    pay_organization?: string;
    total_coinsurance_amount?: number;
    savings_amount?: number;
    original_loan_amount?: number;
    original_loan_repayment_period?: number;
    pct_code?: number;
    payment_installments?: number;
    interest_savings_amount?: number;
    occurrence_benefit?: number;
    occurrence_benefit_rate?: number;
    pension_allocation_policy_number?: string;
    pension_allocation_policy_code?: number;
}

export interface ClaimPolicyDetails {
    policy_code: number;
    effective_date: string;
    underwriting_year: number;
    client_display: string;
    payment_frequency: string;
    occupation_display: string;
    hazard_display: string;
    product_short_description: string;
    product_type: string;
    branch_display: string;
    dependent_covered: string;
    status: string;
    inception_date: string;
    savings_rider?: string;
    pension_category?: string;
    loan_calculation?: string;
    group_life_rider?: string;
    policy_number: string;
    proposer_code: number;
    cover_from_date: string;
    cover_to_date: string;
    expiry_date: string;
    coinsurance: string;
    product_description: string;
    status_display: string;
    payment_frequency_display: string;
    dependent_covered_display: string;
    savings_rider_display?: string;
    loan_calculation_display?: string;
    pension_category_display?: string;
    endorsement_code: number;
    proposer_client_code: number;
    agency_name: string;
    renewal_area_status: string;
    payment_group_code: number;
    payment_group_description: string;
    umbrella: string;
    currency_symbol: string;
    assignee: string;
    currency_code: number;
    scheme_name: string;
    scheme_pin_no?: string;
    scheme_tax_no?: string;
    scheme_comm_date?: string;
    max_entry_age_limit: number;
    umbrella_product: string;
    pension_mode?: string;
    master_policy_number?: string;
    agency_effective_date?: string;
    bank_code?: string;
    bank_name?: string;
}

export class PayeeDTO {
    name: string;
    value: string
}