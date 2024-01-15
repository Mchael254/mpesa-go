import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {BankService} from "../../../../shared/services/setups/bank/bank.service";
import {untilDestroyed} from "../../../../shared/services/until-destroyed";
import {Logger} from "../../../../shared/services";
import {BankDTO} from "../../../../shared/data/common/bank-dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryService} from "../../../../shared/services/setups/country/country.service";
import {CountryDto} from "../../../../shared/data/common/countryDto";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";

const log = new Logger('BankComponent');
@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit{
  url = '';
  selectedFile: File;
  selectedBank: BankDTO;
  createBankForm: FormGroup;
  bankData: BankDTO[];
  countriesData: CountryDto[];

  selectedCountry: number;
  bankBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Banks',
      url: 'home/crm/bank',
    },
  ];
  visibleStatus: any = {
    shortDescription: 'Y',
    bankName: 'Y',
    parentBank: 'Y',
    country: 'Y',
    ddForwardingBank: 'Y',
    eftSupport: 'Y',
    classify: 'Y',
    accountNoCharacters: 'Y',
    bankDDICharge: 'Y',
    adminCharge: 'Y',
    pesaLink: 'Y',
    status: 'Y',
    logo: 'Y'
  }
  groupId: string = 'bankTab';

  @ViewChild('bankConfirmationModal')
  bankConfirmationModal!: ReusableInputComponent;

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private countryService: CountryService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchBanks();
    this.fetchCountries();
    this.bankCreateForm();
  }

  ngOnDestroy(): void {}

  /**
   * The function "onBankRowSelect" assigns the selected bank to the "selectedBank" variable and logs the selected bank
   * information.
   * @param {BankDTO} bank - The parameter "bank" is of type "BankDTO".
   */
  onBankRowSelect(bank: BankDTO) {
    this.selectedBank = bank;
    log.info('bank select', this.selectedBank)
  }

  /**
   * The function `bankCreateForm()` creates a form using the FormBuilder module in Angular, and sets up validators and
   * visibility status for each form control based on the response from an API call.
   */
  bankCreateForm() {
    this.createBankForm = this.fb.group({
      shortDescription: [''],
      bankName: [''],
      parentBank: [''],
      country: [''],
      ddForwardingBank: [''],
      eftSupport: [''],
      classify: [''],
      accountNoCharacters: [''],
      bankDDICharge: [''],
      adminCharge: [''],
      pesaLink: [''],
      status: [''],
      logo: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createBankForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createBankForm.controls[key].addValidators(Validators.required);
                this.createBankForm.controls[key].updateValueAndValidity();
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
   * The function returns the controls of a bank form.
   */
  get f() {
    return this.createBankForm.controls;
  }

  /**
   * The fetchBanks function retrieves bank data using the bankService and logs the data.
   */
  fetchBanks() {
    this.bankService
      .getBanks(1100)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.bankData = data;
        log.info('Bank Data', this.bankData);
      });
  }

  /**
   * The fetchCountries function retrieves a list of countries from a service and assigns the data to the countriesData
   * variable.
   */
  fetchCountries() {
    this.countryService.getCountries()
      .subscribe((data) => {
      this.countriesData = data;
    });
  }

  /**
   * The function "openBankModal" opens a modal by adding the "show" class and setting the display property to "block".
   */
  openBankModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeBankModal" hides and removes the "bankModal" element from the DOM.
   */
  closeBankModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `onUpload` reads and converts the uploaded file to a data URL, and assigns the URL to the `url` variable.
   * @param event - The event parameter is an object that represents the event that triggered the function. In this case,
   * it is the event that occurs when a file is uploaded.
   */
  onUpload(event)
  {
    if (event.target.files) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        console.log('URL after upload:', this.url); // Add this line for debugging
      }
    }
  }

  /**
   * The function "onLogoChange" is triggered when the user selects a file, and it reads the file using FileReader, sets
   * the selectedFile and url variables, and logs the url.
   * @param event - The "event" parameter is an object that represents the event that triggered the logo change. It
   * contains information about the event, such as the target element that triggered the event and the files that were
   * selected.
   */
  onLogoChange(event) {
    if (event.target.files) {
      const reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
        log.info(this.url);
      };
    }
  }

  /**
   * The `saveBank()` function is used to save or update a bank record based on the form inputs provided.
   */
  saveBank() {
    this.createBankForm.markAllAsTouched();
    if (this.createBankForm.invalid) {
      this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }

    if(!this.selectedBank) {
      const bankFormValues = this.createBankForm.getRawValue();

      const saveBank: BankDTO = {
        administrativeCharge: bankFormValues.adminCharge,
        allowPesalink: bankFormValues.pesaLink,
        bankAccountNoCharacters: bankFormValues.accountNoCharacters,
        bankLogo: this.url,
        bankSortCode: null,
        bankType: bankFormValues.classify,
        countryId: bankFormValues.country,
        countryName: null,
        ddiCharge: bankFormValues.bankDDICharge,
        directDebitFormat: null,
        directDebitReportCode: null,
        forwardingBankId: bankFormValues.ddForwardingBank,
        forwardingBankName: null,
        hasParentBank: bankFormValues.parentBank,
        id: null,
        isDirectDebitSupported: null,
        isEftSupported: bankFormValues.eftSupport,
        isForwardingBank: null,
        isNegotiatedBank: null,
        maximumAccountNoCharacters: null,
        minimumAccountNoCharacters: null,
        name: bankFormValues.bankName,
        parentBankId: null,
        parentBankName: null,
        physicalAddress: null,
        remarks: null,
        short_description: bankFormValues.shortDescription,
        status: bankFormValues.status,
        withEffectiveFrom: null,
        withEffectiveTo: null,

      }
      log.info('bank create', saveBank);
      this.bankService.createBank(saveBank)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a bank');

            this.createBankForm.reset();
            this.fetchBanks();
            this.closeBankModal();
          },
          error => {
            // log.info('>>>>>>>>>', error.error.message)
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
    else {
      const bankFormValues = this.createBankForm.getRawValue();
      const bankId = this.selectedBank.id;

      const saveBank: BankDTO = {
        administrativeCharge: bankFormValues.adminCharge,
        allowPesalink: bankFormValues.pesaLink,
        bankAccountNoCharacters: bankFormValues.accountNoCharacters,
        bankLogo: this.url,
        bankSortCode: null,
        bankType: bankFormValues.classify,
        countryId: bankFormValues.country,
        countryName: null,
        ddiCharge: bankFormValues.bankDDICharge,
        directDebitFormat: null,
        directDebitReportCode: null,
        forwardingBankId: bankFormValues.ddForwardingBank,
        forwardingBankName: null,
        hasParentBank: bankFormValues.parentBank,
        id: bankId,
        isDirectDebitSupported: null,
        isEftSupported: bankFormValues.eftSupport,
        isForwardingBank: null,
        isNegotiatedBank: null,
        maximumAccountNoCharacters: null,
        minimumAccountNoCharacters: null,
        name: bankFormValues.bankName,
        parentBankId: null,
        parentBankName: null,
        physicalAddress: null,
        remarks: null,
        short_description: bankFormValues.shortDescription,
        status: bankFormValues.status,
        withEffectiveFrom: null,
        withEffectiveTo: null,

      }
      log.info('bank update', saveBank);
      this.bankService.updateBank(bankId, saveBank)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated a bank');

            this.createBankForm.reset();
            this.fetchBanks();
            this.closeBankModal();
          },
          error => {
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }

  }

  /**
   * The `editBank()` function is used to populate a bank editing form with the details of a selected bank, or display an
   * error message if no bank is selected.
   */
  editBank() {
    if (this.selectedBank) {
      this.openBankModal();
      this.createBankForm.patchValue({
        shortDescription: this.selectedBank.short_description,
        bankName: this.selectedBank.name,
        parentBank: this.selectedBank.hasParentBank,
        country: this.selectedBank.countryId,
        ddForwardingBank: this.selectedBank.forwardingBankId,
        eftSupport: this.selectedBank.isEftSupported,
        classify: this.selectedBank.bankType,
        accountNoCharacters: this.selectedBank.bankAccountNoCharacters,
        bankDDICharge: this.selectedBank.ddiCharge,
        adminCharge: this.selectedBank.administrativeCharge,
        pesaLink: this.selectedBank.allowPesalink,
        status: this.selectedBank.status,
        logo: this.selectedBank.bankLogo
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No bank is selected!'
      );
    }
  }

  /**
   * The deleteBank function displays a confirmation modal.
   */
  deleteBank() {
    this.bankConfirmationModal.show();
  }

  /**
   * The function `confirmBankDelete()` checks if a bank is selected, and if so, deletes it and displays a success message,
   * otherwise it displays an error message.
   */
  confirmBankDelete() {
    if (this.selectedBank) {
      const bankId = this.selectedBank.id;
      this.bankService.deleteBank(bankId).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully deleted a bank'
        );
        this.selectedBank = null;
        this.fetchBanks();
      },
        error => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No bank is selected.'
      );
    }
  }
}
