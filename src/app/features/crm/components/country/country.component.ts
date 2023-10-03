import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { CountryDto, StateDto, TownDto } from '../../../../shared/data/common/countryDto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { ReplaySubject, takeUntil } from 'rxjs';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';

const log = new Logger( 'CountryComponent');

/* The CountryComponent class is a TypeScript component that handles the creation and management of
country data, including form validation and fetching data from services. */
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public createCountryForm: FormGroup;
  public countriesData: CountryDto[] = [];
  public citiesData: StateDto[] = [];
  public townData: TownDto[] = [];
  public currenciesData: CurrencyDTO[];
  public groupId: string = 'countryTab';
  public response: any;
  public selectedDay: number;
  public selectedMonth: string;
  public days: number[] = [];
  public selectedMonthDays: number[] = [];
  public holidays: any;
  countryBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard'
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Country and Holidays',
      url: 'home/crm/country'
    }
  ];
  public visibleStatus: any = {
    country: 'Y',
    shortDescription: 'Y',
    name: 'Y',
    baseCurrency: 'Y',
    nationality: 'Y',
    // baseCode: 'Y',
    zipCode: 'Y',
    administrativeUnit: 'Y',
    subadminstrativeUnit: 'Y',
    unSactionWEF: 'N',
    unSactionWET: 'N',
    riskLevelStatusWEF: 'N',
    riskLevelStatusWET: 'N',
    drugTrafficWEF: 'N',
    drugTrafficWET: 'N',
  }

  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
    
  ];

  daysInMonth = {
    '01': 31,
    '02': 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31,
  };

  activeTab: string = 'myReports';

  myReportsList: { id: string, name: string }[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ];

  anotherTabList: { id: string, name: string }[] = [
    { id: 'A', name: 'Item A' },
    { id: 'B', name: 'Item B' },
    { id: 'C', name: 'Item C' }
  ];

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private bankService: BankService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) { }
  
  ngOnInit(): void {
    this.CountryCreateForm();
    this.fetchCountries();
    this.fetchCurrencies();
    this.selectedMonth = '';
  }

  myReports() {
    this.activeTab = 'myReports';
  }

  sharedReports() {
    this.activeTab = 'sharedReports';
  }


/**
 * The function "updateDays" logs the selected month and updates the "days" array based on the number
 * of days in the selected month.
 * @param {string} selectedMonth - A string representing the selected month.
 */
  updateDays(selectedMonth: string) {
    console.log('Selected month is', selectedMonth);
    const selectedMonthDays = this.daysInMonth[selectedMonth];
    this.days = Array.from({ length: selectedMonthDays }, (_, i) => i + 1);
    console.log('This month has', this.days);
  }





  CountryCreateForm() {
    this.createCountryForm = this.fb.group({
      country: [''],
      shortDescription: [''],
      name: [''],
      baseCurrency: [''],
      nationality: [''],
      // baseCode: [''],
      zipCode: [''],
      administrativeUnit: [''],
      subadminstrativeUnit: [''],
      unSactionWEF: [''],
      unSactionWET: [''],
      riskLevelStatusWEF: [''],
      riskLevelStatusWET: [''],
      drugTrafficWEF: [''],
      drugTrafficWET: [''],
      selectedDay: [''],
      selectedMonth: [''],
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      takeUntil(this.destroyed$)
    )
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) =>{
          for (const key of Object.keys(this.createCountryForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createCountryForm.controls[key].addValidators(Validators.required);
                this.createCountryForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  get f() { return this.createCountryForm.controls; }

  onCountryChange(event: Event) {
    const selectedCountryId = (event.target as HTMLSelectElement).value;
    const selectedCountryIdAsNumber = parseInt(selectedCountryId, 10);
    const selectedCountry = this.countriesData.find(country => country.id === selectedCountryIdAsNumber);
    if (selectedCountry) {
        this.createCountryForm.patchValue({
            name: selectedCountry.name,
            shortDescription: selectedCountry.short_description,
            // Add more fields as needed
        });
    }
  }

  filterCovers(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    // this.filteredCover = this.coverTypeData.filter((el) => el.description.includes(searchValue));
    // this.cdr.detectChanges();
  }




 /**
  * The function fetches countries data from a service and assigns it to the countriesData variable.
  */
  fetchCountries(){
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countriesData = data;
      });
  }

  fetchMainCityStates(countryId: number){
    log.info(`Fetching city states list for country, ${countryId}`);
    this.countryService.getMainCityStatesByCountry(countryId)
      .subscribe( (data) => {
        this.citiesData  = data;
      })
  }

  fetchTowns(stateId:number){
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId)
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  /**
   * The fetchCurrencies function retrieves currency data from a bank service and assigns it to the
   * currenciesData variable.
   */
  fetchCurrencies() {
    this.bankService.getCurrencies()
      .subscribe((data) => {
        this.currenciesData = data;
      });
  }

  save() {}

}
