/**
 * @fileOverview This file contains the `ReceiptCaptureComponent`, which handles the capture of receipt details.
 * It manages user input through a reactive form, interacts with various services to fetch data,
 * and controls the flow of the receipting process.
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationDTO } from '../../../crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { CurrencyDTO } from 'src/app/shared/data/common/currency-dto';
import {
  BanksDTO,
  BranchDTO,
  ChargeManagementDTO,
  ChargesDTO,
  ExistingChargesResponseDTO,
  NarrationDTO,
  ReceiptingPointsDTO,
  ReceiptNumberDTO,
} from '../../data/receipting-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { ReceiptService } from '../../services/receipt.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PaymentModesDTO } from '../../data/auth-requisition-dto';
import { FmsService } from '../../services/fms.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
/**
 * @Component({
 *   selector: 'app-receipt-details',
 *   templateUrl: './receipt-capture.component.html',
 *   styleUrls: ['./receipt-capture.component.css']
 * })
 * The `ReceiptCaptureComponent` handles the capture of receipt details, including user and organization information,
 * currency and payment details, and manages interactions with various backend services to fetch and store data.
 */
@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-capture.component.html',
  styleUrls: ['./receipt-capture.component.css'],
})
export class ReceiptCaptureComponent {
   /**
   * @event formValuesChange - EventEmitter for when receipt details form values changes
   */
  @Output() formValuesChange = new EventEmitter<any>();
    /**
   * @property {FormGroup} receiptingDetailsForm - The reactive form for capturing receipt details.
   */
  receiptingDetailsForm: FormGroup;
  /**
   * @property {any} loggedInUser - The currently logged-in user's data.
   */
  // 1.2 User & Organization and Branch Details
  loggedInUser: any;
    /**
   * @property {any} GlobalUser -  Potentially deprecated user data. Consider removing if unused.
   */
  GlobalUser: any;
   /**
   * @property {OrganizationDTO} defaultOrg - The default organization.
   */
  defaultOrg: OrganizationDTO;
    /**
   * @property {OrganizationDTO[]} organization - An array of organizations.
   */
    orgIdToUse:number;
  organization: OrganizationDTO[];
  selectedOrg:OrganizationDTO;
  /**
   * @property {BranchDTO} defaultBranch - The default branch.
   */
  defaultBranch: BranchDTO;
  /**
   * @property {StaffDto} users - The Staff data to fetch client details
   */
  users: StaffDto;
    /**
   * @property {BranchDTO[]} branches - An array of available branches.
   */
  branches: BranchDTO[] = [];
   /**
   * @property {number} organizationId - The ID of the organization.
   */
  organizationId: number;
    /**
   * @property {number | null} selectedCountryId - The ID of the selected country (nullable).
   */
 
  
  /**
   * @property {string | null} selectedOrganization - The name of the currently selected organization (nullable).
   */
  selectedOrganization: string | null = null; // Currently selected organization
    /**
   * @property {any} selectedBranchId - ID of the selected branch.
   * @deprecated Consider using defaultBranch.id or selectedBranch directly.
   */
  
   /**
   * @property {string} defaultBranchName - The name of the default branch.
   * @deprecated Consider accessing defaultBranch.name directly.
   */
 
   /**
   * @property {number} selectedOrgId - The ID of the selected organization.
   */
  
 


  /**
   * @property {number} receiptigPointId - The ID of the receipting point.
   */
  receiptigPointId: number;
  /**
   * @property {BanksDTO} selectedBank - The selected bank details.
   */
  selectedBank: BanksDTO;
/**
   * @property {boolean} backdatingEnabled - Flag to enable backdating (adjust this based on business logic).
   */
  //control flags
  backdatingEnabled = true; // Adjust this based on your logic
  /**
   * @property {boolean} isNarrationFromLov - Flag indicating if narration is selected from the list of values.
   */
  isNarrationFromLov = false;
   /**
   * @property {boolean} isSaveBtnActive - Flag indicating if the save button is active.
   */
  isSaveBtnActive = true;
  
  /**
   * @property {boolean} isSubmitButtonVisible - Flag indicating if the submit button is visible.
   */
  isSubmitButtonVisible: boolean = false;
   /**
   * @property {boolean} exchangeRateText - Flag to control the visibility of exchange rate text.
   */
  exchangeRateText: boolean = false;
  
  /**
   * @property {boolean} exchangeFound - Flag to indicate if an exchange rate was found.
   */
  exchangeFound: boolean = false;
  // 1.3 Receipt capture Details
/**
   * @property {BankDTO[]} drawersBanks - Array of banks for the drawers.
   */
  drawersBanks: BankDTO[] = [];
  /**
   * @property {CurrencyDTO[]} currencies - Array of available currencies.
   */
  //currency details
  currencies: CurrencyDTO[] = [];
   /**
   * @property {number | null} defaultCurrencyId - The ID of the default currency (nullable).
   */
  defaultCurrencyId: number | null = null;
    /**
   * @property {number} exchangeRate - The default exchange rate.
   */i
  exchangeRate: number = 0; // Default exchange rate
 /**
   * @property {PaymentModesDTO[]} paymentModes - An array of available payment modes.
   */
  //payment mode details
  paymentModes: PaymentModesDTO[] = [];
  
  /**
   * @property {boolean} showChequeOptions - Flag to control the visibility of cheque options.
   */
  showChequeOptions: boolean = false;
    /**
   * @property {string} selectedPaymentMode - The currently selected payment mode.
   */
  selectedPaymentMode: string = '';
    /**
   * @property {boolean} isChequeOptionSelected - Flag indicating if a cheque option is selected.
   */

  isChequeOptionSelected: boolean = false;

  /**
   * @property {string | undefined} currencySymbolGlobal - The global currency symbol (undefined if not set).
   */
  currencySymbolGlobal: string | undefined;
  
  /**
   * @property {string | undefined} selectedCurrencySymbol - The symbol of the selected currency (undefined if not set).
   */
  selectedCurrencySymbol: string | undefined; // To store the currency symbol for checks
   /**
   * @property {number} selectedCurrencyCode - The code of the selected currency.
   */
  selectedCurrencyCode: number = 0;
    /**
   * @property {number | null} currencyGlobal - Global currency details.
   */
  currencyGlobal: number | null = null;
    /**
   * @property {string | undefined} exchangeRates - Fetched exchange rate (undefined if not set).
   */
  exchangeRates: string | undefined; // Fetched exchange rate
  
  /**
   * @property {any} manualExchangeRate - The manually entered exchange rate.
   */
  manualExchangeRate: any;
   /**
   * @property {any} defaultCurrencyName - The name of the default currency.
   */
  defaultCurrencyName: any;
  
  /**
   * @property {string} minDate - The minimum allowed date for receipt or document date (used to enable backdating).
   */
  //document and receipt date details
  minDate: string; // To enable backdating if necessary
   /**
   * @property {string} maxDate - The maximum allowed date for receipt or document date (used to disable future dates).
   */
  maxDate: string; // To disable future dates
 /**
   * @property {ReceiptingPointsDTO[]} receiptingPoints - An array of available receipting points.
   */
  //receipting point details
  receiptingPoints: ReceiptingPointsDTO[] = [];
  /**
   * @property {number} receiptingPointId - The ID of the receipting point.
   */
  receiptingPointId: number;
    /**
   * @property {string} receiptingPointAutoManual - AutoManual configuration of receipt
   */
  receiptingPointAutoManual: string;
  
  /** @property {string} receiptingPointName - The  name receipting point. */
  receiptingPointName: string;
    /**
   * @property {any} currentReceiptingPoint - The selected receipting point details.
   */
  currentReceiptingPoint: any;
  
  /**
   * @property {number} globalReceiptNumber - The global receipt number.
   */
  //fetchReceiptNumber
  globalReceiptNumber: number;
   /** @property {string} globalReceiptNo - The global receipt number to be used. */
  globalReceiptNo: string;
  
  /**
   * @property {any} setReceiptNumber - A variable to manage the receipt number.
   */
  setReceiptNumber: any;
  /**
   * @property {string | null} originalNarration - Stores the original narration when selected from the list (nullable).
   */
  originalNarration: string | null = null;
  
  /**
   * @property {boolean} onBankSelected - Flag if a bank was selected.
   */
  //Bank Details
  onBankSelected: boolean = false;
    /**
   * @property {BanksDTO[]} bankAccounts - An array of available bank accounts.
   */
  bankAccounts: BanksDTO[] = [];
  
  /** @property {any} globalBankAccountVariable - The bank details. */
  globalBankAccountVariable: any;
    /** @property {number} selectedBankCode - The code of the selected bank. */
  selectedBankCode: number;
   /**
   * @property {BanksDTO[]} filteredBankAccounts - Filtered list of bank accounts based on search criteria.
   */
  filteredBankAccounts: BanksDTO[] = [];
  
  /**
   * @property {string} bankSearchTerm - The search term for filtering bank accounts.
   */
  bankSearchTerm: string = '';
    /**
   * @property {number} globalBankCode - The global bank code.
   */
  globalBankCode: number;
    /**
   * @property {string} globalBankType - The global bank type.
   */
  globalBankType: string;
    /**
   * @property {NarrationDTO[]} narrations - An array of available narrations.
   */
  //narration details
  narrations: NarrationDTO[] = [];
    /**
   * @property {NarrationDTO[]} filteredNarrations - A filtered array of available narrations.
   */
  filteredNarrations: NarrationDTO[] = [];
   /**
   * @property {ChargesDTO[]} charges - An array of available charge types.
   */
  //receipt charges
  charges: ChargesDTO[] = [];
   /**
   * @property {ExistingChargesResponseDTO[]} chargeList - An array of existing charges.
   */
  chargeList: ExistingChargesResponseDTO[];
  
  /**
   * @property {boolean} chargesEnabled - Flag indicating if charges are enabled.
   */
  chargesEnabled: boolean = false;
  
  /**
   * @property {number} chargeAmount - The amount of the charge.
   */
  chargeAmount: number = 0;
  
  /** @property {number} receiptChargeId - Component-level variable to store the selected charge ID.*/
  receiptChargeId!: number; // Component-level variable to store the selected charge ID
  
  /**
   * @property {number} receiptResponse - The receipt response.
   */
  receiptResponse: number;
  selectedbranchId:number;
  /** @property {number | null} editReceiptExpenseId - To hold the receiptExpenseId of the edited charge.*/
  editReceiptExpenseId: number | null = null; // To hold the receiptExpenseId of the edited charge
  selectedBranch:BranchDTO;

/**
   * Constructor for the `ReceiptCaptureComponent`.
   *
   * @param {FormBuilder} fb - The form builder for creating reactive forms.
   * @param {StaffService} staffService - Service for retrieving staff-related data.
   * @param {GlobalMessagingService} globalMessagingService - Service for displaying global messages.
   * @param {ReceiptService} receiptService - Service for handling receipt-related operations.
   * @param {OrganizationService} organizationService - Service for retrieving organization-related data.
   * @param {BankService} bankService - Service for retrieving bank-related data.
   * @param {CurrencyService} currencyService - Service for retrieving currency-related data.
   * @param {AuthService} authService - Service for handling authentication.
   * @param {FmsService} fmsService - Service for handling FMS-related operations.
   * @param {ReceiptDataService} receiptDataService - Service for managing receipt data across the application.
   * @param {Router} router - The Angular router for navigation.
   */
  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private receiptService: ReceiptService,
    private organizationService: OrganizationService,
    private bankService: BankService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private fmsService: FmsService,
    private receiptDataService: ReceiptDataService,
    private router: Router,
    private localStorage:LocalStorageService,
    private sessionStorage:SessionStorageService
  ) {}
 /**
   * Lifecycle hook called once the component is initialized.
   * It initializes the form, retrieves data from localStorage, and fetches required data from backend services.
   * @returns {void}
   */
  ngOnInit(): void {
    this.captureReceiptForm();
    this.loggedInUser = this.authService.getCurrentUser();
  //  let my =this.sessionStorage.getItem('user');
  //  console.log('my>',my);
  
    // Retrieve organization from localStorage or receiptDataService
  let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
  let storedDefaultOrg = this.sessionStorage.getItem('defaultOrg');
  
  this.selectedOrg = storedSelectedOrg ? JSON.parse(storedSelectedOrg) : null;
  this.defaultOrg = storedDefaultOrg ? JSON.parse(storedDefaultOrg) : null;

  // Ensure only one organization is active at a time
  if (this.selectedOrg) {
    this.defaultOrg = null;
  } else if (this.defaultOrg) {
    this.selectedOrg = null;
  }

 

  // Retrieve branch from localStorage or receiptDataService
  let storedSelectedBranch = this.sessionStorage.getItem('selectedBranch');
  let storedDefaultBranch = this.sessionStorage.getItem('defaultBranch');

  this.selectedBranch = storedSelectedBranch ? JSON.parse(storedSelectedBranch) : null;
  this.defaultBranch = storedDefaultBranch ? JSON.parse(storedDefaultBranch) : null;

  // Ensure only one branch is active at a time
  if (this.selectedBranch) {
    this.defaultBranch = null;
  } else if (this.defaultBranch) {
    this.selectedBranch = null;
  }

  
   
    
    let users = this.sessionStorage.getItem('user');
    this.users = JSON.parse(users);

    

    const currentDate = new Date();
    this.minDate = ''; // Set this based on your business logic (e.g., earliest backdate allowed)
    this.maxDate = this.formatDate(currentDate);

  

    // let selectedCountryId = localStorage.getItem('selectedCountryId');
    // this.selectedCountryId = Number(selectedCountryId);

    this.fetchDrawersBanks(
       this.selectedOrg?.country.id || this.defaultOrg?.country.id
    );
    this.fetchCurrencies();
    this.fetchPayments(this.selectedOrg?.id || this.defaultOrg?.id);
    //this.fetchBanks(this.defaultBranchId || this.selectedBranchId,this.defaultCurrencyId);
    this.restoreFormData(); // Restore saved data


    this.fetchReceiptNumber(
      this.defaultBranch?.id || this.selectedBranch?.id,
      this.loggedInUser.code
    );
    this.fetchNarrations();
  }

  /**
   * Initializes the `receiptingDetailsForm` with the required form controls and validators.
   * @returns {void}
   */
  captureReceiptForm() {
    const today = this.formatDate(new Date()); // Get current date in 'yyyy-MM-dd' format
    this.receiptingDetailsForm = this.fb.group({
      selectedBranch: ['', Validators.required],
      organization: ['', Validators.required], // Set default value here as well
      amountIssued: ['', Validators.required],
      receiptingPoint: ['', Validators.required],
      openCheque: [''],
      receiptNumber: ['', Validators.required],
      // receiptNumber: [{ value: '', disabled: true }],
      ipfFinancier: [''],
      grossReceiptAmount: [''],
      receivedFrom: ['', Validators.required],
      drawersBank: ['', [Validators.required, Validators.minLength(1)]], // Drawers bank required if not cash
      receiptDate: [today, Validators.required],
      narration: ['', [Validators.required, Validators.maxLength(255)]],
      paymentRef: ['', Validators.required],
      otherRef: [''],
      documentDate: [today, Validators.required],
      manualRef: [''],
      currency: ['', Validators.required], // Default currency is KES
      paymentMode: ['', Validators.required],
      chequeType: ['', Validators.required],
      bankAccount: ['', Validators.required],
      exchangeRate: ['', [Validators.required, Validators.min(0)]],
      exchangeRates: [''],
      manualExchangeRate: ['', [Validators.required, Validators.min(0.01)]],

      charges: ['no', Validators.required],
      chargeAmount: [''],
      selectedChargeType: ['', Validators.required],
    });
  }

  /**
   * Restores form data from the ReceiptDataService if available.
   * @returns {void}
   */
  restoreFormData() {
    const savedData = this.receiptDataService.getReceiptData();
    if (savedData) {
      this.receiptingDetailsForm.patchValue(savedData);
    }
  }
 /**
   * Fetches available payment methods from the `FmsService`.
   * @param {number} orgCode - The organization code.
   * @returns {void}
   */
  fetchPayments(orgCode: number) {
    this.fmsService.getPaymentMethods(orgCode).subscribe({
      next: (response) => {
        this.paymentModes = response.data;
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'error',
          'error fetching payments modes'
        );
      },
    });
  }
  /**
   * Fetches available currencies from the `CurrencyService` and sets the default currency.
   * @returns {void}
   */
  fetchCurrencies() {
    this.currencyService.getCurrencies().subscribe({
      next: (currencies: CurrencyDTO[]) => {
        this.currencies = currencies;

        // Find the default currency - using string literal 'Y' directly
        const defaultCurrency = currencies.find(
          (curr) => curr.currencyDefault === 'Y'
        );

        if (defaultCurrency) {
          this.defaultCurrencyId = defaultCurrency.id;
          const defaultCurrencySymbol = defaultCurrency.symbol;
          this.sessionStorage.setItem(
            'defaultCurrencyId',
            String(this.defaultCurrencyId)
          );
          this.defaultCurrencyName = defaultCurrency.symbol;

          this.receiptingDetailsForm.patchValue({
            currency: this.defaultCurrencyId, // Use ID instead of symbol
          });
          console.log('default branch>',this.defaultBranch?.id);
          console.log('selected branch>',this.selectedBranch?.id);
          this.fetchBanks(
            this.defaultBranch?.id || this.selectedBranch?.id,
            this.defaultCurrencyId
          );
        }
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to fetch currencies'
        );
      },
    });
  }
 /**
   * Handles the currency change event, updating the selected currency code and fetching the corresponding exchange rate.
   * @param {Event} event - The currency change event.
   * @returns {void}
   */
  onCurrencyChanged(event: Event): any {
    this.exchangeRateText = true;
    const selectedCurrencyCodes = (event.target as HTMLSelectElement).value;
    this.selectedCurrencyCode = Number(selectedCurrencyCodes);
    
    this.fetchBanks(
      this.defaultBranch?.id || this.selectedBranch?.id,
      this.selectedCurrencyCode
    );
    // Find the currency from the list
    const selectedCurrency = this.currencies.find(
      (currency) => currency.id === this.selectedCurrencyCode
    );

    // Get the symbol of the selected currency
    this.selectedCurrencySymbol = selectedCurrency
      ? selectedCurrency.symbol
      : '';
// **STOP if the selected currency is the same as the default currency**
if (this.selectedCurrencyCode === Number(this.defaultCurrencyId)) {
  console.log('selectedCurrencyCode',this.selectedCurrencyCode);
  console.log('defaultCurrencyId',this.defaultCurrencyId);
  this.exchangeRate = 0; // Reset exchange rate
  this.exchangeFound = false; // Hide span text
  this.receiptingDetailsForm.patchValue({ exchangeRate: 0 }); // Clear exchange rate field
  return; // Stop execution
}   
     
  }
/**
   * Fetches the exchange rate for the selected currency from the `CurrencyService`.
   * @returns {void}
   */
  fetchCurrencyRate() {
    // if (!this.defaultBranch?.id ) {
    //  // console.error('Branch ID is not set');
    //   return;
    // }
  

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    this.currencyService.getCurrenciesRate(this.defaultCurrencyId).subscribe({
      next: (rates) => {
        const matchingRates = rates.filter(
          (rate) => rate.targetCurrencyId === this.selectedCurrencyCode
        );

        if (matchingRates.length === 0) {
          this.exchangeRate = 0; // Set exchange rate to zero
          this.exchangeFound = false; // Hide span text
          this.receiptingDetailsForm.patchValue({ exchangeRate: 0 });
        } else if (matchingRates.length === 1) {
          this.exchangeRate = matchingRates[0].rate; // Assign exchange rate
          this.exchangeFound = true; // Show span text
          this.sessionStorage.setItem('exchangeRate', String(this.exchangeRate));
          this.receiptingDetailsForm.patchValue({
            exchangeRate: this.exchangeRate,
          });
        } else {
          const validRates = matchingRates
            .filter((rate) => new Date(rate.withEffectToDate) >= currentDate)
            .sort(
              (a, b) =>
                new Date(b.withEffectToDate).getTime() -
                new Date(a.withEffectToDate).getTime()
            );

          if (validRates.length > 0) {
            this.exchangeRate = validRates[0].rate; // Assign most recent exchange rate
            this.sessionStorage.setItem('exchangeRate', String(this.exchangeRate));
            this.exchangeFound = true; // Show span text
            this.receiptingDetailsForm.patchValue({
              exchangeRate: this.exchangeRate,
            });
          } else {
            this.exchangeRate = 0;
            this.exchangeFound = false;
            this.receiptingDetailsForm.patchValue({ exchangeRate: 0 });
          }
        }
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.error
        );
        this.showExchangeRateModal2();
      },
    });
  }
/**
   * Confirms the manual exchange rate value and posts it to the backend service.
   * @returns {void}
   */
  confirmExchangeRateValue(): void {
    this.manualExchangeRate =
      this.receiptingDetailsForm.get('manualExchangeRate')?.value;
    // Update form first

    if (this.manualExchangeRate > 0) {
      this.receiptingDetailsForm.patchValue({
        exchangeRate: this.exchangeRate,
      });

      this.receiptService
        .postManualExchangeRate(
          this.selectedCurrencyCode,
          1, // organizationId
          'FMSADMIN',
          this.exchangeRate
        )
        .subscribe({
          next: (response) => {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Exchange rate saved successfully'
            );
            this.closeModal2();
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              `Failed to save exchange rate: ${
                err.error?.message || err.message || 'Unknown error'
              }`
            );
          },
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Validation Error',
        'Please enter a valid exchange rate value greater than 0'
      );
    }
  }
  
  /**
   * Confirms the exchange rate.
   * @returns {void}
   */
  confirmExchangeRate(): void {
    this.closeModal2();
  }
/**
   * Closes the exchange rate modal.
   * @returns {void}
   */
  closeModal2(): void {
    const modal = document.getElementById('exchangeRateModal2');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  closeModal(): void {
    const modal = document.getElementById('exchangeRateModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
 /**
   * Shows the exchange rate modal.
   * @returns {void}
   */
  showExchangeRateModal(): void {
    const modal = document.getElementById('exchangeRateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  /**
   * Shows the exchange rate modal.
   * @returns {void}
   */
  showExchangeRateModal2(): void {
    2;
    const modal = document.getElementById('exchangeRateModal2');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  /**
   * Formats a date into 'yyyy-MM-dd' format.
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Fetches the list of drawers banks from the `BankService` based on the selected country and subscribes to call it.
   * @param {number} countryId - The ID of the country.
   * @returns {void}
   */

  fetchDrawersBanks(countryId: number) {
    // Use the countryId parameter in your API call
    this.bankService.getBanks(countryId).subscribe({
      next: (data) => {
        this.drawersBanks = data;
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to fetch drawer banks'
        );
      },
    });
  }
 /**
   * Handles hovering over a payment mode, showing cheque options if "Cheque" is selected.
   * @param {any} event - The hover event.
   * @returns {void}
   */
  onHoverPaymentMode(event: any) {
    const selectedPaymentMode = event.target.value;
    if (selectedPaymentMode === 'Cheque') {
      this.showChequeOptions = true;
    }
  }
  /**
   * Handles leaving a payment mode, hiding cheque options if no cheque type is selected.
   * @returns {void}
   */
  onLeavePaymentMode() {
    if (!this.receiptingDetailsForm.get('chequeType')?.value) {
      this.showChequeOptions = false;
    }
  }
/**
   * Handles leaving the cheque options, hiding them if no cheque type is selected.
   * @returns {void}
   */
  onLeaveChequeOptions() {
    if (!this.receiptingDetailsForm.get('chequeType')?.value) {
      this.showChequeOptions = false;
    }
  }

  /**
   * Sets the cheque type in the form and hides the cheque options.
   * @param {string} type - The selected cheque type.
   * @returns {void}
   */
  setChequeType(type: string) {
    this.receiptingDetailsForm.get('chequeType')?.setValue(type);
    this.showChequeOptions = false; // Hide the options after selection
  }
 /**
   * Handles the selection of a payment mode, updating the form fields accordingly.
   * @param {any} event - The payment mode selection event.
   * @returns {void}
   */
  onPaymentModeSelected(event: any): void {
    const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
    this.selectedPaymentMode = paymentMode;
    this.updatePaymentModeFields(paymentMode);
  }

  /**
   * Updates the form fields based on the selected payment mode, enabling or disabling specific controls.
   * @param {string} paymentMode - The selected payment mode.
   * @returns {void}
   */
  updatePaymentModeFields(paymentMode: string): void {
    if (paymentMode === 'CASH') {
      this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });

      this.receiptingDetailsForm.get('drawersBank')?.disable();
      this.receiptingDetailsForm.get('paymentRef')?.disable();
    } else if (paymentMode === 'CHEQUE') {
      this.showChequeOptions = true;

      // // chequeTypeModal?.show(); // Always show the modal when "CHEQUE" is selected
      this.receiptingDetailsForm.get('drawersBank')?.enable();
      this.receiptingDetailsForm.get('paymentRef')?.enable();
    } else {
      //  this.resetChequeFields(chequeTypeModal);
      this.receiptingDetailsForm.get('drawersBank')?.enable();
      this.receiptingDetailsForm.get('paymentRef')?.enable();
    }
  }
  
  /**
   * Fetches the list of bank accounts from the `ReceiptService` based on the selected branch and currency and subscribes to call it..
   * @param {number} branchCode - The branch code.
   * @param {number} currCode - The currency code.
   * @returns {void}
   */
  fetchBanks(branchCode: number, currCode: number) {
    this.receiptService.getBanks(branchCode, currCode).subscribe({
      next: (response) => {
        this.bankAccounts = response.data;

        this.filteredBankAccounts = this.bankAccounts; // Initialize filtered list
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.error
        );
      },
    });
  }
   /**
   * Handles the selection of a bank, fetching receipting points and the receipt number for the selected bank.
   * @param {Event} event - The bank selection event.
   * @returns {void}
   */
  onBank(event: Event): void {
    const selectedBankCode = +(event.target as HTMLSelectElement).value; // Use '+' to convert string to number
    this.selectedBankCode = selectedBankCode; // Store the selected bank code
    // Find the selected bank object based on the code
    const selectedBank = this.bankAccounts.find(
      (bank) => bank.code === selectedBankCode
    );

    if (selectedBank) {
      this.selectedBank = selectedBank;

     
      this.sessionStorage.setItem('selectedBank', JSON.stringify(this.selectedBank));
    } else {
    }

    this.onBankSelected = true;

    this.receiptService
      .getReceiptingPoints(
        this.defaultBranch?.id || this.selectedBranch?.id,
        this.loggedInUser.code
      )
      .subscribe({
        next: (response: { data: ReceiptingPointsDTO[] }) => {
          if (response.data.length > 0) {
            const receiptingPoint = response.data[0]; // Use the first receipting point
            this.receiptingDetailsForm
              .get('receiptingPoint')
              ?.setValue(receiptingPoint.name);
            this.receiptingPointId = receiptingPoint.id;

            this.receiptingPointAutoManual = receiptingPoint.autoManual;

            this.sessionStorage.setItem(
              'receiptingPoint',
              JSON.stringify(receiptingPoint)
            );
          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'No receipting point data found.'
            );
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            err.error?.message || 'Failed to fetch receipting points.'
          );
        },
      });

  
    this.fetchReceiptNumber(
      this.defaultBranch?.id || this.selectedBranch?.id,
      this.loggedInUser.code
    );
  }
  /**
   * Fetches the receipt number from the `ReceiptService` for the selected branch and user.
   * @param {number} branchCode - The branch code.
   * @param {number} userCode - The user code.
   * @returns {void}
   */
  fetchReceiptNumber(branchCode: number, userCode: number): void {
    this.receiptService.getReceiptNumber(branchCode, userCode).subscribe({
      next: (response: ReceiptNumberDTO) => {
        if (response?.receiptNumber) {
          this.globalReceiptNo = response.receiptNumber;
          this.globalReceiptNumber = response.branchReceiptNumber;

          this.sessionStorage.setItem(
            'branchReceiptNumber',
            this.globalReceiptNumber.toString()
          );
          //store receipt number string visible to Ui
          this.sessionStorage.setItem('receiptCode', this.globalReceiptNo);
          // Update the form control
          this.receiptingDetailsForm
            .get('receiptNumber')
            ?.setValue(this.globalReceiptNo);
          //this.fetchReceiptValidationStatus();
        } else {
        }
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to fetch receipt number'
        );
      },
    });
  }
/**
 * Fetches the list of available narrations from the `ReceiptService`.
 * Populates the `narrations` and `filteredNarrations` arrays.
 * @returns {void}
 */
  fetchNarrations() {
    this.receiptService.getNarrations().subscribe({
      next: (response) => {
        this.narrations = response.data || [];
        this.filteredNarrations = [...this.narrations]; // Copy for display
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.error
        );
      },
    });
  }
 /**
   * Handles the narration dropdown change event.
   * Populates the narration field with the selected value, resets the dropdown,
   * and updates the `filteredNarrations` list.
   * @param {any} event - The dropdown change event.
   * @returns {void}
   */
  onNarrationDropdownChange(event: any): void {
    const selectedValue = event.target.value;

    if (selectedValue) {
      this.originalNarration = selectedValue;
      this.isNarrationFromLov = true;

      // Populate the textarea with the selected narration
      this.receiptingDetailsForm.get('narration')?.patchValue(selectedValue);

      // Reset the dropdown to visually empty state
      setTimeout(() => (event.target.value = ''), 0);

      // Remove the selected narration from the dropdown
      this.filteredNarrations = this.narrations.filter(
        (data) => data.narration !== selectedValue
      );
    }
  }
   /**
   * Handles changes in the narration text field.
   * Restores the filtered narrations if the narration text is cleared.
   * @returns {void}
   */
  onNarrationTextChange(): void {
    const narrationText = this.receiptingDetailsForm.get('narration')?.value;

    // If the user clears the narration, add it back to the dropdown
    if (!narrationText && this.originalNarration) {
      this.filteredNarrations = [...this.narrations]; // Restore narrations
      this.originalNarration = null; // Reset original narration
      this.isNarrationFromLov = false; // Reset flag
    }
  }
    /**
   * Fetches charge types from the `ReceiptService` and subscribes to call it.
   * @returns {void}
   */
  // Fetch charge types
  fetchCharges(): void {
    this.receiptService
      .getCharges(this.users.organizationId, this.defaultBranch?.id || this.selectedBranch?.id)
      .subscribe({
        next: (response) => {
          this.charges = response.data;
          // console.log(this.charges);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            err.error.error
          );
        },
      });
  }
    /**
   * Fetches existing charges from the `ReceiptService` for a given receipt number and subscribes to call it.
   * @param {number} receiptNo - The receipt number.
   * @returns {void}
   */
  fetchExistingCharges(receiptNo: number): void {
    this.receiptService.getExistingCharges(receiptNo).subscribe({
      next: (response) => {
        this.chargeList = response.data;

        //  console.log('Existing charges:', this.chargeList);
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.error
        );
      },
    });
  }

  /**
   * Handles changes in the charge selection radio button.
   * Enables the charges section, fetches available charges, and displays the charges modal.
   * @param {string} option - The selected option ('yes' to enable charges).
   * @returns {void}
   */
  // Handle changes in charge radio button
  onChargesChange(option: string): void {
    if (option === 'yes') {
      this.chargesEnabled = true;
      this.fetchCharges();
      this.fetchExistingCharges(this.globalReceiptNumber);
      const chargeType =
        this.receiptingDetailsForm.get('selectedChargeType')?.value;
      const chargeAmount =
        this.receiptingDetailsForm.get('chargeAmount')?.value;
      this.chargeAmount = chargeAmount;

      const modal = document.getElementById('chargesModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
      }
    }
  }
   /**
   * Edits a selected charge and populates the form with its details.
   * Displays the submit button and hides the save button.
   * @param {number} index - The index of the charge in the `chargeList`.
   * @returns {void}
   */
  editCharge(index: number): void {
    const charge = this.chargeList[index];
    this.editReceiptExpenseId = charge.id; // Store receiptExpenseId for this charge
    this.receiptChargeId = charge.receiptChargeId; // Store receiptChargeId if needed

    // Populate the form with the charge details
    this.receiptingDetailsForm.patchValue({
      selectedChargeType: charge.receiptChargeName,
      chargeAmount: charge.amount,
    });

    // Show the Submit button and hide Save button
    this.isSubmitButtonVisible = true;
    this.isSaveBtnActive = false;
  }
  submitChargeManagement(): void {
    const payload: ChargeManagementDTO = {
      addEdit: 'A',
      //receiptExpenseId: 12345678,
      // receiptNo: this.branchNo,
      receiptNo: this.globalReceiptNumber,
      receiptChargeId: this.receiptChargeId,
      receiptChargeAmount: this.chargeAmount,
      suspenseRct: 'N',
    };

    this.receiptService.postChargeManagement(payload).subscribe({
      next: (response) => {
        // Ensure modal is active before hiding
        const modalElement = document.getElementById('chargesModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement!);
        const getAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
        // Reset the form to clear input fields
        // Update chargeAmount input field with saved value
        this.receiptingDetailsForm.patchValue({
          chargeAmount: this.chargeAmount,
        });
        if (modalInstance) {
          modalInstance.hide();
        } else {
        }
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to post charge management. Please try again.'
        );
      },
    });
  }
  /**
   * Deletes a charge by calling the `ReceiptService` and handles the response.
   * @param {number} index - The index of the charge to delete in the `chargeList`.
   * @returns {void}
   */
  
  deleteCharge(index: number): void {
    const charge = this.chargeList[index];

    const payload = {
      addEdit: 'D',
      receiptExpenseId: charge.id,
      receiptNo: this.globalReceiptNumber,
      receiptChargeId: charge.receiptChargeId,
      receiptChargeAmount: this.chargeAmount,
      suspenseRct: 'N',
    };

    this.receiptService.postChargeManagement(payload).subscribe({
      next: (response) => {
        //  console.log('Charge deleted successfully:', response);

        this.chargeList.splice(index, 1); // Remove from list
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to delete charge. Please try again.'
        );
      },
    });
  }
/**
   * Saves charge details.
   * @returns {void}
   */
  saveCharges(): void {
    const chargeType =
      this.receiptingDetailsForm.get('selectedChargeType')?.value;
    const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
    this.chargeAmount = chargeAmount;

    const selectedCharge = this.charges.find(
      (charge) => charge.name === chargeType
    );
    this.receiptChargeId = selectedCharge.id; // Fetch the receiptChargeId
    console.log('charges>', selectedCharge);
    if (chargeAmount && chargeType) {
      this.submitChargeManagement();
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'all fields are required!'
      );
    }
    this.fetchExistingCharges(this.globalReceiptNumber);
  }
  /**
   * Refreshes the list of charges by calling `fetchCharges()`.
   * @returns {void}
   */
  // Refresh charges list after add or edit
  refreshCharges(): void {
    // Call your service to fetch the updated charges
    this.fetchCharges();
  }
  // Submit edited charge
  onEditSubmit(): void {
    const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
    const selectedChargeType =
      this.receiptingDetailsForm.get('selectedChargeType')?.value;
    // Populate the form with the charge details

    if (
      !chargeAmount ||
      !selectedChargeType ||
      !this.editReceiptExpenseId ||
      !this.receiptChargeId
    ) {
      this.globalMessagingService.displayWarningMessage(
        'Warning:',
        'All Fields are required'
      );
      return;
    }

    const payload = {
      addEdit: 'E',
      receiptExpenseId: this.editReceiptExpenseId, // Use the stored receiptExpenseId
      receiptNo: this.globalReceiptNumber, // Assuming a static receipt number for now
      receiptChargeId: this.receiptChargeId, // Use the stored receiptChargeId
      receiptChargeAmount: chargeAmount, // Use the updated charge amount
      suspenseRct: 'N',
    };

    this.receiptService.postChargeManagement(payload).subscribe({
      next: (response) => {
        // Update chargeAmount input field with saved value

        this.isSubmitButtonVisible = false; // Hide the Submit button after submission

        // Reset the form to clear input fields
        // Update chargeAmount input field with edited value
        this.receiptingDetailsForm.patchValue({
          chargeAmount: chargeAmount,
        });
        // Optionally refresh the charge list or handle other UI updates'
        const modalElement = document.getElementById('chargesModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement!);

        if (modalInstance) {
          modalInstance.hide();
        }
        this.refreshCharges();
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to update charge. Please try again.'
        );
      },
    });
    this.receiptingDetailsForm.patchValue(chargeAmount);
    this.isSaveBtnActive = true;
  }
/**
   * Displays the charges modal programmatically.
   * @returns {void}
   */
  showChargesModal(): void {
    // Open the modal programmatically every time "Yes" is clicked
    const chargesModal = new bootstrap.Modal(
      document.getElementById('chargesModal')
    );
    chargesModal.show();
  }
  /**
   * Validates the receipt details form
   *  to ensure that all required fields are completed correctly.
   * @returns {void}
   */
  validateForm() {
    const requiredFields = [
      'amountIssued',
      'bankAccount',
      'paymentMode',
      'narration',
      'currency',
      'receiptDate',
      'receivedFrom',
    ];
    let isValid = true;
    const formData = this.receiptingDetailsForm;
    // Check all required fields first
    for (const field of requiredFields) {
      const control = formData.get(field);
      if (!control || !control.value) {
        isValid = false;
        this.globalMessagingService.displayErrorMessage(
          'Warning:',
          'Please fill all required Fields marked with asterisk'
        );
        return;
      }
    }

    // Special validation for payment reference when payment mode is not cash
    const paymentMode = formData.get('paymentMode')?.value;
    const paymentRef = formData.get('paymentRef')?.value;
    const drawersBank = formData.get('drawersBank')?.value;

    if (paymentMode && paymentMode.toLowerCase() !== 'cash' && !paymentRef) {
      isValid = false;
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Payment Reference is required for non-cash payment modes'
      );
      return false;
    }
    if (paymentMode && paymentMode.toLowerCase() !== 'cash' && !drawersBank) {
      isValid = false;
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Drawers Bank is required for non-cash payment modes'
      );
      return false;
    }

    this.onNext();
  }
   /**
   * Resets the form values to the default
   * @returns {void}
   */
  clearForm(): void {
    
 // Store current values of fields to preserve
 const preservedValues = {
  currency: this.receiptingDetailsForm.get('currency')?.value,
  organization: this.receiptingDetailsForm.get('organization')?.value,
  selectedBranch:this.receiptingDetailsForm.get('selectedBranch')?.value,
  documentDate: this.receiptingDetailsForm.get('documentDate')?.value,
  receiptDate: this.receiptingDetailsForm.get('receiptDate')?.value
};
this.receiptingDetailsForm.reset();
    // Restore preserved values
    this.receiptingDetailsForm.patchValue({
      currency: preservedValues.currency,
      organization: preservedValues.organization,
      selectedBranch:preservedValues.selectedBranch,
      documentDate: preservedValues.documentDate,
      receiptDate: preservedValues.receiptDate
    });
  }
   /**
   * Navigates to the previous screen
   *  which in this case is home screen.
   * @returns {void}
   */
  onBack() {
    //this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
    this.router.navigate(['/home/fms/']); // Navigate to the next screen
  }
   /**
   * Navigates to the next screen
   *   which in this case is client screen .
   * @returns {void}
   */
  onNext() {
//     const paymentMethod = this.receiptingDetailsForm.get('paymentMode')?.value;
// const drawersBank = this.receiptingDetailsForm.get('drawersBank')?.value;
// const paymentRef = this.receiptingDetailsForm.get('paymentRef')?.value;
// const amountIssued = this.receiptingDetailsForm.get('amount Issued')?.value;
// console.log('amount issued',amountIssued);

    // if(paymentMethod==='CASH' && drawersBank !=null && paymentRef !=null){
    //   this.receiptingDetailsForm.reset('paymentRef');
    //   this.receiptingDetailsForm.get('paymentRef')?.setValue('');
    //   this.receiptingDetailsForm.get('drawersBank')?.setValue('');
    //   console.log('paymentRef',paymentRef);
    //   console.log('drawersBank',drawersBank);
    //   console.log('paymentModes',paymentMethod);

    // }
    this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
    const formData = this.receiptDataService.getReceiptData();
    console.log('form data>>',formData);
    this.router.navigate(['/home/fms/client-search']); // Navigate to the next screen
  }
}