import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import policyStepsData from '../../data/policy-steps.json';
import { PolicyService } from '../../services/policy.service';
import { ProductPolicyField, FormField } from '../../data/policy-dto';
import { Logger } from '../../../../../../shared/shared.module';

const log = new Logger('PolicyProductComponent');

import { NgxCurrencyConfig } from "ngx-currency";
import { BankService } from '../../../../../../shared/services/setups/bank/bank.service';
import { CurrencyDTO } from '../../../../../../shared/data/common/currency-dto';
import { ReceiptService } from '../../../../../fms/services/receipt.service';
import { mergeMap } from 'rxjs/operators';
import { LocalStorageService } from '../../../../../../shared/services/local-storage/local-storage.service';

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
  productPolicyCoinsuranceFields: ProductPolicyField[] = [];
  policyCoinsuranceFormFields: FormField[] = [];

  // Currency properties
  currencyDelimiter: any;
  defaultCurrencyName: string;
  defaultCurrencySymbol: string;
  defaultCurrency: CurrencyDTO;
  currency: CurrencyDTO[];
  organizationId: number;
  userOrgDetails: any; // Store full user organization details

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private bankService: BankService,
    private cdr: ChangeDetectorRef,
    private receiptService: ReceiptService,
    private localStorageService: LocalStorageService
  ) {
    this.policyDetailsForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.fieldOptions['currency'] = [];
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

    // Initialize currency from session storage first (will be updated by fetchCurrencies)
    this.initializeCurrency();
    this.fetchCurrencies();


    this.fetchUserOrgDetails();
    this.fetchProductPolicyFields();
    this.fetchProductPolicyOtherFields();
    // this.fetchExchangeRate();
    this.fetchProductPolicyCoinsuranceFields();
  }
  ngOnDestroy(): void { }
  ngAfterViewInit(): void { }

  /**
   * Initialize currency object from session storage
   */
  private initializeCurrency(): void {
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol') || '';
    log.debug('Currency Symbol:', currencySymbol);
    log.debug('Currency Delimiter:', currencyDelimiter);
    this.currencyObj = {
      prefix: currencySymbol ? currencySymbol + ' ' : '',
      allowNegative: false,
      allowZero: true,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter || ',',
      suffix: ' ',
      nullable: true,
      align: 'left',
    } as NgxCurrencyConfig;
  }

  /**
   * Fetch currencies from API and set default currency
   */
  fetchCurrencies(): void {
    this.bankService.getCurrencies()
      .subscribe({
        next: (currencies: any[]) => {
          // Process currencies
          this.currency = currencies.map((value) => {
            let capitalizedDescription = value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase();
            return { ...value, name: capitalizedDescription };
          });

          // Populate field options for currency
          this.fieldOptions['currency'] = this.currency.map(c => ({
            label: c.name,
            value: c.symbol
          }));

          log.info(this.currency, 'Currency list');

          const defaultCurrency = this.currency.find(currency => currency.currencyDefault === 'Y');
          if (defaultCurrency) {
            log.debug('DEFAULT CURRENCY', defaultCurrency);
            this.defaultCurrency = defaultCurrency;
            this.defaultCurrencyName = defaultCurrency.name;
            this.defaultCurrencySymbol = defaultCurrency.symbol;
            sessionStorage.setItem('currencySymbol', this.defaultCurrencySymbol);

            log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
            log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);

            // Re-initialize currency object with fetched values
            this.initializeCurrency();
            this.cdr.detectChanges();

            // Patch currency field if it exists
            if (this.policyDetailsForm.get('currency')) {
              this.policyDetailsForm.get('currency')?.setValue(this.defaultCurrencySymbol);
              // Fetch exchange rate for default currency
              this.fetchExchangeRate(this.defaultCurrencySymbol);
            }
          }
        },
        error: (error) => {
          log.error('Error fetching currencies', error);
        }
      });
  }

  /**
   * Fetch user organization details on-demand
   */
  fetchUserOrgDetails(): void {
    const currentUser = this.localStorageService.getItem('loginUserProfile');
    const userId = currentUser?.code;

    if (!userId) {
      log.warn('Unable to fetch user org details: No user code available');
      return;
    }

    log.debug('🔍 Fetching user organization details for userId:', userId);

    this.policyService.getUserOrgId(userId)
      .subscribe({
        next: (userDetails: any) => {
          this.userOrgDetails = userDetails;
          this.organizationId = userDetails?.organizationId;
          log.debug(this.userOrgDetails)

          this.cdr.detectChanges();
        },
        error: (error) => {
          log.error('❌ Error fetching user organization details:', error);
        }
      });
  }

  fetchProductPolicyFields(): void {
    this.policyService.getProductPolicyFields().subscribe({
      next: (data: ProductPolicyField[]) => {
        this.productPolicyFields = data || [];
        // Extract fields 
        if (this.productPolicyFields.length > 0 && this.productPolicyFields[0].fields) {
          this.policyFormFields = this.productPolicyFields[0].fields;
          this.prepareFieldOptions();//for select options
          this.buildDynamicFormControls();//for normal
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
          if (field.name !== 'currency') {
            this.fieldOptions[field.name] = [];
          }
        }
      }
    });
  }

  radioFields = ['jointAccount', 'openPolicy', 'policyLevelDebt', 'multiAgency', 'coInsurancePolicy', 'schemePolicy','coInsuranceLeader',
  'coInsuranceGrossSumInsured',
  'coInsuranceLeaderCombined',
  'facultativeSession'];


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

        if (field.type === 'number' && (defaultVal === '' || defaultVal === 0)) {
          defaultVal = null;
        }

        if ((!defaultVal || defaultVal === '') && (field.type === 'radio' || field.name === 'ncdStatus' || this.radioFields.includes(field.name))) {
          defaultVal = 'N';
        }

        // Default currency handling
        if (field.name === 'currency' && this.defaultCurrencySymbol) {
          defaultVal = this.defaultCurrencySymbol;
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

        if (field.type === 'number' && (defaultVal === '' || defaultVal === 0)) {
          defaultVal = null;
        }

        if ((!defaultVal || defaultVal === '') && (field.type === 'radio' || field.name === 'ncdStatus' || this.radioFields.includes(field.name))) {
          defaultVal = 'N';
        }

        // Default currency handling
        if (field.name === 'currency' && this.defaultCurrencySymbol) {
          defaultVal = this.defaultCurrencySymbol;
        }

        const control = new FormControl(defaultVal, validators);

        // Disable coverDays by default
        if (field.name === 'coverDays') {
          control.disable();
        }

        this.policyDetailsForm.addControl(field.name, control);

        // Special handling for coveragePeriod
        if (field.name === 'coveragePeriod') {
          if (!this.policyDetailsForm.get('coverFrom')) {
            this.policyDetailsForm.addControl('coverFrom', new FormControl(null, Validators.required));
          }
          if (!this.policyDetailsForm.get('coverTo')) {
            this.policyDetailsForm.addControl('coverTo', new FormControl(null, Validators.required));
          }
        }
      }
    });
  }

  minDate: Date;

  updateCoverFrom(): void {
    const from = this.policyDetailsForm.get('coverFrom')?.value;
    if (from) {
      const fromDate = this.parseDate(from);

      if (fromDate) {
        // Set minDate to the next day (coverFrom + 1 day)
        const nextDay = new Date(fromDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.minDate = nextDay;
      }

      // Reset coverTo if it's before the new minDate
      const to = this.policyDetailsForm.get('coverTo')?.value;
      if (to) {
        const toDate = this.parseDate(to);
        if (toDate && this.minDate && toDate < this.minDate) {
          this.policyDetailsForm.get('coverTo')?.setValue(null);
          this.policyDetailsForm.get('coverDays')?.setValue(null);
        } else {
          // Recalculate if valid dates exist
          this.calculateCoverDays();
        }
      }
    } else {
      this.minDate = null;
    }
  }

  calculateCoverDays(): void {
    const from = this.policyDetailsForm.get('coverFrom')?.value;
    const to = this.policyDetailsForm.get('coverTo')?.value;

    if (from && to) {
      // Parse dates in dd-MM-yyyy format
      const fromDate = this.parseDate(from);
      const toDate = this.parseDate(to);

      if (fromDate && toDate && !isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        const diffTime = toDate.getTime() - fromDate.getTime();
        // Calculate days difference (exclusive of start date for duration)
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        this.policyDetailsForm.get('coverDays')?.setValue(diffDays);
      }
    }
  }

  /**
   * Parse date string in dd-MM-yyyy format to Date object
   */
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Handle dd-MM-yyyy format
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }

    return new Date(dateStr);
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

    // If currency changes, fetch exchange rate
    if (fieldName === 'currency') {
      log.debug('Currency changed to:', value);
      this.fetchExchangeRate(value);
    }
  }

  /**
   * Fetch exchange rate for selected currency
   */
  fetchExchangeRate(currencySymbol: string): void {
    if (!currencySymbol || !this.organizationId) {
      log.debug('Cannot fetch exchange rate: missing currency symbol or organization ID');
      return;
    }

    // Find the currency object by symbol
    const selectedCurrency = this.currency?.find(c => c.symbol === currencySymbol);
    if (!selectedCurrency) {
      log.debug('Currency not found for symbol:', currencySymbol);
      return;
    }

    log.debug('Fetching exchange rate for currency:', selectedCurrency);

    this.receiptService.getExchangeRate(selectedCurrency.id, this.organizationId)
      .subscribe({
        next: (response: any) => {
          const exchangeRate = response?.data || response?.message;
          log.debug('Exchange rate fetched:', exchangeRate);

          // Patch the exchange rate to the form
          if (this.policyDetailsForm.get('exchangeRate')) {
            this.policyDetailsForm.get('exchangeRate')?.setValue(exchangeRate);
            log.debug('Exchange rate patched to form:', exchangeRate);
          }
        },
        error: (error) => {
          log.error('Error fetching exchange rate:', error);
        }
      });
  }

  fetchProductPolicyCoinsuranceFields(): void {
    this.policyService.getProductPolicyCoinsuranceFields().subscribe({
      next: (data: ProductPolicyField[]) => {
        this.productPolicyCoinsuranceFields = data || [];
        log.debug('Coinsurance Fields:', this.productPolicyCoinsuranceFields);
        
        
        if (this.productPolicyCoinsuranceFields.length > 0 && 
            this.productPolicyCoinsuranceFields[0].fields) {
          this.policyCoinsuranceFormFields = this.productPolicyCoinsuranceFields[0].fields;
          this.prepareCoinsuranceFieldOptions();
          this.buildDynamicCoinsuranceFormControls();
        }
      },
      error: (err) => {
        log.error('Failed to load coinsurance fields', err);
      }
    });
  }



   prepareCoinsuranceFieldOptions(): void {
    this.policyCoinsuranceFormFields.forEach(field => {
      if (field.type === 'select') {
        if (field.selectOptions && field.selectOptions.length > 0) {
          this.fieldOptions[field.name] = field.selectOptions.map(option => ({
            label: option.text || option.value,
            value: option.value
          }));
        } else if (field.options && field.options.length > 0) {
          this.fieldOptions[field.name] = field.options.map(option => ({
            label: option.description,
            value: option.code
          }));
        } else {
          this.fieldOptions[field.name] = [];
        }
      }
    });
  }


  buildDynamicCoinsuranceFormControls(): void {
    this.policyCoinsuranceFormFields.forEach(field => {
      if (field.name && !this.policyDetailsForm.get(field.name)) {
        const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
        if (field.regexPattern) {
          validators.push(Validators.pattern(field.regexPattern));
        }

        
        if (field.type === 'number') {
          if (field.min !== undefined) validators.push(Validators.min(field.min));
          if (field.max !== undefined) validators.push(Validators.max(field.max));
        }

        
        let defaultVal: any = field.defaultValue !== undefined && field.defaultValue !== null 
          ? field.defaultValue 
          : '';
      
       if (field.name === 'coInsuranceLeader' || field.name === 'facultativeSession') {
        defaultVal = 'Y'; 
       } 
    
      else if (field.type === 'radio' || this.radioFields.includes(field.name)) {
        defaultVal = '';
      }

        const control = new FormControl(defaultVal, validators);
        this.policyDetailsForm.addControl(field.name, control);
      }
    });
  }

  
  isCoinsuranceSectionVisible(): boolean {
    return this.policyDetailsForm.get('coInsurancePolicy')?.value === 'Y';
  }





}
