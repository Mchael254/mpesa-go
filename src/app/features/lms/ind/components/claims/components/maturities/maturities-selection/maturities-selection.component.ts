import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

interface Maturity {
  claimId: string;
  policyNumber: string;
  claimant: string;
  maturityType: string;
  claimStatus: string;
  dateFiled: Date;
  claimAmount: number;
  maturityDate: Date;
  product: string;
  outstandingLoan: number;
  paymentStatus: string;
  effectiveDate: Date;
  requestDate: Date;
  isSelected: boolean;
}

/**
 * Maturity selection component responsible for displaying and managing maturities.
 */

@Component({
  selector: 'app-maturities-selection',
  templateUrl: './maturities-selection.component.html',
  styleUrls: ['./maturities-selection.component.css']
})
export class MaturitiesSelectionComponent {
  maturities: Maturity[] = []; //Array of maturity data.
  filteredMaturities: Maturity[] = []; //Array of filtered maturity data based on search criteria.
  filterForm: FormGroup; //Reactive form for filtering maturities.
  currentPage: number = 1; //Current page number for pagination.
  entriesPerPage: number = 10; //Number of entries to display per page.
  totalEntries: number; //Total number of maturity entries.
  totalPages: number = 0; //Total number of pages for pagination.
  paginationPages: number[] = []; //Array of page numbers for pagination.

  /**
   * Constructor for the MaturitySelectionComponent.
   * @param fb FormBuilder for creating reactive forms.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      filterCriteria: [''],
      filterType: [''],
      claimId: [''],
      policyNumber: [''],
      claimant: [''],
      maturityType: [''],
      claimStatus: [''],
      dateFiled: [''],
      claimAmount: [''],
      maturityDate: [''],
      product: [''],
      outstandingLoan: [''],
      paymentStatus: [''],
      effectiveDate: [''],
      requestDate: ['']
    });
  }

  /**
   * Lifecycle hook called when the component is initialized.
   */
  ngOnInit(): void {
     // Initialize with dummy data
    this.maturities = this.getDummyData();
    this.filteredMaturities = [...this.maturities];
    this.paginationSetup();
  }

  /**
   * Retrieves dummy maturity data for testing purposes.
   * @returns Array of Maturity objects.
   */
  getDummyData(): Maturity[] {
    return [
      { claimId: 'CLM222809', policyNumber: 'GLA/2022/024/HQ', claimant: 'Seeley Booth', maturityType: 'Full maturity', claimStatus: 'Pending', 
        dateFiled: new Date('2024-12-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'AEP24000653', policyNumber: 'CLP/2022/004/HQ', claimant: 'Meredith Grey', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Pending', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'MEEP23022', policyNumber: 'GLA/2022/025/HQ', claimant: 'Hannibal Lecter', maturityType: 'Full maturity', claimStatus: 'Pending', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'CLM222812', policyNumber: 'CLP/2022/006/HQ', claimant: 'Tempy Brennan', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'AEP24126', policyNumber: 'GLA/2022/026/HQ', claimant: 'James Earl Jones', maturityType: 'Full maturity', claimStatus: 'Pending', 
        dateFiled: new Date('2024-12-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Pending', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'CLM022814', policyNumber: 'CLP/2022/008/HQ', claimant: 'Annalise Keating', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product',  outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'AEP24026', policyNumber: 'GLA/2022/027/HQ', claimant: 'Michael Scofield', maturityType: 'Full maturity', claimStatus: 'Pending', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Pending', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'CLM222816', policyNumber: 'CLP/2022/010/HQ', claimant: 'Kate Beckett', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'MEEP23042', policyNumber: 'GLA/2022/028/HQ', claimant: 'Olivia Pope', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Pending', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'CLM222818', policyNumber: 'CLP/2022/012/HQ', claimant: 'Harry Potter', maturityType: 'Full maturity', claimStatus: 'Pending', 
        dateFiled: new Date('2024-12-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'AEP24026', policyNumber: 'GLA/2022/0029/HQ', claimant: 'Minerva McGonagall', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Paid', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'MEEP20109', policyNumber: 'CLP/2022/014/HQ', claimant: 'Sherlock Holmes', maturityType: 'Full maturity', claimStatus: 'Pending', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Pending', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false },
      { claimId: 'CLM222021', policyNumber: 'GLA/2022/030/HQ', claimant: 'John Watson', maturityType: 'Partial maturity', claimStatus: 'Processed', 
        dateFiled: new Date('2024-11-01'), claimAmount: 500000, maturityDate: new Date('2025-12-01'), product: 'Product', outstandingLoan: 300000, paymentStatus: 'Pending', effectiveDate: new Date('2024-11-01'), requestDate: new Date('2024-10-15'), isSelected: false }
    ];
  }

  /**
   * Sets up pagination based on the total number of entries and entries per page.
   */
  paginationSetup(): void {
    this.totalEntries = this.filteredMaturities.length;
    this.totalPages = Math.ceil(this.totalEntries / this.entriesPerPage);
    this.paginationPages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Returns a paginated array of maturities based on the current page and entries per page.
   * @returns Paginated array of Maturity objects.
   */
  paginatedMaturities(): Maturity[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    return this.filteredMaturities.slice(start, start + this.entriesPerPage);
  }

  /**
   * Changes the current page for pagination.
   * @param page The page number to navigate to or 'prev' or 'next' for previous or next page.
   */
  changePage(page: number | string): void {
    if (page === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (typeof page === 'number') {
      this.currentPage = page;
    }
    this.paginationSetup();
  }

  /**
   * Changes the number of entries to display per page.
   * @param event The change event from the select element.
   */
  changeEntriesPerPage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.entriesPerPage = parseInt(value, 10);
    this.paginationSetup();
  }

  /**
   * Filters maturities based on the filter criteria entered by the user.
   */
  filterMaturities(): void {
    const filterCriteria = this.filterForm.get('filterCriteria')?.value || '';
    const filterType = this.filterForm.get('filterType')?.value || '';

    // Get the values for each column's search criteria from the form
    const claimIdFilter = this.filterForm.get('claimId')?.value || '';
    const policyNumberFilter = this.filterForm.get('policyNumber')?.value || '';
    const claimantFilter = this.filterForm.get('claimant')?.value || '';
    const maturityTypeFilter = this.filterForm.get('maturityType')?.value || '';
    const claimStatusFilter = this.filterForm.get('claimStatus')?.value || '';
    const dateFiledFilter = this.filterForm.get('dateFiled')?.value || '';
    const claimAmountFilter = this.filterForm.get('claimAmount')?.value || '';
    const maturityDateFilter = this.filterForm.get('maturityDate')?.value || '';
    const productFilter = this.filterForm.get('product')?.value || '';
    const outstandingLoanFilter = this.filterForm.get('outstandingLoan')?.value || '';
    const paymentStatusFilter = this.filterForm.get('paymentStatus')?.value || '';
    const effectiveDateFilter = this.filterForm.get('effectiveDate')?.value || '';
    const requestDateFilter = this.filterForm.get('requestDate')?.value || '';
    
    // Apply filters based on search inputs
    this.filteredMaturities = this.maturities.filter(maturity => {
      const matchesFilterCriteria = filterCriteria
      ? (filterType === 'policyNumber' && maturity.policyNumber.includes(filterCriteria)) ||
        (filterType === 'claimant' && maturity.claimant.includes(filterCriteria))
      : true;

      // Check if each maturity entry matches the filters (empty fields don't filter)
      const matchesClaimId = !claimIdFilter || maturity.claimId.includes(claimIdFilter);
      const matchesPolicyNumber = !policyNumberFilter || maturity.policyNumber.includes(policyNumberFilter);
      const matchesClaimant = !claimantFilter || maturity.claimant.includes(claimantFilter);
      const matchesMaturityType = !maturityTypeFilter || maturity.maturityType.includes(maturityTypeFilter);
      const matchesClaimStatus = !claimStatusFilter || maturity.claimStatus.includes(claimStatusFilter);
      const matchesDateFiled = dateFiledFilter ? new Date(maturity.dateFiled).toISOString().split('T')[0] === dateFiledFilter : true;
      const matchesClaimAmount = !claimAmountFilter || maturity.claimAmount.toString().includes(claimAmountFilter);
      const matchesMaturityDate = maturityDateFilter ? new Date(maturity.maturityDate).toISOString().split('T')[0] === maturityDateFilter : true;
      const matchesProduct = productFilter ? maturity.product.includes(productFilter) : true;
      const matchesOutstandingLoan = outstandingLoanFilter ? maturity.outstandingLoan.toString().includes(outstandingLoanFilter) : true;
      const matchesPaymentStatus = paymentStatusFilter ? maturity.paymentStatus.includes(paymentStatusFilter) : true;
      const matchesEffectiveDate = effectiveDateFilter ? new Date(maturity.effectiveDate).toISOString().split('T')[0] === effectiveDateFilter : true;
      const matchesRequestDate = requestDateFilter ? new Date(maturity.requestDate).toISOString().split('T')[0] === requestDateFilter : true;

      // Return only the rows that match all filters
      return (
        matchesFilterCriteria &&
        matchesClaimId &&
        matchesPolicyNumber &&
        matchesClaimant &&
        matchesMaturityType &&
        matchesClaimStatus &&
        matchesDateFiled &&
        matchesClaimAmount &&
        matchesMaturityDate &&
        matchesProduct &&
        matchesOutstandingLoan &&
        matchesPaymentStatus &&
        matchesEffectiveDate &&
        matchesRequestDate
      );
    });

    this.paginationSetup();
  }

  /**
   * Sorts the filtered maturities based on the specified field.
   * @param field The field to sort by.
   */
  sortBy(field: string): void {
    this.filteredMaturities.sort((a, b) => (a[field] > b[field] ? 1 : -1));
  }
  
  /**
   * Tracks the identity of a maturity object for change detection.
   * @param index The index of the maturity object in the array.
   * @param maturity The maturity object.
   * @returns The maturity object's claim ID.
   */
  trackById(index: string, maturity: Maturity): string {
    return maturity.claimId;
  }

  /**
   * Toggles the selection state of a maturity.
   * @param index The index of the maturity object in the array.
   */
  toggleMaturitySelection(index: number): void {
    if (index === -1) {
      const selectAll = !this.allSelected();
      this.filteredMaturities.forEach(maturity => (maturity.isSelected = selectAll));
    } else {
      this.filteredMaturities[index].isSelected = !this.filteredMaturities[index].isSelected;
    }
  }

  /**
   * Checks if all maturities are selected.
   * @returns True if all maturities are selected, false otherwise.
   */
  allSelected(): boolean {
    return this.filteredMaturities.every(maturity => maturity.isSelected);
  }

  /**
   * Placeholder method for processing selected maturities.
   */
  processMaturities(): void {
    const selectedMaturities = this.filteredMaturities.filter(maturity => maturity.isSelected);
    console.log('Processing:', selectedMaturities);
  }
}
