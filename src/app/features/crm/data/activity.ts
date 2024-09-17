export interface Activity {
  id: number;
  activityTypeCode: number;
  wef: Date;
  wet: Date;
  duration: number;
  subject: string;
  location: string;
  assignedTo: number;
  relatedTo: number;
  statusId: number;
  desc: string;
  reminder: string;
  team: number;
  reminderTime: Date;
  messageCode: number;
}

export interface ActivityType {
  id: number;
  desc: string;
  systemCode: number;
}

export interface PriorityLevel {
  id: number;
  desc: string;
  shortDesc: string;
}

export interface ActivityStatus {
  code: number;
  desc: string;
  id: number;
}

export interface ActivityTask {
  id: number;
  actCode: number;
  dateFrom: Date;
  dateTo: Date;
  subject: string;
  statusId: number;
  priorityCode: number;
  accCode: number;
}

export interface ActivityNote {
  id: number;
  accCode: number;
  contactCode: number;
  subject: string;
  notes: string;
  attachment: Uint8Array;
  actCode: number;
  attachmentType: string;
  fileName: string;
}

export interface ActivityParticipant {
  id: number;
  name: string;
  emailAddress: string;
}
