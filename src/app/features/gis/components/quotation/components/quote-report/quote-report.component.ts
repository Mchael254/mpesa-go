import { Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { DomesticDTO, MotorPrivateDTO, QuotationDetails, QuotationHeaderDTO } from '../../data/quotationsDTO';
import { PdfGeneratorService } from '../../services/quotations/pdf-generator.service';

@Component({
  selector: 'app-quote-report',
  templateUrl: './quote-report.component.html',
  styleUrls: ['./quote-report.component.css']
})
export class QuoteReportComponent implements OnChanges {
  private pdfBlob: Blob | null = null;
  @Input() quotationDetails!: QuotationDetails;

 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quotationDetails'] && this.quotationDetails) {
      this.updateHeaderFromDetails();
    }
  }

  private updateHeaderFromDetails(): void {
    const details = this.quotationDetails;

    this.header = {
      quotationStatus: 'Draft', // you can update this if there's a real field for status
      proposalIssued: details.expiryDate || 'N/A',
      period: this.formatPeriod(details.coverFrom, details.coverTo),
      quoteTime: this.formatDate(details.preparedDate),
      agencyName: details.agentName || '',
      logo: '' // Fill if you have a logo field or static image
    };
  }

  private formatPeriod(start: string | null, end: string | null): string {
    if (!start || !end) return '';
    return `${this.formatDate(start)} to ${this.formatDate(end)}`;
  }

  private formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  @Input() data: any;
  
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private pdfGenerator: PdfGeneratorService) {}
  header: QuotationHeaderDTO = {
    quotationStatus: 'Draft',
    proposalIssued: 'NA',
    period: '15 May 2025 to 15 February 2026',
    quoteTime: '10 May 2025 1000 HRS',
    agencyName: 'John Doe',
    logo:'data:image/png;base64,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'
  };

  motorPrivateList: MotorPrivateDTO[] = [
    {
      useOfProperty: 'Private',
      value: 'KES 1,600,000',
      comprehensive: {
        premium: 'KES 792,000.00',
        clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
        limitsOfLiability: [
          'Third party liability - KES 1,000,000',
          'Third party property damage - KES 500,000',
          'Windscreen cover - KES 50,000'
        ],
        excess: [
          'Theft with standard anti-theft device',
          'Own damage',
          'Theft with satellite tracking'
        ],
        benefits: ['Windshield', 'Radio cassette']
      },
      thirdParty: {
        premium: 'KES 792,000.00',
        clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
        limitsOfLiability: [
          'Third party liability - KES 1,000,000',
          'Windscreen cover - KES 50,000'
        ],
        excess: [
          'Theft with standard anti-theft device',
          'Own damage',
          'Theft with satellite tracking'
        ],
        benefits: ['Windshield', 'Radio cassette']
      }
    },
    {
      useOfProperty: 'Private',
      value: 'KES 1,600,000',
      comprehensive: {
        premium: 'KES 792,000.00',
        clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
        limitsOfLiability: [
          'Third party liability - KES 1,000,000',
          'Third party property damage - KES 500,000',
          'Windscreen cover - KES 50,000'
        ],
        excess: [
          'Theft with standard anti-theft device',
          'Own damage',
          'Theft with satellite tracking'
        ],
        benefits: ['Windshield', 'Radio cassette']
      },
      thirdParty: {
        premium: 'KES 792,000.00',
        clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
        limitsOfLiability: [
          'Third party liability - KES 1,000,000',
          'Windscreen cover - KES 50,000'
        ],
        excess: [
          'Theft with standard anti-theft device',
          'Own damage',
          'Theft with satellite tracking'
        ],
        benefits: ['Windshield', 'Radio cassette']
      }
    }
  ];

  domesticList: DomesticDTO[] = [
    {
      useOfProperty: 'Private',
      value: 'KES 1,600,000',
      premium: {
        premium: 'KES 792,000.00',
        clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
        limitsOfLiability: [
          'Third party liability - KES 1,000,000',
          'Third party property damage - KES 500,000',
          'Windscreen cover - KES 50,000'
        ],
        excess: [
          'Theft with standard anti-theft device',
          'Own damage',
          'Theft with satellite tracking'
        ],
        benefits: ['Windshield', 'Radio cassette']
      }
    },
    // add more domestic entries if needed
  ];



  downloadPdf() {
    this.pdfGenerator.generatePdfFromElement('content-to-pdf');
    console.log('generating report')
  }
}
