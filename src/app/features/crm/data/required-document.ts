export interface RequiredDocumentDTO {
  accountType: string;
  dateSubmitted: string;
  description: string;
  id: number;
  isMandatory: string;
  organizationId: number;
  organizationName: string;
  shortDescription: string;
}

export interface AssignedToDTO {
  id: number;
  isMandatory: string;
  requiredDocumentCode: number;
  requiredDocumentName: string;
  accountType: string;
  accountSubTypeCode: number;
  accountSubType: string;
}
