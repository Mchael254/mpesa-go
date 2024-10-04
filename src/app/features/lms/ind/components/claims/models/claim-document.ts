export interface ClaimDocument {
  id?: string;
  submitted: string;
  date_given: string;
  doc_no: string;
  expired: string;
  crd_code: number;
  sht_desc: string;
  desc: string;
  uploadedDocId?: string;
}

export interface DocumentLabel {
  id: number;
  key: string;
  value: string;
}

export interface UploadedDocumentContent {
  id: string;
  mime_type: string;
  file_extension: string;
  context_by_service: string;
  file_storage_backend_type: string;
  backend_file_id: string;
  backend_file_url: string;
  type: string;
  module_upload_type: string;
  owner_type: string;
  owner_code: number;
  created_at: string;
  updated_at: string;
  labels: DocumentLabel[];
}

export interface SortInfo {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  sort: SortInfo;
  page_number: number;
  page_size: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface UploadedDocumentResponse {
  content: UploadedDocumentContent[];
  pageable: Pageable;
  total_elements: number;
  total_pages: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  number_of_elements: number;
  first: boolean;
  empty: boolean;
}
