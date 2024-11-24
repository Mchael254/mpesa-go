import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { concatMap, finalize, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmsService } from "../../../../../service/dms/dms.service";
import { SessionStorageService } from "../../../../../../../shared/services/session-storage/session-storage.service";
import { ToastService } from "../../../../../../../shared/services/toast/toast.service";
import { Router } from "@angular/router";
import { ClientService } from "../../../../../../entities/services/client/client.service";
import { StringManipulation } from "../../../../../util/string_manipulation";
import { SESSION_KEY } from "../../../../../util/session_storage_enum";

/**
 * Component for documents upload
 */
@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.css'],
})

export class DocumentsUploadComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
    {
      label: 'Document Upload',
      url: '/home/lms/ind/quotation/documents-upload',
    },
  ];
  steps = stepData; // Step data for the stepper component, loaded from a JSON file.
  documentList: any[] = []; // Contains the list of all documents to be displayed including their statuses 
  clientDocumentList: any[] = []; // Stores the list of documents that belong to a specific client.
  requiredDocuments: any[]; // Holds the list of documents that are required for a particular operation.

  constructor(
    private crm_client_service: ClientService, // Service for client-related operations
    private dms_service: DmsService, // Service for document management
    private spinner_service: NgxSpinnerService, // Service for showing/hiding spinners
    private session_storage: SessionStorageService, // Service for session storage
    private toast_service: ToastService, // Service for displaying toast notifications
    private router: Router // Router for navigation
  ) {}
  /**
   * Lifecycle hook that runs when the component is initialized.
   * Retrieves client documents and required documents, merging their statuses
   * into the document list for display in the UI.
   */
  ngOnInit(): void {
    // Show spinner while data is being loaded
    this.spinner_service.show('download_view');
    this.getDocumentsByClientId()
      .pipe(
        // Chain operations to first get client documents and then required documents
        concatMap((document_data: any) => {
          this.clientDocumentList = document_data['content']; // Store client documents
          return this.getRequiredDocument();
        }),
        // Hide spinner when all operations are complete
        finalize(() => {
          this.spinner_service.hide('download_view');
        })
      )
      .subscribe((data: any[]) => {
        this.requiredDocuments = data; // Store required documents
        // Merge client document data with required document data
        this.documentList = data.map((d) => {
          let temp = d['description'].toLowerCase();
          let clientDocumentExist = this.clientDocumentList.find(
            (da: any) => da['type']?.toString().toLowerCase() === temp
          );
          if (clientDocumentExist) {
            d = { ...d, ...clientDocumentExist }; // Merge properties
            d['is_uploaded'] = true; // Mark as uploaded
          } else {
            d['is_uploaded'] = false; // Mark as not uploaded
          }
          d['file_extension'] = 'pdf'; // Default to PDF for simplicity
          return d;
        });
      });
  }

  /**
   * Fetches documents associated with a specific client ID.
   * @returns Observable containing client document data.
   */  getDocumentsByClientId() {
    const client_info = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    return this.dms_service.getClientDocumentById(client_info['client_code']);
  }

  /**
   * Fetches documents associated with a specific client ID.
   * @returns Observable containing client document data.
   */
  getRequiredDocument() {
    return this.crm_client_service.getclientRequiredDocuments();
  }

  // Checks if the file is an image type
  /* isImage(file_extension: string): boolean {
    return ['jpeg', 'png', 'jpg'].includes(file_extension.toLowerCase());
  } */

  // Automatic file upload handler
  /* onBasicUploadAuto(e: any) {
    console.log('File uploaded automatically:', e);
  } */

  /**
   * Handles the file upload process for a specific document.
   * @param event - The event triggered by the file input element.
   * @param doc_name - The name of the document being uploaded.
   */
  uploadFile(event: any, doc_name: string) {
    // Show spinner to indicate ongoing file upload process
    this.spinner_service.show('download_view');

    // Retrieve client information from session storage
    const client_info = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));

    // Prepare the document name (without file extension) for upload
    const fileName: string = doc_name.replaceAll('.pdf', '').toLowerCase();

    // Access the list of files from the file input event
    const fileList: FileList = event.target.files;  // Adjusted to `event.target.files` to access files correctly

    // Ensure at least one file is selected for upload
    if (fileList.length > 0) {
      const file = fileList[0]; // Select the first file
      const formData = new FormData(); // Initialize form data for upload
      formData.append('file', file, file.name); // Append the file to form data

      // Call the document service to save the client document
      this.dms_service.saveClientDocument(client_info['client_code'], fileName, formData)
        .pipe(
          // Ensure spinner is hidden after the upload process completes
          finalize(() => this.spinner_service.hide('download_view'))  // Ensures spinner stops on completion
        )
        .subscribe(
          (data: any) => {
            // Update the documentList and mark the file as uploaded
            this.updateDocumentList(data, file);
            // Show success toast notification
            this.toast_service.success(`Successfully uploaded ${data['type']?.toLowerCase()}'s document`, 'Document Upload');
          },
          (err) => {
            // Show error toast notification in case of upload failure
            this.toast_service.danger('Unable to upload document', 'Document Upload');
          }
        );
    }
  }

  /**
   * Updates the `documentList` to reflect the newly uploaded document.
   * Identifies the corresponding document in the `documentList` based on its type  and updates its properties to mark it as uploaded. 
   * The uploaded file's name and a user-friendly description are also updated
   * @param data - The response data from the upload service containing details about the uploaded document.
   * @param file - The file object representing the uploaded document.
   */
  updateDocumentList(data: any, file: File) {
    // Iterate through the existing document list and update the relevant document
    this.documentList = this.documentList.map((doc) => {
      // Check if the document type matches the uploaded document type
      if (doc.description.toLowerCase() === data['type']) {
        return {
          ...doc, // Retain all other properties of the document
          is_uploaded: true, // Mark the document as uploaded
          uploadedFileName: file.name, // Save the uploaded file's name
          description: file.name.replace('.pdf', '').replace(/_/g, ' ')  // Update description
        };
      }
      return doc; // Return unchanged document for non-matching entries
    });
  }

 /**
 * Deletes a document by its ID and updates the document list to reflect the deletion.
 * Removes the document from the backend and resets the document's status in the list.
 * It also displays a success or error message based on the operation's result.
 * @param document - The document object to be deleted.
 * @param index - The index of the document in the `documentList`.
 */
  deleteDocumentFileById(document: any, index: number) {
    this.spinner_service.show('download_view');
    this.dms_service.deleteDocumentById(document['id']).subscribe(
      () => {
        let doc = null;
        // Update the document list and reset the document at the specified index
        this.documentList = this.documentList.map((data, i) => {
          if (i === index) {
            doc = this.requiredDocuments.find(
              (req_doc: any) => req_doc['description'].toLowerCase() === document['type'].toLowerCase()
            );
            doc['file_extension'] = 'pdf';
            doc['is_uploaded'] = false;
            return doc;
          }
          return data;
        });
        this.toast_service.success(`Deleted ${doc['description'].toLowerCase()}'s document`, 'Document Upload');
      },
      (err) => {
        this.toast_service.danger('Unable to delete document', 'Document Upload');
      },
      () => this.spinner_service.hide('download_view')
    );
  }

  /**
   * Validates if all required documents are either uploaded, exempted, or marked for later upload.
   * @returns {boolean} - Returns `true` if all required documents meet one of the conditions, otherwise `false`.
   */
  validateDocument(): boolean {
    return this.documentList.filter(doc => 
      doc?.is_uploaded || doc?.is_exempt || doc?.upload_later // Check the document's status
      ).length === this.requiredDocuments?.length;
  }

  /**
   * Calculates and logs the upload progress of a file.
   * @param event - The upload event containing `loaded` and `total` bytes.
   * @returns {number} - The progress percentage of the file upload.
   */
  onProgress(event: any): number {
    const progressPercentage = Math.round((event.loaded / event.total) * 100);
    console.log('File upload progress:', progressPercentage + '%');
    return progressPercentage;
  }

  /**
   * Navigates to the next page if all required documents are uploaded, exempted, or marked for later upload.
   * 
   * Displays a warning message if validation fails, or proceeds to the next page upon successful validation.
   */
  nextPage() {
    if (!this.validateDocument()) {
      this.toast_service.danger('All required documents must be uploaded, exempted, or marked for later upload', 'Document Upload');
    } else {
      this.toast_service.success('Successfully completed the document process', 'Document Upload');
      this.router.navigate(['/home/lms/ind/quotation/product']);
    }
  }

  /**
   * Toggles the exempt status of a document and displays an informational message.
   * @param document - The document object for which the exempt status is toggled.
   */
  handleExempt(document: any) {
    document.is_exempt = !document.is_exempt;
    this.toast_service.info(`${document.description} marked as exempt`, 'Document Upload');
  }

  /**
   * Toggles the upload-later status of a document and displays an informational message.
   * @param document - The document object for which the upload-later status is toggled.
   */
  handleUploadLater(document: any) {
    document.upload_later = !document.upload_later;
    this.toast_service.info(`${document.description} marked for later upload`, 'Document Upload');
  }
}