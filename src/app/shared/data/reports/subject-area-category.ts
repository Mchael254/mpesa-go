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
export interface SubCategory {
  code: number;
  name: string;
  queryName: string;
  description: string;
  categoryAreas: SelectionQuery[];
}
export interface Metrics {
  code: number,
  name: string,
  description: string,
  subjectAreaId: number,
  subCategory: [{
    code: number,
    name: string,
    value: string,
    description: string,
    categoryAreas: []
  }]
}
