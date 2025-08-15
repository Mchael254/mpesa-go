import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {Country} from "ngx-intl-tel-input/lib/model/country.model";
import {Observable} from "rxjs";
import {Bank} from "../../../../data/BankDto";
import {BankDTO} from "../../../../../../shared/data/common/bank-dto";
import {CurrencyService} from "../../../../../../shared/services/setups/currency/currency.service";
import {PaymentService} from "../../../../../gis/components/quotation/services/paymentService/payment.service";
import {PaymentModesService} from "../../../../../../shared/services/setups/payment-modes/payment-modes.service";
import {ClientService} from "../../../../services/client/client.service";
import {CurrencyDTO} from "../../../../../../shared/data/common/currency-dto";
import {PaymentModesDto} from "../../../../../../shared/data/common/payment-modes-dto";

const log = new Logger('FinancialComponent');

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() financialDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() financialDetails: any;
  @Input() accountCode: number;
  @Input() countryId: number;

  language: string = 'en';
  editForm: FormGroup;

  // countries$: Observable<Country[]>;
  banks$: Observable<BankDTO[]>;
  banks: BankDTO[];
  bankBranches: any[];
  selectedBankBranch: any;

  currencies: CurrencyDTO[];
  selectedCurrency: CurrencyDTO;

  paymentModes: PaymentModesDto[];
  selectedPaymentMode: PaymentModesDto;

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private globalMessagingService: GlobalMessagingService,
    private bankService: BankService,
    private currencyService: CurrencyService,
    private paymentModesService: PaymentModesService,
    private clientService: ClientService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }


  ngOnInit(): void {
    this.banks$ = this.bankService.getBanks(this.countryId);
    this.createEditForm(this.formFieldsConfig.fields);
    this.fetchCurrencies();
    this.fetchPaymentChannels();
  }

  createEditForm(fields: any[]): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        field.isMandatory ? Validators.required : []
      ];
    });
    this.editForm = this.fb.group(group);
  }

  openEditFinancialDialog(): void {
    this.editButton.nativeElement.click();
    this.setSelectOptions();
    setTimeout(() => {this.patchFormValues()}, 500)
  }

  editFinancialDetails(): void {
    const formValues = this.editForm.getRawValue();
    log.info(formValues);
    const paymentDetails = {
      ...this.financialDetails,
      accountNumber: formValues.accountNumber,
      bankBranchId: formValues.branchName,
      currencyId: formValues.currency,
      effectiveFromDate: formValues.wef,
      effectiveToDate: formValues.wet,
      iban: formValues.iban,
      preferredChannel: formValues.preferredPaymentMethod,
      swiftCode: formValues.swiftCode,
      mpayno: formValues.mpayno
    };

    this.clientService.updateClientSection(this.accountCode, { paymentDetails }).subscribe({
      next: response => {
        this.financialDetails = response.paymentDetails;
        this.globalMessagingService.displaySuccessMessage('Success', 'Financial details updated successfully.');

        const currencyIndex = this.currencies.findIndex(c => c.id === this.financialDetails.currencyId);
        this.selectedCurrency = this.currencies[currencyIndex];

        const preferredChannelIndex = this.paymentModes.findIndex(f => f.id == this.financialDetails.preferredChannel);
        this.selectedPaymentMode = this.paymentModes[preferredChannelIndex];

        this.closeButton.nativeElement.click();
      },
      error: error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    })
  }

  fetchCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: res => {
        this.currencies = res;
        const index = res.findIndex(c => c.id === this.financialDetails.currencyId);
        this.selectedCurrency = res[index];
      },
      error: err => {}
    });
  }

  fetchPaymentChannels(): void {
    this.paymentModesService.getPaymentModes().subscribe({
      next: res => {
        this.paymentModes = res;
        const index = res.findIndex(f => f.id == this.financialDetails.preferredChannel);
        this.selectedPaymentMode = res[index];
      },
      error: err => {}
    });
  }

  setSelectOptions(): void {
    this.formFieldsConfig.fields.forEach(field => {
      switch (field.fieldId) {
        case 'bankName':
          this.banks$.subscribe({
            next: res => {
              field.options = res;
              this.banks = res;
            }
          });
          break;

        case 'branchName':
          const bankId = this.financialDetails.bankBranchId; // todo: get and use bankID
          this.bankService.getBankBranchesByBankId(111).subscribe({
            next: res => {
              field.options = res;
              this.bankBranches = res;
            }
          });
          break;
        case 'currency':
          field.options = this.currencies;
          break;
        case 'preferredPaymentMethod':
          field.options = this.paymentModes;
          break;
      }
    });
  }

  processSelectOption(event: any, fieldId: string): void {
    const selectedOption = event.target.value;

    switch (fieldId) {
      case 'bankName':
        this.bankService.getBankBranchesByBankId(selectedOption).subscribe({
          next: res => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'branchName') field.options = res;
            });
          },
          error: err => {}
        })
    }
  }


  patchFormValues(): void {
    const patchData = {
      accountNumber: this.financialDetails.accountNumber,
      branchName: this.financialDetails.bankBranchId,
      currency: this.financialDetails.currencyId,
      wef: new Date(this.financialDetails.effectiveFromDate).toISOString().split('T')[0],
      wet: new Date(this.financialDetails.effectiveToDate).toISOString().split('T')[0],
      iban: this.financialDetails.iban,
      preferredPaymentMethod: this.financialDetails.preferredChannel,
      swiftCode: this.financialDetails.swiftCode,
      mpayno: this.financialDetails.mpayno,
    }
    this.editForm.patchValue(patchData)
  }

}
