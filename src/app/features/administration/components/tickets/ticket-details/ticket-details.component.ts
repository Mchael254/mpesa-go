import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NewTicketDto, TicketModuleDTO, TicketsDTO} from "../../../data/ticketsDTO";
import {PolicyDetailsDTO} from "../../../data/policy-details-dto";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {Logger} from "../../../../../shared/services";
import {TicketsService} from "../../../services/tickets.service";
import { throwError} from "rxjs";
import {catchError, take} from "rxjs/operators";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {ReinsuranceAllocationsComponent} from "../reinsurance-allocations/reinsurance-allocations.component";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {AuthorizePolicyModalComponent} from "../authorize-policy-modal/authorize-policy-modal.component";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {ClaimsDTO} from "../../../../gis/data/claims-dto";
import {ViewClaimService} from "../../../../gis/services/claims/view-claim.service";
import {ClaimDetailsComponent} from "./claim-details/claim-details.component";

const log = new Logger('ViewTicketsComponent');
@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticketId: any;
  ticketModule: any;
  currentTicket: TicketsDTO;

  selectedTicket: NewTicketDto;
  public policyDetails: PolicyDetailsDTO;
  selectedTickets: NewTicketDto[] = [];
  ticketModules: TicketModuleDTO[] = [];
  private allTickets: NewTicketDto[] = [];
  showDetailsCard = false;
  showAdditionalColumns = true;
  showSpinner: boolean = false;

  selectedSpringTickets: TicketsDTO;

  public pageSize: 5;
  sectionDetails: any;

  globalFilterFields = [''];

  activeIndex: number = 0;
  showReassignTicketsModal: boolean;
  @ViewChild(ReinsuranceAllocationsComponent) reinsuranceAllocationsComp: ReinsuranceAllocationsComponent;
  @ViewChild(AuthorizePolicyModalComponent) authorizePolicyComponent: AuthorizePolicyModalComponent;
  @ViewChild(ClaimDetailsComponent) claimDetailsComponent: ClaimDetailsComponent;

  claimsData: Pagination<ClaimsDTO> = <Pagination<ClaimsDTO>>{};
  claim: ClaimsDTO;

  /*breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Tickets',
      url: '/home/administration/tickets',
    },
    // {
    //   label: 'Ticket Details',
    //   url: '/home/administration/ticket/details'
    // },
    {
      label: this.selectedTicket.ticketID.toString(),
      url: ''
    }
  ];*/

  constructor(
    private localStorageService: LocalStorageService,
    private ticketService: TicketsService,
    private globalMessagingService: GlobalMessagingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private policiesService: PoliciesService,
    private claimsService: ViewClaimService,
  ) {
  }

  ngOnInit(): void {
    // this.selectedTicket = this.localStorageService.getItem('ticketDetails');
    this.selectedSpringTickets = this.localStorageService.getItem('ticketDetails');
    this.fetchPolicyDetails(this.selectedSpringTickets?.ticket?.policyCode);
    this.ticketId = this.activatedRoute.snapshot.params['id'];
    this.ticketModule = this.activatedRoute.snapshot.params['module'];
    this.currentTicket = this.ticketService.currentTicketDetail();

    this.activeIndex = (this.selectedSpringTickets?.ticket?.sysModule === 'P' ||
      this.selectedSpringTickets?.ticket?.sysModule === 'RT' || this.selectedSpringTickets?.ticket?.sysModule === 'E') ? 2 : 0;
    if (this.selectedSpringTickets?.ticket?.sysModule === 'C') {
      this.fetchClaimDetails(this.selectedSpringTickets?.ticket?.claimNo);
    }
  }

  /**
   * This function fetches policy details for a given batch number and stores them in local storage.
   */
  fetchPolicyDetails(batchNumber: number) {
    this.ticketService.getPolicyDetails(batchNumber)
      .pipe(take(1))
      .subscribe((policyDetails) => {
        this.policyDetails = policyDetails?.content[0];
        this.localStorageService.setItem('policyDetails', this.policyDetails);

        log.info('policy details>>', this.policyDetails);
      })
  }

  /**
   * The fetchClaimDetails function retrieves claim details by claim number and stores them in local storage.
   */
  fetchClaimDetails(code:any) {
    this.claimsService.getClaimByClaimNo(code)
      .pipe(take(1))
      .subscribe(
        (data: Pagination<ClaimsDTO>) => {
          data.content.forEach( claim => {
            this.claim = claim;
            this.localStorageService.setItem('claimDetails', this.claim);
          });
          this.claimsData = data;

          log.info('claimsdata ticket>>', this.claimsData, this.claim)
        })
  }

  /**
   * The function `callGenerateAuthorizeOtp` sets the `selectedTickets` array with the `selectedTicket` element and then
   * calls the `generateAuthorizeOtp` function.
   */
  callGenerateAuthorizeOtp() {
    this.selectedTickets = [this.selectedTicket];
    this.generateAuthorizeOtp();
  }

  /**
   * The function `generateAuthorizeOtp` checks selected tickets, performs OTP request check, and authorizes tickets with
   * or without OTP based on certain conditions.
   * @returns The `generateAuthorizeOtp()` function returns either a warning message if no tickets are selected, or it
   * proceeds with the authorization process based on the selected tickets and OTP verification.
   */
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

  /**
   * The function `otpRequestCheck` processes an array of ticket codes to make asynchronous requests based on the system
   * module, logging the responses accordingly.
   * @param {string[]} ticketCodes - The `otpRequestCheck` function takes an array of `ticketCodes` as input. These
   * `ticketCodes` represent system modules for which the function will perform specific actions. The function iterates
   * over each `ticketCode` in the array and based on the system module type ('Q', 'C
   * @returns The `otpRequestCheck` function returns a Promise that resolves to an array of objects. Each object in the
   * array contains the `sysModule` property which represents the system module code (e.g., 'Q', 'C', default), and the
   * `response` property which holds the response data obtained from different service calls based on the system module
   * code.
   */
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
        return this.policiesService.getPolicyByBatchNo(policyCode)
          .toPromise()
          .then((response) => {
            log.info('Default Method Response:', response);
            return {sysModule, response};
          });
      }
    });

    return Promise.all(ticketPromises);
  }

  /**
   * The `authorizeTickets` function authorizes selected tickets, displays appropriate success or failure messages, and
   * updates the UI accordingly.
   */
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

  /**
   * The function `sendVerificationOtp` sends a verification OTP to a specified username through a specified channel.
   * @param {string} username - The `username` parameter typically refers to the user's unique identifier or username used
   * for authentication purposes. It could be an email address, phone number, or any other identifier depending on the
   * system's requirements.
   * @param {string} channel - The `channel` parameter in the `sendVerificationOtp` function is typically used to specify
   * the communication channel through which the OTP (One-Time Password) will be sent to the user. This could be an email
   * address, phone number (via SMS), or any other method of communication that supports sending
   */
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

  /**
   * The `openModal` function opens a modal by adding the 'show' class and setting the display property to 'block'.
   */
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

  /**
   * The function `backToPrevious` navigates the user back to the tickets page in the administration section of the home
   * page.
   */
  backToPrevious(): void {
    this.router.navigate(['/home/administration/tickets'])
  }

  /**
   * The onClickReinsure function calls the reinsureRisk method on the Reinsurance Allocations Component.
   */
  onClickReinsure() {
    this.reinsuranceAllocationsComp.reinsureRisk();
  }

  /**
   * The onClickAuthorize function opens a modal in the authorizePolicyComponent related to debt owners.
   */
  onClickAuthorize() {
    this.authorizePolicyComponent.openDebtOwnerModal();
  }

  /**
   * The `onAuthorizeClaim` function calls the `authorizeClaim` method of the `claimDetailsComponent`.
   */
  onAuthorizeClaim() {
    this.claimDetailsComponent.authorizeClaim();
  }

  /**
   * The function `toggleReassignModal` toggles the visibility of a modal for reassigning tickets.
   */
  toggleReassignModal(visible: boolean) {
    this.showReassignTicketsModal = visible;
  }

  /**
   * The function openReassignModal toggles the reassign modal to true.
   */
  openReassignModal() {
    this.toggleReassignModal(true);
  }

  /**
   * The `handleAction` function closes a modal after performing an action.
   */
  handleAction(event: void) {
    this.toggleReassignModal(false); // Close the modal after performing the action
  }

  /**
   * The function reassignSubmitted toggles a modal and logs information when a reassign dto event is received.
   */
  reassignSubmitted(event) {
    if(event){
      this.toggleReassignModal(false);
      log.info('Reassign dto received: ', event);
    }
  }
}
