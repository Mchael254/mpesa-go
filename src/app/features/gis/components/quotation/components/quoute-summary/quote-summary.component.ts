import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {  QuotationDetails, QuotationDTO } from '../../data/quotationsDTO';

import { QuotationsService } from "../../services/quotations/quotations.service";
import { Logger, untilDestroyed, UtilService } from "../../../../../../shared/shared.module";
import { Table } from 'primeng/table';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { QuoteReportComponent } from '../quote-report/quote-report.component';
import { ClaimsService } from 'src/app/features/gis/components/claim/services/claims.service';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { tap } from 'rxjs';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { NgxSpinnerService } from 'ngx-spinner';
import {ProductLevelPremium} from "../../data/premium-computation";



const log = new Logger('QuoteSummaryComponent');
type ProductWithRiskId = {
  productName: string;
  riskId: string;
  coverType: string;
  wef: any;
  sumInsured: number;
  premium: number;
};



@Component({
  selector: 'app-quoute-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dt') table!: Table;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;

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
  totalSumInsured: number;
  isShareModalOpen: boolean;
  isSearching = false;
  searchTerm = '';
  cols = [
    { field: 'clientFullName', header: 'Name' },
    { field: 'emailAddress', header: 'Email' },
    { field: 'phoneNumber', header: 'Phone number' },
    { field: 'idNumber', header: 'ID number' },
    { field: 'pinNumber', header: 'Pin' },
    { field: 'id', header: 'ID' },
  ];
  globalFilterFields = ['idNumber', 'firstName', 'lastName', 'emailAddress'];
  emailValue: string;
  phoneValue: string;
  pinValue: string;
  idValue: string;
  tableDetails: TableDetail;
  clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  pageSize: 5;
  filterObject: {
    name: string;
    idNumber: string;
  } = {
      name: '',
      idNumber: '',
    };
  clientDetails: ClientDTO;
  clientCode: number;
  clientType: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  selectedClient:ClientDTO
    showClientSearchModal = false;


  constructor(
    private quotationService: QuotationsService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public globalMessagingService: GlobalMessagingService,
    public claimsService: ClaimsService,
    private clientService: ClientService,
    private spinner: NgxSpinnerService,
    public utilService: UtilService,

  ) {
    this.selectedCovers = JSON.parse(sessionStorage.getItem('selectedCovers'))
    this.tableDetails = {
      cols: this.cols,
      rows: this.clientsData?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false,
    };
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
  productDetails: ProductWithRiskId[]

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
        const quotationProducts = this.quotationDetails.quotationProducts
        this.flattenQuotationProducts(quotationProducts)
        this.totalSumInsured = this.quotationDetails.sumInsured
      });

  }
  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }


  @ViewChild('shareQuoteModal') shareQuoteModal?: ElementRef;
  // To get a reference to app-quote-report
  @ViewChild('quoteReport', { static: false }) quoteReportComponent!: QuoteReportComponent;

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

  flattenQuotationProducts(quotationProducts: any[]) {
    this.productDetails = [];

    quotationProducts.forEach(product => {
      product.riskInformation.forEach(risk => {
        this.productDetails.push({
          productName: product.productName,
          riskId: risk.propertyId,
          coverType: risk.coverTypeDescription,
          wef: product.wef,
          sumInsured: risk.value,
          premium: risk.premium
        });
      });
    });
  }
  shouldShowProductName(index: number): boolean {
    if (index === 0) return true;
    return this.productDetails[index].productName !== this.productDetails[index - 1].productName;
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
     this.onUserUnselect()
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

  showQuoteReport = true; // Set to true to debug quote report

  navigateToQuoteDetails() {
    const quotationNumber = this.quotationDetails?.quotationNo;
    log.debug("Quotation Object", this.quotationDetails);
    sessionStorage.setItem("quotationObject", JSON.stringify(this.quotationDetails));

    // const quotationCode = this.quotationDetails?.code;
    // log.debug("Quotation Code", quotationCode);
    // sessionStorage.setItem("quotationCode", JSON.stringify(quotationCode));

    this.router.navigate(['/home/gis/quotation/quick-quote']);

  }



handleSaveClient(eventData: any) {
  log.debug('Event received from Client search comp', eventData);
  const clientCode = eventData.id;
  const payload = {
    quotationCode: this.quotationDetails?.code,
    clientCode: clientCode
  };

  this.quotationService.updateQuotation(payload).subscribe({
    next: (response) => {
      log.debug('Quotation update response:', response);
    if(response){
      // Now call convertQuoteToPolicy
      const quotationCode = this.quotationDetails?.code;
      const quoteProductCode = this.quotationDetails?.quotationProducts[0]?.code;
      const conversionFlag = true;
      sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

      this.quotationService.convertQuoteToPolicy(quotationCode, quoteProductCode).subscribe({
        next: (data: any) => {
          log.debug("Response after converting quote to a policy:", data);
           this.closebutton.nativeElement.click();
          this.batchNo = data._embedded.batchNo;
          log.debug("Batch number", this.batchNo);
          const convertedQuoteBatchNo = JSON.stringify(this.batchNo);
          sessionStorage.setItem('convertedQuoteBatchNo', convertedQuoteBatchNo);
          this.router.navigate(['/home/gis/policy/policy-summary']);
        },
        error: (err) => {
          log.debug('Error while converting quote to policy:', err);
          this.globalMessagingService.displayErrorMessage('error', 'Failed to convert quote to policy.');
        }
      });
    }
    },
    error: (error) => {
      this.globalMessagingService.displayErrorMessage('error', error.error.message);
      log.debug('Error while updating quotation:', error);
    }
  });
}


}
