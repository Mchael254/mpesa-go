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
  constructor(
    public bankService:BankService,
    public branchService:BranchService,
    public clauseService:ClauseService,
    public productService:ProductService,
    public authService:AuthService,
    public sharedService:SharedQuotationsService,
    public fb:FormBuilder

  ){}

  ngOnInit(): void {
    this.getbranch();
    this.getCurrency();
    this.getProductClauses();
    this.getProduct();
    this.getuser();
    this.formData = this.sharedService.getFormData();
    this.createQuotationForm();
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
      withEffectiveToDate: ['']
    })
  }

  saveQuotationDetails(){
    this.sharedService.setQuotationFormDetails(this.quotationForm.value);
  
  }

}
