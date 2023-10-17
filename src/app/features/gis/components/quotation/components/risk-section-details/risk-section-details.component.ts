import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { Router } from '@angular/router';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import {Logger} from '../../../../../../shared/shared.module'
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { Binder, Binders, Products, Subclass, Subclasses, SubclassesDTO } from '../../../setups/data/gisDTO';
import { ProductService } from '../../../../../gis/services/product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { Calendar } from 'primeng/calendar';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
const log = new Logger('RiskSectionDetailsComponent');

@Component({
  selector: 'app-risk-section-details',
  templateUrl: './risk-section-details.component.html',
  styleUrls: ['./risk-section-details.component.css']
})
export class RiskSectionDetailsComponent {
  steps = quoteStepsData;

  insuredCode:any;
  clientList;any;
  client:any;
  clientName:any;
  selectedClientList:any;

  subClassList:Subclass[];
  subclassCoverType:any;
  filteredSubclass:Subclass[];
  selectedSubclass: any;

  formData: any;
  riskDetailsForm:FormGroup;

  selectProductCode:any;
  productList:Products;
  description:any;

  binderList:Binders[]=[];
  // binderListDetails:Binders[];
  selectedBinderList:any;

  selectedDates: Date[] = [];
  coverFromDate: Date;
  coverToDate: Date;

  clauseList:any;
  selectedClauseList:any;
  SubclauseList:any;
  selectedSubClauseList:any;
  selectedClauseCode:any;
  clauseDetail:any;
  selectedClauses:any


  constructor(
    private router: Router,
    public subclassService:SubclassesService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    private gisService: ProductService,
    public sharedService:SharedQuotationsService,
    public binderService:BinderService,
    public clientService:ClientService,
    public fb:FormBuilder,
    public cdr:ChangeDetectorRef,

   
  ){}
    public isCollapsibleOpen = false;
    public isOtherDetailsOpen = false;
    public isSectionDetailsOpen = false;
    public isThirdDetailsOpen = false;
 
    ngOnInit(): void {
      this.formData = this.sharedService.getQuotationFormDetails();
      log.debug(this.formData ,"Form Data")
      this.loadFormData();
      this.createRiskDetailsForm();

     
  }
 toggleSchedule() {
  this.isCollapsibleOpen = !this.isCollapsibleOpen;
}
toggleOtherDetails() {
  this.isOtherDetailsOpen = !this.isOtherDetailsOpen;
}
toggleSectionDetails() {
  this.isSectionDetailsOpen = !this.isSectionDetailsOpen;
}
toggleThirdDetails() {
  this.isThirdDetailsOpen = !this.isThirdDetailsOpen;
}


  
 /**
 * Fetches all subclass data from the subclass service,
 */
  // loadAllSubclass(){
  //   return this.subclassService.getAllSubclasses().subscribe(data=>{
  //     this.subClassList=data;
  //     log.debug(this.subClassList,"Subclass List")
  //     this.cdr.detectChanges();

  //   })
  // }

   /**
 * Retrieves product subclasses for a specific product.
 *
 * This method makes an HTTP request to the GIS service to fetch product subclasses and filters the results
 * to obtain subclasses associated with a particular product.
 *
 * @param productCode - The code of the product for which subclasses are to be retrieved. *
 * @returns void
 */
   getSubclasses() {
    this.gisService.getASubclasses().subscribe(data => {
      this.subClassList = data._embedded.product_subclass_dto_list
      this.filteredSubclass = this.subClassList.filter(prod => prod.product_code == this.selectProductCode)
      log.debug(this.filteredSubclass, 'Selected Product code Subclass')
      this.cdr.detectChanges();
    })
  }

  onSubclassSelected(event: any) {
    const selectedValue = event.target.value; // Get the selected value

    // Perform your action based on the selected value
    console.log(`Selected value: ${selectedValue}`);
    this.loadCovertypeBySubclassCode(selectedValue);
    this.loadAllBinders(selectedValue);
    this.loadSubclassClauses(selectedValue);
  }

    /**
   * Load cover types by subclass code
   * @param code {number} subclass code
   */
    loadCovertypeBySubclassCode(code: number) {
      this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
        this.subclassCoverType = data;
        log.debug(this.subclassCoverType,'filtered covertype')
        this.cdr.detectChanges();
      })
    }
  loadFormData(){
    log.debug(this.sharedService.getQuotationFormDetails(),"Form List")
    this.selectProductCode=this.formData.productCode;
    this.insuredCode=this.formData.clientCode;
    log.debug( this.selectProductCode,"Selected Product Code")
    this.getProductByCode();
    this.getSubclasses();
    this.getClient();
    
  }
  getClient(){
    this.clientService.getClients().subscribe(data=>{
      this.client = data
      this.clientList = this.client.content
      this.selectedClientList=this.clientList.filter(client=>client.id == this.insuredCode);
      this.clientName = this.selectedClientList[0].firstName + ' ' + this.selectedClientList[0].lastName;

      log.debug( this.selectedClientList,"Client HP Details")
      log.debug( this.clientName,"Client NAME")

    })
  }

  getProductByCode(){
    this.gisService.getProductDetailsByCode(this.selectProductCode).subscribe(res=>{
      this.productList = res;
      this.description=this.productList.description;
      log.debug(this.description,'Description');
    })
  }

  
  createRiskDetailsForm(){
    this.riskDetailsForm=this.fb.group({
      binderCode: [''],
      coverTypeCode: [''],
      coverTypeShortDescription: [''],
      dateWithEffectFrom: [''],
      dateWithEffectTo: [''],
      insuredCode: [''],
      isNoClaimDiscountApplicable:[''],
      itemDescription: ['', Validators.required],
      location: [''],
      noClaimDiscountLevel: [''],
      productCode: [''],
      propertyId:[''],
      riskPremAmount: [''],
      schedules: [''],
      subClassCode: [''],
      town: ['']
  });
  }
  get f() {
    return this.riskDetailsForm.controls;
  }
   /**
 * Loads and updates the list of binders for a specific subclass.
 * Retrieves binder data via an HTTP request, updates 'binderList' and 'binderListDetails,'
 * and filters 'selectedBinderList' to include only binders matching the provided subclass code.
 *
 * @param code - The subclass code for which binders are loaded.
 */
   loadAllBinders(code:any){
    this.binderService.getAllBindersQuotation().subscribe(data=>{
      this.binderList=data._embedded.binder_dto_list;
      this.selectedBinderList=this.binderList.filter(binder=>binder.sub_class_code == code);

     log.debug('Filtered Binder', this.selectedBinderList)
      this.cdr.detectChanges();

    })
  }
  
  getSelectedDates() {
    if (this.selectedDates.length === 2) {
      this.coverFromDate = this.selectedDates[0];
      this.coverToDate = this.selectedDates[1];
    } else {
      this.coverFromDate = null;
      this.coverToDate = null;
    }
  }
  loadSubclassClauses(code:any){
    this.subclassService.getSubclassClauses().subscribe(data =>{
      this.SubclauseList=data;
      this.selectedSubClauseList=this.SubclauseList.filter(clause=>clause.subClassCode == code);
      this.selectedClauseCode=this.selectedSubClauseList[0].clauseCode;


      log.debug('ClauseList',this.selectedSubClauseList)
      log.debug('ClauseCode',this.selectedClauseCode)
      this.loadAllClauses();
    })
  }
  // onSubClauseSelected(event: any) {
  //   const selectedValue = event.target.value; // Get the selected value

  //   // Perform your action based on the selected value
  //   console.log(`Selected value: ${selectedValue}`);
   
  // }

  loadAllClauses(){
    this.subclassService.getAllClauses().subscribe(data =>{
      this.clauseList=data._embedded.clause_dto_list;
      this.selectedClauseList=this.clauseList.filter(clausesub=>clausesub.code == this.selectedClauseCode);
      log.debug('ClauseSelectdList',this.selectedClauseList)
    })
  }
 backLink(){
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }


  
}
