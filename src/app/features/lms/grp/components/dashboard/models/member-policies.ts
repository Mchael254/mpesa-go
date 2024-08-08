export class MemberPolicies {
    policy_number: string;
    policy_code: number;
    effective_date: string;
    status: string;
    description: string;
    agent_name: string;
    branch_name: string;
    total_premium: number;
    total_sum_assured: number;
    other_names: string | null;
    surname: string | null;
    scheme_name: string | null;
    member_number: string;
    endorsement_code: number;
    if_group_life_rider: string;
    product_type: string;
  }

  export class UserProfileDTO {
    code: number;
    emailAddress: string;
    fullName: string;
    idNo: string;
    teleponeNo: string;
    userName: string;
  }

export class memberBalancesDTO {
  year: string;
  policy_code: number;
  policy_member_code: number;
  period: string;
  employer_amount: number;
  total_amount: number;
  total_interest: number;
  balance_bf: number
  balance_cf: number;
  balance_income: number;
}

export class MemberDetailsDTO {
  policy_code: number;
  policy_member_code: number;
  member_number: string;
  date_of_birth: string;
  effective_from_date: string;
  employee_contri: number;
  employer_contri: number;
  annual_earnings: number;
  future_service_years: number;
  pension_status: string;
  pens_interest_pct: number | null;
  gender: string;
  name: string;
  scheme_name: string | null;
}

export class MemberCoversDTO {
  cvt_desc: string;
  pcm_cover_wef_date: string;
  pcm_cover_wet_date: string;
  pcm_sa: number;
  pcm_premium: number;
  pcm_original_loan_amt: number | null;
  pcm_orig_loan_repayment_prd: number | null;
  pcm_loan_int: number | null;
  pcm_saving_amt: number | null;
  pcm_loan_issue_date: string | null;
  pcm_rate: number;
  pcm_load_disc_prem: number;
  pcm_add_ref_prem: number;
  pcm_pay_period_premium: number;
  pcm_earnings: number;
  pcm_mult_earnings_prd: number;
  pcm_code: number;
  pcm_pcvt_code: number;
  pcm_basic_sal: number;
  pcm_house_allow: number;
  pcm_trans_allow: number;
  pcm_other_allow: number;
  pcm_disc_prem: number;
  pcm_pure_rate: number;
  pcm_pure_premium: number;
  pcm_adr_rate: number;
  pcm_accidental_prem: number;
  pcm_loading_type: string | null;
  pcm_loading_rate: number | null;
  pcm_loading_div_factor: number | null;
  pcvt_disc_rate: number | null;
  pcvt_disc_div_fact: number | null;
  pcm_orig_base_prem: number | null;
  mem_prev_prem: number;
  pcm_paid_to_date: string | null;
  pcm_load_reasons: string | null;
  pcm_status: string;
}

export class MemberPensionDepReceiptsDTO {
  pension_member_dep_code: number;
  policy_code: number;
  policy_member_code: number;
  pnmdp_amount: number;
  employer_amount: number;
  employee_amount: number;
  pnmdp_empyr_vol_amt: number;
  pnmdp_empye_vol_amt: number;
  pnmdp_empyr_trans_amt: number | null;
  pnmdp_empye_trans_amt: number | null;
  total_amount: number;
  pnmdp_date: string;
  pnmdp_grct_code: number;
  pnmdp_chq_rcpt_no: number | null;
  contribution_amount: number | null;
  voluntary_contribution_amount: number | null;
  total_transfer_amount: number | null;
  total_voluntary_transfer_amount: number | null;
  cost_of_past_benefits: number | null
}

export class DetailedMemContrReceiptsDTO {
  pension_member_dep_code: number;
  policy_code: number | null;
  policy_member_code: number | null;
  pnmdp_amount: number;
  employer_amount: number;
  employee_amount: number;
  pnmdp_empyr_vol_amt: number;
  pnmdp_empye_vol_amt: number;
  pnmdp_empyr_trans_amt: number | null;
  pnmdp_empye_trans_amt: number | null;
  total_amount: number;
  pnmdp_date: string;
  pnmdp_grct_code: number | null;
  pnmdp_chq_rcpt_no: number | null;
  contribution_amount: number | null;
  voluntary_contribution_amount: number | null;
  total_transfer_amount: number | null;
  total_voluntary_transfer_amount: number | null;
  cost_of_past_benefits: number | null;
} 

export class MemberWithdrawalsDTO {
  payee: string;
  accountName: string | null;
  clntAccNo: string;
  bankBranchName: string;
  voucherDate: Date;
  voucherAmount: number;
  paymentMode: string;
}