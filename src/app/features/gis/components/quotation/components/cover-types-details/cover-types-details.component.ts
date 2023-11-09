import { ChangeDetectorRef, Component } from '@angular/core';
import stepData from '../../data/steps.json'
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import {Logger} from '../../../../../../shared/shared.module'
const log = new Logger('CoverTypesDetailsComponent');

@Component({
  selector: 'app-cover-types-details',
  templateUrl: './cover-types-details.component.html',
  styleUrls: ['./cover-types-details.component.css']
})
export class CoverTypesDetailsComponent {
  isCollapsibleOpen = false;
  isModalOpen = false;
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;
  coverTypes:any[];

  quickQuotationCode:any;
  quotationDetails:any;

  quickQuoteSectionList:any;

  taxInformation:any;
  riskInformation:any
  sumInsuredValue:any;

  premium:any;

  coverTypeShortDescription:any;
  

  constructor(
    public fb:FormBuilder,
    public productService:ProductsService,
    public binderService:BinderService,
    public quotationService:QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassService:SubclassesService,
    public currencyService:CurrencyService,
    private gisService: ProductService,
    public authService:AuthService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,
    private clientService:ClientService,
    public sharedService:SharedQuotationsService,

  ) { }

  ngOnInit(): void{
    this.quickQuotationCode=this.sharedService.getQuickQuotationDetails();
    log.debug("Quick Quote Quotation Number:",this.quickQuotationCode );
    this.loadClientQuotation()
    this.quickQuoteSectionList=this.sharedService.getQuickSectionDetails();
    log.debug("Quick Quote Quotation Sections:",this.quickQuoteSectionList );
    this.sumInsuredValue=this.sharedService.getSumInsured();
    log.debug("Quick Quote Quotation SI:",this.sumInsuredValue )
  }


  toggleCollapsible() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  // compute() {
  //   // Make an API request to fetch cover types for the selected product
  //   this.myService.get('your-api-endpoint').subscribe((data: any[]) => {
  //     this.coverTypes = data; // Update the component's data
  //   });
  // }

  loadClientQuotation(){
    this.quotationService.getClientQuotations(this.quickQuotationCode).subscribe(data =>{
      this.quotationDetails=data;
      log.debug("Quotation Details:",this.quotationDetails)
      this.taxInformation=this.quotationDetails.taxInformation;
      log.debug("Tax and Levies Details:",this.taxInformation)
      this.premium=this.quotationDetails.premium;
      log.debug("Premium:",this.premium)
      this.riskInformation=this.quotationDetails.riskInformation;
      log.debug("Risk Info:",this.riskInformation);
      this.coverTypeShortDescription=this.riskInformation[0].covertypeShortDescription;
      log.debug("Cover type Desc:",this.coverTypeShortDescription);

    })

  }
  calculateTotal(): number {
    let total = this.premium;

    for (const tax of this.taxInformation) {
      total += tax.amount;
    }

    return total;
  }
}
