import {Criteria} from "./criteria";

export interface Report {
  id?: number;
  backgroundColor?: string;
  borderColor?: string;
  dashboardId: number;
  folderId: number;
  reportDescription: string;
  reportName: string;
  reportType: string;
  userId: number;
  criteria?: string | Criteria;
  active?: boolean;
}
