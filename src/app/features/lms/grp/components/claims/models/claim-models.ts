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
