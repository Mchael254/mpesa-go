export class SurplusTreatyDTO {
    description: string;
    gtric_agn_code: number | null;
    gtric_agn_code_bkp: number | null;
    gtric_agn_sht_desc: string;
    gtric_as_code: number | null;
    gtric_cede_rate: number;
    gtric_code: number | null;
    gtric_comm_amt_pcur: number;
    gtric_cover_from_date: Date | null;
    gtric_cover_to_date: Date | null;
    gtric_cvt_code: number | null;
    gtric_drcr_no: number | null;
    gtric_endr_code: number | null;
    gtric_endr_no: number | null;
    gtric_ipcvt_code: number | null;
    gtric_ipol_code: number | null;
    gtric_ipol_policy_no: number | null;
    gtric_ltr_tran_no: number | null;
    gtric_mendr_code: number | null;
    gtric_mendr_no: number | null;
    gtric_pcm_code: number | null;
    gtric_pmrid_code: number | null;
    gtric_pmritd_code: number | null;
    gtric_pol_code: number | null;
    gtric_pol_cur_code: number | null;
    gtric_pol_cur_symbol: string | null;
    gtric_pol_policy_no: number | null;
    gtric_polm_code: number | null;
    gtric_prem_amt_pcur: number;
    gtric_prem_tax_pcur: number;
    gtric_prev_cede_rate: number | null;
    gtric_prev_com: number | null;
    gtric_prod_code: number | null;
    gtric_refund_prem: number | null;
    gtric_rei_code: number | null;
    gtric_rprem_tax_pcur: number | null;
    gtric_si_amt_pcur: number;
    gtric_stamp_duty: number;
    gtric_ta_code: number | null;
    gtric_tran_type: number | null;
    gtric_trs_code: number | null;
    gtric_trs_sht_desc: string | null;
    gtric_trt_code: number | null;
    gtric_trt_sht_desc: string | null;
    gtric_uwyr: number | null;
    name: string;
}

export class FacultativeTreatyDTO {
    description: string | null;
    gfpc_agen_code: number;
    gfpc_agen_sht_desc: string | null;
    gfpc_amount: number;
    gfpc_amt_or_rate: string | null;
    gfpc_auth_dt: Date | null;
    gfpc_code: number | null;
    gfpc_comm_amt: number;
    gfpc_comm_rate: number | null;
    gfpc_cvt_code: number | null;
    gfpc_dc_no: string | null;
    gfpc_don_by: string | null;
    gfpc_endr_code: number | null;
    gfpc_excess_rate: number | null;
    gfpc_ipol_code: number | null;
    gfpc_ltr_tran_no: number | null;
    gfpc_ltr_tran_type: string | null;
    gfpc_mendr_code: number | null;
    gfpc_pol_code: number | null;
    gfpc_prem_amt: number;
    gfpc_prem_rate: number | null;
    gfpc_prem_rate_div_fac: number | null;
    gfpc_prod_code: number | null;
    gfpc_rate: number | null;
    gfpc_uwyr: number | null;
    gfpc_wef: Date | null;
    name: string;
    net_premium: number | null;
}

export class MemberDetailedSummaryDTO {
    cover_display: string;
    pmrid_code: number;
    pmrid_endr_prem: number;
    pmrid_excess_amt: number | null;
    pmrid_gross_retention: number;
    pmrid_net_prem: number;
    pmrid_net_retention: number;
    pmrid_net_retention_rate: number;
    pmrid_tot_sa: number;
    pmritd_cession_rate: number;
    pmritd_code: number;
    pmritd_net_trt_prem: number;
    pmritd_prev_trt_sa: number | null;
    pmritd_rate: number;
    pmritd_rate_div_factor: number;
    pmritd_remarks: string | null;
    pmritd_stamp_duty: number;
    pmritd_trt_comm: number;
    pmritd_trt_prem: number;
    pmritd_trt_sa: number;
    treaty_display: string;
}

export class ReinsuranceMembersDTO {
    cover_offered: string | null;
    main_mem_no: number;
    mem_inv_applicable: string;
    mem_uid: string;
    member_display: string;
    polm_bpress_loading: string | null;
    polm_code: number;
    polm_cover_offered: string | null;
    polm_diastolic_pr: number | null;
    polm_dty_code: number;
    polm_dty_sht_desc: string;
    polm_height: number | null;
    polm_joint_members: string;
    polm_loading_div_fact: number | null;
    polm_loading_rate: number | null;
    polm_loading_type: string | null;
    polm_med_exempted: string | null;
    polm_mem_code: number;
    polm_mem_no: string;
    polm_mreq_mtg_code: number | null;
    polm_pol_code: number;
    polm_principal_mem_code: number;
    polm_systolic_pr: number | null;
    polm_tot_sa: number;
    polm_weight: number | null;
    polm_weight_loading: number | null;
    polma_anb: number;
}

export interface SurplusTreatyTotalsDTO {
    gfpc_amount: number | null;
    gfpc_comm_amt: number | null;
    gfpc_prem_amt: number | null;
    gtric_comm_amt_pcur: number;
    gtric_prem_amt_pcur: number;
    gtric_prem_tax_pcur: number;
    gtric_si_amt_pcur: number;
    gtric_stamp_duty: number;
  }
  

