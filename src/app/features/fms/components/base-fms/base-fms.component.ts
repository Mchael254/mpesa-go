import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchDTO } from '../../data/receipting-dto';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';

@Component({
	selector: 'app-base-fms',
	templateUrl: './base-fms.component.html',
	styleUrls: [ './base-fms.component.css' ]
})
export class BaseFmsComponent {
	// Form group for capturing receipt details
	receiptingDetailsForm: FormGroup;

	// User, Organization, and Branch Details
	loggedInUser: any; // Currently logged-in user
	defaultOrg: OrganizationDTO; // Default organization
	users: StaffDto; // Current user details
	GlobalUser: any; // Global user details
	organization: OrganizationDTO[]; // List of organizations
	defaultOrgId: number; // Default organization ID
	branches: BranchDTO[] = []; // List of branches
	defaultBranch: BranchDTO; // Default branch
	selectedBranch: BranchDTO; // Selected branch
	organizationId: number; // Current organization ID
	selectedCountryId: number | null = null; // Selected country ID
	defaultCountryId: number; // Default country ID
	selectedOrganization: string | null = null; // Currently selected organization
	selectedBranchId: any; // Selected branch ID
	defaultBranchName: string; // Default branch name
	selectedOrgId: number; // Selected organization ID
	globalUserId: number; // Global user ID

	// Control flags
	backdatingEnabled = true; // Enables/disables backdating
	isNarrationFromLov = false; // Indicates if narration is from a list of values
	isSaveBtnActive = true; // Toggles save button visibility
	isSubmitButtonVisible: boolean = false; // Toggles submit button visibility

	/**
   * Angular lifecycle hook that initializes the component.
   * Fetches necessary data and sets up the form.
   */
	ngOnInit(): void {
		this.captureReceiptForm();
		this.loggedInUser = this.authService.getCurrentUser();
		localStorage.setItem('user', this.loggedInUser);

		this.fetchUserDetails();
		this.fetchOrganization();
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
		private receiptService: ReceiptService
	) {}
	/**
   * Initializes the receipt capture form with default values and validators.
   */
	captureReceiptForm() {
		this.receiptingDetailsForm = this.fb.group({
			selectedBranch: [ '', Validators.required ],
			organization: [ '', Validators.required ] // Set default value here as well
		});
	}
	/**
   * Fetches the details of the logged-in user.
   */
	fetchUserDetails() {
		this.staffService.getStaffById(this.loggedInUser.code).subscribe({
			next: (data) => {
				this.users = data;

				localStorage.setItem('user', JSON.stringify(this.users));
			},
			error: (err) => {
				this.globalMessagingService.displayErrorMessage('Error', err.err.err);
			}
		});
	}
	/**
   * Fetches the list of organizations and sets the default organization.
   */
	fetchOrganization() {
		this.organizationService.getOrganization().subscribe({
			next: (data) => {
				this.organization = data;
				// Set the default organization if it exists

				const defaultOrg = this.organization.find((org) => org.id === 2);
				if (defaultOrg) {
					this.selectedOrganization = defaultOrg.name; // Set default organization

					this.defaultOrg = defaultOrg;

					localStorage.setItem('defaultOrg', JSON.stringify(this.defaultOrg));

					this.fetchBranches(this.defaultOrg.id);
					//this.fetchPayments(this.defaultOrgId);

					//this.fetchDrawersBanks(this.defaultCountryId);
					//this.orgId=this.selectedOrganization.name;
					// Patch the form control with the default organization ID
					this.receiptingDetailsForm.patchValue({ organization: this.defaultOrg.id });
					//this.receiptingDetailsForm.patchValue({organization:this.selectedOrganization});
				} else {
					this.selectedOrganization = null; // Allow user to select from the list
				}
			},
			error: (err) => {
				this.globalMessagingService.displayErrorMessage('Error', err.error.error);
			}
		});
	}
	/**
   * Handles the change event for the organization dropdown.
   * @param event The change event from the dropdown
   */
	onOrganizationChange(event: any) {
		// Get the selected organization ID

		const selectedOrgId = Number(event.target.value);

		if (selectedOrgId) {
			// Find the selected organization object
			const selectedOrg = this.organization.find((org) => org.id === selectedOrgId);
			this.selectedOrgId = selectedOrgId;

			localStorage.setItem('selectedOrgId', this.selectedOrgId.toString());

			if (selectedOrg && selectedOrg.country) {
				// Store the country ID
				this.selectedCountryId = selectedOrg.country.id;

				// Update the form control value
				this.receiptingDetailsForm.patchValue({
					organization: selectedOrgId
				});

				// Fetch branches for the selected organization
				this.fetchBranches(selectedOrgId);
				//this.fetchPayments(this.defaultOrgId);
				//this.fetchPaymentModes(selectedOrgId);

				// Now you can fetch drawer banks using the country ID
				if (this.selectedCountryId) {
					localStorage.setItem('selectedCountryId', String(this.selectedCountryId));

					// this.fetchDrawersBanks(this.selectedCountryId);
				}
			}
			// Patch the form control with the default organization ID
			//this.receiptingDetailsForm.patchValue({ organization: this.defaultOrgId });
		} else {
			// Clear dependent fields if no organization is selected
			this.selectedCountryId = null;
			this.receiptingDetailsForm.patchValue({
				selectedBranch: '',
				drawersBank: ''
				// ... any other dependent fields
			});
			this.branches = []; // Clear branches array
			//this.drawersBanks = []; // Clear banks array
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
				const defaultBranch = this.branches.find((branch) => branch.id === 1);
				if (defaultBranch) {
					this.defaultBranch = defaultBranch;
					localStorage.setItem('defaultBranch', JSON.stringify(this.defaultBranch));

					this.defaultBranchName = defaultBranch.name;

					this.receiptingDetailsForm.patchValue({ selectedBranch: this.defaultBranch.id });
				} else {
					this.defaultBranchName = null;
				}
				//this.fetchCurrencies();
			},
			error: (err) => {
				this.globalMessagingService.displayErrorMessage('Error', err.error.error);
			}
		});
	}
	/**
   * this function handles the change event for the branch dropdown.
   * @param event The change event from the dropdown
   */
	onBranchChange(event: any) {
		const selectedBranch = event.target.value;
		if (selectedBranch) {
			this.selectedBranchId = selectedBranch;
			//this.selectedBranch = selectedBranch;
			localStorage.setItem('selectedBranch', this.selectedBranchId.toString());
		} else {
			this.selectedBranchId = null;
		}
		// this.fetchAccountTypes(this.GlobalUser.organizationId, this.selectedBranchId,this.GlobalUser.id);
		//this.fetchBanks(this.selectedBranchId,this.defaultCurrencyId);
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
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'GL-Transactions',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'GL-Inquiries',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'GL-Final Reports',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		}
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
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Transactions',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Invoices/Dr Notes',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Inquires',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		}
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
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Transactions',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Requistions',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Cheques',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Petty cash',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Receipts',
			showSubItems: false,
			subItems: [
				{ label: 'Receipting Points', link: '/home/fms/' },

				{ label: 'Narrations', link: '/home/fms/' },
				{ label: 'Manage Receipts', link: '/home/fms/' },
				{ label: 'Receipting', link: '/home/fms/screen1' },
				{ label: 'Receipting Exceptions', link: '/home/fms/' },
				{ label: 'Receipt Authorization', link: '/home/fms/authorize' },
				{ label: 'Receipt Upload', link: '/home/fms/' },
				{ label: 'Premium Suspense', link: '/home/fms/' },

				{ label: 'Direct Debits', link: '/home/fms/' }
			]
		},
		{
			label: 'Reconciliation',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Inquires',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		}
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
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Transactions',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Invoices/cr Notes',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		},
		{
			label: 'Inquires',
			showSubItems: false,
			subItems: [ { label: '', link: '' } ]
		}
	];

	/**
 * The function toggles the visibility of sub-items for a given item.
 * @param {any} item - The parameter "item" is of type "any", which means it can be any data type.
 */
	toggleItem(item: any) {
		item.showSubItems = !item.showSubItems;
	}
}
