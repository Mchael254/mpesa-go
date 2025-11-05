import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { Logger } from '../../../../../../shared/shared.module'
import { FormBuilder } from '@angular/forms';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { QuotationDetails, QuotationProduct } from '../../data/quotationsDTO';
import { RiskDetailsComponent } from '../risk-details/risk-details.component'
import { NgxCurrencyConfig } from "ngx-currency";

const log = new Logger('RiskCentreComponent');

@Component({
  selector: 'app-risk-centre',
  templateUrl: './risk-centre.component.html',
  styleUrls: ['./risk-centre.component.css']
})
export class RiskCentreComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild(RiskDetailsComponent) RiskDetailsComponent!: RiskDetailsComponent;
  @ViewChild(RiskDetailsComponent) riskDetails!: RiskDetailsComponent;


  steps = quoteStepsData;
  quotationCode: any;
  quotationNumber: string;
  quotationDetails: QuotationDetails;
  insuredCode: number;
  passedProductList: QuotationProduct[] = [];
  selectedProduct: any;
  isCollapsed = false;
  riskDetailscolumns = false
  ticketStatus: string
  premiums: { net: number; gross: number; };
  public currencyObj: NgxCurrencyConfig;

  constructor(
    public subclassService: SubclassesService,
    public sharedService: SharedQuotationsService,
    public binderService: BinderService,
    public clientService: ClientService,
    public quotationService: QuotationsService,
    public sectionService: SectionsService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public vehicleMakeService: VehicleMakeService,
    public vehicleModelService: VehicleModelService,
    public producSetupService: ProductsService,
    public premiumRateService: PremiumRateService,
    public riskClauseService: RiskClausesService,
    public globalMessagingService: GlobalMessagingService,
    public productService: ProductsService,

    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,

  ) {
    this.ticketStatus = sessionStorage.getItem('ticketStatus');
    this.quotationCode = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quotationNum');

  }
  ngOnInit(): void {
    const stored = sessionStorage.getItem('premiums');
    if (stored) {
      this.premiums = JSON.parse(stored);
    }
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol')
    log.debug("currency Object:", currencySymbol)
    log.debug("currency Delimeter:", currencyDelimiter)
    this.currencyObj = {
      prefix: currencySymbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
    if (this.quotationCode) {
      this.fetchQuotationDetails(this.quotationCode)
    }
  }

  toggleSection() {
    this.isCollapsed = !this.isCollapsed;
  }

  togglePerilColumns(iconTrigger: HTMLElement): void {
    this.riskDetails.toggleRiskDetailsColumns(iconTrigger);
  }

  fetchQuotationDetails(quoatationCode: number) {
    log.debug("Quotation code tot use:", quoatationCode)
    this.quotationService.getQuotationDetails(quoatationCode)
      .subscribe({
        next: (res: any) => {
          this.quotationDetails = res;
          log.debug("Quotation details", this.quotationDetails);
          this.insuredCode = this.quotationDetails.clientCode;
          this.passedProductList = this.quotationDetails?.quotationProducts
          log.debug("PASSED PRODUCT LIST:", this.passedProductList)
          // Set the first product as selected when the page loads
          if (this.passedProductList && this.passedProductList.length > 0) {
            this.selectedProduct = this.passedProductList[0];
            log.debug("Selected Product:", this.selectedProduct)
          }
          const insuredCode = this.quotationDetails.clientCode
          sessionStorage.setItem('insuredCode', insuredCode?.toString())
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }
  selectProduct(tab: any) {
    this.selectedProduct = tab;
    log.debug("selected product tab", this.selectedProduct)
  }
  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -150, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 150, behavior: 'smooth' });
  }

  showAddRiskModal() {
    if (!this.passedProductList || this.passedProductList.length === 0) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please add a product first.');
      return;
    }

    this.RiskDetailsComponent.openAddRiskModal();
  }
  handlePremiumChange(updatedPremiums: any) {
    this.premiums = updatedPremiums;
  }

}
