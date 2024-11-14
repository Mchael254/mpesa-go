/**
 * Represents of Dms Document Object fetched when listing documents
 */
export interface DmsDocument{
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
export interface SingleDmsDocument extends Partial<DmsDoc>{
}

