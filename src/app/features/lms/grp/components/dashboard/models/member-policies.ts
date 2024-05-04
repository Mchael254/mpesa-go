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
  
  