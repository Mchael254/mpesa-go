import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Logger, untilDestroyed } from 'src/app/shared/shared.module';
import { QuotationList, Sources, UserDetails } from '../../data/quotationsDTO';
import { FormBuilder } from '@angular/forms';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { NeedAnalysisModule } from 'src/app/features/lms/ind/components/need-analysis/need-analysis.module';

const log = new Logger('ReviseReuseQuotationComponent');

@Component({
  selector: 'app-revise-reuse-quotation',
  templateUrl: './revise-reuse-quotation.component.html',
  styleUrls: ['./revise-reuse-quotation.component.css']
})
export class ReviseReuseQuotationComponent {

  user: string;
  userDetails: any;
  dateFormat: string;
  selectedDateFrom: string;
  sourceList: any;
  sourceDetail: Sources[] = [];
  gisQuotationList: QuotationList[] = [];
  selectedDateTo: string;
  selectedSource:string;
  constructor(
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public sharedService: SharedQuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public fb: FormBuilder,
    public quotationService: QuotationsService,



  ) { }

  ngOnInit(): void {
    this.getuser();
    this.loadAllQoutationSources();
    this.fetchGISQuotations();
  }
  ngOnDestroy(): void { }



  /**
  * Retrieves user information from the authentication service.
  * - Sets the 'user' property with the current user's name.
  * - Sets the 'userDetails' property with the current user's details.
  * - Logs the user details for debugging purposes.
  * - Retrieves and sets the 'userBranchId' property with the branch ID from user details.
  * @method getUser
  * @return {void}
  */
  getuser() {
    this.user = this.authService.getCurrentUserName();
    this.userDetails = this.authService.getCurrentUser();
    log.debug('User Details:', this.userDetails);
    log.debug('User:', this.user);

    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);

  }
  onDateFromInputChange(date: any) {
    log.debug('selected Date from raaw', date);
    const selectedDateFrom = date;
    if(selectedDateFrom){
    const SelectedFormatedDate = this.formatDate(selectedDateFrom)
    this.selectedDateFrom=SelectedFormatedDate
    log.debug(" SELECTED FORMATTED DATE from:", this.selectedDateFrom)
    // this.fetchGISQuotations()
    }
  }

  onDateToInputChange(date: any) {
    log.debug('selected Date To raaw', date);
    const selectedDateTo = date;
    if(selectedDateTo){
    const SelectedFormatedDateTo = this.formatDate(selectedDateTo)
    this.selectedDateTo=SelectedFormatedDateTo
    log.debug(" SELECTED FORMATTED DATE to:", this.selectedDateTo)
    // this.fetchGISQuotations()
    }
  }
  /**
 * Loads all quotation sources.
 * - Subscribes to 'getAllQuotationSources' from QuotationService.
 * - Populates 'sourceList' and assigns 'sourceDetail'.
 * - Logs source details.
 * @method loadAllQuotationSources
 * @return {void}
 */
  loadAllQoutationSources() {
    this.quotationService.getAllQuotationSources().subscribe((data) => {
      this.sourceList = data;
      this.sourceDetail = data.content;
      log.debug(this.sourceDetail, 'Source list');
      log.debug(this.sourceList, 'Source list');
    });
  }

  fetchGISQuotations() {
    const clientType= null
    const clientCode= null
    const quotPrsCode= null
    const vPrsCode= null
    const quote= null
    const status= "Confirmed"
    const dateFrom =this.selectedDateFrom || null
    const dateTo =this.selectedDateTo || null
    const source =this.selectedSource
    const clientName=null
    const agentCode=null

    log.debug("Selected Date from:",this.selectedDateFrom)
    log.debug("Selected Date to:",this.selectedDateTo)

    this.quotationService
      .searchQuotations(0, 10,clientType,clientCode,quotPrsCode,dateFrom,dateTo,agentCode,vPrsCode,quote,status,source,clientName)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.gisQuotationList = response._embedded
          log.debug("LIST OF GIS QUOTATIONS ", this.gisQuotationList);

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotation list. Try again later');
        }
      });
  }
  formatDate(date: Date): string {
    log.debug("Date (formatDate method):", date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
