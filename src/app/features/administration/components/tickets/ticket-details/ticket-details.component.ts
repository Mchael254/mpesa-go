import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NewTicketDto, TicketModuleDTO} from "../../../data/ticketsDTO";
import {PolicyDetailsDTO} from "../../../data/policy-details-dto";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {Logger} from "../../../../../shared/services";
import {TicketsService} from "../../../services/tickets.service";
import { throwError} from "rxjs";
import {catchError, take} from "rxjs/operators";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../shared/services/auth.service";

const log = new Logger('ViewTicketsComponent');

import {ActivatedRoute, Router} from "@angular/router";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticketId: any;
  ticketModule: any;
  currentTicket: NewTicketDto;

  selectedTicket: NewTicketDto;
  public policyDetails: PolicyDetailsDTO;
  public shouldShowViewMoreDialog: boolean = false;
  selectedTickets: NewTicketDto[] = [];
  ticketModules: TicketModuleDTO[] = [];
  private allTickets: NewTicketDto[] = [];
  showDetailsCard = false;
  showAdditionalColumns = true;
  showSpinner: boolean = false;

  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Tickets',
      url: '/home/administration/tickets',
    },
    {
      label: 'Ticket Details',
      url: '/home/administration/ticket/details'
    }
  ];

  constructor(
    private localStorageService: LocalStorageService,
    private ticketService: TicketsService,
    private globalMessagingService: GlobalMessagingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.selectedTicket = this.localStorageService.getItem('ticketDetails');
    this.fetchPolicyDetails(this.selectedTicket.policyCode);
    this.ticketId = this.activatedRoute.snapshot.params['id'];
    this.ticketModule = this.activatedRoute.snapshot.params['module'];
    this.currentTicket = this.ticketService.currentTicketDetail();

  }

  fetchPolicyDetails(batchNumber: number) {
    this.ticketService.getPolicyDetails(batchNumber)
      .pipe(take(1))
      .subscribe((policyDetails) => {
        this.policyDetails = policyDetails;
      })
  }

  showViewMoreDialog() {
    this.shouldShowViewMoreDialog = true;
  }

  callGenerateAuthorizeOtp() {
    this.selectedTickets = [this.selectedTicket];
    this.generateAuthorizeOtp();
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
            this.openModal(); // Open the modal programmatically
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
        return this.ticketService.getQuotation(quotationNo)
          .toPromise()
          .then((response) => {
            log.info('Quotation Method Response:', response);
            return {sysModule, response};
          });
      } else if (sysModule === 'C') {
        log.info('Calling claim Method...');
        const claimNo = ticket?.claimNumber;
        return this.ticketService.getClaims(claimNo)
          .toPromise()
          .then((response) => {
            log.info('Claim Method Response:', response);
            return {sysModule, response};
          });
      } else {
        log.info('Calling default method...');
        const policyCode = ticket?.policyCode.toString();
        return this.ticketService.getUnderWriting(policyCode)
          .toPromise()
          .then((response) => {
            log.info('Default Method Response:', response);
            return {sysModule, response};
          });
      }
    });

    return Promise.all(ticketPromises);
  }

  authorizeTickets() {
    // Show the spinner
    this.showSpinner = true;
    this.cdr.detectChanges();

    const ticketCodes = this.selectedTickets.map(ticket => ticket.ticketID);
    const username = this.authService.getCurrentUserName();

    const ticket = {ticketIds: ticketCodes}; // Format the data as an object with an array of ticket ids
    this.ticketService.authorizeTicket(ticket, username)
      .pipe(
        take(1),
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

          this.showSpinner = false; // Hide the spinner after the response is received

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
    this.showDetailsCard = false;
    this.showAdditionalColumns = true;
    this.cdr.detectChanges();
  }

  sendVerificationOtp(username: string, channel: string) {
    this.authService.sentVerificationOtp(username, channel)
      .pipe(take(1))
      .subscribe(response => {
        log.info("my otp >>>", response);
        if (response) {
          // this.globalMessagingService.displaySuccessMessage('Success', 'OTP successfully sent to your Email');
          // this.messageService.add({severity: 'success', summary:'Success', detail:'OTP successfully sent to your Email'});
        }
      })
  }

  openModal() {
    const modal = document.getElementById('exampleModalCenter');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }


  }

  backToPrevious(): void {
    this.router.navigate(['/home/administration/tickets'])
  }
}
