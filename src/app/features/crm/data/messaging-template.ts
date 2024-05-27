export interface MessageTemplate {
  id: number;
  systemCode: number;
  name: string;
  subject: string;
  content: string;
  templateType: string;
  systemModule: string;
  imageAttachment: string;
  imageUrl: string;
  productCode: number;
  productName: string;
  status: string;
}

export interface MessageTemplateResponse {
  content: MessageTemplate[],
  pageable: Pageable,
  totalElements: number,
  totalPages: number,
  last: boolean,
  size: number,
  sort: Sort,
  numberOfElements: number,
  first: boolean,
  empty: boolean
}

interface Sort {
  empty: boolean,
  sorted: boolean,
  unsorted: boolean,
}

interface Pageable {
  sort: Sort,
  offset: number,
  pageNumber: number,
  pageSize: number,
  paged: boolean,
  unpaged: boolean
}
