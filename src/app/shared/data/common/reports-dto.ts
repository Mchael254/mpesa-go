export interface ReportsDto {
  encodeFormat: string,
  params: params[],
  reportFormat: string,
  rptCode: number,
  system: string
}

export interface params {
  name: string,
  value: string
}

export interface ReportFileDTO {
  bytes: string,
  dataFile: string,
  errorMsg: string,
  outputFile: string,
  params: ReportFileParams[],
  reportFormat: string,
  reportName: string,
  rptCode: number,
  rptPrntSrvAppl: string,
  rptTmplCode: number,
  styleFile: string,
  templateFile: string
}

export interface ReportFileParams {
  active: string,
  code: 0,
  desc: string,
  name: string,
  prompt: string,
  queryData: params[],
  rptCode: 0,
  type: string,
  userRequired: string
}

export interface SystemReportDto {
  code: number,
  systemCode: number,
  name: string,
  description: string,
  datafile: string,
  applicationLevel: string,
  status: string,
  rsmCode: number,
  order: number,
  printSrvAppl: string,
  printSrvcAppl: string,
  type: string,
  visible: string,
  shortDescription: string,
  update: string
}
