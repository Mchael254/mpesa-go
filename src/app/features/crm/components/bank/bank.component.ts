import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {takeUntil} from "rxjs";

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

  onBankRowSelect(bank: BankDTO) {
    this.selectedBank = bank;
    log.info('bank select', this.selectedBank)
  }

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

  get f() {
    return this.createBankForm.controls;
  }

  fetchBanks() {
    this.bankService
      .getBanks(1100)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.bankData = data;
        log.info('Bank Data', this.bankData);
      });
  }

  fetchCountries() {
    this.countryService.getCountries()
      .subscribe((data) => {
      this.countriesData = data;
    });
  }

  openBankModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeBankModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

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

  saveBank() {
    this.createBankForm.markAllAsTouched();
    if (this.createBankForm.invalid) {
      this.globalMessagingService.displayErrorMessage('Error', 'Fill required fields');
      return;
    }

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
   /* this.bankService.createBank(saveBank)
      .subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a bank');

        this.fetchBanks();
        this.closeBankModal();
      },
        error => {
        // log.info('>>>>>>>>>', error.error.message)
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        })*/
  }

}
