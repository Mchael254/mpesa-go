import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import {
  AdminstrativeUnitDTO,
  CountryDto,
  CountryHolidayDTO,
  PostCountryDTO,
  PostCountryHolidayDTO,
  PostStateDTO,
  PostTownDTO,
  StateDto,
  SubCountyDTO,
  SubadminstrativeUnitDTO,
  TownDto,
} from '../../../../shared/data/common/countryDto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { ReplaySubject, takeUntil } from 'rxjs';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { Table } from 'primeng/table';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { SortEvent } from 'primeng/api';

const log = new Logger('CountryComponent');

/* The CountryComponent class is a TypeScript component that handles the creation and management of
country data, including form validation and fetching data from services. */
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit, AfterViewInit {
  @ViewChild('countyModal') countyModal: ElementRef;
  @ViewChild('districtModal') districtModal: ElementRef;
  @ViewChild('townModal') townModal: ElementRef;
  @ViewChild('holidayModal') holidayModal: ElementRef;
  @ViewChild('adminSelect') adminSelect: ElementRef;
  @ViewChild('subadminSelect') subadminSelect: ElementRef;
  @ViewChild('adminCardTitle') adminCardTitle: ElementRef;
  @ViewChild('subadminCardTitle') subadminCardTitle: ElementRef;
  @ViewChild('stateTable') stateTable: Table;
  @ViewChild('districtTable') districtTable: Table;
  @ViewChild('townTable') townTable: Table;
  @ViewChild('holidayTable') holidayTable: Table;
  @ViewChild('countryConfirmationModal')
  countryConfirmationModal!: ReusableInputComponent;
  @ViewChild('stateConfirmationModal')
  stateConfirmationModal!: ReusableInputComponent;
  @ViewChild('districtConfirmationModal')
  districtConfirmationModal!: ReusableInputComponent;
  @ViewChild('townConfirmationModal')
  townConfirmationModal!: ReusableInputComponent;
  @ViewChild('holidayConfirmationModal')
  holidayConfirmationModal!: ReusableInputComponent;

  public createCountryForm: FormGroup;
  public createCountyForm: FormGroup;
  public createSubcountyForm: FormGroup;
  public createTownForm: FormGroup;
  public createHolidayForm: FormGroup;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public countriesData: CountryDto[] = [];
  public stateData: StateDto[] = [];
  public districtData: SubCountyDTO[] = [];
  public townData: TownDto[] = [];
  public currenciesData: CurrencyDTO[] = [];
  public adminstrativeData: AdminstrativeUnitDTO[] = [];
  public subadminstrativeData: SubadminstrativeUnitDTO[] = [];
  public countryHolidayData: CountryHolidayDTO[] = [];
  public statusesData: StatusDTO[];
  public groupId: string = 'countryTab';
  public response: any;
  public days: number[] = [];
  public selectedCityState: number;
  public selectedStateId: number;
  public selectedState: StateDto;
  public selectedDistrict: SubCountyDTO;
  public selectedTown: TownDto;
  public selectedHoliday: CountryHolidayDTO;
  public countrySelected: CountryDto;
  public selectedCountry: number;
  public selectedCurrency = '';
  public filteredState: any;
  public submitted = false;

  sortField: string = '';
  sortOrder: number = 1;
  countryBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Country and Holidays',
      url: 'home/crm/country',
    },
  ];
  public visibleStatus: any = {
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
  };

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
    private renderer: Renderer2,
    private countryService: CountryService,
    private bankService: BankService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private utilService: UtilService,
    private statusService: StatusService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.CountryCreateForm();
    this.CountyCreateForm();
    this.CountySubcountyCreateForm();
    this.TownCreateForm();
    this.CountryHolidayForm();
    this.fetchCountries();
    this.fetchCurrencies();
    this.fetchAdminstrativeUnit();
    this.fetchSubadminstrativeUnit();
    this.fetchStatuses();
  }

  ngAfterViewInit() {
    // Add a change event listener dynamically
    // this.subadminSelect.nativeElement.addEventListener('change', (event) => {
    //     this.onCityChange(event);
    //     this.updateCardTitle(event, cardTitle);
    //     this.updateCardTitle(event, subCardTitle);
    // });
  }

  ngOnDestroy(): void {}

  /**
   * The function "updateDays" logs the selected month and updates the "days" array based on the number
   * of days in the selected month.
   * @param {string} selectedMonth - A string representing the selected month.
   */
  updateDays(selectedMonth: string) {
    const selectedMonthDays = this.daysInMonth[selectedMonth];
    this.createHolidayForm.get('date').setValue(''); // Clear the previous day selection
    this.days = Array.from({ length: selectedMonthDays }, (_, i) => i + 1);
  }

  CountryCreateForm() {
    this.createCountryForm = this.fb.group({
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
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          for (const key of Object.keys(this.createCountryForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createCountryForm.controls[key].addValidators(
                  Validators.required
                );
                this.createCountryForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        // this.cdr.detectChanges();
      });
  }

  get f() {
    return this.createCountryForm.controls;
  }

  CountyCreateForm() {
    this.createCountyForm = this.fb.group({
      shortDescription: [''],
      name: [''],
    });
  }

  CountySubcountyCreateForm() {
    this.createSubcountyForm = this.fb.group({
      shortDescription: [''],
      name: [''],
    });
  }

  TownCreateForm() {
    this.createTownForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      postalCode: [''],
    });
  }

  CountryHolidayForm() {
    this.createHolidayForm = this.fb.group({
      shortDescription: '',
      month: '',
      date: '',
      status: '',
    });
  }

  openCountyModal() {
    this.renderer.addClass(this.countyModal.nativeElement, 'show');
    this.renderer.setStyle(this.countyModal.nativeElement, 'display', 'block');
  }

  closeCountyModal() {
    this.renderer.removeClass(this.countyModal.nativeElement, 'show');
    this.renderer.setStyle(this.countyModal.nativeElement, 'display', 'none');
  }

  openSubcountyModal() {
    this.renderer.addClass(this.districtModal.nativeElement, 'show');
    this.renderer.setStyle(
      this.districtModal.nativeElement,
      'display',
      'block'
    );
  }

  closeSubcountyModal() {
    this.renderer.removeClass(this.districtModal.nativeElement, 'show');
    this.renderer.setStyle(this.districtModal.nativeElement, 'display', 'none');
  }

  openTownModal() {
    this.renderer.addClass(this.townModal.nativeElement, 'show');
    this.renderer.setStyle(this.townModal.nativeElement, 'display', 'block');
  }

  closeTownModal() {
    this.renderer.removeClass(this.townModal.nativeElement, 'show');
    this.renderer.setStyle(this.townModal.nativeElement, 'display', 'none');
  }

  openHolidayModal() {
    this.renderer.addClass(this.holidayModal.nativeElement, 'show');
    this.renderer.setStyle(this.holidayModal.nativeElement, 'display', 'block');
  }

  closeHolidayModal() {
    this.renderer.removeClass(this.holidayModal.nativeElement, 'show');
    this.renderer.setStyle(this.holidayModal.nativeElement, 'display', 'none');
  }

  onCountryChange() {
    this.stateData = [];
    this.districtData = [];
    this.townData = [];
    this.countryHolidayData = [];
    const selectedCountryId = this.selectedCountry;
    this.countrySelected = this.countriesData.find(
      (country) => country.id === selectedCountryId
    );
    if (this.countrySelected) {
      this.createCountryForm.patchValue({
        name: this.countrySelected?.name,
        shortDescription: this.countrySelected?.short_description,
        baseCurrency: this.countrySelected?.currency?.id,
        nationality: this.countrySelected?.nationality,
        zipCode: this.countrySelected?.zipCode,
        administrativeUnit: this.countrySelected?.adminRegType,
        subadminstrativeUnit: this.countrySelected?.subAdministrativeUnit,
        unSactionWEF: this.countrySelected?.unSanctionWefDate,
        unSactionWET: this.countrySelected?.unSanctionWetDate,
        riskLevelStatusWEF: this.countrySelected?.highRiskWefDate,
        riskLevelStatusWET: this.countrySelected?.highRiskWetDate,
        drugTrafficWEF: this.countrySelected?.drugWefDate,
        drugTrafficWET: this.countrySelected?.drugWetDate,
      });
      this.fetchMainCityStates(this.countrySelected?.id);
      this.fetchCountryHoliday(this.countrySelected?.id);
      this.updateCardTitles();
    }
  }

  updateCardTitles() {
    const adminId = this.createCountryForm.get('administrativeUnit')?.value;
    const subadminId = this.createCountryForm.get(
      'subadminstrativeUnit'
    )?.value;

    const adminValue =
      this.adminstrativeData.find((admin) => admin.id === adminId)?.name || '';
    const subadminValue =
      this.subadminstrativeData.find((subadmin) => subadmin.id === subadminId)
        ?.name || '';

    // Update the card titles
    this.adminCardTitle.nativeElement.innerText = adminValue || 'Counties';
    this.subadminCardTitle.nativeElement.innerText =
      subadminValue || 'Sub-Counties';
  }

  onSort(event: Event, dataArray: any[], sortKey: string): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    switch (selectedValue) {
      case 'asc':
        this.sortArrayAsc(dataArray, sortKey);
        break;
      case 'desc':
        this.sortArrayDesc(dataArray, sortKey);
        break;
      default:
        // Handle default case or no sorting
        break;
    }
  }

  sortArrayAsc(dataArray: any[], sortKey: string): void {
    dataArray.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }

  sortArrayDesc(dataArray: any[], sortKey: string): void {
    dataArray.sort((a, b) => b[sortKey].localeCompare(a[sortKey]));
  }

  filterState(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.stateTable.filterGlobal(filterValue, 'contains');
  }

  filterDistrict(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.districtTable.filterGlobal(filterValue, 'contains');
  }

  filterTown(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.townTable.filterGlobal(filterValue, 'contains');
  }

  filterHoliday(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.holidayTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function fetches countries data from a service and assigns it to the countriesData variable.
   */
  fetchCountries() {
    this.countryService.getCountries().subscribe((data) => {
      this.countriesData = data;
    });
  }

  fetchStatuses() {
    this.statusService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statusesData = data;
        log.info('Fetched Statuses', this.statusesData);
      });
  }

  fetchMainCityStates(countryId: number) {
    log.info(`Fetching city states list for country, ${countryId}`);
    this.countryService
      .getMainCityStatesByCountry(countryId)
      .subscribe((data) => {
        // this.stateData = data;
        if (data && data.length > 0) {
          this.stateData = data;
        } else {
          this.stateData = null;
        }
      });
  }

  fetchDistricts(stateId: number) {
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getSubCountyByStateId(stateId).subscribe((data) => {
      this.districtData = data;
    });
  }

  fetchTowns(stateId: number) {
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId).subscribe((data) => {
      this.townData = data;
    });
  }

  fetchAdminstrativeUnit() {
    this.countryService
      .getAdminstrativeUnit()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.adminstrativeData = data;
      });
  }

  fetchSubadminstrativeUnit() {
    this.countryService
      .getSubadminstrativeUnit()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.subadminstrativeData = data;
      });
  }

  fetchCountryHoliday(countryCode: number) {
    this.countryService
      .getCountryHoliday(countryCode)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.countryHolidayData = data;
        log.info(`country holiday data`, this.countryHolidayData);
      });
  }

  onCityChange(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;
    this.selectedCityState = parseInt(selectedState, 10);
    this.countryService
      .getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
    this.updateCardTitles();
  }

  /**
   * The fetchCurrencies function retrieves currency data from a bank service and assigns it to the
   * currenciesData variable.
   */
  fetchCurrencies() {
    this.bankService.getCurrencies().subscribe((data) => {
      this.currenciesData = data;
    });
  }

  onRowClick(state: StateDto) {
    this.selectedState = state;
    this.selectedStateId = state.id;
    this.fetchDistricts(this.selectedStateId);
    this.fetchTowns(this.selectedStateId);
  }

  onDistrictRowSelect(district: SubCountyDTO) {
    this.selectedDistrict = district;
  }

  onTownRowSelect(town: TownDto) {
    this.selectedTown = town;
  }

  onHolidayRowSelect(holiday: CountryHolidayDTO) {
    this.selectedHoliday = holiday;
  }

  createCountry() {
    this.createCountryForm.reset();
    this.countrySelected = null;
    this.stateData = null;
    this.districtData = null;
    this.townData = null;
    this.countryHolidayData = null;
  }

  saveCountry() {
    this.submitted = true;
    this.createCountryForm.markAllAsTouched();

    if (this.createCountryForm.invalid) {
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

      this.globalMessagingService.displayErrorMessage(
        'Failed',
        'Form is Invalid, Fill all required fields'
      );
      return;
    }

    if (!this.countrySelected) {
      const countryFormValues = this.createCountryForm.getRawValue();

      const saveCountry: PostCountryDTO = {
        adminRegMandatory: null,
        adminRegType: countryFormValues.administrativeUnit,
        currSerial: null,
        currency: countryFormValues.baseCurrency,
        drugTraffickingStatus: countryFormValues.drugTraffickingStatus,
        drugWefDate: countryFormValues.drugTrafficWEF,
        drugWetDate: countryFormValues.drugTrafficWET,
        highRiskWefDate: countryFormValues.riskLevelStatusWEF,
        highRiskWetDate: countryFormValues.riskLevelStatusWET,
        id: null,
        isShengen: null,
        mobilePrefix: countryFormValues.zipCode,
        name: countryFormValues.name,
        nationality: countryFormValues.nationality,
        risklevel: null,
        short_description: countryFormValues.shortDescription,
        subAdministrativeUnit: countryFormValues.subadminstrativeUnit,
        telephoneMaximumLength: null,
        telephoneMinimumLength: null,
        unSanctionWefDate: countryFormValues.unSactionWEF,
        unSanctionWetDate: countryFormValues.unSactionWET,
        unSanctioned: null,
        zipCode: countryFormValues.zipCode,
        zipCodeString: null,
      };
      // Create a new country
      this.countryService.createCountry(saveCountry).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Created a Country'
        );
        this.fetchCountries();
      });
    } else {
      const countryFormValues = this.createCountryForm.getRawValue();
      const countryId = this.countrySelected.id;

      const saveCountry: PostCountryDTO = {
        adminRegMandatory: this.countrySelected.adminRegMandatory,
        adminRegType: countryFormValues.administrativeUnit,
        currSerial: this.countrySelected.currSerial,
        currency: countryFormValues.baseCurrency,
        drugTraffickingStatus: countryFormValues.drugTraffickingStatus,
        drugWefDate: countryFormValues.drugTrafficWEF,
        drugWetDate: countryFormValues.drugTrafficWET,
        highRiskWefDate: countryFormValues.riskLevelStatusWEF,
        highRiskWetDate: countryFormValues.riskLevelStatusWET,
        id: countryId,
        isShengen: this.countrySelected.isShengen,
        mobilePrefix: countryFormValues.zipCode,
        name: countryFormValues.name,
        nationality: countryFormValues.nationality,
        risklevel: null,
        short_description: countryFormValues.shortDescription,
        subAdministrativeUnit: countryFormValues.subadminstrativeUnit,
        telephoneMaximumLength: null,
        telephoneMinimumLength: null,
        unSanctionWefDate: countryFormValues.unSactionWEF,
        unSanctionWetDate: countryFormValues.unSactionWET,
        unSanctioned: null,
        zipCode: countryFormValues.zipCode,
        zipCodeString: null,
      };
      // Update an existing country
      this.countryService
        .updateCountry(countryId, saveCountry)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Country'
          );
          this.fetchCountries();
        });
    }
  }

  deleteCountry() {
    this.countryConfirmationModal.show();
  }

  confirmCountryDelete() {
    if (this.countrySelected) {
      const countryId = this.countrySelected.id;
      this.countryService.deleteCountry(countryId).subscribe(() => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully Deleted a Country'
        );
        this.fetchCountries();
        this.createCountryForm.reset();
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Country is selected'
      );
    }
  }

  saveState() {
    this.closeCountyModal();
    if (!this.selectedState) {
      const countyFormValues = this.createCountyForm.getRawValue();

      const saveState: PostStateDTO = {
        countryId: this.countrySelected.id,
        id: null,
        name: countyFormValues.name,
        shortDescription: countyFormValues.shortDescription,
      };
      this.countryService.createState(saveState).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Created a State'
        );
        this.fetchMainCityStates(this.countrySelected.id);
      });
    } else {
      const countyFormValues = this.createCountyForm.getRawValue();
      const stateId = this.selectedState.id;

      const saveState: PostStateDTO = {
        countryId: this.countrySelected.id,
        id: stateId,
        name: countyFormValues.name,
        shortDescription: countyFormValues.shortDescription,
      };
      this.countryService.updateState(stateId, saveState).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Updated a State'
        );
        this.fetchMainCityStates(this.countrySelected.id);
        this.selectedState = null;
      });
    }
    this.createCountyForm.reset();
  }

  saveDistrict() {
    this.closeSubcountyModal();
    if (!this.selectedDistrict) {
      const subCountyFormValues = this.createSubcountyForm.getRawValue();

      const saveDistrict: SubCountyDTO = {
        countryCode: this.countrySelected.id,
        id: null,
        name: subCountyFormValues.name,
        shortDescription: subCountyFormValues.shortDescription,
        stateCode: this.selectedState.id,
      };
      this.countryService.createDistrict(saveDistrict).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Created a Sub-County'
        );
        this.fetchDistricts(this.selectedStateId);
      });
    } else {
      const subCountyFormValues = this.createSubcountyForm.getRawValue();
      const districtId = this.selectedDistrict.id;

      const saveDistrict: SubCountyDTO = {
        countryCode: this.countrySelected.id,
        id: districtId,
        name: subCountyFormValues.name,
        shortDescription: subCountyFormValues.shortDescription,
        stateCode: this.selectedState.id,
      };
      this.countryService
        .updateDistrict(districtId, saveDistrict)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Sub-County'
          );
          this.fetchDistricts(this.selectedStateId);
          this.selectedDistrict = null;
        });
    }
    this.createSubcountyForm.reset();
  }

  saveTown() {
    this.closeTownModal();
    if (!this.selectedTown) {
      const townFormValues = this.createTownForm.getRawValue();

      const saveTown: PostTownDTO = {
        countryId: this.countrySelected.id,
        id: null,
        name: townFormValues.name,
        shortDescription: townFormValues.shortDescription,
        stateId: this.selectedStateId,
      };
      this.countryService.createTown(saveTown).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Created a Town'
        );
        this.fetchTowns(this.selectedStateId);
      });
    } else {
      const townFormValues = this.createTownForm.getRawValue();
      const townId = this.selectedTown.id;

      const saveTown: PostTownDTO = {
        countryId: this.countrySelected.id,
        id: townId,
        name: townFormValues.name,
        shortDescription: townFormValues.shortDescription,
        stateId: this.selectedStateId,
      };
      this.countryService.updateTown(townId, saveTown).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Updated a Town'
        );
        this.fetchTowns(this.selectedStateId);
        this.selectedTown = null;
      });
    }
    this.createTownForm.reset();
  }

  saveCountryHoliday() {
    this.closeHolidayModal();

    if (!this.selectedHoliday) {
      const countryHolidayFormValues = this.createHolidayForm.getRawValue();

      const day = parseInt(countryHolidayFormValues.date, 10);
      const month = parseInt(countryHolidayFormValues.month, 10);

      const saveCountryHoliday: PostCountryHolidayDTO = {
        countryCode: this.countrySelected.id,
        day: day,
        description: countryHolidayFormValues.shortDescription,
        id: null,
        month: month,
        status: countryHolidayFormValues.status,
      };
      this.countryService
        .createCountryHoliday(saveCountryHoliday)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Created a Country Holiday'
          );
          this.fetchCountryHoliday(this.countrySelected.id);
        });
    } else {
      const countryHolidayFormValues = this.createHolidayForm.getRawValue();
      const holidayId = this.selectedHoliday.id;

      const day = parseInt(countryHolidayFormValues.date, 10);
      const month = parseInt(countryHolidayFormValues.month, 10);

      const saveCountryHoliday: PostCountryHolidayDTO = {
        countryCode: this.countrySelected.id,
        day: day,
        description: countryHolidayFormValues.shortDescription,
        id: holidayId,
        month: month,
        status: countryHolidayFormValues.status,
      };
      this.countryService
        .updateCountryHoliday(holidayId, saveCountryHoliday)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Country Holiday'
          );
          this.fetchCountryHoliday(this.countrySelected.id);
          this.selectedHoliday = null;
        });
    }
    this.createHolidayForm.reset();
  }

  editState() {
    if (this.selectedState) {
      this.openCountyModal();
      this.createCountyForm.patchValue({
        shortDescription: this.selectedState.shortDescription,
        name: this.selectedState.name,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No State is selected!.'
      );
    }
  }

  deleteState() {
    this.stateConfirmationModal.show();
  }

  // confirmStateDelete() {
  //   if (this.selectedState) {
  //     const stateId = this.selectedState.id;
  //     this.countryService.deleteState(stateId).subscribe((data: any) => {
  //       this.globalMessagingService.displaySuccessMessage(
  //         'success',
  //         'Successfully deleted a state'
  //       );
  //       this.fetchMainCityStates(this.countrySelected.id);
  //       this.selectedState = null;
  //     });
  //   } else {
  //     this.globalMessagingService.displayErrorMessage(
  //       'Error',
  //       'No state is selected.'
  //     );
  //   }
  // }

  confirmStateDelete() {
    if (this.selectedState) {
      const stateId = this.selectedState.id;
      this.countryService.deleteState(stateId).subscribe(
        (response: any) => {
          const responseText: string = response as string;
          this.globalMessagingService.displaySuccessMessage(
            'success',
            responseText
          );
          this.fetchMainCityStates(this.countrySelected.id);
          this.selectedState = null;
        },
        (error) => {
          console.error('Error deleting state:', error);
          // Handle error here
        }
      );
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No state is selected.'
      );
    }
  }

  editDistrict() {
    if (this.selectedDistrict) {
      this.openSubcountyModal();
      this.createSubcountyForm.patchValue({
        shortDescription: this.selectedDistrict.shortDescription,
        name: this.selectedDistrict.name,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Sub-County is selected!.'
      );
    }
  }

  deleteDistrict() {
    this.districtConfirmationModal.show();
  }

  confirmDistrictDelete() {
    if (this.selectedDistrict) {
      const districtId = this.selectedDistrict.id;
      this.countryService.deleteDistrict(districtId).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully deleted a Sub-county'
        );
        this.fetchDistricts(this.selectedStateId);
        this.selectedDistrict = null;
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No sub-county is selected.'
      );
    }
  }

  editTown() {
    if (this.selectedTown) {
      log.info('Editing Town:', this.selectedTown);
      this.openTownModal();
      this.createTownForm.patchValue({
        shortDescription: this.selectedTown.shortDescription,
        name: this.selectedTown.name,
        postalCode: '',
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Errror',
        'No Town is selected!.'
      );
    }
  }

  deleteTown() {
    this.townConfirmationModal.show();
  }

  confirmTownDelete() {
    if (this.selectedTown) {
      const townId = this.selectedTown.id;
      this.countryService.deleteTown(townId).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully deleted a town'
        );
        this.fetchTowns(this.selectedStateId);
        this.selectedTown = null;
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Town is Selected!'
      );
    }
  }

  editHoliday() {
    if (this.selectedHoliday) {
      this.openHolidayModal();
      this.createHolidayForm.patchValue({
        shortDescription: this.selectedHoliday.description,
        month: this.selectedHoliday.month,
        date: this.selectedHoliday.day,
        status: this.selectedHoliday.status,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Holiday Selected!'
      );
    }
  }

  deleteHoliday() {
    this.holidayConfirmationModal.show();
  }

  confirmHolidayDelete() {
    if (this.selectedHoliday) {
      const holidayId = this.selectedHoliday.id;
      this.countryService.deleteCountryHoliday(holidayId).subscribe((data) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'Successfully deleted a holiday'
        );
        this.fetchCountryHoliday(this.countrySelected.id);
        this.selectedHoliday = null;
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Holiday Selected!'
      );
    }
  }
}
