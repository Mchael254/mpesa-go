/**
 * @fileOverview This file contains the `ClientSearchComponent`, which allows users to search for clients
 * based on various criteria and select a client for receipt processing.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import fmsStepsData from '../../data/fms-step.json';
import {
  AccountTypeDTO,
  BranchDTO,
  ClientsDTO,
  GetAllocationDTO,
 
  TransactionDTO,
} from '../../data/receipting-dto';

import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';

import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { OrganizationService } from '../../../../features/crm/services/organization.service';

import { AuthService } from '../../../../shared/services/auth.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';

import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { TranslateService } from '@ngx-translate/core';
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
  /**
   * @description Step data for the FMS workflow.
   */
  steps = fmsStepsData;
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

  /** @property {number} selectedOrgId - ID of the selected organization.*/
  selectedOrg: OrganizationDTO;

  /** @property {number} selectedBranch - ID of the selected branch.*/
  selectedBranch: BranchDTO;

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
  getAllocation: GetAllocationDTO[] = [];
  canShowNextBtn: boolean = false;

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
    public translate: TranslateService,
    private sessionStorage: SessionStorageService
  ) {}

  /**
   * Lifecycle hook called once the component is initialized.
   * It initializes the form, retrieves data from localStorage, and fetches account types.
   */
  ngOnInit(): void {
    this.captureReceiptForm();
    const storedData = this.receiptDataService.getReceiptData();
    let storedReceiptNumber = this.sessionStorage.getItem(
      'branchReceiptNumber'
    );
    this.loggedInUser = this.authService.getCurrentUser();

    if (storedReceiptNumber) {
      this.branchReceiptNumber = Number(storedReceiptNumber);
    }

    //  this.loggedInUser = this.authService.getCurrentUser();

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

    // Retrieve branch from localStorage or receiptDataService
    let storedSelectedBranch = this.sessionStorage.getItem('selectedBranch');
    let storedDefaultBranch = this.sessionStorage.getItem('defaultBranch');

    this.selectedBranch = storedSelectedBranch
      ? JSON.parse(storedSelectedBranch)
      : null;
    this.defaultBranch = storedDefaultBranch
      ? JSON.parse(storedDefaultBranch)
      : null;

    // Ensure only one branch is active at a time
    if (this.selectedBranch) {
      this.defaultBranch = null;
    } else if (this.defaultBranch) {
      this.selectedBranch = null;
    }

    this.fetchAccountTypes();
    this.getAllocations();
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
  moveFirst(state: any) {
    state.first = 0;
  }

  movePrev(state: any) {
    state.first = Math.max(state.first - state.rows, 0);
  }

  moveNext(state: any) {
    state.first = Math.min(
      state.first + state.rows,
      state.totalRecords - state.rows
    );
  }

  moveLast(state: any) {
    state.first = state.totalRecords - state.rows;
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
            err.error.msg
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
      this.sessionStorage.setItem(
        'accountTypeShortDesc',
        this.accountTypeShortDesc
      );
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
    if (this.selectedClient.length < 0) {
      return; // Avoid unnecessary API call
    }
    this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);

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
          if (!response.data || response.data.length === 0) {
            this.globalMessagingService.displayErrorMessage(
              'Error:',
              'No transactions found!'
            );
            return;
          }

          this.transactions = response.data;
          if (this.transactions.length > 0) {
            this.receiptDataService.setTransactions(this.transactions);
            this.receiptDataService.setReceiptData(
              this.receiptingDetailsForm.value
            );
            this.router.navigate(['/home/fms/client-allocation']);
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            err.error.msg
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
              err.error.msg
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
   * Fetches all allocations for the current branch receipt number and logged-in user.
   *
   * This method calls the `getAllocations` method of the `receiptService` to retrieve
   * allocation data from the backend.  It then filters the allocations to only include
   * those where at least one `receiptParticularDetail` has a `premiumAmount` greater than 0.
   * The `canShowNextBtn` flag is set based on whether any allocations are returned.
   * On error, a message is displayed using the `globalMessagingService`.
   *
   * @returns {void}
   */
  getAllocations() {
    this.receiptService
      .getAllocations(this.branchReceiptNumber, this.loggedInUser.code)
      .subscribe({
        next: (response) => {
          //this.selectedClient;

          // Filter allocations where there are amounts allocated
          this.getAllocation = response.data.filter((allocation) =>
            allocation.receiptParticularDetails.some(
              (detail) => detail.premiumAmount > 0
            )
          );
          if (response.data.length > 0) {
            this.canShowNextBtn = true;
          } else {
            this.canShowNextBtn = false;
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'error fetched',
            err.error?.msg || 'Failed to fetch Allocation'
          );
        },
      });
  }

  /**
   * Navigates to the allocation screen.
   */
  onNext() {
    this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
    // let allocations = this.sessionStorage.getItem('allocations');
    // this.getAllocation = JSON.parse(allocations);
    this.router.navigate(['/home/fms/client-allocation']);
  }

  /**
   * Navigates back to the first screen (screen1).
   */
  onBack() {
    this.router.navigate(['/home/fms/receipt-capture']);
  }
}
