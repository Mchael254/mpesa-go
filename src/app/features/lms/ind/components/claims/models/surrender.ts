
export interface SurrenderReason{
  sur_code: number;
  sht_desc: string;
  description: string;
  appl_level: string;
}

export interface SurrenderRequest{
  "pol_code": number;
  "delete_trans": string;
  "surr_type": string;
  "surr_date": string;
  "done_date": string;
  "penalty_rate": string;
  "penalty_div_fac": string;
  "request_date": string;
}
