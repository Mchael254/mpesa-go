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
  emailAddress: string
}
