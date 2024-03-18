import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { concatMap, finalize, of } from 'rxjs';
import { DmsService } from 'src/app/features/lms/service/dms/dms.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { FileProgressEvent } from 'primeng/fileupload';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.css'],
})
export class DocumentsUploadComponent implements OnInit {
  clientDocumentList: any[] = [];
  requiredDocuments: any[];

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
        this.documentList = data?.map((d) => {
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
          d['file_extension'] = 'pdf';
          return d;
        });
        this.spinner_service.hide('download_view');
      });
  }

  constructor(
    private crm_client_service: ClientService,
    private dms_service: DmsService,
    private spinner_service: NgxSpinnerService,
    private session_storage: SessionStorageService,
    private toast_service: ToastService,
    private router: Router
  ) {}

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

  getRequiredDocument() {
    return this.crm_client_service.getclientRequiredDocuments();
  }

  isImage(name: any) {
    return ['jpeg', 'png', 'jpg'].includes(name);
  }

  onBasicUploadAuto(e: any) {}

  uploadFile(event: any, doc_name: string) {
    this.spinner_service.show('download_view');
    let client_info = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.QUOTE_DETAILS) );
    let fileName: string = doc_name.replaceAll('.pdf', '').toLowerCase();
    const fileList: FileList = event.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.dms_service
        .saveClientDocument(client_info['client_code'], fileName, formData)
        .pipe(
          finalize(() => {
            this.spinner_service.hide('download_view');
          })
        )
        .subscribe(
          (data: any) => {
            const fileInput = document.getElementById(
              'uploadFile'
            ) as HTMLInputElement;
            if (fileInput) {
              fileInput.value = ''; // Reset the input
            }

            this.documentList = this.documentList?.map((loop_data) => {
              let temp = loop_data['description'].toLowerCase();
              if (temp === data['type']) {
                loop_data = { ...loop_data, ...data };
                loop_data['is_uploaded'] = true;
              }
              loop_data['file_extension'] = 'pdf';
              return loop_data;
            });
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

  deleteDocumentFileById(code: any, x: any) {
    this.spinner_service.show('download_view');
    this.dms_service
      .deleteDocumentById(code['id'])

      .subscribe(
        () => {
          let doc = null;
          this.documentList = this.documentList.map((data, i) => {
            if (i === x) {
              doc = this.requiredDocuments.find(
                (de: any) =>
                  de['description'].toString().toLowerCase() ===
                  code['type'].toString().toLowerCase()
              );
              doc['file_extension'] = 'pdf';
              doc['is_uploaded'] = false;
              return doc;
            }
            return data;
          });
          this.toast_service.success(
            `Deleted ${doc[
              'description'
            ].toLowerCase()}'s document successfully`,
            'Document Upload Page'
          );
          this.spinner_service.hide('download_view');
        },
        (err) => {
          this.toast_service.danger(
            `Unable to Delete Document`,
            'Document Upload Page'
          );
          this.spinner_service.hide('download_view');
        }
      );
  }

  getDocumentsByClientId() {
    let client_info = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.QUOTE_DETAILS) );
      return this.dms_service.getClientDocumentById(client_info['client_code']);
  }
  downloadBase64File(url: string) {
    let url_ = url.replace('https://mutual-uat.turnkeyafrica.com/alfrescoServices/', '')
    this.spinner_service.show('download_view');
    this.dms_service
      .downloadFileById(url_)
      .pipe(
        finalize(() => {
          this.spinner_service.hide('download_view');
        })
      )
      .subscribe(() => {
        this.spinner_service.hide('download_view');
      });
  }
  onError() {
    console.log('ERROR');
  }

  validateDocument() {
    return (
      this.documentList.filter((data) => data?.is_uploaded === true)?.length ===
      this.requiredDocuments?.length
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

  getValue(name: string) {
    return '';
    // this.clientDetailsForm.get(name).value;
  }
  nextPage() {
    if (!this.validateDocument()) {
      this.toast_service.danger(
        `All required documents must be uploaded`,
        'Document Upload Page'
      );
    } else {
      this.toast_service.success(
        `Successfully uploaded all required documents `,
        'Document Upload Page'
      );
      this.router.navigate(['/home/lms/ind/quotation/product']);
    }
  }
}
