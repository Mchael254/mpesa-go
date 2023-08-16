import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NewTicketDto, TicketModuleDTO} from "../../../data/ticketsDTO";
import {AuthService} from "../../../../../shared/services/auth.service";
import {catchError} from "rxjs/operators";
import {Logger} from "../../../../../shared/services";
import {TicketsService} from "../../../services/tickets.service";
import cubejs from "@cubejs-client/core";
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { throwError } from 'rxjs';
import {untilDestroyed} from "src/app/shared/services/until-destroyed";
import {Table} from "primeng/table";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";

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
  pageSize: 5;
  ticketModules: TicketModuleDTO[] = [];

  showReassignTicketsModal: boolean;

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

  constructor(
    private authService: AuthService,
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    private localStorageService: LocalStorageService
  )
  {

  }
  ngOnInit(): void {
    this.getAllTicketsFromCubeJs();
  }

  getAllTicketsFromCubeJs() {
    const assignee = this.authService.getCurrentUserName()
    const query = {
      "dimensions":[
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
      ]
      // ,
      // "filters": [
      //   {"member":"General_Ticket_Details.ticketAssignee","operator":"contains","values": [assignee]},
      // ]
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

    })

  }

  getTicketCode(code: string) {
    const ticket = this.allTickets.find(t => t.systemModule === code);
    let ticketCode: string;

    if (ticket) {
      ticketCode = ticket?.systemModule === 'Q' ?  ticket?.quotationNo :
        (ticket?.systemModule === 'C' ? ticket?.claimNo: ticket?.policyNumber);
    }
    return ticketCode;
  }

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

  generateAuthorizeOtp() {
    // Get the selected tickets from the table
      const selectedTickets = this.selectedTickets;

    // Check if any products are selected
      if (selectedTickets.length === 0) {
        this.globalMessagingService.displayWarningMessage('Warning', 'Please select at least one ticket to authorize');
      return;
      }

      const selectedTicketCodes = this.selectedTickets.map(ticket => ticket.systemModule);
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
  otpRequestCheck(ticketCodes: string[]) {
      log.info('Value from selectedTickets:', ticketCodes);

      const ticketPromises = ticketCodes.map((sysModule) => {
        const ticket = this.allTickets.find(t => t.systemModule === sysModule);
        if (!ticket) {
          return Promise.resolve(null);
        }

        if (sysModule === 'Q') {
          log.info('Calling quotation method...');
          const quotationNo = ticket?.quotationNumber;
          return this.ticketsService.getQuotation(quotationNo)
            .toPromise()
            .then((response) => {
              log.info('Quotation Method Response:', response);
              return { sysModule, response };
            });
        } else if (sysModule === 'C') {
          log.info('Calling claim Method...');
          const claimNo = ticket?.claimNumber;
          return this.ticketsService.getClaims(claimNo)
            .toPromise()
            .then((response) => {
              log.info('Claim Method Response:', response);
              return { sysModule, response };
            });
        } else {
          log.info('Calling default method...');
          const policyCode = ticket?.policyCode.toString();
          return this.ticketsService.getUnderWriting(policyCode)
            .toPromise()
            .then((response) => {
              log.info('Default Method Response:', response);
              return { sysModule, response };
            });
        }
      });

      return Promise.all(ticketPromises);

  }

  authorizeTickets() {
    // Show the spinner
    // this.showSpinner = true;
    this.cdr.detectChanges();

    const ticketCodes = this.selectedTickets.map(ticket => ticket.ticketID);
    const username = this.authService.getCurrentUserName();

    const ticket = { ticketIds: ticketCodes }; // Format the data as an object with an array of ticket ids
    this.ticketsService.authorizeTicket(ticket, username)
      .pipe(
        untilDestroyed(this),
        catchError(error => {
          // Hide the spinner in case of an error
          // this.showSpinner = false;

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

          // this.showSpinner = false; // Hide the spinner after the response is received

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
          this.selectedTickets = [];
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

  sendVerificationOtp(username: string, channel: string) {
    this.authService.sentVerificationOtp(username, channel)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        log.info("my otp >>>", response);
        if(response){
          // this.globalMessagingService.displaySuccessMessage('Success', 'OTP successfully sent to your Email');
          // this.messageService.add({severity: 'success', summary:'Success', detail:'OTP successfully sent to your Email'});
        }
      })
  }

  goToTicketDetails(ticket: NewTicketDto) {
    this.localStorageService.setItem('ticketDetails', ticket);
    this.router.navigate([`home/administration/ticket/details/${ticket.ticketID}`]);
    this.ticketsService.currentTicketDetail.set(ticket);

    let ticketId = ticket?.ticketID;
    let module = ticket?.systemModule;
    this.router.navigate([`home/administration/ticket/details/`],
      {queryParams: { ticketId, module}}).then(r => {
    });
  }

  toggleReassignModal(visible: boolean) {
    this.showReassignTicketsModal = visible;
  }

  checkSelectedTickets(): boolean {
    // Get the selected tickets from the table
    const selectedTickets = this.selectedTickets;

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
}
