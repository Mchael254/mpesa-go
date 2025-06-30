import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Logger, UtilService} from "../../services";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {SessionStorageService} from "../../services/session-storage/session-storage.service";
import {ReusableInputComponent} from "../reusable-input/reusable-input.component";
import * as bootstrap from 'bootstrap';
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {FieldModel} from "../../../features/entities/data/form-config.model";
import {RegexErrorMessages} from "../../../features/entities/data/field-error.model";
import {DynamicColumns} from "../../data/dynamic-columns";
import {SectorService} from "../../services/setups/sector/sector.service";
import {OccupationService} from "../../services/setups/occupation/occupation.service";
import {AccountService} from "../../../features/entities/services/account/account.service";
import {CountryService} from "../../services/setups/country/country.service";
import {BankService} from "../../services/setups/bank/bank.service";
import {SectorDTO} from "../../data/common/sector-dto";
import {OccupationDTO} from "../../data/common/occupation-dto";
import {ClientTitleDTO} from "../../data/common/client-title-dto";
import {CountryDto, PostalCodesDTO, StateDto, TownDto} from "../../data/common/countryDto";
import {BankBranchDTO, BankDTO, FundSourceDTO} from "../../data/common/bank-dto";
import {AccountsEnum} from "../../../features/entities/data/enums/accounts-enum";

const log = new Logger("DynamicSetupTableComponent");
@Component({
  selector: 'app-dynamic-setup-table',
  templateUrl: './dynamic-setup-table.component.html',
  styleUrls: ['./dynamic-setup-table.component.css']
})
export class DynamicSetupTableComponent implements OnInit {
  selectedTableRecordDetails: any;
  tableData: any;
  editMode: boolean = false;
  selectedTableRecordIndex: number | null = null;
  pageSize: number;

  form: FormGroup;
  dynamicModalForm!: FormGroup;

  columns: DynamicColumns[] = [];
  filteredColumns: DynamicColumns[] = [];
  columnDialogVisible: boolean = false;

  filteredCr12FormFields: FieldModel[] = null;

  @ViewChild('recordDeleteConfirmationModal')
  recordDeleteConfirmationModal!: ReusableInputComponent;

  modalVisible: boolean = false;

  @Input() tableTitle: string;
  @Input() addButtonText: string;
  @Input() emptyTableMessage: string;
  @Input() formFields: FieldModel[] = [];
  @Input() subGroupId: string;
  @Output() saveDetailsData: EventEmitter<any> = new EventEmitter<any>();

  protected readonly PhoneNumberFormat = PhoneNumberFormat;
  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;

  language: string = 'en';
  validationObject = {};
  regexErrorMessages: RegexErrorMessages = {};

  sectorData: SectorDTO[];
  occupationData: OccupationDTO[];
  clientTitlesData: ClientTitleDTO[] = [];
  countryData: CountryDto[] = [];
  citiesData: StateDto[] = [];
  townData: TownDto[] = [];
  postalCodeData: PostalCodesDTO[] = [];
  banksData: BankDTO[];
  bankBranchData: BankBranchDTO[];
  fundSource: FundSourceDTO[];
  selectedCountry: CountryDto;
  selectedCity: StateDto;
  selectedTown: TownDto;
  selectedBank: BankDTO;
  selectedCr12Category: any;

  premiumFrequenciesData: AccountsEnum[];
  employmentTypesData: AccountsEnum[];
  communicationChannelsData: AccountsEnum[];
  insurancePurposeData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private sessionStorageService: SessionStorageService,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
    private sectorService: SectorService,
    private occupationService: OccupationService,
    private accountService: AccountService,
    private countryService: CountryService,
    private bankService: BankService,
  ) {
    this.form = this.fb.group({});
    this.dynamicModalForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.filterFormFields();
    this.tableData = this.sessionStorageService.getItem(this.subGroupId) ? JSON.parse(this.sessionStorageService.getItem(this.subGroupId)) : [];
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  filterFormFields() {
    log.info('field:', this.formFields);
    if (this.formFields) {
      this.columns = this.formFields.filter(field => field.subGroupId === this.subGroupId)
        .map(field => ({
          field: field.fieldId,
          header: field.label['en'] || field.fieldId,
          visible: field.visible !== false,
          appliesTo: field.appliesTo
      }));
      log.info('columns:', this.columns);

      this.onTypeSelect({target: {value: 'I'}} as unknown as Event);
    }
  }

  /*createForm() {
    if (!this.formFields) return;
    const formControls: any = {};

    this.groupFields = this.formFields.filter(field => field.subGroupId === this.subGroupId);
    this.groupFields.forEach(field => {
      let validators = [];

      if (field.validations) {
        field.validations.forEach(validation => {
          if (validation.type === 'required') {
            validators.push(Validators.required);
          }
        });
      }

      // formControls[field.fieldId] = [field.defaultValue || '', validators]
      formControls[field.fieldId] = new FormControl('', validators);



    });

    this.formGroup = this.fb.group(formControls);
    this.formReady = true;
    // this.formGroup.addControl('subGroupId', formControls);
    // this.formGroup.updateValueAndValidity();
    console.log('[createForm] Controls created:', Object.keys(this.formGroup.controls));
    console.log('[Rendering] groupFields:', this.groupFields.map(f => f.fieldId));
    console.log('[Modal Open] groupFields:', this.groupFields.map(f => f.fieldId));

    log.info('controls:', formControls, this.formGroup, this.groupFields);
    this.cdr.detectChanges();
  }*/

  createForm() {
    if (!this.formFields) return;
    const formControls: any = {};
    log.info('formFields:', this.formFields);
    const defaultFields = this.filteredCr12FormFields !== null ? this.filteredCr12FormFields : this.formFields;

    defaultFields.forEach(field => {
      let validators = [];

      if (field.validations) {
        field.validations.forEach(validation => {
          if (validation.type === 'required') {
            validators.push(Validators.required);
          }
        });
      }

      formControls[field.fieldId] = new FormControl('', validators);
    });

    this.dynamicModalForm = this.fb.group(formControls);

    if (this.selectedCr12Category && this.dynamicModalForm.contains('cr12Category')) {
      this.dynamicModalForm.controls['cr12Category'].setValue(this.selectedCr12Category);
    }

    log.info('[createForm] Controls created:', Object.keys(this.dynamicModalForm.controls));

    this.cdr.detectChanges();
  }

  openModal() {
    this.createForm();
    this.modalVisible = true;

    setTimeout(() => {
      const modalEl = document.getElementById('dynamicDetailsModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }

  closeModal() {
    const modalEl = document.getElementById('dynamicDetailsModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
    this.modalVisible = false;
  }

  saveDetails() {
    const formValue = this.dynamicModalForm.getRawValue();

    const filtered = Object.fromEntries(
      Object.entries(formValue).filter(([_, value]) => value != null && value !== '')
    );
    log.info("filtered form with values", filtered, this.formFields);

    const savedFields: { [key: string]: any } = {};

    if (this.formFields) {
      this.formFields.forEach(field => {
        if (filtered[field.fieldId] !== undefined) {
          // field.value = filtered[field.fieldId];
          // savedFields[field.fieldId] = field.value;
          // const fieldValue = field.value;
          savedFields[field.fieldId] = filtered[field.fieldId];
          log.info(`Field ${field.fieldId} value updated to:`, filtered[field.fieldId]);
        }
      });
    }

    this.saveDetailsData.emit({
      data: savedFields,
      subGroupId: this.subGroupId
    });

    log.info('Saved fields object:', savedFields);
    if (!Array.isArray(this.tableData)) {
      this.tableData = [];
    }

    if (this.editMode && this.selectedTableRecordIndex !== null) {
      this.tableData[this.selectedTableRecordIndex] = savedFields;
    } else {
      this.tableData.push(savedFields);
    }

    this.selectedTableRecordDetails = null;
    this.selectedTableRecordIndex = null;


    this.sessionStorageService.setItem(
      this.subGroupId,
      JSON.stringify(this.tableData)
    );
    this.closeModal();
    return savedFields;
  }

  editSelectedRecord() {
    this.editMode = !this.editMode;
    this.selectedTableRecordIndex = this.tableData.findIndex(
      (item: any) => item === this.selectedTableRecordDetails
    );
    if (this.selectedTableRecordDetails) {
      this.openModal();
      const patchValues: { [key: string]: any } = {};
      if (this.formFields) {
        this.formFields.forEach((field: any) => {
          if (this.selectedTableRecordDetails[field.fieldId] !== undefined) {
            patchValues[field.fieldId] = this.selectedTableRecordDetails[field.fieldId];
          }
        });
        this.dynamicModalForm.patchValue(patchValues);
      }
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No record is selected'
      );
    }
  }

  deleteSelectedRecord() {
    if (!this.selectedTableRecordDetails) {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No record is selected'
      );
      return;
    }
    this.recordDeleteConfirmationModal.show();
  }

  confirmRecordDelete() {
    const index = this.tableData.findIndex((item: any) => item === this.selectedTableRecordDetails);
    if (index !== -1) {
      this.tableData.splice(index, 1);
      this.sessionStorageService.setItem(this.subGroupId, JSON.stringify(this.tableData));
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No record is selected'
      );
    }
  }

  onRowSelect(event: any) {
    this.selectedTableRecordDetails = event.data;
  }

  onTypeSelect($event: Event) {
    this.filteredColumns = this.columns.filter(column =>
      column.appliesTo === 'ALL' || column.appliesTo === $event.target['value']
    );

    log.info('filtered columns', this.filteredColumns);
  }

  processSelectOption(event: any, fieldId: string) : void {
    const selectedOption = event.target.value;
    log.info(`processSelectOptions >>> `, selectedOption, fieldId);
    switch (fieldId) {

      case 'cr12Category':
        const backupFields = [...this.formFields];
        this.filteredCr12FormFields = backupFields.filter(field =>
          field.appliesTo === (selectedOption === 'corporate' ? 'C' : 'I') ||
          field.appliesTo === 'ALL'
        );
        this.selectedCr12Category = selectedOption;
        this.createForm();
        this.cdr.detectChanges();
        break;
      case 'country':
        this.selectedCountry = this.countryData.find((b: CountryDto) => b.name === selectedOption);
        break;
      case 'county':
        this.selectedCity = this.citiesData.find((b: StateDto) => b.name === selectedOption);
        break;
      case 'town':
        this.selectedTown = this.townData.find((b: TownDto) => b.name === selectedOption);
        break;
      case 'bankName':
        this.selectedBank = this.banksData.find((b: BankDTO) => b.name === selectedOption);
        break;
      default:
        log.info(`no fieldId found`);
    }
  }


  getFieldControl(groupId: string, fieldId: string) {
    return this.dynamicModalForm.get(`${groupId}.${fieldId}`);
  }

  validateRegex(field: FieldModel, groupId: string): void {

    const fieldId = field.fieldId;
    let pattern: RegExp;
    let input: string;
    let errorMessage: string;

    log.info(`regex to use1`, groupId, fieldId);
    switch (fieldId) {
      default:
        pattern = new RegExp(field.validations[0]?.value);
        input =  this.dynamicModalForm.getRawValue()[fieldId];
        errorMessage = field.validations[0]?.message[this.language];
        this.generateRegexErrorMessage(pattern, input, errorMessage, fieldId);
    }

    log.info(`regex to use`, this.regexErrorMessages, groupId, fieldId);

  }

  generateRegexErrorMessage(pattern: RegExp, input: string, errorMessage: string, fieldId: string): void {
    if (pattern.test(input)) {
      this.regexErrorMessages[fieldId] = {
        showErrorMessage: false,
        errorMessage: ''
      }
    } else {
      this.regexErrorMessages[fieldId] = {
        showErrorMessage: true,
        errorMessage: errorMessage
      }
    }
  }

  fetchSelectOptions(fieldId: string) {
    // const sectionIndex: number = this.formFields.findIndex(section => section.groupId === groupId);
    log.info('selectid', fieldId);
    const fieldIndex: number = this.formFields
      .findIndex((field: FieldModel) => field.fieldId === fieldId);
    /*if (
      this.formFields[fieldIndex].options.length > 0 &&
      (!['bankId', 'bankBranchCode'].includes(fieldId))
    ) return*/ // if options already have value, don't call endpoint

    switch (fieldId) {
      case 'source_of_fund':
      case 'sourceOfFundAml':
        this.fetchFundSource(fieldIndex)
        break;
      case 'economicSector':
      case 'economicSectorAml':
        this.fetchSectors(fieldIndex, undefined);
        break;
      case 'occupation':
        this.fetchOccupations(fieldIndex, undefined);
        break
      case 'title':
        this.fetchClientTitles(fieldIndex, undefined);
        break
      case 'country':
      case 'parentCountry':
      case 'operatingCountry':
        this.fetchCountries(fieldIndex);
        break
      case 'county':
        this.fetchMainCityStates(fieldIndex);
        break;
      case 'town':
        this.fetchTowns(fieldIndex);
        break;
      case 'postalCode':
        this.fetchPostalCode(fieldIndex);
        break;
      case 'bankName':
        this.fetchBanks(fieldIndex);
        break;
      case 'branchName':
        this.fetchBankBranches(fieldIndex);
        break;
      case 'type_of_employment':
        this.fetchEmploymentTypes(fieldIndex);
        break;
      case 'purposeOfInsurance':
        this.fetchInsurancePurpose(fieldIndex);
        break;
      case 'premiumFrequency':
        this.fetchPremiumFrequencies(fieldIndex);
        break;
      case 'distributionChannel':
        this.fetchPreferredCommunicationChannels(fieldIndex);
        break;
      default:
        log.info(`no fieldId found`)
    }
  }

  fetchFundSource(fieldIndex: number) {
    this.bankService.getFundSource().subscribe({
      next: (data: FundSourceDTO[]) => {
        this.fundSource = data;
        const fundSourceStringArr: string[] = data.map((fundsSource: FundSourceDTO) => fundsSource.name);
        this.formFields[fieldIndex].options = fundSourceStringArr
        log.info(`funds source: `, fundSourceStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchSectors(fieldIndex: number, organizationId: number) {
    this.sectorService.getSectors(organizationId).subscribe({
      next: (data: SectorDTO[]) => {
        this.sectorData = data;
        const sectorStringArr: string[] = data.map((sector: SectorDTO) => sector.name);
        this.formFields[fieldIndex].options = sectorStringArr
        log.info(`sector: `, sectorStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchOccupations(fieldIndex: number, organizationId: number) {
    this.occupationService.getOccupations(organizationId).subscribe({
      next: (data: OccupationDTO[]) => {
        this.occupationData = data;
        const occupationStringArr: string[] = data.map((occupation: OccupationDTO) => occupation.name);
        this.formFields[fieldIndex].options = occupationStringArr
        log.info(`occupation: `, occupationStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchClientTitles(fieldIndex: number, organizationId: number) {
    this.accountService.getClientTitles(organizationId).subscribe({
      next: (data: ClientTitleDTO[]) => {
        this.clientTitlesData = data;
        const titleStringArr: string[] = data.map((title: ClientTitleDTO) => title.description);
        this.formFields[fieldIndex].options = titleStringArr
        log.info(`title: `, titleStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchCountries(fieldIndex: number) {
    this.countryService.getCountries().subscribe({
      next: (data: CountryDto[]) => {
        this.countryData = data;
        const countryStringArr: string[] = data.map((country: CountryDto) => country.name);
        this.formFields[fieldIndex].options = countryStringArr
        log.info(`country: `, countryStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchMainCityStates(fieldIndex: number) {
    this.countryService.getMainCityStatesByCountry(this.selectedCountry?.id).subscribe({
      next: (data: StateDto[]) => {
        this.citiesData = data;
        const statesStringArr: string[] = data.map((state: StateDto) => state.name);
        this.formFields[fieldIndex].options = statesStringArr
        log.info(`state: `, statesStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a country!');
      }
    })
  }

  fetchTowns(fieldIndex: number) {
    this.countryService.getTownsByMainCityState(this.selectedCity?.id).subscribe({
      next: (data: TownDto[]) => {
        this.townData = data;
        const townsStringArr: string[] = data.map((town: TownDto) => town.name);
        this.formFields[fieldIndex].options = townsStringArr
        log.info(`town: `, townsStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a city!');
      }
    })
  }

  fetchPostalCode(fieldIndex: number) {
    this.countryService.getPostalCodes(this.selectedTown?.id).subscribe({
      next: (data: PostalCodesDTO[]) => {
        this.postalCodeData = data;
        const postalCodesStringArr: string[] = data.map((postalCode: PostalCodesDTO) => postalCode.description);
        this.formFields[fieldIndex].options = postalCodesStringArr
        log.info(`postal codes: `, postalCodesStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a town!');
      }
    })
  }

  fetchBanks(fieldIndex: number) {
    this.bankService.getBanks(this.selectedCountry?.id).subscribe({
      next: (data: BankDTO[]) => {
        this.banksData = data;
        const bankStringArr: string[] = data.map((bank: BankDTO) => bank.name);
        this.formFields[fieldIndex].options = bankStringArr
        log.info(`banks: `, bankStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a country!');
      }
    })
  }

  fetchBankBranches(fieldIndex: number) {
    this.bankService.getBankBranchesByBankId(this.selectedBank?.id).subscribe({
      next: (data: BankBranchDTO[]) => {
        this.bankBranchData = data;
        const bankBranchStringArr: string[] = data.map((branch: BankBranchDTO) => branch.name);
        this.formFields[fieldIndex].options = bankBranchStringArr
        log.info(`bank branches: `, bankBranchStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a bank!');
      }
    })
  }

  fetchPremiumFrequencies(fieldIndex: number) {
    this.accountService.getPremiumFrequencies().subscribe({
      next: (data: AccountsEnum[]) => {
        this.premiumFrequenciesData = data;
        const premiumFrequenciesStringArr: string[] = data.map((branch: AccountsEnum) => branch.value);
        this.formFields[fieldIndex].options = premiumFrequenciesStringArr
        log.info(`premium frequencies: `, premiumFrequenciesStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchEmploymentTypes(fieldIndex: number) {
    this.accountService.getEmploymentTypes().subscribe({
      next: (data: AccountsEnum[]) => {
        this.employmentTypesData = data;
        const employmentTypesStringArr: string[] = data.map((type: AccountsEnum) => type.value);
        this.formFields[fieldIndex].options = employmentTypesStringArr
        log.info(`employment types: `, employmentTypesStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchPreferredCommunicationChannels(fieldIndex: number) {
    this.accountService.getPreferredCommunicationChannels().subscribe({
      next: (data: AccountsEnum[]) => {
        this.communicationChannelsData = data;
        const communicationChannelsStringArr: string[] = data.map((channel: AccountsEnum) => channel.value);
        this.formFields[fieldIndex].options = communicationChannelsStringArr
        log.info(`communication channels: `, communicationChannelsStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchInsurancePurpose(fieldIndex: number) {
    this.accountService.getInsurancePurpose().subscribe({
      next: (data: any[]) => {
        this.insurancePurposeData = data;
        const insurancePurposeStringArr: string[] = data.map((purpose: any) => purpose.name);
        this.formFields[fieldIndex].options = insurancePurposeStringArr
        log.info(`insurance purposes: `, insurancePurposeStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }
}
