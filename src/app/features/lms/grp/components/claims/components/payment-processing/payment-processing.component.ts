import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Logger } from 'src/app/shared/services';
import { Dropdown } from 'primeng/dropdown';

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

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.claimPaymentProcessingForm();
    this.assigningSupervisorForm();
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
    this.isVoucherProcessed =  true;
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
