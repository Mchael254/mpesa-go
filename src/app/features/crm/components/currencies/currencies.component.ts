import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  public numberValue = 0;

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
    private bankService: BankService,
    private currencyService: CurrencyService,
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

  updateRound(change: number, form: FormGroup, formControlName: string) {
    const newValue = Math.max(form.get(formControlName).value + change, 0);
    form.get(formControlName).setValue(newValue);
  }

  increment() {
    const roundControl = this.createCurrencyForm.get('round');
    if (roundControl) {
      const currentRoundValue = +roundControl.value || 0;
      roundControl.setValue(currentRoundValue + 1);
    }
  }

  decrement() {
    const roundControl = this.createCurrencyForm.get('round');
    if (roundControl) {
      const currentRoundValue = +roundControl.value || 0;
      if (currentRoundValue > 0) {
        roundControl.setValue(currentRoundValue - 1);
      }
    }
  }

  currencyCreateForm() {
    this.createCurrencyForm = this.fb.group({
      symbol: [''],
      description: [''],
      round: [''],
      numberRound: [''],
      decimalRound: [''],
    });
  }

  denominationCreateForm() {
    this.createDenominationForm = this.fb.group({
      value: [''],
      name: [''],
      wef: [''],
    });
  }

  currencyExchangeForm() {
    this.createCurrencyRateForm = this.fb.group({
      exchangeCurrency: [''],
      rate: [''],
      date: [''],
      wef: [''],
      wet: [''],
    });
  }

  fetchCurrencies() {
    this.bankService
      .getCurrencies()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currenciesData = data;
        log.info('Currencies Data', this.currenciesData);
      });
  }

  // fetchCurrencyRate(currencyId: number) {
  //   this.currencyService
  //     .getCurrenciesRate(currencyId)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((data) => {
  //       this.currencyRatesData = data;
  //       log.info('Currencies Rate Data', this.currencyRatesData);
  //     });
  // }

  fetchCurrencyRate(baseCurrencyId: number, organizationId?: number) {
    // Assuming currencyId is the baseCurrencyId, modify accordingly if needed
    this.currencyService
      .getCurrenciesRate(baseCurrencyId, organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currencyRatesData = data;
        log.info('Currencies Rate Data', this.currencyRatesData);
      });
  }

  fetchCurrencyDenomination(currencyId: number) {
    this.currencyService
      .getCurrenciesDenomination(currencyId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currencyDenominationData = data;
        log.info('Currencies Denomination Data', this.currencyDenominationData);
      });
  }

  openCurrencyModal() {
    const modal = document.getElementById('currencyModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCurrencyModal() {
    const modal = document.getElementById('currencyModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openDenominationModal() {
    const modal = document.getElementById('denominationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDenominationModal() {
    const modal = document.getElementById('denominationModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openCurrencyExchangeModal() {
    const modal = document.getElementById('currencyRateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCurrencyExchangeModal() {
    const modal = document.getElementById('currencyRateModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  filterCurrencies(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currencyTable.filterGlobal(filterValue, 'contains');
  }

  filterExchangeCurrency(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currencyRateTable.filterGlobal(filterValue, 'contains');
  }
  filterCurrencyDenomination(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currencyDenominationTable.filterGlobal(filterValue, 'contains');
  }

  onCurrencyRowSelect(currency: CurrencyDTO) {
    this.selectedCurrency = currency;
    this.fetchCurrencyRate(this.selectedCurrency.id);
    this.fetchCurrencyDenomination(this.selectedCurrency.id);
  }

  onCurrencyRateRowSelect(exchange: CurrencyRateDTO) {
    this.selectedCurrencyRate = exchange;
  }

  onCurrencyDenominationRowSelect(deno: CurrencyDenominationDTO) {
    this.selectedCurrencyDenomination = deno;
  }

  saveCurrency() {
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
        'No Currency is Selected'
      );
    }
  }

  deleteCurrency() {
    this.currencyConfirmationModal.show();
  }

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

  saveCurrencyExchange() {
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

  deleteCurrencyRate() {
    this.currencyRateConfirmationModal.show();
  }

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

  saveDenomination() {
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
        'No Currency Denomination is Selected'
      );
    }
  }

  deleteCurrencyDenomination() {
    this.currencyDenominationConfirmationModal.show();
  }

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
