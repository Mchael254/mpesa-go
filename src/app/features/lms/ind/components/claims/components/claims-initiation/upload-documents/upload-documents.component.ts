import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges
} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MessageService} from "primeng/api";
import {HttpEvent} from "@angular/common/http";
import {untilDestroyed} from "../../../../../../../../shared/services/until-destroyed";
import {ClaimDTO} from "../../../models/claims";
import {ClaimsService} from "../../../../../../service/claims/claims.service";
import {finalize, Observable} from "rxjs";
import {ClaimDocument, UploadedDocumentContent, UploadedDocumentResponse} from "../../../models/claim-document";
import {NgxSpinnerService} from "ngx-spinner";
import {StringManipulation} from "../../../../../../util/string_manipulation";
import {SessionStorageService} from "../../../../../../../../shared/services/session-storage/session-storage.service";
import {SESSION_KEY} from "../../../../../../util/session_storage_enum";
import {ToastService} from "../../../../../../../../shared/services/toast/toast.service";
import {DmsService} from "../../../../../../service/dms/dms.service";

interface UploadEvent {
  originalEvent: HttpEvent<any>;
  files: File[];
}

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDocumentsComponent implements OnInit, OnChanges, OnDestroy{
  @Input() claimInitForm: FormGroup;
  @Input() claimResponse: ClaimDTO;
  claimDocuments: ClaimDocument[];
  uploadedContent: UploadedDocumentContent
  claims_details: any

  constructor(
    private messageService: MessageService,
    private claimsService: ClaimsService,
    private spinner_service: NgxSpinnerService,
    private session_storage: SessionStorageService,
    private toast_service: ToastService,
    private cdr: ChangeDetectorRef,
    private dms_service: DmsService,
  ) { }

  ngOnInit() {
    this.claims_details = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.CLAIMS_DETAILS) );
    if (this.claimResponse) {
      this.getClaimDocuments(this.claimResponse);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['claimResponse'] && !changes['claimResponse'].firstChange) {
      this.getClaimDocuments(this.claimResponse);
    }
  }


  onBasicUploadAuto(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
  }

  getClaimDocuments(claims: ClaimDTO): void {
    this.claimsService.getClaimsDocument(claims?.cnot_code)
      .pipe(untilDestroyed(this))
      .subscribe((data: ClaimDocument[]) => {
        this.claimDocuments = data;
        this.getUploadedDocuments(this.claims_details['prp_code']);  // Fetch uploaded documents and merge
        this.cdr.detectChanges();
      });
  }

  uploadFile(event: any, doc_name: string) {
    this.spinner_service.show('download_view');
    let fileName: string = doc_name.replaceAll('.pdf', '').toLowerCase();
    const fileList: FileList = event.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.dms_service
        .saveClientDocument(this.claims_details['prp_code'], fileName, formData, 'CLAIMS')
        .pipe(
          finalize(() => {
            this.spinner_service.hide('download_view');
          }),
          untilDestroyed(this)
        )
        .subscribe(
          (data: any) => {
            const fileInput = document.getElementById(
              'uploadFile'
            ) as HTMLInputElement;
            if (fileInput) {
              fileInput.value = ''; // Reset the input
            }
            this.toast_service.success(
              `successfully upload ${data['type']?.toLowerCase()}'s document `,
              'Document Upload Page'
            );
            this.updateDocumentStatus(doc_name);
            this.spinner_service.hide('download_view');
          },
          (err) => {
            this.toast_service.danger(
              `unable to upload Document`,
              'Document Upload Page'
            );
            this.spinner_service.hide('download_view');
          }
        );
    }
  }

  getUploadedDocuments(prpCode: string): void {
    this.claimsService.getUploadedDocuments(prpCode)
      .pipe(untilDestroyed(this))
      .subscribe((uploadedDocs: UploadedDocumentResponse) => {

        // Merge uploaded docs with required docs
        this.claimDocuments = this.claimDocuments.map(doc => {
          // "medical cause of death"
          const uploadedDoc = uploadedDocs.content.find(upDoc => upDoc.type.toLowerCase() === doc.desc.toLowerCase());
          return uploadedDoc ? { ...doc, submitted: 'Y', uploadedDocId: uploadedDoc.id } : doc;
        });
        this.cdr.detectChanges();
      });
  }

  updateDocumentStatus(doc_name: string): void {
    // Update the status of the uploaded document
    this.claimDocuments = this.claimDocuments.map(doc => {
      if (doc.desc === doc_name) {
        return { ...doc, submitted: 'Y' };  // Mark document as uploaded
      }
      return doc;
    });
    this.cdr.detectChanges();
  }

  deleteDocument(uploadedDocId: string): void {
    this.dms_service.deleteDocumentById(uploadedDocId)
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          // Remove the document from the claimDocuments list
          this.claimDocuments = this.claimDocuments.map(doc => {
            if (doc.uploadedDocId === uploadedDocId) {
              return { ...doc, submitted: 'N', uploadedDocId: null };  // Reset the status
            }
            return doc;
          });
          this.toast_service.success('Document deleted successfully', 'Delete Document');
          this.cdr.detectChanges();
        },
        (error) => {
          this.toast_service.danger('Unable to delete the document', 'Delete Document');
        }
      );
  }



  onProgress(event: any): number {
    console.log(event);

    // const progressPercentage = Math.round((event.originalEvent.loaded / event.originalEvent.total) * 100);
    // console.log('File upload progress:', progressPercentage + '%');
    // You can perform additional actions based on the upload progress event
    // return progressPercentage;
    return 0;
  }

  onError() {
    console.log('ERROR');
  }

  isImage(name: any) {
    return ['jpeg', 'png', 'jpg'].includes(name);
  }

  ngOnDestroy() {
  }
}
