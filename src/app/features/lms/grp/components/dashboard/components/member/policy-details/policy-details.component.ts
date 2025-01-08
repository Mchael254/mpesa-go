import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { DashboardService } from '../../../services/dashboard.service';
import { DetailedMemContrReceiptsDTO, MemberCoversDTO, MemberDetailsDTO, MemberPensionDepReceiptsDTO, MemberWithdrawalsDTO, PensionAccountSummaryDTO, memberBalancesDTO } from '../../../models/member-policies';
import { BreadCrumbItem } from '../../../../../../../../shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from '../../../../../../../../shared/services/AutoUnsubscribe';
import { Logger } from '../../../../../../../../shared/services';
import { ReportsService } from '../../../../../../../../shared/services/reports/reports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const log = new Logger("PolicyDetailsComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyDetailsComponent implements OnInit, OnDestroy {
  selectedContent: string = 'summary'
  columnOptions: SelectItem[];
  selectedColumns: string[];
  years: string[] = [];
  selectedPolicyNumber: string;
  selectedPolicyCode: number;
  endorsementCode: number;
  productType: string;
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedRowIndex: number;
  pensionWithLifeRider: boolean = false;
  gla: boolean = false;
  investment: boolean = false;
  investmentWithRider: boolean = false;
  memberBalances: memberBalancesDTO[] = [];
  filteredMemberBalances: memberBalancesDTO[] = [];
  selectedColumn: string = '';
  selectedCondition: string = '';
  filterValue: string = '';
  memberCovers: MemberCoversDTO[];
  memberPensionDepReceipts: MemberPensionDepReceiptsDTO[];
  filteredMemberPensionDepReceipts: MemberPensionDepReceiptsDTO[] = [];
  selectedYear: string = '';
  selectedMonth: string = '';
  memberDetails: MemberDetailsDTO[];
  detailedMemContrReceipts: DetailedMemContrReceiptsDTO[]
  policyMemCode: number;
  entityCode: number
  pensionDepositCode: number;
  withdrawals: MemberWithdrawalsDTO[] = [];
  selectedWithdrawalsYear: string = '';
  selectedWithdrawalsMonth: string = '';
  filteredWithdrawals: MemberWithdrawalsDTO[] = [];
  pensionAccSummaryRptPdf: string | null = null;
  membershipCertRptPdf: string | null = null;
  memItemizedStmtRptPdf: string | null = null;
  pensionAccSummaryRptCode: number = 789233;
  membershipCertRptCode: number = 789256;
  memberItemizedStmtRptCode: number = 789257;
  showDateRangePicker = false;
  maxDate: Date = new Date();
  toDate: Date | null = null;
  dateRangeForm: FormGroup;
  productCode: number;
  totalContributions: number;
  private pdfJsLib: any;
  pensionAccountSummary: PensionAccountSummaryDTO;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private router: Router,
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.selectedPolicyNumber = this.activatedRoute.snapshot.queryParams['policyNumber'];
    this.entityCode = this.activatedRoute.snapshot.queryParams['entityCode'];
    this.selectedPolicyCode = this.activatedRoute.snapshot.queryParams['policyCode'];
    this.endorsementCode = this.activatedRoute.snapshot.queryParams['endorsementCode'];
    this.productType = this.activatedRoute.snapshot.queryParams['productType'];
    this.policyMemCode = this.activatedRoute.snapshot.queryParams['policyMemberCode']
    this.productCode = this.activatedRoute.snapshot.queryParams['productCode']
    this.getProductType();
    this.populateYears();
    this.adminDetsTableColumns();
    this.populateBreadCrumbItems();
    this.getMemberAllPensionDepositReceipts();
    this.getValuations();
    this.getMemberCovers();
    this.getMemberDetails();
    this.getMemberWithdrawals();
    this.loadPdfJs();
    this.getPensAccSummaryReport();
    this.getMembershipCertificate();
    // this.getMemberItemizedStmt();
    this.getDateRangeForm();
  }

  ngOnDestroy(): void {

  }

  /**
   * The function `getProductType` sets the `gla`(Group life assurance) property to true if the `productType` is 'EARN'.
   * If productType is 'PENS'(Pension product), that is default. To add for pension with life rider, inv and inv with rider
   */
  getProductType() {
    if (this.productType === 'PENSWITHRIDER') {
      this.pensionWithLifeRider = true;
    } else if (this.productType === 'INV') {
      this.investment = true;
    } else if (this.productType === 'INVWITHRIDER') {
      this.investmentWithRider = true;
    } else if (this.productType === 'EARN') {
      this.gla = true;
    }
    //DEFAULT this.productType === 'PENS'
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/dashboard-screen' },
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/policy-details' },
    ];
  }

  showContent(content: string) {
    if (content === 'summary') {
      this.selectedContent = 'summary';
    } else if (content === 'transactions') {
      this.selectedContent = 'transactions';
    }
    else if (content === 'cover_types') {
      this.selectedContent = 'cover_types';
    }
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = ['All'];
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year.toString());
    }
  }

  months: { label: string, value: string }[] = [
    { label: "All", value: '' },
    { label: "January", value: '01' },
    { label: "February", value: '02' },
    { label: "March", value: '03' },
    { label: "April", value: '04' },
    { label: "May", value: '05' },
    { label: "June", value: '06' },
    { label: "July", value: '07' },
    { label: "August", value: '08' },
    { label: "September", value: '09' },
    { label: "October", value: '10' },
    { label: "November", value: '11' },
    { label: "December", value: '12' }
  ];

  adminDetsTableColumns() {
    this.columnOptions = [
      { label: 'Name', value: 'contact_person_name' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'ID number', value: 'identification_number' },
      { label: 'Position', value: 'position' },
      { label: 'Physical address', value: 'contact_person_physical_address' },
      { label: 'Contact', value: 'phone_number' },
      { label: 'Email', value: 'contact_person_email' },
      { label: 'With effect from', value: 'wef' },
      { label: 'With effect to', value: 'wet' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  dummyData = [
    {
      year: 2022,
      period: 'January',
      balanceBF: 10000,
      contribution: 2000,
      rate: 5,
      interest: 500,
      balanceCF: 12500
    },
    {
      year: 2022,
      period: 'February',
      balanceBF: 12500,
      contribution: 2000,
      rate: 5,
      interest: 625,
      balanceCF: 15125
    },
    {
      year: 2022,
      period: 'March',
      balanceBF: 15125,
      contribution: 2000,
      rate: 5,
      interest: 756.25,
      balanceCF: 17881.25
    }
  ];

  showReceiptsModal() {
    const modal = document.getElementById('receiptsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeReceiptsModal() {
    const modal = document.getElementById('receiptsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  getGenderLabel(gender: string): string {
    return gender === 'M' ? 'Male' : 'Female';
  }

  getStatusLabel(value: string): string {
    switch (value) {
      case 'W':
        return 'Withdrawn';
      case 'A':
        return 'Active';
      case 'E':
        return 'Exited';
      default:
        return '';
    }
  }

  onReceiptsTableRowClick(memberPensionDepReceipts, index: number) {
    this.selectedRowIndex = index;
    if(memberPensionDepReceipts){
      this.pensionDepositCode = memberPensionDepReceipts.pension_member_dep_code;
      this.policyMemCode = memberPensionDepReceipts.policy_member_code;
      this.getDetMemDepConReceipts();
      this.showReceiptsModal();
      this.cdr.detectChanges();
    }
  }

  getDetMemDepConReceipts() {
    this.dashboardService.getDetMemDepConReceipts(this.pensionDepositCode, this.policyMemCode).subscribe((res: DetailedMemContrReceiptsDTO[]) => {
      this.detailedMemContrReceipts = res;
      // Calculate the total contributions after data retrieval
      this.totalContributions = this.calculateTotalContributions();
      this.cdr.detectChanges();
    });
  }
  
  // Method to calculate total contributions
  calculateTotalContributions(): number {
    const employeeContribution = this.detailedMemContrReceipts[0]?.employee_amount || 0;
    const employeeTransfer = this.detailedMemContrReceipts[0]?.pnmdp_empye_trans_amt || 0;
    const employeeVoluntary = this.detailedMemContrReceipts[0]?.pnmdp_empye_vol_amt || 0;
    const employeeCostBenefits = this.detailedMemContrReceipts[0]?.cost_of_past_benefits || 0;
    const employeeTotal = this.detailedMemContrReceipts[0]?.total_amount || 0;

    const employerContribution = this.detailedMemContrReceipts[0]?.employer_amount || 0;
    const employerTransfer = this.detailedMemContrReceipts[0]?.pnmdp_empyr_trans_amt || 0;
    const employerVoluntary = this.detailedMemContrReceipts[0]?.pnmdp_empyr_trans_amt || 0;
    const employerCostBenefits = this.detailedMemContrReceipts[0]?.cost_of_past_benefits || 0;
    const employerTotal = this.detailedMemContrReceipts[0]?.total_amount || 0;

    const totalEmployeeEmployerContr = employeeContribution + employeeTransfer + employeeVoluntary + employeeCostBenefits + 
    employeeTotal + employerContribution + employerTransfer + employerVoluntary + employerCostBenefits + employerTotal;

    return totalEmployeeEmployerContr;
  }

  getMemberDetails() {
    this.dashboardService.getMemberDetails(this.selectedPolicyCode, this.policyMemCode).subscribe((res: MemberDetailsDTO[]) => {
      this.memberDetails =  res;
      this.cdr.detectChanges();
    });
  }

  // getMemberAllPensionDepositReceipts() {
  //   this.dashboardService.getMemberAllPensionDepositReceipts(this.selectedPolicyCode, this.policyMemCode).subscribe((res: MemberPensionDepReceiptsDTO[]) => {
  //     this.memberPensionDepReceipts = res;
  //     this.cdr.detectChanges();
  //   });
  // }

  getMemberAllPensionDepositReceipts() {
    this.dashboardService.getMemberAllPensionDepositReceipts(this.selectedPolicyCode, this.policyMemCode)
      .subscribe((res: MemberPensionDepReceiptsDTO[]) => {
        this.memberPensionDepReceipts = res;
        this.filteredMemberPensionDepReceipts = this.memberPensionDepReceipts;
        this.cdr.detectChanges();
      });
  }

  filterReceiptsByYearMonth() {
    // Ensure that receipts data is available before filtering
    if (!this.memberPensionDepReceipts || this.memberPensionDepReceipts.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'No receipts data available to filter'
      });
      this.filteredMemberPensionDepReceipts = []; // Reset filtered data
      this.cdr.detectChanges();
      return;
    }

    // Prevent month selection before year selection
    if (this.selectedMonth && !this.selectedYear) {
      this.selectedMonth = ''; // Reset selected month
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Please select year first'
      });
      this.filteredMemberPensionDepReceipts = [...this.memberPensionDepReceipts]; // Reset to all records
      this.cdr.detectChanges();
      return;
    }

    // If "All" year is selected, reset month to "All" and display all records
    if (this.selectedYear === 'All') {
      this.selectedMonth = ''; // Reset month to "All"
      this.filteredMemberPensionDepReceipts = [...this.memberPensionDepReceipts];
      this.cdr.detectChanges();
    } else {
      // If no selections are made, reset to all records
      if (!this.selectedYear && !this.selectedMonth) {
        this.filteredMemberPensionDepReceipts = [...this.memberPensionDepReceipts];
        this.cdr.detectChanges();
      } else {
        // Perform filtering based on selected year and month
        this.filteredMemberPensionDepReceipts = this.memberPensionDepReceipts.filter(item => {
          const receiptDate = new Date(item.pnmdp_date); // Assuming item.pnmdp_date exists
          const receiptYear = receiptDate.getFullYear().toString();
          const receiptMonth = ('0' + (receiptDate.getMonth() + 1)).slice(-2); // Format month as 2-digit

          // If year is selected, check for matches
          const yearMatches = this.selectedYear === 'All' || receiptYear === this.selectedYear;
          // Check for month matches if a month is selected
          const monthMatches = !this.selectedMonth || receiptMonth === this.selectedMonth;

          return yearMatches && monthMatches;
        });

        // If no records are found for the selected month/year combination, notify the user
        if (this.filteredMemberPensionDepReceipts.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: `No receipts records found for ${this.selectedMonth ? this.months.find(m => m.value === this.selectedMonth)?.label : 'All'} ${this.selectedYear}`
          });
          this.filteredMemberPensionDepReceipts = []; // Ensure filtered list is empty
        }
      }
    }

    this.cdr.detectChanges();
  }

  valuationsColumns = [
    { field: 'year', label: 'Year' },
    { field: 'period', label: 'Period' },
    { field: 'balance_bf', label: 'Balance B/F' },
    { field: 'employer_amount', label: 'Contribution' },
    { field: 'rate', label: 'Rate' },
    { field: 'total_interest', label: 'Interest' },
    { field: 'balance_cf', label: 'Balance C/F' },
  ];


  getValuations() {
    this.dashboardService.getMemberBalances(this.selectedPolicyCode, this.policyMemCode).subscribe((res: memberBalancesDTO[]) => {
      this.memberBalances = res;
      this.filteredMemberBalances = [...this.memberBalances];  // Copy original data for filtering
      this.cdr.detectChanges();
    });
  }

  applyValuationsFilter() {
    if (!this.selectedColumn || !this.selectedCondition || !this.filterValue) {
      // Reset the filtered data when no filter criteria are selected
      this.filteredMemberBalances = [...this.memberBalances];
    } else {
      // Sanitize the filterValue by removing any commas
      const sanitizedFilterValue = this.filterValue.replace(/,/g, '');
      const value = parseFloat(sanitizedFilterValue);

      if (isNaN(value)) {
        // If filter value is invalid (not a number), reset filtered data to all items
        this.filteredMemberBalances = [...this.memberBalances];
      } else {
        this.filteredMemberBalances = this.memberBalances.filter(item => {
          const columnValue = parseFloat(item[this.selectedColumn]);

          switch (this.selectedCondition) {
            case 'greater':
              return columnValue > value;
            case 'less':
              return columnValue < value;
            case 'equals':
              return columnValue === value;
            default:
              return true;
          }
        });
      }
    }

    this.cdr.detectChanges();
  }  

  getMemberCovers() {
    this.dashboardService.getMemberCovers(this.policyMemCode, this.endorsementCode).subscribe((res: MemberCoversDTO[]) => {
      this.memberCovers = res;
      this.cdr.detectChanges();
    });
  }

  getMemberWithdrawals() {
    this.dashboardService.getMemberWithdrawals(this.selectedPolicyCode, this.policyMemCode).subscribe((res: MemberWithdrawalsDTO[]) => {
      this.withdrawals = res;
      this.filteredWithdrawals = this.withdrawals;
      this.cdr.detectChanges();
    });
  }

  filterWithdrawalsByYearMonth() {
    // Ensure that withdrawals data is available before filtering
    if (!this.withdrawals || this.withdrawals.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'No withdrawals data available to filter'
      });
      this.filteredWithdrawals = []; // Reset filtered data
      this.cdr.detectChanges();
      return;
    }

    // Prevent month selection before year selection
    if (this.selectedWithdrawalsMonth && !this.selectedWithdrawalsYear) {
      this.selectedWithdrawalsMonth = ''; // Reset selected month
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Please select year first'
      });
      this.filteredWithdrawals = [...this.withdrawals]; // Reset to all records
      this.cdr.detectChanges();
      return;
    }

    // If "All" year is selected, reset month to "All" and display all records
    if (this.selectedWithdrawalsYear === 'All') {
      this.selectedWithdrawalsMonth = ''; // Reset month to "All"
      this.filteredWithdrawals = [...this.withdrawals];
      this.cdr.detectChanges();
    } else {
      // If no selections are made, reset to all records
      if (!this.selectedWithdrawalsYear && !this.selectedWithdrawalsMonth) {
        this.filteredWithdrawals = [...this.withdrawals];
        this.cdr.detectChanges();
      } else {
        // Perform filtering based on selected year and month
        this.filteredWithdrawals = this.withdrawals.filter(item => {
          const receiptDate = new Date(item.voucher_date); // Assuming item.voucher_date exists
          const receiptYear = receiptDate.getFullYear().toString();
          const receiptMonth = ('0' + (receiptDate.getMonth() + 1)).slice(-2); // Format month as 2-digit

          // If year is selected, check for matches
          const yearMatches = this.selectedWithdrawalsYear === 'All' || receiptYear === this.selectedWithdrawalsYear;
          // Check for month matches if a month is selected
          const monthMatches = !this.selectedWithdrawalsMonth || receiptMonth === this.selectedWithdrawalsMonth;

          return yearMatches && monthMatches;
        });

        // If no records are found for the selected month/year combination, notify the user
        if (this.filteredWithdrawals.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: `No withdrawals records found for ${this.selectedWithdrawalsMonth ? this.months.find(m => m.value === this.selectedWithdrawalsMonth)?.label : 'All'} ${this.selectedWithdrawalsYear}`
          });
          this.filteredWithdrawals = []; // Ensure filteredWithdrawals is empty
        }
      }
    }

    this.cdr.detectChanges();
  }  


  getMembershipCertificate() {
    this.dashboardService.getReports(this.membershipCertRptCode, this.productCode, this.selectedPolicyCode, this.policyMemCode).subscribe((res) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      this.membershipCertRptPdf = window.URL.createObjectURL(blob);
      this.cdr.detectChanges();
    });
  }

  getDateRangeForm() {
    this.dateRangeForm = this.fb.group({
      dateFrom: [null, [Validators.required]], // "From Date" is required
      dateTo: [new Date(), [Validators.required]], // Defaults to today's date
    });
    this.onToDateSelect();
  }

  // This method gets called when a To Date is selected
  onToDateSelect(): void {
    const selectedToDate = this.dateRangeForm.get('dateTo')?.value;

    if (selectedToDate) {
      this.toDate = new Date(selectedToDate); // Update the maxDate for From Date
    }
  }

  // Custom validation for date range
  validateDateRange(): boolean {
    const dateFrom = this.dateRangeForm.get('dateFrom')?.value;
    const dateTo = this.dateRangeForm.get('dateTo')?.value;
    return dateFrom && dateTo && new Date(dateFrom) <= new Date(dateTo);
  }

  toggleDateRangePicker(event: Event): void {
    event.preventDefault();
    this.showDateRangePicker = !this.showDateRangePicker;
  }

  // Function to format date to 'DD-MMM-YYYY' (e.g., '01-Jan-2024')
  formatDateToCustomString(date: string): string {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  }


  getMemberItemizedStmt(event: Event): void {
    event.preventDefault();

    if (!this.validateDateRange()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Select valid date range'
      });
      return;
    }

    if (this.dateRangeForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Select date range'
      });
      return;
    }

    const dateFrom = this.formatDateToCustomString(this.dateRangeForm.get('dateFrom')?.value);
    const dateTo = this.formatDateToCustomString(this.dateRangeForm.get('dateTo')?.value || new Date()); // Default to today if "To Date" is not selected

    // Call API to fetch the report
    this.dashboardService.getReports(this.memberItemizedStmtRptCode, this.productCode, this.selectedPolicyCode, this.policyMemCode,
      dateFrom, dateTo)
      .subscribe((res) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        this.memItemizedStmtRptPdf = window.URL.createObjectURL(blob);
        this.dateRangeForm.reset();
        this.showDateRangePicker = false;  // Hide form after fetching report
        this.cdr.detectChanges();

        // Automatically trigger download
        this.downloadReport(event, this.memItemizedStmtRptPdf, 'mem_itemized_stmt.pdf');
      });
  }

  /**
   * The function `loadPdfJs` dynamically loads the PDF.js library script from a CDN and assigns it to a
   * variable for use in the application. Helps in decoding and extracting pdf to text
   */
  private loadPdfJs(): void {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js';
    script.onload = () => {
      this.pdfJsLib = (window as any).pdfjsLib;
    };
    document.body.appendChild(script);
  }

  getPensAccSummaryReport() {
    this.dashboardService.getReports(this.pensionAccSummaryRptCode, this.productCode, this.selectedPolicyCode, this.policyMemCode)
      .subscribe((res) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        this.pensionAccSummaryRptPdf = window.URL.createObjectURL(blob);
        const reader = new FileReader();

        reader.onloadend = async () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const text = await this.extractTextFromPDF(arrayBuffer); //call extractTextFromPDF method 

          // Extract pension details from the text to get json object by calling extractPensionDetails method 
          //and assign to pensionAccountSummary
          const pensionDetails = this.extractPensionDetails(text);
          this.pensionAccountSummary = pensionDetails;
          this.cdr.detectChanges();
        };

        reader.readAsArrayBuffer(blob);
      });
    this.cdr.detectChanges();
  }

  /**
   * This TypeScript function extracts text content from a PDF file using pdf.js library
   * asynchronously.
   * @param {ArrayBuffer} arrayBuffer - The `arrayBuffer` parameter in the `extractTextFromPDF`
   * function is an ArrayBuffer containing the binary data of a PDF file. This ArrayBuffer is used to
   * create a PDF document using the pdf.js library in order to extract text content from the PDF
   * pages.
   * @returns The `extractTextFromPDF` function returns a Promise that resolves to a string containing
   * the extracted text from the PDF file represented by the provided `arrayBuffer`.
   */
  private async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    const pdf = await this.pdfJsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }

    return text;
  }

  /**
   * The function `extractPensionDetails` parses a given text to extract pension account details and
   * returns them in a structured format.
   * @param {string} text - The function `extractPensionDetails` takes a string `text` as input, which
   * presumably contains information about pension account details. The function uses regular
   * expressions to extract specific values related to employee and employer contributions, as well as
   * total pension account value from the text.
   * @returns The function `extractPensionDetails` returns an object of type `PensionAccountSummaryDTO`
   * containing various pension account details extracted from the input text. The returned object
   * includes employee and employer contributions, transfer value, AVC, severance, interest, and total
   * pension account values. If any of these values are not found in the input text, the function
   * defaults them to 0.
   */
  private extractPensionDetails(text: string): PensionAccountSummaryDTO {
    const result: Record<string, number> = {};

    // Regular expression to match the lines with both employee and employer values
    const regex = /(Contributions|Transfer Value|AVC|Severance|Interest|Total)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})/g;

    let match;

    while ((match = regex.exec(text)) !== null) {
      const label = match[1].toLowerCase().replace(/\s+/g, '_'); // Convert label to snake_case
      const employeeValue = parseFloat(match[2].replace(/,/g, '')); // Convert employee value to float
      const employerValue = parseFloat(match[3].replace(/,/g, '')); // Convert employer value to float

      // Store the extracted values
      result[`employee_${label}`] = employeeValue;
      result[`employer_${label}`] = employerValue;
    }

    // Capture the total pension account
    const totalRegex = /Total Pension Account:\s*MWK\s*([\d,]+\.\d{2})/;
    const totalMatch = totalRegex.exec(text);

    if (totalMatch) {
      result['total_pension_account'] = parseFloat(totalMatch[1].replace(/,/g, ''));
    }

    // Return the result mapped to PensionAccountSummaryDTO structure
    return {
      employee_avc: result['employee_avc'] || 0,
      employee_contributions: result['employee_contributions'] || 0,
      employee_interest: result['employee_interest'] || 0,
      employee_severance: result['employee_severance'] || 0,
      employee_total: result['employee_total'] || 0,
      employee_transfer_value: result['employee_transfer_value'] || 0,
      employer_avc: result['employer_avc'] || 0,
      employer_contributions: result['employer_contributions'] || 0,
      employer_interest: result['employer_interest'] || 0,
      employer_severance: result['employer_severance'] || 0,
      employer_total: result['employer_total'] || 0,
      employer_transfer_value: result['employer_transfer_value'] || 0,
      total_pension_account: result['total_pension_account'] || 0
    };
  }

  // downloadPensionReport(event: Event): void {
  //   event.preventDefault();

  //   if (this.pensionAccSummaryRptPdf) {
  //     const link = document.createElement('a');
  //     link.href = this.pensionAccSummaryRptPdf;
  //     link.download = 'pension_report.pdf';
  //     link.click();
  //   }
  // }

  downloadReport(event: Event, fileUrl: string, fileName: string): void {
    event.preventDefault();
  
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  }
  
}
