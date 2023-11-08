import { Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { CurrencyDTO } from 'src/app/shared/data/common/bank-dto';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { ClauseService } from 'src/app/features/gis/services/clause/clause.service';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IntermediaryService } from 'src/app/features/entities/services/intermediary/intermediary.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { Modal } from 'bootstrap';
import { introducersDTO } from '../../data/introducersDTO';
import { Logger } from 'src/app/shared/services/logger/logger.service';
import { AccountContact } from 'src/app/shared/data/account-contact';
import { ClientAccountContact } from 'src/app/shared/data/client-account-contact';
import { WebAdmin } from 'src/app/shared/data/web-admin';
import { ProductSubclassService } from '../../../setups/services/product-subclass/product-subclass.service';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

const log = new Logger('QuotationSummaryComponent');
@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent {
  @ViewChild(Table) private dataTable: Table;
  steps = quoteStepsData;
  branch:OrganizationBranchDto[];
  currency:CurrencyDTO[]
  clauses:any;
  products:any;
  user:any;
  formData: any;
  quotationForm:FormGroup;
  agents:any
  agentDetails:any
  quotationsList:any;
  quotation:any
  quotationNo:any;
  quotationCode:any;
  isChecked: boolean = false;
  show:boolean=true;
  showProduct:boolean=true;
  quotationNum:string;
  introducers:any;
  productSubclassList:any
  productDetails:any
  userDetails: AccountContact | ClientAccountContact | WebAdmin;
  constructor(
    public bankService:BankService,
    public branchService:BranchService,
    public clauseService:ClauseService,
    public productService:ProductService,
    public authService:AuthService,
    public sharedService:SharedQuotationsService,
    public fb:FormBuilder,
    private router: Router,
    public  agentService:IntermediaryService,
    public  quotationService:QuotationsService,
    public  productSubclass:ProductSubclassService,   
    private globalMessagingService: GlobalMessagingService,

  ){}

  ngOnInit(): void {
    this.getbranch();
    this.getCurrency();
    this.getProductClauses();
    this.getProduct();
    this.getuser();
    this.formData = this.sharedService.getFormData();
    this.createQuotationForm();
    this.getAgents()
    this.quotationForm.controls['clientCode'].setValue(this.formData.id);
    this.quotationForm.controls['branchCode'].setValue(this.formData.branchCode);
    this.quotationForm.controls['clientType'].setValue(this.formData.clientTypeId);
    this.getIntroducers();
  }

  getbranch(){
    this.branchService.getBranch().subscribe(data=>{
      this.branch = data
    })
  }
  getCurrency(){  
    this.bankService.getCurrencies().subscribe(data=>{
      this.currency = data
    })
  }
  
  getProductClauses(){
    

    this.clauseService.getClauses().subscribe(data=>{
      const clauseList = data
      this.clauses = clauseList._embedded.clause_dto_list.slice(0,10)
    
    })

  }

  getProductClause(code){
    this.productService.getProductByCode(code).subscribe(res=>{
      this.productDetails = res
     
    })
  }
  getProduct(){
    this.productService.getAllProducts().subscribe(res=>{
      const ProdList = res
      this.products = ProdList
     
      this.products.forEach(element => {
        this.productService.getASubclasses().subscribe(data=>{
          const Product = data
          this.productSubclassList = Product._embedded.product_subclass_dto_list
          
          this.productSubclassList.forEach(el => {
            if(el.product_code == element.code){
              
            }
            
          });
       
          
        })
        
      });
     
    })
  
  }
  getuser(){
   this.user = this.authService.getCurrentUserName()
   
  }

  createQuotationForm(){
    this.quotationForm = this.fb.group({
      actionType: [''],
      addEdit: [''],
      agentCode: [''],
      agentShortDescription: [''],
      bdivCode: [''],
      bindCode: [''],
      branchCode: [''],
      clientCode: [''],
      clientType: [''],
      coinLeaderCombined: [''],
      consCode: [''],
      currencyCode: [''],
      currencySymbol: [''],
      fequencyOfPayment: [''],
      isBinderPolicy: [''],
      paymentMode: [''],
      proInterfaceType: [''],
      productCode: [''],
      source: [''],
      withEffectiveFromDate: [''],
      withEffectiveToDate: [''],
      multiUser:[''],
      comments:[''],
      internalComments:[''],
      introducerCode:[''],
      dateRange:[''],
      RFQDate:[''],
      expiryDate:['']
    })
  }


  
  saveQuotationDetails(){
    this.sharedService.setQuotationFormDetails(this.quotationForm.value);
    
    if(this.quotationForm.value.multiUser == 'Y'){
    this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    this.quotationNo = data;
    console.log(this.quotationNo,"Quotation results:")    
    this.router.navigate(['/home/gis/quotation/quote-assigning'])
    })
    
    }else{
    if (this.isChecked) {
    this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    this.quotationNo = data
    console.log(this.quotationNo)
    this.router.navigate(['/home/gis/quotation/import-risks'])
    })
    
    } else {
    this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    this.quotationNo = data;
    console.log(this.quotationNo,'quotation number output');
    this.quotationCode=this.quotationNo._embedded[0].quotationCode;
    this.quotationNum = this.quotationNo._embedded[0].quotationNumber
    this.sharedService.setQuotationDetails(this.quotationNum,this.quotationCode);

    this.router.navigate(['/home/gis/quotation/risk-section-details']);
    })
    
    } 
  }  
}

  getAgents(){
    this.agentService.getAgents().subscribe(data=>{
      this.agents = data.content
     
    })
  }
  agentShortDesc(id){
    this.agentService.getAgentById(id).subscribe(data=>{
      this.agentDetails = data
      this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);
     
    })
    
  }

  getExistingQuotations(){
    const clientId = this.quotationForm.value.clientCode
    const fromDate = this.quotationForm.value.withEffectiveFromDate
    const fromTo = this.quotationForm.value.withEffectiveToDate
    this.quotationService.getQuotations(clientId,fromDate,fromTo).subscribe(data=>{
      this.quotationsList = data
      this.quotation = this.quotationsList.content

      if(this.quotation.length > 0){
        const element = document.getElementById('exampleModal') as HTMLElement;
        const myModal = new Modal(element);
        myModal.show();
      }else{
        this.saveQuotationDetails()
      }
     
    })

    
  }
  getIntroducers(){
    this.quotationService.getIntroducers().subscribe(res=>{
      this.introducers = res
    })
  }

  getProductSubclass(){
  }
 
  editRow(details,code){
    this.clauseService.updateClause(details,code).subscribe(res=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated' );
      },(error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
       
      }
    )
  }
updateCoverToDate(e) {
    
    const coverFromDate= e.target.value
    if (coverFromDate) {
      const selectedDate = new Date(coverFromDate);
      selectedDate.setFullYear(selectedDate.getFullYear() + 1);
      const coverToDate = selectedDate.toISOString().split('T')[0];
      this.quotationForm.controls['withEffectiveToDate'].setValue(coverToDate);

     
    } 
  }

updateQuotationExpiryDate(e){
  const RFQDate = e.target.value
  if (RFQDate) {
    const selectedDate = new Date(RFQDate);
    selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    const expiryDate = selectedDate.toISOString().split('T')[0];
    this.quotationForm.controls['expiryDate'].setValue(expiryDate);

    log.debug(expiryDate)
  } 
}
}
