export interface OrganizationBranchDto {
  account: string;
  contact: string;
  country: number;
  emailAddress: string;
  emailSource: string;
  fax: string;
  id: number;
  logo: string;
  manager: number;
  name: string;
  organizationId: number;
  physicalAddress: string;
  postAddress: string;
  postalCode: string;
  region: {
    agentSeqNo: string;
    branchMgrSeqNo: string;
    clientSequence: number;
    code: number;
    computeOverOwnBusiness: string;
    dateFrom: string;
    dateTo: string;
    managerAllowed: string;
    name: string;
    organization: string;
    overrideCommissionEarned: string;
    policySeqNo: number;
    postingLevel: string;
    preContractAgentSeqNo: number;
    shortDescription: string;
  };
  shortDescription: string;
  sms_source: string;
  state: number;
  telephoneNumber: string;
  town: number;
}
