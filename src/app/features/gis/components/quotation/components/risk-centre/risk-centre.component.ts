import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyService } from '../../../policy/services/policy.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { QuotationDetails, QuotationProduct } from '../../data/quotationsDTO';
import {RiskDetailsComponent} from '../risk-details/risk-details.component'

const log = new Logger('RiskCentreComponent');

@Component({
  selector: 'app-risk-centre',
  templateUrl: './risk-centre.component.html',
  styleUrls: ['./risk-centre.component.css']
})
export class RiskCentreComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild(RiskDetailsComponent) RiskDetailsComponent!: RiskDetailsComponent;


  steps = quoteStepsData;
  quotationCode: any;
  quotationNumber: string;
  quotationDetails: QuotationDetails;
  insuredCode: number;
  passedProductList: QuotationProduct[] = [];
  selectedProduct: any;
      isCollapsed = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    public subclassService: SubclassesService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    private gisService: ProductService,
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
    private policyService: PolicyService,
    public productService: ProductsService,




    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private renderer: Renderer2

  ) {
    this.quotationCode = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quotationNum');
    if (this.quotationNumber) {
      this.fetchQuotationDetails(this.quotationCode)
    }
  }
    ngOnInit(): void {
this.passedProductList= [
  {
    code: 1,
    productCode: 8293,
    quotationCode: 2001,
    productShortDescription: 'Private Motor',
    premium: 12000,
    wef: '2025-07-01',
    wet: '2026-06-30',
    totalSumInsured: 500000,
    binder: 'BIND123',
    agentShortDescription: 'Agent A',
    productName: 'Comprehensive Motor',
    converted: 'No',
    taxInformation: [],
    riskInformation: [],
    limitsOfLiability: []
  },
  {
    code: 2,
    productCode: 8173,
    quotationCode: 2002,
    productShortDescription: 'Domestic Package',
    premium: 8000,
    wef: '2025-07-01',
    wet: '2026-06-30',
    totalSumInsured: 300000,
    binder: 'BIND456',
    agentShortDescription: 'Agent B',
    productName: 'Home Insurance',
    converted: 'Yes',
    taxInformation: [],
    riskInformation: [],
    limitsOfLiability: []
  },
  {
    code: 3,
    productCode: 1003,
    quotationCode: 2003,
    productShortDescription: 'Travel Cover',
    premium: 2500,
    wef: '2025-07-01',
    wet: '2025-12-31',
    totalSumInsured: 100000,
    binder: 'BIND789',
    agentShortDescription: 'Agent C',
    productName: 'Travel Insurance',
    converted: 'No',
    taxInformation: [],
    riskInformation: [],
    limitsOfLiability: []
  }
];
            this.selectedProduct = this.passedProductList[0];

    }

toggleSection() {
  this.isCollapsed = !this.isCollapsed;
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
  this.RiskDetailsComponent.openAddRiskModal();  }
}
