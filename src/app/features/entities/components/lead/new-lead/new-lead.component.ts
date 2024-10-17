import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, take } from 'rxjs';

import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { Logger } from '../../../../../shared/services/logger/logger.service';
import { CountryService } from '../../../../../shared/services/setups/country/country.service';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../../shared/data/common/countryDto';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { AccountService } from '../../../services/account/account.service';
import { ClientTitleDTO } from '../../../data/accountDTO';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { SetupsParametersService } from '../../../../../shared/services/setups-parameters.service';
import { LeadsService } from '../../../../../features/crm/services/leads.service';
import {
  LeadCommentDto,
  LeadSourceDto,
  LeadStatusDto,
  Leads,
} from '../../../../../features/crm/data/leads';
import { SystemsDto } from '../../../../../shared/data/common/systemsDto';
import { SystemsService } from '../../../../../shared/services/setups/systems/systems.service';
import { SectorService } from '../../../../../shared/services/setups/sector/sector.service';
import { OccupationService } from '../../../../../shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from '../../../../../shared/data/common/occupation-dto';
import { SectorDTO } from '../../../../../shared/data/common/sector-dto';
import { CurrencyDTO } from '../../../../../shared/data/common/currency-dto';
import { CurrencyService } from '../../../../../shared/services/setups/currency/currency.service';
import {
  OrganizationDTO,
  OrganizationDivisionDTO,
} from '../../../../../features/crm/data/organization-dto';
import { OrganizationService } from '../../../../../features/crm/services/organization.service';
import { CampaignsDTO } from '../../../../../features/crm/data/campaignsDTO';
import { CampaignsService } from '../../../../../features/crm/services/campaigns..service';
import { StaffService } from '../../../services/staff/staff.service';
import { StaffDto } from '../../../data/StaffDto';
import { Activity } from '../../../../../features/crm/data/activity';
import { ActivityService } from '../../../../../features/crm/services/activity.service';
import { IntermediaryService } from '../../../services/intermediary/intermediary.service';
import { ClientService } from '../../../services/client/client.service';
import { ClientTypeDTO } from '../../../data/ClientDTO';
import { UtilService } from '../../../../../shared/services/util/util.service';
import { EntityService } from '../../../services/entity/entity.service';
import { ProductsService } from '../../../../../features/gis/components/setups/services/products/products.service';
import { ProductService } from '../../../../../features/lms/service/product/product.service';

const log = new Logger('NewLeadComponent');

interface AllProduct {
  code: number;
  description: string;
}

@Component({
  selector: 'app-new-lead',
  templateUrl: './new-lead.component.html',
  styleUrls: ['./new-lead.component.css'],
})
export class NewLeadComponent implements OnInit {
  public createLeadForm: FormGroup;
  public createCommentForm: FormGroup;

  public countryData: CountryDto[] = [];
  public statesData: StateDto[] = [];
  public townData: TownDto[] = [];
  public modeIdentityType: IdentityModeDTO[] = [];
  public clientsTypeData: ClientTypeDTO[] = [];
  public leadTitlesData: ClientTitleDTO[] = [];
  public campaingsData: CampaignsDTO[] = [];
  public occupationsData: OccupationDTO[] = [];
  public leadSourcesData: LeadSourceDto[] = [];
  public leadStatusesData: LeadStatusDto[] = [];
  public leadActivitiesData: Activity[] = [];
  public organizationsData: OrganizationDTO[] = [];
  public divisionsData: OrganizationDivisionDTO[] = [];
  public assignedToData: StaffDto[] = [];
  public teamsData: StaffDto[] = [];
  public systemsData: SystemsDto[] = [];
  public productsData: any[] = [];
  public accountsData: any[] = [];
  public sectorsData: SectorDTO[] = [];
  public currenciesData: CurrencyDTO[] = [];
  public entityDetails: EntityDto;
  public commentsData: LeadCommentDto[] = [];

  public selectedOrg: OrganizationDTO;
  public selectedCountry: number;
  public selectedState: number;
  public selectedOrganization: number;
  public selectedDivision: number;
  private partyId: number;
  public selectedSystem: number;

  public leadType: string = 'I';
  public phoneNumberRegex: string;
  public errorOccurred = false;
  public errorMessage: string = '';
  public groupId: string = 'leadTab';
  public submitted = false;
  public response: any;
  public isCardOpen: boolean[] = [];

  leadBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Account',
      url: '/home/entity',
    },
    {
      label: 'New Lead',
      url: '/home/entity/lead/new',
    },
  ];

  visibleStatus: any = {
    agentType: 'Y',
    clientType: 'Y',
    identityType: 'Y',
    citizenship: 'Y',
    surname: 'Y',
    otherName: 'Y',
    dateOfBirth: 'Y',
    idNumber: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    campaingName: 'Y',
    date: 'Y',
    occupation: 'Y',
    leadStatus: 'Y',
    leadSource: 'Y',
    leadActivity: 'Y',
    leadTitle: 'Y',
    mobileNumber: 'Y',
    telNumber: 'Y',
    emailAddress: 'Y',
    website: 'Y',
    country: 'Y',
    state: 'Y',
    town: 'Y',
    postalAddress: 'Y',
    postalCode: 'Y',
    physicalAddress: 'Y',
    assignedTo: 'Y',
    organization: 'Y',
    division: 'Y',
    team: 'Y',
    system: 'Y',
    product: 'Y',
    accountName: 'Y',
    sector: 'Y',
    currency: 'Y',
    annualRevenue: 'Y',
    potentialAmount: 'Y',
    potentialName: 'Y',
    potentialSaleStage: 'Y',
    potentialContr: 'Y',
    converted: 'Y',
    potentialCloseDate: 'Y',
  };

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private entityService: EntityService,
    private countryService: CountryService,
    private clientService: ClientService,
    private accountService: AccountService,
    private setupsParameterService: SetupsParametersService,
    private leadService: LeadsService,
    private systemService: SystemsService,
    private sectorService: SectorService,
    private occupationServive: OccupationService,
    private currencyService: CurrencyService,
    private organizationService: OrganizationService,
    private campaignService: CampaignsService,
    private activityService: ActivityService,
    private staffService: StaffService,
    private intermediaryService: IntermediaryService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private gisProductService: ProductsService,
    private lmsProductService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createLeadRegistrationForm();
    this.CreateCommentRegistrationForm();
    this.fetchClientType();
    this.fetchCountries();
    this.fetchModeOfIdentity();
    this.fetchLeadTitle();
    this.fetchLeadSources();
    this.fetchLeadStatuses();
    this.fetchLeadActivities();
    this.fetchSystemApps();
    this.fetchSectors();
    this.fetchOccupations();
    this.fetchCurrencies();
    this.fetchOrganizations();
    this.fetchCampaigns();
    this.fetchAssignedTo();
    this.fetchTeams();
    this.fetchAgents();
  }

  ngOnDestroy(): void {}

  toggleCard(index: number) {
    this.isCardOpen[index] = !this.isCardOpen[index];
  }

  onSystemChange(systemId: number) {
    this.selectedSystem = systemId;

    this.productsData = [];

    if (systemId === 37) {
      this.fetchGisProducts();
    } else if (systemId === 27) {
      this.fetchLmsProducts();
    }
  }

  fetchGisProducts() {
    this.productsData = [];
    this.gisProductService
      .getAllProducts()
      .pipe(
        take(1),
        map((data) => {
          const allProducts: AllProduct[] = [];
          data.forEach((product) => {
            const combinedProduct: AllProduct = {
              code: product.code,
              description: product.description,
            };
            allProducts.push(combinedProduct);
          });
          return allProducts;
        })
      )
      .subscribe((data) => {
        this.productsData = data;
        log.info('gis products:', this.productsData);
      });
  }

  fetchLmsProducts() {
    this.productsData = [];
    this.lmsProductService
      .getListOfProduct()
      .pipe(
        take(1),
        map((data) => {
          const allProducts: AllProduct[] = [];
          data.forEach((product) => {
            const combinedProduct: AllProduct = {
              code: product.code,
              description: product.description,
            };
            allProducts.push(combinedProduct);
          });
          return allProducts;
        })
      )
      .subscribe((data) => {
        this.productsData = data;
        log.info('lms products:', this.productsData);
      });
  }

  createLeadRegistrationForm(): void {
    this.createLeadForm = this.fb.group({
      agentType: [''],
      clientType: [''],
      identityType: new FormControl({ value: '', disabled: true }),
      citizenship: [''],
      surname: new FormControl({ value: '', disabled: true }),
      otherName: new FormControl({ value: '', disabled: true }),
      dateOfBirth: new FormControl({ value: '', disabled: true }),
      idNumber: new FormControl({ value: '', disabled: true }),
      pinNumber: new FormControl({ value: '', disabled: true }),
      gender: [''],

      primaryDetails: this.fb.group({
        campaingName: [''],
        date: [''],
        occupation: [''],
        leadStatus: [''],
        leadSource: [''],
        leadActivity: [[]],
      }),

      contactDetails: this.fb.group({
        leadTitle: [''],
        mobileNumber: [''],
        telNumber: [''],
        emailAddress: [''],
        website: [''],
        countryCodeSms: [''],
        countryCodeTel: [''],
      }),

      addressDetails: this.fb.group({
        country: [''],
        state: [''],
        town: [''],
        postalAddress: [''],
        postalCode: [''],
        physicalAddress: [''],
      }),

      organizationDetails: this.fb.group({
        assignedTo: [''],
        organization: [''],
        division: [''],
        team: [''],
        system: [''],
        product: [''],
        accountName: [''],
      }),

      otherDetails: this.fb.group({
        sector: [''],
        currency: [''],
        annualRevenue: [''],
        potentialAmount: [''],
        potentialName: [''],
        potentialSaleStage: [''],
        potentialContr: [''],
        converted: [''],
        potentialCloseDate: [''],
      }),
    });

    this.getEntityDetails();

    let name = 'SMS_NO_FORMAT';
    this.setupsParameterService.getParameters(name).subscribe((data) => {
      data.forEach((field) => {
        if (field.name === 'SMS_NO_FORMAT') {
          this.phoneNumberRegex = field.value;
          this.createLeadForm.controls['contactDetails']
            .get('mobileNumber')
            ?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
          this.createLeadForm.controls['contactDetails']
            .get('mobileNumber')
            ?.updateValueAndValidity();

          this.createLeadForm.controls['contactDetails']
            .get('telNumber')
            ?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
          this.createLeadForm.controls['contactDetails']
            .get('telNumber')
            ?.updateValueAndValidity();
        }
        log.info('parameters>>>', this.phoneNumberRegex);
      });
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          for (const key of Object.keys(this.createLeadForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createLeadForm.controls[key].addValidators(
                  Validators.required
                );
                this.createLeadForm.controls[key].updateValueAndValidity();
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

          const primaryDetailsControls = this.createLeadForm.get(
            'primaryDetails'
          ) as FormGroup;
          for (const key of Object.keys(primaryDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createLeadForm
                  .get(`primaryDetails.${key}`)
                  .setValidators(Validators.required);
                this.createLeadForm
                  .get(`primaryDetails.${key}`)
                  .updateValueAndValidity();
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

          const contactDetailsControls = this.createLeadForm.get(
            'contactDetails'
          ) as FormGroup;
          for (const key of Object.keys(contactDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createLeadForm
                  .get(`contactDetails.${key}`)
                  .addValidators(Validators.required);
                this.createLeadForm
                  .get(`contactDetails.${key}`)
                  .updateValueAndValidity();
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

          const addressDetailsControls = this.createLeadForm.get(
            'addressDetails'
          ) as FormGroup;
          for (const key of Object.keys(addressDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createLeadForm
                  .get(`addressDetails.${key}`)
                  .setValidators(Validators.required);
                this.createLeadForm
                  .get(`addressDetails.${key}`)
                  .updateValueAndValidity();
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
          const organizationDetailsControls = this.createLeadForm.get(
            'organizationDetails'
          ) as FormGroup;
          for (const key of Object.keys(organizationDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createLeadForm
                  .get(`organizationDetails.${key}`)
                  .setValidators(Validators.required);
                this.createLeadForm
                  .get(`organizationDetails.${key}`)
                  .updateValueAndValidity();
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
          const otherDetailsControls = this.createLeadForm.get(
            'otherDetails'
          ) as FormGroup;
          for (const key of Object.keys(otherDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createLeadForm
                  .get(`otherDetails.${key}`)
                  .setValidators(Validators.required);
                this.createLeadForm
                  .get(`otherDetails.${key}`)
                  .updateValueAndValidity();
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
        this.cdr.detectChanges();
      });
  }

  get f() {
    return this.createLeadForm.controls;
  }

  CreateCommentRegistrationForm() {
    this.createCommentForm = this.fb.group({
      comment: ['', Validators.required],
      date: ['', Validators.required],
      disposition: ['', Validators.required],
    });
  }

  getEntityDetails(): void {
    this.partyId = +this.activatedRoute.snapshot.queryParamMap.get('id');
    this.entityService
      .getEntityById(this.partyId)
      .pipe()
      .subscribe({
        next: (entityDetails: EntityDto) => {
          log.info(`fetched lead details`, entityDetails);
          this.patchLeadFormValues(entityDetails);
        },
        error: (err) => {},
      });
  }

  patchLeadFormValues(entityDetails: EntityDto) {
    const nameParts = entityDetails?.name.split(' ');
    const otherName = nameParts?.slice(0, nameParts.length - 1).join(' ') || '';
    const surname = nameParts?.[nameParts.length - 1] || '';
    this.createLeadForm.patchValue({
      otherName: otherName,
      surname: surname,
      pinNumber: entityDetails?.pinNumber,
      dateOfBirth: this.datePipe.transform(
        entityDetails?.dateOfBirth,
        'dd-MM-yyy'
      ),
      idNumber: entityDetails?.identityNumber,
      identityType: entityDetails?.modeOfIdentity?.id,
    });
  }

  selectUserType(e) {
    this.leadType = e.target.value;
    log.info(`userType >>>`, this.leadType, e.target.value);
  }

  onCountryChange() {
    this.createLeadForm.patchValue({
      state: null,
      town: null,
    });

    this.countryService
      .getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statesData = data;
      });
    this.cdr.detectChanges();
  }

  onCityChange() {
    this.countryService
      .getTownsByMainCityState(this.selectedState)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
  }

  onOrganizationChange() {
    this.selectedOrg = null;
    // this.selectedDivision = null;
    this.createLeadForm.patchValue({
      division: null,
    });
    const selectedOrganizationId = this.selectedOrganization;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );
    this.fetchOrganizationDivision(this.selectedOrg.id);
  }

  fetchOrganizationDivision(organizationId: number) {
    this.organizationService
      .getOrganizationDivision(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.divisionsData = data;
            log.info('Division Data', this.divisionsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchCountries() {
    this.countryService
      .getCountries()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.countryData = data;
            log.info('Fetched Countries', this.countryData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchClientType(organizationId?: number) {
    this.clientService
      .getClientType(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.clientsTypeData = data;
            log.info('Fetched Client Type', this.clientsTypeData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchLeadTitle(organizationId?: number) {
    this.accountService
      .getClientTitles(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadTitlesData = data;
            log.info('Fetched Client Title', this.countryData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchModeOfIdentity(organizationId?: number) {
    this.accountService
      .getIdentityMode(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.modeIdentityType = data;
            log.info('Fetched Mode Of Identity', this.modeIdentityType);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchLeadSources() {
    this.leadService
      .getLeadSources()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadSourcesData = data;
            log.info('Fetch Lead Sources', this.leadSourcesData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchLeadStatuses() {
    this.leadService
      .getLeadStatuses()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadStatusesData = data;
            log.info('Fetch Lead Statuses', this.leadStatusesData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchLeadActivities() {
    this.activityService
      .getActivities()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadActivitiesData = data;
            log.info('Fetch Lead Activities', this.leadActivitiesData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchSystemApps(organizationId?: number) {
    this.systemService
      .getSystems(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.systemsData = data;
            log.info('Systems Data:', this.systemsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchSectors(organizationId?: number) {
    this.sectorService
      .getSectors(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.sectorsData = data;
            log.info(`Fetched Sectors Data`, this.sectorsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchOccupations(organizationId?: number) {
    this.occupationServive
      .getOccupations(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.occupationsData = data;
            log.info(`Fetched Occuption Data`, this.occupationsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchCurrencies() {
    this.currencyService
      .getCurrencies()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.currenciesData = data;
            log.info(`Fetched Currency Data`, this.currenciesData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchOrganizations() {
    this.organizationService
      .getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.organizationsData = data;
            log.info(`Fetched Organization Data`, this.organizationsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchCampaigns() {
    this.campaignService
      .getCampaigns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.campaingsData = data;
            log.info(`Fetched Campaigns Data`, this.campaingsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchAssignedTo() {
    this.staffService
      .getStaff(0, 1000, 'U', 'dateCreated', 'desc', null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.assignedToData = data.content;
            log.info('Fetch All Users:', this.assignedToData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchTeams() {
    this.staffService
      .getStaff(0, 1000, 'G', 'dateCreated', 'desc', null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.teamsData = data.content;
            log.info('Fetch All Group Users:', this.teamsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchAgents() {
    this.intermediaryService
      .getAgents(0, 1000)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.accountsData = data.content;
            log.info('Fetch All Agents:', this.accountsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  openCommentModal() {
    const modal = document.getElementById('commentModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCommentModal() {
    const modal = document.getElementById('commentModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveLead() {
    this.submitted = true;
    this.createLeadForm.markAllAsTouched();

    if (this.createLeadForm.invalid) {
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

    const leadFormValues = this.createLeadForm.getRawValue();

    log.info(`Collected Form Values`, leadFormValues);

    const selectedIdentityType = this.modeIdentityType.find(
      (type) => type.id.toString() === leadFormValues.identityType.toString()
    );

    log.info(`selected mode of id`, selectedIdentityType);

    const modeOfIdentity = selectedIdentityType
      ? selectedIdentityType.name
      : null;

    const saveLead: Leads = {
      accountCode: leadFormValues.organizationDetails.accountName,
      activityCodes: leadFormValues.primaryDetails.leadActivity,
      annualRevenue: leadFormValues.otherDetails.annualRevenue,
      campCode: leadFormValues.primaryDetails.campaingName,
      campTel: leadFormValues.contactDetails.telNumber,
      clientType: leadFormValues.clientType,
      code: null,
      companyName: leadFormValues.primaryDetails.companyName,
      converted: leadFormValues.otherDetails.converted,
      countryCode: leadFormValues.addressDetails.country,
      currencyCode: leadFormValues.otherDetails.currency,
      dateOfBirth: leadFormValues.dateOfBirth,
      description: null,
      divisionCode: leadFormValues.organizationDetails.division,
      emailAddress: leadFormValues.contactDetails.emailAddress,
      gender: leadFormValues.gender,
      idNumber: leadFormValues.idNumber,
      industry: leadFormValues.otherDetails.sector,
      leadComments: this.commentsData,
      leadDate: leadFormValues.primaryDetails.date,
      leadSourceCode: leadFormValues.primaryDetails.leadSource,
      leadStatusCode: leadFormValues.primaryDetails.leadStatus,
      mobileNumber: leadFormValues.contactDetails.mobileNumber,
      // modeOfIdentity: leadFormValues.identityType,
      modeOfIdentity: modeOfIdentity,
      occupation: leadFormValues.primaryDetails.occupation,
      organizationCode: leadFormValues.organizationDetails.organization,
      otherNames: leadFormValues.otherName,
      physicalAddress: leadFormValues.addressDetails.physicalAddress,
      postalAddress: leadFormValues.addressDetails.postalAddress,
      postalCode: leadFormValues.addressDetails.postalCode,
      potentialAmount: leadFormValues.otherDetails.potentialAmount,
      potentialCloseDate: leadFormValues.otherDetails.potentialCloseDate,
      potentialContributor: leadFormValues.otherDetails.potentialContr,
      potentialName: leadFormValues.otherDetails.potentialName,
      potentialSaleStage: leadFormValues.otherDetails.potentialSaleStage,
      productCode: leadFormValues.organizationDetails.product,
      stateCode: leadFormValues.addressDetails.state,
      surname: leadFormValues.surname,
      systemCode: leadFormValues.organizationDetails.system,
      teamCode: leadFormValues.organizationDetails.team,
      title: leadFormValues.contactDetails.leadTitle,
      townCode: leadFormValues.addressDetails.town,
      userCode: leadFormValues.organizationDetails.assignedTo,
      userName: null,
      website: leadFormValues.contactDetails.website,
    };

    log.info('Lead Form Values to be saved', saveLead);

    this.leadService.createLead(saveLead).subscribe((data) => {
      this.globalMessagingService.clearMessages();
      this.globalMessagingService.displaySuccessMessage(
        'Success',
        'Successfully Created a Lead'
      );
      this.router.navigate(['/home/entity/lead/list']);
    });
  }

  saveComment() {
    this.submitted = true;
    this.createCommentForm.markAllAsTouched();

    if (this.createCommentForm.invalid) {
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

    const commentFormValues = this.createCommentForm.getRawValue();

    const commentData: LeadCommentDto = {
      code: null,
      comment: commentFormValues.comment,
      date: commentFormValues.date,
      disposition: commentFormValues.disposition,
      leadCode: null,
      userCode: null,
    };
    this.commentsData.push(commentData);
    this.createCommentForm.reset();
    this.closeCommentModal();
  }
}
