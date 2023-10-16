import { Component } from '@angular/core';
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
@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent {
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
    public quotationService:QuotationsService
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
    this.quotationForm.controls['clientType'].setValue(this.formData.clientTypeId);
  }

  getbranch(){
    this.branchService.getBranches(2).subscribe(data=>{
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
  getProduct(){
    this.productService.getAllProducts().subscribe(data=>{
      this.products = data
    })
  }
  getuser(){
   this.user = this.authService.getCurrentUserName()
    console.log(this.user)
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
      introducerCode:['']

    })
  }

  saveQuotationDetails(){
  
    
    
    // console.log(this.quotationForm.value)
    // this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    //   console.log(data)
    // })
    // if(this.quotationForm.value.multiUser = 'Y'){
    //   this.router.navigate(['/home/gis/quotation/quote-assigning'])
    // }
    // else{
    //   console.log('No')
    // }
    this.sharedService.setQuotationFormDetails(this.quotationForm.value);
  
  }

  multiUser(){
    console.log('Yes')
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



}
