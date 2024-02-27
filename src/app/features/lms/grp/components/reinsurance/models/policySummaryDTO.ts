export class PolicySummaryDTO {
    authorised: string | null;
    authorization_date: string | null;
    basic_sum_assured: number;
    branch_description: string;
    calculation_type: string | null;
    client: string;
    cover_from_date: string;
    cover_to_date: string;
    currency_rate_type: string | null;
    currency_symbol: string;
    current_endorsement_code: string | null;
    description: string | null;
    duration_type: string;
    effective_date: string;
    endorsement_code: string | null;
    frequency_of_payment: string;
    inception_date: string | null;
    instalment_day: number | null;
    instalment_loan_amount: number | null;
    instalment_month: number | null;
    instalment_premium: number | null;
    master_policy_number: string | null;
    max_entry_age_limit: number | null;
    medical_total_sum_assured: number | null;
    mrl_sum_assured: number | null;
    occupation_of_holder: string | null;
    paid_to_date: string | null;
    pension_category: string | null;
    pension_mode: string | null;
    policy_code: number;
    policy_number: string;
    prepared_by: string | null;
    product_code: string | null;
    product_name: string;
    product_short_description: string | null;
    product_type: string | null;
    quotation_number: string | null;
    status: string;
    total_loan_outstanding_amount: number | null;
    total_premium: number;
    total_sum_assured: number | null;
    type: string | null;
    underwriting_year: number;
    transaction_number: number
  }

export class TreatyDTO {
    ta_code: number;
    ta_desc: string;
    ta_sht_desc: string;
}

export class ReinsuranceParametersDTO {
  atct_as_code: number;
  atct_cede_rate: number;
  atct_code: number;
  atct_comm_rate: number | null;
  atct_cvt_code: number;
  atct_cvt_sht_desc: string;
  atct_limit: number;
  atct_pct_code: number;
  atct_prod_code: number;
  atct_rate: number | null;
  atct_rate_div_fact: number | null;
  atct_rei_code: number;
  atct_ta_code: number;
  atct_ta_sht_desc: string;
  atct_tct_code: number;
  atct_tprd_code: number;
  cede_type: string;
  cvt_desc: string;
  rate_type: string;
  tacr_comm_div_factr: number;
  tacr_comm_rate: number;
}
