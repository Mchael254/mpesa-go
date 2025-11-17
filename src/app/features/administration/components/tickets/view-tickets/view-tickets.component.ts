import { ChangeDetectorRef, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { NewTicketDto, TicketModuleDTO, TicketsDTO, TicketTypesDTO } from "../../../data/ticketsDTO";
import { AuthService } from "../../../../../shared/services/auth.service";
import { catchError } from "rxjs/internal/operators/catchError";
import { TicketsService } from "../../../services/tickets.service";
import cubejs, { Query } from "@cubejs-client/core";
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Table } from "primeng/table/table";
import { LocalStorageService } from "../../../../../shared/services/local-storage/local-storage.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConfigService } from "../../../../../core/config/app-config-service";
import { GlobalMessagingService } from "../../../../../shared/services/messaging/global-messaging.service";
import { untilDestroyed } from "../../../../../shared/services/until-destroyed";
import { Logger } from "../../../../../shared/services/logger/logger.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { finalize, ReplaySubject, takeUntil, tap } from "rxjs";
import { Pagination } from "../../../../../shared/data/common/pagination";
import { LazyLoadEvent } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { TableDetail } from "../../../../../shared/data/table-detail";
import { PoliciesService } from "../../../../gis/services/policies/policies.service";
import { AuthorizePolicyModalComponent } from "../authorize-policy-modal/authorize-policy-modal.component";
import { PolicyDetailsDTO } from "../../../data/policy-details-dto";
import { QuotationsService } from 'src/app/features/gis/components/quotation/services/quotations/quotations.service';
import * as bootstrap from 'bootstrap';
import { GroupedUser } from 'src/app/features/gis/components/quotation/data/quotationsDTO';
import { ClaimsService } from 'src/app/features/gis/components/claim/services/claims.service';
import { UtilService } from 'src/app/shared/services';


const log = new Logger('ViewTicketsComponent');
@Component({
  selector: 'app-view-tickets',
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css']
})
export class ViewTicketsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('reassignTable') reassignTable!: any;
  @ViewChild(AuthorizePolicyModalComponent) authorizePolicyComponent: AuthorizePolicyModalComponent;
  @ViewChild('reassignTicketModal') reassignTicketModalElement!: ElementRef;
  @ViewChild('chooseClientReassignModal') chooseClientReassignModal!: ElementRef;

  public filteredTickets: NewTicketDto[] = [];
  private allTickets: NewTicketDto[] = [];
  selectedTickets: NewTicketDto[] = [];

  public springTickets: Pagination<TicketsDTO> = <Pagination<TicketsDTO>>{};
  selectedSpringTickets: TicketsDTO[] = [];
  public filteredSpringTickets: TicketsDTO[] = [];
  private allSpringTickets: TicketsDTO[] = [];
  private modals: { [key: string]: bootstrap.Modal } = {};

  pageSize: 100;
  ticketModules: TicketModuleDTO[] = [];

  showReassignTicketsModal: boolean;

  public sortingForm: FormGroup;
  ticketTypesData: TicketTypesDTO[];

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year - 4}-${this.month}-${this.day}`;

  tableDetails: TableDetail;

  filterObject: {
    createdOn: string, ticketName: string, refNo: string, clientName: string, intermediaryName: string, ticketFrom: string, ticketAssignee: string
  } = {
      createdOn: '', ticketName: '', refNo: '', clientName: '', intermediaryName: '', ticketFrom: '', ticketAssignee: ''
    };

  isSearching = false;

  searchData: Pagination<TicketsDTO> = <Pagination<any>>{};
  activityName: string;
  totalTickets: number;
  filterPayload: any[] = [];
  policyDetails: PolicyDetailsDTO;

  departmentSelected: boolean = false;
  userToReassignTicket: any;
  reassignComment: string = '';
  globalSearch: string = '';
  selectedUser: any;
  users: any;
  fullNameSearch: string = '';
  noUserChosen: boolean = false;
  groupUsers: GroupedUser[] = [];
  selectedGroupUserId!: number;
  groupLeaderName: string = '';
  reassignTicketComment: string;
  noCommentleft: boolean = false;

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
  quoteNumber: string;
  selectedDateFrom: string;
  clientName: any;
  clientCode: any;
  isClientSearchModalVisible = false;
  ticketName: string;
  referenceNo: string;
  ticketAssignee: string;
  agentName: string;
  agentId: number;
  dateFormat: string = 'dd-mm-yy';
  minDate: Date | undefined;


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
    private quotationService: QuotationsService,
    public claimsService: ClaimsService,
    private utilService: UtilService,

  ) {

  }
  ngOnInit(): void {
    // this.getAllTicketsFromCubeJs();
    this.createSortForm();
    this.getAllTicketTypes();
    // this.getAllTicketModules();

    log.info("ticket obj", this.ticketsService.ticketFilterObject());

    const ticketFilter: any = this.ticketsService.ticketFilterObject();

    if (ticketFilter?.fromDashboardScreen) {
      this.ticketsService
        .getAllTickets(0, ticketFilter?.totalTickets, this.dateFrom || null, this.dateToday || null, '', '', 'name', ticketFilter?.activityName)
        .subscribe({
          next: (data) => {
            this.springTickets = data;
            this.spinner.hide();
            log.info("ticket subsc", this.ticketsService.ticketFilterObject());
            this.ticketsService.ticketFilterObject = signal({});
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage('Error', err.message);
          }
        });
    }
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.localStorageService.removeItem('policyDetails');

  }

  ngAfterViewInit() {
    this.modals['reassignTicket'] = new bootstrap.Modal(this.reassignTicketModalElement.nativeElement);
    this.modals['chooseClientReassign'] = new bootstrap.Modal(this.chooseClientReassignModal.nativeElement);
  }


  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();

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
        { member: "General_Ticket_Details.ticketAssignee", "operator": "contains", "values": ['IBRAHIM'] },
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
    }).catch(() => {
      this.spinner.hide();
    })

  }

  getAllTickets(
    pageIndex: number,
    pageSize: number,
    sort: string = 'createdDate',
    sortOrder: string = 'desc',
    dateFrom: string,
    ticketName: string,
    referenceNo: string,
    client: string,
    intermediary: string,
    ticketAssignee: string,

  ) {
    this.spinner.show();

    if (this.filterObject[this.filterKey]) {
      return this.searchTicketsDup(this.filterKey, pageIndex, pageSize);
    } else {
      return this.quotationService.getAllTickets(pageIndex, pageSize, sort, sortOrder, dateFrom, ticketName, referenceNo, client, intermediary, ticketAssignee).pipe(
        takeUntil(this.destroyed$),
        tap((data) => {
          log.info('Fetched Tickets data >>', data);
          this.spinner.hide();
        }),
        finalize(() => this.spinner.hide())
      );
    }
  }


  lazyLoadTickets(event: LazyLoadEvent | TableLazyLoadEvent) {
    const ticketFilter: any = this.ticketsService.ticketFilterObject();

    const pageIndex = event.first / event.rows;
    const queryColumn = event.sortField;
    const sort = 'desc';
    const pageSize = 100;
    const sortField = 'createdDate'
    log.info('Sort field:', queryColumn);

    // Extract ticket filters
    const dateFrom = this.selectedDateFrom || null;
    const ticketName = this.ticketName && this.ticketName.trim() !== "" ? this.ticketName.trim() : null;
    const referenceNo = this.referenceNo && this.referenceNo.trim() !== "" ? this.referenceNo.trim() : null;
    const client = this.clientName || null;
    const ticketAssignee = this.ticketAssignee || null;
    const intermediary = this.agentName || null;

    this.getAllTickets(pageIndex, pageSize, sortField, sort?.toString(),
      dateFrom,
      ticketName,
      referenceNo,
      client,
      intermediary,
      ticketAssignee
    )
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: any[]) => {

          // Wrap data into a Pagination<TicketsDTO> object
          // this.springTickets = {
          //   content: data,
          //   totalElements: data.length,
          //   totalPages: 1,
          //   size: data.length,
          //   number: pageIndex,
          //   first: true,
          //   last: true,
          //   numberOfElements: data.length,
          // };
          this.springTickets = {
            content: data.slice(event.first, event.first + event.rows), // only show current page
            totalElements: data.length, // total count of all tickets (if you fetched them all once)
            totalPages: Math.ceil(data.length / 10),
            size: event.rows,
            number: event.first / event.rows,
            first: event.first === 0,
            last: event.first + event.rows >= data.length,
            numberOfElements: data.length,
          };
          log.debug('spring tickets:', this.springTickets)

          // Notify Angular of data changes
          this.cdr.detectChanges();

          // Update shared ticket state
          this.ticketsService.setCurrentTickets(this.springTickets.content);

          // Hide spinner
          this.spinner.hide();

          // ✅ Extract sysModule values from nested ticket object
          const codeValues = this.springTickets.content.map(ticket => ticket.ticket.sysModule);

          // ✅ Process the codes as needed
          const result = codeValues.map((code) => this.getTicketCode(code));

          log.info('Ticket Codes Extracted:', result);
        },
        (error) => {
          log.error('Error fetching tickets:', error);
          this.spinner.hide();
        }
      );
  }


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
      ticketCode = ticket?.ticket?.sysModule === 'Q' ? ticket?.ticket.quotationNo :
        (ticket?.ticket.sysModule === 'C' ? ticket?.ticket.claimNo : ticket?.ticket.policyNo);
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
        if (response) {
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
      { queryParams: { ticketId, module } }).then(r => {
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

  // For multiple tickets 
  processReassignTask() {
    if (this.checkSelectedTickets()) {
      this.openReassignTicketModal();
    }
  }

  handleAction(event: void) {
    this.toggleReassignModal(false);
  }

  reassignSubmitted(event) {
    if (event) {
      this.dt.reset();
      this.toggleReassignModal(false);
      log.info('Reassign dto received: ', event);
    }
  }

  /**
   * Common validation for reassignment
   * @returns true if validation passes, false otherwise
   */
  private validateReassignment(): boolean {
    if (!this.userToReassignTicket) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false;
      }, 3000);
      return false;
    }

    if (!this.reassignTicketComment) {
      this.noCommentleft = true;
      setTimeout(() => {
        this.noCommentleft = false;
      }, 3000);
      return false;
    }

    if (this.selectedSpringTickets.length === 0) {
      this.globalMessagingService.displayWarningMessage('Warning', 'No tickets selected');
      this.closeReassignTicketModal();
      return false;
    }

    return true;
  }

  /**
   * Common cleanup after successful reassignment
   */
  private cleanupAfterReassignment(): void {
    this.selectedSpringTickets = [];
    this.dt?.reset();
    this.closeReassignTicketModal();
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

  // getAllTicketModules() {
  //   this.ticketsService.getTicketModules()
  //     .pipe(untilDestroyed(this),
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.ticketModules = data;
  //       }
  //     );
  // }

  // filter(event, pageIndex: number = 0, pageSize: number = event.rows, keyData: string) {

  //   this.springTickets = null; // Initialize with an empty array or appropriate structure

  //   let data = this.filterObject[keyData];
  //   console.log('datalog>>', data, keyData)

  //   this.isSearching = true;
  //   this.spinner.show();

  //   if (data.trim().length > 0 || data === undefined || data === null) {
  //     this.ticketsService
  //       .searchAllTickets(
  //         pageIndex, pageSize,
  //         this.dateFrom, this.dateToday,
  //         keyData, data)
  //       .subscribe((data) => {
  //         this.springTickets = data;
  //         this.spinner.hide();
  //       },
  //         error => {
  //           this.spinner.hide();
  //         });
  //   }
  //   else {
  //     this.getAllTickets(pageIndex, pageSize)
  //       .subscribe(
  //         (data: Pagination<TicketsDTO>) => {

  //           this.springTickets = data;
  //           this.tableDetails.rows = this.springTickets?.content;
  //           this.tableDetails.totalElements = this.springTickets?.totalElements;
  //           this.cdr.detectChanges();
  //           this.spinner.hide();
  //         },
  //         error => { this.spinner.hide(); }
  //       );
  //   }

  // }

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
      createdOn: '', ticketName: '', refNo: '', clientName: '', intermediaryName: '', ticketFrom: '', ticketAssignee: ''
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
        .subscribe((data) => {
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
      createdOn: '', ticketName: '', refNo: '', clientName: '', intermediaryName: '', ticketFrom: '', ticketAssignee: ''
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

  //reassign ticket
  fetchGroupedUserDetails(selectedUser: any) {
    const groupedUserId = selectedUser.id;
    this.quotationService.getGroupedUserDetails(groupedUserId)
      .subscribe({
        next: (res: GroupedUser[]) => {
          this.groupUsers = res;

          // Find the team leader
          const groupLeader = res.find(user => user.isTeamLeader === "Y");
          if (groupLeader) {
            this.selectedGroupUserId = groupLeader.id;
            this.groupLeaderName = groupLeader.userDetails.name;
          }
        },
        error: (error) => {
          console.error("Error fetching group users", error);
        }
      });
  }


  processTicket(ticket: any): void {
    const ticketName = ticket.ticketName?.trim();
    log.debug("Ticket chosen", ticket);
    this.utilService.clearSessionStorageData()
    this.utilService.clearNormalQuoteSessionStorage()
    // Save the whole ticket in session storage
    sessionStorage.setItem('activeTicket', JSON.stringify(ticket));
    const quotationCode = ticket.quotationCode
    sessionStorage.setItem('quotationCode', quotationCode.toString());


    switch (ticketName) {
      case 'Quotation Data Entry':
        sessionStorage.setItem('ticketStatus', ticketName);
        this.router.navigate(['/home/gis/quotation/quotation-details']);
        break;

      case 'Authorize Quotation':
        sessionStorage.setItem('ticketStatus', ticketName);
        this.router.navigate(['/home/gis/quotation/quotation-summary']);
        break;

      case 'Confirm Quotation':
        sessionStorage.setItem('ticketStatus', ticketName);
        sessionStorage.setItem('confirmMode', 'true');

        this.router.navigate(['/home/gis/quotation/quotation-summary']);
        break;

      case 'Authorize Exception':
        sessionStorage.setItem('ticketStatus', ticketName);

        sessionStorage.setItem('showExceptions', 'true');
        this.router.navigate(['/home/gis/quotation/quotation-summary']);
        break;

      default:
        console.warn('Unknown ticket type:', ticketName);
        break;
    }
  }


  openReassignTicketModal() {
    // Only open if tickets are selected
    if (this.selectedSpringTickets.length === 0) {
      this.globalMessagingService.displayErrorMessage('Warning', 'Please select at least one ticket to reassign');
      return;
    }
    this.openModals('reassignTicket');
  }

  closeReassignTicketModal() {
    this.closeModals('reassignTicket');
    // Reset all properties
    this.reassignComment = null;
    this.reassignTicketComment = null;
    this.userToReassignTicket = null;
    this.selectedUser = null;
    this.departmentSelected = false;
    this.selectedGroupUserId = null;
    this.groupUsers = [];
    this.noUserChosen = false;
    this.noCommentleft = false;
  }

  openChooseClientReassignModal() {
    this.getUsers();
    this.openModals('chooseClientReassign');
    this.closeReassignTicketModal();
  }

  closeChooseClientReassignModal(): void {
    this.closeModals('chooseClientReassign');
    // Reset user selection
    this.onUserUnselect();
    this.selectedUser = null;
    this.globalSearch = '';
    this.fullNameSearch = '';
    this.noUserChosen = false;
  }

  getUsers() {
    this.claimsService.getUsers(0, 1000).subscribe({
      next: (res => {
        this.users = res;
        this.users = this.users.content;
        log.debug('users>>>', this.users)

      }),
      error: (error => {
        log.debug('error', error)
        this.globalMessagingService.displayErrorMessage('Error', 'failed to feth users')
      })
    })
  }


  //search member to reassign
  filterGlobal(event: any): void {
    const value = event.target.value;
    this.globalSearch = value;
    this.reassignTable.filterGlobal(value, 'contains');
  }


  filterByFullName(event: any): void {
    const value = event.target.value;
    this.reassignTable.filter(value, 'name', 'contains');
  }
  onUserSelect(): void {
    if (this.selectedUser) {
      log.debug("Selected user>>>", this.selectedUser);
      this.globalSearch = this.selectedUser.id;
      this.fullNameSearch = this.selectedUser.name;
      this.fetchGroupedUserDetails(this.selectedUser)

    }
  }

  onUserUnselect(): void {
    this.selectedUser = null;
    this.globalSearch = '';
    this.fullNameSearch = '';
  }
  selectClient() {
    if (!this.selectedUser) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false
      }, 3000);
      return;
    }

    this.userToReassignTicket = this.selectedUser.name;
    if (this.selectedUser.userType == "G") {
      this.departmentSelected = true;
      this.fetchGroupedUserDetails(this.selectedUser);
    }
    this.closeChooseClientReassignModal();
    this.openModals('reassignTicket');

  }

  /**
   * Reassign single ticket using table action button
   * @param ticket - The ticket to reassign
   */
  reassignSingleTicket(ticket: TicketsDTO) {
    this.selectedSpringTickets = [ticket];
    this.openReassignTicketModal();
  }

  /**
   * Main reassignment method - handles both single and multiple tickets
   */
  reassignTicket() {
    if (!this.validateReassignment()) {
      return;
    }

    // Extract selected ticket codes
    const selectedTicketIds = this.selectedSpringTickets.map(ticket => ticket['ticketCode']);
    const isSingleTicket = selectedTicketIds.length === 1;

    log.debug('Selected Ticket IDs:', selectedTicketIds);
    log.debug('Number of tickets selected:', selectedTicketIds.length);
    log.debug('Reassigning to user:', this.userToReassignTicket);
    log.debug('Comment:', this.reassignTicketComment);

    this.spinner.show();

    // Choose the appropriate service method based on ticket count
    const reassignObservable = isSingleTicket
      ? this.quotationService.reassignTicket(selectedTicketIds[0], this.userToReassignTicket, this.reassignTicketComment)
      : this.quotationService.reassignMultipleTickets(selectedTicketIds, this.userToReassignTicket, this.reassignTicketComment);

    // Execute reassignment
    reassignObservable
      .pipe(
        untilDestroyed(this),
        catchError(error => {
          this.spinner.hide();
          log.error('Error reassigning ticket(s):', error);
          this.globalMessagingService.displayErrorMessage(
            'Error',
            `Failed to reassign ${isSingleTicket ? 'ticket' : 'tickets'}`
          );
          return throwError(error);
        })
      )
      .subscribe({
        next: (response) => {
          log.debug('Reassign response:', response);
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            `${isSingleTicket ? 'Ticket' : 'Tickets'} reassigned successfully`
          );

          // Clean up and refresh tickets
          this.cleanupAfterReassignment();

          // Reload tickets to reflect the reassignment
          this.dt?.reset();
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          log.error('Error in reassignment subscription:', error);
        }
      });
  }

  inputReferenceNo(event) {
    const value = (event.target as HTMLInputElement).value;
    this.referenceNo = value;
  }
  inputTicketName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticketName = value;
  }
  inputCreatedDate(event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedDateFrom = value;
  }

  inputTicketTo(event) {
    const value = (event.target as HTMLInputElement).value;
    this.ticketAssignee = value;
  }
  onAgentSelected(event: { agentName: string; agentId: number }) {
    this.agentName = event.agentName;
    this.agentId = event.agentId;

    // Trigger p-table filtering when agent is selected
    if (this.dt && this.agentName) {
      this.dt.filterGlobal(this.agentName, 'contains');
    }

    // Optional: Log for debugging
    log.debug('Selected Agent:', event);
    log.debug("AgentId", this.agentId);
    this.applyFilter();

  }
  onClientSelected(event: any) {
    let cleanClientName = event.clientFullName;
    if (cleanClientName) {
      cleanClientName = cleanClientName.replace(/\bnull\b/gi, '').trim();
      cleanClientName = cleanClientName === '' ? null : cleanClientName;
    }

    this.clientName = cleanClientName;
    this.clientCode = event.id;

    // Close the modal after selection
    this.isClientSearchModalVisible = false;
    this.cdr.detectChanges();

    // Optional: Log for debugging
    log.debug('Selected Client-quote management:', event);
    log.debug('Cleaned client name:', cleanClientName);
    this.applyFilter();

  }
  formatDate(date: Date): string {
    log.debug("Date (formatDate method):", date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCreatedDateInputChange(date: any) {
    log.debug('selected Date from raaw', date);
    const selectedDateFrom = date;
    if (selectedDateFrom) {
      const SelectedFormatedDate = this.formatDate(selectedDateFrom)
      this.selectedDateFrom = SelectedFormatedDate
      log.debug(" SELECTED FORMATTED DATE from:", this.selectedDateFrom)
    } else {

    }
  }
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dt) {
      this.dt.filterGlobal(filterValue, 'contains');
    }
  }
  applyFilter() {
    const lazyEvent: TableLazyLoadEvent = {
      first: 0,           // start of the page
      rows: 50,           // page size
      sortField: 'createdDate',
      sortOrder: 1        // ascending
    };

    this.lazyLoadTickets(lazyEvent);
  }
  get displayAgentName(): string {
    if (!this.agentName) return '';
    return this.agentName.length > 10 ? this.agentName.substring(0, 15) + '...' : this.agentName;
  }

  get displayClientName(): string {
    // this.fetchGISQuotations()

    if (!this.clientName) return '';
    return this.clientName.length > 10 ? this.clientName.substring(0, 15) + '...' : this.clientName;
  }
  openClientSearchModal() {
    // Reset modal state to ensure it works consistently
    this.isClientSearchModalVisible = false;
    this.cdr.detectChanges();
    // Set to true after change detection to ensure proper modal state
    setTimeout(() => {
      this.isClientSearchModalVisible = true;
      this.cdr.detectChanges();
    }, 0);
  }

  openAgentSearchModal() {
    log.debug('Agent input clicked - modal will open and trigger agent loading...');
  }

  clearClientName(): void {
    this.clientName = '';
    this.clientCode = null;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  clearAgentName(): void {
    this.agentName = '';
    this.agentId = null;

    // Clear p-table filtering when agent is cleared
    if (this.dt) {
      this.dt.filterGlobal('', 'contains');
    }

    this.applyFilter();
    this.cdr.detectChanges();
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
