import { ChangeDetectorRef, Component } from '@angular/core';
import stepData from '../../data/steps.json';
import {Logger} from '../../../../../../shared/shared.module';
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

const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent {
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;

  quickQuotationCode:any;
  quotationDetails:any;
  quotationNo:any;
  quoteDate:any;

  productInformation:any;
  taxInformation:any;

  insuredCode:any;
  agentDesc:any;
  coverFrom:any;
  coverTo:any;


  constructor(
    public fb:FormBuilder,
    public productService:ProductsService,
    public quotationService:QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassService:SubclassesService,
    private gisService: ProductService,
    public authService:AuthService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,
    private clientService:ClientService,
    public sharedService:SharedQuotationsService,

  ) { }

  ngOnInit(): void{
    this.quickQuotationCode=this.sharedService.getQuickQuotationDetails();
    log.debug("Quick Quote Quotation Number:",this.quickQuotationCode )
    this.loadClientQuotation()
  }

  loadClientQuotation(){
    this.quotationService.getClientQuotations(this.quickQuotationCode).subscribe(data =>{
      this.quotationDetails=data;
      log.debug("Quotation Details:",this.quotationDetails)
      this.quotationNo=this.quotationDetails.no;
      log.debug("Quotation Number:",this.quotationNo)
     

      this.insuredCode=this.quotationDetails.clientCode;
      log.debug("Insured Code:",this.insuredCode)

      this.coverFrom=this.quotationDetails.coverFrom ;
      log.debug("Cover From:",this.coverFrom)

      this.coverTo=this.quotationDetails.coverTo;
      log.debug("Cover To:",this.coverTo)

      this.productInformation=this.quotationDetails.quotationProduct;
      log.debug("Product Information:",this.productInformation)

      this.quoteDate=this.productInformation[0].WEF;


      this.agentDesc=this.productInformation[0].agentShortDescription;
      log.debug("Agent Description:",this.agentDesc)

      

    })
  }


}
