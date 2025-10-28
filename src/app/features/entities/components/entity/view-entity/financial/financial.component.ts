import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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
  FormGroupsDto,
  FormSubGroupsDto,
  PresentationType, SaveAddressAction,
  SaveFinanceAction
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";

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
  selectedPayee: Payee;

  currencies: CurrencyDTO[];
  selectedCurrency: CurrencyDTO;

  paymentModes: PaymentModesDto[];
  selectedPaymentMode: PaymentModesDto;

  fields: ConfigFormFieldsDto[];
  tableHeaders: ConfigFormFieldsDto[];
  table: { cols: any[], data: any[] } = { cols: [], data: [] };

  PRESENTATION_TYPE = PresentationType;
  selectedSubgroup: FormSubGroupsDto = null;
  formHeadingLabel: FormSubGroupsDto | FormGroupsDto;
  formFields: ConfigFormFieldsDto[] = [];
  saveAction: SaveFinanceAction;

  protected readonly Save_Action = SaveFinanceAction;
  protected readonly SearchCountryField = SearchCountryField;
  protected readonly CountryISO = CountryISO;
  protected readonly PhoneNumberFormat = PhoneNumberFormat;



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
    this.fetchCurrencies();
    this.fetchPaymentChannels();
    this.prepareDataDisplay();
  }

  prepareDataDisplay(): void {
    setTimeout(() => {
      const paymentDetails = this.clientDetails.paymentDetails;
      this.paymentDetails = paymentDetails;

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


  createEditForm(fields: ConfigFormFieldsDto[], saveAction?: SaveFinanceAction): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
      ];
    });
    this.editForm = this.fb.group(group);
    this.setSelectOptions();

    if (
      saveAction === SaveFinanceAction.EDIT_FINANCE_DETAILS ||
      saveAction === SaveFinanceAction.EDIT_PAYEE
    ) this.patchFormValues(fields);
  }


  openEditFinancialDialog(subgroup?: FormSubGroupsDto, saveAction?: SaveFinanceAction): void {
    this.saveAction = saveAction;
    let fields: ConfigFormFieldsDto[];

    if (subgroup?.fields) {
      this.selectedSubgroup = subgroup;
      this.formHeadingLabel = subgroup;
      fields = subgroup.fields;
    } else {
      fields = this.fields;
      this.formHeadingLabel = this.group;
    }

    this.prepareDataDisplay();

    this.formFields = fields;
    this.createEditForm(fields, saveAction);
    this.editButton.nativeElement.click();
    log.info('subgroup >>> ', subgroup)
  }

  saveDetails() {
    switch (this.saveAction) {
      case SaveFinanceAction.EDIT_FINANCE_DETAILS:
        this.editFinancialDetails();
        break;
      case SaveFinanceAction.EDIT_PAYEE:
        this.addEditPayee();
        break;
      case SaveFinanceAction.SAVE_PAYEE:
        this.editForm.reset();
        this.addEditPayee();
        break;
      default:
      // do something
    }
  }

  editFinancialDetails(): void {
    const formValues = this.editForm.getRawValue();
    log.info('payee details >>> ', formValues);
    const paymentDetails = {
      ...this.paymentDetails,
      accountNumber: formValues.overview_banking_info_acc_no,
      bankBranchId: formValues.overview_banking_info_branch_name,
      bankId: formValues.overview_banking_info_bank_name,
      // currencyId: formValues.currency,
      // effectiveFromDate: formValues.wef,
      // effectiveToDate: formValues.wet,
      iban: formValues.overview_iban,
      preferredChannel: formValues.overview_pref_payment_method,
      swiftCode: formValues.overview_pref_swift_code,
      // mpayno: formValues.mpayno
    };

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      paymentDetails
    };

    this.clientService.updateClientSection(this.clientDetails.clientCode, client).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.clientDetails = data;
        this.prepareDataDisplay();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }


  addEditPayee(): void {
    const formValues = this.editForm.getRawValue();
    log.info('form values ->', this.editForm.value);

    const payee = {
      ...this.selectedPayee,
      accountNumber: formValues.overview_acc_no,
      // address: null,
      // agentCode: null,
      bankBranchCode: formValues.overview_branch_name,
      bankBranchName: formValues.overview_branch_name,
      bankName: formValues.overview_bank_name,
      // countryCode: null,
      // countryName: null,
      // createdBy: null,
      // createdDate: null,
      email: formValues.overview_email,
      idNo: formValues.overview_doc_id_no,
      mobileNo: (formValues?.overview_mobile_no?.internationalNumber)?.replace(/\s+/g, ''),
      // modifiedBy: null,
      // modifiedDate: null,
      name: formValues.overview_full_name,
      // serviceProviderCode: null,
      // town: null,
      // type: null,
      // zip: null
    };

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      payee: [payee]
    }

    this.clientService.updateClientSection(this.clientDetails.clientCode, client).subscribe({
      next: data => {
        this.clientDetails = data;
        this.prepareDataDisplay();
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created/updated payee');
        this.closeButton.nativeElement.click();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
        this.closeButton.nativeElement.click();
      }
    });
  }

  prepareEditPayeeForm(data: any, saveAction: SaveFinanceAction) {
    this.saveAction = saveAction;
    this.formFields =  this.tableHeaders.map(field => ({...field})) ;
    const row = data.row;
    this.selectedPayee = this.clientDetails.payee.find(payee => payee.code = row.businessPersonIdCorporate);
    this.selectedSubgroup = data.subGroup;
    log.info('selected payee >>> ', this.selectedPayee, row)

    this.formFields.forEach((field: ConfigFormFieldsDto) => {
      field.dataValue = row[field.fieldId];
      if (field.type === 'date') {
        field.dataValue = row[field.fieldId]?.split('T')[0];
      }
    });

    this.createEditForm(this.formFields, saveAction);
    this.editButton.nativeElement.click();
  }

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
    this.formFields.forEach(field => {
      switch (field.fieldId) {
        case 'overview_bank_name':
        case 'overview_banking_info_bank_name':
          this.banks$.subscribe({
            next: res => {
              field.options = res;
              this.banks = res;
            }
          });
          break;

        case 'overview_branch_name ':
        case 'overview_banking_info_branch_name':
          const bankId = this.paymentDetails.bankBranchId; // todo: get and use bankID
          this.bankService.getBankBranchesByBankId(bankId).subscribe({
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
        case 'overview_pref_payment_method':
          field.options = this.paymentModes;
          break;
      }
    });
  }

  processSelectOption(event: any, fieldId: string): void {
    const selectedOption = event.target.value;

    switch (fieldId) {
      case 'overview_bank_name':
      case 'overview_banking_info_bank_name':
        this.bankService.getBankBranchesByBankId(selectedOption).subscribe({
          next: res => {
            this.formFields.forEach(field => {
              if (
                field.fieldId === 'overview_branch_name' ||
                field.fieldId === 'overview_banking_info_branch_name'
              ) {
                field.options = res;
              }
            });
          },
          error: err => {}
        });
        break;
    }
  }


  patchFormValues(fields): void {
    let patchData = {};

    if (this.group.subGroup.length > 0) {
      this.formFields.forEach(field => { // corporate
        patchData[field.fieldId] = field.dataValue;
      });
    } else if (this.group.subGroup.length === 0) { // individual
      fields.forEach(field => {
        patchData[field.fieldId] = field.dataValue;
      });
    }

    if (this.saveAction === SaveFinanceAction.EDIT_FINANCE_DETAILS) {
      patchData = {
        overview_banking_info_acc_no: this.paymentDetails.accountNumber,
        overview_banking_info_bank_name: this.paymentDetails.bankId,
        overview_banking_info_branch_name: this.paymentDetails.bankBranchId,
        // currency: this.paymentDetails.currencyId,
        // wef: new Date(this.paymentDetails.effectiveFromDate).toISOString().split('T')[0],
        // wet: new Date(this.paymentDetails.effectiveToDate).toISOString().split('T')[0],
        overview_iban: this.paymentDetails.iban,
        overview_pref_payment_method: this.paymentDetails.preferredChannel,
        overview_swift_code: this.paymentDetails.swiftCode,
        // mpayno: this.paymentDetails.mpayno,
      }
    } else if (this.saveAction === SaveFinanceAction.EDIT_PAYEE) {
      patchData = {
        overview_bank_name: this.selectedPayee.bankName,
        overview_bank_branch: this.selectedPayee.bankBranchName,
      }
    }

    log.info('patch data >>> ', patchData);
    this.editForm.patchValue(patchData)
  }

  checkTelNumber(mainStr: string): boolean {
    const subStrs: string[] = ['mobile_no', 'tel_no', 'sms_number', 'telephone_number', 'landline_number'];
    return subStrs.some(subStr => mainStr.includes(subStr));
  }
}
