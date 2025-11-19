/**
 * Represents of Dms Document Object fetched when listing documents
 */
export interface DmsDocument {
  actualName?: string;
  agentCode?: string;
  batchNo?: string;
  beneficiaryId?: string;
  beneficiaryName?: string;
  byteData?: string;
  cdsNo?: string;
  claimNo?: string;
  clientName?: string;
  companyName?: string;
  correspondenceDate?: string;
  correspondenceType?: string;
  data?: string;
  dateCreated?: string;
  dateReceived?: string;
  deceasedname?: string;
  docAuditUser?: string;
  docCommentDate?: string;
  docComments?: string;
  docDescription?: string;
  docReceivedDate?: string;
  docRefNo?: string;
  docRemark?: string;
  docType?: string;
  documentDate?: string;
  endorsementNo?: string;
  errMessage?: string;
  folders?: Record<string, string>;
  id?: string;
  idNo?: string;
  mimeType?: string;
  modifiedBy?: string;
  name?: string;
  newAccNo?: string;
  oldAccNo?: string;
  palNo?: string;
  pdsDate?: string;
  policyNo?: string;
  scheduleNo?: string;
  shareholderId?: string;
  shareholderName?: string;
  shareholderNo?: string;
  versionLabel?: string;
  format?: string;
  userName?: string,
  clientCode?: string,
  agentName?: string,
  docData?: string
  spName?: string,
  spCode?: string,
  originalFileName?: string
}

/**
 * Represents a single Dms Document when fetching by id
 */
export interface DmsDoc {
  docMimetype: string;
  byteData?: string;
  docName?: string;
  createdDate?: Date | string;
  empty?: boolean;
  url?: string;
}
export interface SingleDmsDocument extends Partial<DmsDoc> {
}
export interface RiskDmsDocument {
  agentCode?: string;
  agentName?: string;
  brokerCode?: string;
  brokerName?: string;
  brokerType?: string;
  caseNo?: string;
  cbpCode?: string;
  cbpName?: string;
  claimNo?: string;
  claimantNo?: string;
  clientCode?: string;
  clientFullname?: string;
  clientId?: string;
  clientName?: string;
  dateReceived?: string;
  department?: string;
  deptName?: string;
  docData?: string;
  docDescription?: string;
  docId?: string;
  docReceivedDate?: string;
  docRefNo?: string;
  docRemark?: string;
  docType?: string;
  document?: string;
  documentName?: string;
  documentType?: string;
  endorsementNo?: string;
  fileName?: string;
  folderId?: string;
  memberName?: string;
  memberNo?: string;
  module?: string;
  originalFileName?: string;
  paymentType?: string;
  policyNo?: string;
  policyNumber?: string;
  processName?: string;
  productCode?: string;
  proposalNo?: string;
  providerCode?: string;
  providerName?: string;
  qouteCode?: string;
  quoteDate?: string;
  rdCode?: string;
  referenceNo?: string;
  riskID?: string;
  spCode?: string;
  spName?: string;
  subject?: string;
  transNo?: string;
  transType?: string;
  userName?: string;
  username?: string;
  valuerDate?: string;
  valuerName?: string;
  voucherNo?: string;
}
export interface ReceiptUploadRequest {
  docType: string;
  docData: string;
  module: string;
  originalFileName: string;
  filename: string;
  referenceNo?: string;
  docDescription?: string;
  amount?: number;
  paymentMethod?: string;
  policyNumber?: string;
}
