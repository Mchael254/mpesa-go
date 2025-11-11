export interface EmailDto {
  code?: number;
  address: string[];
  ccAddress?: string,
  bccAddress?: string,
  subject: string;
  message: string;
  status: string;
  emailAggregator: string;
  response?: string;
  systemModule?: string;
  systemCode?: number;
  attachments?: Attachment[];
  fromName?: string;
  from?: string;
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
export interface WhatsappDto {
  recipientPhone: string;
  message: string;
  templateName: string;
  templateParams: string[];
  attachments: {
    fileName: string;
    mimeType: string;
    data: string;
    caption: string;
  }[];
}

export interface SmsMessage {
  message: string;
  sendDate: string;
  systemCode: number;
  telephoneNumber: string;
}

export interface SmsDto {
  scheduledDate: string | null;
  smsMessages: SmsMessage[];
}


