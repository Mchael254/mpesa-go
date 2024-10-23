import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ClaimsService } from '../../../../../claims/service/claims.service';
import { ServiceRequestService } from '../../../../services/service-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Logger } from 'src/app/shared/services';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { PolicyMemberDTO } from '../../../../../claims/models/claim-models';
import { ContactMethodDTO, ServiceReqCategoriesDTO, ServiceReqCatTypesDTO, ServiceReqPoliciesDTO } from '../../../../models/admin-policies';
import { DashboardService } from '../../../../services/dashboard.service';
import { SESSION_KEY } from "../../../../../../../util/session_storage_enum";
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

const log = new Logger("NewServiceRequestComponent")
@Component({
  selector: 'app-new-service-request',
  templateUrl: './new-service-request.component.html',
  styleUrls: ['./new-service-request.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewServiceRequestComponent implements OnInit, OnDestroy {
  serviceRegForm: FormGroup;
  selectedFile: File = null;
  documentPayload;
  contactMethods$: Observable<ContactMethodDTO[]>;
  serviceReqCategories$: Observable<ServiceReqCategoriesDTO[]>;
  serviceReqCatTypes$: Observable<ServiceReqCatTypesDTO[]>;
  clientCode: number;
  serviceReqPolicies$: Observable<ServiceReqPoliciesDTO[]>;
  policyCode: number;
  policyMembers: PolicyMemberDTO[] = [];
  userType: string;
  prpClientCode: number = 1000
  entityType: string;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private schemServiceReqService: ServiceRequestService,
    private claimsService: ClaimsService,
    private messageService: MessageService,
    private session_storage: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.regForm();
    this.getContactMethod();
    this.getServiceReqCategories();
    this.getServiceReqCategoryTypes();
    this.getServiceReqPolicies();
    this.getPolicyCode();
    this.getData();

  }

  ngOnDestroy(): void {

  }

  getData() {
    this.entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);
    const userProfileData = this.session_storage.get('memberProfile');
  }

  regForm() {
    this.serviceRegForm = this.fb.group({
      category: ["", Validators.required],
      categoryType: ["", Validators.required],
      policy: ["", Validators.required],
      dueDate: [""],
      contactMethod: ["", Validators.required],
      contactTime: [""],
      summary: [""],
      description: ["", Validators.required],
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.selectedFile = file;
        // Read the file as a data URL
        const reader = new FileReader();
        reader.onload = () => {
          // Convert the file to Base64 string
          const base64String = reader.result?.toString().split(',')[1];

          // Add the file to your files array with additional properties
          // this.files.push({ file, name: file.name, selected: false, documentType: this.selectedDocumentType, base64: base64String });
          // console.log("File:",this.clientDetails)
          let payload = {
            docType: this.selectedFile.type,
            document: base64String,
            documentName: file.name,
            documentType: this.selectedFile.type,
            fileName: this.selectedFile.name,
            clientCode: this.clientCode
          }
          this.documentPayload = payload;
          log.info("file upload payload", this.documentPayload)
        };
        // Read the file as data URL
        reader.readAsDataURL(file);
        // this.files.push({ file, name: file.name, selected: false, documentType: this.selectedDocumentType });
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  getContactMethod() {
    this.contactMethods$ = this.schemServiceReqService.getContactMethod();
  }

  getServiceReqCategories() {
    this.serviceReqCategories$ = this.schemServiceReqService.getServiceReqCategories();
  }

  getServiceReqCategoryTypes() {
    this.serviceReqCatTypes$ = this.schemServiceReqService.getServiceReqCategoryTypes()
  }

  getServiceReqPolicies() {
    this.serviceReqPolicies$ = this.schemServiceReqService.getServiceReqPolicies(this.clientCode)
  }

  getPolicyCode() {
    // this.serviceRegForm.get('policy').valueChanges.pipe(untilDestroyed(this)).subscribe((res) =>{
    //   this.serviceRegForm.get('policyMember').reset();
    //   log.info("polCode", res)
    //   this.cdr.detectChanges();
    // });
  }

  getPolicyMembers() {
    this.claimsService.getPolicyMembers(this.policyCode).pipe(untilDestroyed(this)).subscribe((res: PolicyMemberDTO[]) => {
      this.policyMembers = res;
      log.info("getPolicyMembers", res);
    });
  }

  onSubmitRequest() {
    if (this.serviceRegForm.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Fill all the fields!'
      });
      return;
    }
    //post service request
    const serviceReqFormData = this.serviceRegForm.value
    const serviceReqPayload = {
      requestCode: Number(serviceReqFormData.category),
      requestType: serviceReqFormData.categoryType,
      communicationMode: serviceReqFormData.contactMethod,
      policyNumber: serviceReqFormData.policy,
      description: serviceReqFormData.description,
      reporter: this.userType,
      accountCode: this.prpClientCode
    };
    log.info("serviceReqPayload", serviceReqPayload)
    this.schemServiceReqService.postServiceReq(serviceReqPayload).pipe(untilDestroyed(this)).subscribe((res) => {
      log.info("Sucess", res)
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Request successfully created'
      });
    });

    //calls service to upload document to dms
    this.schemServiceReqService.postDocument(this.documentPayload).pipe(untilDestroyed(this)).subscribe((res) => {
      log.info("fileuploaded", res);
    });

    //calls service to upload document info to tqc_service_request_documents table
    this.schemServiceReqService.postDocumentInfo(this.documentPayload).pipe(untilDestroyed(this)).subscribe((res) => {
      log.info("fileupInfoloaded", res);
    });

  }
}
