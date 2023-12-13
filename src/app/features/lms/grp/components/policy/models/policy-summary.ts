export class MembersDTO {
        category: string;
        date_of_birth: string;
        dependent_types: string;
        email: string;
        member_number: number;
        other_names: string;
        schedule_join_date: string;
        sex: string;
        surname: string;
        telephone_number: string;
}

export class PolicyDetailsDTO {
        agent: string;
        authorised: null | any;
        authorization_date: null | any;
        basic_sum_assured: number;
        branch_description: string;
        calculation_type: null | any;
        client: string;
        currency_rate_type: null | any;
        currency_symbol: string;
        current_endorsement_code: null | any;
        effective_date: string;
        endorsement_code: null | any;
        frequency_of_payment: string;
        inception_date: null | any;
        instalment_day: null | any;
        instalment_loan_amount: null | any;
        instalment_month: null | any;
        instalment_premium: null | any;
        master_policy_number: null | any;
        max_entry_age_limit: null | any;
        medical_total_sum_assured: null | any;
        mrl_sum_assured: null | any;
        occupation_of_holder: null | any;
        paid_to_date: null | any;
        pension_category: null | any;
        pension_mode: null | any;
        policy_code: number;
        policy_number: string;
        prepared_by: null | any;
        product_name: string;
        product_short_description: null | any;
        product_type: null | any;
        quotation_number: null | any;
        status: string;
        total_loan_outstanding_amount: null | any;
        total_premium: number;
        underwriting_year: number;
}

export class PartialWithdrawalsDTO {
        pay_method: string;
        payee: string;
        bank_name: string;
        bank_account_name: string;
        bank_account_no: string;
        notification_date: string;
        amount: number;
        narration: string;
}

export class AnnualValuationsDTO {
        valuation_year: number;
        pnbal_valua_date: string;
        interest_rate: number;
        status: string;
        valuation_date: string;
        employer_bal_bf: number;
        employer_amt: number;
        employer_withdrawal_amt: number;
        employer_contri_income: number;
        employer_bal_income: number;
        employer_balance_cf: number;
        employee_balance_bf: number;
        employee_amt: number;
        employee_vol_amt: number;
        employee_withdrawal_amt: number;
        employee_contri_income: number;
        employee_bal_income: number;
        employee_bal_cf: number;
        total_amount: number;
        withdrawal_total: number;
        tot_bal_carried_forward: number;
        total_bal_bf: number;
        period: string;
        authorised_by: string;
        authorised_date: string;
        wef: string;
        wet: string;
        scheme_fund_bf: number;
        total_deductions: number;
        scheme_fund: number;
        employer_retire_held: number;
        total_fund_bal: number;
        policy_number: string;
        inception_date: string;
        policy_code: number;
        client: string;
        endorsement_code: number;
}