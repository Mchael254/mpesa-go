import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import stepData from '../../data/steps.json';
import {Logger} from '../../../../../../shared/shared.module';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { ProductService } from '../../../../services/product/product.service';
import { AuthService } from '../../../../../../shared/services/auth.service';

import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
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
  passedNewClientDetails:any;

  productCode:any;
  quotationproduct:any;
  productDesc:any;

  formattedCoverFrom: string;
  formattedCoverTo: string;

  isAddRisk:boolean=true;
  passedPremium:any;
  
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
    private ngZone: NgZone

   

  ) { 
    
  }

  ngOnInit(): void{
    
    const quotationNumberString = sessionStorage.getItem('quotationNumber');
    this.coverQuotationNo = JSON.parse(quotationNumberString);

    const riskLevelPremiumString = sessionStorage.getItem('riskLevelPremium');
    this.passedPremium = JSON.parse(riskLevelPremiumString);
    log.debug("Selected Cover Quotation Number:",this.coverQuotationNo );
    log.debug("Passed Premium :",this.passedPremium );

    this.loadClientQuotation();
    const newClientDetailsString = sessionStorage.getItem('newClientDetails');
    this.passedNewClientDetails = JSON.parse(newClientDetailsString);
    log.debug("New Client Details", this.passedNewClientDetails);

  }

  loadClientQuotation(){
    log.debug("Load CLient quotation has been called")
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
 

 
  showOptions(item: any): void {
    item.showOptions = !item.showOptions;
  }

  editItem(item: any): void {
    console.log('Edit item clicked', item);
  }

  deleteItem(item: any): void {
    console.log('Delete item clicked', item);
  }
  getClient(){
    if(this.passedNewClientDetails){
      log.debug("new client")
      this.selectedClientName=this.passedNewClientDetails?.inputClientName;
      log.debug("Selected New Client Name",this.selectedClientName); 
    }else{
      log.debug("existing client")

      this.clientService.getClientById(this.insuredCode).subscribe(data=>{
        this.clientDetails = data;
        log.debug("Selected Client Details",this.clientDetails);
        this.selectedClientName=this.clientDetails.firstName + ' ' + this.clientDetails.lastName
          log.debug("Selected Client Name",this.selectedClientName);  
      })
    }
    this.clientService.getClientById(this.insuredCode).subscribe(data=>{
      this.clientDetails = data;
      log.debug("Selected Client Details",this.clientDetails);
      if(this.passedNewClientDetails){
        this.selectedClientName=this.passedNewClientDetails?.inputClientName;
        log.debug("Selected New Client Name",this.selectedClientName);  

      }else{
        this.selectedClientName=this.clientDetails.firstName + ' ' + this.clientDetails.lastName
        log.debug("Selected Client Name",this.selectedClientName);  
      }
     
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
    const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
    sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);

    const passedClientDetailsString = JSON.stringify(this.clientDetails);
    sessionStorage.setItem('passedClientDetails', passedClientDetailsString);

    const passedNewClientDetailsString = JSON.stringify(this.passedNewClientDetails);
    sessionStorage.setItem('passedNewClientDetails', passedNewClientDetailsString);

    const passedIsAddRiskString = JSON.stringify(this.isAddRisk);
    sessionStorage.setItem('isAddRisk', passedIsAddRiskString);


   
    log.debug("isAddRisk:",this.isAddRisk)
    log.debug("quotation number:",this.quotationNo)
    log.debug("Quotation Details:",this.quotationDetails)
    log.debug("Selected Client Details",this.clientDetails);
    log.debug("Selected New Client Details",this.passedNewClientDetails);

    // this.router.navigate(['/home/gis/quotation/quick-quote'])
     // Use NgZone.run to execute the navigation code inside the Angular zone
     this.ngZone.run(() => {
      this.router.navigate(['/home/gis/quotation/quick-quote']);
    });
  }

  acceptQuote(){
    this.router.navigate(['/home/gis/quotation/quotations-client-details'])
  }

  cancelQuote(){
    this.router.navigate(['/home/gis/quotation/quick-quote']);

  }
}
