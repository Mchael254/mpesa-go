export interface ServiceRequestStatusDTO {
  srsCode: number,
  srsName: string,
  srsShortDescription: string,
  srsMainStatus: string
}

export interface ServiceRequestCategoryDTO {
  id: number,
  desc: string,
  shtDesc: string,
  usrCode: number,
  sysCode?: number,
  user?: UserDTO
}

interface UserDTO {
  id: number,
  name: string,
  username: string,
  emailAddress: string,
  physicalAddress: string
}

export interface ServiceRequestIncidentDTO {
  id: number,
  name: string,
  validity: number,
  userCode: number,
  branchCode: number,
  requestTypeCode: number,
  isDefault: string,
  user?: UserDTO
  escalationLevels?: ServiceRequestEscalationDTO[];
}

export interface ServiceRequestsDTO {
  id: number,
  accCode: number,
  accType: string,
  assignee: number,
  captureDate: string,
  captureDateAlternate: string,
  clientStatus: string,
  closedBy: string,
  communicationMode: string,
  communicationModeValue: string,
  comments: string,
  date: string,
  desc: string,
  dueDate: string,
  endorsementCode: number,
  initiator: string,
  incidentCode: number,
  ownerCode: number,
  ownerType: string,
  policyNo: string,
  receiveDate: string,
  refNumber: string,
  reminder: string,
  reopennedDate: string,
  reporter: string,
  requestDate: string,
  resolutionDate: string,
  secondaryCommunicationMode: string,
  secondaryCommunicationModeValue: string,
  solution: string,
  statusCode: number,
  categoryCode: number,
  mainStatus: string,
  stsCode: number,
  summary: string,
  tcbCode: number,
  timeOfCommunication: string,
  source: string,
  statusDto?: ServiceRequestStatusDTO,
  assigneeDto?: UserDTO,
  ownerDto?: UserDTO,
  categoryDto?: ServiceRequestCategoryDTO,
  accountDto?: AccountDto,
  incidentDto?: ServiceRequestIncidentDTO
}

export interface ServiceRequestDocumentsDTO {
  id: number,
  desc: string,
  fileName: string,
  docId: string,
  mimeType: string,
  name: string,
  refNo: string,
  remarks: string,
  srdCode: number,
  srdDesc: string,
  tsrCode: number,
  postedBy: string,
  postedOn: string
}

export interface AccountDto {
  id: number,
  name: string,
  shortDescription: string,
  emailAddress: string,
  physicalAddress: string,
  smsNumber: string
}

export interface ServiceRequestEscalationDTO {
  id: number,
  level: number,
  assigneeId: number,
  duration: number,
  ccId: number,
  incidentId: number
  assignee: UserDTO,
  cc: UserDTO,
}
