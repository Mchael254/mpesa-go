export interface StaffDto{
  id?: number;
  name: string;
  username: string;
  userType: string;
  emailAddress?: string;
  status: string;
  profileImage?: string;
  department?: string;
  manager?: string;
  telNo?: string;
  phoneNumber?: string;
  otherPhone?: string;
  countryCode?: number;
  townCode?: number;
  personelRank?: string;
  city?: number;
  physicalAddress?: string;
  postalCode?: string;
  departmentCode?: number;
  activatedBy?: string;
  updateBy?: string;
  dateCreated?: string;
  dateActivated?: string;
  granter?: string;
  branchId?: number;
  accountId?: number;
  accountManager?: number;

  profilePicture?: string;
  organizationId?: number;
  organizationGroupId?: number;
  supervisorId?: number;
  supervisorCode?: number;
  organizationCode?: number;
  pinNumber?: string;
  gender?: string;
}
export interface CreateStaffDto {
  id: number,
  username: string;
  userType: string;
  emailAddress?: string;
  personelRank?: string;
  departmentCode?: number;
  granterUserId: number;
  otherPhone: number;
  activatedBy?: string;
  updateBy?: string;
  profilePicture?: string;
  organizationGroupId: number;
  supervisorId?: number;
}
