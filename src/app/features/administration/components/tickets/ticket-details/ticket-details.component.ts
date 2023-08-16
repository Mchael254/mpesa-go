import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TicketsService} from "../../../services/tickets.service";
import {NewTicketDto} from "../../../data/ticketsDTO";

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticketId: any;
  ticketModule: any;
  currentTicket: NewTicketDto;

  constructor(private activatedRoute: ActivatedRoute, private ticketService: TicketsService) {}
  ngOnInit(): void {
    this.ticketId = this.activatedRoute.snapshot.params['id'];
    this.ticketModule = this.activatedRoute.snapshot.params['module'];
    this.currentTicket = this.ticketService.currentTicketDetail();
  }

}
