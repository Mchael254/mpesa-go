import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TicketsService} from "../../../../administration/services/tickets.service";
import {Router} from "@angular/router";
import {Logger} from "../../../../../shared/services";
import {takeUntil, tap} from "rxjs/operators";
import {TicketCountDTO} from "../../../../administration/data/ticketsDTO";
import {ReplaySubject} from "rxjs";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('TicketsSummaryComponent');
@Component({
  selector: 'app-tickets-summary',
  templateUrl: './tickets-summary.component.html',
  styleUrls: ['./tickets-summary.component.css']
})
export class TicketsSummaryComponent implements OnInit {

  ticketCount: TicketCountDTO[];

  ticketCountTotal: number;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private router: Router,
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef,
    private globalMessagingService: GlobalMessagingService,
  ) {}

  /**
   * The ngOnInit function is called when the component is initialized and it calls the getTicketCountPerModule function.
   */
  ngOnInit(): void {
    this.getTicketCountPerModule();
  }

  /**
   * The function `goToViewTickets()` navigates to the tickets view in the administration section of the home page.
   */
  goToViewTickets() {
    this.router.navigate([ `/home/administration/tickets`]);
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
      .subscribe({
        next: (data) => {
          this.ticketCount = data;
          this.ticketCountTotal = this.addTicketCounts();
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.log(`error >>>`, e.error);
          this.globalMessagingService.displayErrorMessage('Error', e.error.error );
        }
      })
  }

  /**
   * The function calculates the total number of tickets by summing up the totalTickets property of each object in the
   * ticketCount array.
   * @returns the total count of tickets by summing up the `totalTickets` property of each object in the `ticketCount`
   * array.
   */
  addTicketCounts() {
    return this.ticketCount.reduce((acc, cur) => {
      return acc + cur.totalTickets
    }, 0);
  }

  /**
   * The ngOnDestroy function is a lifecycle hook in Angular that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {

  }
}
