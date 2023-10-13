import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { CountryDto } from '../../../../../../shared/data/common/countryDto';
import { StateDto } from '../../../../../../shared/data/common/countryDto';
import { TownDto } from '../../../../../../shared/data/common/countryDto';
import { BankDTO } from '../../../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../../../shared/services/setups/bank/bank.service';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { CurrencyDTO } from '../../../../../../shared/data/common/bank-dto';
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
@Component({
  selector: 'app-quotations-client-details',
  templateUrl: './quotations-client-details.component.html',
  styleUrls: ['./quotations-client-details.component.css']
})
export class QuotationsClientDetailsComponent {
  steps = quoteStepsData;
  clientType:any;
  identifierType:any;
  country:CountryDto[];
  county:StateDto[];
  town:TownDto[];
  bank:BankDTO[];
  branch:OrganizationBranchDto[];
  currency:CurrencyDTO[];
  selected:any;
  client:any;
  clientList:any;
  clientDetails:ClientDTO;
  clientForm:FormGroup;
  textColor: string = 'black';
    constructor(
    public clientService:ClientService,
    public countryService:CountryService,
    public bankService:BankService,
    public branchService:BranchService,
    public currencyService:CurrencyService,
    public fb: FormBuilder,
    private router: Router,
    public sharedService: SharedQuotationsService
  ){}

  
  ngOnInit(): void {
    this.getClientType();
    this.getIdentifierType();
    this.getCountry();
    this.getbranch();   
    this.getCurrency();
    this.getClient();
    this.createForm();  
  }
  changeColor() {
    // Change the color to a specific value, e.g., red
    this.textColor = 'red';
  }
  getClientType(){
    this.clientService.getClientType(2).subscribe(data =>{
      this.clientType = data
      
    })
  }
  getIdentifierType(){
    this.clientService.getIdentityType().subscribe(data =>{
      this.identifierType = data
    })
  }
  getCountry(){
    this.countryService.getCountries().subscribe(data=>{
      this.country = data
    })
  }
  getCounty(event){
    this.selected = event.target.value
    this.countryService.getMainCityStatesByCountry(this.selected).subscribe(data=>{
      this.county = data;
    })
  }
  getTown(event){
    this.selected = event.target.value
    this.countryService.getTownsByMainCityState(this.selected).subscribe(data=>{
      this.town = data; 

    })
  }
  getBank(event){
    this.selected = event.target.value
    this.bankService.getBanks(this.selected).subscribe(data=>{
      this.bank = data
    })
  }
  getbranch(){
    this.branchService.getBranches(2).subscribe(data=>{
      this.branch = data
    })
  }
  getCurrency(){
    this.currencyService.getAllCurrencies().subscribe(data=>{
      this.currency = data
    })
  }

  getClient(){
    this.clientService.getClients().subscribe(data=>{
      this.client = data
      this.clientList = this.client.content
    })
  }
  getClientDetails(id){
    this.clientService.getClientById(id).subscribe(data=>{
      this.clientDetails = data;
      console.log(this.clientDetails)
      this.clientForm.patchValue(this.clientDetails)
      
    })
  }


  createForm(){
    this.clientForm = this.fb.group({
      
      accountId: [''],
      branchCode: [''],
      category: [''],
      clientTitle: [''],
      clientTitleId: [''],
      clientTypeId: [''],
      country: [''],
      createdBy: [''],
      dateOfBirth: [''],
      emailAddress: [''],
      firstName: [''],
      gender: [''],
      id: [''],
      idNumber: [''],
      lastName: [''],
      modeOfIdentity: [''],
      occupationId: [''],
      passportNumber: [''],
      phoneNumber: [''],
      physicalAddress: [''],
      pinNumber: [''],
      shortDescription: [''],
      status: [''],
      withEffectFromDate: ['']
    })
  }

  saveDetails(){
    
    this.sharedService.setFormData(this.clientForm.value);
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }


}
