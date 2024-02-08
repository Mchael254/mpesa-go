import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Table } from 'primeng/table';
import { CurrencyService } from '../../../../shared/services/setups/currency/currency.service';
import {
  CurrencyDenominationDTO,
  CurrencyRateDTO,
} from '../../../../shared/data/common/currency-dto';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { DatePipe } from '@angular/common';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { UtilService } from '../../../../shared/services/util/util.service';

const log = new Logger('CurrenciesComponent');

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css'],
})
export class CurrenciesComponent implements OnInit {
  @ViewChild('currencyTable') currencyTable: Table;
  @ViewChild('currencyRateTable') currencyRateTable: Table;
  @ViewChild('currencyDenominationTable') currencyDenominationTable: Table;
  @ViewChild('currencyConfirmationModal')
  currencyConfirmationModal!: ReusableInputComponent;
  @ViewChild('currencyRateConfirmationModal')
  currencyRateConfirmationModal!: ReusableInputComponent;
  @ViewChild('currencyDenominationConfirmationModal')
  currencyDenominationConfirmationModal!: ReusableInputComponent;

  public createCurrencyForm: FormGroup;
  public createDenominationForm: FormGroup;
  public createCurrencyRateForm: FormGroup;

  public currenciesData: CurrencyDTO[];
  public currencyRatesData: CurrencyRateDTO[];
  public currencyDenominationData: CurrencyDenominationDTO[];
  public selectedCurrency: CurrencyDTO;
  public selectedCurrencyRate: CurrencyRateDTO;
  public selectedCurrencyDenomination: CurrencyDenominationDTO;

  public groupId: string = 'currencyTab';
  public cgroupId: string = 'currencyExTab';
  public dgroupId: string = 'denominationTab';
  public response: any;
  public submitted = false;
  public visibleStatus: any = {};
  public errorOccurred = false;
  public errorMessage: string = '';

  currencyBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard/crm',
    },
    {
      label: 'Org Parameters',
      url: 'home/crm/country',
    },
    {
      label: 'Currencies',
      url: 'home/crm/currencies',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private bankService: BankService,
    private currencyService: CurrencyService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private utilService: UtilService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currencyCreateForm();
    this.denominationCreateForm();
    this.currencyExchangeForm();
    this.fetchCurrencies();
  }

  ngOnDestroy(): void {}

  /**
   * The function formatDate takes a dateString as input and returns a formatted date string in the
   * format 'dd-MM-yyyy'.
   * @param {string} dateString - A string representing a date in any valid format.
   * @returns a formatted date string in the format 'dd-MM-yyyy'. If the input dateString is not a
   * valid date, an empty string is returned.
   */
  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd-MM-yyyy') || '';
  }

  /**
   * The function updates the value of a form control by adding a specified change value, ensuring the
   * new value is not less than zero.
   * @param {number} change - The change parameter is a number that represents the amount by which the
   * value should be changed. It can be positive or negative.
   * @param {FormGroup} form - The "form" parameter is a FormGroup object, which represents a group of
   * FormControl objects. It is used to manage the form controls and their values.
   * @param {string} formControlName - The `formControlName` parameter is the name of the form control
   * in the `form` FormGroup that you want to update.
   */
  updateRound(change: number, form: FormGroup, formControlName: string) {
    const newValue = Math.max(form.get(formControlName).value + change, 0);
    form.get(formControlName).setValue(newValue);
  }

  currencyCreateForm() {
    this.createCurrencyForm = this.fb.group({
      symbol: [''],
      description: [''],
      round: [''],
      numberRound: [''],
      decimalRound: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createCurrencyForm.controls[key].setValidators(
              Validators.required
            );
            this.createCurrencyForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }

  get f() {
    return this.createCurrencyForm.controls;
  }

  denominationCreateForm() {
    this.createDenominationForm = this.fb.group({
      value: [''],
      name: [''],
      wef: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.dgroupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createDenominationForm.controls[key].setValidators(
              Validators.required
            );
            this.createDenominationForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }

  get d() {
    return this.createDenominationForm.controls;
  }

  currencyExchangeForm() {
    this.createCurrencyRateForm = this.fb.group({
      exchangeCurrency: [''],
      rate: [''],
      date: [''],
      wef: [''],
      wet: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.cgroupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createCurrencyRateForm.controls[key].setValidators(
              Validators.required
            );
            this.createCurrencyRateForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }
  get c() {
    return this.createCurrencyRateForm.controls;
  }

  /**
   * The function fetches currency data from a bank service and logs the data.
   */
  fetchCurrencies() {
    this.bankService
      .getCurrencies()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currenciesData = data;
        log.info('Currencies Data', this.currenciesData);
      });
  }

  /**
   * The function fetches currency rates based on a given base currency ID and optional organization
   * ID.
   * @param {number} baseCurrencyId - The base currency ID is the ID of the currency that you want to
   * get the exchange rates for. It is the currency against which all other currencies will be
   * compared.
   * @param {number} [organizationId] - The organizationId parameter is an optional parameter that
   * represents the ID of the organization for which the currency rates are being fetched. If no
   * organizationId is provided, the currency rates will be fetched for all organizations.
   */
  fetchCurrencyRate(baseCurrencyId: number, organizationId?: number) {
    this.currencyService
      .getCurrenciesRate(baseCurrencyId, organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currencyRatesData = data;
        log.info('Currencies Rate Data', this.currencyRatesData);
      });
  }

  /**
   * The function fetches the currency denomination data for a given currency ID and logs the result.
   * @param {number} currencyId - The currencyId parameter is a number that represents the unique
   * identifier of a currency.
   */
  fetchCurrencyDenomination(currencyId: number) {
    this.currencyService
      .getCurrenciesDenomination(currencyId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currencyDenominationData = data;
        log.info('Currencies Denomination Data', this.currencyDenominationData);
      });
  }

  /**
   * The function opens a currency modal by adding a 'show' class and setting the display property to
   * 'block'.
   */
  openCurrencyModal() {
    const modal = document.getElementById('currencyModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeCurrencyModal" hides and removes the "currencyModal" element from the DOM.
   */
  closeCurrencyModal() {
    const modal = document.getElementById('currencyModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function opens a modal by adding a 'show' class and setting the display property to 'block'.
   */
  openDenominationModal() {
    const modal = document.getElementById('denominationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeDenominationModal" hides and removes the "denominationModal" element from the
   * DOM.
   */
  closeDenominationModal() {
    const modal = document.getElementById('denominationModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function opens a currency exchange modal by adding a 'show' class and setting the display
   * property to 'block'.
   */
  openCurrencyExchangeModal() {
    const modal = document.getElementById('currencyRateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeCurrencyExchangeModal" hides and removes the "currencyRateModal" element from
   * the DOM.
   */
  closeCurrencyExchangeModal() {
    const modal = document.getElementById('currencyRateModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function filters the currencies in a currency table based on a user input value.
   * @param {Event} event - The event parameter is an object that represents the event that triggered
   * the function. It is typically passed in when an event listener is set up, and contains information
   * about the event such as the target element that triggered the event.
   */
  filterCurrencies(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currencyTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function filters the exchange currency table based on the input value.
   * @param {Event} event - The event parameter is an object that represents the event that triggered
   * the function. It could be an input event, such as typing in a text box, or a button click event,
   * for example.
   */
  filterExchangeCurrency(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currencyRateTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function filters a currency denomination table based on a user input value.
   * @param {Event} event - The event parameter is an object that represents an event that has
   * occurred, such as a button click or a key press. It contains information about the event, such as
   * the target element that triggered the event.
   */
  filterCurrencyDenomination(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currencyDenominationTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function selects a currency, fetches its rate and denomination.
   * @param {CurrencyDTO} currency - The parameter `currency` is of type `CurrencyDTO`, which is likely
   * a data transfer object representing a currency.
   */
  onCurrencyRowSelect(currency: CurrencyDTO) {
    this.selectedCurrency = currency;
    this.fetchCurrencyRate(this.selectedCurrency.id);
    this.fetchCurrencyDenomination(this.selectedCurrency.id);
  }

  /**
   * The function assigns the selected currency rate to a variable.
   * @param {CurrencyRateDTO} exchange - The parameter "exchange" is of type "CurrencyRateDTO".
   */
  onCurrencyRateRowSelect(exchange: CurrencyRateDTO) {
    this.selectedCurrencyRate = exchange;
  }

  /**
   * The function "onCurrencyDenominationRowSelect" assigns the selected currency denomination to the
   * "selectedCurrencyDenomination" variable.
   * @param {CurrencyDenominationDTO} deno - The parameter "deno" is of type CurrencyDenominationDTO.
   */
  onCurrencyDenominationRowSelect(deno: CurrencyDenominationDTO) {
    this.selectedCurrencyDenomination = deno;
  }

  /**
   * The `saveCurrency()` function is responsible for saving a currency by either creating a new
   * currency or updating an existing one.
   * @returns nothing (undefined) if the form is invalid. If the form is valid, it closes the currency
   * modal and either creates a new currency or updates an existing currency.
   */
  saveCurrency() {
    this.submitted = true;
    this.createCurrencyForm.markAllAsTouched();

    if (this.createCurrencyForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl:
        | HTMLInputElement
        | HTMLSelectElement
        | null = null;

      for (const control of invalidControls) {
        if (!control.value) {
          firstInvalidUnfilledControl = control;
          break;
        }
      }

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      } else {
        const firstInvalidControl = invalidControls[0];
        if (firstInvalidControl) {
          firstInvalidControl.focus();
          const scrollContainer =
            this.utilService.findScrollContainer(firstInvalidControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidControl.offsetTop;
          }
        }
      }
      return;
    }
    this.closeCurrencyModal();
    if (!this.selectedCurrency) {
      const currencyFormValues = this.createCurrencyForm.getRawValue();
      const roundValue = parseInt(currencyFormValues.round, 10) || 0;

      const saveCurrency: CurrencyDTO = {
        decimalWord: currencyFormValues.decimalRound,
        id: null,
        name: currencyFormValues.description,
        numberWord: currencyFormValues.numberRound,
        roundingOff: roundValue,
        symbol: currencyFormValues.symbol,
      };
      log.info('Currency Data', saveCurrency);
      // Create a new currency
      this.currencyService.createCurrency(saveCurrency).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Created a Currency'
        );
        this.fetchCurrencies();
        this.createCurrencyForm.reset();
      });
    } else {
      const currencyFormValues = this.createCurrencyForm.getRawValue();
      const roundValue = parseInt(currencyFormValues.round, 10) || 0;
      const currencyId = this.selectedCurrency.id;

      const saveCurrency: CurrencyDTO = {
        decimalWord: currencyFormValues.decimalRound,
        id: currencyId,
        name: currencyFormValues.description,
        numberWord: currencyFormValues.numberRound,
        roundingOff: roundValue,
        symbol: currencyFormValues.symbol,
      };
      log.info('Currency Data', saveCurrency);
      //Update a currency
      this.currencyService
        .updateCurrency(currencyId, saveCurrency)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Currency'
          );
          this.fetchCurrencies();
          this.createCurrencyForm.reset();
        });
    }
  }

  /**
   * The function `editCurrency()` opens a currency modal and populates it with the details of the
   * selected currency, or displays an error message if no currency is selected.
   */
  editCurrency() {
    if (this.selectedCurrency) {
      this.openCurrencyModal();
      this.createCurrencyForm.patchValue({
        decimalRound: this.selectedCurrency.decimalWord,
        description: this.selectedCurrency.name,
        numberRound: this.selectedCurrency.numberWord,
        round: this.selectedCurrency.roundingOff,
        symbol: this.selectedCurrency.symbol,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Currency is Selected!'
      );
    }
  }

  /**
   * The function "deleteCurrency" displays a confirmation modal.
   */
  deleteCurrency() {
    this.currencyConfirmationModal.show();
  }

  /**
   * The function `confirmCurrencyDelete()` checks if a currency is selected, and if so, deletes it and
   * displays a success message, otherwise it displays an error message.
   */
  confirmCurrencyDelete() {
    if (this.selectedCurrency) {
      const currencyId = this.selectedCurrency.id;
      this.currencyService.deleteCurrency(currencyId).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully deleted a Currency'
        );
        this.selectedCurrency = null;
        this.fetchCurrencies();
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Currency is selected.'
      );
    }
  }

  /**
   * The `saveCurrencyExchange` function is used to save a currency exchange rate, either by creating a
   * new rate or updating an existing one.
   * @returns nothing (undefined) if the form is invalid. If the form is valid, it performs some actions
   * and then returns nothing.
   */
  saveCurrencyExchange() {
    this.submitted = true;
    this.createCurrencyRateForm.markAllAsTouched();

    if (this.createCurrencyRateForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl:
        | HTMLInputElement
        | HTMLSelectElement
        | null = null;

      for (const control of invalidControls) {
        if (!control.value) {
          firstInvalidUnfilledControl = control;
          break;
        }
      }

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      } else {
        const firstInvalidControl = invalidControls[0];
        if (firstInvalidControl) {
          firstInvalidControl.focus();
          const scrollContainer =
            this.utilService.findScrollContainer(firstInvalidControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidControl.offsetTop;
          }
        }
      }
      return;
    }
    this.closeCurrencyExchangeModal();
    if (!this.selectedCurrencyRate) {
      const currencyRateFormValues = this.createCurrencyRateForm.getRawValue();
      const baseCurrencyId = this.selectedCurrency.id;
      const saveCurrencyRate: CurrencyRateDTO = {
        baseCurrencyId: baseCurrencyId,
        date: currencyRateFormValues.date,
        id: null,
        organizationId: null,
        rate: currencyRateFormValues.rate,
        targetCurrencyId: currencyRateFormValues.exchange,
        withEffectFromDate: currencyRateFormValues.wef,
        withEffectToDate: currencyRateFormValues.wet,
      };
      this.currencyService
        .createCurrencyRate(saveCurrencyRate)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Created a Currency Rate'
          );
          this.fetchCurrencyRate(this.selectedCurrency.id);
          this.createCurrencyRateForm.reset();
        });
    } else {
      const currencyRateFormValues = this.createCurrencyRateForm.getRawValue();
      const currencyRateId = this.selectedCurrencyRate.id;
      const saveCurrencyRate: CurrencyRateDTO = {
        baseCurrencyId: this.selectedCurrencyRate.baseCurrencyId,
        date: currencyRateFormValues.date,
        id: currencyRateId,
        organizationId: this.selectedCurrencyRate.organizationId,
        rate: currencyRateFormValues.rate,
        targetCurrencyId: currencyRateFormValues.exchange,
        withEffectFromDate: currencyRateFormValues.wef,
        withEffectToDate: currencyRateFormValues.wet,
      };
      this.currencyService
        .updateCurrencyRate(currencyRateId, saveCurrencyRate)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Currency Rate'
          );
          this.fetchCurrencyRate(this.selectedCurrency.id);
          this.createCurrencyRateForm.reset();
        });
    }
  }

  /**
   * The function "editCurrencyRate" opens a modal and populates it with the selected currency rate's
   * details for editing.
   */
  editCurrencyRate() {
    if (this.selectedCurrencyRate) {
      this.openCurrencyExchangeModal();
      this.createCurrencyRateForm.patchValue({
        exchangeCurrency: this.selectedCurrencyRate.targetCurrencyId,
        rate: this.selectedCurrencyRate.rate,
        date: this.selectedCurrencyRate.date,
        wef: this.selectedCurrencyRate.withEffectFromDate,
        wet: this.selectedCurrencyRate.withEffectToDate,
      });
    }
  }

  /**
   * The function "deleteCurrencyRate" displays a confirmation modal.
   */
  deleteCurrencyRate() {
    this.currencyRateConfirmationModal.show();
  }

  /**
   * The function `confirmCurrencyRateDelete()` deletes a selected currency rate and displays a success
   * message if the deletion is successful, or an error message if no currency rate is selected.
   */
  confirmCurrencyRateDelete() {
    if (this.selectedCurrencyRate) {
      const currencyRateId = this.selectedCurrencyRate.id;
      this.currencyService
        .deleteCurrencyRate(currencyRateId)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a Currency Rate'
          );
          this.fetchCurrencyRate(this.selectedCurrency.id);
          this.selectedCurrency = null;
          this.selectedCurrencyRate = null;
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Currency Rate is selected.'
      );
    }
  }

  /**
   * The `saveDenomination` function is used to save a currency denomination, either by creating a new
   * one or updating an existing one.
   * @returns The function does not explicitly return a value.
   */
  saveDenomination() {
    this.submitted = true;
    this.createDenominationForm.markAllAsTouched();

    if (this.createDenominationForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl:
        | HTMLInputElement
        | HTMLSelectElement
        | null = null;

      for (const control of invalidControls) {
        if (!control.value) {
          firstInvalidUnfilledControl = control;
          break;
        }
      }

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      } else {
        const firstInvalidControl = invalidControls[0];
        if (firstInvalidControl) {
          firstInvalidControl.focus();
          const scrollContainer =
            this.utilService.findScrollContainer(firstInvalidControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidControl.offsetTop;
          }
        }
      }
      return;
    }
    this.closeDenominationModal();
    if (!this.selectedCurrencyDenomination) {
      const currencyDenominationFormValues =
        this.createDenominationForm.getRawValue();
      const saveCurrencyDenomination: CurrencyDenominationDTO = {
        currencyCode: this.selectedCurrency.id,
        currencyName: this.selectedCurrency.name,
        id: null,
        name: currencyDenominationFormValues.name,
        value: currencyDenominationFormValues.value,
        withEffectiveFrom: currencyDenominationFormValues.wef,
      };
      // Create a new Currency Denomination
      this.currencyService
        .createCurrencyDenomination(saveCurrencyDenomination)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Created a Currency Denomination'
          );
          this.fetchCurrencyDenomination(this.selectedCurrency.id);
          this.createCurrencyForm.reset();
        });
    } else {
      const currencyDenominationFormValues =
        this.createDenominationForm.getRawValue();
      const currencyDenominationId = this.selectedCurrencyDenomination.id;
      const saveCurrencyDenomination: CurrencyDenominationDTO = {
        currencyCode: this.selectedCurrencyDenomination.currencyCode,
        currencyName: this.selectedCurrencyDenomination.currencyName,
        id: currencyDenominationId,
        name: currencyDenominationFormValues.name,
        value: currencyDenominationFormValues.value,
        withEffectiveFrom: currencyDenominationFormValues.wef,
      };
      // Update a Currency Denomination
      this.currencyService
        .updateCurrencyDenomination(
          currencyDenominationId,
          saveCurrencyDenomination
        )
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Currency Denomination'
          );
          this.fetchCurrencyDenomination(this.selectedCurrency.id);
          this.createCurrencyForm.reset();
        });
    }
  }

  /**
   * The function `editCurrencyDenomination()` checks if a currency denomination is selected and opens
   * a modal to edit its value, name, and effective date, or displays an error message if no
   * denomination is selected.
   */
  editCurrencyDenomination() {
    if (this.selectedCurrencyDenomination) {
      this.openDenominationModal();
      this.createDenominationForm.patchValue({
        value: this.selectedCurrencyDenomination.value,
        name: this.selectedCurrencyDenomination.name,
        wef: this.selectedCurrencyDenomination.withEffectiveFrom,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Currency Denomination is Selected!'
      );
    }
  }

  /**
   * The function "deleteCurrencyDenomination" displays a confirmation modal for deleting a currency
   * denomination.
   */
  deleteCurrencyDenomination() {
    this.currencyDenominationConfirmationModal.show();
  }

  /**
   * The function `confirmCurrencyDenominationDelete()` deletes a selected currency denomination and
   * displays a success message if the deletion is successful, or an error message if no currency
   * denomination is selected.
   */
  confirmCurrencyDenominationDelete() {
    if (this.selectedCurrencyDenomination) {
      const currencyDenominationId = this.selectedCurrencyDenomination.id;
      this.currencyService
        .deleteCurrencyDenomination(currencyDenominationId)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a Currency Denomination'
          );
          this.fetchCurrencyDenomination(this.selectedCurrency.id);
          this.selectedCurrency = null;
          this.selectedCurrencyDenomination = null;
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Currency Denomination is selected.'
      );
    }
  }
}
