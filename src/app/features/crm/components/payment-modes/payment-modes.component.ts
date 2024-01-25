import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {PaymentModesDto} from "../../../../shared/data/common/payment-modes-dto";
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

  createPaymentModeForm: FormGroup;

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
    defaultMode: 'Y'
  }
  groupId: string = 'paymentModeTab';

  @ViewChild('paymentModeConfirmationModal')
  paymentModeConfirmationModal!: ReusableInputComponent;

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private paymentModesService: PaymentModesService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paymentModeCreateForm();
    this.fetchPaymentModes();
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
   * The function returns the controls of a form named "createPaymentModeForm".
   * @returns The `createPaymentModeForm.controls` object is being returned.
   */
  get h() {
    return this.createPaymentModeForm.controls;
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
   * The function opens a modal by adding a 'show' class and setting the display property to 'block'.
   */
  openPaymentModesModal() {
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
    const modal = document.getElementById('paymentModesModal');
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
}
