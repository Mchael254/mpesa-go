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
  fromaccelerator: any;
  average_anb: any;
  average_cvr_earning_permember: any;
  average_earnings_per_member: any;
  base_premium: any;
  base_sum_assured: any;
  category_category: string;
  category_rate_division_factor: any;
  cover_inbuilt: any;
  cvt_desc: any;
  dty_sht_desc: any;
  endorsement_code: any;
  fee_amount: any;
  level: any;
  limit_amount: any;
  loan_amount: any;
  lpag_code: any;
  main_cover: any;
  maximum_type_allowed: any;
  med_exempted: any;
  minimum_amt: any;
  multiple_earnings_period: any;
  pca_comm_amt: any;
  pca_comm_rate: any;
  period: number;
  pmas_sht_desc: any;
  policy_category_code: number;
  policy_code: any;
  premium: any;
  premium_mask_code: any;
  premium_mask_desc: any;
  previous_category_code: any;
  rate: any;
  school_code: any;
  short_description: string;
  sum_assured: any;
  sum_assured_per_member: any;
  sum_assured_percentage: any;
  total_member_earnings: any;
  total_members: any;
  total_original_loan_amount: any;
  total_students: any;
  use_cvr_rate: any;
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