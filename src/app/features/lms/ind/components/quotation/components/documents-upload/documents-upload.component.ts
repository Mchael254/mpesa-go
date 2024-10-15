import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { concatMap, finalize, of } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {DmsService} from "../../../../../service/dms/dms.service";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import {Router} from "@angular/router";
import {ClientService} from "../../../../../../entities/services/client/client.service";
import {StringManipulation} from "../../../../../util/string_manipulation";
import {SESSION_KEY} from "../../../../../util/session_storage_enum";

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
  steps = stepData;
  documentList: any[] = [];
  clientDocumentList: any[] = [];
  requiredDocuments: any[];

  constructor(
    private crm_client_service: ClientService,
    private dms_service: DmsService,
    private spinner_service: NgxSpinnerService,
    private session_storage: SessionStorageService,
    private toast_service: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner_service.show('download_view');
    this.getDocumentsByClientId()
      .pipe(
        concatMap((document_data: any) => {
          this.clientDocumentList = document_data['content'];
          return this.getRequiredDocument();
        }),
        finalize(() => {
          this.spinner_service.hide('download_view');
        })
      )
      .subscribe((data: any[]) => {
        this.requiredDocuments = data;
        this.documentList = data.map((d) => {
          let temp = d['description'].toLowerCase();
          let clientDocumentExist = this.clientDocumentList.find(
            (da: any) => da['type']?.toString().toLowerCase() === temp
          );
          if (clientDocumentExist) {
            d = { ...d, ...clientDocumentExist };
            d['is_uploaded'] = true;
          } else {
            d['is_uploaded'] = false;
          }
          d['file_extension'] = 'pdf'; // Default to PDF for simplicity
          return d;
        });
      });
  }

  // Fetches required documents for the client
  getRequiredDocument() {
    return this.crm_client_service.getclientRequiredDocuments();
  }

  // Checks if the file is an image type
  isImage(file_extension: string): boolean {
    return ['jpeg', 'png', 'jpg'].includes(file_extension.toLowerCase());
  }

  // Automatic file upload handler
  onBasicUploadAuto(e: any) {
    console.log('File uploaded automatically:', e);
  }

  // Upload file for the specific document
  uploadFile(event: any, doc_name: string) {
    this.spinner_service.show('download_view');
    const client_info = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    const fileName: string = doc_name.replaceAll('.pdf', '').toLowerCase();
    const fileList: FileList = event.files;

    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.dms_service.saveClientDocument(client_info['client_code'], fileName, formData)
        .pipe(finalize(() => this.spinner_service.hide('download_view')))
        .subscribe(
          (data: any) => {
            // Update the documentList and mark the file as uploaded
            this.documentList = this.documentList.map((loop_data) => {
              let temp = loop_data['description'].toLowerCase();
              if (temp === data['type']) {
                loop_data = { ...loop_data, ...data };
                loop_data['is_uploaded'] = true;  // Mark as uploaded
                loop_data['uploadedFileName'] = file.name;  // Save the uploaded file name

                // Update the description to match the uploaded file name
                loop_data['description'] = file.name.replace('.pdf', '').replace(/_/g, ' ');  // Remove '.pdf' and replace underscores with spaces
              }
              return loop_data;
            });
            this.toast_service.success(`Successfully uploaded ${data['type']?.toLowerCase()}'s document`, 'Document Upload');
          },
          (err) => {
            this.toast_service.danger('Unable to upload document', 'Document Upload');
          }
        );
    }
  }

  // Deletes the uploaded file by document ID
  deleteDocumentFileById(document: any, index: number) {
    this.spinner_service.show('download_view');
    this.dms_service.deleteDocumentById(document['id']).subscribe(
      () => {
        let doc = null;
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

  // Retrieves documents by client ID
  getDocumentsByClientId() {
    const client_info = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    return this.dms_service.getClientDocumentById(client_info['client_code']);
  }

  // Downloads a base64-encoded file using the given URL
  downloadBase64File(url: string) {
    const cleanedUrl = url.replace('https://mutual-uat.turnkeyafrica.com/alfrescoServices/', '');
    this.spinner_service.show('download_view');
    this.dms_service.downloadFileById(cleanedUrl)
      .pipe(finalize(() => this.spinner_service.hide('download_view')))
      .subscribe();
  }

  // Handles any errors during file operations
  onError() {
    console.log('Error occurred during file upload.');
  }

  // Validates if all required documents are uploaded
  validateDocument(): boolean {
    return this.documentList.filter(doc => 
      doc?.is_uploaded || doc?.is_exempt || doc?.upload_later // Check if uploaded, exempt, or marked for later
      ).length === this.requiredDocuments?.length;
  }

  // Handles upload progress
  onProgress(event: any): number {
    const progressPercentage = Math.round((event.loaded / event.total) * 100);
    console.log('File upload progress:', progressPercentage + '%');
    return progressPercentage;
  }

  getValue(name: string) {
    return '';
    // this.clientDetailsForm.get(name).value;
  }
  // Navigates to the next page when all required documents are uploaded
  nextPage() {
    if (!this.validateDocument()) {
      this.toast_service.danger('All required documents must be uploaded, exempted, or marked for later upload', 'Document Upload');
    } else {
      this.toast_service.success('Successfully completed the document process', 'Document Upload');
      this.router.navigate(['/home/lms/ind/quotation/product']);
    }
  }

  // Toggles exempt status for a document
  handleExempt(document: any) {
    document.is_exempt = !document.is_exempt;
    this.toast_service.info(`${document.description} marked as exempt`, 'Document Upload');
  }

  // Toggles upload later status for a document
  handleUploadLater(document: any) {
    document.upload_later = !document.upload_later;
    this.toast_service.info(`${document.description} marked for later upload`, 'Document Upload');
  }
}
