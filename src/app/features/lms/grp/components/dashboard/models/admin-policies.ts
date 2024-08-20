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
  accelerator: string | null;
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

export class CoverTypesDTO {
  cvt_depend_disp: string;
  main_cover_desc: string;
  pcvt_apply_comm_exp_loading: number | null;
  pcvt_average_period: number | null;
  pcvt_avg_anb: string | null;
  pcvt_avg_mem_earn: number | null;
  pcvt_but_charge_premium: number | null;
  pcvt_code: number;
  pcvt_comm_amt: number | null;
  pcvt_comm_rate: number | null;
  pcvt_cover_beneficiaries: string | null;
  pcvt_cvt_code: number;
  pcvt_cvt_sht_desc: string;
  pcvt_disc: string;
  pcvt_disc_div_fact: number | null;
  pcvt_disc_load_div_fact: number | null;
  pcvt_disc_load_rate: number | null;
  pcvt_disc_rate: number | null;
  pcvt_facultative: string;
  pcvt_fcl_amt: number | null;
  pcvt_formular: string;
  pcvt_load_age_fact: number | null;
  pcvt_load_disc: string;
  pcvt_loan_rpymt_prd: number | null;
  pcvt_loanamt_per_mem: number | null;
  pcvt_loanint_per_mem: number | null;
  pcvt_main_cover: string;
  pcvt_main_rider: string;
  pcvt_main_sa_perc: number | null;
  pcvt_mult_earnings_prd: number | null;
  pcvt_override_fcl_amt: number | null;
  pcvt_override_ret_lim_amt: number | null;
  pcvt_override_ret_limit: number | null;
  pcvt_pct_code: number;
  pcvt_pmas_code: number | null;
  pcvt_pmas_sht_desc: string | null;
  pcvt_premium: number;
  pcvt_rate: number;
  pcvt_rate_div_fact: number;
  pcvt_refund_formular: string;
  pcvt_sa: number;
  pcvt_sa_per_member: number | null;
  pcvt_savings_per_mem: number | null;
  pcvt_staff_desc: string | null;
  pcvt_tot_member_earnings: number | null;
  pcvt_tot_members: number;
  pcvt_tot_orig_loan_amt: number | null;
  pcvt_unit_rate: number;
  pcvt_use_cvr_rate: string;
  pcvt_use_unit_rate: string;
  pcvt_waiting_period: number | null;
}

export class MemberDetailsDTO {
  endr_no: string | null;
  endr_duration_type: string | null;
  endr_status: string | null;
  endr_tot_sa: number | null;
  endr_tot_premium: number | null;
  endr_type: string | null;
  endr_pay_method: string | null;
  endr_effective_date: string | null;
  endr_prev_sa: number | null;
  endr_prev_prem: number | null;
  agent_display: string | null;
  endr_freq_of_payment: string | null;
  endr_cover_to_date: string | null;
  endr_add_ref_prem: number | null;
  endr_male_nrd: number | null;
  mask_display: string | null;
  check_agent_display: string | null;
  endr_calc_type: string | null;
  endr_add_ref_perc_variance: number | null;
  endr_female_nrd: number | null;
  endr_comm_rate: number | null;
  endr_checkoff_rate: number | null;
  endr_nof_members: number;
  endr_inst_prem: number | null;
  endr_comm_amt: number | null;
  endr_pens_type: string | null;
  endr_scheme_type: string | null;
  endr_reg_no: string | null;
  endr_reg_date: string | null;
  endr_scheme_trustees: string | null;
  endr_pens_esc: number | null;
  endr_earn_escalation: number | null;
  endr_nssf_include: boolean | null;
  endr_nssf_amount: number | null;
  endr_pens_tax_complia: boolean | null;
  endr_guarant_prd: number | null;
  endr_pens_pay_freq: string | null;
  endr_contribtn_type: string | null;
  endr_empyer_contr_rate: number | null;
  endr_empyee_contr_rate: number | null;
  endr_pens_admin_fee: number | null;
  endr_empyr_pens_bf: number | null;
  endr_empye_pens_bf: number | null;
  endr_tot_pens_bf: number | null;
  endr_pens_comm_rate: number | null;
  endr_fnding_rate: number | null;
  pens_type: string | null;
  contrib_type: string | null;
  nssf_incl: boolean | null;
  pay_freq: string | null;
  endr_unit_rate_formula: string | null;
  endr_vat_rate: number | null;
  endr_ov_comm_rate: number | null;
  fcl_calc_type: string | null;
  endr_fcl_amt: number;
  endr_override_fcl_amt: number | null;
  endr_authorized: boolean | null;
  ta_code: string | null;
  ta_desc: string | null;
  endr_tot_scheme_sa: number | null;
  endr_tot_empyer_contr: number | null;
  endr_tot_empyee_contr: number | null;
  endr_tot_contr: number | null;
  service_provider: string | null;
  endr_ann_type: string | null;
  endr_ann_option: string | null;
  endr_ann_amount: number | null;
  endr_ann_escalation: number | null;
  endr_pens_int_rate: number | null;
  endr_facre_ceding: string | null;
  endr_facre_rate_type: string | null;
  endr_ann_invest_rate: number | null;
  endr_ann_terminal_payout_rate: number | null;
  endr_ann_scheme_legal_age: number | null;
  endr_ann_admin_charge: number | null;
  endr_ann_invest_intr_rate: number | null;
  endr_tot_ann_investments: number | null;
  endr_tot_terminal_benefits: number | null;
  endr_pens_val_frequency: string | null;
  endr_coinsurance: boolean | null;
  endr_coinsure_leader: string | null;
  endr_cover_from_date: string | null;
  endr_rein_pmas_code: string | null;
  endr_rein_pmas_sht_desc: string | null;
  endr_fcl_calc_type: string | null;
  endr_duration_term_type: string | null;
  endr_pens_mode: string | null;
  endr_coin_fac_share: number | null;
  endr_mktr_agn_code: string | null;
  marketer: string | null;
  endr_emplyr_volu_contr: number | null;
  endr_emplye_volu_contr: number | null;
  endr_joint_agents: string | null;
  endr_agen_share: number | null;
  endr_umbrella_duration: number | null;
  endr_pmas_code: string | null;
  endr_pmas_sht_desc: string | null;
  total_coin_prem: number | null;
  total_coin_sa: number | null;
  endr_loss_ratio: number | null;
  endr_avg_anb: number | null;
  endr_hist_pens_int_rate: number | null;
  endr_single_gross_rate: number | null;
  endr_refund_rate: number | null;
  endr_pen_scheme_type: string | null;
  endr_profit_perc: number | null;
  endr_profit_factor: number | null;
  endr_pens_acrual_fctr: number | null;
  endr_pens_inactive_admin_fee: number | null;
  endr_pens_loan_perc: number | null;
  endr_override_comm: number | null;
  endr_clm_exp_rate: number | null;
  endr_cumulative_loss_ratio: number | null;
  endr_admin_fee_type: string | null;
  endr_track_losses: boolean | null;
  endr_loss_period: number | null;
  endr_prem_fraction: number | null;
  endr_pens_ann_fac_rate: number | null;
  endr_tot_prem_paid: number | null;
  endr_tot_claim_paid: number | null;
  endr_claims_float: number | null;
  endr_profit_share_formula: string | null;
  endr_prof_share_prd: string | null;
  endr_rba_reg_no: string | null;
  endr_kra_taxexemption_no: string | null;
  endr_pin_no: string | null;
  commision_basis: string | null;
  endr_facultative_type: string | null;
  endr_post_past_period: string | null;
  endr_post_past_prd_date: string | null;
  endr_fac_position: string | null;
  endr_facultative_share: number | null;
  endr_docs_dispatch_date: string | null;
  endr_acknmt_date: string | null;
  endr_acknowledged: boolean | null;
  endr_acknmt_by: string | null;
  endr_doc_issued: boolean | null;
  endr_doc_reason: string | null;
  endr_max_age_limit_yrs: number | null;
  endr_prof_share_wef: string | null;
  endr_prof_share_wet: string | null;
  endr_agn_effective_date: string | null;
  endr_inv_rider_allowed: boolean | null;
  endr_investment_term: string | null;
  endr_inv_add_ref_amt: number | null;
  endr_existing_fcl: number | null;
  mem_above_fcl: number;
  mem_above_existing_fcl: number;
  mem_above_override_fcl: number;
  endr_debit_note_sent: boolean | null;
  endr_nof_mems_endrsd: number | null;
  endr_cb_comm_type: string | null;
  endr_max_fcl: number | null;
  endr_cb_init_by: string | null;
  endr_past_period: string | null;
  endr_wht_exempted: boolean | null;
  endr_refund_comm_at_ref: boolean | null;
  endr_bonus_rate: number | null;
  endr_bonus_amt: number | null;
  endr_bonus_allowed: boolean | null;
  endr_jnt_mktr_agn_code: string | null;
  jnt_marketer: string | null;
  endr_emv_term: number | null;
  endr_med_underwrite_status: string | null;
  endr_med_complete_status: string | null;
  endr_vat_amt: number | null;
  total_coin_unused_prem: number | null;
  endr_invoice_status: string | null;
  endr_fac_admin_fee: number | null;
  endr_payee_type: string | null;
  endr_payee: string | null;
  endr_bank_acc_no: string | null;
  endr_bank_acc_name: string | null;
  client_display: string | null;
  branch_name: string | null;
  endr_pay_onlast_todie: boolean | null;
  pay_onlast_todie: boolean | null;
  endr_post_transaction: string | null;
  full_sa: number | null;
  full_prem: number | null;
  endr_pens_admin_fee_calc: string | null;
  endr_pens_admin_fee_amt: number | null;
  endr_pens_vat_amt: number | null;
}

export class MemberListDTO {
  member_number: string;
  surname: string;
  other_names: string;
  sex: string;
  schedule_join_date: string;
  telephone_number: string | null;
  email: string | null;
  category: string;
  dependent_types: string;
  date_of_birth: string;
  premium: number | null;
  sum_assured: number;
  policy_member_code: string;
}

export class MemberDetailsSummaryDTO {
  cover_type: string;
  sum_assured: number;
  premium: number;
  cover_from_date: string;
  cover_to_date: string;
}

export class PartialWithdrawalsDTO {
  amount: number | null;
  bank_account_no: string | null;
  bank_accountn_name: string | null;
  bank_name: string;
  narration: string;
  notification_date: string | null;
  pay_method: string;
  payee: string;
}

export class ReceiptsDTO {
  amount: number;
  balance_amount: number;
  cheque_no: string | null;
  comm_inclusive: string;
  doc_date: string | null;
  drcr: string;
  gross_amount: number;
  member_allocated_amount: number;
  member_allocated_balance: number;
  pay_method: string | null;
  pension_allocate: number;
  pension_allocated_amount: number;
  pension_payment_amount: number;
  policy_fee: number;
  prem_orc_comm: number;
  prem_tax: number;
  premium_allocate: number;
  premium_comm: number;
  premium_payment_amount: number | null;
  receipt_date: string;
  receipt_narration: string | null;
  receipt_no: string;
  refunded_amount: number;
  status: string;
}

export class ValuationsDTO {
  authorised_by: string | null;
  authorised_date: string | null;
  client: string | null;
  employee_amt: number;
  employee_bal_cf: number;
  employee_bal_income: number | null;
  employee_balance_bf: number;
  employee_contri_income: number | null;
  employee_vol_amt: number | null;
  employee_withdrawal_amt: number | null;
  employer_amt: number;
  employer_bal_bf: number;
  employer_bal_income: number | null;
  employer_balance_cf: number;
  employer_contri_income: number | null;
  employer_retire_held: number | null;
  employer_withdrawal_amt: number | null;
  endorsement_code: number;
  inception_date: string | null;
  interest_rate: number;
  period: string | null;
  pnbal_valua_date: string | null;
  policy_code: number;
  policy_number: string | null;
  scheme_fund: number | null;
  scheme_fund_bf: number | null;
  status: string | null;
  tot_bal_carried_forward: number | null;
  total_amount: number;
  total_bal_bf: number;
  total_deductions: number | null;
  total_fund_bal: number | null;
  valuation_date: string | null;
  valuation_year: string | null;
  wef: string;
  wet: string;
  withdrawal_total: number | null;
}

export class ContactMethodDTO {
  name: string;
  value: string;
}

export class ServiceReqCategoriesDTO {
  branchCode: number;
  branchName: string;
  code: number;
  isDefault: boolean;
  name: string;
  requestTypeCode: number;
  userCode: number;
  username: string;
  validity: number;
}

export class ServiceReqCatTypesDTO {
  code: number;
  description: string;
  shortDescription: string;
}

export class ServiceReqPoliciesDTO {
  accountName: string;
  policyNumber: string;
}