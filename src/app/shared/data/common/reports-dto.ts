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
