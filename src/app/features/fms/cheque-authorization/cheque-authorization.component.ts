import {ChangeDetectorRef, Component, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Logger} from "../../../shared/services";
import {FmsService} from "../services/fms.service";
import {Pagination} from "../../../shared/data/common/pagination";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../shared/services/auth.service";
import {TableDetail} from "../../../shared/data/table-detail";
import {Profile} from "../../../shared/data/auth/profile";
import {untilDestroyed} from "../../../shared/services/until-destroyed";
import {DmsService} from "../../../shared/services/dms/dms.service";
import {DmsDocument, SingleDmsDocument} from "../../../shared/data/common/dmsDocument";
import {take} from "rxjs";
import {TableLazyLoadEvent} from "primeng/table";
import {LazyLoadEvent} from "primeng/api";
import {eftDTO} from "../data/auth-requisition-dto";


const log = new Logger('ChequeAuthorizationComponent');
@Component({
  selector: 'app-cheque-authorization',
  templateUrl: './cheque-authorization.component.html',
  styleUrls: ['./cheque-authorization.component.css']
})
export class ChequeAuthorizationComponent implements OnInit {

  pageSize: number = 10;

  eftRequisitions: Pagination<eftDTO> = <Pagination<eftDTO>>{};
  chequeRequisitions: Pagination<any> = <Pagination<any>>{};
  selectedEftPaymentTypes: any;

  public sortingForm: FormGroup;
  public otpForm: FormGroup;
  public formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6', 'input7'];
  public otpValue = '';
  public submitted = false;
  isLoading: boolean = false;
  isLoadingGenerateOtp: boolean = false;
  isLoadingReject: boolean = false;
  isLoadingSignSelected: boolean = false;
  isLoadingSendCorrection: boolean = false;
  @ViewChildren('formRow') rows: any;

  isButtonDisabled = true;
  countdown: number | null = null;
  isGenerateOtpButtonDisabled = false;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year-1}-${this.month}-${this.day}`;


  showEligibleAuthorizers: boolean = false;
  tableEligibleAuthorizers: TableDetail;
  colsEligibleAuthorizers = [
    { field: 'signatoryType', header: 'Signatory type' },
    { field: 'userName', header: 'User' },
    { field: 'jointSignatoryType', header: 'Joint signatory type' },
    { field: 'dsgnDescription', header: 'Designation' },
  ];

  private eligibleAuthorizers: any[];

  showSignedBy: boolean = false;
  tableSignedBy: TableDetail;
  colsSignedBy = [
    { field: 'username', header: 'User' },
    { field: 'authorizationDate', header: 'Authorization date' }
  ];
  private signedBy: any[];

  documentList: DmsDocument[] = [];
  selectedDocumentData: SingleDmsDocument;
  private validityPeriod: number;

  bankAccount: any;
  paymentTypes: any;
  transactionSummary: any;

  activeIndex: number = 0;
  private loggedInUser: Profile;
  private selectedBank: any;
  tableDetails: TableDetail;
  public totalRecords: number;
  remark: string = '';

  first = 0;
  pageNumber: number = 1;
  formPayload: any = {
    paymentType: '',
    system: 0,
    fromDate: '',
    toDate: '',
    bankBranch: 0,
    bankCode: 0
  };
  docsList: any[] = [];

  filterObject: {
    refNoFilter:string, narrativeFilter:string, accountNumberFilter:string, statusFilter:string
  } = {
    refNoFilter:'', narrativeFilter:'', accountNumberFilter:'', statusFilter:''
  };

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private fmsService: FmsService,
              private spinner: NgxSpinnerService,
              private globalMessagingService: GlobalMessagingService,
              private authService: AuthService,
              private dmsService: DmsService,)
  {
    this.otpForm = this.createOtpFormGroup(this.formInput);
  }
  ngOnInit(): void {

    const loggedInUser = this.authService.getCurrentUser();
    this.loggedInUser = loggedInUser;

    this.tableEligibleAuthorizers = {
      paginator: false, showFilter: false, showSorting: false,
      cols: this.colsEligibleAuthorizers,
      rows: this.eligibleAuthorizers,
      isLazyLoaded: false,
      showCustomModalOnView: false,
      noDataFoundMessage: 'No Eligible Authorizers Found'
    }

    this.tableSignedBy = {
      paginator: false, showFilter: false, showSorting: false,
      cols: this.colsSignedBy,
      rows: this.signedBy,
      isLazyLoaded: false,
      showCustomModalOnView: false,
      noDataFoundMessage: 'No Signed By Users Found'
    }

    this.createSortForm();
    this.getBankAccount();
    this.getPaymentTypes();
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      paymentType: '',
      system: '',
      fromDate: '',
      toDate: '',
      bank: ''
    });
  }

  createOtpFormGroup(elements) {
    const group: any = {};
    elements.forEach((key) => {
      group[key] = new FormControl('', Validators.required);
    });

    return new FormGroup(group);
  }

  openOtpModal() {
    const modal = document.getElementById('otpVerifyToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  closeOtpModal() {
    const modal = document.getElementById('otpVerifyToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  openTransactionSummaryModal(data) {
    const modal = document.getElementById('transactionSummary');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }


      if (this.activeIndex === 0) {
        this.getTransactionDetails(data?.chequeNo, this.loggedInUser?.code, 'PRN');
      }
      else {
        this.getTransactionDetails(data?.chequeNo, this.loggedInUser?.code, 'EFT');
      }
    }
  }

  closeTransactionSummaryModal() {
    const modal = document.getElementById('transactionSummary');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  openDocViewerModal() {
    const modal = document.getElementById('docViewerToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  closeDocViewerModal() {
    const modal = document.getElementById('docViewerToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
    this.documentList= [];
    this.docsList= [];
  }

  sortChequePayments() {

    const sortValues = this.sortingForm.getRawValue();
    log.info('form value', sortValues);
    this.formPayload = {
      paymentType: sortValues.paymentType ? sortValues.paymentType : '',
      system: sortValues.system ? sortValues.system : 1,
      fromDate: sortValues.fromDate ? sortValues.fromDate : '',
      toDate: sortValues.toDate ? sortValues.toDate : '',
      bankBranch: sortValues?.bank.brhCode ? sortValues?.bank.brhCode: '',
      bankCode: sortValues?.bank.bctCode ? sortValues?.bank.bctCode: ''
    }

    this.selectedBank = sortValues?.bank;

    log.info(`tickets >>>`, this.formPayload);

    if (this.activeIndex === 0) {
      this.getChequeMandateRequisitions(this.formPayload.bankCode, this.loggedInUser?.code,
        this.formPayload.bankBranch, this.formPayload?.paymentType, this.formPayload?.fromDate, this.formPayload?.toDate)
    }
      else {
        /*this.getEFTMandateRequisitions(payload.bankCode, this.loggedInUser?.code,
          payload?.paymentType, payload?.fromDate, payload?.toDate, this.rows, this.pageNumber)*/
      this.lazyLoadEft();
    }

  }

  keyUpEvent(event, input) {
    const value = event.target.value;
    const index = this.formInput.indexOf(input);

    if (event.keyCode === 8 && event.which === 8 && value.length === 0 && index > 0) {
      const previousInput = this.formInput[index - 1];
      this.otpForm.controls[previousInput].setValue('');
      this.rows._results[index - 1].nativeElement.focus();
    } else {
      this.otpForm.controls[input].setValue(event.key);
      if (index < this.formInput.length - 1) {
        const nextInput = this.formInput[index + 1];
        this.rows._results[index + 1].nativeElement.focus();
      }
    }
  }

  onVerify() {
    this.isLoading = true;

    if (this.otpForm.valid) {
      Object.keys(this.otpForm.controls).forEach((key, index) => {
        this.otpValue = this.otpValue + this.otpForm.controls[key].value;
      });

      this.fmsService.validateOtp(this.loggedInUser?.code, this.otpValue)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully validated OTP');
            this.otpValue='';
            this.otpForm.reset();
            this.closeOtpModal();
            this.startCountdown(this.validityPeriod);
          },
          error: (err) => {
            let errorMessage = '';
            if (err?.error?.msg) {
              errorMessage = err.error.msg
            } else {
              errorMessage = err.message
            }
            this.otpValue='';
            this.otpForm.reset();
            this.isLoading = false;
            this.globalMessagingService.displayErrorMessage('Error', errorMessage);
          }
        })
    }
  }

  generateOtp() {
    this.isLoadingGenerateOtp = true;
    this.fmsService.generateOtp(this.loggedInUser?.code, 2).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully generated OTP');
        this.isLoadingGenerateOtp = false;
        this.openOtpModal();
        log.info('otpData', res?.data?.tokenValidity);
        const validityPeriodMinutes = res?.data?.tokenValidity;
        this.validityPeriod = validityPeriodMinutes * 60; // Convert minutes to seconds

      },
      error: (err) => {
        this.isLoadingGenerateOtp = false;
        this.globalMessagingService.displayErrorMessage('Error', err.message);
      }
    });
  }

  startCountdown(seconds: number) {
    this.isGenerateOtpButtonDisabled = true;
    this.isButtonDisabled = false;
    this.countdown = seconds;

    const interval = setInterval(() => {
      if (this.countdown && this.countdown > 0) {
        this.countdown--;
      } else {
        this.isGenerateOtpButtonDisabled = false;
        this.isButtonDisabled = true;
        this.countdown = null;
        clearInterval(interval);
      }
    }, 1000);
  }

  resendOtp() {
    this.generateOtp();
  }

  saveSignChequeMandate() {
    const selectedEftPayments = this.selectedEftPaymentTypes;
    log.info('selected cheque/eft', selectedEftPayments);

    let chequeMandateApproveOptions = [];

    if (selectedEftPayments.length > 1) {
      // Iterate over each selectedEftPaymentType and construct the array
      chequeMandateApproveOptions = selectedEftPayments.map(payment => ({
        cqrNo: payment.chequeNo,
        cqrOk: "Y",
        cqrCorrect: "N",
        cqrCancel: "N",
        cqrRemarks: "Signing"
      }));
    } else {
      // Only one entry, so we construct a single object array
      chequeMandateApproveOptions = [
        {
          cqrNo: selectedEftPayments[0].chequeNo,
          cqrOk: "Y",
          cqrCorrect: "N",
          cqrCancel: "N",
          cqrRemarks: "Signing"
        }
      ];
    }
    this.isLoadingSignSelected = true;

    const payload: any = {
      eftNo: 0,
      chequeMandateApproveOptions: chequeMandateApproveOptions,
      userCode: this.loggedInUser?.code,
      sysCode: 1
    };

    log.info('payload sign', payload);
    this.fmsService.signChequeMandate(payload)
      .subscribe({
        next: (data) => {
          log.info('signed data>>', data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully signed');
          this.isLoadingSignSelected = false;
          this.lazyLoadEft();

        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          this.isLoadingSignSelected = false;
        }
      })
  }

  rejectSignChequeMandate() {
    const selectedEftPayments = this.selectedEftPaymentTypes;
    log.info('selected cheque/eft', selectedEftPayments);

    let chequeMandateApproveOptions = [];

    if (selectedEftPayments.length > 1) {
      chequeMandateApproveOptions = selectedEftPayments.map(payment => ({
        cqrNo: payment.chequeNo,
        cqrOk: "N",
        cqrCorrect: "N",
        cqrCancel: "Y",
        cqrRemarks: "Reject"
      }));
    } else {
      chequeMandateApproveOptions = [
        {
          cqrNo: selectedEftPayments[0].chequeNo,
          cqrOk: "N",
          cqrCorrect: "N",
          cqrCancel: "Y",
          cqrRemarks: "Reject"
        }
      ];
    }

    this.isLoadingReject = true;

    const payload: any = {
      eftNo: 0,
      chequeMandateApproveOptions: chequeMandateApproveOptions,
      userCode: this.loggedInUser?.code,
      sysCode: 1
    };

    log.info('payload reject', payload);

    this.fmsService.signChequeMandate(payload)
      .subscribe({
        next: (data) => {
          log.info('signed data>>', data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully rejected');
          this.isLoadingReject = false;
          this.lazyLoadEft();

        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          this.isLoadingReject = false;
        }
      })
  }

  sendToCorrectionChequeMandate() {

    const selectedEftPayments = this.selectedEftPaymentTypes;
    log.info('selected cheque/eft', selectedEftPayments);

    let chequeMandateApproveOptions = [];

    if (selectedEftPayments.length > 1) {
      chequeMandateApproveOptions = selectedEftPayments.map(payment => ({
        cqrNo: payment.chequeNo,
        cqrOk: "N",
        cqrCorrect: "Y",
        cqrCancel: "N",
        cqrRemarks: "Correction"
      }));
    } else {
      chequeMandateApproveOptions = [
        {
          cqrNo: selectedEftPayments[0].chequeNo,
          cqrOk: "N",
          cqrCorrect: "Y",
          cqrCancel: "N",
          cqrRemarks: "Correction"
        }
      ];
    }
    this.isLoadingSendCorrection = true;

    const payload: any = {
      eftNo: 0,
      chequeMandateApproveOptions: chequeMandateApproveOptions,
      userCode: this.loggedInUser?.code,
      sysCode: 1
    };

    log.info('payload correction', payload);
    this.fmsService.signChequeMandate(payload)
      .subscribe({
        next: (data) => {
          log.info('signed data>>', data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully sent for correction');
          this.isLoadingSendCorrection = false;
          this.lazyLoadEft();

        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          this.isLoadingSendCorrection = false;
        }
      })
  }

  processActionEligibleAuthEmitted(event) {
    this.toggleEligibleAuthModal(false);
  }

  private toggleEligibleAuthModal(display: boolean) {
    this.showEligibleAuthorizers = display;
  }

  openEligibleAuthModal(data) {
    this.getEligibleAuthorizers(this.loggedInUser?.code, this.selectedBank?.brhCode, data?.chequeNo, data?.chequeAmount);
    this.toggleEligibleAuthModal(true);
  }

  processActionSignedByEmitted(event) {
    this.toggleSignedByModal(false);
  }

  private toggleSignedByModal(display: boolean) {
    this.showSignedBy = display;
  }

  openSignedByModal(data) {
    this.toggleSignedByModal(true);
    this.getSignedBy(this.loggedInUser?.code, data?.chequeNo, this.selectedBank?.brhCode)
  }

  getBankAccount() {

    this.fmsService.getBankAccounts(this.loggedInUser?.code, 2, 223, 1)
      .subscribe({
        next: (res) => {
          this.bankAccount = res.data;
          log.info('Bank account>>', this.bankAccount);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err?.error?.msg);
        }
      })
  }

  getPaymentTypes() {

    this.fmsService.getEftPaymentTypes(this.loggedInUser?.code, 223, 1)
      .subscribe({
        next: (res) => {
          this.paymentTypes = res.data;
          log.info('Payment types>>', this.paymentTypes);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err?.error?.msg);
        }
      })
  }

  getEligibleAuthorizers(userCode: number, branchCode: number, chequeNumber: number, chequeAmount: number) {

    this.fmsService.getEligibleAuthorizers(userCode, branchCode, chequeNumber, chequeAmount)
      .subscribe({
        next: (res) => {
          this.eligibleAuthorizers = res.data;
          this.tableEligibleAuthorizers.rows = res.data;
          log.info('Eligible Authorizers>>', this.eligibleAuthorizers);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.msg);
        }
      })
  }

  getSignedBy(userCode: number, chequeNumber: number, branchCode: number) {

    this.signedBy = null;
    this.tableSignedBy.rows = null;

    this.fmsService.getSignedBy(userCode, chequeNumber, branchCode)
      .subscribe({
        next: (res) => {
          this.signedBy = res.data;
          this.tableSignedBy.rows = res.data;
          log.info('Signed by>>', this.signedBy);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.msg);
        }
      })
  }

  getTransactionDetails(chequeNumber: number, userCode: number, paymentCategory: string) {

    this.transactionSummary = null;
    this.fmsService.getTransactionDetails(chequeNumber, userCode, paymentCategory)
      .subscribe({
        next: (res) => {
          this.transactionSummary = res.data;
          log.info('Transaction summary>>', this.transactionSummary);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.msg);
        }
      })
  }

  getEFTMandateRequisitions(bankCode: number, userCode: number, paymentType: string,
                            fromDate: string, toDate: string, pageNo: number, pageSize: number,
                            sortField: any, sortDirection: string) {
    this.spinner.show();

    this.fmsService.getEftMandateRequisitions(bankCode, userCode, paymentType, fromDate, toDate,
      this.pageNumber, this.pageSize, '', '', '',
      '', sortField, sortDirection)
      .subscribe({
        next: (res) => {
          this.eftRequisitions = res;
          log.info('Eft requisitions>>', this.eftRequisitions);
          this.spinner.hide();
        },
        error: err => {
          this.eftRequisitions = null;
          this.globalMessagingService.displayErrorMessage('Error', err.error.msg);
          this.spinner.hide();
        }
      })
  }

  lazyLoadEft(event?: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event?.first / event?.rows;
    const pageSize = event?.rows;
    const sortField = event?.sortField ? event?.sortField : '';
    const sortOrder = event?.sortOrder == 1 ? 'asc' : 'desc';
    /*if (event) {
      this.first = event.first;
      this.rows = event.rows;
      this.pageNumber = this.first / this.rows;
    } else {
      this.first = 0;
      this.rows = 10;
      this.pageNumber = 1;
    }*/
    this.getEFTMandateRequisitions(this.formPayload?.bankCode, this.loggedInUser?.code,
      this.formPayload?.paymentType, this.formPayload?.fromDate, this.formPayload?.toDate, pageIndex, pageSize, sortField, sortOrder)
  }

  getChequeMandateRequisitions(bankCode: number, userCode: number, branchCode: number, paymentType: string,
                               fromDate: string, toDate: string) {
    this.spinner.show();
    this.fmsService.getChequeMandateRequisitions(bankCode, userCode, branchCode, paymentType, fromDate, toDate)
      .subscribe({
        next: (res) => {
          this.chequeRequisitions = res;
          log.info('Cheque requisitions>>', this.chequeRequisitions);
          this.spinner.hide();
        },
        error: err => {
          this.chequeRequisitions = null;
          this.globalMessagingService.displayErrorMessage('Error', err.error.msg);
          this.spinner.hide();
        }
      })
  }

  onTextChange(event, exception) {
    this.remark = event.target.value;
  }

  fetchDocs(eftAuth: any) {
    this.dmsService.fetchDocumentsByClaimNo(eftAuth)
      .pipe(untilDestroyed(this))
      .subscribe( claimDocs =>
      {
        this.documentList = claimDocs;
        log.info('documents', this.documentList)
        this.openDocViewerModal();
      });
  }

  fetchSelectedDoc(doc: any) {

    console.log('rpt>', doc);
    this.documentList.forEach(doc => {

      this.fetchDocuments(doc.id)
    })

  }

  fetchDocuments(docId) {
    log.info('doc id', docId);
    this.dmsService.getDocumentById(docId)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe((documentData: SingleDmsDocument) => {
        // this.selectedDocumentData = documentData;
        this.docsList.push({
          isBase64: documentData.byteData,
          base64String: documentData.byteData,
          fileName: documentData.docName,
          srcUrl: documentData.url,
          mimeType: documentData.docMimetype,
        })
        log.info('doc list', this.docsList)
      });
  }
  filterEft(event, pageIndex: number = 0, pageSize: number = event?.rows) {
    this.eftRequisitions = null;

    this.spinner.show();
    this.fmsService
      .getEftMandateRequisitions(
        this.formPayload?.bankCode, this.loggedInUser?.code,
        this.formPayload?.paymentType,
        this.formPayload?.fromDate, this.formPayload?.toDate,
        pageIndex, this.pageSize,
        this.filterObject?.refNoFilter,
        this.filterObject?.narrativeFilter,
        this.filterObject?.accountNumberFilter,
        this.filterObject?.statusFilter, '', '')
      .subscribe((data) => {
          this.eftRequisitions = data;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
  }
  inputRefNoFilter(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['refNoFilter'] = value;
  }

  updateFilter(event) {
    const target = event.target as HTMLInputElement;
    const filterName = target.name;
    const value = target.value;
    this.filterObject[filterName] = value;
  }

  ngOnDestroy() {}

}
