import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductLevelPremium, QuotationDetails, QuotationDTO} from '../../data/quotationsDTO';

import {QuotationsService} from "../../services/quotations/quotations.service";
import {Logger, untilDestroyed} from "../../../../../../shared/shared.module";
import {dummyUsers} from '../../data/dummyData';
import {Table} from 'primeng/table';
import {BreadCrumbItem} from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { QuoteReportComponent } from '../quote-report/quote-report.component';
import { ClaimsService } from 'src/app/features/gis/components/claim/services/claims.service';


const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-quoute-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dt') table!: Table;

  isShareModalOpen = false;

  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }


  @ViewChild('shareQuoteModal') shareQuoteModal?: ElementRef;
  // To get a reference to app-quote-report
  @ViewChild('quoteReport', {static: false}) quoteReportComponent!: QuoteReportComponent;

  selectedCovers: ProductLevelPremium = null


  ngAfterViewInit() {
    const modalElement = this.shareQuoteModal.nativeElement;

    modalElement.addEventListener('show.bs.modal', () => {
      // Use a small delay to let modal animation complete
      setTimeout(() => {
        this.isShareModalOpen = true;
      }, 10); // slight delay (10ms) is usually enough
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.isShareModalOpen = false;
    });
  }


  onDownloadRequested() {
    if (this.quoteReportComponent) {
      this.quoteReportComponent.downloadPdf();
    } else {
      console.error('QuoteReportComponent is not available!');
    }
  }


  quotationDetails: QuotationDetails;
  batchNo: number;
  quotationCode: number;
  rejectComment: string = ''
  reassignComment: string = ''
  users: any;
  selectedUser: any;
  fullNameSearch: string = '';
  globalSearch: string = '';
  status: string = '';
  afterRejectQuote: boolean = true;
  originalComment: string;

  constructor(
    private quotationService: QuotationsService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public globalMessagingService: GlobalMessagingService,
    public claimsService: ClaimsService

  ) {
    this.selectedCovers = JSON.parse(sessionStorage.getItem('selectedCovers'))
  }

  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list',
    },
    {
      label: 'New quote',
      url: '/home/gis/quotation/quick-quote',
    },
  ];
  steps = stepData;


  editNotesVisible = false;
  activeIndex = 1;

  setStep(index: number) {
    this.activeIndex = index;
  }

  // Use the DTO type here
  quotation: QuotationDTO = {
    number: 'Q123',
    status: 'Active',
    reference: 'REF456',
    ticket: 'TICK789',
    notes: 'Some note goes here... Some note goes here..Some note goes here..Some note goes here..',
    currency: 'KES',
    products: [
      {
        product: 'Motor Private',
        risk: 'Toyota Premio',
        coverType: 'Comprehensive',
        effectiveDate: '2025-06-01',
        sumInsured: 1200000,
        premium: 25000,
      },
      {
        product: 'Motor Private',
        risk: 'Honda Fit',
        coverType: 'Third Party',
        effectiveDate: '2025-06-01',
        sumInsured: 800000,
        premium: 15000,
      },
      {
        product: 'Domestic',
        risk: 'House Fire',
        coverType: 'Full',
        effectiveDate: '2025-06-01',
        sumInsured: 2000000,
        premium: 30000,
      }
    ]
  };

  getTotalPremium(): number {
    return this.quotation.products.reduce((sum, p) => sum + p.premium, 0);
  }


  ngOnInit(): void {
    this.getUsers()
    log.debug("Users>>>", this.users);
    this.quotationService.getQuotationDetails(sessionStorage.getItem("quotationNumber"))
      .pipe(untilDestroyed(this)).subscribe((response: any) => {
        log.debug("Quotation details>>>", response)
        this.quotationDetails = response
      });

  }


  getUsers() {
    this.claimsService.getUsers().subscribe({
      next: (res => {
        this.users = res;
        this.users = this.users.content;
        log.debug('users>>>', this.users)

      }),
      error: (error => {
        log.debug('error', error)
        this.globalMessagingService.displayErrorMessage('Error', 'failed to feth users')
      })
    })
  }

  //reject quotation
  rejectQuotation(code: number) {
    const quotationCode = code;
    const reasonCancelled = this.rejectComment;
    const status = 'Rejected';

    if (!reasonCancelled) {
      this.globalMessagingService.displayWarningMessage('Warning', 'Key in a reason');
      return;
    }

    log.debug('reject payload>>>', quotationCode, reasonCancelled, status)

    this.quotationService.updateQuotationStatus(quotationCode, status, reasonCancelled).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('success', 'quote rejected successfully')
        log.debug(response);
        this.afterRejectQuote = false;

      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('error', 'error while rejecting quote');
        log.debug(error);

      }

    })

  }

  //search member to reassign
  filterGlobal(event: any): void {
    const value = event.target.value;
    this.globalSearch = value;
    this.table.filterGlobal(value, 'contains');
  }

  filterByFullName(event: any): void {
    const value = event.target.value;
    this.table.filter(value, 'name', 'contains');
  }

  onUserSelect(): void {
    if (this.selectedUser) {
      log.debug("Selected user>>>", this.selectedUser);
      this.globalSearch = this.selectedUser.id;
      this.fullNameSearch = this.selectedUser.name;

    }

  }

  onUserUnselect(): void {
    this.selectedUser = null;
    this.globalSearch = '';
    this.fullNameSearch = '';
  }

  //reassign quotation
  comment: boolean = false
  noUserChosen: boolean = false
  reassignQuotation() {
    if (!this.reassignComment) {
      this.comment = true;
      setTimeout(() => {
        this.comment = false

      }, 3000);

      return;
    }
    if (!this.selectedUser) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false

      }, 3000);

      return;

    }
    const reassignPayload = {
      user: this.selectedUser.id,
      comment: this.reassignComment
    }
    this.globalMessagingService.displaySuccessMessage('Success', 'reassigning...')
    log.debug('reassign Payload', reassignPayload)

  }



  ngOnDestroy(): void {
  }

  convertQuoteToPolicy() {
    log.debug("Quotation Details", this.quotationDetails)
    const quotationCode = this.quotationDetails?.code;
    log.debug("Quotation Code", quotationCode);
    log.debug("Quotation Details", this.quotationDetails);
    const quoteProductCode = this.quotationDetails?.quotationProducts[0]?.code

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    this.quotationService.convertQuoteToPolicy(quotationCode, quoteProductCode).subscribe((data: any) => {
      log.debug("Response after converting quote to a policy:", data)
      this.batchNo = data._embedded.batchNo
      log.debug("Batch number", this.batchNo)
      const convertedQuoteBatchNo = JSON.stringify(this.batchNo);
      sessionStorage.setItem('convertedQuoteBatchNo', convertedQuoteBatchNo);
      this.router.navigate(['/home/gis/policy/policy-summary']);

    })

  }

  convertQuoteToNormalQuote() {
    log.debug("Quotation Details", this.quotationDetails);

    const quotationNumber = this.quotationDetails?.quotationNo;
    log.debug("Quotation Number", quotationNumber);
    sessionStorage.setItem("quotationNum", quotationNumber);

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    // Get the quotCode
    const quotationCode = this.quotationDetails?.code;
    log.debug("Quotation Code", this.quotationCode);

    // Call the API to convert quote to normal quote
    this.quotationService
      .convertToNormalQuote(quotationCode)
      .subscribe((data: any) => {
        log.debug("Response after converting quote to a normalQuote:", data)
        this.router.navigate(['/home/gis/quotation/quotation-summary']);

      }
      );
  }

  storeCurrentComment() {
    this.originalComment = this.quotationDetails.comments;
    log.debug("original comment:", this.originalComment)

  }

  saveNotes() {
    log.debug("new comment:", this.quotationDetails.comments)
    if (
      this.originalComment === this.quotationDetails.comments ||
      !this.quotationDetails.comments ||
      this.quotationDetails.comments.trim() === ''
    ) {
      this.globalMessagingService.displayErrorMessage('Error', 'Edit note to proceed');
      return;
    }
    const payload = {
      comment: this.quotationDetails.comments,
      quotationCode: this.quotationDetails.code
    }
    this.quotationService.updateQuotationComment(payload).subscribe((data: any) => {
      log.debug("Response after updating quote comment:", data)

    })

  }
}
