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

  /**
   * The function creates a form for sorting payment data with fields for payment type, system, date
   * range, and bank.
   */
  createSortForm() {
    this.sortingForm = this.fb.group({
      paymentType: '',
      system: '',
      fromDate: '',
      toDate: '',
      bank: ''
    });
  }

  /**
   * The function `createOtpFormGroup` creates a FormGroup with FormControl instances for each element
   * in the provided array.
   */
  createOtpFormGroup(elements) {
    const group: any = {};
    elements.forEach((key) => {
      group[key] = new FormControl('', Validators.required);
    });

    return new FormGroup(group);
  }

  /**
   * The `openOtpModal` function displays an OTP verification modal by adding the 'show' class and
   * setting the display style to 'block'.
   */
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

  /**
   * The function `closeOtpModal` hides the OTP verification modal by removing the 'show' class and
   * setting the display to 'none'.
   */
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

  /**
   * The function `openTransactionSummaryModal` displays a modal with transaction details based on the
   * active index and transaction data.
   */
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

  /**
   * The function `closeTransactionSummaryModal` closes a modal by removing the 'show' class and hiding
   * it from display.
   */
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

 /**
  * The `openDocViewerModal` function displays a modal for viewing documents by adding a 'show' class
  * and setting the display style to 'block'.
  */
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

  /**
   * The function `closeDocViewerModal` closes a document viewer modal by removing the 'show' class and
   * hiding the modal elements.
   */
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

  /* The provided TypeScript code is a method named `sortChequePayments` that seems to be handling the
  sorting and filtering of cheque payments based on the values obtained from a form.*/
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

  /**
   * The keyUpEvent function handles keyboard events for an OTP input form, allowing users to navigate
   * between input fields and clear previous inputs.
   */
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

  /**
   * The `onVerify` function handles the validation of OTP input, displays success or error messages
   * accordingly, and resets the form.
   */
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

  /**
   * The `generateOtp` function generates an OTP (One-Time Password) and handles success and error
   * responses accordingly.
   */
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

  /**
   * The function `startCountdown` in TypeScript initiates a countdown for a specified number of
   * seconds, updating certain properties and enabling/disabling buttons accordingly.
   * @param {number} seconds - The `seconds` parameter in the `startCountdown` function represents the
   * initial countdown duration in seconds. This function will start a countdown from the specified
   * number of seconds and update the countdown value every second until it reaches 0.
   */
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

  /**
   * The `resendOtp` function in TypeScript generates a new OTP.
   */
  resendOtp() {
    this.generateOtp();
  }

  /**
   * The function `saveSignChequeMandate` saves and signs cheque mandate approve options based on
   * selected EFT payments.
   */
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

  /**
   * The `rejectSignChequeMandate` function handles the rejection of cheque/eft payments by updating
   * the approval options and sending a request to sign the cheque mandate.
   */
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

  /**
   * The function `sendToCorrectionChequeMandate` sends selected cheque or EFT payments for correction
   * and displays success or error messages accordingly.
   */
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

  /**
   * The function `processActionEligibleAuthEmitted` toggles the eligible authorization modal to false.
   */
  processActionEligibleAuthEmitted(event) {
    this.toggleEligibleAuthModal(false);
  }

  /**
   * The function `toggleEligibleAuthModal` toggles the display of eligible authorizers in a TypeScript
   * class.
   */
  private toggleEligibleAuthModal(display: boolean) {
    this.showEligibleAuthorizers = display;
  }

  /**
   * The function `openEligibleAuthModal` retrieves eligible authorizers and toggles the eligible
   * authorization modal.
   */
  openEligibleAuthModal(data) {
    this.getEligibleAuthorizers(this.loggedInUser?.code, this.selectedBank?.brhCode, data?.chequeNo, data?.chequeAmount);
    this.toggleEligibleAuthModal(true);
  }

  /**
   * The function `processActionSignedByEmitted` toggles the `SignedByModal` to false.
   */
  processActionSignedByEmitted(event) {
    this.toggleSignedByModal(false);
  }

  /**
   * The function `toggleSignedByModal` toggles the display of a modal.
   */
  private toggleSignedByModal(display: boolean) {
    this.showSignedBy = display;
  }

  /**
   * The function `openSignedByModal` toggles a modal and retrieves information about the signed-by
   * user.
   */
  openSignedByModal(data) {
    this.toggleSignedByModal(true);
    this.getSignedBy(this.loggedInUser?.code, data?.chequeNo, this.selectedBank?.brhCode)
  }

  /**
   * The function `getBankAccount()` retrieves bank account information for a logged-in user.
   */
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

  /**
   * The function `getPaymentTypes` retrieves EFT payment types for a logged-in user.
   */
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

  /**
   * The function `getEligibleAuthorizers` retrieves eligible authorizers for a given user, branch,
   * cheque number, and cheque amount.
   */
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

  /**
   * The function `getSignedBy` retrieves signed by information for a given user code, cheque number,
   * and branch code.
   */
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

  /**
   * The function `getTransactionDetails` retrieves transaction details based on the provided cheque
   * number, user code, and payment category.
   */
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

  /**
   * The function `getEFTMandateRequisitions` retrieves EFT mandate requisitions based on specified
   * parameters and handles success and error cases accordingly.
   */
  getEFTMandateRequisitions(bankCode: number, userCode: number, paymentType: string,
                            fromDate: string, toDate: string, pageNo: number, pageSize: number,
                            sortField: any, sortDirection: string) {
    this.spinner.show();

    this.fmsService.getEftMandateRequisitions(bankCode, userCode, paymentType, fromDate, toDate,
      pageNo? pageNo : this.pageNumber, pageSize ? pageSize : this.pageSize, '', '', '',
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

  /**
   * The `lazyLoadEft` function in TypeScript handles lazy loading of data for EFT mandate requisitions
   * based on the provided event parameters.
   */
  lazyLoadEft(event?: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event?.first / event?.rows + 1;
    const pageSize = event?.rows;
    const sortField = event?.sortField ? event?.sortField : '';
    const sortOrder = event?.sortOrder == 1 ? 'asc' : 'desc';

    this.getEFTMandateRequisitions(this.formPayload?.bankCode, this.loggedInUser?.code,
      this.formPayload?.paymentType, this.formPayload?.fromDate, this.formPayload?.toDate, pageIndex, pageSize, sortField, sortOrder)
  }

  /**
   * This TypeScript function retrieves cheque mandate requisitions based on specified parameters and
   * handles success and error responses accordingly.
   */
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

  /**
   * The function `onTextChange` updates the `remark` property based on the value of the event target.
   */
  onTextChange(event, exception) {
    this.remark = event.target.value;
  }

  /**
   * The `fetchDocs` function fetches documents by claim number using the `dmsService` and opens a
   * document viewer modal to display the fetched documents.
   */
  fetchDocs(eftAuth: any) {
    this.dmsService.fetchDocumentsByClaimNo(eftAuth)
      .pipe(untilDestroyed(this))
      .subscribe( claimDocs =>
      {
        this.documentList = claimDocs;
        log.info('documents', this.documentList)
        this.openDocViewerModal();
        this.fetchSelectedDoc();
      });
  }

  /**
   * The function fetches documents based on a selected document from a list.
   */
  fetchSelectedDoc() {
    this.documentList.forEach(doc => {

      this.fetchDocuments(doc.id)
    })

  }

  /**
   * The `fetchDocuments` function fetches a document by its ID, processes the document data, and adds
   * it to a list of documents.
   * @param docId - The `docId` parameter in the `fetchDocuments` function is used to identify the
   * document that needs to be fetched from the DMS (Document Management System). The function logs the
   * `docId`, retrieves the document data using the `dmsService.getDocumentById(docId)` method, and
   * then
   */
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

  /**
   * The `filterEft` function filters EFT mandate requisitions based on various criteria and retrieves
   * the data asynchronously.
   */
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

  /**
   * The function `updateFilter` updates the value of a filter in an object based on user input.
   */
  updateFilter(event) {
    const target = event.target as HTMLInputElement;
    const filterName = target.name;
    const value = target.value;
    this.filterObject[filterName] = value;
  }

  ngOnDestroy() {}

}
