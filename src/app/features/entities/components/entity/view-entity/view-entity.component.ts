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
import {finalize, ReplaySubject, takeUntil} from 'rxjs';
import {PartyAccountsDetails} from '../../../data/accountDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityService} from '../../../services/entity/entity.service';
import {AccountService} from '../../../services/account/account.service';
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
  SubModulesDto
} from "../../../../../shared/data/common/dynamic-screens-dto";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";

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

  entityDetails: StaffDto | ClientDTO | ServiceProviderRes | AgentDTO;

  unAssignedPartyTypes: PartyTypeDto[] = [];

  selectedRole: PartyTypeDto;
  accounts: Roles[] = [];
  policies: Pagination<PoliciesDTO> = <Pagination<PoliciesDTO>>{};
  quotations: Pagination<QuotationsDTO> = <Pagination<QuotationsDTO>>{};
  claims: Pagination<ClaimsDTO> = <Pagination<ClaimsDTO>>{};

  page = 0;
  pageSize = 5;
  checked: boolean;

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
  // nokDetails: any[] = [];
  bankBranchDetails: BankBranchDTO;

  partyTypes: PartyTypeDto[];
  selectedTab: string = '360 overview';
  selectedSubTab: string = 'Prime Identity';

  primaryTabs: string[] = [];
  secondaryTabs: string[] = [];

  dynamicDisplay: any = null;

  language: string = 'en';

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
    private intermediaryService: IntermediaryService,
  ) {
    this.spinner.show();
    this.selectedRole = {};
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  ngOnInit(): void {
    this.fetchSubModules();
    this.entityId = this.activatedRoute.snapshot.params['id'];
    const partyType = this.activatedRoute.snapshot.queryParams['partyType'];

    if (partyType === 'intermediary') {
      this.getAgentById(this.entityId, partyType);
    }

    this.getEntityAccountById(this.entityId);
    // this.getEntityByPartyId();
    this.getEntityByAccountId(this.entityId);
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


  getAgentById(id: number, partyType?: string): void {
    this.intermediaryService.getAgentDetailsById(id).subscribe({
      next: (data: AgentDTO) => {
        this.entityDetails = data;
        if (partyType) {
          this.getEntityByAccountId(data.partyId);
          this.getPartyAccountDetailByAccountId(this.entityId);
        }
      },
      error: (err: Error) => {
        this.globalMessagingService.displayErrorMessage('Error', err.message);
      }
    })
  }

  getEntityByAccountId(id: number): void {
    this.entityService.getAccountById(id).subscribe({
      next: (data: AccountReqPartyId[]) => {
        this.entityAccountIdDetails = data;
        const partyType = data[0]?.partyType.partyTypeShtDesc;
        const accountCode = data[0]?.accountCode;

        if (partyType === 'A') {
          this.getAgentById(accountCode);
        } else if (partyType === 'C') {
          this.getClientDetails(accountCode);
        }
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.message);
      }
    })
  }

  /**
   * This method fetches the setup configuration for Entity360 screen
   */
  fetchDynamicScreenSetup(): void {
    const targetEntityShortDescription = this.partyAccountDetails?.partyType?.partyTypeShtDesc;

    this.dynamicScreenSetupService.fetchDynamicSetupByScreen(
      null,
      null,
      null,
      this.subModuleId,
      targetEntityShortDescription
    ).subscribe({
      next: (res: DynamicScreenSetupDto) => {
        log.info('dynamic screen setup ', res);
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
    this.formGroupsAndFieldConfig = { groups, fields };
    log.info('sorted groups with fields >>> ', groups);
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
    // this.getClientDetails(this.accountCode);
  }

  getClientDetails(clientCode: number) {
    this.clientService.getClientDetailsByClientCode(clientCode).subscribe({
      next: (res) => {
        this.clientDetails = res;
        this.entityDetails = res;
        this.fetchDynamicScreenSetup();
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.message);
      },
    })
  }

  /***
   * Fetch Entity Accounts - Staff Account, Client Account, Service Provider Account, Intermediary Account
   * @param id representing account code
   */
  getPartyAccountDetailByAccountId(id: number): void {
    this.accountService.getAccountDetailsByAccountCode(id).subscribe({
      next: (data) => {
        this.partyAccountDetails = data;
        this.fetchDynamicScreenSetup();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.message);
      }
    })
  }

  populateDetailsForDisplay(partyAccountDetails: PartyAccountsDetails) {
    log.info(
      'This is the selected account data >>>>>',
      this.accountCode,
      partyAccountDetails
    );
    this.getMainCityStateBy(partyAccountDetails?.address.country_id);
    this.accountService.setCurrentAccounts(partyAccountDetails);
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
          this.url = this.entityPartyIdDetails.profileImage
            ? 'data:image/jpeg;base64,' + this.entityPartyIdDetails.profileImage
            : '';
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      );
  }

  /***
   *   Fetch all accounts (AccountReqPartyId[]) for a specific entity
   */
  getEntityAccountById(id: number) {
    this.entityService.getAccountById(id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.setAccountCode())
      )
      .subscribe((data: AccountReqPartyId[]) => {
        this.entityAccountIdDetails = data;
        this.getUnAssignedRoles();
        this.entityService.setCurrentEntityAccounts(data);
      });
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
        this.addressComponent.openEditAddressDialog(subgroup, SaveAction.EDIT_ADDRESS_DETAILS);
        break;
      case 'financial details':
        this.financialComponent.openEditFinancialDialog(subgroup, SaveAction.EDIT_FINANCE_DETAILS);
        break;
      case 'Wealth And Anti-money Laundering Details':
        this.wealthAmlComponent.openEditWealthAmlDialog(false);
        break;
      default:
          // do something
    }
  }

  protected readonly open = open;
}
