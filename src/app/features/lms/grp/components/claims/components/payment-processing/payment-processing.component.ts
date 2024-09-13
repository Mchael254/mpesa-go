import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Logger } from 'src/app/shared/services';
import { Dropdown } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../../models/claim-models';
import { ClaimsService } from '../../service/claims.service';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

const log = new Logger("PaymentProcessingComponent")
@Component({
  selector: 'app-payment-processing',
  templateUrl: './payment-processing.component.html',
  styleUrls: ['./payment-processing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentProcessingComponent implements OnInit, OnDestroy {
  steps = stepData;
  paymentProcessingForm: FormGroup;
  assignSupervisorForm: FormGroup;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
  @ViewChild('dropdown') dropdown: Dropdown;
  disablePayeeAmount: boolean = true;
  isVoucherDischarged: boolean = false;
  isVoucherProcessed: boolean = false;
  isSendForSupervisorApproval: boolean = false;
  isSupervisorApproved: boolean = false;
  payMethod$: Observable<PaymentMethod[]>;
  claimNumber: string;
  transactionNumber: number;
  memberCode: number;
  payee: string;
  amount: number;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private claimsService: ClaimsService,
    private activatedRoute: ActivatedRoute,
    private session_storage: SessionStorageService,
    private messageService: MessageService,
    private spinner_Service: NgxSpinnerService,
  ) {}
  
  ngOnInit(): void {
    this.getParams();
    this.claimPaymentProcessingForm();
    this.assigningSupervisorForm();
    this.getPayMethods();
    this.getPayee()
  }

  ngOnDestroy(): void {
    
  }

  // claimPaymentProcessingForm() {
  //   this.paymentProcessingForm = this.fb.group({
  //     payee: [{value: '', disabled: this.disablePayeeAmount}],
  //     paymentMode: [""],
  //     accountNumber: [""],
  //     amount: [{value: '', disabled: this.disablePayeeAmount}],
  //     newAccountNumber: [""],
  //     bankName: [""],
  //     feedback: [""],
  //     reason: [""],
  //   });
  // }
  claimPaymentProcessingForm() {
    const shouldDisableAllFields = this.isVoucherDischarged || this.isVoucherProcessed || this.isSendForSupervisorApproval || this.isSupervisorApproved;
  
    this.paymentProcessingForm = this.fb.group({
      payee: [{ value: '', disabled: this.disablePayeeAmount || shouldDisableAllFields }],
      paymentMode: [{ value: '', disabled: shouldDisableAllFields }],
      accountNumber: [{ value: '', disabled: shouldDisableAllFields }],
      amount: [{ value: '', disabled: this.disablePayeeAmount || shouldDisableAllFields }],
      newAccountNumber: [{ value: '', disabled: shouldDisableAllFields }],
      bankName: [{ value: '', disabled: shouldDisableAllFields }],
      feedback: [{ value: '', disabled: shouldDisableAllFields }],
      reason: [{ value: '', disabled: shouldDisableAllFields }],
    });
  }

  updateFormControls() {
    const shouldDisableAllFields = this.isVoucherDischarged || this.isVoucherProcessed || this.isSendForSupervisorApproval 
                                    || this.isSupervisorApproved;
  
    this.paymentProcessingForm.get('payee')?.disable({ emitEvent: false });
    this.paymentProcessingForm.get('amount')?.disable({ emitEvent: false });
  
    if (shouldDisableAllFields) {
      this.paymentProcessingForm.get('paymentMode')?.disable({ emitEvent: false });
      this.paymentProcessingForm.get('accountNumber')?.disable({ emitEvent: false });
    }
  }

  shouldDisableFormFields(): boolean {
    return this.isVoucherDischarged || this.isVoucherProcessed || this.isSendForSupervisorApproval || this.isSupervisorApproved;
  }

  assigningSupervisorForm() {
    this.assignSupervisorForm = this.fb.group({
      supervisor: [""],
      remarks: [""]
    });
  }

  getParams() {
    const claimNumberFromRoute = this.activatedRoute.snapshot.queryParams['claimNumber'];

    // If the claim number from the route is null, empty, or undefined, use the session storage value
    this.claimNumber = claimNumberFromRoute || this.session_storage.get('claimNumber');
    this.transactionNumber =  this.session_storage.get('transactionNumber');
    this.memberCode = +this.session_storage.get('polMemCode');
    this.amount = +this.session_storage.get('amount');
  }

  patchFormData() {
    this.paymentProcessingForm.patchValue({
      payee: this.payee.charAt(0).toUpperCase() + this.payee.slice(1).toLowerCase(),
      amount: this.amount,
    });
  }
  

  getPayee() {
    const storedPayee = this.session_storage.get('payee');  // Get payee from session_storage
    this.claimsService.getPayee().pipe(untilDestroyed(this)).subscribe((res) => {
  
      // Find the matching object in the response where the name matches the stored payee
      const matchingPayee = res.find((item) => item.name === storedPayee);

      // If a match is found, set the corresponding value, otherwise use the stored payee as a fallback
      this.payee = matchingPayee ? matchingPayee.value : storedPayee;
  
      // Call patchFormData() after getting the payee
      this.patchFormData();
    });
  }
  

  accountDetails = [
    { accountNumber: '123456', bankName: 'Equity Bank' },
    { accountNumber: '234567', bankName: 'KCB Bank' },
    { accountNumber: '345678', bankName: 'Stanbic Bank' },
    { accountNumber: '387654', bankName: 'Cooperative Bank' }
  ];

  showOverlay(event: Event, overlayPanel: OverlayPanel) {
    if (this.dropdown) {
      // this.dropdown.hide(); //hide the dropdown on add account click
    }
    overlayPanel.toggle(event); // Show the overlay panel
  
    //display overlaypanel just beside the dropdown
    setTimeout(() => {
      const dropdownTrigger = this.dropdown.el.nativeElement.querySelector('.p-dropdown-trigger');
      const overlayElement = overlayPanel.container;
  
      if (dropdownTrigger && overlayElement) {
        const triggerRect = dropdownTrigger.getBoundingClientRect();
        overlayElement.style.top = `${triggerRect.bottom + window.scrollY}px`;
        overlayElement.style.left = `${triggerRect.right + window.scrollX}px`;
      }
    });
  }

  showSupervisorModal() {
    const modal = document.getElementById('assignSupervisorModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeSupervisorModal() {
    const modal = document.getElementById('assignSupervisorModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  /**
   * The function `getPayMethods()` retrieves list of pay methods and assign to stream payMethod$
   */
  getPayMethods() {
    this.payMethod$ = this.claimsService.getPayMethods()
  }

  addAccount() {
    const formValues = this.paymentProcessingForm.value;
    // log.info("New account details", formValues.newAccountNumber, formValues.bankName);

    // Logic to add the new account
  }

  onDischargeVoucherClick() {
    this.isVoucherDischarged = true;
    this.updateFormControls();
  }

  onProcessVoucherClick() {
    this.spinner_Service.show('download_view');
    const voucherDetails = {
      username: "ADMIN",
      member_code: this.memberCode,
      claim_trans_no: this.transactionNumber
    }
    this.claimsService.processVoucher(this.claimNumber, voucherDetails).pipe(untilDestroyed(this)).subscribe((res) => {
      this.spinner_Service.hide('download_view');
      this.isVoucherProcessed = true;
      this.cdr.detectChanges();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Voucher processed successfully'
      });
    }, (error) => {
      this.spinner_Service.hide('download_view');
      this.isVoucherProcessed = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Voucher NOT processed!'
      });
    });
  }

  onMakeReadyClick() {
    this.showSupervisorModal();
  }

  onSendForSupApproval() {
    this.isSendForSupervisorApproval = true;
    this.closeSupervisorModal();
  }

  onSupervisorapprovalClick() {
    this.isSupervisorApproved =  true;
  }

  onAuthorizeVoucherClick() {
    //to FMS
  }
  
}
