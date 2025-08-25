import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicColumns} from "../../../data/dynamic-columns";
import {CountryDto} from "../../../data/common/countryDto";
import {RegexErrorMessages} from "../../../../features/entities/data/field-error.model";
import {GlobalMessagingService} from "../../../services/messaging/global-messaging.service";
import {Logger} from "../../../services";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import * as bootstrap from 'bootstrap';
import {ConfigFormFieldsDto} from "../../../data/common/dynamic-screens-dto";

const log = new Logger("PreviewDynamicSetupTableComponent");
@Component({
  selector: 'app-preview-dynamic-setup-table',
  templateUrl: './preview-dynamic-setup-table.component.html',
  styleUrls: ['./preview-dynamic-setup-table.component.css']
})
export class PreviewDynamicSetupTableComponent implements OnInit {
  tableData: any;
  editMode: boolean = false;
  pageSize: number;

  form: FormGroup;
  dynamicModalForm!: FormGroup;

  columns: DynamicColumns[] = [];
  columnDialogVisible: boolean = false;

  modalVisible: boolean = false;

  @Input() tableTitle: string;
  @Input() addButtonText: string;
  @Input() emptyTableMessage: string;
  @Input() formFields: ConfigFormFieldsDto[] = [];
  @Input() subGroupId: any;
  @Input() selectedAddressCountry: CountryDto;

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
  regexErrorMessages: RegexErrorMessages = {};

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({});
    this.dynamicModalForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.filterFormFields();
  }

  /**
   * Returns the selected address country ISO code, or undefined if it is not set.
   * @returns {CountryISO | undefined} The selected address country ISO code.
   */
  get countryISO(): CountryISO | undefined {
    return this.selectedAddressCountry?.short_description as CountryISO;
  }

  /**
   * Filters the form fields based on the subGroupId and creates a new columns array with the fieldId, header, and visibility.
   * Logs the form fields and the resulting columns.
   */
  filterFormFields() {
    log.info('field:', this.formFields);
    if (this.formFields) {
      const subGroupId = this.subGroupId === 'aml_details_i' || this.subGroupId === 'aml_details_c' ? 'aml_details' : this.subGroupId;
      this.columns = this.formFields.filter(field => field.formSubGroupingCode === subGroupId)
        .map(field => ({
          field: field.fieldId,
          header: field.label['en'] || field.fieldId,
          visible: field.visible !== false,
        }));
      log.info('columns:', this.columns);
    }
  }

  /**
   * Creates a form with form controls for each field in the formFields array.
   * The form control is created with the fieldId as the key and a FormControl
   * instance as the value. The FormControl instance is created with the
   * validators specified in the field's validations array.
   */
  createForm() {
    if (!this.formFields) return;
    const formControls: any = {};
    log.info('formFields:', this.formFields);

    this.formFields.forEach(field => {
      let validators = [];

      if (field.mandatory) {
        validators.push(Validators.required);
      }

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
   * Saves the details.
   *
   * This method displays a success message indicating that the details have been saved.
   */
  saveDetails(): void {
    this.globalMessagingService.displaySuccessMessage('Success', 'Details saved successfully.');
  }

  /**
   * Edits the selected record.
   */
  editSelectedRecord() {
    this.openModal();
    this.globalMessagingService.displaySuccessMessage('Success', 'Modal opened successfully.');
  }

  /**
   * Deletes the selected record.
   */
  deleteSelectedRecord() {

  }
}
