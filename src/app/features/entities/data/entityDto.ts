import { AccountStatus } from "./AccountStatus";
import { kycInfoDTO } from "./accountDTO";
import { PartyTypeDto } from "./partyTypeDto";

export interface EntityDto {
  categoryName: string;
  countryId: number;
  dateOfBirth: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  id: number;
  modeOfIdentity: IdentityModeDTO,
  modeOfIdentityName?: string
  identityNumber: number;
  name: string;
  organizationId: number;
  pinNumber: string;
  profilePicture: string;
  profileImage: string;
  partyTypeId?: number;
}


export interface IdentityModeDTO {
  id?: number;
  name?: string;
  identityFormat?: string;
  identityFormatError?: string;
  organizationId?: number;
}

export interface EntityResDTO {
  category: string;
  countryId: number;
  dateOfBirth: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  modeOfIdentityId: number;
  identityNumber: string;
  name: string;
  organizationId: number;
  partyTypeId: number;
  pinNumber: string;
  profileImage: string;
}

export interface AccountReqPartyId {
  accountCode: number;
  accountTypeId: number;
  category: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  id: number;
  partyId: number;
  partyType: PartyTypeDto,
  kycInfo?: kycInfoDTO,
  organizationId: number
  organizationGroupId: number
}

export interface EntityRelatedAccount extends AccountReqPartyId{
  currentStatus?: string;
  statusList?: AccountStatus[]
}

export interface ReqPartyById {
  categoryName?: string;
  countryId?: number;
  dateOfBirth?: string;
  effectiveDateFrom?: string;
  effectiveDateTo?: string;
  id?: number;
  modeOfIdentity?: IdentityModeDTO,
  modeOfIdentityNumber?: string;
  name?: string;
  organizationId?: number;
  pinNumber?: string;
  profilePicture?: string;
  profileImage?: string;
  identityNumber?: number;
}

export interface Roles {
  role: string;
  wet: string;
  wef: string;
}

export interface PoliciesDTO {
  policyNumber: string,
  type: string,
  insured: string,
  status: string,
  premium: string,
  renewalDate: string
}

export interface QuotesDTO {
  quotesNumber: string,
  type: string,
  insured: string,
  status: string,
  premium: string,
  expiryDate: string
}

export interface ClaimTrackingDTO {
  claimNumber: string,
  classOfBusiness: string,
  policyNumber: string,
  status: string,
  dateOfLoss: string,
  incurredAmount: string
}
