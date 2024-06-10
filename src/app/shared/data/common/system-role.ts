export interface SystemRole {
  id: number;
  roleName: string;
  shortDesc?: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  editedBy?: string;
  authorized?: string;
  authorizedBy?: string;
  organizationId?: number;
  systemCode?: number
}
