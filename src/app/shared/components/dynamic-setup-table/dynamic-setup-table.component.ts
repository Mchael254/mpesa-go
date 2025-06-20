import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Logger} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {SessionStorageService} from "../../services/session-storage/session-storage.service";
import {ReusableInputComponent} from "../reusable-input/reusable-input.component";

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
  formGroup!: FormGroup;
  groupFields: any;

  columns = [];
  columnDialogVisible: boolean = false;

  @ViewChild('recordDeleteConfirmationModal')
  recordDeleteConfirmationModal!: ReusableInputComponent;

  // to remove this since we are using the working form setups
  submitted = false;

  @Input() tableTitle: string;
  @Input() addButtonText: string;
  @Input() emptyTableMessage: string;
  @Input() formFields: any;
  @Input() subGroupId: string;

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private sessionStorageService: SessionStorageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.filterFormFields();
    this.tableData = this.sessionStorageService.getItem('contactPersonDetailsData') ? JSON.parse(this.sessionStorageService.getItem('contactPersonDetailsData')) : [];
  }

  filterFormFields() {
    log.info('field:', this.formFields);
    if (this.formFields) {
      this.columns = this.formFields?.fields.filter(field => field.subGroupId === this.subGroupId)
        .map(field => ({
          field: field.fieldId,
          header: field.label['en'] || field.fieldId,
          visible: field.visible !== false
      }));
      log.info('columns:', this.columns);
      this.createForm();
    }
  }

  createForm() {
    if (!this.formFields) return;
    const formControls: any = {};

    this.formFields.fields.forEach(field => {
      let validators = [];

      if (field.validations) {
        field.validations.forEach(validation => {
          if (validation.type === 'required') {
            validators.push(Validators.required);
          }
        });
      }

      formControls[field.fieldId] = [field.defaultValue || '', validators];

      this.groupFields = this.formFields?.fields.filter(field => field.subGroupId === this.subGroupId);

    });

    this.formGroup = this.fb.group(formControls);
    log.info('controls:', formControls, this.formGroup, this.groupFields);
    this.cdr.detectChanges();
  }

  openModal() {
    const modal = document.getElementById('dynamicDetailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.editMode = false;
    const modal = document.getElementById('dynamicDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveDetails() {
    const formValue = this.formGroup.getRawValue();

    const filtered = Object.fromEntries(
      Object.entries(formValue).filter(([_, value]) => value != null && value !== '')
    );
    log.info("filtered form with values", filtered, this.groupFields);

    const savedFields: { [key: string]: any } = {};

    if (this.groupFields) {
      this.groupFields.forEach(field => {
        if (filtered[field.fieldId] !== undefined) {
          field.value = filtered[field.fieldId];
          savedFields[field.fieldId] = field.value;
          const fieldValue = field.value;
          log.info(`Field ${field.fieldId} value updated to:`, fieldValue);
        }
      });
    }

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

    this.sessionStorageService.setItem(
      'contactPersonDetailsData',
      JSON.stringify(this.tableData)
    );
    return savedFields;
  }

  editSelectedRecord() {
    this.editMode = !this.editMode;
    this.selectedTableRecordIndex = this.tableData.findIndex(
      (item: any) => item == this.selectedTableRecordDetails
    );
    if (this.selectedTableRecordDetails) {
      this.openModal();
      const patchValues: { [key: string]: any } = {};
      if (this.groupFields) {
        this.groupFields.forEach((field: any) => {
          if (this.selectedTableRecordDetails[field.fieldId] !== undefined) {
            patchValues[field.fieldId] = this.selectedTableRecordDetails[field.fieldId];
          }
        });
        this.formGroup.patchValue(patchValues);
      }
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No record is selected'
      );
    }
  }

  deleteSelectedRecord() {
    this.recordDeleteConfirmationModal.show();
  }

  confirmRecordDelete() {
    const index = this.tableData.findIndex((item: any) => item === this.selectedTableRecordDetails);
    if (index !== -1) {
      this.tableData.splice(index, 1);
      this.sessionStorageService.setItem('contactPersonDetailsData', JSON.stringify(this.tableData));
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No record is selected'
      );
    }
  }
}
