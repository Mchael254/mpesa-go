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

export const ServiceDeskReports = [
  { code: 1012, desc: 'Overdue Request' },
  { code: 1016, desc: 'Requests Per Assignee' },
  { code: 1014, desc: 'Requests Per Owner Type' },
  { code: 101410, desc: 'Requests Per Reporter' },
  { code: 1015, desc: 'Service Requests By Type' },
  { code: 1013, desc: 'All Service Requests' },
  { code: 1020, desc: 'Service request comments report' }
];
