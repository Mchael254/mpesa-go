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