export interface SmsHistoryDto {
  agentCode: number;
  agentName: string;
  claimNo: string;
  clientCode: number;
  clientName: string;
  code: number;
  countryCode: number;
  countryName: string;
  countryZipCode: string;
  divisionName: string;
  message: string;
  policyCode: string;
  policyNo: string;
  policyStatus: string;
  sendDate: string;
  sentResponse: string;
  smsAggregator: string;
  smsPreparedBy: string;
  status: string;
  systemCode: number;
  systemModule: string;
  telephoneNumber: string;
}

export interface EmailHistoryDto {
  address: [];
  agentCode: number;
  agentName: string;
  attachmentName: string;
  attachments: [
    {
      content: string;
      contentId: string;
      disposition: string;
      name: string;
      type: string;
    }
  ];
  claimCode: string;
  claimNo: string;
  clientCode: number;
  clientName: string;
  code: string;
  emailAggregator: string;
  emailRecipient: string;
  from: string;
  fromName: string;
  message: string;
  policyCode: number;
  policyNo: string;
  preparedBy: string;
  preparedDate: string;
  quotationCode: number;
  quotationNo: string;
  response: string;
  sendOn: string;
  status: string;
  subject: string;
  systemCode: number;
  systemModule: string;
}
