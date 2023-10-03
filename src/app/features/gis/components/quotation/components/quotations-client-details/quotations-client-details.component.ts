import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { StateDto } from 'src/app/shared/data/common/countryDto';
import { TownDto } from 'src/app/shared/data/common/countryDto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { CurrencyDTO } from 'src/app/shared/data/common/bank-dto';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
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
  constructor(
    public clientService:ClientService,
    public countryService:CountryService,
    public bankService:BankService,
    public branchService:BranchService,
    public currencyService:CurrencyService
  ){}

  
  ngOnInit(): void {
    this.getClientType();
    this.getIdentifierType();
    this.getCountry();
    this.getbranch();   
    this.getCurrency();
    this.getClient();
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
    })
  }

}
