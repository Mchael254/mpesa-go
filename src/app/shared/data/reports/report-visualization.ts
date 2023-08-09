import {Criteria} from "./criteria";
export interface ReportVisualization {
  labels: string[],
  datasets: { data: number[], label: string}[],
  reportType: string,
  reportName: string,
  criteria: Criteria[],
  measures: string[],
  dimensions: string[],
  tableDetails: { reportLabels: string[], reportData: number[] }
}
