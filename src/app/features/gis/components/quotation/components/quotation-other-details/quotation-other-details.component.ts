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
  showRevision: boolean = true;
  quotationRevisions: any[] = [];
  quotationComments: any[] = [];
  quotationCode: number;
  clientCode: number;


  toggleRevision() {
    this.showRevision = !this.showRevision;
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
    this.quotationRevisions = this.sortRevisionsByNumber(this.quotationRevisions);
    this.quotationComments = this.sortCommentsByNumber(this.quotationComments);

  }

  getQuotationRevision() {
    this.quotationService.getQuotationRevision(this.quotationCode).subscribe({
      next: (res: any) => {
        this.quotationRevisions = this.sortRevisionsByNumber(res || []);
        log.debug("Sorted quotation revisions:", this.quotationRevisions);
      },
      error: (error: HttpErrorResponse) => {
        log.debug("Error log", error.error.message);
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }

  private sortRevisionsByNumber(revisions: any[]): any[] {
    return [...revisions].sort((a, b) => {
      const getRevisionNumber = (quotationNo: string) => {
        const parts = quotationNo.split('/');
        return parseInt(parts[parts.length - 1], 10);
      };
      return getRevisionNumber(b.quotationNo) - getRevisionNumber(a.quotationNo);
    });
  }

  getQuotationComments() {
    this.quotationService.getQuotationComments(this.clientCode).subscribe({
      next: (res: any) => {
        this.quotationComments = this.sortCommentsByNumber(res || []);
        log.debug("Sorted quotation comments:", this.quotationComments);
      },
      error: (error: HttpErrorResponse) => {
        log.debug("Error log", error.error.message);
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }

  private sortCommentsByNumber(revisions: any[]): any[] {
    return [...revisions].sort((a, b) => {
      const getCommentNumber = (commentNo: string) => {
        const parts = commentNo.split('/');
        return parseInt(parts[parts.length - 1], 10);
      };
      return getCommentNumber(b.commentNo) - getCommentNumber(a.commentNo);
    });
  }


}
