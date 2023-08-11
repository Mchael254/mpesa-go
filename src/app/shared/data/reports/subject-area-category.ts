import {SelectionQuery} from "./selection-query";

export interface SubjectAreaCategory {
  id: number;
  name: string;
  subjectAreaId: number;
  subCategory: {
    code: number,
    name: string,
    queryName: string,
    description: string,
    categoryAreas: SelectionQuery[]
  }[],
  description: string;
}
