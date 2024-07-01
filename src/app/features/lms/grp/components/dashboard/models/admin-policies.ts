export class ClaimsListingDTO {
    policy_code: number;
    product_desc: string;
    claim_number: string;
    member_number: string;
    member_name: string;
    clm_paid_amount: number | null;
    clm_amt_claimed: number | null;
    clm_amt_to_pay: number | null;
}

export class ClaimSummaryDTO {
    count: number;
    tot_amt_claimed: number
}

export class PoliciesListingDTO {
    no_of_members: number;
    pol_status: string;
    policy_code: number;
    policy_number: string;
    product_description: string;
    sum_assured: number;
}

export class PoliciesResponse {
    count: number;
    total_sum_assured: number;
    policies_list: PoliciesListingDTO[];
  }
  

export class PensionListingDTO {
    policy_code: number;
    policy_number: string;
    pol_status: string;
    sum_assured: number;
    no_of_members: number;
    product_description: string;
}

export class PensionResponse {
    count: number;
    policies_list: PensionListingDTO[];
  }

export class AdminPolicyDetailsDTO {
  policy_code: number;
  policy_number: string;
  effective_date: string;
  currency_symbol: string;
  status: string;
  endorsement_number: string;
  transaction_type: string;
  total_sum_assured: number;
  total_premium: number;
  cover_from_date: string;
  cover_to_date: string;
  number_of_members: number;
  frequency_of_payment: string;
  proposer_name: string;
  product_description: string;
  branch_name: string;
  occupation_description: string;
  agent_name: string;
  agent_telephone: string | null;
  agent_email_address: string | null;
}

export class EndorsementDetailsDTO {
  endorsement_code: number;
  endorsement_number: string;
  endorsement_type: string;
}

export class CategorySummaryDTO {
  fromaccelerator: string | null;
  average_anb: number | null;
  average_cvr_earning_permember: number | null;
  average_earnings_per_member: number | null;
  base_premium: number | null;
  base_sum_assured: number | null;
  category_category: string;
  category_rate_division_factor: number | null;
  cover_inbuilt: string | null;
  cvt_desc: string | null;
  dty_sht_desc: string | null;
  endorsement_code: string | null;
  fee_amount: number | null;
  level: string | null;
  limit_amount: number | null;
  loan_amount: number | null;
  lpag_code: string | null;
  main_cover: string | null;
  maximum_type_allowed: string | null;
  med_exempted: string | null;
  minimum_amt: number | null;
  multiple_earnings_period: number | null;
  pca_comm_amt: number | null;
  pca_comm_rate: number | null;
  period: number;
  pmas_sht_desc: string;
  policy_category_code: number;
  policy_code: string | null;
  premium: number | null;
  premium_mask_code: number;
  premium_mask_desc: string;
  previous_category_code: string | null;
  rate: number | null;
  school_code: string | null;
  short_description: string;
  sum_assured: number | null;
  sum_assured_per_member: number | null;
  sum_assured_percentage: number | null;
  total_member_earnings: number | null;
  total_members: number | null;
  total_original_loan_amount: number | null;
  total_students: number | null;
  use_cvr_rate: string;
  accelerator: string | null;
  policy_access_group: string;
}

export class DependentLimitDTO {
  coverType: string;
  dependentType: string;
  livesCovered: number;
  minimumAmt: number;
  maximumAmt: number;
  rate: number;
  divFactor: number;
  percentageOfSa: number;
  inBuilt: string;
  accelerated: string;
}