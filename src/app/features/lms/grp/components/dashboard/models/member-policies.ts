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
  
  