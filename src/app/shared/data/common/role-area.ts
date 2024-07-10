import {SystemsDto} from "./systemsDto";

export interface RoleArea {
  id: number,
  system: SystemsDto,
  systemCode: number,
  name: string,
  shortDesc: string,
  description: string,
  visible: string
}
