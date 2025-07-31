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
  activeTab: 'internal' | 'external' = 'internal';
  quotationRevision: any[] = [];

  dummyQuotationRevisions = [
    {
      quotationCode: 1,
      quotationNo: "Q/HDO/PMT/25/0001346/8",
      coverFrom: "2025-03-20",
      coverTo: "2026-03-19",
      premium: 706200
    },
    {
      quotationCode: 4,
      quotationNo: "Q/HDO/PMT/25/0001346/7",
      coverFrom: "2025-03-20",
      coverTo: "2026-03-19",
      premium: 706200
    },
    {
      quotationCode: 5,
      quotationNo: "Q/HDO/PMT/25/0001346/1",
      coverFrom: "2025-03-20",
      coverTo: "2026-03-19",
      premium: 706200
    }
  ];

  toggleRevision() {
    this.showRevision = !this.showRevision;
  }

  constructor(
    private quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService
  ) { }

  ngOnInit(): void {
    this.quotationRevision = this.sortRevisionsByNumber(this.dummyQuotationRevisions);
  }

  getQuotationRevision() {
    const quotationCode = Number(sessionStorage.getItem('quotationCode'));
    this.quotationService.getQuotationRevision(quotationCode).subscribe({
      next: (res: any) => {
        this.quotationRevision = this.sortRevisionsByNumber(res || []);
        log.debug("Sorted quotation revisions:", this.quotationRevision);
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

}
