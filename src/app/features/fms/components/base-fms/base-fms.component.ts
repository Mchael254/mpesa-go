import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchDTO, DataItem, Period, YearDTO } from '../../data/receipting-dto';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { FmsSetupService } from '../../services/fms-setup.service';

@Component({
  selector: 'app-base-fms',
  templateUrl: './base-fms.component.html',
  styleUrls: ['./base-fms.component.css'],
})
export class BaseFmsComponent {
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
  selectedYear: string = ''; // Stores the selected year
  /**
   * Angular lifecycle hook that initializes the component.
   * Fetches necessary data and sets up the form.
   */
  ngOnInit(): void {
    this.captureReceiptForm();
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
    private fmsSetupService: FmsSetupService 
  ) {}
  /**
   * Initializes the receipt capture form with default values and validators.
   */
  captureReceiptForm() {
    this.receiptingDetailsForm = this.fb.group({
      selectedBranch: ['', Validators.required],
      organization: ['', Validators.required], // Set default value here as well
      year:['',Validators.required],
      period:['',Validators.required]
    });

  }
  /**
   * Fetches the details of the logged-in user.
   */
  fetchUserDetails() {
    this.staffService.getStaffById(this.loggedInUser.code).subscribe({
      next: (data) => {
        this.userDetails = data;

        this.sessionStorage.setItem('user', JSON.stringify(this.userDetails ));
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.err.err);
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

            this.receiptingDetailsForm.patchValue({
              organization: this.defaultOrg.id,
            });
          } else {
            this.defaultOrg = null;
            this.fetchBranches(this.selectedOrg.id);
            this.sessionStorage.removeItem('defaultOrg');
          }
        }
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
            this.receiptingDetailsForm.patchValue({
              selectedBranch: defaultBranch.id,
            });
          }
        }
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

// fetchYears(branchCode:number){
//   this.fmsSetupService.getYears(branchCode).subscribe({
//     next:(response)=>{
//       this.years = response.data;
      
//     // Set default year to current year
//     const currentYear = new Date().getFullYear().toString();
//     const currentYearData = this.years.find(y => y.year === currentYear);
//     if (currentYearData) {
      
//       this.receiptingDetailsForm.patchValue({year:currentYearData.year});
      
    
//       this.periods = currentYearData.periods;

//       // Set default month (if available)
//       const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
//       const currentMonthData = this.periods.find(p => p.period === currentMonth);
//       if (currentMonthData) {
//       this.receiptingDetailsForm.get('period')?.setValue(currentMonthData);
//         //this.receiptingDetailsForm.patchValue({period:currentMonthData}); 
//       }
//     // }
//      // Watch for year selection changes
//     //  this.form.controls['year'].valueChanges.subscribe((selectedYear) => {
//     //   this.onYearChange(selectedYear);
//     // });
//     }},
//     error:(err)=>{
//       this.globalMessagingService.displayErrorMessage('Error fetching periods',err.error.error);
//     }
//   })
// }
fetchYears(branchCode: number) {
  this.fmsSetupService.getYears(branchCode).subscribe({
    next: (response) => {
      this.years = response.data;
      
      // Set default year to current year
      const currentYear = new Date().getFullYear().toString();
      const currentYearData = this.years.find(y => y.year === currentYear);

      if (currentYearData) {
        // Set the default year
        this.receiptingDetailsForm.patchValue({ year: currentYearData.year });

        // Set periods based on selected year
        this.periods = currentYearData.periods;

        // Wait for periods to be assigned before setting the default month
        if (this.periods.length > 0) {
          const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
          const currentMonthData = this.periods.find(p => p.period === currentMonth);
          
          if (currentMonthData) {
            // Correctly set the value of period to its string value
            this.receiptingDetailsForm.patchValue({ period: currentMonthData.period });
          }
        }
      }
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error fetching periods', err.error.error);
    }
  });
}

onYearChange(event: any) {
  this.selectedYear = event.target.value; // Get selected year
 

  // Find matching year and get periods
  const selectedData = this.years.find(y => y.year === this.selectedYear);
  
  // Update periods dropdown
  this.periods = selectedData ? selectedData.periods : [];
 
}
  /* The `items` property is an array of objects. Each object represents a menu item in a CRM (Customer
Relationship Management) application. Each object has the following properties: */
  GLledger: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'GL-Parameters',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'GL-Transactions',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'GL-Inquiries',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'GL-Final Reports',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
  ];

  creditors: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'Parameters',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Transactions',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Invoices/Dr Notes',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Inquires',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
  ];

  cashbook: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'Parameters',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Transactions',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Requistions',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Cheques',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Petty cash',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Receipts',
      showSubItems: false,
      subItems: [
        { label: 'Receipting Points', link: '/home/fms/' },

        { label: 'Narrations', link: '/home/fms/' },
        { label: 'Manage Receipts', link: '/home/fms/' },
        { label: 'Receipting', link: '/home/fms/receipt-capture' },
        { label: 'Receipting Exceptions', link: '/home/fms/' },
        { label: 'Receipt Authorization', link: '/home/fms/authorize' },
        { label: 'Receipt Upload', link: '/home/fms/' },
        { label: 'Premium Suspense', link: '/home/fms/' },

        { label: 'Direct Debits', link: '/home/fms/' },
      ],
    },
    {
      label: 'Reconciliation',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Inquires',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
  ];
  debtors: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'Parameters',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Transactions',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Invoices/cr Notes',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
    {
      label: 'Inquires',
      showSubItems: false,
      subItems: [{ label: '', link: '' }],
    },
  ];

  /**
   * The function toggles the visibility of sub-items for a given item.
   * @param {any} item - The parameter "item" is of type "any", which means it can be any data type.
   */
  toggleItem(item: any) {
    item.showSubItems = !item.showSubItems;
  }
}
