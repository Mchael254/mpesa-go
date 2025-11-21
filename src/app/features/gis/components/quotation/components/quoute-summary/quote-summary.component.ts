import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PremiumPayloadDto, QuotationDetails, QuotationReportDto, ShareQuoteDTO } from '../../data/quotationsDTO';

import { QuotationsService } from "../../services/quotations/quotations.service";
import { Logger, untilDestroyed, UtilService } from "../../../../../../shared/shared.module";
import { Table } from 'primeng/table';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ClaimsService } from '../../../claim/services/claims.service';
import { ProductLevelPremium } from "../../data/premium-computation";
import { ShareQuotesComponent } from '../share-quotes/share-quotes.component';
import { format } from "date-fns";
import { concatMap, mergeMap, switchMap, throwError } from "rxjs";
import { EmailDto, SmsDto, WhatsappDto } from "../../../../../../shared/data/common/email-dto";
import { NotificationService } from "../../services/notification/notification.service";
import { StringManipulation } from "../../../../../lms/util/string_manipulation";
import { SESSION_KEY } from "../../../../../lms/util/session_storage_enum";
import { SessionStorageService } from "../../../../../../shared/services/session-storage/session-storage.service";
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UpdatePremiumDto } from 'src/app/features/gis/data/quotations-dto';
import { NgxCurrencyConfig } from 'ngx-currency';


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
  @ViewChild('shareQuoteModal') shareQuoteModal?: ElementRef;
  @ViewChild(ShareQuotesComponent) shareQuotes!: ShareQuotesComponent;



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
  organizationId: number;
  isModalLoading = false;
  previewVisible = false;
  pdfSrc: SafeResourceUrl | null = null;
  public currencyObj: NgxCurrencyConfig;
  reportDetails: any;
  comment: boolean = false
  noUserChosen: boolean = false
  ticketStatus: string;
  dateFormat: string = 'dd-MMM-yyyy'; // Default format
  primeNgDateFormat: string = 'dd-M-yy'; // PrimeNG format

  constructor(
    private quotationService: QuotationsService,
    private router: Router,
    private notificationService: NotificationService,
    public globalMessagingService: GlobalMessagingService,
    public claimsService: ClaimsService,
    public utilService: UtilService,
    public cdr: ChangeDetectorRef,
    private session_storage: SessionStorageService,
    private sessionStorageService: SessionStorageService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe

  ) {
    this.selectedCovers = JSON.parse(sessionStorage.getItem('selectedCovers'))
    this.ticketStatus = sessionStorage.getItem('ticketStatus');

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

    // Load date format from sessionStorage first, then from userDetails
    const storedDateFormat = sessionStorage.getItem('dateFormat');
    if (storedDateFormat) {
      this.dateFormat = storedDateFormat;
      log.debug("Loaded date format from session storage:", this.dateFormat);
    } else {
      log.debug("Using default date format:", this.dateFormat);
    }

    // Convert dateFormat to PrimeNG format
    this.primeNgDateFormat = this.dateFormat
      .replace('yyyy', 'yy')
      .replace('MM', 'm');

    log.debug('these are quotation details', this.quotationDetails)
    const stored = sessionStorage.getItem('selectedCovers');
    this.selectedCovers = stored ? JSON.parse(stored) : null;


    this.quotationService.getQuotationDetails(JSON.parse(sessionStorage.getItem('quotationCode')))
      .pipe(untilDestroyed(this)).subscribe((response: any) => {
        log.debug("Quotation details>>>", response)
        this.quotationDetails = response
        const ticketStatus = response.processFlowResponseDto.taskName
        this.ticketStatus = ticketStatus
        log.debug("Ticket status:", ticketStatus)
        sessionStorage.setItem('ticketStatus', ticketStatus);
        const quotationProducts = this.quotationDetails.quotationProducts
        this.flattenQuotationProducts(quotationProducts)
        this.totalSumInsured = this.quotationDetails.premium
        this.comments = this.quotationDetails?.comments
        if ('Rejected' === response.status) {
          this.afterRejectQuote = true
        }
      });

    const organization = this.sessionStorageService.getItem("organizationDetails") as OrganizationDTO;
    if (organization) {
      this.organizationId = organization.id
    }
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol')
    log.debug("currency Object:", currencySymbol)
    log.debug("currency Delimeter:", currencyDelimiter)
    this.currencyObj = {
      prefix: currencySymbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
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
      user: this.selectedUser.name,
      comment: this.reassignComment
    }

    // Get quotation code from session storage
    const quotationCode = JSON.parse(sessionStorage.getItem('quotationCode'));

    if (quotationCode) {
      // Call getTaskById service to get the taskId
      this.quotationService.getTaskById(quotationCode).pipe(
        switchMap((response) => {
          log.debug('Task details from getTaskById:', response);
          console.log('Task details from getTaskById:', response);

          // Extract taskId from response
          const taskId = response?.taskId;
          const newAssignee = this.selectedUser.name;

          if (!taskId) {
            throw new Error('Task ID not found in response');
          }

          log.debug('Extracted taskId:', taskId);
          console.log('Extracted taskId:', taskId);
          log.debug('New assignee:', newAssignee);
          console.log('New assignee:', newAssignee);

          // Call reassignTicket service with the extracted taskId
          return this.quotationService.reassignTicket(taskId, newAssignee);
        })
      ).subscribe({
        next: (reassignResponse) => {
          log.debug('Ticket reassigned successfully:', reassignResponse);
          console.log('Ticket reassigned successfully:', reassignResponse);
          this.globalMessagingService.displaySuccessMessage('Success', 'Quotation reassigned successfully');
          this.closeReassignButton.nativeElement.click();
          this.onUserUnselect();
          this.router.navigate(['/home/gis/quotation/quotation-management']);
        },
        error: (error) => {
          log.error('Error during reassignment:', error);
          console.error('Error during reassignment:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to reassign quotation');
        }
      });
    }

    // Handle case when quotation code is not found
    if (!quotationCode) {
      log.warn('No quotation code found in session storage');
      console.warn('No quotation code found in session storage');
      this.globalMessagingService.displayWarningMessage('Warning', 'No quotation code found');
    }

    log.debug('reassign Payload', reassignPayload)

  }


  ngOnDestroy(): void {
  }

  convertQuoteToNormalQuote() {
    const quotationCode = this.quotationDetails?.code;
    if (!quotationCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Quotation code is missing. Cannot proceed.');
      return;
    }

    const quotation = this.quotationDetails;
    const product = quotation?.quotationProducts?.[0];
    const riskInfo = product?.riskInformation?.[0];

    // const payload = {
    //   premiumAmount: quotation?.premium ?? 0,
    //   productCode: product?.productCode ?? 0,
    //   quotProductCode: product?.code ?? 0,
    //   productPremium: riskInfo?.annualPremium ?? 0,
    //   riskLevelPremiums: riskInfo ? [{
    //     code: riskInfo?.code ?? 0,
    //     premium: riskInfo?.premium ?? 0,
    //     limitPremiumDtos: riskInfo?.riskLimits?.map(limit => ({
    //       sectCode: limit?.sectionCode ?? 0,
    //       premium: limit?.premiumAmount ?? 0
    //     })) ?? []
    //   }] : [],
    //   taxes: quotation?.taxInformation?.map(tax => ({
    //     code: tax?.code ?? 0,
    //     premium: tax?.taxAmount ?? 0,
    //     description: tax?.rateDescription ?? ''
    //   })) ?? []
    // };


    const payload: PremiumPayloadDto[] = quotation?.quotationProducts?.map(product => {
      return {
        premiumAmount: product.premium ?? 0,
        productCode: product.productCode ?? 0,
        quotProductCode: product.code ?? 0,
        productPremium: 0, // No risks, so default 0
        riskLevelPremiums: product.riskInformation?.map(riskInfo => ({
          code: riskInfo.code ?? 0,
          propertyId: riskInfo.propertyId ?? '',
          propertyDescription: riskInfo.itemDesc ?? '',
          premium: riskInfo.premium ?? 0,
          minimumPremiumUsed: "Y",
          coverTypeDetails: {
            code: riskInfo.coverTypeCode ?? 0,
            subclassCode: riskInfo.subclassCode ?? 0,
            description: riskInfo.subclass?.description ?? '',
            coverTypeCode: riskInfo.coverTypeCode ?? 0,
            minimumAnnualPremium: 0.1,
            minimumPremium: 0.1,
            coverTypeShortDescription: riskInfo.coverTypeShortDescription ?? '',
            coverTypeDescription: riskInfo.coverTypeDescription ?? '',
            limits: riskInfo.sectionsDetails ?? [],
            limitPremium: riskInfo.riskLimits?.map(limit => ({
              sectCode: limit.sectionCode ?? 0,
              premium: limit.premiumAmount ?? 0.1
            })) ?? [],
            taxComputation: product.taxInformation?.map(tax => ({
              code: tax.code ?? 0,
              premium: tax.taxAmount ?? 0,
              description: tax.rateDescription ?? ''
            })) ?? []
          },
          limitPremiumDtos: riskInfo.riskLimits?.map(limit => ({
            sectCode: limit.sectionCode ?? 0,
            premium: limit.premiumAmount ?? 0.1
          })) ?? [],
          taxComputation: product.taxInformation?.map(tax => ({
            code: tax.code ?? 0,
            premium: tax.taxAmount ?? 0,
            description: tax.rateDescription ?? ''
          })) ?? []
        })) ?? [],
        taxes: product.taxInformation?.map(tax => ({
          code: tax.code ?? 0,
          premium: tax.taxAmount ?? 0,
          description: tax.rateDescription ?? ''
        })) ?? []
      };
    }) ?? [];


    this.quotationService.updateQuotePremium(quotationCode, payload)
      .pipe(
        switchMap(() => this.quotationService.convertToNormalQuote(quotationCode))
      )
      .subscribe({
        next: (data: any) => {
          log.debug("Quote successfully converted:", data);
          this.quotationService.getQuotationDetails(JSON.parse(sessionStorage.getItem('quotationCode')))
            .pipe(untilDestroyed(this)).subscribe((response: any) => {
              log.debug("Quotation details>>>", response)
              this.quotationDetails = response
              const ticketStatus = response.processFlowResponseDto.taskName
              this.ticketStatus = ticketStatus
              log.debug("Ticket status:", ticketStatus)
              sessionStorage.setItem('ticketStatus', ticketStatus);
              const quickQuoteFlag = true
              sessionStorage.setItem('quickQuoteFlag', JSON.stringify(quickQuoteFlag));

              this.router.navigate(['/home/gis/quotation/quotation-details']);

            });


        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to convert quote.');
          log.error('Quote conversion failed', err);
        }
      });
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
        if (response && this.quotationDetails?.quotationProducts?.length) {
          const quotationCode = this.quotationDetails.code;
          const products = this.quotationDetails.quotationProducts;
          const conversionFlag = true;
          sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

          const convertNextProduct = (index: number) => {
            if (index >= products.length) {
              // All done, navigate to summary
              this.router.navigate(['/home/gis/policy/policy-summary']);
              return;
            }

            const quoteProductCode = products[index].code;

            this.quotationService.convertQuoteToPolicy(quotationCode, quoteProductCode).subscribe({
              next: (data: any) => {
                log.debug(`Converted product ${quoteProductCode}:`, data);

                if (index === 0) {
                  // Store batchNo from the first response
                  this.batchNo = data._embedded.batchNo;
                  sessionStorage.setItem('convertedQuoteBatchNo', JSON.stringify(this.batchNo));
                }

                convertNextProduct(index + 1); // Convert next product
              },
              error: (err) => {
                log.debug('Error converting quote to policy:', err);
                this.globalMessagingService.displayErrorMessage('error', `Failed to convert product ${quoteProductCode}.`);
                // Optionally continue with next product even on error
                convertNextProduct(index + 1);
              }
            });
          };

          convertNextProduct(0); // Start conversion
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

  notificationPayload(): QuotationReportDto {
    log.debug("SELECTED COVERS", this.selectedCovers)
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
        reference: btoa(this.quotationDetails.ipayReferenceNumber),
        amount: btoa(this.quotationDetails.premium.toString()),
        currencyPrefix: this.quotationDetails.currency,
        tenant: btoa(tenantId)
      }
    });
    const organizationDetails = this.sessionStorageService.getItem("organizationDetails") as OrganizationDTO

    return {
      paymentLink: `${baseUrl}${urlTree}`,
      quotation: {
        quotationAgent: 'N/A',
        insuredName: 'N/A',
        quotationPeriod: `${coverFrom} to ${coverTo}`,
        quotationTime: format(now, 'dd MMMM yyyy HHmm') + ' HRS',
        quotationStatus: 'Draft',
        quotationNo: this.quotationDetails?.quotationNo,
        ipayReferenceNumber: this.quotationDetails?.ipayReferenceNumber
      },
      organization: {
        organizationLogo: organizationDetails.organizationLogo,
        organizationName: organizationDetails.name,
      },
      products: this.selectedCovers.productLevelPremiums.map((product: any) => ({
        code: product.code,
        description: product.description,
        riskLevelPremiums: product.riskLevelPremiums.map((risk: any) => ({
          sumInsured: risk.sumInsured,
          propertyId: risk.propertyId,

          coverTypeDetails: risk.coverTypeDetails.map((cover: any) => ({
            subclassCode: cover.subclassCode,
            description: cover.description || null,
            propertyId: cover.propertyId,
            coverTypeShortDescription: cover.coverTypeShortDescription,
            coverTypeDescription: cover.coverTypeDescription,
            limits: cover.limits?.map((limit: any) => ({
              narration: limit.narration?.trim(),
              value: limit.value
            })) || [],
            computedPremium: cover.computedPremium,
            taxComputation: (cover.taxComputation ?? []).map((tax: any) => ({
              code: tax.code,
              rateDescription: tax.description?.trim() || 'N/A',
              premium: tax.premium || 0
            })),
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
            })) || [],
            limitPremium: cover.limitPremium?.map((limit: any) => ({
              sectCode: limit.sectCode,
              premium: limit.premium,
              description: limit.description,
              limitAmount: limit.limitAmount,
              isMandatory: limit.isMandatory,
              calculationGroup: limit.calculationGroup,
              compute: limit.compute,
              dualBasis: limit.dualBasis,
              rateDivisionFactor: limit.rateDivisionFactor,
              rateType: limit.rateType,
              rowNumber: limit.rowNumber,
              premiumRate: limit.premiumRate,
              multiplierDivisionFactor: limit.multiplierDivisionFactor,
              multiplierRate: limit.multiplierRate,
              sectionType: limit.sectionType,
              shortDescription: limit.shortDescription,
              freeLimit: limit.freeLimit,
            })) || []
          }))
        }))
      }))
    }
  }


  onPreviewRequested() {
    this.previewVisible = false;
    this.pdfSrc = null;
    if (this.reportDetails) {
      this.pdfSrc = `data:application/pdf;base64,${this.reportDetails.base64}`;

      setTimeout(() => {
        this.previewVisible = true;
      }, 0);
      return
    }
    const payload = this.notificationPayload();
    this.quotationService.generateQuotationReport(payload).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (response) => {
        this.reportDetails = response

        // 👇 Just prepend the header, no sanitizer needed
        this.pdfSrc = `data:application/pdf;base64,${response.base64}`;

        setTimeout(() => {
          this.previewVisible = true;
        }, 0);
      },
      error: (err) => {
        console.error('Failed to preview quotation report', err);
      }
    });
  }
  onDownloadRequested() {
    if (this.reportDetails) {
      this.utilService.downloadPdfFromBase64(this.reportDetails.base64, "quotation-report.pdf");
      return
    }
    const payload = this.notificationPayload();

    this.quotationService.generateQuotationReport(payload)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.reportDetails = response

        // Normal download using utilService
        this.utilService.downloadPdfFromBase64(response.base64, "quotation-report.pdf");
      });
  }


  onPrintRequested() {
    if (this.reportDetails) {
      const byteCharacters = atob(this.reportDetails.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);

      // Create hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

      };
      return
    }
    const payload = this.notificationPayload();

    this.quotationService.generateQuotationReport(payload)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.reportDetails = response

        const byteCharacters = atob(response.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);

        // Create hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

        };
      });
  }




  listenToSendEvent(sendEvent: { mode: ShareQuoteDTO }) {
    const reportPayload = this.notificationPayload();

    this.quotationService.generateQuotationReport(reportPayload).pipe(
      mergeMap((response) => {
        const base64Report = response.base64;

        // Common attachment object for re-use
        const attachment = {
          fileName: 'quote-report.pdf',
          mimeType: 'application/pdf',
          data: base64Report,
          caption: 'Quotation Report'
        };

        const { selectedMethod, clientName, email, smsNumber, whatsappNumber } = sendEvent.mode;

        // --- EMAIL MODE ---
        if (selectedMethod === 'email') {
          const emailPayload: EmailDto = {
            code: null,
            address: [email],
            subject: 'Quotation Report',
            message: `Dear ${clientName},\nPlease find the attached quotation report.`,
            status: 'D',
            emailAggregator: 'N',
            response: '524L',
            systemModule: 'NB for New Business',
            systemCode: 0,
            attachments: [
              {
                name: attachment.fileName,
                content: attachment.data,
                type: attachment.mimeType,
                disposition: 'attachment',
                contentId: 'quote-report'
              }
            ],
            sendOn: new Date().toISOString(),
            clientCode: 0,
            agentCode: 0
          };
          return this.notificationService.sendEmail(emailPayload);
        }

        // --- WHATSAPP MODE ---
        else if (selectedMethod === 'whatsapp') {
          const whatsappPayload: WhatsappDto = {
            recipientPhone: whatsappNumber,
            message: `Dear ${clientName}, please find your quotation report attached.`,
            templateName: 'report_sharing_template_v1',
            templateParams: [clientName],
            attachments: [attachment]
          };
          return this.notificationService.sendWhatsapp(whatsappPayload);
        }

        // --- SMS MODE ---
        else if (selectedMethod === 'sms') {
          const message = this.buildQuotationMessage(reportPayload, clientName);
          const smsPayload: SmsDto = {
            scheduledDate: null,
            smsMessages: [
              {
                message: message,
                sendDate: new Date().toISOString(),
                systemCode: 0,
                telephoneNumber: smsNumber
              }
            ]
          };
          return this.notificationService.sendSms(smsPayload);
        }

        // --- UNSUPPORTED MODE ---
        else {
          return throwError(() => new Error('Unsupported send mode'));
        }
      })
    )
      .subscribe({
        next: (response) => {
          const channelLabel =
            sendEvent.mode.selectedMethod === 'email'
              ? 'Email'
              : sendEvent.mode.selectedMethod === 'whatsapp'
                ? 'WhatsApp'
                : 'SMS';
          this.globalMessagingService.displaySuccessMessage('success', `${channelLabel} sent successfully`);
          log.debug('Response after sending:', response);
        },
        error: (error) => {
          log.debug("error", error)
          const apiError = error.error;
          const message =
            apiError?.errors?.[0] ??
            apiError?.developerMessage ??
            'Failed to send message';

          this.globalMessagingService.displayErrorMessage('error', message);
        }


      });
  }
  buildQuotationMessage(data: any, clientName: string): string {
    let message = `Dear ${clientName}, find your attached quotation.\n\n`;

    data.products.forEach((product: any) => {
      message += `${product.description.toUpperCase()}\n`;

      product.riskLevelPremiums.forEach((risk: any) => {
        message += `  ${risk.propertyId}\n`;

        risk.coverTypeDetails.forEach((cover: any) => {
          const premium = cover.computedPremium.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          message += `    - ${cover.coverTypeDescription} (${cover.coverTypeShortDescription}) – ${premium}\n`;
        });

        message += '\n';
      });
    });

    return message.trim();
  }
  openClientSearchModal() {
    this.isClientSearchModalVisible = true;
  }

  /**
   * Format date for backend API (ISO format: YYYY-MM-DD)
   * @param date - Date to format
   * @returns Formatted date string in YYYY-MM-DD format
   */
  formatDate(date: string | Date | null): string {
    if (!date) return '';

    try {
      // Ensure the date is a Date object
      const parsedDate = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(parsedDate.getTime())) {
        log.error('Invalid date:', date);
        return '';
      }

      // Always use ISO format (YYYY-MM-DD) for backend API
      const formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
      return formattedDate || '';
    } catch (error) {
      log.error('Error formatting date:', error);
      return '';
    }
  }

  /**
   * Format date for display in templates
   * Returns formatted date string or placeholder if date is null/invalid
   */
  formatDateDisplay(date: any, placeholder: string = '—'): string {
    if (!date) {
      return placeholder;
    }

    try {
      const rawDate = new Date(date);

      // Check if date is valid
      if (isNaN(rawDate.getTime())) {
        return placeholder;
      }

      // Use the date format from session storage
      const formattedDate = this.datePipe.transform(rawDate, this.dateFormat);
      return formattedDate || placeholder;
    } catch (error) {
      log.error('Error formatting date for display:', error);
      return placeholder;
    }
  }

  /**
   * Check if a field name represents a date field
   * Used to determine if formatting should be applied
   */
  isDateField(fieldName: string): boolean {
    const dateFieldPatterns = [
      'date', 'Date', 'DATE',
      'wef', 'wet',
      'created', 'updated', 'modified',
      'timestamp', 'time'
    ];

    return dateFieldPatterns.some(pattern =>
      fieldName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

}
