import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import policyStepsData from '../../data/policy-steps.json';
import { PolicyService } from '../../services/policy.service';
import { ProductPolicyField, FormField } from '../../data/policy-dto';
import { Logger } from '../../../../../../shared/shared.module';

const log = new Logger('PolicyProductComponent');

import { NgxCurrencyConfig } from "ngx-currency";

@Component({
  selector: 'app-policy-product',
  templateUrl: './policy-product.component.html',
  styleUrls: ['./policy-product.component.css']
})
export class PolicyProductComponent implements OnInit, OnDestroy {

  steps = policyStepsData;

  productPolicyFields: ProductPolicyField[] = [];
  productPolicyOtherFields: ProductPolicyField[] = [];
  policyFormFields: FormField[] = [];
  policyOtherFormFields: FormField[] = [];
  policyDetailsForm: FormGroup;
  selectedClientType: 'new' | 'existing' = 'existing';
  fieldOptions: { [key: string]: any[] } = {};
  dateFormat: string = 'dd-MM-yyyy'; // Default format
  primeNgDateFormat: string = 'dd-mm-yy'; // PrimeNG format
  public currencyObj: NgxCurrencyConfig;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder
  ) {
    this.policyDetailsForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Load date format from session storage
    const storedDateFormat = sessionStorage.getItem('dateFormat');
    if (storedDateFormat) {
      this.dateFormat = storedDateFormat;
      log.debug("Loaded date format from session storage:", this.dateFormat);
    } else {
      log.debug("Using default date format:", this.dateFormat);
    }

    // Convert dateFormat to PrimeNG format
    this.primeNgDateFormat = this.dateFormat
      .replace('yyyy', 'yy')
      .replace('MM', 'mm');

    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol')
    log.debug("currency Object:", currencySymbol)
    log.debug("currency Delimeter:", currencyDelimiter)
    this.currencyObj = {
      prefix: '',
      allowNegative: false,
      allowZero: true,
      decimal: '.',
      precision: 2,
      thousands: currencyDelimiter || ',',
      suffix: '',
      nullable: false,
      align: 'left',
    };

    this.fetchProductPolicyFields();
    this.fetchProductPolicyOtherFields();
  }
  ngOnDestroy(): void { }
  ngAfterViewInit(): void { }


  fetchProductPolicyFields(): void {
    this.policyService.getProductPolicyFields().subscribe({
      next: (data: ProductPolicyField[]) => {
        this.productPolicyFields = data || [];
        // Extract fields 
        if (this.productPolicyFields.length > 0 && this.productPolicyFields[0].fields) {
          this.policyFormFields = this.productPolicyFields[0].fields;
          this.prepareFieldOptions();
          this.buildDynamicFormControls();
        }
      },
      error: (err) => {
        console.error('Failed to load product policy fields', err);
      }
    });
  }

  fetchProductPolicyOtherFields(): void {
    this.policyService.getProductPolicyOtherFields().subscribe({
      next: (data: ProductPolicyField[]) => {
        this.productPolicyOtherFields = data || [];
        log.debug('Product Policy Other Fields:', this.productPolicyOtherFields);
        // Extract fields 
        if (this.productPolicyOtherFields.length > 0 && this.productPolicyOtherFields[0].fields) {
          this.policyOtherFormFields = this.productPolicyOtherFields[0].fields;
          this.prepareOtherFieldOptions();
          this.buildDynamicOtherFormControls();
        }
      },
      error: (err) => {
        console.error('Failed to load product policy other fields', err);
      }
    });
  }

  prepareFieldOptions(): void {
    this.policyFormFields.forEach(field => {
      if (field.type === 'select') {
        if (field.selectOptions && field.selectOptions.length > 0) {
          this.fieldOptions[field.name] = field.selectOptions.map(opt => ({
            label: opt.text || opt.value,
            value: opt.value
          }));
        } else if (field.options && field.options.length > 0) {
          this.fieldOptions[field.name] = field.options.map(opt => ({
            label: opt.description,
            value: opt.code
          }));
        } else {
          this.fieldOptions[field.name] = [];
        }
      }
    });
  }

  prepareOtherFieldOptions(): void {
    this.policyOtherFormFields.forEach(field => {
      if (field.type === 'select') {
        if (field.selectOptions && field.selectOptions.length > 0) {
          this.fieldOptions[field.name] = field.selectOptions.map(opt => ({
            label: opt.text || opt.value,
            value: opt.value
          }));
        } else if (field.options && field.options.length > 0) {
          this.fieldOptions[field.name] = field.options.map(opt => ({
            label: opt.description,
            value: opt.code
          }));
        } else {
          this.fieldOptions[field.name] = [];
        }
      }
    });
  }

  radioFields = ['jointAccount', 'openPolicy', 'policyLevelDebt', 'multiAgency', 'coInsurancePolicy', 'schemePolicy'];

  /**
   * Build dynamic product policy form controls
   */
  buildDynamicFormControls(): void {
    this.policyFormFields.forEach(field => {
      if (field.name && !this.policyDetailsForm.get(field.name)) {
        const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
        if (field.regexPattern) {
          validators.push(Validators.pattern(field.regexPattern));
        }

        // Add min/max validators for number fields
        if (field.type === 'number') {
          if (field.min !== undefined) validators.push(Validators.min(field.min));
          if (field.max !== undefined) validators.push(Validators.max(field.max));
        }

        // default value handling: for radio yes/no fields default to 'N' (no)
        let defaultVal: any = field.defaultValue !== undefined && field.defaultValue !== null ? field.defaultValue : '';
        if ((!defaultVal || defaultVal === '') && (field.type === 'radio' || field.name === 'ncdStatus' || this.radioFields.includes(field.name))) {
          defaultVal = 'N';
        }

        // Log source field initialization
        if (field.name === 'source') {
          console.log('🏗️ Building source field with default value:', defaultVal);
          console.log('📝 source field config:', field);
          console.log('🎯 source options:', this.fieldOptions['source']);
        }

        const control = new FormControl(defaultVal, validators);
        this.policyDetailsForm.addControl(field.name, control);
      }
    });
  }

  /**
   * Build dynamic product policy other form controls
   */
  buildDynamicOtherFormControls(): void {
    this.policyOtherFormFields.forEach(field => {
      if (field.name && !this.policyDetailsForm.get(field.name)) {
        const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
        if (field.regexPattern) {
          validators.push(Validators.pattern(field.regexPattern));
        }

        // Add min/max validators for number fields
        if (field.type === 'number') {
          if (field.min !== undefined) validators.push(Validators.min(field.min));
          if (field.max !== undefined) validators.push(Validators.max(field.max));
        }

        // default value handling: for radio yes/no fields default to 'N' (no)
        let defaultVal: any = field.defaultValue !== undefined && field.defaultValue !== null ? field.defaultValue : '';
        if ((!defaultVal || defaultVal === '') && (field.type === 'radio' || field.name === 'ncdStatus' || this.radioFields.includes(field.name))) {
          defaultVal = 'N';
        }

        const control = new FormControl(defaultVal, validators);
        this.policyDetailsForm.addControl(field.name, control);
      }
    });
  }

  /**
   * Get select options for a field
   */
  getSelectOptions(field: FormField): { label: string; value: any }[] {
    return this.fieldOptions[field.name] || [];
  }

  /**
   * Check if a field should be visible based on dependencies
   */
  isFieldVisible(field: FormField): boolean {
    if (field.name === 'agent') {
      const policyTypeValue = this.policyDetailsForm.get('policyType')?.value;
      return policyTypeValue === 'IB';
    }
    if (field.name === 'jointAccountHolder') {
      const jointAccountValue = this.policyDetailsForm.get('jointAccount')?.value;
      return jointAccountValue === 'Y';
    }
    return true;
  }

  /**
   * Handle field change events for dependent fields
   */
  onFieldChange(fieldName: string, event: any): void {
    const value = event?.value || event?.target?.value || event;

    // Log source field changes
    if (fieldName === 'source') {
      console.log('🔍 Source Field Changed:', value);
      console.log('📋 Full event object:', event);
      const sourceVal = typeof value === 'string' ? value.toLowerCase() : '';

    }

    // If source changes, auto-set policyType
    if (fieldName === 'source') {
      const sourceVal = typeof value === 'string' ? value.toLowerCase() : '';
      if (sourceVal === 'walk in' || sourceVal === 'walkin' || sourceVal === 'walk-in') {
        console.log('✅ Matched walk-in pattern, setting policyType to DB');
        this.policyDetailsForm.get('policyType')?.setValue('DB');
      } else if (sourceVal === 'agent') {
        console.log('✅ Matched agent pattern, setting policyType to IB');
        this.policyDetailsForm.get('policyType')?.setValue('IB');
      } else {
        console.log('⚠️ No match found for source value:', sourceVal);
      }
    }
  }

}
