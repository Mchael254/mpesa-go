import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import {
  AdminstrativeUnitDTO, CountryDTO, PostCountryDTO,
  PostStateDTO, PostTownDTO, StateDto, SubadminstrativeUnitDTO, TownDto
} from '../../../../shared/data/common/countryDto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { ReplaySubject, takeUntil } from 'rxjs';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import stepData from '../../data/steps.json'

const log = new Logger( 'CountryComponent');

/* The CountryComponent class is a TypeScript component that handles the creation and management of
country data, including form validation and fetching data from services. */
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public createCountryForm: FormGroup;
  public createCountyForm: FormGroup;
  public createTownForm: FormGroup;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  steps = stepData;

  public countriesData: CountryDTO[] = [];
  public stateData: StateDto[] = [];
  public townData: TownDto[] = [];
  public currenciesData: CurrencyDTO[];
  public adminstrativeData: AdminstrativeUnitDTO[];
  public subadminstrativeData: SubadminstrativeUnitDTO[];
  public groupId: string = 'countryTab';
  public response: any;
  public days: number[] = [];
  public holidays: any;
  public selectedCityState: number;
  public selectedStateId: number;
  public countrySelected: CountryDTO;
  public selectedCountry: number;
  public filteredState: any;
  public submitted = false;
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

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private bankService: BankService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private utilService: UtilService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) { }
  
  ngOnInit(): void {
    this.CountryCreateForm();
    this.CountyCreateForm();
    this.TownCreateForm();
    this.fetchCountries();
    this.fetchCurrencies();
    this.fetchAdminstrativeUnit();
    this.fetchSubadminstrativeUnit();
  }

  ngOnDestroy(): void {}


/**
 * The function "updateDays" logs the selected month and updates the "days" array based on the number
 * of days in the selected month.
 * @param {string} selectedMonth - A string representing the selected month.
 */
  updateDays(selectedMonth: string) {
    const selectedMonthDays = this.daysInMonth[selectedMonth];
    this.days = Array.from({ length: selectedMonthDays }, (_, i) => i + 1);
  }

  CountryCreateForm() {
    this.createCountryForm = this.fb.group({
      country: [''],
      shortDescription: [''],
      name: [''],
      baseCurrency: [''],
      nationality: [''],
      zipCode: [''],
      administrativeUnit: [''],
      subadminstrativeUnit: [''],
      unSactionWEF: [''],
      unSactionWET: [''],
      riskLevelStatusWEF: [''],
      riskLevelStatusWET: [''],
      drugTrafficWEF: [''],
      drugTrafficWET: [''],
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

  CountyCreateForm() {
    this.createCountyForm = this.fb.group({
      shortDescription: [''],
      name: ['']
    });
  }

  TownCreateForm() {
    this.createTownForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      postalCode: ['']
    });
  }

  onCountryChange() {
    const selectedCountryId= this.selectedCountry;
    this.countrySelected = this.countriesData.find(country => country.id === selectedCountryId)
    if (this.countrySelected) {
        this.createCountryForm.patchValue({
          name: this.countrySelected.name,
          shortDescription: this.countrySelected.short_description,
          baseCurrency: this.countrySelected.currency.id,
          nationality: this.countrySelected.nationality,
          zipCode: this.countrySelected.zipCode,
          administrativeUnit: this.countrySelected,
          subadminstrativeUnit: this.countrySelected,
          unSactionWEF: this.countrySelected.unSanctionWefDate,
          unSactionWET: this.countrySelected.unSanctionWetDate,
          riskLevelStatusWEF: this.countrySelected.highRiskWefDate,
          riskLevelStatusWET: this.countrySelected.highRiskWetDate,
          drugTrafficWEF: this.countrySelected.drugWefDate,
          drugTrafficWET: this.countrySelected.drugWetDate,
        });
      
        // Conditionally set administrativeUnit and subadminstrativeUnit
        switch (this.countrySelected.adminRegType) {
            case 'C':
                this.createCountryForm.patchValue({
                    administrativeUnit: 'C',
                    subadminstrativeUnit: 'SB',
                });
                this.fetchMainCityStates(this.countrySelected.id);
                break;
            case 'S':
                this.createCountryForm.patchValue({
                    administrativeUnit: 'S',
                    subadminstrativeUnit: 'D',
                });
                this.fetchMainCityStates(this.countrySelected.id);
                break;
            case 'P':
                this.createCountryForm.patchValue({
                    administrativeUnit: 'P',
                    subadminstrativeUnit: 'D',
                });
                this.fetchMainCityStates(this.countrySelected.id);
                break;
            case 'R':
                this.createCountryForm.patchValue({
                    administrativeUnit: 'R',
                    subadminstrativeUnit: 'LG',
                });
                this.fetchMainCityStates(this.countrySelected.id);
                break;
        }
    }
  }

  filterCounties(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredState = this.stateData.filter((el) => el.name.includes(searchValue));
    console.log(this.filteredState);
    this.cdr.detectChanges();
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
        this.stateData  = data;
      })
  }

  fetchTowns(stateId:number){
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId)
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  fetchAdminstrativeUnit() {
    this.countryService.getAdminstrativeUnit()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.adminstrativeData = data
      })
  }

  fetchSubadminstrativeUnit() {
    this.countryService.getSubadminstrativeUnit()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.subadminstrativeData = data
      })
  }

  onCityChange(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;
    this.selectedCityState = parseInt(selectedState, 10);
    this.countryService.getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
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

  onRowClick(state: any) {
    this.selectedStateId = state.id;
    this.fetchTowns(this.selectedStateId);
  }


  saveCountry() {
    this.submitted = true;
    this.createCountryForm.markAllAsTouched();

    if (this.createCountryForm.invalid) {
       const invalidControls = Array.from(document.querySelectorAll('.is-invalid')) as Array<HTMLInputElement | HTMLSelectElement>;

       let firstInvalidUnfilledControl: HTMLInputElement | HTMLSelectElement | null = null;

       for (const control of invalidControls) {
         if (!control.value) {
           firstInvalidUnfilledControl = control;
           break;
         }
       }

       if (firstInvalidUnfilledControl) {
         firstInvalidUnfilledControl.focus();
         const scrollContainer = this.utilService.findScrollContainer(firstInvalidUnfilledControl);
         if (scrollContainer) {
           scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
         }
       } else {
         const firstInvalidControl = invalidControls[0];
         if (firstInvalidControl) {
           firstInvalidControl.focus();
           const scrollContainer = this.utilService.findScrollContainer(firstInvalidControl);
           if (scrollContainer) {
             scrollContainer.scrollTop = firstInvalidControl.offsetTop;
           }
         }
       }

       this.globalMessagingService.displayErrorMessage('Failed', 'Form is Invalid, Fill all required fields');
       return;
    }
    
    const countryFormValues = this.createCountryForm.getRawValue();
    const countryId = this.countrySelected.id;

    const saveCountry: PostCountryDTO = {
      adminRegMandatory: this.countrySelected.adminRegMandatory,
      adminRegType: this.countrySelected.adminRegType,
      currSerial: this.countrySelected.currSerial,
      currency: countryFormValues.baseCurrency,
      drugTraffickingStatus: countryFormValues.drugTraffickingStatus,
      drugWefDate: countryFormValues.drugTrafficWEF,
      drugWetDate: countryFormValues.drugTrafficWET,
      highRiskWefDate: countryFormValues.riskLevelStatusWEF,
      highRiskWetDate: countryFormValues.riskLevelStatusWET,
      id: countryId || null,
      isShengen: this.countrySelected.isShengen,
      mobilePrefix: countryFormValues.zipCode,
      name: countryFormValues.name,
      nationality: countryFormValues.nationality,
      risklevel: null,
      short_description: countryFormValues.shortDescription,
      telephoneMaximumLength: null,
      telephoneMinimumLength: null,
      unSanctionWefDate: countryFormValues.unSactionWEF,
      unSanctionWetDate: countryFormValues.unSactionWET,
      unSanctioned: null,
      zipCode: countryFormValues.zipCode
    }

    if (countryId) {
      // Update an existing country
      this.countryService.updateCountry(countryId, saveCountry)
        .subscribe(data => {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated a Country');
        });
    }
    else {
      // Create a new country
      this.countryService.createCountry(saveCountry)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a Country');
        })
    }

    this.createCountryForm.reset();
    this.fetchCountries();
  }

  saveCounty() {
    const countyFormValues = this.createCountyForm.getRawValue();

    const saveState: PostStateDTO = {
      countryId: this.countrySelected.id,
      id: null,
      name: countyFormValues.name,
      shortDescription: countyFormValues.shortDescription
    }

    this.countryService.createState(saveState)
      .subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a State');
      })
  }

  saveTown() {
    const townFormValues = this.createTownForm.getRawValue

    const saveTown: PostTownDTO = {
      countryId: this.countrySelected.id,
      id: null,
      name: townFormValues.name,
      shortDescription: '',
      stateId: 0
    }
  }

}
