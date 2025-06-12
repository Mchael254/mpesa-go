export interface EmailDto {
  code?: number;
  address: string[];
  subject: string;
  message: string;
  status: string;
  emailAggregator: string;
  response: string;
  systemModule: string;
  systemCode: number;
  attachments?: Attachment[];
  fromName: string;
  from: string;
  sendOn: string;
  clientCode?: number;
  agentCode?: number;
}

interface Attachment {
  name: string;
  content: string;
  type: string;
  disposition: string;
  contentId: string;
}

