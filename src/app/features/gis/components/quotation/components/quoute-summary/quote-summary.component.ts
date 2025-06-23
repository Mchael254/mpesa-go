import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {QuotationDetails, QuotationReportDto, ShareQuoteDTO} from '../../data/quotationsDTO';

import {QuotationsService} from "../../services/quotations/quotations.service";
import {Logger, untilDestroyed, UtilService} from "../../../../../../shared/shared.module";
import {Table} from 'primeng/table';
import {BreadCrumbItem} from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import {Router} from '@angular/router';
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service';
import {ClaimsService} from '../../../claim/services/claims.service';
import {ProductLevelPremium} from "../../data/premium-computation";
import {ShareQuotesComponent} from '../share-quotes/share-quotes.component';
import {format} from "date-fns";
import {mergeMap} from "rxjs";
import {EmailDto} from "../../../../../../shared/data/common/email-dto";
import {NotificationService} from "../../services/notification/notification.service";
import {StringManipulation} from "../../../../../lms/util/string_manipulation";
import {SESSION_KEY} from "../../../../../lms/util/session_storage_enum";
import {SessionStorageService} from "../../../../../../shared/services/session-storage/session-storage.service";


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
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dt') table!: Table;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeReassignButton') closeReassignButton: ElementRef;


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
  afterRejectQuote: boolean = false;
  originalComment: string;
  totalSumInsured: number;
  isShareModalOpen: boolean = false;
  isSearching = false;
  searchTerm = '';
  comments: string;
  isClientSearchModalVisible = false;

  constructor(
    private quotationService: QuotationsService,
    private router: Router,
    private notificationService: NotificationService,
    public globalMessagingService: GlobalMessagingService,
    public claimsService: ClaimsService,
    public utilService: UtilService,
    public cdr: ChangeDetectorRef,
    private session_storage: SessionStorageService,
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


  productDetails: ProductWithRiskId[]


  ngOnInit(): void {

    log.debug('these are quotation details', this.quotationDetails)
    const stored = sessionStorage.getItem('selectedCovers');
    this.selectedCovers = stored ? JSON.parse(stored) : null;


    this.quotationService.getQuotationDetails(JSON.parse(sessionStorage.getItem('quotationCode')))
      .pipe(untilDestroyed(this)).subscribe((response: any) => {
      log.debug("Quotation details>>>", response)
      this.quotationDetails = response
      const quotationProducts = this.quotationDetails.quotationProducts
      this.flattenQuotationProducts(quotationProducts)
      this.totalSumInsured = this.quotationDetails.premium
      this.comments = this.quotationDetails?.comments
      if ('Rejected' === response.status) {
        this.afterRejectQuote = true
      }
    });

  }

  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }


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
        this.afterRejectQuote = true;
        this.quotationDetails.status = 'Rejected'
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
    this.closeReassignButton.nativeElement.click();

    this.onUserUnselect()
    log.debug('reassign Payload', reassignPayload)

  }


  ngOnDestroy(): void {
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
  @ViewChild('closeBtn') closeBtn: ElementRef;

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

      this.closeBtn.nativeElement.click();

    })

  }

  navigateToQuoteDetails() {
    log.debug("Quotation Object", this.quotationDetails);
    sessionStorage.setItem("quotationObject", JSON.stringify(this.quotationDetails));
    if (this.afterRejectQuote) {
      this.utilService.clearSessionStorageData()
    }
    this.router.navigate(['/home/gis/quotation/quick-quote']).then(r => {
    });
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
        if (response) {
          // Now call convertQuoteToPolicy
          const quotationCode = this.quotationDetails?.code;
          const quoteProductCode = this.quotationDetails?.quotationProducts[0]?.code;
          const conversionFlag = true;
          sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

          this.quotationService.convertQuoteToPolicy(quotationCode, quoteProductCode).subscribe({
            next: (data: any) => {
              log.debug("Response after converting quote to a policy:", data);
              this.closeButton.nativeElement.click();
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
    this.isClientSearchModalVisible = false;
  }


  //pdf functionality
  @ViewChild('shareQuoteModal') shareQuoteModal?: ElementRef;
  @ViewChild(ShareQuotesComponent) shareQuotes!: ShareQuotesComponent;


  notificationPayload(): QuotationReportDto {
    const now = new Date();
    const coverFrom = format(new Date(this.quotationDetails.coverFrom), 'dd MMMM yyyy')
    const coverTo = format(new Date(this.quotationDetails.coverTo), 'dd MMMM yyyy')
    const fullUrl = window.location.href;
    const baseUrl = fullUrl.split('/home')[0]
    let tenantId = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.API_TENANT_ID)
    );
    const urlTree = this.router.createUrlTree(['/payment-checkout'], {
      queryParams: {
        ref: this.quotationDetails.ipayReferenceNumber,
        sumInsured: this.quotationDetails.premium,
        currencyPrefix: this.quotationDetails.currency,
        tenant: tenantId
      }
    });
    return {
      paymentLink:  `${baseUrl}${urlTree}`,
      quotation: {
        quotationAgent: 'N/A',
        insuredName: 'N/A',
        quotationPeriod: `${coverFrom} to ${coverTo}`,
        quotationTime: format(now, 'dd MMMM yyyy HHmm') + ' HRS',
        quotationStatus: 'Draft',
      },
      organization: {
        organizationLogo: null,
        organizationName: null,
      },
      products: this.selectedCovers.productLevelPremiums.map((product: any) => ({
        code: product.code,
        description: product.description,
        riskLevelPremiums: product.riskLevelPremiums.map((risk: any) => ({
          coverTypeDetails: risk.coverTypeDetails.map((cover: any) => ({
            coverTypeShortDescription: cover.coverTypeShortDescription,
            coverTypeDescription: cover.coverTypeDescription,
            limits: cover.limits?.map((limit: any) => ({
              narration: limit.narration?.trim(),
              value: limit.value
            })) || [],
            computedPremium: cover.computedPremium,
            taxComputation: cover.taxComputation?.reduce(
              (acc: any, tax: any) => {
                acc.premium += tax.premium;
                acc.code = tax.code;
                return acc;
              },
              {premium: 0, code: 0}
            ),
            clauses: cover.clauses?.map((clause: any) => ({
              heading: clause.heading,
              wording: clause.wording
            })) || [],
            limitOfLiabilities: cover.limitOfLiabilities?.map((limit: any) => ({
              narration: limit.narration?.trim(),
              value: limit.value
            })) || [],
            excesses: cover.excesses?.map((excess: any) => ({
              narration: excess.narration?.trim(),
              value: excess.value
            })) || []
          }))
        }))
      }))
    }
  }

  onDownloadRequested() {
    const payload = this.notificationPayload();
    this.quotationService.generateQuotationReport(payload).pipe(
      untilDestroyed(this)
    ).subscribe((response) => {
      this.utilService.downloadPdfFromBase64(response.base64, "quotation-report.pdf")
    });
  }

  listenToSendEvent(sendEvent: { mode: ShareQuoteDTO }) {
    const emailPayload = this.notificationPayload()
    this.quotationService.generateQuotationReport(emailPayload).pipe(
      mergeMap((response) => {
        const payload: EmailDto = {
          code: null,
          address: [sendEvent.mode.email],
          subject: 'Quotation Report',
          message: 'Please find the attached quotation report.',
          status: 'D',
          emailAggregator: 'N',
          response: '524L',
          systemModule: 'NB for New Business',
          systemCode: 0,
          attachments: [
            {
              name: 'quote-report.pdf',
              content: response.base64,
              type: 'application/pdf',
              disposition: 'attachment',
              contentId: 'quote-report'
            }
          ],
          sendOn: new Date().toISOString(),
          clientCode: 0,
          agentCode: 0
        };
        return this.notificationService.sendEmail(payload)

      })
    )
      .subscribe({
        next: (response) => {
          if (response) {
            this.globalMessagingService.displaySuccessMessage('success', 'Email sent successfully')
          }
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('error', error.error.message);
          log.debug(error);
        }
      })
  }
  openClientSearchModal(){
    this.isClientSearchModalVisible = true;
  }

}
