import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { QuotationsService } from '../../../features/gis/components/quotation/services/quotations/quotations.service';
import { PolicyService } from '../../../features/gis/components/policy/services/policy.service';
import { Logger } from '../../services/logger/logger.service';
import { DatePipe } from '@angular/common';
import { NgxCurrencyConfig } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';

const log = new Logger('QuotationDetailsComponent');

@Component({
  selector: 'app-policy-landing-screen',
  templateUrl: './policy-landing-screen.component.html',
  styleUrls: ['./policy-landing-screen.component.css'],
  standalone: false
})
export class PolicyLandingScreenComponent implements OnInit {
  @Input() LMS_IND: any[];
  @Input() LMS_GRP: any[];
  @Input() GIS: any[];
  @Input() PEN: any[];

  assignedSystems: any[] = [];

  possibleTabs = [
    { header: 'Life IND', systemName: 'LIFE MANAGEMENT SYSTEM', content: 'lifeInd' },
    { header: 'General', systemName: 'GENERAL INSURANCE SYSTEM', content: 'general' }
  ];
  policies: any[] = [];

  // Dynamic policy columns configuration
  policyColumns: { field: string; header: string; visible: boolean; filterable: boolean; sortable: boolean }[] = [];
  showPolicyColumnModal = false;
  policyColumnModalPosition = { top: '0px', left: '0px' };

  dateFormat: string = 'dd-MMM-yyyy'; // Default format (will be overridden by session if present)
  primeNgDateFormat: string = 'dd-M-yy'; // PrimeNG format (will be recalculated)
  private datePipe: DatePipe = new DatePipe('en-US');
  public currencyObj: NgxCurrencyConfig;
  public policiesLoading: boolean = false;
  public policiesLoaded: boolean = false;


  constructor(
    private session_service: SessionStorageService,
    private router: Router,
    private quotationsService: QuotationsService,
    private policyService: PolicyService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // initialize currency formatting object (uses session settings if present)
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol') || '';
    this.currencyObj = {
      prefix: currencySymbol ? currencySymbol + ' ' : '',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter || ',',
      suffix: ' ',
      nullable: true,
      align: 'left',
    } as NgxCurrencyConfig;

    // Initialize date format from session storage
    const sessionDateFormat = sessionStorage.getItem('dateFormat');
    if (sessionDateFormat) {
      this.dateFormat = sessionDateFormat;
    } else {
      this.dateFormat = 'dd-MM-yyyy';
    }

    // Convert dateFormat to PrimeNG format
    this.primeNgDateFormat = this.dateFormat.replace('yyyy', 'yy').replace('MM', 'mm');

    this.loadSystemsAssignedToUser();
  }

  get visibleTabs() {
    return this.possibleTabs.filter(tab => this.assignedSystems.some(sys => sys.systemName === tab.systemName));
  }

  loadSystemsAssignedToUser() {
    const userId = 2002; //to be replaced with actual userId
    this.quotationsService.getSystemsAssignedToUser(userId).subscribe(systems => {
      this.assignedSystems = systems;
      log.debug('Systems assigned to user:', systems);
      // If General insurance system is present, load policies
      const hasGeneral = this.assignedSystems.some(sys => sys.systemName === 'GENERAL INSURANCE SYSTEM');
      if (hasGeneral) {
        this.loadGeneralPolicies();
      }
    });
  }


  /**
   * Load policies and return a Promise that resolves when loading completes.
   */
  loadGeneralPolicies(page: number = 0, size: number = 500, showSpinner: boolean = false): Promise<void> {
    if (showSpinner) {
      this.policiesLoading = true;
      this.policiesLoaded = false;
      this.spinner.show();
    }

    return new Promise((resolve, reject) => {
      this.policyService.getAllPolicy(page, size).subscribe(
        (resp: any) => {
          if (resp && Array.isArray(resp.content)) {
            this.policies = resp.content;
            log.debug('loaded policies', this.policies);
            if (this.policies.length > 0) {
              this.setPolicyColumns(this.policies[0]);
            }
          } else {
            log.warn('Unexpected policy response shape, expected { content: [] }', resp);
            this.policies = [];
          }

          if (showSpinner) {
            this.spinner.hide();
            this.policiesLoading = false;
            this.policiesLoaded = true;
          }
          resolve();
        },
        (err: any) => {
          log.error('Failed to load policies', err);
          this.policies = [];
          if (showSpinner) {
            this.spinner.hide();
            this.policiesLoading = false;
            this.policiesLoaded = true; // loaded but empty/error
          }
          reject(err);
        }
      );
    });
  }

  /**
   * Handler for PrimeNG tab view changes.
   */
  onTabChange(event: any): void {
    const selectedIndex = event?.index ?? 0;
    const selectedTab = this.visibleTabs[selectedIndex];
    if (selectedTab && selectedTab.content === 'general') {
      if (!this.policiesLoaded) {
        this.loadGeneralPolicies(0, 100, true).catch(() => { /* error already logged */ });
      }
    }
  }

  // dynamic policy columns 
  setPolicyColumns(policy: any) {
    const excludedFields = ['insureds', 'acprCode', 'acprShortDescription', 'alpProposalNumber'];

    this.policyColumns = Object.keys(policy)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: this.defaultVisiblePolicyFields.includes(key),
        filterable: true,
        sortable: true
      }));

    // Restore visibility from session storage
    const saved = sessionStorage.getItem('policyColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.policyColumns.forEach(col => {
        const savedCol = savedVisibility?.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }
  }

  defaultVisiblePolicyFields = ['policyNumber', 'clientName', 'agentShortDescription', 'premium', 'policyCoverFrom', 'policyCoverTo'];

  // Save column visibility to session storage
  savePolicyColumnsToSession(): void {
    if (this.policyColumns) {
      const visibility = this.policyColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('policyColumns', JSON.stringify(visibility));
    }
  }

  // Toggle column visibility and save to session
  togglePolicyColumnVisibility(field: string) {
    this.savePolicyColumnsToSession();
  }

  // Open column selector modal
  togglePolicyColumns(iconElement: HTMLElement): void {
    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 160;

    this.policyColumnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showPolicyColumnModal = !this.showPolicyColumnModal;
  }

  // Convert camelCase to Sentence Case for headers
  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  selectLmsIndRow(i: any) {
    this.session_service.set(SESSION_KEY.QUOTE_CODE, i['quote_no']);
    this.session_service.set(SESSION_KEY.CLIENT_CODE, i['client_code']);
    this.session_service.set(SESSION_KEY.QUICK_CODE, i['code']);
    this.session_service.set(SESSION_KEY.PROPOSAL_CODE, i['proposal_no']);
    this.session_service.set(SESSION_KEY.WEB_QUOTE_DETAILS, i);
    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }

  /**
   * Returns formatted date string or placeholder if date is null/invalid
   */
  formatDateDisplay(date: any, placeholder: string = '—'): string {
    if (!date) {
      return placeholder;
    }

    try {
      const rawDate = new Date(date);

      // Check if date is valid
      if (isNaN(rawDate.getTime())) {
        return placeholder;
      }

      // Use the date format from session storage
      const formattedDate = this.datePipe.transform(rawDate, this.dateFormat);
      return formattedDate || placeholder;
    } catch (error) {
      log.error('Error formatting date for display:', error);
      return placeholder;
    }
  }

  /**
   * Check if a field name represents a date field
   */
  isDateField(fieldName: string): boolean {
    const dateFieldPatterns = [
      'date', 'Date', 'DATE', 'coverTo', 'coverFrom', 'cover To',
      'wef', 'wet',
      'created', 'updated', 'modified',
      'timestamp', 'time'
    ];

    return dateFieldPatterns.some(pattern =>
      fieldName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

}
