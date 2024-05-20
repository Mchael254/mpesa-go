import { Component, ViewChild } from '@angular/core';
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
import { Table } from 'primeng/table';
import {untilDestroyed} from "../../../../../../shared/services/until-destroyed";
import { OccupationService } from '../../../../../../shared/services/setups/occupation/occupation.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OccupationDTO } from '../../../../../../shared/data/common/occupation-dto';
import { SectorDTO } from '../../../../../../shared/data/common/sector-dto';
import { SectorService } from '../../../../../../shared/services/setups/sector/sector.service';
import { Logger } from '../../../../../../shared/services';
const log =  new Logger("QuotationClientDetailsComponent")
@Component({
  selector: 'app-quotations-client-details',
  templateUrl: './quotations-client-details.component.html',
  styleUrls: ['./quotations-client-details.component.css']
})
export class QuotationsClientDetailsComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  steps = quoteStepsData;
  clientType:any;
  identifierType:any;
  country:CountryDto[];
  county:StateDto[];
  town:TownDto[];
  bank:BankDTO[];
  sectorData: SectorDTO[];
  branch:OrganizationBranchDto[];
  occupationData: OccupationDTO[];
  currency:CurrencyDTO[];
  selected:any;
  client:any;
  clientList:any;
  clientDetails:ClientDTO;
  clientForm:FormGroup;
  textColor: string = 'black';
  clientTypeName: string
  selectedClient:any
  uploadFile:any;
  @ViewChild('dt1') dt1: Table | undefined;

    constructor(
    public clientService:ClientService,
    public countryService:CountryService,
    public bankService:BankService,
    public branchService:BranchService,
    public currencyService:CurrencyService,
    public fb: FormBuilder,
    private router: Router,
    public sharedService: SharedQuotationsService,
    private occupationService: OccupationService,
    private sectorService: SectorService,
  ){}

  
  ngOnInit(): void {
    this.getClientType();
    this.getIdentifierType();
    this.getCountry();
    this.getbranch();   
    this.getCurrency();
    this.getClient();
    this.createForm();    
    this.quickClientDetails();
    this.getOccupation(2);
    this.getSectors(2);
    const storedData = sessionStorage.getItem('clientFormData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.clientForm.setValue(parsedData);
      
    }
  }
  quickClientDetails(){
    const storedClientCode = sessionStorage.getItem('clientCode');

    if(storedClientCode){
      this.getClientDetails(storedClientCode)
    }
  }
  /**
   * Retrieves client type data from the client service.
   * @method getClientType
   * @return {void}
   */
  getClientType(){
    this.clientService.getClientType(2).subscribe(data =>{
      this.clientType = data
      
    })
  }
  /**
   * Retrieves identifier type data from the client service.
   * @method getIdentifierType
   * @return {void}
   */
  getIdentifierType(){
    this.clientService.getIdentityType().subscribe(data =>{
      this.identifierType = data
    })
  }
   /**
   * Retrieves country data from the country service.
   * @method getCountry
   * @return {void}
   */
  getCountry(){
    this.countryService.getCountries().subscribe(data=>{
      this.country = data
    })
  }
    /**
 * Fetches sectors data for the specified organization and updates the component's sectorData property.
 * @param organizationId - The ID of the organization for which sectors are being fetched.
 */
    getSectors(organizationId: number) {
      this.sectorService.getSectors(organizationId)
        .pipe(
          untilDestroyed(this)
        )
        .subscribe(
          (data) => {
            log.info("Testing data->", data)
            this.sectorData = data;
          },
        );
    }
    /**
 * Fetches occupation data based on the provided organization ID and
 *  updates the component's occupationData property.
 * @param organizationId The organization ID used to retrieve occupation data.
 */
    getOccupation(organizationId: number) {
      this.occupationService.getOccupations(organizationId)
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(
          (data) => {
            this.occupationData = data;
            console.log(this.occupationData)
          },
        );
    }
   /**
   * Updates the county based on the selected country from the dropdown.
   * @method getCounty
   * @param {any} event - The event containing the selected country information.
   * @return {void}
   */
  getCounty(event){
    this.selected = event.target.value
    this.countryService.getMainCityStatesByCountry(this.selected).subscribe(data=>{
      this.county = data;
    })
  }
   /**
   * Updates the town based on the selected main city state from the dropdown.
   * @method getTown
   * @param {any} event - The event containing the selected main city state information.
   * @return {void}
   */
  getTown(event){
    this.selected = event.target.value
    this.countryService.getTownsByMainCityState(this.selected).subscribe(data=>{
      this.town = data; 

    })
  }
   /**
   * Updates the bank based on the selected country from the dropdown.
   * @method getBank
   * @param {any} event - The event containing the selected country information.
   * @return {void}
   */
  getBank(event){
    this.selected = event.target.value
    this.bankService.getBanks(this.selected).subscribe(data=>{
      this.bank = data
    })
  }

  /**
   * Retrieves and updates the list of branches.
   * @method getBranch
   * @return {void}
   */
  getbranch(){
    this.branchService.getBranches(2).subscribe(data=>{
      this.branch = data
    })
  }
   /**
   * Retrieves and updates the list of currencies.
   * @method getCurrency
   * @return {void}
   */
  getCurrency(){
    this.currencyService.getAllCurrencies().subscribe(data=>{
      this.currency = data
    })
  }
   /**
   * Retrieves clients and populates the client list.
   * @method getClient
   * @return {void}
   */

  getClient(){
    this.clientService.getClients().subscribe(data=>{
      this.client = data
      this.clientList = this.client.content
      console.log(this.clientList)
    })
  }
   /**
   * Retrieves client details by ID and updates the component's state accordingly.
   * @method getClientDetails
   * @param {number} id - The ID of the client for which to retrieve details.
   * @return {void}
   */
  getClientDetails(id){
    this.clientService.getClientById(id).subscribe(data=>{
      this.clientDetails = data;
      console.log(this.clientDetails)
      this.clientTypeName = this.clientDetails.clientType.clientTypeName
      if(this.clientTypeName = 'INDIVIDUAL'){
        this.clientForm.controls['clientTypeId'].setValue('I')
        
      }else{
        this.clientForm.controls['clientTypeId'].setValue('C')
      }
      this.clientForm.patchValue(this.clientDetails)
      
    })
  }
   /**
   * Applies a global filter to the DataTable.
   * @method applyFilterGlobal
   * @param {Event} $event - The event triggering the filter application.
   * @param {string} stringVal - The string value representing the filter criteria.
   * @return {void}
   */
  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
 /**
   * Constructs the client form using Angular FormBuilder.
   * @method createForm
   * @return {void}
   */
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

   /**
   * Saves client form details to session storage and navigates to the next page.
   * @method saveDetails
   * @return {void}
   */
   saveDetails(): void {
    // Save form data to session storage
    sessionStorage.setItem('clientFormData', JSON.stringify(this.clientForm.value));

    // Set form data in shared service for cross-component communication
    this.sharedService.setFormData(this.clientForm.value);

    // Navigate to the next page
    this.router.navigate(['/home/gis/quotation/quotation-details']);
  }


}
