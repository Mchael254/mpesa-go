export interface ReportsDto {
  encode_format: string,
  params: params[],
  report_format: string,
  rpt_code: number,
  system: string
}

export interface params {
  name: string,
  value: string
}

export interface ReportFileDTO {
  bytes: string,
  data_file: string,
  error_msg: string,
  output_file: string,
  params: ReportFileParams[],
  report_format: string,
  report_name: string,
  rpt_code: number,
  rpt_prnt_srv_appl: string,
  rpt_tmpl_code: number,
  style_file: string,
  template_file: string
}

export interface ReportFileParams {
  active: string,
  code: 0,
  desc: string,
  name: string,
  prompt: string,
  query_data: params[],
  rpt_code: 0,
  type: string,
  user_required: string
}

export interface SystemReportDto {
  code: number,
  system_code: number,
  name: string,
  description: string,
  datafile: string,
  application_level: string,
  status: string,
  rsm_code: number,
  order: number,
  print_srv_appl: string,
  print_srvc_appl: string,
  type: string,
  visible: string,
  short_description: string,
  update: string
}
