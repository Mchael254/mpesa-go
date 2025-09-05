import { Component } from '@angular/core';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { Logger } from 'src/app/shared/shared.module';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('RiskDetailsComponent');

@Component({
  selector: 'app-quotation-other-details',
  templateUrl: './quotation-other-details.component.html',
  styleUrls: ['./quotation-other-details.component.css']
})
export class QuotationOtherDetailsComponent {
  columnModalPosition = { top: '0px', left: '0px' };

  quotationComments: any[] = [];
  quotationCode: number;
  clientCode: number;

  quotationRevisions: any[] = [];
  showRevision: boolean = true;
  noRevision:boolean = false;
  showRevisions: boolean = false;
  showRevisionsColumnModal = false;
  revisionColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];


  toggleRevision() {
    if (this.quotationRevisions && this.quotationRevisions.length > 0) {
      this.showRevision = !this.showRevision;
    } else {
      log.debug('No revisions available to display');
    }
  }

  constructor(
    private quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService
  ) { }

  ngOnInit(): void {
    this.quotationCode = Number(sessionStorage.getItem('quotationCode'));
    log.debug("quote code-other details >>", this.quotationCode);
    this.clientCode = Number(sessionStorage.getItem('clientCode'));
    log.debug("client code >>", this.quotationCode);
    this.getQuotationRevision();
    this.getQuotationComments();
  }

  //revisions
  getQuotationRevision() {
    this.quotationService.getQuotationRevision(this.quotationCode).subscribe({
      next: (res: any) => {
        this.quotationRevisions = Array.isArray(res?._embedded) ? res._embedded : [];
        this.noRevision = this.quotationRevisions.length > 0;
        log.debug("revisions:", this.quotationRevisions);

      },
      error: (error: HttpErrorResponse) => {
        log.debug("Error log", error.error.message);
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        this.showRevision = false;
      }
    });
  }

  getQuotationComments() {
    this.quotationService.getQuotationComments(this.clientCode).subscribe({
      next: (res: any) => {
        this.quotationComments = Array.isArray(res?._embedded) ? res._embedded : [];
        log.debug("comments:", this.quotationComments);
      },
      error: (error: HttpErrorResponse) => {
        log.debug("Error log", error.error.message);
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }



  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }


}
