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
