export interface Folder {
  id: number;
  name: string;
  desc: string;
  userId: number;
  active?: boolean
}

export enum FolderId {
  MY_REPORTS = 0,
  SHARED_REPORTS = 1,
}
