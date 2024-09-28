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
import {ClaimDocument} from "../../../models/claim-document";
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

  getClaimDocuments(claims: ClaimDTO): void{
    this.claimsService.getClaimsDocument(claims?.cnot_code)
      .pipe(untilDestroyed(this))
      .subscribe((data: ClaimDocument[]) => {
        this.claimDocuments = data
        this.cdr.detectChanges()
      });
  }

  uploadFile(event: any, doc_name: string) {
    this.spinner_service.show('download_view');
    let claims_details = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.CLAIMS_DETAILS) );

    console.log('claims_details>>>', claims_details)
    let fileName: string = doc_name.replaceAll('.pdf', '').toLowerCase();
    const fileList: FileList = event.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.dms_service
        .saveClientDocument(claims_details['prp_code'], fileName, formData, 'CLAIMS')
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

            // this.documentList = this.documentList?.map((loop_data) => {
            //   let temp = loop_data['description'].toLowerCase();
            //   if (temp === data['type']) {
            //     loop_data = { ...loop_data, ...data };
            //     loop_data['is_uploaded'] = true;
            //   }
            //   loop_data['file_extension'] = 'pdf';
            //   return loop_data;
            // });
            this.toast_service.success(
              `successfully upload ${data['type']?.toLowerCase()}'s document `,
              'Document Upload Page'
            );
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
