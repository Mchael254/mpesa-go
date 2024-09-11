import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { ClaimsService } from '../../service/claims.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';
import { ClaimDetailsDTO, DocumentsToUploadDTO, FileDetailsDTO } from '../../models/claim-models';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

const log = new Logger("ClaimAdmissionComponent");
@AutoUnsubscribe
@Component({
  selector: 'app-claim-admission',
  templateUrl: './claim-admission.component.html',
  styleUrls: ['./claim-admission.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimAdmissionComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimDetails: ClaimDetailsDTO[] = []
  isClaimAdmitted: boolean = false;
  claimNumber: string;
  documents: DocumentsToUploadDTO[] = [];
  selectedFile: FileDetailsDTO[] = [];
  uploadProgress: number = 0;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private session_storage: SessionStorageService,
    private router: Router,
    private spinner_Service: NgxSpinnerService,
  ) {}
  
  ngOnInit(): void {
    this.getParams();
    this.getDocumentsToUpload();
  }

  ngOnDestroy(): void {
    
  }

  shareAcknowledgementForm = this.fb.group({
    clientName: ['', Validators.required],
    email: ['', Validators.required],
    sms: ['', Validators.required],
    whatsapp: ['', Validators.required],
    communicationType: ['', Validators.required],
  })

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  getParams() {
    // Get the claim number from the query parameters
    let claimNumberFromRoute = this.activatedRoute.snapshot.queryParams['claimNumber'];
  
    // If the claim number from the route is null, empty, or undefined, use the session storage value
    this.claimNumber = claimNumberFromRoute || this.session_storage.get('claimNumber');
  
    this.getClaimDetails();
    this.cdr.detectChanges();
  }
  

  onAdmitClaim() {
    this.spinner_Service.show('download_view');
    if (this.claimDetails && this.claimDetails.length > 0) {
      const claimDetail = this.claimDetails[0];
      
      const admittedClaimDetails = {
        claim_no: this.claimNumber,
        age: claimDetail.death_disability_age,
        date_reported: this.formatDate(new Date(claimDetail.claim_date)),
        date_of_accident: this.formatDate(new Date(claimDetail.date_of_accident)),
        caus_code: claimDetail.cause_code,
        cause_short_description: claimDetail.cause_type,
        retention: claimDetail.retention_percentage,
        remarks: claimDetail.remarks,
        installment_payment: claimDetail.pay_in_installments,
        date_admitted: this.formatDate(new Date()), // Always today's date
        user: "ADMIN", //to add user dynamically
        admitted: "Y",
      };
  
      this.claimsService.admitClaim(this.claimNumber, admittedClaimDetails).pipe(untilDestroyed(this)).subscribe((res) => {
        if(res) {
          this.isClaimAdmitted = true;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Claim admitted successfully'
          });
          this.cdr.detectChanges();
          this.spinner_Service.hide('download_view');
        }
      });
  
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Claim NOT admitted!'
      });
      this.spinner_Service.hide('download_view');
    }
  }

  onProcessClaim() {
    this.router.navigate(['/home/lms/grp/claims/processing'], {
      queryParams: {
        claimNumber: this.claimNumber,
      }
    });

  }

  showShareAcknowledgmentModal() {
    const modal = document.getElementById('shareAcknowledgementModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeShareAcknowledgmentModal() {
    const modal = document.getElementById('shareAcknowledgementModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  getClaimDetails() {
    this.claimsService.getClaimDetails(this.claimNumber).subscribe((res: ClaimDetailsDTO[]) => {
      this.claimDetails = res;
      this.cdr.detectChanges();
      log.info("getClaimDetails", res)
    });
  }
  

  /**
 * The function `getDocumentsToUpload` retrieves list of documents to upload for a specific claim number. claimNo- 'CLM/GLA-726/2024'
 */
  getDocumentsToUpload() {
    this.claimsService.getDocumetsToUpload(this.claimNumber).pipe(untilDestroyed(this)).subscribe((res: DocumentsToUploadDTO[]) => {
      this.documents = res;
      this.cdr.detectChanges();
    });
  }

  /**
   * The function `onFileSelected` is triggered when a file is selected, and it logs the selected file
   * and the associated document label.
   * @param {any} event - The `event` parameter typically represents the event that occurred, such as a
   * file selection event in this case. It contains information about the event, including the target
   * element that triggered the event (in this case, the file input element).
   */
  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];

    let progress = 0;
    const interval = setInterval(() => {
    if (progress < 100) {
      progress += 1;
      this.uploadProgress = progress;
    }
  }, 1000);
    if (file) {
      this.selectedFile[index] = file;
      // file upload service call
      clearInterval(interval);
        this.uploadProgress = 100;
    }
  }
  
  // Remove a specific file
  removeFile(index: number): void {
    this.selectedFile[index] = null; // Remove the file at the specific index
  }
  

}
