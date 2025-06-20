import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { MandatoryFieldsService } from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import { GlobalMessagingService } from "../../../../../shared/services/messaging/global-messaging.service";
import { Logger } from "../../../../../shared/services";
import { FormConfig, FormField, FormGroup as FormGroupConfig } from '../../../data/form-config';
import {SessionStorageService} from "../../../../../shared/services/session-storage/session-storage.service";

const log = new Logger("CreateEntityComponent");

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.css'],
})
export class CreateEntityComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  submitted = false;
  formConfig: FormConfig | null = null;
  currentLocale = 'en'; // Default locale, can be set based on user preferences

  private destroy$ = new Subject<void>();
  private collapsedGroups = new Set<string>();

  formData: any; // Accept JSON input
  formGroup!: FormGroup;
  formFields: any;
  pageSize: number;
  selectedContactPersonDetails: any;
  contactPersonDetailsData: any;
  columns = [];
  columnDialogVisible: boolean = false;
  groupFields: any;

  editMode: boolean = false;
  selectedContactPersonIndex: number | null = null;

  tableTitle: string = "Contact Person Details";
  addButtonText: string = "Add contact"
  emptyTableMessage: string = "No Contact Person Detail(s) Found.";


  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    // this.loadFormConfig();
    // this.formFields = this.formData?.fields || [];
    this.fetchFormFields();
    this.contactPersonDetailsData = this.sessionStorageService.getItem('contactPersonDetailsData') ? JSON.parse(this.sessionStorageService.getItem('contactPersonDetailsData')) : [];
    /*this.columns = [
      { field: 'title', header: 'Title', visible: true },
      { field: 'name', header: 'Full name', visible: true },
      { field: 'dicIDNumber', header: 'Doc ID number', visible: true },
      { field: 'phoneNumber', header: 'Phone number', visible: true },
      { field: 'email', header: 'Email address', visible: true },
      { field: 'wef', header: 'WEF', visible: true },
      { field: 'wet', header: 'WET', visible: true },
    ];*/

    /*
    * data = [
    { name: 'Alice', age: 25, email: 'alice@example.com', status: 'Active' },
    { name: 'Bob', age: 30, email: 'bob@example.com', status: 'Inactive' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com', status: 'Active' }
  ];*/

  }

  fetchFormFields() {
    this.mandatoryFieldsService.getFormConfig().subscribe({
      next: (data) => {
        this.formFields = data;
        log.info('fields json:', data);
        if (this.formFields) {
          this.createForm();
          this.columns = this.formFields?.fields.filter(field => field.subGroupId).map(field => ({
            field: field.fieldId,
            header: field.label['en'] || field.fieldId,
            visible: field.visible !== false
          }));
          log.info('columns:', this.columns);
        }
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error);
        log.error('Error loading fields.json:', err);
      }
    })
    this.cdr.detectChanges();
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
    });

    this.formGroup = this.fb.group(formControls);
  }

  submitForm() {
    if (this.formGroup.valid) {
      console.log('Form Data:', this.formGroup.value);
    } else {
      console.log('Form is invalid!');
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFormConfig(): void {
    this.loading = true;

    this.mandatoryFieldsService.getFormConfig()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (config) => {
          this.formConfig = config;
          this.buildForm();
        },
        error: (error) => {
          log.error('Failed to load form configuration', error);
          this.globalMessagingService.displayErrorMessage(
            this.translate.instant('ERRORS.FORM_LOAD_FAILED_TITLE'),
            this.translate.instant('ERRORS.FORM_LOAD_FAILED_MESSAGE')
          );
        }
      });
  }

  private buildForm(): void {
    if (!this.formConfig) return;

    const formGroup: { [key: string]: any } = {};

    // Create form controls for each field
    this.formConfig.fields
      .filter(field => field.visible !== false)
      .forEach(field => {
        const validators = this.getFieldValidators(field);
        formGroup[field.fieldId] = [
          { value: field.defaultValue || null, disabled: field.disabled },
          validators
        ];
      });

    this.form = this.fb.group(formGroup);
  }

  private getFieldValidators(field: FormField) {
    const validators = [];

    if (field.validations) {
      field.validations.forEach(validation => {
        switch (validation.type) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'minLength':
            validators.push(Validators.minLength(validation.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validation.value));
            break;
          case 'min':
            validators.push(Validators.min(validation.value));
            break;
          case 'max':
            validators.push(Validators.max(validation.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validation.value));
            break;
          case 'email':
            validators.push(Validators.email);
            break;
        }
      });
    }

    return validators;
  }

  getFieldError(fieldId: string): string {
    const control = this.form.get(fieldId);
    if (!control || !control.errors || (this.submitted && !control.touched)) return '';

    const field = this.formConfig?.fields?.find(f => f.fieldId === fieldId);
    if (!field) return '';

    // Get the first error
    const errorKey = Object.keys(control.errors)[0];
    const validation = field.validations?.find(v => v.type === errorKey);

    if (validation?.message) {
      if (typeof validation.message === 'string') {
        return validation.message;
      } else if (typeof validation.message === 'object') {
        return validation.message[this.currentLocale] || validation.message['en'] || 'Invalid field';
      }
    }

    // Default error messages
    const errorMessages: {[key: string]: string} = {
      'required': 'This field is required',
      'email': 'Please enter a valid email address',
      'minlength': `Minimum length is ${control.errors?.['minlength']?.requiredLength} characters`,
      'maxlength': `Maximum length is ${control.errors?.['maxlength']?.requiredLength} characters`,
      'min': `Minimum value is ${control.errors?.['min']?.min}`,
      'max': `Maximum value is ${control.errors?.['max']?.max}`,
      'pattern': 'Invalid format',
      'default': 'Invalid field'
    };

    return errorMessages[errorKey] || errorMessages['default'];
  }

  getFieldsForGroup(groupId?: string): FormField[] {
   /* if (!this.formConfig) return [];

    return this.formConfig.fields.filter(field => {
      if (field.visible === false) return false;
      if (!groupId) return !field.groupId;
      return field.groupId === groupId;
    });*/

    if (!this.formFields) return [];

    return this.groupFields = this.formFields.fields.filter(field => {
      if (field.visible === false) return false;
      if (!groupId) return !field.groupId;
      return field.groupId === groupId;
    });
  }

  getSubSectionsForGroup(groupId?: string): FormField[] {
    if (!this.formFields) return [];

    return this.formFields.formGroups.filter(field => {
      // if (field.visible === false) return false;
      // if (!groupId) return !field.groupId;
      log.info('field.subsections', field);
      return field.formGroups === groupId;
    });
  }

  getGroupLabel(group: FormGroupConfig): string {
    if (!group) return '';

    if (typeof group.labels === 'object') {
      return group.labels[this.currentLocale] || group.labels['en'] || group.description;
    }

    return group.groupId;
  }

  getFieldClass(field: FormField): string {
    return field.className;
  }

  toggleGroup(groupId: string): void {
    if (this.collapsedGroups.has(groupId)) {
      this.collapsedGroups.delete(groupId);
    } else {
      this.collapsedGroups.add(groupId);
    }
  }

  isGroupCollapsed(groupId: string): boolean {
    return this.collapsedGroups.has(groupId);
  }

  getFieldValue(fieldId: string): any {
    const control = this.form.get(fieldId);
    return control ? control.value : null;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    // Form is valid, handle submission
    console.log('Form submitted', this.form.value);
    // TODO: Implement form submission logic
  }

  onReset(): void {
    if (confirm(this.translate.instant('FORM.CONFIRM_RESET'))) {
      this.form.reset();
      this.submitted = false;
    }
  }

  onCancel(): void {
    if (this.form.pristine || confirm(this.translate.instant('FORM.CONFIRM_CANCEL'))) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  trackByFieldId(index: number, field: FormField): string {
    return field.fieldId;
  }

  trackByGroupId(index: number, group: FormGroupConfig): string {
    return group.groupId;
  }

  openModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.editMode = false;
    const modal = document.getElementById('detailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveDetails() {
    const formValue = this.formGroup.getRawValue();
    // log.info('formValue', formValue);
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
    if (!Array.isArray(this.contactPersonDetailsData)) {
      this.contactPersonDetailsData = [];
    }

    if (this.editMode && this.selectedContactPersonIndex !== null) {
      this.contactPersonDetailsData[this.selectedContactPersonIndex] = savedFields;
    } else {
      this.contactPersonDetailsData.push(savedFields);
    }

    this.sessionStorageService.setItem(
      'contactPersonDetailsData',
      JSON.stringify(this.contactPersonDetailsData)
    );
    return savedFields;
  }

  editContactPersonDetail(rowData: any) {
    log.info("edit", rowData);
    this.editMode = !this.editMode;
    this.selectedContactPersonDetails = rowData;
    this.selectedContactPersonIndex = this.contactPersonDetailsData.findIndex(
      (item: any) => item === rowData
    );
    if (this.selectedContactPersonDetails) {
      this.openModal();
      const patchValues: { [key: string]: any } = {};
      if (this.groupFields) {
        this.groupFields.forEach((field: any) => {
          if (rowData[field.fieldId] !== undefined) {
            patchValues[field.fieldId] = rowData[field.fieldId];
          }
        });
        this.formGroup.patchValue(patchValues);
      }
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        this.translate.instant('entities.noContactPersonDetailsSelected')
      );
    }
  }

  deleteContactPersonDetail(rowData: any) {
    const index = this.contactPersonDetailsData.findIndex((item: any) => item === rowData);
    if (index !== -1) {
      this.contactPersonDetailsData.splice(index, 1);
      this.sessionStorageService.setItem('contactPersonDetailsData', JSON.stringify(this.contactPersonDetailsData));
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        this.translate.instant('entities.noContactPersonDetailsSelected')
      );
    }
  }
}
