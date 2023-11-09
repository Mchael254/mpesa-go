import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { StaffDto } from '../../../data/StaffDto';
import { AgentDTO } from '../../../data/AgentDTO';
import { PartyTypeDto } from '../../../data/partyTypeDto';
import { AccountReqPartyId, EntityDto, PoliciesDTO, ReqPartyById, Roles } from '../../../data/entityDto';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, finalize, takeUntil, tap } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';
import { PartyAccountsDetails } from '../../../data/accountDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityService } from '../../../services/entity/entity.service';
import { StaffService } from '../../../services/staff/staff.service';
import { AccountService } from '../../../services/account/account.service';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { IntermediaryService } from '../../../services/intermediary/intermediary.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../services/client/client.service';
import { Logger } from '../../../../../shared/services/logger/logger.service';
// import { Logger } from '../../../../../shared/services/logger.service';
import { ClientDTO } from '../../../data/ClientDTO';
import { ServiceProviderRes } from '../../../data/ServiceProviderDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuotationsDTO } from '../../../../../features/gis/data/quotations-dto';
import { ClaimsDTO } from '../../../../../features/gis/data/claims-dto';

const log = new Logger("ViewEntityComponent")

@Component({
  selector: 'app-view-entity',
  templateUrl: './view-entity.component.html',
  styleUrls: ['./view-entity.component.css']
})
export class ViewEntityComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('rolesDropDown') rolesDropdown;

  public entityDetails: StaffDto | ClientDTO | ServiceProviderRes | AgentDTO;

  unAssignedPartyTypes: PartyTypeDto[] = [];
  selectedRole: PartyTypeDto;
  accounts: Roles[]=[];
  policies: Pagination<PoliciesDTO> = <Pagination<PoliciesDTO>>{};
  quotations: Pagination<QuotationsDTO> = <Pagination<QuotationsDTO>>{};
  claims: Pagination<ClaimsDTO> = <Pagination<ClaimsDTO>>{};

  page = 0;
  pageSize = 5;
  checked: boolean;
  showRelatedAccountsTab: boolean = false;

  entitySummaryForm: FormGroup;
  selectRoleModalForm: FormGroup;

  url = ""
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
  dateFrom = `${this.year-4}-${this.month}-${this.day}`;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public pieChartOptions: ChartOptions =  {
    responsive: true,
  };
  public pieChartLabels: any[] = ['Motor', 'PA', 'Domestic'];
  public pieChartData: any = [ {data: [23, 25, 30]}];
  public pieChartType: ChartType = "doughnut";
  public  pieChartLegend = true;
  public pieChartPlugins = [];

  partyAccountDetails: PartyAccountsDetails;
  accountId: number;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private accountService: AccountService,
    private staffService: StaffService,
    private clientService: ClientService,
    private serviceProviderService: ServiceProviderService,
    private intermediaryService: IntermediaryService,
    // private datePipe: DatePipe,
    // private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this.selectedRole = {};
  }

  ngOnInit(): void {

    this.createEntitySummaryForm();
    this.createSelectRoleForm();
    this.entityId = this.activatedRoute.snapshot.params['id'];
    log.info(`Entity id is ${this.entityId}`);
    this.getEntityByPartyId();
    this.getEntityAccountById();
  }

  /*
   Set the account details in form from dropdown list.First item is the default
  * Fetch extra information based on the account type (selectedAccount) and fill form with relevant information
  * Fetch roles not assigned to this entity
   */
  setAccountCode() {
    log.info('entityAccountIdDetails: ' +this.entityAccountIdDetails);

    this.accountCode = this.entityAccountIdDetails?.[0]?.accountCode;
    // this.accountId = this.entityAccountIdDetails?.[0]?.id;
    // this.selectedAccount = this.entityAccountIdDetails?.[0];

    // This fetches the current account set from View Link in other entity tables and set the first account on the dropdown
    this.accountService.currentAccount$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(currentEntityAccount => {
        this.selectedAccount = this.entityAccountIdDetails.filter( (entity) => entity?.id == currentEntityAccount?.id)[0];
        if(this.selectedAccount == null)  this.selectedAccount = this.entityAccountIdDetails?.[0];
        this.accountCode = this.selectedAccount?.accountCode;
      });

    // this.getEntityAccountDetailsByAccountNo(this.accountCode);
    this.getPartyAccountDetailByAccountId(this.accountCode);
    // this.getPoliciesByClientId(this.page, this.dateFrom, this.dateToday,  this.accountCode);
    // this.getQuotationsByClientId(this.page, this.dateFrom, this.dateToday,  this.accountCode);
    // this.getClaimsByClientId(this.page, this.dateFrom, this.dateToday,  this.accountCode);
  }

      /***
   * Fetch Entity Accounts - Staff Account, Client Account, Service Provider Account, Intermediary Account
   * @param id representing account code
   */
       getPartyAccountDetailByAccountId(id: number) {
        /*let accountType =  this.entityAccountIdDetails.find(account =>  account.id == id);
        this.accountService.getAccountDetailsByAccountCode(accountType?.accountCode)*/
        this.accountService.getAccountDetailsByAccountCode(this.accountCode)
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe((data: PartyAccountsDetails) => {
          this.partyAccountDetails = data
          log.info('This is the selected account data >>>>>', this.partyAccountDetails);
          // this.accountService.setCurrentAccounts(accountType);
          this.accountService.setCurrentAccounts(this.partyAccountDetails);
          this.cdr.detectChanges();
        })

      }

  /***
   *   Fetch Entity Details e.g ID, PIN, ModeofIdentity, ProfileImage etc
    */
  getEntityByPartyId() {
    this.entityService.getEntityByPartyId(this.entityId)
    .pipe(
      takeUntil(this.destroyed$),
    )
    .subscribe(
      (data: any) => {
        this.entityPartyIdDetails = data;
        const datePipe = new DatePipe('en-GB'); // TODO: Proper way to fetch locales via constructor injection token

        console.log('This is the Entity Details By PartyId', this.entityPartyIdDetails)

        this.entitySummaryForm.patchValue({
          contact: null,
          category: this.entityPartyIdDetails?.categoryName,
          taxId: this.entityPartyIdDetails?.modeOfIdentityNumber,
          phoneNumber: null,
          emailAddress: null,
          status: null,
          dateCreated: datePipe.transform(this.entityPartyIdDetails?.effectiveDateFrom, 'dd-MM-yyy'),
          entityName: this.entityPartyIdDetails?.name,
          partyType: this.entityPartyIdDetails?.categoryName,
          primaryIdType: this.entityPartyIdDetails?.modeOfIdentity.name,
          pinNumber: this.entityPartyIdDetails?.pinNumber,
          idNumber: this.entityPartyIdDetails?.modeOfIdentityNumber,
          // profilePicture: null
        })
        this.url = this.entityPartyIdDetails.profileImage ?
                   'data:image/jpeg;base64,' + this.entityPartyIdDetails.profileImage
                  : '';
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      error => {this.spinner.hide();}
    )
  }


  /***
   *   Fetch all accounts (AccountReqPartyId[]) for a specific entity
    */
  getEntityAccountById() {
    this.entityService.getAccountById(this.entityId)
    .pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.setAccountCode())
    )
    .subscribe(
      (data: AccountReqPartyId[]) => {
        this.entityAccountIdDetails = data;
        this.getUnAssignedRoles();
        this.entityService.setCurrentEntityAccounts(data);

        log.info('>>>>>>>>>>> Fetch entity accounts details by entity id', this.entityAccountIdDetails)
        this.fetchAllPartyAccountsDetails();
      }
    )

  }

  // /***
  //  * Fetch Entity Accounts - Staff Account, Client Account, Service Provider Account, Intermediary Account
  //  * @param id representing account code
  //  */
  // getEntityAccountDetailsByAccountNo(id: number) {
  //     let accountType =  this.entityAccountIdDetails.find(account =>  account.id == id);
  //     this.entityService.setCurrentAccount(accountType);
  //     if(accountType){
  //       switch (accountType?.partyType?.partyTypeName.toLowerCase()) {
  //         case 'staff':
  //           this.fetchStaffDetails(accountType?.accountCode);
  //           break;
  //         case 'client':
  //           this.fetchClientDetails(accountType?.accountCode);
  //           break;
  //         case 'service provider':
  //           this.fetchServiceProviderDetails(accountType?.accountCode);
  //           break;
  //         case 'agent':
  //           this.fetchIntermediaryDetails(accountType?.accountCode);
  //           break;
  //         default:
  //           break;
  //       }
  //   }

  // }

  // /***
  //  * Fetch Entity Accounts - Staff Account
  //  * @param accountCode
  //  */
  // fetchStaffDetails(accountCode: number){
  //   this.staffService.getStaffById(accountCode)
  //     .pipe(
  //       takeUntil(this.destroyed$),
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.entityDetails = data;

  //         console.log('>>>>>>>>>>> Fetching partyType staff details using accountCode', this.entityDetails)
  //       }
  //     );
  // }

  // /***
  //  * Fetch Entity Accounts - Client Account
  //  * @param accountCode
  //  */
  // fetchClientDetails(accountCode: number){
  //   this.clientService.getClientById(accountCode)
  //     .pipe(
  //       takeUntil(this.destroyed$),
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.entityDetails = data;

  //         console.log('>>>>>>>>>>> Fetching partyType client details using accountCode', this.entityDetails)

  //       }
  //     )
  // }


  // /***
  //  * Fetch Entity Accounts - Intermediary Account
  //  * @param accountCode
  //  */
  // fetchIntermediaryDetails(accountCode: number){
  //   this.intermediaryService.getAgentById(accountCode)
  //     .pipe(
  //       takeUntil(this.destroyed$),
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.entityDetails = data;

  //         console.log('>>>>>>>>>>> Fetching partyType intermediary details using accountCode', this.entityDetails)
  //       }
  //     );
  // }

  // /***
  //  * Fetch Entity Accounts - Service Provider Account
  //  * @param accountCode
  //  */
  // fetchServiceProviderDetails(accountCode: number){
  //   this.serviceProviderService.getServiceProviderById(accountCode)
  //     .pipe(
  //       takeUntil(this.destroyed$),
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.entityDetails = data;

  //         console.log('>>>>>>>>>>> Fetching partyType intermediary details using accountCode', this.entityDetails)

  //       }
  //     )
  // }

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
      var reader = new FileReader()
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
      }
      this.uploadProfileImage();
    }
  }

  uploadProfileImage() {
    this.entityService.uploadProfileImage(this.entityId, this.selectedFile)
      .subscribe( res => {
        log.info(res);
        this.entityPartyIdDetails.profileImage = res.file;
      });
  }

  onAssignRole(role) {
    this.selectedRole = role;
    this.closebutton.nativeElement.click();
    this.goToEntityRoleDefinitions();
  }

  getUnAssignedRoles() {
    let allPartyTypes: PartyTypeDto[] = [];
    let assignedPartyTypes: PartyTypeDto[] = this.entityAccountIdDetails.map(o => o.partyType);
    this.entityService.getPartiesType() // TODO: Find a better way to store/persist party Types in local storage or use services
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((data: PartyTypeDto[]) => {
        allPartyTypes = data.filter( partyType => partyType?.partyTypeLevel === 1);
        this.unAssignedPartyTypes = allPartyTypes.filter((o) =>
          !assignedPartyTypes.find(assigned => o?.partyTypeName.toLowerCase() === assigned?.partyTypeName.toLowerCase())
        );
        log.info('Assigned party types: ', assignedPartyTypes);
        log.info('Unassigned party types: ', this.unAssignedPartyTypes);

        this.unAssignedPartyTypes = this.unAssignedPartyTypes.length ? this.unAssignedPartyTypes : allPartyTypes;
      });
  }

  goToViewClaims(id:number) {
    this.router.navigate([`/home/gis/claim/list/${this.accountCode}`]);
  }

  goToViewPolicies(id:number) {
    this.router.navigate([`/home/gis/policy/list/${this.accountCode}`]);
  }

  goToViewQuotations(id:number) {
    // this.router.navigate([`/home/gis/quotation/list/${this.accountCode}`]);
    this.router.navigate([`/home/gis/quotation/list`]);
  }

  goToViewPayments() {
    // this.router.navigate(['home/payments']);
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
      modeOfIdentityName: ''
    }
    this.entityService.setCurrentEntity(currentEntity);

    let entityRoleName = this.selectedRole?.partyTypeName;

    switch (entityRoleName?.toLocaleLowerCase()) {
      case 'staff':
        this.router.navigate(['/home/entity/staff/new']);
        break;
      case 'client':
        this.router.navigate(['/home/entity/client/new']);
        break;
      case 'agent':
        this.router.navigate(['/home/entity/intermediary/new']);
        break;
      case 'service provider':
        this.router.navigate(['home/entity/service-provider/new']);
        break;
      default:
        break;
    }
  }

  selectAccount(event: any) {
    if(event){
      let accountId: number = Number((event.target as HTMLInputElement).value);
      let accountType =  this.entityAccountIdDetails.find(account =>  account.id == accountId);
      // this.getEntityAccountDetailsByAccountNo(accountId);
      this.accountCode = accountType?.accountCode;
      this.getPartyAccountDetailByAccountId(accountType?.accountCode);
    }
  }

  manageRoles(id: number) {
    this.router.navigate([ `/home/entity/manage-roles/${id}`]);
  }

  editEntities(id: number) {
    this.router.navigate([`/home/entity/edit/${id}`]);
  }

  private fetchAllPartyAccountsDetails() {
    let fetchedAccounts: PartyAccountsDetails[] = [];
    this.entityService.currentEntityAccount$
        .pipe(
            takeUntil(this.destroyed$)
        )
        .subscribe(
            (data:AccountReqPartyId[]) => {
                data.forEach(
                    value =>
                        this.accountService.getPartyAccountById(value.id)
                            .pipe()
                            .subscribe(
                                partyAccount =>
                                    fetchedAccounts.push(partyAccount)
                            )
                );
            }
        )

    this.entityService.setCurrentPartyAcounts(fetchedAccounts);
  }

  // getPoliciesByClientId(
  //   pageIndex: number,
  //   dateFrom: string,
  //   dateTo: string,
  //   id: number
  // ) {
  //     if (id === null || id === undefined) {
  //       // Handle the case when id is not available
  //       console.log('ID is not available');
  //       return;
  //     }


  //     return this.policiesServices
  //       .getPolicies(pageIndex, dateFrom, dateTo, id)
  //       .pipe(
  //         takeUntil(this.destroyed$),
  //         tap((data) => log.info(`Fetching Policies>>>`, data))
  //       )
  //       .subscribe(
  //         (data: Pagination<PoliciesDTO>) => {
  //           this.policies = data;
  //           this.cdr.detectChanges();
  //         }
  //       );
  // }

  // getQuotationsByClientId(
  //   pageIndex: number,
  //   dateFrom: string,
  //   dateTo: string,
  //   id: number
  // ) {
  //     if (id === null || id === undefined) {
  //       // Handle the case when id is not available
  //       console.log('ID is not available');
  //       return;
  //     }

  //     return this.quotationsService
  //       .getQuotations(pageIndex, dateFrom, dateTo, id)
  //       .pipe(
  //         takeUntil(this.destroyed$),
  //         tap((data) => log.info(`Fetching Quotations>>>`, data))
  //       )
  //       .subscribe(
  //         (data: Pagination<QuotationsDTO>) => {
  //           this.quotations = data;
  //           this.cdr.detectChanges();
  //         }
  //       );
  // }

  // getClaimsByClientId(
  //   pageIndex: number,
  //   dateFrom: string,
  //   dateTo: string,
  //   id: number
  // ) {
  //     if (id === null || id === undefined) {
  //       // Handle the case when id is not available
  //       console.log('ID is not available');
  //       return;
  //     }

  //     return this.claimsService
  //       .getClaims(pageIndex, dateFrom, dateTo, id)
  //       .pipe(
  //         takeUntil(this.destroyed$),
  //         tap((data) => log.info(`Fetching Claims>>>`, data))
  //       )
  //       .subscribe(
  //         (data: Pagination<ClaimsDTO>) => {
  //           this.claims = data;
  //           this.cdr.detectChanges();
  //         }
  //       );
  // }

}
