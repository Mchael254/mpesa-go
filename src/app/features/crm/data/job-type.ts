export interface JobType {
  code: string;
  name: string;
}

export interface Routine {
  code: number;
  description: string;
  function: string;
  shortDescription: string;
  systemCode: number;
}

export interface Reports {
  code: number;
  dataFile: string;
  description: string;
  isUpdated: string;
  name: string;
  order: number;
  rsmCode: number;
  shortDescription: string;
  status: string;
  systemCode: number;
  type: string;
  visible: string;
  waterMarkFile: string;
}

export interface Alerts {
  applicationLevel: string;
  code: number;
  defaultMessage: string;
  emailAddress: string;
  embeddedImageUrl: string;
  htmlMessage: string;
  isActive: string;
  isHtml: string;
  message: string;
  messageSubject: string;
  productCode: number;
  recipient: string;
  recipientName: string;
  sender: string;
  shortDescription: string;
  systemCode: number;
  systemModule: string;
  systemProduct: string;
  systemProductName: string;
  templatePurpose: string;
  themeColor: string;
  tssCode: number;
  type: string;
}
