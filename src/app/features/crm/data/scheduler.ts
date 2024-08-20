export interface ScheduledJobsDto {
  assignee: string;
  assigneeEmail: string;
  assigneeType: string;
  code: number;
  cronExpression: string;
  description: string;
  endTime: string;
  failNotifyTemplate: number;
  failTempMsg: string;
  failUser: string;
  failUserEmail: string;
  jobAssignee: number;
  jobName: string;
  jobTemplate: number;
  jobType: string;
  nextFireTime: string;
  notifiedFailUser: number;
  notifiedSuccUser: number;
  objExecution: string;
  prevFireTime: string;
  recurrence: string;
  recurrenceInterval: string;
  recurrenceType: string;
  startTime: string;
  status: string;
  succNotifyTemplate: number;
  succTempMsg: string;
  succUser: string;
  succUserEmail: string;
  sysCode: number;
  thresholdType: string;
  thresholdValue: number;
}

export interface ScheduledJobsPostDto {
  code: number;
  description: string;
  endTime: string;
  failNotifyTemplate: number;
  jobAssignee: number;
  jobName: string;
  jobTemplate: number;
  jobType: string;
  nextFireTime: string;
  notifiedFailUser: number;
  notifiedSuccUser: number;
  prevFireTime: string;
  recurrence: string;
  recurrenceInterval: string;
  recurrenceType: string;
  startTime: string;
  status: string;
  succNotifyTemplate: number;
  sysCode: number;
  thresholdType: string;
  thresholdValue: number;
}

export interface Recurrence {
  type: string;
  interval: number;
  daysOfWeek?: string[];
  dayOfMonthMonthly?: number;
  repeatOnTheMonthly?: string;
  monthlyDays?: string[];
  yearlyDays?: string[];
  yearlyMonths?: string[];
  dayOfMonthYearly?: number;
  repeatOnTheYearly?: string;
  end: string;
  endOn?: string;
  occurrences?: number;
}
