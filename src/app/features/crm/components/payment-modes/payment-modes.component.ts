import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {ClaimsPaymentModesDto, PaymentModesDto} from "../../../../shared/data/common/payment-modes-dto";
import {PaymentModesService} from "../../../../shared/services/setups/payment-modes/payment-modes.service";
import {Logger} from "../../../../shared/services";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";
import {untilDestroyed} from "../../../../shared/services/until-destroyed";

const log = new Logger('PaymentModesComponent');
@Component({
  selector: 'app-payment-modes',
  templateUrl: './payment-modes.component.html',
  styleUrls: ['./payment-modes.component.css']
})
export class PaymentModesComponent implements OnInit {
  paymentModesData: PaymentModesDto[];
  selectedPaymentMode: PaymentModesDto;

  claimPaymentModesData: ClaimsPaymentModesDto[];
  selectedClaimsPaymentMode: ClaimsPaymentModesDto;

  createPaymentModeForm: FormGroup;
  createClaimsPaymentModeForm: FormGroup;
  editMode: boolean = false;

  paymentModesBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Org Parameters',
      url: '/home/crm',
    },
    {
      label: 'Payment modes',
      url: 'home/crm/payment-modes',
    },
  ];

  visibleStatus: any = {
    shortDescription: 'Y',
    description: 'Y',
    narration: 'Y',
    defaultMode: 'Y',
  //
    id: 'Y',
    claimsDescription: 'Y',
    minAmount: 'Y',
    maxAmount: 'Y',
    claimsDefaultMode: 'Y'
  }
  groupId: string = 'paymentModeTab';
  claimsPaymentGroupId: string = 'claimsPaymentModeTab';

  @ViewChild('paymentModeConfirmationModal')
  paymentModeConfirmationModal!: ReusableInputComponent;

  @ViewChild('claimsPaymentModeConfirmationModal')
  claimsPaymentModeConfirmationModal!: ReusableInputComponent;

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private paymentModesService: PaymentModesService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paymentModeCreateForm();
    this.claimsPaymentModeCreateForm();
    this.fetchPaymentModes();
    this.fetchClaimsPaymentModes();
  }

  ngOnDestroy(): void {}

  /**
   * The function "onPaymentModeRowSelect" assigns the selected payment mode to a variable and logs the selected payment
   * mode.
   */
  onPaymentModeRowSelect(paymentMode: PaymentModesDto) {
    this.selectedPaymentMode = paymentMode;
    log.info('payment mode select', this.selectedPaymentMode);
  }

  /**
   * The function "onClaimPaymentModeRowSelect" selects a claims payment mode and logs the selected mode.
   * @param {ClaimsPaymentModesDto} claimsPaymentMode - The parameter `claimsPaymentMode` is of type
   * `ClaimsPaymentModesDto`.
   */
  onClaimPaymentModeRowSelect(claimsPaymentMode: ClaimsPaymentModesDto) {
    this.selectedClaimsPaymentMode = claimsPaymentMode;
    log.info('claim payment mode select', this.selectedClaimsPaymentMode)
  }

  /**
   * The function `paymentModeCreateForm()` creates a form with various fields and adds validators to the fields based on
   * their visibility and mandatory status.
   */
  paymentModeCreateForm() {
    this.createPaymentModeForm = this.fb.group({
      shortDescription: [''],
      description: [''],
      narration: [''],
      defaultMode: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createPaymentModeForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createPaymentModeForm.controls[key].addValidators(Validators.required);
                this.createPaymentModeForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * The function creates a form for claims payment mode and sets validators for mandatory fields based on the response
   * from an API call.
   */
  claimsPaymentModeCreateForm() {
    this.createClaimsPaymentModeForm = this.fb.group({
      id: [''],
      claimsDescription: [''],
      minAmount: [''],
      maxAmount: [''],
      claimsDefaultMode: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.claimsPaymentGroupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createClaimsPaymentModeForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createClaimsPaymentModeForm.controls[key].addValidators(Validators.required);
                this.createClaimsPaymentModeForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * The function returns the controls of a form named "createPaymentModeForm".
   * @returns The `createPaymentModeForm.controls` object is being returned.
   */
  get h() {
    return this.createPaymentModeForm.controls;
  }

  /**
   * The function returns the controls of a form named "createClaimsPaymentModeForm".
   * @returns the controls of the createClaimsPaymentModeForm.
   */
  get f() {
    return this.createClaimsPaymentModeForm.controls;
  }

  /**
   * The function fetchPaymentModes() retrieves payment modes data from a service and assigns it to the paymentModesData
   * variable.
   */
  fetchPaymentModes() {
    this.paymentModesService.getPaymentModes()
      .subscribe(
        (data) => {
          this.paymentModesData = data;
        })
  }

  /**
   * The function fetches claims payment modes data from a service and assigns it to a variable.
   */
  fetchClaimsPaymentModes() {
    this.paymentModesService.getClaimsPaymentModes()
      .subscribe(
        (data) => {
          this.claimPaymentModesData = data;
        })
  }
  /**
   * The function opens a modal by adding a 'show' class and setting the display property to 'block'.
   */
  openPaymentModesModal() {
    this.createPaymentModeForm.reset();
    const modal = document.getElementById('paymentModesModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closePaymentModesModal" hides and removes the "show" class from the element with the id
   * "paymentModesModal".
   */
  closePaymentModesModal() {
    this.editMode = false;
    const modal = document.getElementById('paymentModesModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function opens a modal for claim payment modes by adding a 'show' class and setting the display property to
   * 'block'.
   */
  openClaimPaymentModesModal() {
    this.createClaimsPaymentModeForm.reset();
    const modal = document.getElementById('claimsPaymentModesModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeClaimPaymentModesModal" hides and removes the "claimsPaymentModesModal" element from the DOM.
   */
  closeClaimPaymentModesModal() {
    this.editMode = false;
    const modal = document.getElementById('claimsPaymentModesModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `savePaymentMode()` function is used to save or update a payment mode based on the form inputs.
   * @returns In this code snippet, if the `createPaymentModeForm` is invalid, the function will return and no further code
   * will be executed. If the `selectedPaymentMode` is falsy, a new payment mode will be created and the function will
   * return after the API call. If the `selectedPaymentMode` is truthy, an existing payment mode will be updated and the
   * function will return after
   */
  savePaymentMode() {
    this.createPaymentModeForm.markAllAsTouched();
    if (this.createPaymentModeForm.invalid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }

    if(!this.selectedPaymentMode) {
      const paymentModeFormValues = this.createPaymentModeForm.getRawValue();

      const savePaymentMode: PaymentModesDto = {
        description: paymentModeFormValues.description,
        id: null,
        isDefault: paymentModeFormValues.defaultMode,
        narration: paymentModeFormValues.narration,
        organizationId: 2,
        shortDescription: paymentModeFormValues.shortDescription

      }
      log.info('payment mode create', savePaymentMode);
      this.paymentModesService.createPaymentMode(savePaymentMode)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a payment mode');

            this.createPaymentModeForm.reset();
            this.fetchPaymentModes();
            this.closePaymentModesModal();
          },
          error => {
            // log.info('>>>>>>>>>', error.error.message)
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
    else {
      const paymentModeFormValues = this.createPaymentModeForm.getRawValue();
      const paymentModeId = this.selectedPaymentMode.id;

      const savePaymentMode: PaymentModesDto = {
        description: paymentModeFormValues.description,
        id: paymentModeId,
        isDefault: paymentModeFormValues.defaultMode,
        narration: paymentModeFormValues.narration,
        organizationId: 2,
        shortDescription: paymentModeFormValues.shortDescription

      }
      log.info('payment mode update', savePaymentMode);
      this.paymentModesService.updatePaymentMode(paymentModeId, savePaymentMode)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated a payment mode');

            this.createPaymentModeForm.reset();
            this.fetchPaymentModes();
            this.closePaymentModesModal();
          },
          error => {
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
  }

  /**
   * The function `editPaymentMode()` checks if a payment mode is selected and opens a modal to edit its details, otherwise
   * it displays an error message.
   */
  editPaymentMode() {
    this.editMode = !this.editMode;
    if (this.selectedPaymentMode) {
      this.openPaymentModesModal();
      this.createPaymentModeForm.patchValue({
        description: this.selectedPaymentMode.description,
        id: this.selectedPaymentMode.id,
        defaultMode: this.selectedPaymentMode.isDefault,
        narration: this.selectedPaymentMode.narration,
        organizationId: 2,
        shortDescription: this.selectedPaymentMode.shortDescription
      });

    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No payment mode is selected!'
      );
    }
  }

  /**
   * The function "deletePaymentMode" displays a confirmation modal for deleting a payment mode.
   */
  deletePaymentMode() {
    this.paymentModeConfirmationModal.show();
  }

  /**
   * The function `confirmPaymentModeDelete()` deletes a selected payment mode and displays a success message if the
   * deletion is successful, or an error message if there is an error.
   */
  confirmPaymentModeDelete() {
    if (this.selectedPaymentMode) {
      const paymentModeId = this.selectedPaymentMode.id;
      this.paymentModesService.deletePaymentMode(paymentModeId).subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully deleted a payment mode'
          );
          this.selectedPaymentMode = null;
          this.fetchPaymentModes();
        },
        error => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No payment mode is selected.'
      );
    }
  }

  /**
   * The `saveClaimPaymentMode` function is used to save or update a claims payment mode based on the form inputs.
   * @returns In this code, if the `createClaimsPaymentModeForm` is invalid, the function will return and no further code
   * will be executed. If the `selectedClaimsPaymentMode` is not truthy, a new claims payment mode will be created and the
   * function will return. If the `selectedClaimsPaymentMode` is truthy, an existing claims payment mode will be updated
   * and the function will return
   */
  saveClaimPaymentMode() {
    this.createClaimsPaymentModeForm.markAllAsTouched();
    if (this.createClaimsPaymentModeForm.invalid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }

    if(!this.selectedClaimsPaymentMode) {
      const claimsPaymentModeFormValues = this.createClaimsPaymentModeForm.getRawValue();

      const saveClaimsPaymentMode: ClaimsPaymentModesDto = {
        description: claimsPaymentModeFormValues.claimsDescription,
        id: null,
        isDefault: claimsPaymentModeFormValues.claimsDefaultMode,
        maximumAmount: claimsPaymentModeFormValues.maxAmount,
        minimumAmount: claimsPaymentModeFormValues.minAmount,
        organizationId: 2,
        remarks: null,
        shortDescription: claimsPaymentModeFormValues.id

      }
      log.info('claims payment mode create', saveClaimsPaymentMode);
      this.paymentModesService.createClaimsPaymentMode(saveClaimsPaymentMode)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created a claims payment mode');

            this.createClaimsPaymentModeForm.reset();
            this.fetchClaimsPaymentModes();
            this.closeClaimPaymentModesModal();
          },
          error => {
            // log.info('>>>>>>>>>', error.error.message)
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
    else {
      const claimsPaymentModeFormValues = this.createClaimsPaymentModeForm.getRawValue();
      const claimsPaymentModeId = this.selectedClaimsPaymentMode.id;

      const saveClaimsPaymentMode: ClaimsPaymentModesDto = {
        description: claimsPaymentModeFormValues.claimsDescription,
        id: claimsPaymentModeId,
        isDefault: claimsPaymentModeFormValues.claimsDefaultMode,
        maximumAmount: claimsPaymentModeFormValues.maxAmount,
        minimumAmount: claimsPaymentModeFormValues.minAmount,
        organizationId: 2,
        remarks: null,
        shortDescription: claimsPaymentModeFormValues.id
      }
      log.info('claims payment mode update', saveClaimsPaymentMode);
      this.paymentModesService.updateClaimsPaymentMode(claimsPaymentModeId, saveClaimsPaymentMode)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated a claims payment mode');

            this.createClaimsPaymentModeForm.reset();
            this.fetchClaimsPaymentModes();
            this.closeClaimPaymentModesModal();
          },
          error => {
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
  }

  /**
   * The function `editClaimPaymentMode()` is used to populate a form with the details of a selected claims payment mode or
   * display an error message if no claims payment mode is selected.
   */
  editClaimPaymentMode() {
    this.editMode = !this.editMode;
    if (this.selectedClaimsPaymentMode) {
      this.openClaimPaymentModesModal();
      this.createClaimsPaymentModeForm.patchValue({
        id: this.selectedClaimsPaymentMode.shortDescription,
        claimsDescription: this.selectedClaimsPaymentMode.description,
        minAmount: this.selectedClaimsPaymentMode.minimumAmount,
        maxAmount: this.selectedClaimsPaymentMode.maximumAmount,
        claimsDefaultMode: this.selectedClaimsPaymentMode.isDefault
      });

    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No claims payment mode is selected!'
      );
    }
  }

  /**
   * The function "deleteClaimPaymentMode" displays a confirmation modal for deleting a claims payment mode.
   */
  deleteClaimPaymentMode() {
    this.claimsPaymentModeConfirmationModal.show();
  }

  /**
   * The function `confirmClaimsPaymentModeDelete()` deletes a selected claims payment mode and displays success or error
   * messages accordingly.
   */
  confirmClaimsPaymentModeDelete() {
    if (this.selectedClaimsPaymentMode) {
      const claimPaymentModeId = this.selectedClaimsPaymentMode.id;
      this.paymentModesService.deleteClaimsPaymentMode(claimPaymentModeId).subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully deleted a claims payment mode'
          );
          this.selectedClaimsPaymentMode = null;
          this.fetchClaimsPaymentModes();
        },
        error => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No claims payment mode is selected.'
      );
    }
  }
}
