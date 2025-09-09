import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Logger, UtilService} from "../../services";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {SessionStorageService} from "../../services/session-storage/session-storage.service";
import {ReusableInputComponent} from "../reusable-input/reusable-input.component";
import * as bootstrap from 'bootstrap';
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
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
import {ConfigFormFieldsDto} from "../../data/common/dynamic-screens-dto";

const log = new Logger("DynamicSetupTableComponent");
@Component({
  selector: 'app-dynamic-setup-table',
  templateUrl: './dynamic-setup-table.component.html',
  styleUrls: ['./dynamic-setup-table.component.css']
})
export class DynamicSetupTableComponent implements OnInit {
  selectedTableRecordDetails: any = null;
  rowToDelete: any = null;
  tableData: any;
  editMode: boolean = false;
  selectedTableRecordIndex: number | null = null;
  pageSize: number;

  form: FormGroup;
  dynamicModalForm!: FormGroup;

  columns: DynamicColumns[] = [];
  columnDialogVisible: boolean = false;

  @ViewChild('recordDeleteConfirmationModal')
  recordDeleteConfirmationModal!: ReusableInputComponent;

  modalVisible: boolean = false;

  @Input() tableTitle: string;
  @Input() addButtonText: string;
  @Input() emptyTableMessage: string;
  @Input() formFields: ConfigFormFieldsDto[] = [];
  @Input() subGroupId: string;
  @Input() selectedAddressCountry: CountryDto;
  @Input() isPreviewMode: boolean = false;
  @Output() saveDetailsData: EventEmitter<any> = new EventEmitter<any>();

  protected readonly PhoneNumberFormat = PhoneNumberFormat;
  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [
    CountryISO.Kenya,
    CountryISO.Nigeria,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  language: string = 'en';
  validationObject = {};
  regexErrorMessages: RegexErrorMessages = {};

  sectorData: SectorDTO[] = [];
  occupationData: OccupationDTO[] = [];
  clientTitlesData: ClientTitleDTO[] = [];
  countryData: CountryDto[] = [];
  citiesData: StateDto[] = [];
  townData: TownDto[] = [];
  postalCodeData: PostalCodesDTO[] = [];
  banksData: BankDTO[] = [];
  bankBranchData: BankBranchDTO[] = [];
  fundSource: FundSourceDTO[] = [];
  selectedCountry: CountryDto;
  selectedCity: StateDto;
  selectedTown: TownDto;
  selectedBank: BankDTO;

  premiumFrequenciesData: AccountsEnum[] = [];
  employmentTypesData: AccountsEnum[] = [];
  communicationChannelsData: AccountsEnum[] = [];
  insurancePurposeData: any[] = [];

  uniqueId: string = `modal_${Math.random().toString(36).substr(2, 9)}`;

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
    log.info('country', this.selectedAddressCountry, this.subGroupId);
  }

  /**
   * Filter the form fields based on the subGroupId and create a new
   * columns array with the fieldId, header, and visibility.
   */
  filterFormFields() {
    log.info('field:', this.formFields);
    if (this.formFields) {
      const subGroupId = this.subGroupId === 'aml_details_i' || this.subGroupId === 'aml_details_c' ? 'aml_details' : this.subGroupId;
      this.columns = this.formFields.filter(field => field.formSubGroupingId === subGroupId)
        .map(field => ({
          field: field.fieldId,
          header: field.label,
          visible: field.visible !== false,
        }));
      log.info('columns:', this.columns);
    }
  }

  /**
   * Create a form with form controls for each field in the formFields array.
   * The form control is created with the fieldId as the key and a FormControl
   * instance as the value. The FormControl instance is created with the
   * validators specified in the field's validations array.
   */
  createForm() {
    if (!this.formFields) return;
    const formControls: any = {};
    log.info('formFields:', this.formFields);

    this.formFields.forEach(field => {
      const validators = this.utilService.buildValidators(field);
      formControls[field.fieldId] = new FormControl('', validators);
    });

    this.dynamicModalForm = this.fb.group(formControls);

    log.info('[createForm] Controls created:', Object.keys(this.dynamicModalForm.controls));

    this.cdr.detectChanges();
  }

  /**
   * Opens the dynamic details modal.
   *
   * This method creates a form with form controls for each field in the formFields array,
   * and then opens the modal using the bootstrap.Modal class.
   *
   * @returns {void}
   */
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

  /**
   * Closes the dynamic details modal.
   *
   * This method hides the modal using the bootstrap.Modal class.
   *
   * @returns {void}
   */
  closeModal() {
    const modalEl = document.getElementById('dynamicDetailsModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
    this.modalVisible = false;
  }

  /**
   * Saves the dynamic details modal form data.
   *
   * This method is called when the user clicks the Save button in the modal.
   * It filters the form data to only include fields that have a value, and then
   * creates a new object with the filtered fields. It then updates the table
   * data with the new object, and saves the table data to the session storage.
   * If the edit mode is on, it updates the existing record in the table data;
   * otherwise, it adds a new record.
   *
   * @returns {void}
   */
  saveDetails(): void {
    // Mark all form controls as touched to trigger validation messages
    this.markFormGroupTouched(this.dynamicModalForm);

    // If form is invalid, stop here
    if (this.dynamicModalForm.invalid) {
      // this.dynamicModalForm.markAllAsTouched();
      log.warn('Form is invalid. Please check the required fields.');
      return;
    }
    const formValue = this.dynamicModalForm.getRawValue();

    const filtered = Object.fromEntries(
      Object.entries(formValue).filter(([_, value]) => value != null && value !== '')
    );
    log.info("filtered form with values", filtered, this.formFields);

    const savedFields: { [key: string]: any } = {};

    if (this.formFields) {
      this.formFields.forEach(field => {
        const fieldValue = filtered[field.fieldId];

        if (fieldValue !== undefined) {
          // Check if value is a phone number object with e164Number
          if (fieldValue && typeof fieldValue === 'object' && 'e164Number' in fieldValue) {
            savedFields[field.fieldId] = fieldValue.e164Number;
            log.info(`Field ${field.fieldId} (tel) value updated to:`, fieldValue.e164Number);
          } else {
            savedFields[field.fieldId] = fieldValue;
            log.info(`Field ${field.fieldId} value updated to:`, fieldValue);
          }
        }
      });
    }

    this.saveDetailsData.emit({
      data: this.tableData,
      subGroupId: this.subGroupId
    });

    log.info('Saved fields object:', savedFields);
    if (!Array.isArray(this.tableData)) {
      this.tableData = [];
    }
    if (this.editMode === true && this.selectedTableRecordIndex >= 0) {
      this.tableData[this.selectedTableRecordIndex] = savedFields;
    } else {
      this.tableData.push(savedFields);
    }

    this.selectedTableRecordDetails = null;
    this.selectedTableRecordIndex = null;
    this.editMode = false;

    this.sessionStorageService.setItem(
      this.subGroupId,
      JSON.stringify(this.tableData)
    );
    this.closeModal();
    // return savedFields;
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  /**
   * Toggles the edit mode and opens the dynamic details modal.
   *
   * This method is called when the user clicks the Edit button in the table.
   * It toggles the edit mode, and if the edit mode is on, it opens the modal
   * and patches the form values with the selected table record details.
   *
   * @returns {void}
   */
  editSelectedRecord(rowData: any) {
    this.selectedTableRecordDetails = rowData;
    if (this.selectedTableRecordDetails) {
      this.editMode = !this.editMode;
      this.selectedTableRecordIndex = this.tableData.findIndex(
        (item: any) => item === this.selectedTableRecordDetails
      );
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
    this.cdr.detectChanges();
  }

  /**
   * Deletes the selected table record.
   *
   * This method is called when the user clicks the Delete button in the table.
   * It deletes the selected table record from the table data and saves the table
   * data to the session storage.
   *
   * @returns {void}
   */
  deleteSelectedRecord(rowData: any) {
    this.rowToDelete = rowData;
    this.recordDeleteConfirmationModal.show();
  }

  /**
   * Confirms the deletion of the selected table record.
   *
   * This method is called when the user clicks the Confirm button in the
   * record delete confirmation modal.
   * It deletes the selected table record from the table data and saves the table
   * data to the session storage.
   *
   * @returns {void}
   */
  confirmRecordDelete() {
    const index = this.tableData.findIndex((item: any) => item === this.rowToDelete);
    if (index !== -1) {
      this.tableData.splice(index, 1);
      this.sessionStorageService.setItem(this.subGroupId, JSON.stringify(this.tableData));
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No record is selected'
      );
    }
  }

  /**
   * Handles the selection of a table row.
   *
   * This method is called when the user selects a table row. It updates the
   * selectedTableRecordDetails property with the selected row data.
   *
   * @param {Event} event - The select event.
   * @returns {void}
   */
  onRowSelect(event: any) {
    this.selectedTableRecordDetails = event.data;
  }

  /**
   * Processes the selected option for a select field and updates the related fields.
   *
   * @param {Event} event - The select event.
   * @param {string} fieldId - The id of the field.
   * @returns {void}
   */
  processSelectOption(event: any, fieldId: string) : void {
    if (this.isPreviewMode === true) {
      return;
    }
    const selectedOption = event.target.value;
    log.info(`processSelectOptions >>> `, selectedOption, fieldId);
    switch (fieldId) {
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

  /**
   * Validates a field using a regex pattern.
   *
   * @param {FieldModel} field - The field to validate.
   * @param {string} groupId - The group id.
   * @returns {void}
   */
  validateRegex(field: ConfigFormFieldsDto, groupId: string): void {

    const fieldId = field.fieldId;
    let pattern: RegExp;
    let input: string;
    let errorMessage: string;

    switch (fieldId) {
      default:
        pattern = new RegExp(field.validations[0]?.value);
        input =  this.dynamicModalForm.getRawValue()[fieldId];
        errorMessage = field.validations[0]?.message[this.language];
        this.generateRegexErrorMessage(pattern, input, errorMessage, fieldId);
    }

    log.info(`regex to use`, this.regexErrorMessages, groupId, fieldId);
  }

  /**
   * Generates the regex error message for a field.
   *
   * @param {RegExp} pattern - The regex pattern.
   * @param {string} input - The input to validate.
   * @param {string} errorMessage - The error message.
   * @param {string} fieldId - The field id.
   * @returns {void}
   */
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

  /**
   * Gets the country ISO from the selected address country.
   *
   * @returns {CountryISO | undefined} The country ISO or undefined if not found.
   */
  get countryISO(): CountryISO | undefined {
    return this.selectedAddressCountry?.short_description as CountryISO;
  }

  /**
   * Fetches the select options for a given field id.
   *
   * @param {string} fieldId - The id of the field.
   * @returns {void}
   */
  fetchSelectOptions(fieldId: string) {
    if (this.isPreviewMode === true) {
      return;
    }
    log.info('selectid', fieldId);
    const fieldIndex: number = this.formFields
      .findIndex((field: ConfigFormFieldsDto) => field.fieldId === fieldId);

    switch (fieldId) {
      case 'source_of_fund':
      case 'sourceOfFundAml':
        this.fetchFundSource(fieldIndex)
        break;
      case 'economicSector':
      case 'economicSectorAml':
        this.fetchSectors(fieldIndex);
        break;
      case 'occupation':
        this.fetchOccupations(fieldIndex);
        break
      case 'titleId':
        this.fetchClientTitles(fieldIndex);
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
      case 'cnt_corporate_branch_details_postalCode':
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

  /**
   * Fetches the fund source options for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the sectors for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
  fetchSectors(fieldIndex: number) {
    this.sectorService.getSectors().subscribe({
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

  /**
   * Fetches the occupations for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
  fetchOccupations(fieldIndex: number) {
    this.occupationService.getOccupations().subscribe({
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

  /**
   * Fetches the client titles for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
  fetchClientTitles(fieldIndex: number) {
    this.accountService.getClientTitles().subscribe({
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

  /**
   * Fetches the countries.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the main city states for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the towns for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the postal codes for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the banks for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
  fetchBanks(fieldIndex: number) {
    this.bankService.getBanks(this.selectedAddressCountry?.id).subscribe({
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

  /**
   * Fetches the bank branches for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the premium frequencies for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the employment types for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the preferred communication channels for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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

  /**
   * Fetches the insurance purpose for the given field index.
   * @param fieldIndex The index of the field for which to fetch the options.
   */
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
