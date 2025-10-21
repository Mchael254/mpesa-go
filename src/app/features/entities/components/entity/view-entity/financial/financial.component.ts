import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {Observable} from "rxjs";
import {BankDTO} from "../../../../../../shared/data/common/bank-dto";
import {CurrencyService} from "../../../../../../shared/services/setups/currency/currency.service";
import {PaymentModesService} from "../../../../../../shared/services/setups/payment-modes/payment-modes.service";
import {ClientService} from "../../../../services/client/client.service";
import {CurrencyDTO} from "../../../../../../shared/data/common/currency-dto";
import {PaymentModesDto} from "../../../../../../shared/data/common/payment-modes-dto";
import {ClientDTO, Payee, Payment} from "../../../../data/ClientDTO";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, FormSubGroupsDto, PresentationType
} from "../../../../../../shared/data/common/dynamic-screens-dto";

const log = new Logger('FinancialComponent');

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() clientDetails: ClientDTO;
  @Input() financialDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() countryId: number;
  @Input() group: FormGroupsDto;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;

  paymentDetails: Payment;
  payeeDetails: Payee[];

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

  fields: ConfigFormFieldsDto[];
  tableHeaders: ConfigFormFieldsDto[];
  table: { cols: any[], data: any[] } = { cols: [], data: [] };

  PRESENTATION_TYPE = PresentationType;

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
    // this.createEditForm(this.formFieldsConfig.fields);
    this.fetchCurrencies();
    this.fetchPaymentChannels();

    setTimeout(() => {
      const paymentDetails = this.clientDetails.paymentDetails;

      const displayPaymentDetails  = {
        overview_banking_info_bank_name: paymentDetails.bankName,
        overview_full_name: paymentDetails.bankName,
        overview_banking_info_branch_name: paymentDetails.bankBranchName,
        overview_doc_id_no: null,
        overview_banking_info_acc_no: paymentDetails.accountNumber,
        overview_mobile_no: null,
        overview_email: null,
        overview_iban: paymentDetails.iban,
        overview_swift_code: paymentDetails.swiftCode,
        overview_bank_name: paymentDetails.bankName,
        overview_pref_payment_method: paymentDetails.preferredChannel,
        overview_branch_name: paymentDetails.bankBranchName,
        overview_acc_no: paymentDetails.accountNumber,
      }

      if (this.group.subGroup.length === 0) {
        this.prepareGroupDetails(displayPaymentDetails);
      } else {
        this.prepareSubGroupDetails(displayPaymentDetails);
      }

      this.fields = this.formGroupsAndFieldConfig?.fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === this.group.groupId);

      for (const field of this.fields) {
        field.dataValue = displayPaymentDetails[field.fieldId] ?? null;
      }

      // sort fields in ascending order
      this.fields.sort((a, b) => a.order - b.order)

    }, 1000);

  }

  /**
   * prepares fields and table details for display when address details has no subgroup
   * @param displayContactDetails
   */
  prepareGroupDetails(displayContactDetails): void {
    if (this.group.presentationType === 'fields') {
      this.fields = this.createFieldDisplay(displayContactDetails);
    } else {
      this.createTableDisplay();
    }
  }


  /**
   * create field display using the labelled fields
   * @param displayFields
   */
  createFieldDisplay(displayFields): ConfigFormFieldsDto[] {
    const fields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === this.group.groupId);

    if (fields.length > 0) this.createEditForm(fields);

    for (const field of fields) {
      field.dataValue = displayFields[field.fieldId] ?? null;
    }

    fields.sort((a, b) => a.order - b.order);

    return fields;
  }


  /**
   * create the structured info (column headings and row data) for displaying table
   * @param subGroup
   */
  createTableDisplay(subGroup?: FormSubGroupsDto) {
    const headerFields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formSubGroupingId === subGroup.subGroupId);
    headerFields.sort((a, b) => a.order - b.order);
    this.tableHeaders = headerFields;

    this.payeeDetails = this.clientDetails.payee;

    const tableData = [];
    this.payeeDetails.forEach((pay: Payee) => {
      const payee = {
        businessPersonIdCorporate: pay.code,
        overview_full_name: pay.name,
        overview_doc_id_no: null,
        overview_mobile_no: pay.mobileNo,
        overview_email: pay.email,
        overview_bank_name: pay.bankName,
        overview_branch_name: pay.bankBranchName,
        overview_acc_no: pay.accountNumber
      };
      tableData.push(payee);
    });

    this.table = {
      cols: this.tableHeaders,
      data: tableData
    };
  }

  /**
   * Where exists, prepare the details of the subgroup
   * Call method to create either field display or table display
   * @param displayContactDetails
   */
  prepareSubGroupDetails(displayContactDetails): void {
    this.group?.subGroup?.forEach((subGroup) => {
      if (subGroup.presentationType === 'fields') {
        subGroup.fields = this.createFieldDisplay(displayContactDetails);
      } else {
        this.createTableDisplay(subGroup);
      }
    });
  }

  /**
   * delete the payee by ID
   * Refresh payee data after delete
   * @param row
   */
  handlePayeeDelete(row: any): void {
    log.info('handlePayeeDelete...' );
    this.clientService.deletePayee(row.businessPersonIdCorporate).subscribe({
      next: () => {
        this.table.data = this.table.data.filter(person => person.businessPersonIdCorporate != row.businessPersonIdCorporate);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted payee');
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.errors[0]);
      }
    });
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

/*
  editFinancialDetails(): void {
    const formValues = this.editForm.getRawValue();
    log.info('bank details >>> ', formValues);
    const paymentDetails = {
      ...this.financialDetails,
      accountNumber: formValues.accountNumber,
      bankBranchId: formValues.branchName,
      bankId: formValues.bankName,
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
*/

  fetchCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: res => {
        this.currencies = res;
        // const index = res.findIndex(c => c.id === this.financialDetails.currencyId);
        // this.selectedCurrency = res[index];
      },
      error: err => {}
    });
  }

  fetchPaymentChannels(): void {
    this.paymentModesService.getPaymentModes().subscribe({
      next: res => {
        this.paymentModes = res;
        // const index = res.findIndex(f => f.id == this.financialDetails.preferredChannel);
        // this.selectedPaymentMode = res[index];
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
          // const bankId = this.financialDetails.bankBranchId; // todo: get and use bankID
          // this.bankService.getBankBranchesByBankId(bankId).subscribe({
          //   next: res => {
          //     field.options = res;
          //     this.bankBranches = res;
          //   }
          // });
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
      // accountNumber: this.financialDetails.accountNumber,
      // bankName: this.financialDetails.bankId,
      // branchName: this.financialDetails.bankBranchId,
      // currency: this.financialDetails.currencyId,
      // wef: new Date(this.financialDetails.effectiveFromDate).toISOString().split('T')[0],
      // wet: new Date(this.financialDetails.effectiveToDate).toISOString().split('T')[0],
      // iban: this.financialDetails.iban,
      // preferredPaymentMethod: this.financialDetails.preferredChannel,
      // swiftCode: this.financialDetails.swiftCode,
      // mpayno: this.financialDetails.mpayno,
    }
    this.editForm.patchValue(patchData)
  }

}
