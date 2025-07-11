export interface AiFileUploadMetadata {
  file_id: string;
  user_id: string;
  metadata_: Record<string, any>;
  config: Record<string, any>;
  content_block: {
    type?: string;
    mime_type?: string;
    source_type?: string;
    url?: string;
    metadata?: Record<string, any>;
  };
}


export interface AiDocumentHubRequest {
  assistant_id: string;
  config: {
    configurable: {
      score_extraction: boolean;
      strict: boolean;
    };
  };
  input: {
    schema: string;
    files: string[];
  };
}

