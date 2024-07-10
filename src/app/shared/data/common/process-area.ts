import {ProcessSubArea} from "./process-sub-area";

export interface ProcessArea {
  id: number,
  roleAreaCode: number,
  name: string,
  shortDesc: string,
  visible: string,
  processSubAreas?: ProcessSubArea[]
}
