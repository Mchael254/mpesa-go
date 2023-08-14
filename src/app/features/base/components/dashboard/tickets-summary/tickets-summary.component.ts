import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TicketsService} from "../../../../administration/services/tickets.service";
import {Router} from "@angular/router";
import {Logger} from "../../../../../shared/services";
import {takeUntil, tap} from "rxjs/operators";
import {TicketCountDTO} from "../../../../administration/data/ticketsDTO";
import {ReplaySubject} from "rxjs";

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
  ) {}

  ngOnInit(): void {
    this.getTicketCountPerModule();
  }

  goToViewTickets() {
    this.router.navigate([ `/home/administration/tickets`]);
  }

  //get ticket count per module for the logged in user
  getTicketCountPerModule() {
    this.ticketsService.getTicketCount()
      .pipe(
        takeUntil(this.destroyed$),
        tap((data) => log.info('Fetch Ticket per module>> ', data))
      )
      .subscribe((data) => {
        this.ticketCount = data;
        this.ticketCountTotal = this.addTicketCounts();
        this.cdr.detectChanges();
      })
  }

  addTicketCounts() {
    return this.ticketCount.reduce((acc, cur) => {
      return acc + cur.totalTickets
    }, 0);
  }

  ngOnDestroy(): void {

  }
}
