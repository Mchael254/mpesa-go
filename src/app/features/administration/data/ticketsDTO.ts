// import {StaffResDto} from "../../../../account/staff/models/staffDto";

import {DepartmentDto} from "../../../shared/data/common/departmentDto";
import {StaffResDto} from "../../entities/data/StaffDto";

export interface TicketsDTO {
  agentName: string,
  clientName: string,
  task: {
    activityName: string,
    assignee: string,
    code: number,
    description: string,
    executionId: string,
    name: string,
    priority: number,
    state: string,
    taskClass: string,
    taskDefinitionName: string
  },
  ticket: {
    active: string,
    adhocName: string,
    agentCode: number,
    assignee: string,
    claimNo: string,
    claimTransactionNumber: number,
    claimTransactionType: string,
    claimType: string,
    clientCode: number,
    code: number,
    date: Date,
    endorsment: string,
    endorsmentCode: number,
    externalReferenceNo: string,
    ggtNo: number,
    groupUser: string,
    policyCode: number,
    policyNo: string,
    processId: string,
    processSubAreaCode: number,
    productType: string,
    prpCode: number,
    quotationCode: number,
    quotationNo: string,
    reassigned: string,
    reassignedDate: Date,
    remarks: string,
    reporter: string,
    sysCode: number,
    sysModule: string,
    transNo: number,
    transactionEffectiveDate: Date,
    transactionNumber: number,
    type: string
  }
}

export interface TicketReassignDto {
  groupUser: string;
  remarks: string;
  ticketCode: number;
  userCodeToAssignFrom: number;
  userCodeToAssignTo: number;
}

export interface TicketModuleDTO {
  code: number,
  shortDescription: string,
  description: string,
  maximumAuthorizationAmount: number;
  version: number
}
export interface TicketTypesDTO {
  code: number,
  shortDescription: string,
  description: string,
  version: number
}
export interface TicketCountDTO {
  activityName: string,
  totalTickets: number
}
export interface TransactionsDTO {
  /*agentName: string,
  clientName: string,
  premium: number,
  transactionNumber: null,
  policyNo: string,
  transactionDate: string,
  authorizationDate: string,
  effectiveToDate: string,
  transactionAuthorisedBy: string,
  totalEndorsementDiffAmount: null,
  transactionAuthorised: string,
  branchName: string,
  doneBy: string,
  renewalEndorsementNo: string,
  policyStatus: string,
  effectiveDate: string,
  productShortDescription: string,
  status: string,*/
  DONEBY: string,
  TRANSACTIONDATE: string,
  TRASACTIONNUMBER: number,
  AUTHORIZATIONDATE: number,
  POLICYSTATUS: string,
  POLICYNO: string,
  RENEWALENDORSEMENTNO: string,
  AGENTNAME: string,
  TRANSACTIONAUTHORISED: string,
  EFFECTIVEDATE: number,
  EFFECTIVETODATE: number,
  PREMIUM: number,
  AMOUNT: number,
  CLIENTNAME: string,
  TRANSACTIONAUTHORISEDBY: string,
  PRODUCTSHORTDESCRIPTION: string,
  BRANCHNAME: string,
  STATUS: string


}
export interface TransactionsCountDTO {
  authorizedBy: string,
  module: string,
  totalAmount: number,
  totalCount: number
}
export interface AggregatedEmployeeData{
  transaction?: TransactionsCountDTO;
  staffs?: StaffResDto;
  department?: DepartmentDto;
}
export interface TransactionsRoutingDTO {
  module: string,
  username: string,
  name: string
}

export interface BusinessTransactionsDTO {
  code: string,
  transactionType: string,
  debitCode: string,
  creditCode: string
}

export interface NewTicketDto {
  intermediaryName?: string;
  clientName?: string;
  ticketAssignee?: string;
  ticketID?: number;
  createdOn?: string;
  refNo?: string;
  ticketFrom?: string;
  ticketName?: string;
  ticketSystem?: string;
  policyCode?: number;
  policyNumber?: string;
  ticketBy?: string;
  ticketDate?: string;
  ticketDueDate?: string;
  ticketRemarks?: string;
  quotationNo?: string
  claimNo?: string;
  systemModule?: string;
  claimNumber?: string;
  renewalDate?: string;
  endorsementNumber?: string;
  endorsementRemarks?: string;
  quotationNumber?: string;

}
