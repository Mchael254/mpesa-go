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
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { Products } from '../../../setups/data/gisDTO';
import { Router } from '@angular/router';

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
  coverQuotationNo:any;
  quotationDetails:any;
  quotationNo:any;
  quoteDate:any;

  productInformation:any;
  taxInformation:any;

  insuredCode:any;
  agentDesc:any;
  coverFrom:any;
  coverTo:any;

  clientDetails:ClientDTO;
  selectedClientName:any;
  clientcode:any;

  productCode:any;
  quotationproduct:any;
  productDesc:any;

  formattedCoverFrom: string;
  formattedCoverTo: string;

  isAddRisk:boolean=true;

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
    private router: Router,

    // private datePipe: DatePipe

  ) { 
    
  }

  ngOnInit(): void{
    this.quickQuotationCode=this.sharedService.getQuickQuotationDetails();
    log.debug("Quick Quote Quotation Number:",this.quickQuotationCode );
    this.coverQuotationNo=this.sharedService.getSelectedCover();
    log.debug("Selected Cover Quotation Number:",this.coverQuotationNo );

    this.loadClientQuotation()
  }

  loadClientQuotation(){
    this.quotationService.getClientQuotations(this.coverQuotationNo).subscribe(data =>{
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
      
      // Format coverFrom and coverTo using DatePipe
      // this.formattedCoverFrom = this.formatDate(this.coverFrom);
      // this.formattedCoverTo = this.formatDate(this.coverTo);

      this.productInformation=this.quotationDetails.quotationProduct;
      log.debug("Product Information:",this.productInformation);
      this.productCode=this.productInformation[0].proCode;
      log.debug("ProductCode:",this.productCode)

      this.quoteDate=this.productInformation.wef;


      this.agentDesc=this.productInformation[0].agentShortDescription;
      log.debug("Agent Description:",this.agentDesc)
      
      this.getClient();
      this.getQuotationProduct();
      

    })
  }
  // private formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   return this.datePipe.transform(date, 'MMMM d, yyyy');
  // }

 
  showOptions(item: any): void {
    item.showOptions = !item.showOptions;
  }

  editItem(item: any): void {
    // Add your edit logic here
    console.log('Edit item clicked', item);
  }

  deleteItem(item: any): void {
    // Add your delete logic here
    console.log('Delete item clicked', item);
  }
  getClient(){
    this.clientService.getClientById(this.insuredCode).subscribe(data=>{
      this.clientDetails = data;
      log.debug("Selected Client Details",this.clientDetails);
      this.selectedClientName=this.clientDetails.firstName + ' ' + this.clientDetails.lastName
      log.debug("Selected Client Name",this.selectedClientName);

    })
  }
  getQuotationProduct(){
    this.productService.getProductByCode(this.productCode).subscribe(data =>{
      this.quotationproduct = data;
      log.debug(this.quotationproduct,"this is a quotation product")
      this.productDesc=this.quotationproduct.description;
      log.debug("PRODUCT Desc:")
      this.cdr.detectChanges()
    })
  }
  addAnotherRisk(){
    this.sharedService.setAddAnotherRisk(this.quotationDetails,this.clientDetails);
    this.sharedService.setIsAddRisk(this.isAddRisk);
    log.debug("isAddRisk:",this.isAddRisk)
    log.debug("quotation number:",this.quotationNo)
    log.debug("Quotation Details:",this.quotationDetails)
    log.debug("Selected Client Details",this.clientDetails);

    this.router.navigate(['/home/gis/quotation/quick-quote'])
    
  }


}
