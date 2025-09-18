import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  BranchDTO,
  DataItem,
  Period,
  YearDTO,
} from '../../data/receipting-dto';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { FmsSetupService } from '../../services/fms-setup.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-fms',
  templateUrl: './base-fms.component.html',
  styleUrls: ['./base-fms.component.css'],
})
export class BaseFmsComponent {
  // A master list of all menu groups
  allModuleGroups: any[][];
  // Form group for capturing receipt details
  receiptingDetailsForm: FormGroup;

  // User, Organization, and Branch Details
  loggedInUser: any; // Currently logged-in user
  defaultOrg: OrganizationDTO; // Default organization
  selectedOrg: OrganizationDTO;
  branches: BranchDTO[] = []; // List of branches
  defaultBranch: BranchDTO; // Default branch
  selectedBranch: BranchDTO; // Selected branch
  userDetails: StaffDto; // Current user details
  branch: BranchDTO;
  organization: OrganizationDTO[]; // List of organizations
  years: DataItem[] = []; // Store only the `data` array, not `YearDTO`
  periods: Period[] = []; // Stores periods based on selected year
  curentPeriod: Period[];
  selectedPeriod: any;
  selectedYear: string = ''; // Stores the selected year
  /**
   * Angular lifecycle hook that initializes the component.
   * Fetches necessary data and sets up the form.
   */
  ngOnInit(): void {
    this.captureReceiptForm();
     this.allModuleGroups = [
      this.setups,
      this.GLledger,
      this.cashbook,
      this.creditors,
      this.debtors,
    ];
    this.loggedInUser = this.authService.getCurrentUser();

    this.fetchUserDetails();
    this.fetchOrganization();
    this.fetchYears(1);
  }
  /**
   * Constructor for `BaseFmsComponent`.
   * @param authService Service for authentication
   * @param fb FormBuilder for creating reactive forms
   * @param organizationService Service for organization-related operations
   * @param staffService Service for staff-related operations
   * @param globalMessagingService Service for global messaging
   * @param receiptService Service for receipt-related operations
   */
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private receiptService: ReceiptService,
    private receiptDataService: ReceiptDataService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private fmsSetupService: FmsSetupService,
    private translate: TranslateService
  ) {}
  /**
   * Initializes the receipt capture form with default values and validators.
   */
  captureReceiptForm() {
    this.receiptingDetailsForm = this.fb.group({
      selectedBranch: ['', Validators.required],
      organization: ['', Validators.required], // Set default value here as well
      year: ['', Validators.required],
      period: ['', Validators.required],
    });
  }
  /**
   * Fetches the details of the logged-in user.
   */
  fetchUserDetails() {
    this.staffService.getStaffById(this.loggedInUser.code).subscribe({
      next: (data) => {
        this.userDetails = data;

        this.sessionStorage.setItem('user', JSON.stringify(this.userDetails));
      },
      error: (err) => {
        const customMessage = this.translate.instant('fms.errorMessage');
const backendError= err.error?.msg ||
              err.error?.error ||
              err.error?.status ||
              err.statusText;
          this.globalMessagingService.displayErrorMessage(
            customMessage,
            backendError
          );
      },
    });
  }
  /**
   * Fetches the list of organizations and sets the default organization.
   */
  fetchOrganization() {
    this.organizationService.getOrganization().subscribe({
      next: (data) => {
        this.organization = data;

        // Retrieve previously selected organization from storage
        let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
        let selectedOrg = storedSelectedOrg
          ? JSON.parse(storedSelectedOrg)
          : null;

        if (selectedOrg) {
          // If a selected organization exists, use it instead of default
          this.selectedOrg = selectedOrg;
          this.receiptingDetailsForm.patchValue({
            organization: selectedOrg.id,
          });
        } else {
          // Set the default organization if it exists
          const defaultOrg = this.organization.find((org) => org.id === 2);

          if (defaultOrg) {
            this.defaultOrg = defaultOrg;
            this.sessionStorage.setItem(
              'defaultOrg',
              JSON.stringify(this.defaultOrg)
            );

            //this.receiptDataService.setDefaultOrg(defaultOrg);
            this.fetchBranches(this.defaultOrg.id);
            // Use setTimeout to ensure form updates correctly
            setTimeout(() => {
              this.receiptingDetailsForm.patchValue({
                organization: this.defaultOrg.id,
              });
            });
            // this.receiptingDetailsForm.patchValue({
            //   organization: this.defaultOrg.id,
            // });
          } else {
            this.defaultOrg = null;
            this.fetchBranches(this.selectedOrg.id);
            this.sessionStorage.removeItem('defaultOrg');
          }
          if (!defaultOrg) {
            //console.warn('No default organization found. Setting first available organization.');
            this.defaultOrg =
              this.organization.length > 0 ? this.organization[0] : null;
          }
        }
      },
      error: (err) => {
       const customMessage = this.translate.instant('fms.errorMessage');
const backendError= err.error?.msg ||
              err.error?.error ||
              err.error?.status ||
              err.statusText;
          this.globalMessagingService.displayErrorMessage(
            customMessage,
            backendError
          );
      },
    });
  }

  /**
   * Handles the change event for the organization dropdown.
   * @param event The change event from the dropdown
   */

  onOrganizationChange(event: any) {
    const selectedOrgId = Number(event.target.value);

    if (selectedOrgId) {
      // Clear defaultOrg when user selects a different organization
      this.defaultOrg = null;
      this.sessionStorage.removeItem('defaultOrg');
      //this.receiptDataService.setDefaultOrg(null);

      // Store selected organization
      const selectedOrg = this.organization.find(
        (org) => org.id === selectedOrgId
      );
      if (selectedOrg) {
        this.selectedOrg = selectedOrg;
        this.sessionStorage.setItem(
          'selectedOrg',
          JSON.stringify(this.selectedOrg)
        );
        //this.receiptDataService.setSelectedOrg(selectedOrg);

        // Fetch branches for selected organization
        this.fetchBranches(selectedOrg.id);
      }
    } else {
      // If no selection, clear everything
      this.defaultOrg = null;
      this.selectedOrg = null;
      this.sessionStorage.removeItem('selectedOrg');
      this.sessionStorage.removeItem('defaultOrg');
      //this.receiptDataService.setDefaultOrg(null);
      //this.receiptDataService.setSelectedOrg(null);
    }
  }

  /**
   * Fetches the list of branches for a given organization.
   * @param organizationId The ID of the organization
   */
  fetchBranches(organizationId: number) {
    this.receiptService.getBranches(organizationId).subscribe({
      next: (data) => {
        this.branches = data;

        // Retrieve previously selected branch
        let storedSelectedBranch =
          this.sessionStorage.getItem('selectedBranch');
        let selectedBranch = storedSelectedBranch
          ? JSON.parse(storedSelectedBranch)
          : null;

        if (selectedBranch) {
          // If a selected branch exists, use it instead of default
          this.selectedBranch = selectedBranch;
          this.receiptingDetailsForm.patchValue({
            selectedBranch: selectedBranch.id,
          });
        } else {
          // Set default branch if no selection exists
          const defaultBranch = this.branches.find((branch) => branch.id === 1);

          if (defaultBranch) {
            this.defaultBranch = defaultBranch;
            this.sessionStorage.setItem(
              'defaultBranch',
              JSON.stringify(this.defaultBranch)
            );
            this.sessionStorage.setItem(
              'receiptDefaultBranch',
              JSON.stringify(this.defaultBranch)
            );
            // Use setTimeout to ensure UI updates
            setTimeout(() => {
              this.receiptingDetailsForm.patchValue({
                selectedBranch: defaultBranch.id,
              });
            });
            // this.receiptingDetailsForm.patchValue({
            //   selectedBranch: defaultBranch.id,
            // });
          }
          if (!defaultBranch) {
            console.warn(
              'No default branch found. Setting first available branch.'
            );
            this.defaultBranch =
              this.branches.length > 0 ? this.branches[0] : null;
          }
        }
      },
      error: (err) => {
        const customMessage = this.translate.instant('fms.errorMessage');
const backendError= err.error?.msg ||
              err.error?.error ||
              err.error?.status ||
              err.statusText;
          this.globalMessagingService.displayErrorMessage(
            customMessage,
            backendError
          );
      },
    });
  }

  /**
   * this function handles the change event for the branch dropdown.
   * @param event The change event from the dropdown
   */
  onBranchChange(event: any) {
    const selectedBranchId = Number(event.target.value);

    if (selectedBranchId) {
      // Clear defaultBranch when user selects a new branch
      this.defaultBranch = null;
      this.sessionStorage.removeItem('defaultBranch');
      //this.receiptDataService.setDefaultBranch(null);

      // Store selected branch
      const selectedBranch = this.branches.find(
        (b) => b.id === selectedBranchId
      );
      if (selectedBranch) {
        this.selectedBranch = selectedBranch;
        this.sessionStorage.setItem(
          'selectedBranch',
          JSON.stringify(this.selectedBranch)
        );
        this.receiptDataService.setSelectedBranch(selectedBranch);
      }
    } else {
      // If no selection, clear everything
      this.defaultBranch = null;
      this.selectedBranch = null;
      this.sessionStorage.removeItem('selectedBranch');
      this.sessionStorage.removeItem('defaultBranch');
      //this.receiptDataService.setDefaultBranch(null);
      // this.receiptDataService.setSelectedBranch(null);
    }
  }

  fetchYears(branchCode: number) {
    this.fmsSetupService.getYears(branchCode).subscribe({
      next: (response) => {
        this.years = response.data;

        // Set default year to current year
        const currentYear = new Date().getFullYear().toString();
        const currentYearData = this.years.find((y) => y.year === currentYear);

        if (currentYearData) {
          // Set the default year
          this.receiptingDetailsForm.patchValue({ year: currentYearData.year });

          // Set periods based on selected year
          this.periods = currentYearData.periods;

          // Wait for periods to be assigned before setting the default month
          if (this.periods.length > 0) {
            const currentMonth = new Date()
              .toLocaleString('default', { month: 'short' })
              .toUpperCase();
            const currentMonthData = this.periods.find(
              (p) => p.period === currentMonth
            );

            if (currentMonthData) {
              // Correctly set the value of period to its string value
              this.receiptingDetailsForm.patchValue({
                period: currentMonthData.period,
              });
            }
          }
        }
      },
      error: (err) => {
        const customMessage = this.translate.instant('fms.errorMessage');
const backendError= err.error?.msg ||
              err.error?.error ||
              err.error?.status ||
              err.statusText;
          this.globalMessagingService.displayErrorMessage(
            customMessage,
            backendError
          );
      },
    });
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value; // Get selected year

    // Find the selected year's data
    const selectedData = this.years.find((y) => y.year === this.selectedYear);

    // Update periods dropdown
    this.periods = selectedData ? selectedData.periods : [];

    if (this.periods.length > 0) {
      // Get the current year as a string
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = new Date()
        .toLocaleString('en-US', { month: 'short' })
        .toUpperCase();

      let selectedPeriod =
        this.periods.find((p) => p.period === currentMonth)?.period ||
        this.periods[0]?.period;

      //console.log(`Selected Year: ${this.selectedYear}, Period Set: ${selectedPeriod}`);

      // Use setTimeout to ensure change detection
      setTimeout(() => {
        this.receiptingDetailsForm.patchValue({ period: selectedPeriod });
      });
    }
  }
  
  

  /* The `items` property is an array of objects. Each object represents a menu item in a CRM (Customer
Relationship Management) application. Each object has the following properties: */
  setups: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: this.translate.instant('base.coreSetUp'),
     
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.defineYrs'),
          link: '/home/fms/',
        },
      
        {
          label: this.translate.instant('base.base-fms.closeYrs'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.branches'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.businessClasses'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.parameterSetup'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.expenseCategory'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.definebCostCentres'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.accountTerms'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.eInterfaceAcc'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.taxSetups'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.approvalRights'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.reassignApprovalRights'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.passwordManagement'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.workflowSetups'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.subLedgerAccts'),
          link: '/home/fms/',
        },
        ],
    }
    
  ];

  GLledger: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: this.translate.instant('base.GL-Parameters'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.actSetups'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.coT'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.dBAccts'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.viewBAccts'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.defineBudget'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.budgetSetUp'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.aBudget'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.rBudgets'),
          link: '/home/fms/',
        },

        {
          label: this.translate.instant('base.base-fms.oBalances'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.iOBalances'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.rJournals'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.iAcctMapping'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.Gl-Transactions'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.jVouchers'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.jEntries'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.aPTransactions'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.viewJEntries'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.rTransactions'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.pRTransactions'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.aJournals'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.pAJournals'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.iPosting'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.cRevaluation'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.Gl-Inquiries'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.viewTransactions'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.auditTrail'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.vInquiries'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.bTrails'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.vAcctBlc'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.vReports'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.twcCentres'),
          link: '/home/fms/',
        },
        
         {
          label: this.translate.instant('base.base-fms.glListingRpt'),
          link: '/home/fms/',
        }, {
          label: this.translate.instant('base.base-fms.tListingRpt'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.expnsRpt'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.dmsDoc'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.tTrRpt'),
          link: '/home/fms/',
        }
      ],
    },
    {
      label: this.translate.instant('base.Gl-Final Reports'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.formats'),
          link: '/home/fms/',
        },

         {
          label: this.translate.instant('base.base-fms.rptApportionment'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.changesInEquity'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.setUps'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.rpt'),
          link: '/home/fms/',
        },
      ],

    
    },
  ];

  creditors: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: this.translate.instant('base.base-fms.parameters'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.sTypes'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.cAccounts'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.bAcctSetup'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.acctTerms'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.oBalances'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.base-fms.transactions'),
      showSubItems: false,
      subItems: [
     {
          label: this.translate.instant('base.base-fms.createInvoices'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.creditorsPayments'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.paymentVouchers'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.pTransactions'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.Invoices/DR Notes'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.creditNotesFrmCreditors'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.pCreditNotes'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.contractDetails'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.InvoicesFrmCreditors'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.rTransactions'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.Inquires'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.acctBalances'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.auditTrail'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.reports'),
          link: '/home/fms/',
        },

      ],
    },
  ];

  cashbook: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: this.translate.instant('base.base-fms.parameters'),
      showSubItems: false,
      subItems: [
       
       {
          label: this.translate.instant('base.base-fms.BankAccounts'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.PaymentMethods'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.TrnTypeBasedR'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.ReceiptingAcc'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.TypesSetup'),
          link: '/home/fms/',
        }
        
      ],
    },
    {
      label: this.translate.instant('base.base-fms.transactions'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.paymentVouchers'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.BankVoucher'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.BankVoucherBtn'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.RctVoucher'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.CbVoucher'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.pTransactions'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.RVouchers'),
          link: '/home/fms/',
        },
          {
          label: this.translate.instant('base.base-fms.ARVouchers'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.base-fms.requistions'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.crtRequistion'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.base-fms.payments'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.setUpPaymentTemplate'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.setcNumber'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.cRequistion'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.splitCheques'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.authorise'),
          link: '/home/fms/cheque-authorization',
        },
         {
          label: this.translate.instant('base.base-fms.print'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.updatePrinted'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.updatePdCheques'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.chequeSMandate'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.dispatchCheques'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.cancelPayments'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.authorizeCcheques'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.stalePayment'),
          link: '/home/fms/',
        }, 
        {
          label: this.translate.instant('base.base-fms.dispatchChequeP'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.cStatus'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.aFtPayment'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.fileTransferD'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.fTransferStatus'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.vatCerts'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.reports'),
          link: '/home/fms/',
        },
       
      ],
    },
    {
      label: this.translate.instant('base.base-fms.pettyCash'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.settings'),
          link: '/home/fms/',
        },
       {
          label: this.translate.instant('base.base-fms.capture'),
          link: '/home/fms/',
        },
       {
          label: this.translate.instant('base.base-fms.auth/Approve'),
          link: '/home/fms/',
        },
       {
          label: this.translate.instant('base.base-fms.acknowledgePC'),
          link: '/home/fms/',
        },
       {
          label: this.translate.instant('base.base-fms.issue'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.captureReturns'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.replenish'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.reverseIssuance'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.reverseReturns'),
          link: '/home/fms/',
        },{
          label: this.translate.instant('base.base-fms.reports'),
          link: '/home/fms/',
        },
      ],
        
    },
    {
      label: this.translate.instant('base.base-fms.receipts'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.receiptingPoints'),
          link: '/home/fms/',
        },

        {
          label: this.translate.instant('base.base-fms.narration'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.manageReceipt'),
          link: '/home/fms/receipt-management',
        },
        {
          label: this.translate.instant('base.base-fms.receipting'),
          link: '/home/fms/receipt-capture',
        },
        {
   label: this.translate.instant('base.base-fms.banking'),
          link: '/home/fms/banking-dashboard',
        },
        {
          label: this.translate.instant('base.base-fms.receiptingExceptions'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.receiptAuthorization'),
          link: '/home/fms/authorize',
        },
        {
          label: this.translate.instant('base.base-fms.receiptUpload'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.premiumSuspense'),
          link: '/home/fms/',
        },

        {
          label: this.translate.instant('base.base-fms.directDebits'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.base-fms.reconciliation'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.parameters'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.pUnreconciled'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.reconciliation'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.postBankReco'),
          link: '/home/fms/',
        },
         
         {
          label: this.translate.instant('base.base-fms.reconEnquiry'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.Inquires'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.viewTransactions'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.chequeRequistion'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.cbVoucherListing'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.inquiry'),
          link: '/home/fms/',
        }, {
          label: this.translate.instant('base.base-fms.auditTrail'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.rctEnquiry'),
          link: '/home/fms/',
        },
      ],
    },
  ];
  debtors: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: this.translate.instant('base.base-fms.parameters'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.dAccounts'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.bAcctSetup'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.acctTerms'),
          link: '/home/fms/',
        },
        {
          label: this.translate.instant('base.base-fms.oBalances'),
          link: '/home/fms/',
        },
        
      ],
    },
    {
      label: this.translate.instant('base.base-fms.transactions'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.viewTransactions'),
          link: '/home/fms/',
        },
      ],
    },
    {
      label: this.translate.instant('base.Invoices/Cr Notes'),
      showSubItems: false,
      subItems: [
         {
          label: this.translate.instant('base.base-fms.invoiceSent'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.AInvoice'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.dInvoicesUpload'),
          link: '/home/fms/',
        },
         {
          label: this.translate.instant('base.base-fms.creditNSent'),
          link: '/home/fms/',
        },

         {
          label: this.translate.instant('base.base-fms.rTransactions'),
          link: '/home/fms/',
        }
      ],
    },
    {
      label: this.translate.instant('base.Inquires'),
      showSubItems: false,
      subItems: [
        {
          label: this.translate.instant('base.base-fms.viewInvoices'),
          link: '/home/fms/',
        },
      
      {
          label: this.translate.instant('base.base-fms.viewRct'),
          link: '/home/fms/',
        },
      
      {
          label: this.translate.instant('base.base-fms.acctBalances'),
          link: '/home/fms/',
        },
      {
          label: this.translate.instant('base.base-fms.auditTrail'),
          link: '/home/fms/',
        },
      {
          label: this.translate.instant('base.base-fms.reports'),
          link: '/home/fms/',
        },],
    },
  ];

  /**
   * The function toggles the visibility of sub-items for a given item.
   * @param {any} item - The parameter "item" is of type "any", which means it can be any data type.
   */
  
   
  /**
   * Toggles the visibility of a menu item, creating a multi-level accordion effect
   * across all modules on the page.
   * - Opening a category in a new module closes all categories in other modules.
   * - Opening a category within a module closes its sibling categories.
   *
   * @param {any} clickedItem The menu item object that was clicked by the user.
   * @param {Array<any>} currentSiblingGroup The array of items that are siblings to the clicked item.
   */
  toggleItem(clickedItem: any, currentSiblingGroup: Array<any>) {
    // Determine the state the clicked item will be in.
    const willBeOpen = !clickedItem.showSubItems;

    // --- Core Logic ---

    // 1. Close all categories in ALL OTHER module groups.
    this.allModuleGroups.forEach(group => {
      // If the current group is NOT the one we are working in...
      if (group !== currentSiblingGroup) {
        // ...close every item inside it.
        group.forEach(item => (item.showSubItems = false));
      }
    });

    // 2. Close all sibling categories within the CURRENT module group.
    currentSiblingGroup.forEach(item => {
      // Don't touch the item that was actually clicked.
      if (item !== clickedItem) {
        item.showSubItems = false;
      }
    });

    // 3. Finally, set the state of the clicked item.
    // If it was closed, it will now open. If it was already open, the logic above
    // will have closed it, and it will stay closed.
    clickedItem.showSubItems = willBeOpen;
  }
}
