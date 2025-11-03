import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {StaffDto} from '../../../data/StaffDto';
import {AgentDTO} from '../../../data/AgentDTO';
import {PartyTypeDto} from '../../../data/partyTypeDto';
import {
  AccountReqPartyId,
  EntityDto,
  IdentityModeDTO,
  PoliciesDTO,
  ReqPartyById,
  Roles,
} from '../../../data/entityDto';
import {Pagination} from '../../../../../shared/data/common/pagination';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize, ReplaySubject, take, takeUntil} from 'rxjs';
import {PartyAccountsDetails} from '../../../data/accountDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityService} from '../../../services/entity/entity.service';
import {AccountService} from '../../../services/account/account.service';
import {DatePipe} from '@angular/common';
import {Logger, UtilService} from '../../../../../shared/services';
import {ClientDTO} from '../../../data/ClientDTO';
import {ServiceProviderRes} from '../../../data/ServiceProviderDTO';
import {NgxSpinnerService} from 'ngx-spinner';
import {QuotationsDTO} from '../../../../gis/data/quotations-dto';
import {ClaimsDTO} from '../../../../gis/data/claims-dto';

import {EntityTransactionsComponent} from './entity-transactions/entity-transactions.component';
import {CountryService} from '../../../../../shared/services/setups/country/country.service';
import {CountryDto, StateDto,} from '../../../../../shared/data/common/countryDto';
import {BankService} from '../../../../../shared/services/setups/bank/bank.service';
import {BankBranchDTO} from '../../../../../shared/data/common/bank-dto';
import {GlobalMessagingService} from '../../../../../shared/services/messaging/global-messaging.service';
import {PrimeIdentityComponent} from "./prime-identity/prime-identity.component";
import {MaritalStatus} from "../../../../../shared/data/common/marital-status.model";
import {ContactComponent} from "./contact/contact.component";
import {AddressComponent} from "./address/address.component";
import {FinancialComponent} from "./financial/financial.component";
import {ClientService} from "../../../services/client/client.service";
import {WealthAmlComponent} from "./wealth-aml/wealth-aml.component";
import {
  DynamicScreensSetupService
} from "../../../../../shared/services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto,
  FormSubGroupsDto,
  SaveAction,
  SaveAddressAction, SaveFinanceAction,
  SubModulesDto
} from "../../../../../shared/data/common/dynamic-screens-dto";

const log = new Logger('ViewEntityComponent');

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity2.component.html',
  styleUrls: ['./view-entity.component.css'],
})
export class ViewEntityComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('rolesDropDown') rolesDropdown;
  @ViewChild(EntityTransactionsComponent) entityTransactionsComponent: EntityTransactionsComponent;
  @ViewChild('primeIdentityRef') primeIdentityComponent!: PrimeIdentityComponent;
  @ViewChild('contactRef') contactComponent!: ContactComponent;
  @ViewChild('addressRef') addressComponent!: AddressComponent;
  @ViewChild('financialRef') financialComponent!: FinancialComponent;
  @ViewChild('wealthAmlRef') wealthAmlComponent!: WealthAmlComponent;

  // entityTransactions: EntityTransactionsComponent;

  public entityDetails: StaffDto | ClientDTO | ServiceProviderRes | AgentDTO;

  unAssignedPartyTypes: PartyTypeDto[] = [];

  selectedRole: PartyTypeDto;
  accounts: Roles[] = [];
  policies: Pagination<PoliciesDTO> = <Pagination<PoliciesDTO>>{};
  quotations: Pagination<QuotationsDTO> = <Pagination<QuotationsDTO>>{};
  claims: Pagination<ClaimsDTO> = <Pagination<ClaimsDTO>>{};

  page = 0;
  pageSize = 5;
  checked: boolean;
  // showRelatedAccountsTab: boolean = false;

  entitySummaryForm: FormGroup;
  selectRoleModalForm: FormGroup;

  url = '';
  entityId: number;
  accountCode: number;
  entityPartyIdDetails: ReqPartyById;

  entityAccountIdDetails: AccountReqPartyId[];

  selectedAccount: AccountReqPartyId;
  selectedFile: File;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year - 4}-${this.month}-${this.day}`;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  partyAccountDetails: PartyAccountsDetails;

  accountId: number;

  countries: CountryDto[] = [];
  states: StateDto[] = [];

  wealthAmlDetails: any;
  // bankDetails: any;
  nokDetails: any[] = [];
  bankBranchDetails: BankBranchDTO;

  partyTypes: PartyTypeDto[];
  selectedTab: string = '360 overview';
  selectedSubTab: string = 'Prime Identity';

  primaryTabs: string[] = [];
  secondaryTabs: string[] = [];

  dynamicDisplay: any = null;

  language: string = 'en';

  // editPrimeDetailsFormConfig: any;
  // editContactFormConfig: any;
  // editAddressFormConfig: any;
  // editFinancialFormConfig: any;
  // editWealthAmlFormConfig: any;

  selectOptions: {
    idTypes: IdentityModeDTO[],
    countries: CountryDto[],
    maritalStatuses: MaritalStatus[]
  } = undefined

  clientDetails: ClientDTO;
  formGroupsAndFieldConfig: any;
  subModuleId: string = '360_overview';
  moduleId: string = 'account_management';
  subModules: SubModulesDto[];

  Save_Action = SaveAction;
  // saveAction: SaveAction;

  // protected readonly SaveAction = SaveAction;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private countryService: CountryService,
    private bankService: BankService,
    private globalMessagingService: GlobalMessagingService,
    private utilService: UtilService,
    private clientService: ClientService,
    private dynamicScreenSetupService: DynamicScreensSetupService,
  ) {
    this.spinner.show();
    this.selectedRole = {};
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  ngOnInit(): void {
    this.fetchSubModules();
    // this.fetchDynamicDisplayConfig();
    // this.edit360ViewFormsConfig();
    this.createEntitySummaryForm();
    this.createSelectRoleForm();
    this.entityId = this.activatedRoute.snapshot.params['id'];
    this.getEntityByPartyId();
    this.getEntityAccountById();
    this.getCountries();
    this.spinner.hide();
  }

  /**
   * Fetch submodules for upper screen display
   */
  fetchSubModules(): void {
    this.dynamicScreenSetupService.fetchSubModules(null, this.moduleId).subscribe({
      next: data => {
        this.subModules = data.filter(el => el.subModuleId.includes('360'));
        this.primaryTabs = this.subModules.map(item => item.originalLabel);
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.message)
      },
    })
  }

  /**
   * This method fetches the setup configuration for Entity360 screen
   */
  fetchDynamicScreenSetup(): void {
    const targetEntityShortDescription: string = this.entityAccountIdDetails[0].partyType.partyTypeShtDesc;

    this.dynamicScreenSetupService.fetchDynamicSetupByScreen(
      null,
      null,
      null,
      this.subModuleId,
      targetEntityShortDescription
    ).subscribe({
      next: (res: DynamicScreenSetupDto) => {
        this.filterGroupsAndFieldsByCategory(res)
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.message)
      },
    })
  }

  /**
   * Filter the screen setup groups and field by category (corporate | individual)
   * @param dynamicScreenSetupDto
   */
  filterGroupsAndFieldsByCategory(dynamicScreenSetupDto: DynamicScreenSetupDto): void {
    const category: string = (this.activatedRoute.snapshot.queryParams['category'])?.toLowerCase();
    const partyTypeShtDesc: string = this.entityAccountIdDetails[0].partyType.partyTypeShtDesc;

    log.info('dynamic screen setup result', dynamicScreenSetupDto);


    let groups: FormGroupsDto[];
    let fields: ConfigFormFieldsDto[];

    const originalFormId = dynamicScreenSetupDto?.forms.find(form => form.originalLabel.toLowerCase() === category);
    const formId = originalFormId?.formId;

    switch (category) {
      case 'corporate':
        groups = dynamicScreenSetupDto.groups.filter((group: FormGroupsDto) => group.formId === formId);
        fields = dynamicScreenSetupDto.fields.filter((group: ConfigFormFieldsDto) => group.formId === formId);
        break;
      case 'individual':
        groups = dynamicScreenSetupDto.groups.filter((group: FormGroupsDto) => group.formId === formId);
        fields = dynamicScreenSetupDto.fields.filter((group: ConfigFormFieldsDto) => group.formId === formId);
        break;
      default:
      //
    }

    this.secondaryTabs = groups.map(item => item.originalLabel)


    // map entity details with fields setup
    /*switch (partyTypeShtDesc) {
      case 'C':
        this.mapClientDetailsWithFieldSetup(this.clientDetails, fields);
        break;
    }*/

    /*log.info('setup groups >>> ', groups);
    log.info ('setup fields >>> ', fields);

    for (const group of groups) {
      group.fields = fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === group.groupId);
      this.secondaryTabs2.push(group.groupId);
    }
    this.dynamicScreenFormGroupSetup = groups;
    this.selectedSubTab = groups[0].groupId;*/
    this.formGroupsAndFieldConfig = { groups, fields };
    log.info('sorted groups with fields >>> ', groups);
  }

  /*fetchDynamicDisplayConfig(): void {
    this.http.get<any>( 'assets/data/dynamicDisplay360View.json').subscribe({
      next: (data: any) => {
        this.dynamicDisplay = data;
        // log.info('dynamicDisplay360View >>> ', data);
        this.dynamicDisplay = this.dynamicDisplay.sort((a, b) => a.order - b.order);

        data.forEach(item => {
          if (item.section_id === 'prime_details') {
            const primaryTabsArr = item.tabs;
            this.primaryTabs = primaryTabsArr.map(item => item.title);
          } else if (item.section_id === 'additional_information') {
            const secondaryTabsArr = item.tabs;
            this.secondaryTabs = secondaryTabsArr.map(item => item.title);
          }

          item.tabs = item.tabs.sort((a, b) => a.order - b.order);
        })

        // log.info(`primary tabs >>> `, this.primaryTabs, this.secondaryTabs);
      },
      error: err => {
        log.error(err);
      }
    });
  }*/


  /*edit360ViewFormsConfig(): void {
    this.http.get<any>( 'assets/data/edit360ViewForms.json').subscribe({
      next: (data: any) => {
        this.editPrimeDetailsFormConfig = data.prime_identity;
        this.editContactFormConfig = data.contact;
        this.editAddressFormConfig = data.address;
        this.editFinancialFormConfig = data.financial;
        this.editWealthAmlFormConfig = data.wealth_aml;
      },
      error: err => {
        log.error(err);
      }
    });
  }*/

  getCountries() {
    this.countryService
      .getCountries()
      .pipe(take(1))
      .subscribe({
        next: (countries: CountryDto[]) => {
          this.countries = countries;
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            errorMessage
          );
        },
      });
  }

  getMainCityStateBy(countryId: number) {
    this.countryService.getMainCityStatesByCountry(countryId).subscribe({
      next: (res) => {
        this.states = res;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
   * Get the branches attached to a branch, and filter the branch assigned to the entity
   * @param bankId
   * @param branchId
   */
  getBankBranchesByBankId(bankId: number, branchId: number): void {
    this.bankService.getBankBranchesByBankId(bankId).subscribe({
      next: (res) => {
        this.bankBranchDetails = res.filter(
          (branch) => branch.id === branchId
        )[0];
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
    Set the account details in form from dropdown list.First item is the default
  * Fetch extra information based on the account type (selectedAccount) and fill form with relevant information
  * Fetch roles not assigned to this entity
   */
  setAccountCode() {

    this.accountCode = this.entityAccountIdDetails?.[0]?.accountCode;
    // this.accountId = this.entityAccountIdDetails?.[0]?.id;
    // this.selectedAccount = this.entityAccountIdDetails?.[0];

    // This fetches the current account set from View Link in other entity tables and set the first account on the dropdown
    this.accountService.currentAccount$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((currentEntityAccount) => {
        this.selectedAccount = this.entityAccountIdDetails?.filter(
          (entity) => entity?.id == currentEntityAccount?.id
        )[0];
        if (this.selectedAccount == null)
          this.selectedAccount = this.entityAccountIdDetails?.[0];
        this.accountCode = this.selectedAccount?.accountCode;
      });

    this.getPartyAccountDetailByAccountId(this.accountCode);
    this.getClientDetails(this.accountCode);
  }

  getClientDetails(clientCode: number) {
    this.clientService.getClientDetailsByClientCode(clientCode).subscribe({
      next: (res) => {
        log.info('clientDetails >>> ', res);
        // this.populateDetailsForDisplay(res);
        this.clientDetails = res;
        this.clientDetails.contactDetails.branchName = res.organizationBranchName;
        this.clientDetails.contactDetails.branchId = res.organizationBranchId;
        this.fetchDynamicScreenSetup();
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Could not fetch client details');
      },
    })
  }

  /***
   * Fetch Entity Accounts - Staff Account, Client Account, Service Provider Account, Intermediary Account
   * @param id representing account code
   */
  getPartyAccountDetailByAccountId(id: number) {
    let accountType =  this.entityAccountIdDetails.find(account =>  account.id == id);
        this.accountService.getAccountDetailsByAccountCode(accountType?.accountCode)
    this.accountService
      .getAccountDetailsByAccountCode(this.accountCode)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: PartyAccountsDetails) => {
        this.partyAccountDetails = data;
        // this.accountService.setCurrentAccounts(accountType);
        this.populateDetailsForDisplay(data);
      });
  }

  populateDetailsForDisplay(partyAccountDetails: PartyAccountsDetails) {
    log.info(
      'This is the selected account data >>>>>',
      this.accountCode,
      partyAccountDetails
    );
    this.getMainCityStateBy(partyAccountDetails?.address.country_id);
    // this.partyAccountDetails = partyAccountDetails;
    this.accountService.setCurrentAccounts(partyAccountDetails);
    // this.getPaymentDetails(partyAccountDetails);
    this.wealthAmlDetails = partyAccountDetails?.wealthAmlDetails;
    this.nokDetails = partyAccountDetails?.nextOfKinDetailsList;
    // this.fetchTransactions(partyAccountDetails);
    // this.cdr.detectChanges();
  }

  /***
   *   Fetch Entity Details e.g ID, PIN, ModeofIdentity, ProfileImage etc
   */
  getEntityByPartyId() {
    this.entityService
      .getEntityByPartyId(this.entityId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data: any) => {
          this.entityPartyIdDetails = data;
          const datePipe = new DatePipe('en-GB'); // TODO: Proper way to fetch locales via constructor injection token

          // log.info(
          //   'This is the Entity Details By PartyId',
          //   this.entityPartyIdDetails
          // );

          this.entitySummaryForm.patchValue({
            contact: null,
            category: this.entityPartyIdDetails?.categoryName,
            taxId: this.entityPartyIdDetails?.modeOfIdentityNumber,
            phoneNumber: null,
            emailAddress: null,
            status: null,
            dateCreated: datePipe.transform(
              this.entityPartyIdDetails?.effectiveDateFrom,
              'dd-MM-yyy'
            ),
            entityName: this.entityPartyIdDetails?.name,
            partyType: this.entityPartyIdDetails?.categoryName,
            primaryIdType: this.entityPartyIdDetails?.modeOfIdentity.name,
            pinNumber: this.entityPartyIdDetails?.pinNumber,
            idNumber: this.entityPartyIdDetails?.modeOfIdentityNumber,
            // profilePicture: null
          });
          this.url = this.entityPartyIdDetails.profileImage
            ? 'data:image/jpeg;base64,' + this.entityPartyIdDetails.profileImage
            : '';
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  /***
   *   Fetch all accounts (AccountReqPartyId[]) for a specific entity
   */
  getEntityAccountById() {
    this.entityService
      .getAccountById(this.entityId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.setAccountCode())
      )
      .subscribe((data: AccountReqPartyId[]) => {
        this.entityAccountIdDetails = data;
        this.getUnAssignedRoles();
        this.entityService.setCurrentEntityAccounts(data);
        this.fetchDynamicScreenSetup();
        // this.fetchAllPartyAccountsDetails();
      });
  }

  /*** Create Summary Form **/
  createEntitySummaryForm() {
    this.entitySummaryForm = this.fb.group({
      contact: ['', Validators.required],
      category: ['', Validators.required],
      taxId: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailAddress: ['', Validators.required],
      status: ['', Validators.required],
      dateCreated: ['', Validators.required],
      entityName: ['', Validators.required],
      partyType: ['', Validators.required],
      primaryIdType: ['', Validators.required],
      pinNumber: ['', Validators.required],
      idNumber: ['', Validators.required],
      profilePicture: [null],
      // partyType: ['']
    });
    // this.entitySummaryForm.addControl('value', this.getPartyAccountDetailByAccountId)
  }

  createSelectRoleForm() {
    this.selectRoleModalForm = this.fb.group({
      partyType: ['', Validators.required],
    });
  }

  onFileChange(event) {
    if (event.target.files) {
      let reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
      };
      this.uploadProfileImage();
    }
  }

  uploadProfileImage() {
    this.entityService
      .uploadProfileImage(this.entityId, this.selectedFile)
      .subscribe((res) => {
        log.info(res);
        this.entityPartyIdDetails.profileImage = res.file;
      });
  }

  onAssignRole(role: AccountReqPartyId) {
    this.selectedRole = role;
    this.goToEntityRoleDefinitions();
  }

  getUnAssignedRoles(): void {
    let allPartyTypes: PartyTypeDto[] = [];
    let assignedPartyTypes: PartyTypeDto[] = this.entityAccountIdDetails.map(
      (o) => o.partyType
    );
    this.entityService
      .getPartiesType() // TODO: Find a better way to store/persist party Types in local storage or use services
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: PartyTypeDto[]) => {
        allPartyTypes = data.filter(
          (partyType) => partyType?.partyTypeLevel === 1
        );

        this.partyTypes = allPartyTypes;

        this.unAssignedPartyTypes = allPartyTypes.filter(
          (o) =>
            !assignedPartyTypes.find(
              (assigned) =>
                o?.partyTypeName.toLowerCase() ===
                assigned?.partyTypeName.toLowerCase()
            )
        );
        // log.info('Assigned party types: ', assignedPartyTypes);
        // log.info('Unassigned party types: ', this.unAssignedPartyTypes);
        // log.info('All party types >>>', allPartyTypes);

        // this.unAssignedPartyTypes = this.unAssignedPartyTypes.length ? this.unAssignedPartyTypes : allPartyTypes;
      });
  }

  goToViewClaims(id: number) {
    this.router.navigate([`/home/gis/claim/list/${this.accountCode}`]);
  }

  goToViewPolicies(id: number) {
    this.router.navigate([`/home/gis/policy/list/${this.accountCode}`]);
  }

  goToEntityRoleDefinitions() {
    const currentEntity: EntityDto = {
      categoryName: this.entityPartyIdDetails.categoryName,
      countryId: this.entityPartyIdDetails.countryId,
      dateOfBirth: this.entityPartyIdDetails.dateOfBirth,
      effectiveDateFrom: this.entityPartyIdDetails.effectiveDateFrom,
      effectiveDateTo: this.entityPartyIdDetails.effectiveDateTo,
      id: this.entityPartyIdDetails.id,
      modeOfIdentity: this.entityPartyIdDetails.modeOfIdentity,
      identityNumber: this.entityPartyIdDetails.identityNumber,
      name: this.entityPartyIdDetails.name,
      organizationId: this.entityPartyIdDetails.organizationId,
      pinNumber: this.entityPartyIdDetails.pinNumber,
      profileImage: this.entityPartyIdDetails.profileImage,
      profilePicture: this.entityPartyIdDetails.profileImage,
      partyTypeId: this.selectedRole.id,
      modeOfIdentityName: '',
    };
    this.entityService.setCurrentEntity(currentEntity);

    let entityRoleName = this.selectedRole?.partyTypeName;
    let url = '';

    switch (entityRoleName?.toLocaleLowerCase()) {
      case 'staff':
        url = '/home/entity/staff/new';
        break;
      case 'client':
        url = '/home/entity/client/new';
        break;
      case 'agent':
        url = '/home/entity/intermediary/new';
        break;
      case 'service provider':
        url = 'home/entity/service-provider/new';
        break;
      default:
        break;
    }
    this.router.navigate([url], {
      queryParams: { id: this.entityPartyIdDetails?.id },
    });
  }

  manageRoles(id: number) {
    this.router.navigate([`/home/entity/manage-roles/${id}`]);
  }

  editEntities(id: number) {
    this.router.navigate([`/home/entity/edit/${id}`]);
  }

  /**
   * fetch all transactions based on the logged in PartyType
   * @param partyAccountDetails required to get account id
   * @returns void
   */
  /*fetchTransactions(partyAccountDetails: PartyAccountsDetails): void {
    this.partyAccountDetails = partyAccountDetails;
    const id: number = partyAccountDetails?.accountCode;
    const username = partyAccountDetails?.userDto?.username;

    const partyTypeShtDesc: string =
      partyAccountDetails?.partyType?.partyTypeShtDesc;

    this.entityTransactions.fetchTransactionsByPartyAndAccountCode(
      partyTypeShtDesc,
      id,
      username,
      this.partyTypes
    );
  }*/

  selectPartyTypeRole(role: AccountReqPartyId): void {
    const accountId: number = role?.id;
    const accountType: AccountReqPartyId = this.entityAccountIdDetails.find(
      (account: AccountReqPartyId): boolean => account.id == accountId
    );

    this.selectedAccount = accountType;
    this.accountService
      .getAccountDetailsByAccountCode(accountType?.accountCode)
      .subscribe({
        next: (data: PartyAccountsDetails): void => {
          this.populateDetailsForDisplay(data);
          // this.fetchTransactions(data);
          log.info(`party account details >>> `, data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          let errorMessage = err?.error?.message ?? err.message;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            errorMessage
          );
        },
      });
  }

  /*getPaymentDetails(partyAccountDetails: PartyAccountsDetails): void {
    if (partyAccountDetails?.paymentDetails?.id) {
      const id: number = partyAccountDetails?.paymentDetails?.bank_branch_id;
      this.entityService.fetchBankDetailsByBranchId(id).subscribe({
        next: (bank: Bank) => {
          this.bankDetails = {
            ...bank,
            accountNo: partyAccountDetails?.paymentDetails?.account_number,
            paymentMethod: 'xxx',
            accountType: 'xxx',
            partyAccountId: partyAccountDetails?.paymentDetails?.partyAccountId,
          };
          log.info(`Bank details ==> `, this.bankDetails);
          this.getBankBranchesByBankId(bank.bankId, bank.id);
        },
        error: (err) => {},
      });
    } else {
      this.bankDetails = null;
      log.info(`Bank details ==> `, this.bankDetails);
    }
  }*/


  selectTab(tab: any): void {
    log.info('selectTab', tab);
    this.selectedTab = this.primaryTabs.includes(tab.originalLabel) ? tab.originalLabel : this.selectedTab;
    this.selectedSubTab = this.secondaryTabs.includes(tab.originalLabel) ? tab.originalLabel : this.selectedSubTab;
  }

  openEditModal(subgroup: FormSubGroupsDto): void {
    const tabTitle = subgroup.originalLabel
    log.info('openEditModal', tabTitle, subgroup);
    switch (tabTitle.toLowerCase()) {
      case 'prime identity':
        this.primeIdentityComponent.openEditPrimeIdentityDialog();
        break;
      case 'contact details':
        this.contactComponent.openEditContactDialog(subgroup, SaveAction.EDIT_CONTACT_DETAILS);
        break;
      case 'address details':
        this.addressComponent.openEditAddressDialog(subgroup, SaveAddressAction.EDIT_ADDRESS_DETAILS);
        break;
      case 'financial details':
        this.financialComponent.openEditFinancialDialog(subgroup, SaveFinanceAction.EDIT_FINANCE_DETAILS);
        break;
      case 'Wealth And Anti-money Laundering Details':
        this.wealthAmlComponent.openEditWealthAmlDialog(false);
        break;
      default:
          // do something
    }
  }

  /*fetchSelectOptions(): void {
    log.info(`fetching select options >>> `);
    forkJoin({
      idTypes: this.entityService.getIdentityType(),
      countries: this.countryService.getCountries(),
      maritalStatuses: this.maritalStatusService.getMaritalStatus()
    }).subscribe({
      next: data => {
        this.selectOptions = {
          idTypes: data.idTypes,
          countries: data.countries,
          maritalStatuses: data.maritalStatuses,
        }
        this.countries = data.countries;
        log.info(`select options >>> `, data);
        // this.cdr.detectChanges();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        log.error(`could not fetch: `, err);
      }
    });
  }*/

  protected readonly open = open;
}
