import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';

import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GroupQuotationsListDTO } from 'src/app/features/lms/models';
import { MenuService } from 'src/app/features/base/services/menu.service';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';

@Component({
  selector: 'app-quotation-landing-screen',
  templateUrl: './quotation-landing-screen.component.html',
  styleUrls: ['./quotation-landing-screen.component.css'],
})
export class QuotationLandingScreenComponent implements OnInit, OnChanges {

  @Input() LMS_IND: any[];
  @Input() LMS_GRP: GroupQuotationsListDTO[];
  @Input() GIS: any[];
  @Input() PEN: any[];
  activeIndex: number = 0;
  filteredLMS_GRP: GroupQuotationsListDTO[];
  selectedColumn: string = '';
  selectedCondition: string = '';
  filterValue: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  minToDate: Date | null = null;
  selectedRowIndex: number;
  quotationSubMenuList: SidebarMenu[];

  constructor(
    private session_service:
    SessionStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    this.session_service.clear_store();
    this.getParams();
    this.getGroupQuotationsList();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();

    this.dynamicSideBarMenu(this.quotationSubMenuList[2]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['LMS_GRP']) {
      this.getGroupQuotationsList();
    }
  }


  selectLmsIndRow(i: any) {
    if (!i || !i.client_code || !i.account_code) {
      return;
    }
    this.session_service.set(SESSION_KEY.WEB_QUOTE_DETAILS, i)
    let quote={};
    quote['client_code'] = i['client_code'];
    quote['account_code'] = i['account_code'];
    quote['web_quote_code'] = i['code'];
    quote['proposal_no'] = i['proposal_no'];
    quote['tel_quote_code'] = i['quote_no'];
    quote['page'] = 'WEB';
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);

    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }

  selectNormalQuotation(){
    let quote={};
    quote['page'] = 'NEW';
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);
    this.router.navigate(['/home/lms/ind/quotation/client-details']);

  }

  //gets params to automatically open Group-life tab when navigating from quote summary
  getParams() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'group-life') {
        this.activeIndex = 1; // Set the active index to the desired tab index (1-based)
      }
    });
  }

  getGroupQuotationsList(): void {
    if (this.LMS_GRP && this.LMS_GRP.length > 0) {
      this.filteredLMS_GRP = [...this.LMS_GRP];
      console.log("this.filteredLMS_GRP", this.filteredLMS_GRP);
    } else {
      this.filteredLMS_GRP = []
    }
  }

  grpQuotationsColumns = [
    { field: 'clear', label: 'Clear Filters' },
    { field: 'quotation_number', label: 'Quotation No.' },
    { field: 'product', label: 'Product' },
    { field: 'client_name', label: 'Client' },
    { field: 'agency_name', label: 'Intermediary' },
    { field: 'sum_assured', label: 'Sum Assured' },
    { field: 'total_premium', label: 'Premium' },
    { field: 'cover_from_date', label: 'Cover from' },
    { field: 'cover_to_date', label: 'Cover to' },
    { field: 'quotation_date', label: 'Date Created' },
    { field: 'quotation_status', label: 'Status' }
  ];

  // This method is triggered when the user types in the search box
  onSearch(event: Event): void {
    if (!this.LMS_GRP) {
      this.filteredLMS_GRP = []; // Handles undefined
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase().trim().replace(/,/g, '');

    // Apply filtering based on relevant fields
    this.filteredLMS_GRP = this.LMS_GRP.filter(quote =>
      this.matchesQuote(quote, searchTerm)
    );
  }

  // Unified function to check if a quote matches the search term across various fields
  matchesQuote(quote: any, searchTerm: string): boolean {
    return Object.values({
      quotation_number: quote.quotation_number,
      client_name: quote.client_name,
      agency_name: quote.agency_name,
      quotation_status: quote.quotation_status,
      branch_name: quote.branch_name,
      sum_assured: quote.sum_assured?.toString().replace(/,/g, ''),  // Normalize sums Assured
      total_premium: quote.total_premium?.toString().replace(/,/g, '', ''),
      quotation_date: this.formatDate(quote.quotation_date)
    }).some(fieldValue =>
      fieldValue?.toString().toLowerCase().includes(searchTerm) // Check if any field matches
    );
  }

  // Function to format the date, allowing for multiple input formats
  formatDate(value: string): string {
    return value.replace(/-/g, '/');
  }

  //  method to handle changes for column, condition, and filter value
  onColumnChange(event: Event): void {
    this.selectedColumn = (event.target as HTMLSelectElement).value;
    if (this.selectedColumn === 'clear') {
      this.clearFilters();
    } else {
      this.applyFilter();
    }
  }

  onConditionChange(event: Event): void {
    this.selectedCondition = (event.target as HTMLSelectElement).value;
    this.applyFilter();
  }

  onFilterInput(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.validateFilter();
    this.applyFilter();
  }

  isNumericField(column: string): boolean {
    // Define which fields are numeric
    const numericFields = ['sum_assured', 'total_premium'];
    return numericFields.includes(column);
  }

   // Validate filter selections
  validateFilter(): void {
    if (this.filterValue && !this.selectedColumn) {
      this.messageService.add({severity: 'info', summary: 'Information', detail: 'Please select a option first.'});
      this.filterValue = '';
      return;
    }

    if (this.filterValue && this.isNumericField(this.selectedColumn) && !this.selectedCondition) {
      this.messageService.add({severity: 'info', summary: 'Information', detail: 'Please select a condition first.'});
      return;
    }

    if (this.filterValue && this.selectedColumn && this.isNumericField(this.selectedColumn) && !this.selectedCondition) {
      this.messageService.add({severity: 'info', summary: 'Information', detail: 'Please select a condition for the numeric field.'});
      return;
    }
  }

  // Handle date range selection
  handleDateSelection(selectedDate: Date, type: string): void {
    if (type === 'from') {
      this.fromDate = selectedDate;
      this.minToDate = this.fromDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.LMS_GRP) {
      this.filteredLMS_GRP = [];
      return;
    }

    if (!this.selectedColumn || (!this.filterValue && !this.fromDate && !this.toDate)) {
      this.filteredLMS_GRP = [...this.LMS_GRP];
      return;
    }

    // Handle date filtering for 'cover_from_date', 'cover_to_date', or 'quotation_date'
    if (this.selectedColumn === 'cover_from_date' || this.selectedColumn === 'cover_to_date' || this.selectedColumn === 'quotation_date') {

      // Function to convert picked date (e.g., '17-October-2024') to 'YYYY-MM-DD'
      const formatPickedDate = (pickedDate: Date | null): string | null => {
        if (!pickedDate) return null;
        const day = pickedDate.getDate().toString().padStart(2, '0'); // Get day, ensure 2 digits
        const month = (pickedDate.getMonth() + 1).toString().padStart(2, '0'); // Get month, ensure 2 digits
        const year = pickedDate.getFullYear().toString(); // Get year
        return `${year}-${month}-${day}`; // Return formatted date in 'YYYY-MM-DD'
      };

      // Convert the selected dates to 'YYYY-MM-DD' format
      const formattedFromDate = formatPickedDate(this.fromDate);
      const formattedToDate = formatPickedDate(this.toDate);

      // Filter the dataset
      this.filteredLMS_GRP = this.LMS_GRP.filter(item => {
        const columnValue = item[this.selectedColumn]; // the date in the dataset is in 'YYYY-MM-DD' format

        if (formattedFromDate && formattedToDate) {
          // Both fromDate and toDate are selected
          return columnValue >= formattedFromDate && columnValue <= formattedToDate;
        } else if (formattedFromDate) {
          // Only fromDate is selected
          return columnValue >= formattedFromDate;
        } else if (formattedToDate) {
          // Only toDate is selected
          return columnValue <= formattedToDate;
        }
        return true; // No filtering if no dates are selected
      });
    }
    // Handle numeric filtering
    else if (this.isNumericField(this.selectedColumn) && this.filterValue) {
      // Sanitize the filterValue by removing commas
      const sanitizedFilterValue = this.filterValue.replace(/,/g, ''); // Remove commas

      const value = Number(sanitizedFilterValue);

      if (isNaN(value)) {
        this.filteredLMS_GRP = [...this.LMS_GRP];
        return;
      }

      this.filteredLMS_GRP = this.LMS_GRP.filter(item => {
        const columnValue = Number(item[this.selectedColumn]);
        switch (this.selectedCondition) {
          case 'greater':
            return !isNaN(columnValue) && columnValue > value;
          case 'less':
            return !isNaN(columnValue) && columnValue < value;
          case 'equals':
            return columnValue === value;
          default:
            return true;
        }
      });
    }
    // Handle string filtering
    else if (this.filterValue) {
      this.filteredLMS_GRP = this.LMS_GRP.filter(item => {
        const columnValue = item[this.selectedColumn]
          ? item[this.selectedColumn].toString().trim().toLowerCase()
          : '';
        const filterValueLower = this.filterValue.trim().toLowerCase();
        return columnValue.includes(filterValueLower);
      });
    } else {
      // Reset the filtered data if no filter is applied
      this.filteredLMS_GRP = [...this.LMS_GRP];
      return;
    }
  }




  clearFilters(): void {
    this.selectedColumn = null;
    this.selectedCondition = null;
    this.filterValue = '';
    this.filteredLMS_GRP = [...this.LMS_GRP];

    // Get the input element by its ID and reset its value:
    const inputElement = document.getElementById('otherNames') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  onQuotationTableRowClick(filteredLMS_GRP, index: number) {
    this.selectedRowIndex = index;
    if(filteredLMS_GRP){

    }
  }

  onProcess(){}

  onReassign(){}

  onRevise(){}

  onTabChange(event: any): void {
    this.activeIndex = event.index; // Update the active index

    if (this.activeIndex === 2) { // Index 2 corresponds to the "General" tab
      this.dynamicSideBarMenu(this.quotationSubMenuList[0]);
    } else {
       // Clear or hide the sidebar menu
       this.dynamicSideBarMenu(this.quotationSubMenuList[2]);
    }
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }
}
