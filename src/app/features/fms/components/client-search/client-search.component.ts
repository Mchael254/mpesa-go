/**
 * @fileOverview This file contains the `ClientSearchComponent`, which allows users to search for clients
 * based on various criteria and select a client for receipt processing.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  AccountTypeDTO,
  BranchDTO,
  ClientsDTO,
  TransactionDTO,
} from '../../data/receipting-dto';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

/**
 * @Component({
 *   selector: 'app-client-search',
 *   templateUrl: './client-search.component.html',
 *   styleUrls: ['./client-search.component.css']
 * })
 *
 * ClientSearchComponent is an Angular component that provides a user interface for searching clients
 * and selecting them for receipt processing.  It fetches client data based on the selected account type
 * and search criteria, and navigates to the next step in the process (allocation) upon client selection.
 */
@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css'],
})
export class ClientSearchComponent implements OnInit {
  /** @property {number} globalReceiptNumber - Stores the global receipt number for the application.*/
  branchReceiptNumber: number;

  /** @property {FormGroup} receiptingDetailsForm - Reactive form group for capturing receipt details.*/
  receiptingDetailsForm: FormGroup;

  /** @property {boolean} isAccountTypeSelected - Flag indicating if an account type has been selected.*/
  isAccountTypeSelected = false;

  /** @property {any} globalAccountTypeSelected - Stores the selected account type.*/
  globalAccountTypeSelected: any;

  /** @property {string} accountTypeShortDesc - Short description of the selected account type.*/
  accountTypeShortDesc: string;

  /** @property {AccountTypeDTO[]} accountTypeArray - Array of available account types.*/
  accountTypeArray: AccountTypeDTO[] = [];

  /** @property {any} loggedInUser - Stores the currently logged-in user's information.*/
  loggedInUser: any;

  /** @property {any} GlobalUser -  Potentially deprecated user data. Consider removing if unused.*/
  GlobalUser: any;

  /** @property {OrganizationDTO[]} organization - Array of organizations. */
  organization: OrganizationDTO[];

  /** @property {number} defaultOrgId - ID of the default organization.*/
  defaultOrgId: number;

  /** @property {BranchDTO[]} branches - Array of available branches.*/
  branches: BranchDTO[] = [];

  /** @property {OrganizationDTO} defaultOrg - The default organization object.*/
  defaultOrg: OrganizationDTO;

  /** @property {StaffDto} users - Data of logged in users to fetch client details*/
  users: StaffDto;

  /** @property {BranchDTO} defaultBranch - The default branch object.*/
  defaultBranch: BranchDTO;

  /** @property {number} organizationId - ID of the organization.*/
 

  /** @property {number | null} selectedCountryId -  ID of the selected country (nullable).*/
  selectedCountryId: number | null = null;

  /** @property {number} defaultCountryId -  ID of the default  country .*/

  

  /** @property {string | null} selectedOrganization -  Name of the selected organization (nullable).*/
  selectedOrganization: string | null = null;

  /** @property {number} selectedOrgId - ID of the selected organization.*/
  selectedOrg:OrganizationDTO;
  

  /**
   * @property {any} selectedBranchId - ID of the selected branch.
   * @deprecated Consider using defaultBranch.id or selectedBranch directly.
   */
  

  /**
   * @property {any} defaultBranchId - ID of the default branch.
   * @deprecated Consider using defaultBranch.id directly.
   */
  

  /**
   * @property {string} defaultBranchName - Name of the default branch.
   * @deprecated Consider accessing defaultBranch.name directly.
   */
  

  /** @property {number} selectedBranch - ID of the selected branch.*/
  selectedBranch:BranchDTO;

  /** @property {number} userId - ID of the user.*/
  userId: number;

  /** @property {number} orgId - ID of the organization.*/
 

  /** @property {any} selectedClient - The selected client object.*/
  selectedClient: any;

  /** @property {TransactionDTO[]} transactions - Array of transactions for the selected client.*/
  transactions: TransactionDTO[] = [];

  /** @property {AccountTypeDTO[]} accountTypes - Array of available account types.*/
  accountTypes: AccountTypeDTO[] = [];

  /** @property {ClientsDTO[]} clients - Array of clients matching the search criteria.*/
  clients: ClientsDTO[] = [];

  /** @property {boolean} loading - Flag indicating if data is currently being loaded.*/
  loading = false;

  /** @property {boolean} isClientSelected - Flag indicating if a client has been selected.*/
  isClientSelected: boolean = false;

  /** @property {number} first - Index of the first row to display in pagination.*/
  first: number = 0;

  /** @property {number} rows - Number of rows to display per page in pagination.*/
  rows: number = 10;

  /** @property {number} totalRecords - Total number of records matching the search criteria.*/
  totalRecords: number = 0;

  /**
   * Constructor for the ClientSearchComponent.
   *
   * @param {ReceiptDataService} receiptDataService - Service for managing receipt data.
   * @param {GlobalMessagingService} globalMessagingService - Service for displaying global messages.
   * @param {ReceiptService} receiptService - Service for handling receipt-related operations.
   * @param {StaffService} staffService - Service to fetch StaffDto.
   * @param {OrganizationService} organizationService - Service to fetch OrganizationDto.
   * @param {AuthService} authService - Service for handling authentication.
   * @param {FormBuilder} fb - Form builder for creating reactive forms.
   * @param {Router} router - Angular router for navigation.
   */
  constructor(
    private receiptDataService: ReceiptDataService,
    private globalMessagingService: GlobalMessagingService,
    private receiptService: ReceiptService,
    private staffService: StaffService,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private sessionStorage:SessionStorageService
  ) {}

  /**
   * Lifecycle hook called once the component is initialized.
   * It initializes the form, retrieves data from localStorage, and fetches account types.
   */
  ngOnInit(): void {
    this.captureReceiptForm();
    const storedData = this.receiptDataService.getReceiptData();
    let storedReceiptNumber = this.sessionStorage.getItem('branchReceiptNumber');
    this.loggedInUser = this.authService.getCurrentUser();
    if (storedReceiptNumber) {
      this.branchReceiptNumber = Number(storedReceiptNumber);
    }
    console.log('this.globalReceiptNumber',this.branchReceiptNumber)
    this.loggedInUser = this.authService.getCurrentUser();
    
    let users = this.sessionStorage.getItem('user');
    this.users = JSON.parse(users);

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

  console.log('Selected Organization:', this.selectedOrg);
  console.log('Default Organization:', this.defaultOrg);

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
  
    console.log('Selected Branch:', this.selectedBranch?.id);
    console.log('Default Branch:', this.defaultBranch?.id);
   
    
    this.fetchAccountTypes();
  }

  /**
   * Initializes the `receiptingDetailsForm` with the required form controls and validators.
   * @returns {void}
   */
  captureReceiptForm() {
    this.receiptingDetailsForm = this.fb.group({
      allocationType: [''],
      accountType: ['', Validators.required],
      searchCriteria: [{ value: '', disabled: true }, Validators.required],
      searchQuery: [{ value: '', disabled: true }, Validators.required],
      allocatedAmount: this.fb.array([]), // FormArray for allocated amounts
    });
  }

  /**
   * Fetches account types from the `ReceiptService` and populates the `accountTypes` and `accountTypeArray` properties.
   * It also handles setting the 'defaultOrg' in localStorage.
   * @returns {void}
   */
  fetchAccountTypes() {
    this.sessionStorage.setItem('defaultOrg', JSON.stringify(this.defaultOrg));
    this.receiptService
      .getAccountTypes(
        this.defaultOrg?.id || this.selectedOrg?.id,
        this.defaultBranch?.id || this.selectedBranch?.id,
        this.loggedInUser.code
      )
      .subscribe({
        next: (response) => {
          this.accountTypes = response.data || [];
          this.accountTypeArray = response.data;
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
   * Enables or disables the search criteria and query input fields based on whether an account type is selected.
   * It also retrieves the selected account type's short description and stores it in localStorage.
   * @returns {void}
   */
  onAccountTypeChange(): void {
    const accountType = this.receiptingDetailsForm.get('accountType')?.value;
    this.isAccountTypeSelected = !!accountType;

    if (this.isAccountTypeSelected) {
      this.globalAccountTypeSelected = this.accountTypeArray.find(
        (account) => account.name === accountType
      );
      this.accountTypeShortDesc = this.globalAccountTypeSelected.actTypeShtDesc;
      this.sessionStorage.setItem('accountTypeShortDesc', this.accountTypeShortDesc);
      this.receiptingDetailsForm.get('searchCriteria')?.enable();
      this.receiptingDetailsForm.get('searchQuery')?.enable();
    } else {
      this.receiptingDetailsForm.get('searchCriteria')?.disable();
      this.receiptingDetailsForm.get('searchQuery')?.disable();
    }
  }

  /**
   * Handles the search action, validating the form and calling the `fetchClients` method with the appropriate search criteria and value.
   * It also maps the search criteria from the form to the API-compatible values.
   * @returns {void}
   */
  onSearch(): void {
    const { accountType, searchCriteria, searchQuery } =
      this.receiptingDetailsForm.value;

    if (!accountType || !searchCriteria || !searchQuery) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please provide all the required fields'
      );
      return;
    }

    const criteriaMapping = {
      clientName: 'CLIENT_NAME',
      policyNumber: 'POL_NO',
      accountNumber: 'ACC_NO',
      debitNote: 'DR_CR_NO',
    };

    const apiSearchCriteria = criteriaMapping[searchCriteria];
    if (!apiSearchCriteria) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Invalid search criteria selected'
      );
      return;
    }

    this.fetchClients(apiSearchCriteria, searchQuery.trim());
  }

  /**
   * Handles the selection of a client, storing the selected client in the `receiptDataService` and fetching their transactions.
   * @param {any} selectedClient - The selected client object.
   * @returns {void}
   */
  onClickClient(selectedClient) {
    if (this.selectedClient?.code === selectedClient.code) {
      return; // Avoid unnecessary API call
    }
    this.selectedClient = selectedClient; // Store the selected client
    this.receiptDataService.setSelectedClient(selectedClient); // Save in service

    this.isClientSelected = true; // Set flag when client is selected
    this.fetchTransactions(
      selectedClient.systemShortDesc,
      selectedClient.code,
      selectedClient.accountCode,
      selectedClient.receiptType,
      selectedClient.shortDesc
    );
  }

  /**
   * Fetches transactions for the selected client from the `ReceiptService` and navigates to the allocation screen if transactions are found.
   * @param {string} systemShortDesc - Short description of the client's system.
   * @param {number} clientCode - Code of the client.
   * @param {number} accountCode - Account code of the client.
   * @param {string} receiptType - Receipt type of the client.
   * @param {string} clientShtDesc - Short description of the client.
   * @returns {void}
   */
  fetchTransactions(
    systemShortDesc: string,
    clientCode: number,
    accountCode: number,
    receiptType: string,
    clientShtDesc: string
  ): void {
    this.receiptService
      .getTransactions(
        systemShortDesc,
        clientCode,
        accountCode,
        receiptType,
        clientShtDesc
      )
      .subscribe({
        next: (response) => {
          this.transactions = response.data;
          if (this.transactions.length > 0) {
            this.receiptDataService.setTransactions(this.transactions);
            this.receiptDataService.setReceiptData(
              this.receiptingDetailsForm.value
            );
            this.router.navigate(['/home/fms/client-allocation']);
          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error:',
              'No transactions found!'
            );
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
   * Fetches clients from the `ReceiptService` based on the provided search criteria and value.
   * @param {string} searchCriteria - The criteria to use for searching clients (e.g., 'CLIENT_NAME', 'POL_NO').
   * @param {string} searchValue - The value to search for.
   * @returns {void}
   */
  fetchClients(searchCriteria: string, searchValue: string): void {
    const accountType = this.receiptingDetailsForm.get('accountType')?.value;
    const selectedAccountType = this.accountTypes.find(
      (type) => type.name === accountType
    );

    if (selectedAccountType) {
      const { systemCode, accCode } = selectedAccountType;
      this.loading = true;

      this.receiptService
        .getClients(systemCode, accCode, searchCriteria, searchValue)
        .subscribe({
          next: (response) => {
            this.clients = response.data || [];
            this.totalRecords = this.clients.length;

            if (!this.clients.length) {
              this.globalMessagingService.displayErrorMessage(
                'Error',
                'No clients found for the given criteria'
              );
            }
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              err.error.error
            );
          },
          complete: () => {
            this.loading = false;
          },
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Invalid account type!'
      );
    }
  }

  /**
   * Navigates to the allocation screen.
   */
  onNext() {
    this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
    this.router.navigate(['/home/fms/client-allocation']);
  }

  /**
   * Navigates back to the first screen (screen1).
   */
  onBack() {
    this.router.navigate(['/home/fms/receipt-capture']);
  }
}