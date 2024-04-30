export interface ServiceProviderTypeDTO {
  code: number;
  name: string;
  providerTypeSuffixes: string;
  shortDescription: string;
  shortDescriptionNextNo: string;
  shortDescriptionSerialFormat: string;
  status: string;
  vatTaxRate: string;
  witholdingTaxRate: string;
}

export interface ServiceProviderTypeActivityDTO {
  code: number;
  description: string;
  emailCode: number;
  emailDefault: string;
  messageCode: number;
  messageDefault: string;
  reportDays: number;
  shortDescription: string;
  spTypeCode: number;
}
