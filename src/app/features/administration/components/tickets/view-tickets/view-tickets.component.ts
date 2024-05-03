import {ChangeDetectorRef, Component, OnInit, signal, ViewChild} from '@angular/core';
import {NewTicketDto, TicketModuleDTO, TicketsDTO, TicketTypesDTO} from "../../../data/ticketsDTO";
import {AuthService} from "../../../../../shared/services/auth.service";
import {catchError} from "rxjs/internal/operators/catchError";
import {TicketsService} from "../../../services/tickets.service";
import cubejs, {Query} from "@cubejs-client/core";
import {ActivatedRoute, Router} from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import {Table} from "primeng/table/table";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import { NgxSpinnerService } from 'ngx-spinner';
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {Logger} from "../../../../../shared/services/logger/logger.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReplaySubject, takeUntil, tap} from "rxjs";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {TableDetail} from "../../../../../shared/data/table-detail";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {AuthorizePolicyModalComponent} from "../authorize-policy-modal/authorize-policy-modal.component";
import {PolicyDetailsDTO} from "../../../data/policy-details-dto";

const log = new Logger('ViewTicketsComponent');
@Component({
  selector: 'app-view-tickets',
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css']
})
export class ViewTicketsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  public filteredTickets: NewTicketDto[] = [];
  private allTickets: NewTicketDto[] = [];
  selectedTickets: NewTicketDto[] = [];

  public springTickets: Pagination<TicketsDTO> =  <Pagination<TicketsDTO>>{};
  selectedSpringTickets: TicketsDTO[] = [];
  public filteredSpringTickets: TicketsDTO[] = [];
  private allSpringTickets: TicketsDTO[] = [];

  pageSize: 10;
  ticketModules: TicketModuleDTO[] = [];

  showReassignTicketsModal: boolean;

  public sortingForm: FormGroup;
  ticketTypesData : TicketTypesDTO[];

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year-4}-${this.month}-${this.day}`;

  tableDetails: TableDetail;

  filterObject: {
    createdOn:string, ticketName:string, refNo:string, clientName:string, intermediaryName:string, ticketFrom:string, ticketAssignee:string
  } = {
    createdOn:'', ticketName:'', refNo:'', clientName:'' , intermediaryName:'', ticketFrom:'', ticketAssignee:''
  };

  isSearching = false;

  searchData : Pagination<TicketsDTO> =  <Pagination<any>>{};
  activityName: string;
  totalTickets: number;
  filterPayload: any[]= [];
  policyDetails: PolicyDetailsDTO;

  globalFilterFields = [
    'createdOn',
    'ticketName',
    'refNo',
    'clientName',
    'intermediaryName',
    'ticketFrom',
    'ticketAssignee',
    'ticketID',
    'systemModule'];

  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private filterKey: string = '';
  @ViewChild(AuthorizePolicyModalComponent) authorizePolicyComponent: AuthorizePolicyModalComponent;

  constructor(
    private authService: AuthService,
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private policiesService: PoliciesService,
  )
  {

  }
  ngOnInit(): void {
    // this.getAllTicketsFromCubeJs();
    this.createSortForm();
    this.getAllTicketTypes();
    this.getAllTicketModules();

    log.info("ticket obj",this.ticketsService.ticketFilterObject());

    const ticketFilter:any = this.ticketsService.ticketFilterObject();

    if(ticketFilter?.fromDashboardScreen) {
      this.ticketsService
        .getAllTickets(0, ticketFilter?.totalTickets, this.dateFrom || null, this.dateToday || null, '', '', 'name', ticketFilter?.activityName)
        .subscribe({
          next: (data) => {
            this.springTickets = data;
            this.spinner.hide();
            log.info("ticket subsc",this.ticketsService.ticketFilterObject());
            this.ticketsService.ticketFilterObject = signal({});
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage('Error', err.message);
          }
        });
    }
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    /*if (Object.keys(queryParams).length > 0) {
      // Remove query parameters
      const navigationExtras: NavigationExtras = {
        queryParams: {}  // Empty object to clear all query parameters
      };
      // Navigate to the same route without query parameters
      this.router.navigate([], navigationExtras);
    }*/
  }

  getAllTicketsFromCubeJs() {
    this.spinner.show();
    const assignee = this.authService.getCurrentUserName()
    const query: Query = {
      dimensions: [
        "General_Ticket_Details.intermediaryName",
        "General_Ticket_Details.clientName",
        "General_Ticket_Details.ticketAssignee",
        "General_Ticket_Details.ticketID",
        "General_Ticket_Details.createdOn",
        "General_Ticket_Details.refNo",
        "General_Ticket_Details.ticketFrom",
        "General_Ticket_Details.ticketName",
        "General_Ticket_Details.ticketSystem",
        "General_Ticket_Details.policyNumber",
        "General_Ticket_Details.ticketBy",
        "General_Ticket_Details.ticketDate",
        "General_Ticket_Details.ticketDueDate",
        "General_Ticket_Details.ticketRemarks",
        "General_Ticket_Details.claimNumber",
        "General_Ticket_Details.systemModule",
        "General_Ticket_Details.totalSI",
        "General_Ticket_Details.renewalDate",
        "General_Ticket_Details.currency",
        "General_Ticket_Details.endorsementNumber",
        "General_Ticket_Details.quotationNumber",
        "General_Ticket_Details.policyCode",
        "General_Ticket_Details.ticketType",
        "General_Ticket_Details.usrCode"
      ],
      filters: [
        {member:"General_Ticket_Details.ticketAssignee","operator":"contains","values": ['IBRAHIM']},
      ]
    }

    this.cubejsApi.load(query).then(resultSet => {
      const ticketData = resultSet.chartPivot().map((c) => c.xValues);
      const labels = [
        "intermediaryName",
        "clientName",
        "ticketAssignee",
        "ticketID",
        "createdOn",
        "refNo",
        "ticketFrom",
        "ticketName",
        "ticketSystem",
        "policyNumber",
        "ticketBy",
        "ticketDate",
        "ticketDueDate",
        "ticketRemarks",
        "claimNumber",
        "systemModule",
        "totalSI",
        "renewalDate",
        "currency",
        "endorsementNumber",
        "quotationNumber",
        "policyCode",
        "ticketType",
        "usrCode"
      ]

      ticketData.forEach((ticketDetails) => {
        log.info(`==============================`)
        const ticket: NewTicketDto = {}
        ticketDetails.forEach((labelValue, i) => {
          ticket[labels[i]] = labelValue;
        })
        this.allTickets.push(ticket);
        this.ticketsService.setCurrentTickets(this.allTickets);


        // Extracting all the code values from the tickets
        const codeValues = this.allTickets.map(ticket => ticket.systemModule);

        // Passing the code values to the getCodeValue method
        const result = codeValues.map(code => this.getTicketCode(code));
      })

      this.filteredTickets = this.allTickets;
        log.info(`allTickets >>>`, this.allTickets);
        this.cdr.detectChanges();
        this.spinner.hide();
    }).catch(() =>{
      this.spinner.hide();
    })

  }

  getAllTickets(
    pageIndex: number,
    pageSize: number,
    sort: string = '',
    query: string = '',
    queryColumn: string = '') {
    this.spinner.show();
    if (this.filterObject[this.filterKey]) {
        return this.searchTicketsDup(this.filterKey, pageIndex, pageSize);
    }
    else {
      return this.ticketsService.getAllTickets(pageIndex, pageSize, "", "", sort, '', query, queryColumn, )
        .pipe(
          takeUntil(this.destroyed$),
          tap((data) => log.info('Fetch Tickets data>> ', data))
        );
    }
    log.info('>>',this.filterObject[this.filterKey])

  }

  lazyLoadTickets(event:LazyLoadEvent | TableLazyLoadEvent) {

    const ticketFilter:any = this.ticketsService.ticketFilterObject();

    if(!ticketFilter?.fromDashboardScreen) {
      const pageIndex = event.first / event.rows;
      const queryColumn = event.sortField;
      const sort = event.sortOrder === -1 ? `-${event.sortField}` : event.sortField;
      const pageSize = event.rows;
      log.info('sortorder',queryColumn);

      this.getAllTickets(pageIndex, pageSize,sort?.toString())
        .pipe(untilDestroyed(this))
        .subscribe((data:Pagination<TicketsDTO>) => {
          this.springTickets = data;
          this.cdr.detectChanges();
          this.ticketsService.setCurrentTickets(this.springTickets.content);
          this.spinner.hide();

          // Extracting all the code values from the tickets
          const codeValues = this.springTickets.content.map(ticket => ticket.ticket.sysModule);

          // Passing the code values to the getCodeValue method
          const result = codeValues.map(code => this.getTicketCode(code));

        },
          error => {
            this.spinner.hide();
          })
    }

  }

  /*lazyLoadTickets(event: LazyLoadEvent | TableLazyLoadEvent) {
    const ticketFilter: any = this.ticketsService.ticketFilterObject();

    if (!ticketFilter?.fromDashboardScreen) {
      const pageIndex = event.first / event.rows;
      const queryColumn = event.sortField;
      const sortDirection = event.sortOrder === -1 ? 'DESCENDING' : 'ASCENDING';
      const pageSize = event.rows;

      // Determine sortItem based on queryColumn and sortDirection
      let sortItem = '';
      if (queryColumn === 'agentName' || queryColumn === 'clientName') {
        sortItem = sortDirection;
      }

      // Remove agentName and clientName from the parameters if they are empty
      const params: any = {
        pageIndex,
        pageSize,
        sort: queryColumn === 'agentName' || queryColumn === 'clientName' ? '' : queryColumn,
        query: '',
        queryColumn: '',
        agentName: queryColumn === 'agentName' ? event.multiSortMeta : '',
        clientName: queryColumn === 'clientName' ? event.multiSortMeta : '',
        sortItem: sortItem
      };

      this.getAllTickets(pageIndex,
        pageSize,
        params.sort,
        params.query,
        params.queryColumn,
        params.agentName,
        params.clientName,
        params.sortItem)
        .pipe(untilDestroyed(this))
        .subscribe(
          (data: Pagination<TicketsDTO>) => {
            this.springTickets = data;
            this.cdr.detectChanges();
            this.ticketsService.setCurrentTickets(this.springTickets.content);
            this.spinner.hide();

            // Extracting all the code values from the tickets
            const codeValues = this.springTickets.content.map(ticket => ticket.ticket.sysModule);

            // Passing the code values to the getCodeValue method
            const result = codeValues.map(code => this.getTicketCode(code));

          },
          error => {
            this.spinner.hide();
          }
        );
    }
  }*/



  /**
 * The function `getTicketCode` takes a code as input and returns the corresponding ticket code based
 * on the system module.
 * @param {string} code - The code parameter is a string that represents the system module code of a
 * ticket.
 * @returns the ticket code as a string.
 */
  getTicketCode(code: string) {
    const ticket = this.allSpringTickets.find(t => t.ticket.sysModule === code);
    let ticketCode: string;

    if (ticket) {
      ticketCode = ticket?.ticket?.sysModule === 'Q' ?  ticket?.ticket.quotationNo :
        (ticket?.ticket.sysModule === 'C' ? ticket?.ticket.claimNo: ticket?.ticket.policyNo);
    }
    return ticketCode;
  }

/**
 * The function `onTicketSelect` takes a selected ticket as input and performs various operations based
 * on the ticket's properties.
 * @param {NewTicketDto} selectedTicket - The selectedTicket parameter is of type NewTicketDto, which
 * is an object containing information about a ticket. It has the following properties:
 */
  onTicketSelect(selectedTicket: NewTicketDto) {
    // this.ticketsService.setSelectedTicket(selectedTickets);
    const systemModule = selectedTicket.systemModule;
    const ticketID = selectedTicket.ticketID.toString();
    const referenceNo = selectedTicket.refNo;
    // this.fetchDocuments(systemModule, referenceNo);
    // this.fetchReports(systemModule, ticketID);

    // const selectedTicketCodes = this.selectedTickets.map(ticket => ticket.ticket?.sysModule);
    // this.otpRequestCheck(selectedTicketCodes);
  }

/**
 * The function `generateAuthorizeOtp()` checks if any tickets are selected, and if so, it checks if an
 * OTP (One-Time Password) needs to be generated for authorization. If an OTP is required, it sends the
 * OTP to the user's email address.
 * @returns The function does not explicitly return anything.
 */
  generateAuthorizeOtp() {
    // Get the selected tickets from the table
      const selectedTickets = this.selectedSpringTickets;

    // Check if any products are selected
      if (selectedTickets.length === 0) {
        this.globalMessagingService.displayWarningMessage('Warning', 'Please select at least one ticket to authorize');
      return;
      }

      const selectedTicketCodes = this.selectedSpringTickets.map(ticket => ticket.ticket.sysModule);
      this.otpRequestCheck(selectedTicketCodes)
        .then((results) => {

          if (results && results.length > 0) {
            const generateOtp = results.some((result) => {
              const matchingModule = this.ticketModules.find(module => module.shortDescription === result.sysModule);
              return matchingModule && result.response.premium !== null &&
                result.response.premium > matchingModule.maximumAuthorizationAmount;
            });



            if (!generateOtp) {
              // Authorize without OTP
              this.authorizeTickets();
              return;
            }

            const loggedInUser = this.authService.getCurrentUser();
            if (loggedInUser !== null) {
              const username = loggedInUser.emailAddress;
              const channel = 'email';
              log.info('Username:', username);

              this.sendVerificationOtp(username, channel);
              // this.openModal(); // Open the modal programmatically
            }
          } else {
            log.info('No compareMethod results found');
            // Handle the scenario where compareMethod does not provide any results
            // Display an appropriate message or take necessary action
          }
        })
        .catch((error) => {
          log.error('compareMethod error:', error);
          // Handle the error occurred in compareMethod
          // Display an error message or take necessary action
        });
    }
/**
 * The `otpRequestCheck` function takes an array of ticket codes, retrieves corresponding ticket
 * information, and makes different API calls based on the ticket's system module.
 * @param {string[]} ticketCodes - An array of string values representing ticket codes.
 * @returns The `otpRequestCheck` function returns a promise that resolves to an array of objects. Each
 * object in the array contains the `sysModule` and `response` properties.
 */
  otpRequestCheck(ticketCodes: string[]) {
      log.info('Value from selectedTickets:', ticketCodes);

      const ticketPromises = ticketCodes.map((sysModule) => {
        const ticket = this.selectedSpringTickets.find(t => t.ticket.sysModule === sysModule);
        if (!ticket) {
          return Promise.resolve(null);
        }

        if (sysModule === 'Q') {
          log.info('Calling quotation method...');
          const quotationNo = ticket?.ticket.quotationNo;
          return this.ticketsService.getQuotation(quotationNo)
            .toPromise()
            .then((response) => {
              log.info('Quotation Method Response:', response);
              return { sysModule, response };
            });
        } else if (sysModule === 'C') {
          log.info('Calling claim Method...');
          const claimNo = ticket?.ticket.claimNo;
          return this.ticketsService.getClaims(claimNo)
            .toPromise()
            .then((response) => {
              log.info('Claim Method Response:', response);
              return { sysModule, response };
            });
        } else {
          log.info('Calling default method...');
          const policyCode = ticket?.ticket.policyCode.toString();
          return this.policiesService.getPolicyByBatchNo(policyCode)
            .toPromise()
            .then((response) => {
              log.info('Default Method Response:', response);
              return { sysModule, response };
            });
        }
      });

      return Promise.all(ticketPromises);

  }

/**
 * The `authorizeTickets` function is responsible for authorizing selected tickets and displaying
 * success or failure messages based on the response.
 */
  authorizeTickets() {
    this.cdr.detectChanges();

    const ticketCodes = this.selectedSpringTickets.map(ticket => ticket.ticket.code);
    const username = this.authService.getCurrentUserName();

    const ticket = { ticketIds: ticketCodes }; // Format the data as an object with an array of ticket ids
    this.ticketsService.authorizeTicket(ticket, username)
      .pipe(
        untilDestroyed(this),
        catchError(error => {

          // Handle error and display appropriate message
          this.globalMessagingService.displayErrorMessage('Error', "Failed to authorize ticket's");
          return throwError(error);
        })
      )
      .subscribe(response => {


        if (response && response.length > 0) {
          const totalCount = response.length;

          let successCount = 0;
          let failedCount = 0;

          response.forEach(ticket => {
            if (ticket.status === 'Success') {
              successCount++;
            } else {
              failedCount++;
            }
          });

            if (successCount > 0 && failedCount > 0) {
              const successMessage = successCount > 1 ? `${successCount} tickets have been authorized` : `Selected ticket has been authorized`;
              const failedMessage = failedCount > 1 ? `${failedCount} tickets have failed to be authorized` : `Selected ticket has failed to be authorized`;
              this.globalMessagingService.displaySuccessMessage('Success', successMessage);
              this.globalMessagingService.displayErrorMessage('Failed', failedMessage);
            } else if (successCount > 0) {
              const successMessage = successCount > 1 ? `${successCount} tickets have been authorized` : `Selected ticket has been authorized`;
              this.globalMessagingService.displaySuccessMessage('Success', successMessage);
            } else if (failedCount > 0) {
              const failedMessage = failedCount > 1 ? `${failedCount} tickets have failed to be authorized` : `Selected ticket has failed to be authorized`;
              this.globalMessagingService.displayErrorMessage('Failed', failedMessage);
            } else {
              this.globalMessagingService.displayErrorMessage('Failed', `All ${totalCount} tickets have failed to be authorized`);
            }
            // Clear the selected tickets after authorizing
          this.selectedSpringTickets = [];
          this.cdr.detectChanges();

        } else {
          // Handle the scenario where the response is empty or missing required properties
          this.globalMessagingService.displayErrorMessage('Error', "Failed to authorize tickets");
        }
      });
    // this.showDetailsCard = false;
    // this.showAdditionalColumns = true;
    this.cdr.detectChanges();
  }

 /**
  * The function `sendVerificationOtp` sends a verification OTP (One-Time Password) to a specified
  * username through a specified channel.
  * @param {string} username - The username is a string that represents the user's username or email
  * address.
  * @param {string} channel - The channel parameter specifies the method through which the verification
  * OTP (One-Time Password) will be sent. It could be an email, SMS, or any other communication
  * channel.
  */
  sendVerificationOtp(username: string, channel: string) {
    this.authService.sentVerificationOtp(username, channel)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        log.info("my otp >>>", response);
        if(response){
          this.globalMessagingService.displaySuccessMessage('Success', 'OTP successfully sent');
        }
      })
  }

 /**
  * The function `goToTicketDetails` sets the ticket details in local storage, navigates to the ticket
  * details page, sets the current ticket detail in the tickets service, and navigates to the ticket
  * details page with query parameters.
  * @param {NewTicketDto} ticket - The parameter `ticket` is of type `NewTicketDto`, which is an object
  * containing information about a new ticket.
  */
  goToTicketDetails(ticket: TicketsDTO) {
    this.localStorageService.setItem('ticketDetails', ticket);
    this.router.navigate([`home/administration/ticket/details/${ticket.ticket.code}`]);
    this.ticketsService.currentTicketDetail.set(ticket);

    let ticketId = ticket?.ticket?.code;
    let module = ticket?.ticket?.sysModule;
    this.router.navigate([`home/administration/ticket/details/`],
      {queryParams: { ticketId, module}}).then(r => {
    });
  }

  toggleReassignModal(visible: boolean) {
    this.showReassignTicketsModal = visible;
  }

  checkSelectedTickets(): boolean {
    // Get the selected tickets from the table
    const selectedTickets = this.selectedSpringTickets;

    // Check if any ticket is selected
    if (selectedTickets.length === 0) {
      this.globalMessagingService.displayErrorMessage('Warning', 'Please select at least one ticket to reassign');
      return false;
    }

    return true
  }

  processReassignTask(){
    if(this.checkSelectedTickets()){
      this.toggleReassignModal(true)
    }
  }

  handleAction(event: void) {
    this.toggleReassignModal(false); // Close the modal after performing the action
  }

  reassignSubmitted(event) {
    if(event){
      this.dt.reset();
      this.toggleReassignModal(false);
      log.info('Reassign dto received: ', event);
    }
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      fromDate: '',
      toDate: '',
      ticketTypes: '',
      ticketModules: ''
    });
  }

  sortTickets() {
    const sortValues = this.sortingForm.getRawValue();
    log.info('form value', sortValues);
    const payload: any = {
      fromDate: sortValues.fromDate ? sortValues.fromDate : '',
      toDate: sortValues.toDate ? sortValues.toDate : '',
      ticketTypes: sortValues.ticketTypes ? sortValues.ticketTypes : '',
      ticketModules: sortValues.ticketModules ? sortValues.ticketModules : ''
    }
    /*if (payload.ticketModules === '') {
      return this.filteredSpringTickets =  this.allSpringTickets;
    }*/

    this.filteredSpringTickets = this.allSpringTickets.filter((t) => {
      return payload.ticketModules === t.ticket.sysModule;
    });
    log.info(`tickets >>>`, this.filteredSpringTickets);

    this.ticketsService.sortTickets(
      0,
      this.pageSize,
      payload.fromDate,
      payload.toDate,
      payload.ticketTypes,
      payload.ticketModules,
      null
      )
      .subscribe(data => {
        this.springTickets = data;
        this.cdr.detectChanges();
      })
  }

  getAllTicketTypes() {
    this.ticketsService.getTicketTypes()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.ticketTypesData = data;
        }
      )
  }

  getAllTicketModules(){
    this.ticketsService.getTicketModules()
      .pipe(untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.ticketModules = data;
        }
      );
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows, keyData: string) {

    this.springTickets = null; // Initialize with an empty array or appropriate structure

    let data = this.filterObject[keyData];
    console.log('datalog>>',data, keyData)

    this.isSearching = true;
    this.spinner.show();

    if (data.trim().length > 0 || data === undefined || data === null) {
      this.ticketsService
        .searchAllTickets(
          pageIndex, pageSize,
          this.dateFrom, this.dateToday,
          keyData, data)
        .subscribe((data) => {
            this.springTickets = data;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
    else {
      this.getAllTickets(pageIndex, pageSize)
        .subscribe(
          (data: Pagination<TicketsDTO>) => {

            this.springTickets = data;
            this.tableDetails.rows = this.springTickets?.content;
            this.tableDetails.totalElements = this.springTickets?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => { this.spinner.hide(); }
        );
    }

  }

  ngOnDestroy(): void {
  }

  getSearchKey(key: string): filterSortEnums {
    log.info(key);
    switch (key) {
      case "createdOn":
        return filterSortEnums.DATE_FROM;
      case "activityName":
        return filterSortEnums.TICKET_NAME;
      case "clientName":
        return filterSortEnums.CLIENT_NAME;
      case "agentName":
        return filterSortEnums.AGENT_NAME;
      case "referenceNo":
        return filterSortEnums.REF_NO;
      case "reporter":
        return filterSortEnums.TICKET_BY;
      default:
        return filterSortEnums.ASSIGNED_TO;
    }
  }

  getInputs(event, filterObjName: string) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject[filterObjName] = value;
  }

  searchTickets(key: string, pageNo = 0) {
    let filterValue = {
      createdOn:'', ticketName:'', refNo:'', clientName:'' , intermediaryName:'', ticketFrom:'', ticketAssignee:''
    };

    let temp = this.filterObject[key];
    this.filterObject = {
      ...filterValue
    }

    this.filterObject[key] = temp;
    this.filterKey = key;
    log.info(this.filterObject)
    const assignee = this.authService.getCurrentUserName();
    if (this.filterObject[key]) {
      const searchKey: filterSortEnums = this.getSearchKey(key);

      const payload = {
        search: [
          {
            key: searchKey,
            value: this.filterObject[key]
          },
          {
            key: filterSortEnums.ASSIGNED_TO,
            value: assignee
          }
        ]
      };
      log.info('searchdatapayload>>', payload);
      this.ticketsService.searchTickets(pageNo, 10, payload)
        .subscribe((data) =>{
          this.springTickets = data;
          log.info('searchdata>>', this.springTickets);
        })
    }
    else {
      this.dt?.reset();
    }
  }

  searchTicketsDup(key: string, pageNo = 0, pageSize: number) {
    let filterValue = {
      createdOn:'', ticketName:'', refNo:'', clientName:'' , intermediaryName:'', ticketFrom:'', ticketAssignee:''
    };

    let temp = this.filterObject[key];
    this.filterObject = {
      ...filterValue
    }

    this.filterObject[key] = temp;
    this.filterKey = key;
    log.info(this.filterObject)
    const assignee = this.authService.getCurrentUserName();

    const searchKey: filterSortEnums = this.getSearchKey(key);

    const payload = {
      search: [
        {
          key: searchKey,
          value: this.filterObject[key]
        },
        {
          key: filterSortEnums.ASSIGNED_TO,
          value: assignee
        }
      ]
    };
    if (this.filterObject[key]) {

      log.info('searchdatapayload>>', payload);
      return this.ticketsService.searchTickets(pageNo, pageSize, payload)
    }
    else {
      this.dt?.reset();
      payload.search[0].key = null;
      return this.ticketsService.searchTickets(pageNo, pageSize, payload)
    }
  }

  async authorizePolicy() {
    const selectedTickets = this.selectedSpringTickets;

    if (selectedTickets.length === 0) {
      this.globalMessagingService.displayInfoMessage('Info', 'Please select at least one ticket to authorize');
      return;
    }

    const policyCode = selectedTickets[0]?.ticket?.policyCode;

    if (!policyCode) {
      this.globalMessagingService.displayInfoMessage('Info', 'Policy code is missing');
      return;
    }

    try {

      this.ticketsService.getPolicyDetails(policyCode)
        .subscribe(
          policyDetails => {
            this.policyDetails = policyDetails?.content[0];
            log.info('Policy details:', this.policyDetails);
            this.cdr.detectChanges();
            this.authorizePolicyComponent.openDebtOwnerModal();
          },
          error => {
            log.error('Error fetching policy details:', error);
            this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch policy details');
          }
        );
    } catch (error) {
      log.error('Error:', error);
      this.globalMessagingService.displayErrorMessage('Error', 'An error occurred');
    }
  }

  goToDispatch() {
    this.router.navigate([`home/administration/document-dispatch`]);
  }
}

enum filterSortEnums {
  TICKET_NAME = 'TICKET_NAME',
  TICKET_TYPE = 'TICKET_TYPE',
  ASSIGNED_TO = 'ASSIGNED_TO',
  CLIENT_NAME = 'CLIENT_NAME',
  AGENT_NAME = 'AGENT_NAME',
  TICKET_BY = 'TICKET_BY',
  REF_NO = 'REF_NO',
  SYSTEM_MODULE = 'SYSTEM_MODULE',
  DATE_FROM = 'DATE_FROM'
}
