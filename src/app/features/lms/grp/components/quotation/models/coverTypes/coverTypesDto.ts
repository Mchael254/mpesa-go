export class CoverTypesDto {
    aggregate_plan: string | null;
    apply_commission_expense_loading: string | null;
    average_anb: string | null;
    average_cover_per_member: string | null;
    average_earning_per_member: string | null;
    average_period: string | null;
    before_load_discount_premium: string | null;
    beneficiaries: string | null;
    but_charge_premium: string | null;
    category_description: string | null;
    computed_premium: string | null;
    cover_duration_type: string | null;
    cover_term: string | null;
    cover_type_code: number;
    cover_type_unique_code: number;
    cvt_desc: string;
    cvt_main_cover: string;
    cvt_rate_type: string;
    discount: string | null;
    discount_division_factor: string | null;
    discount_loading_division_factor: string | null;
    discount_or_loading_rate: string | null;
    discount_percentage: string | null;
    discount_rate: string | null;
    dty_description: string;
    facultative_amount: string | null;
    group_premium_rates_code: string | null;
    if_inbuilt: string | null;
    if_main_cover: string | null;
    if_main_rider: string | null;
    if_use_unit_rate: string;
    letter_closing_remarks: string | null;
    letter_opening_remarks: string | null;
    limit: string | null;
    lnty_code: string | null;
    load_age_factor: string | null;
    loading_discount?: string | null;
    loan_amount_per_member: string | null;
    loan_interval_per_member: string | null;
    loan_repayment_period: string | null;
    main_sumassured_percentage: string | null;
    member_minimum_allowed_premium: string | null;
    multiple_earnings_period: string | null;
    multiplier: string | null;
    multiplier_division_factor: string | null;
    override_facultative_amount: number | null;
    percentage_payable: string | null;
    premium: number;
    premium_but_charge_amount: string | null;
    premium_computation_formula: string | null;
    premium_mask_code: number;
    premium_mask_short_description: string;
    premium_rate: string | null;
    product_code: string | null;
    quotation_code: string | null;
    quotation_duration_type: string | null;
    quotation_product_code: string | null;
    rate_division_factor: number;
    refund_formula: string | null;
    savings_per_member: string | null;
    short_description: string | null;
    staff_description: string | null;
    sum_assured: number;
    sum_assured_per_member: string | null;
    sum_assured_limit: number;
    total_loan_amount: string | null;
    total_member_earnings: string | null;
    total_members: string | null;
    use_cvr_rate: string | null;
    use_rate: string | null;
    weekly_indemnity: string | null;
    wef: string | null;
    wet: string | null;
  }

  export interface SelectRateTypeDTO {
    name: string,
    value: string
  }

  export class CoverTypePerProdDTO {
    cvt_desc: string;
    premium: number | null;
    but_charge_premium: number | null;
    cvt_main_cover: string | null;
    cvt_rate_type: string | null;
    dty_description: string | null;
    cover_type_unique_code: number;
    product_code: number | null;
    quotation_product_code: number | null;
    cover_type_code: number | null;
    quotation_code: number | null;
    sum_assured: number | null;
    total_members: number | null;
    loading_discount: string | null;
    discount_or_loading_rate: number | null;
    premium_rate: number | null;
    average_anb: number | null;
    wet: string | null;
    wef: string | null;
    average_period: string | null;
    sum_assured_per_member: number | null;
    if_use_unit_rate: string | null;
    use_rate: string | null;
    discount_loading_division_factor: number | null;
    dependant_type_code: number;
    average_earning_per_member: number | null;
    staff_description: string | null;
    multiple_earnings_period: string | null;
    facultative_amount: number | null;
    override_facultative_amount: number | null;
    if_main_cover: string | null;
    if_main_rider: string | null;
    main_sumassured_percentage: number | null;
    loan_amount_per_member: number | null;
    loan_repayment_period: string | null;
    loan_interval_per_member: string | null;
    savings_per_member: number | null;
    discount: string | null;
    discount_rate: number | null;
    discount_division_factor: number | null;
    premium_mask_code: number | null;
    rate_division_factor: number | null;
    use_cvr_rate: string | null;
    total_member_earnings: number | null;
    total_loan_amount: number | null;
    average_cover_per_member: number | null;
    load_age_factor: number | null;
    if_inbuilt: string | null;
    apply_commission_expense_loading: number | null;
    beneficiaries: string | null;
    premium_computation_formula: string | null;
    refund_formula: string | null;
    multiplier: number | null;
    multiplier_division_factor: number | null;
    group_premium_rates_code: string | null;
    weekly_indemnity: string | null;
    premium_but_charge_amount: number | null;
    letter_opening_remarks: string | null;
    letter_closing_remarks: string | null;
    quotation_duration_type: string | null;
    cover_duration_type: string | null;
    discount_percentage: number | null;
    computed_premium: number | null;
    before_load_discount_premium: number | null;
    category_description: string | null;
    member_minimum_allowed_premium: number | null;
    aggregate_plan: string | null;
    lnty_code: string | null;
    percentage_payable: number | null;
    cover_term: string | null;
    cvt_code: number | null;
  }

  export interface PremiumMaskDTO {
    pmas_cla_code: null | string;
    pmas_code: number;
    pmas_comment: null | string;
    pmas_cur_code: null | string;
    pmas_cur_desc: null | string;
    pmas_default: string;
    pmas_dependent_anb: null | string;
    pmas_desc: string;
    pmas_hiv_loading: null | string;
    pmas_rate_type: null | string;
    pmas_sht_desc: string;
    pmas_smoker_loading: null | string;
    pmas_with_bonus: string;
    product_code: null | string;
  }
  
  export interface OccupationDTO {
    occupation_code: number;
    occupation_desc: string;
    occupation_hazardous: string;
    occupation_life_class_code: number;
    occupation_short_desc: string;
  }
  
  