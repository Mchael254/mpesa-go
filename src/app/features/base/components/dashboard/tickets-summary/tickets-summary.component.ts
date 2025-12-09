import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TicketsService } from "../../../../administration/services/tickets.service";
import { Router } from "@angular/router";
import { Logger } from "../../../../../shared/services";
import { takeUntil, tap } from "rxjs/operators";
import { TicketCountDTO } from "../../../../administration/data/ticketsDTO";
import { ReplaySubject } from "rxjs";
import { TicketingService } from 'src/app/shared/services/ticketing/ticketing.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TicketCount } from '../../../data/tickets';

const log = new Logger('TicketsSummaryComponent');
@Component({
  selector: 'app-tickets-summary',
  templateUrl: './tickets-summary.component.html',
  styleUrls: ['./tickets-summary.component.css']
})
export class TicketsSummaryComponent implements OnInit {

  ticketCount: TicketCountDTO[];

  ticketCountTotal: number;
  user: string;
  ticketSummary: TicketCount[] = [];


  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private router: Router,
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef,
    private ticketingService: TicketingService,
    public authService: AuthService,

  ) { }

  /**
   * The ngOnInit function is called when the component is initialized and it calls the getTicketCountPerModule function.
   */
  ngOnInit(): void {
    this.getTicketCountPerModule();
    this.getuser()
    this.fetchGisTickets()
  }

  /**
   * The function `goToViewTickets()` navigates to the tickets view in the administration section of the home page.
   */
  goToViewTickets() {
    this.router.navigate([`/home/administration/tickets`]);
  }

  /**
   * The function `getTicketCountPerModule()` retrieves the ticket count per module for the logged in user from the tickets service and updates
   * the ticket count and total count variables, then triggers change detection.
   */
  getTicketCountPerModule() {
    this.ticketsService.getTicketCount()
      .pipe(
        takeUntil(this.destroyed$),
        tap((data) => log.info('Fetch Ticket per module>> ', data))
      )
      .subscribe((data) => {
        this.ticketCount = data;
        this.cdr.detectChanges();
      })
  }



  /**
   * The ngOnDestroy function is a lifecycle hook in Angular that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {

  }

  displayTicketDetails(ticketCountPerModule: any) {

    const activityName = ticketCountPerModule?.activityName.replace(/\s/g, '');
    const totalTickets = ticketCountPerModule?.totalTickets;
    log.info('Dash ticket>>', ticketCountPerModule.activityName, ticketCountPerModule.totalTickets);

    this.ticketsService.ticketFilterObject.set({ ...ticketCountPerModule, fromDashboardScreen: true });
    this.router.navigate(['/home/administration/tickets'],
      { queryParams: { activityName, totalTickets } }).then(r => {
      })
  }

  goToDispatch() {
    this.router.navigate([`home/administration/document-dispatch`]);
  }
  getuser() {
    this.user = this.authService.getCurrentUserName();
    const userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', userDetails);

  }
  fetchGisTickets() {
    this.ticketingService.fetchTicketSummary(this.user).subscribe({
      next: (res) => {
        log.debug('TICKET Summary:', res)
        this.ticketSummary = res
        this.ticketCountTotal = res.reduce((sum, item) => sum + item.taskCount, 0);



      },
      error: (error) => {
        log.debug("error", error)
        const apiError = error.error;
        const message =
          apiError?.errors?.[0] ??
          apiError?.developerMessage ??
          'Failed to send message';

        // this.globalMessagingService.displayErrorMessage('error', message);
      }
    });
  }
}
