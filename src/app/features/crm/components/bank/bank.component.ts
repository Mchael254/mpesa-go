import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../../shared/data/common/BreadCrumbItem";
import {BankService} from "../../../../shared/services/setups/bank/bank.service";
import {untilDestroyed} from "../../../../shared/services/until-destroyed";
import {Logger} from "../../../../shared/services";
import {BankBranchDTO, BankDTO, POSTBankBranchDTO} from "../../../../shared/data/common/bank-dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryService} from "../../../../shared/services/setups/country/country.service";
import {CountryDto, TownDto} from "../../../../shared/data/common/countryDto";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";
import {OrganizationService} from "../../services/organization.service";
import {OrganizationBranchDTO} from "../../data/organization-dto";

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

  createBankBranchForm: FormGroup;
  bankBranchData: BankBranchDTO[];
  organizationBranchData: OrganizationBranchDTO[];
  townData: TownDto[];

  selectedCountry: number;
  selectedBankBranch:BankBranchDTO;
  selectedBankBranchCountry: number;
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
    logo: 'Y',
  //
    branchName: 'Y',
    bankBranchName: 'Y',
    bankEmail: 'Y',
    bankBranchShortDescription: 'Y',
    countryCode: 'Y',
    town: 'Y',
    refCode: 'Y',
    ddiSupport: 'Y',
    contactPersonName: 'Y',
    contactPersonPhone: 'Y',
    contactPersonEmail: 'Y',
    physicalAddress: 'Y',
    postalAddress: 'Y'
  }
  groupId: string = 'bankTab';
  groupIdBankBranch: string = 'bankBranchTab';

  @ViewChild('bankConfirmationModal')
  bankConfirmationModal!: ReusableInputComponent;

  @ViewChild('bankBranchConfirmationModal')
  bankBranchConfirmationModal!: ReusableInputComponent;

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private countryService: CountryService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private organizationService: OrganizationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchBanks();
    this.fetchCountries();
    this.bankCreateForm();
    this.fetchOrganizationBranchNames();
    this.bankBranchCreateForm();
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
    this.fetchBankBranches(this.selectedBank.id);
  }

  /**
   * The function "onBankBranchRowSelect" assigns the selected bank branch to a variable and logs the selected bank branch.
   */
  onBankBranchRowSelect(bankBranch: BankBranchDTO) {
    this.selectedBankBranch = bankBranch;
    log.info('bank branch select', this.selectedBankBranch)
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
   * The function `bankBranchCreateForm()` creates a form for creating a bank branch and sets up validators for mandatory
   * fields based on the response from an API call.
   */
  bankBranchCreateForm() {
    this.createBankBranchForm = this.fb.group({
      branchName: [''],
      bankBranchName: [''],
      bankEmail: [''],
      bankBranchShortDescription: [''],
      countryCode: [''],
      town: [''],
      refCode: [''],
      eftSupport: [''],
      ddiSupport: [''],
      contactPersonName: [''],
      contactPersonPhone: [''],
      contactPersonEmail: [''],
      physicalAddress: [''],
      postalAddress: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdBankBranch).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createBankBranchForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createBankBranchForm.controls[key].addValidators(Validators.required);
                this.createBankBranchForm.controls[key].updateValueAndValidity();
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
   * The function returns the controls of a form named "createBankBranchForm".
   */
  get g() {
    return this.createBankBranchForm.controls;
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
   * The function fetches a list of towns based on a given country ID.
   * @param {number} countryId - The countryId parameter is a number that represents the ID of a country.
   */
  fetchTowns(countryId:number){
    log.info(`Fetching towns list, ${countryId}`);
    this.countryService.getTownsByCountry(countryId)
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  /**
   * Retrieves bank branches based on the provided bank ID and updates the bankBranchData property.
   * @param bankId The ID of the selected bank to fetch branches for.
   */
  fetchBankBranches(bankId: number) {
    if (bankId) {
      this.bankService.getBankBranchesByBankId(bankId).subscribe((branches) => {
        this.bankBranchData = branches;
      });
    } else {
      this.bankBranchData = [];
    }
  }

  /**
   * The function fetches organization branch names using the organization service and assigns the data to the
   * organizationBranchNameData variable.
   */
  fetchOrganizationBranchNames() {
    this.organizationService.getOrganizationBranch(2, null)
      .subscribe((data) => {
        this.organizationBranchData = data;
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
   * The function opens a modal for a bank branch.
   */
  openBankBranchModal() {
    const modal = document.getElementById('bankBranchModal');
    if (modal && this.selectedBank) {
      modal.classList.add('show');
      modal.style.display = 'block';
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No bank is selected!'
      );
    }
  }
  /**
   * The function "closeBankBranchModal" hides and removes the "bankBranchModal" element from the DOM.
   */
  closeBankBranchModal() {
    const modal = document.getElementById('bankBranchModal');
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

  /**
   * The `saveBankBranch()` function is used to save or update a bank branch based on the form inputs provided.
   * @returns In this code, if the `createBankBranchForm` is invalid, an error message is displayed and the function
   * returns. If the `selectedBankBranch` is not defined, a `POSTBankBranchDTO` object is created with the form values and
   * sent to the `bankService` to create a new bank branch. If the `selectedBankBranch` is defined, the `POSTBankBranch
   */
  saveBankBranch() {
    this.createBankBranchForm.markAllAsTouched();
    if (this.createBankBranchForm.invalid) {
      this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }

    if(!this.selectedBankBranch) {
      const bankBranchFormValues = this.createBankBranchForm.getRawValue();

      const saveBankBranch: POSTBankBranchDTO = {
        bankId: this.selectedBank.id,
        branchCode: bankBranchFormValues.branchName,
        branchName: null,
        contactPersonEmail: bankBranchFormValues.contactPersonEmail,
        contactPersonName: bankBranchFormValues.contactPersonName,
        contactPersonPhone: bankBranchFormValues.contactPersonPhone,
        countryCode: bankBranchFormValues.countryCode,
        directDebitSupported: bankBranchFormValues.ddiSupport,
        eftSupported: bankBranchFormValues.eftSupport,
        email: bankBranchFormValues.bankEmail,
        id: null,
        name: bankBranchFormValues.bankBranchName,
        physicalAddress: bankBranchFormValues.physicalAddress,
        postalAddress: bankBranchFormValues.postalAddress,
        referenceCode: bankBranchFormValues.refCode,
        short_description: bankBranchFormValues.bankBranchShortDescription,
        townCode: bankBranchFormValues.town

      }
      log.info('bank branch create', saveBankBranch);
      this.bankService.createBankBranch(saveBankBranch)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a bank branch');

            this.createBankBranchForm.reset();
            this.fetchBankBranches(this.selectedBank.id);
            this.closeBankBranchModal();
          },
          error => {
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
    else {
      const bankBranchFormValues = this.createBankBranchForm.getRawValue();
      const bankBranchId = this.selectedBankBranch.id;

      const saveBankBranch: POSTBankBranchDTO = {
        bankId: this.selectedBank.id,
        branchCode: bankBranchFormValues.branchName,
        branchName: null,
        contactPersonEmail: bankBranchFormValues.contactPersonEmail,
        contactPersonName: bankBranchFormValues.contactPersonName,
        contactPersonPhone: bankBranchFormValues.contactPersonPhone,
        countryCode: bankBranchFormValues.countryCode,
        directDebitSupported: bankBranchFormValues.ddiSupport,
        eftSupported: bankBranchFormValues.eftSupport,
        email: bankBranchFormValues.bankEmail,
        id: bankBranchId,
        name: bankBranchFormValues.bankBranchName,
        physicalAddress: bankBranchFormValues.physicalAddress,
        postalAddress: bankBranchFormValues.postalAddress,
        referenceCode: bankBranchFormValues.refCode,
        short_description: bankBranchFormValues.bankBranchShortDescription,
        townCode: bankBranchFormValues.town
      }

      log.info('bank branch update', saveBankBranch);
      this.bankService.updateBankBranch(bankBranchId, saveBankBranch)
        .subscribe((data) => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated a bank branch');

            this.createBankForm.reset();
            this.fetchBankBranches(this.selectedBank.id);
            this.closeBankBranchModal();
          },
          error => {
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          })
    }
  }

  /**
   * The function `editBankBranch()` is used to populate a form with the details of a selected bank branch for editing
   * purposes.
   */
  editBankBranch() {
    if (this.selectedBankBranch) {
      this.openBankBranchModal();
      this.createBankBranchForm.patchValue({
        branchName: this.selectedBankBranch.branchCode,
        bankBranchName: this.selectedBankBranch.name,
        bankEmail: this.selectedBankBranch.email,
        bankBranchShortDescription: this.selectedBankBranch.short_description,
        countryCode: this.selectedBankBranch.countryCode,
        town: this.selectedBankBranch.townCode,
        refCode: this.selectedBankBranch.referenceCode,
        eftSupport: this.selectedBankBranch.eftSupported,
        ddiSupport: this.selectedBankBranch.directDebitSupported,
        contactPersonName: this.selectedBankBranch.contactPersonName,
        contactPersonPhone: this.selectedBankBranch.contactPersonPhone,
        contactPersonEmail: this.selectedBankBranch.contactPersonEmail,
        physicalAddress: this.selectedBankBranch.physicalAddress,
        postalAddress: this.selectedBankBranch.postalAddress
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No bank branch is selected!'
      );
    }
  }

  /**
   * The function "deleteBankBranch" displays a confirmation modal for deleting a bank branch.
   */
  deleteBankBranch() {
    this.bankBranchConfirmationModal.show();
  }

  /**
   * The function `confirmBankBranchDelete()` deletes a selected bank branch and displays a success message if the deletion
   * is successful, or an error message if there is an error.
   */
  confirmBankBranchDelete() {
    if (this.selectedBankBranch) {
      const bankId = this.selectedBankBranch.id;
      this.bankService.deleteBankBranch(bankId).subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a bank branch'
          );
          this.fetchBankBranches(this.selectedBank.id);
        },
        error => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No bank branch is selected.'
      );
    }
  }
}
