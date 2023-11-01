import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { Router } from '@angular/router';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import {Logger} from '../../../../../../shared/shared.module'
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { Binder, Binders, Clause, Clauses, Products, Subclass, Subclasses, SubclassesDTO, subclassClauses, subclassSection } from '../../../setups/data/gisDTO';
import { ProductService } from '../../../../../gis/services/product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { Calendar } from 'primeng/calendar';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { riskSection } from '../../data/quotationsDTO';
import { MessageService } from 'primeng/api';
import { SectionsService } from '../../../setups/services/sections/sections.service';
const log = new Logger('RiskSectionDetailsComponent');

@Component({
  selector: 'app-risk-section-details',
  templateUrl: './risk-section-details.component.html',
  styleUrls: ['./risk-section-details.component.css']
})
export class RiskSectionDetailsComponent {
  steps = quoteStepsData;

  quotationCode:any
  quotationRiskCode:any;
  quotationRiskData:any;

  riskCode:any;

  town:any;
  insuredCode:any;
  clientList:ClientDTO[];
  client:ClientDTO[];
  clientName:any;
  selectedClientList:ClientDTO[];

  subClassList:Subclass[];
  subclassCoverType:any;
  coverTypeCode:any;
  filteredSubclass:Subclass[];
  selectedSubclass: any;
  selectedSubclassCode:any

  formData: any;
  clientFormData:any;
  riskDetailsForm:FormGroup;

  selectProductCode:any;
  productList:Products;
  description:any;

  binderList:Binders[]=[];
  // binderListDetails:Binders[];
  selectedBinderList:Binders[];
  selectedBinderCode:any;

  selectedDates: Date[]=[];
  rangeDates: Date[]=[];
  // coverFromDate: Date;
  // coverToDate: Date;

  clauseList:Clause[];
  selectedClauseList:Clause[];
  SubclauseList:subclassClauses[];
  selectedSubClauseList:subclassClauses[];
  selectedClauseCode:any;
  // clauseDetail:any;
  selectedClauses:any

  riskSectionList:riskSection[];
  sectionList:subclassSection[];
  selectedSectionList:subclassSection[];
  sectionDetailsForm:FormGroup;

  quotationDetails:any

  checkedSectionCode:any;
  checkedSectionDesc:any;
  checkedSectionType:any;
  sectionArray:any;
  selectedSection:any;
  constructor(
    private router: Router,
    private messageService:MessageService,
    public subclassService:SubclassesService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    private gisService: ProductService,
    public sharedService:SharedQuotationsService,
    public binderService:BinderService,
    public clientService:ClientService,
    public quotationService:QuotationsService,
    public sectionService:SectionsService,

    public fb:FormBuilder,
    public cdr:ChangeDetectorRef,

   
  ){}
    public isCollapsibleOpen = false;
    public isOtherDetailsOpen = false;
    public isSectionDetailsOpen = false;
    public isThirdDetailsOpen = false;
 
    ngOnInit(): void {
      this.formData = this.sharedService.getQuotationFormDetails();
      this.clientFormData=this.sharedService.getFormData();
      this.quotationCode=this.sharedService.getQuotationCode();

      log.debug(this.quotationCode ,"RISK DETAILS Screen Quotation No:")
      log.debug(this.formData ,"Form Data")
      log.debug(this.clientFormData ,"CLIENT Form Data")


      log.debug(this.formData ,"Form Data")
    
      this.loadFormData();
      this.createRiskDetailsForm();
      this.createSectionDetailsForm();     
  }
  /** 
 * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
 * state of a Schedule section. 
 */
  toggleSchedule() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
   /** 
 * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
 * state of a Other Details section. 
 */
  toggleOtherDetails() {
    this.isOtherDetailsOpen = !this.isOtherDetailsOpen;
  }
   /** 
 * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
 * state of a Section. 
 */
  toggleSectionDetails() {
    this.isSectionDetailsOpen = !this.isSectionDetailsOpen;
  }
   /** 
 * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
 * state of a Third section. 
 */
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
 /** 
 * Handles subclass selection.
 * Updates the selected subclass code, logs the selection, and loads related data.
 * It loads cover types, binders, and subclass clauses based on the selected value.
 */
  onSubclassSelected(event: any) {
    const selectedValue = event.target.value; // Get the selected value
    this.selectedSubclassCode=selectedValue;
    // Perform your action based on the selected value
    console.log(`Selected value: ${selectedValue}`);
    log.debug(this.selectedSubclassCode,'Sekected Subclass Code')

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
        this.coverTypeCode=this.subclassCoverType[0].coverTypeCode;
        log.debug(this.subclassCoverType,'filtered covertype');
        log.debug(this.coverTypeCode,'filtered covertype code');

        this.cdr.detectChanges();
      })
    }
    /** 
 * Loads form data from a shared quotation service.
 * Retrieves and assigns various form-related details and initiates related data requests.
 */
  loadFormData(){
    log.debug(this.sharedService.getQuotationFormDetails(),"Form List")
    this.selectProductCode=this.formData.productCode;
    this.insuredCode=this.formData.clientCode;
    this.town=this.formData.clientCode
    log.debug( this.selectProductCode,"Selected Product Code")
    this.getProductByCode();
    this.getSubclasses();
    this.getClient();
    
  }
  /**
 * Fetches client data and updates properties.
 * Retrieves client details via an HTTP request and updates properties
 * such as 'clientList' and 'clientName' for quotation generation.
 */
  getClient(){
    this.clientService.getClients().subscribe(data=>{
      this.clientList = data.content
      // this.clientList = this.client.content
      this.selectedClientList=this.clientList.filter(client=>client.id == this.insuredCode);
      this.clientName = this.selectedClientList[0].firstName + ' ' + this.selectedClientList[0].lastName;

      log.debug( this.selectedClientList,"Client HP Details")
      log.debug( this.clientName,"Client NAME")

    })
  }

  /**
 * Fetches product details by code.
 * Retrieves product details by sending an HTTP request with 'selectProductCode'.
 * Updates properties, including 'productList' and 'description'.
 */
  getProductByCode(){
    this.gisService.getProductDetailsByCode(this.selectProductCode).subscribe(res=>{
      this.productList = res;
      this.description=this.productList.description;
      log.debug(this.description,'Description');
    })
  }

  /**
 * Creates and initializes a risk details form.
 * It defines form controls for various risk-related fields,
 *  setting initial values and validation rules.
 */
  createRiskDetailsForm(){
    this.riskDetailsForm=this.fb.group({
      binderCode: ['', Validators.required],
      coverTypeCode: ['', Validators.required],
      coverTypeShortDescription: [''],
      dateWithEffectFrom: [''],
      dateWithEffectTo: [''],
      dateRange:[''],
      insuredCode: [''],
      isNoClaimDiscountApplicable:[''],
      itemDescription: ['', Validators.required],
      location: [''],
      noClaimDiscountLevel: [''],
      productCode: [''],
      propertyId:[''],
      riskPremAmount: [''],
      subClassCode: ['', Validators.required],
      town: [''],
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
      this.selectedBinderCode=this.selectedBinderList[0].code;
     log.debug('Filtered Binder', this.selectedBinderList);
     log.debug('Filtered Binder code', this.selectedBinderCode);

      this.cdr.detectChanges();

    })
  }
  
  // getSelectedDates() {
  //   if (this.selectedDates.length === 2) {
  //     this.coverFromDate = this.selectedDates[0];
  //     this.coverToDate = this.selectedDates[1];
  //   } else {
  //     this.coverFromDate = null;
  //     this.coverToDate = null;
  //   }
  // }

  /**
 * Retrieves subclass clauses and updates related properties.
 * Sends an HTTP request to fetch subclass clauses, filters them based on a provided 'code',
 * and updates properties like 'selectedSubClauseList' and 'selectedClauseCode'.
 * Also initiates the 'loadAllClauses()' method.
 */
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

  /**
 * Loads all available clauses and updates related properties.
 * Retrieves all available clauses through an HTTP request, filters them based on the
 * 'selectedClauseCode', and updates 'clauseList' and 'selectedClauseList'.
 */
  loadAllClauses(){
    this.subclassService.getAllClauses().subscribe(data =>{
      this.clauseList=data._embedded.clause_dto_list
      this.selectedClauseList=this.clauseList.filter(clausesub=>clausesub.code == this.selectedClauseCode);
      log.debug('ClauseSelectdList',this.selectedClauseList)
    })
  }
  /**
 * Navigates back to the quotation details page.
 * Uses the Angular Router to navigate to the 'quotation-details' page within the 'gis' module
 * when called, effectively returning to the previous page.
 */
  backLink(){
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }

  /**
 * Creates a new risk detail for a quotation.
 * Takes the data from the 'riskDetailsForm', processes it, and sends it to the server
 * to create a new risk detail associated with the current quotation. It then handles
 * the response data and displays a success or error message.
 * Additionally, it initiates the 'loadRiskSections()' method to update risk sections.

 */
  createRiskDetail(){
    const risk = this.riskDetailsForm.value;
    const dateWithEffectFromC=risk.dateRange[0];
    const dateWithEffectToC=risk.dateRange[1];

    risk.binderCode=this.selectedBinderCode;
    risk.coverTypeCode=this.coverTypeCode;
    risk.insuredCode=this.insuredCode;
    risk.productCode=this.selectProductCode;
    risk.dateWithEffectFrom=dateWithEffectFromC;
    risk.dateWithEffectTo=dateWithEffectToC;
    // risk.subClassCode=this.selectedSubclassCode;
    delete risk.dateRange;
    const riskArray = [risk];
    // const propertyIdValue = this.riskDetailsForm.get('propertyId').value;

    this.quotationService.createQuotationRisk(this.quotationCode,riskArray).subscribe(data =>{
      this.quotationRiskData=data;

      // this.quotationRiskCode = this.quotationRiskData._embedded[0]; 
      // this.quotationRiskCode.forEach(([key, value]) => {
      //   console.log(`${key}: ${value}`);
      // });
      const quotationRiskCode = this.quotationRiskData._embedded[0];
      if (quotationRiskCode) {
        for (const key in quotationRiskCode) {
          if (quotationRiskCode.hasOwnProperty(key)) {
            const value = quotationRiskCode[key];
            console.log(`${value}`);
            this.riskCode=value;
              }
        }
      } else {
        console.log("The quotationRiskCode object is not defined.");
      }
      
      log.debug( this.quotationRiskData,"Quotation Risk Code Data");
      log.debug( this.quotationRiskCode,"Quotation Risk Code ");
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Risk Created' });
        this.riskDetailsForm.reset()
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        this.riskDetailsForm.reset()
      }
      this.loadRiskSections();
      this.loadRiskSubclassSection();


    })

  }

  /**
 * Loads and updates risk sections for the created risk.
 * Retrieves risk sections by sending an HTTP request with the 'riskCode' and updates
 * the 'riskSectionList' property, which likely represents sections associated with the risk.
 */
  loadRiskSections(){
    this.quotationService.getRiskSection(this.riskCode,).subscribe(data =>{
      this.riskSectionList=data;
      log.debug("Section List", this.riskSectionList)
    })
  }
  loadRiskSubclassSection(){
    this.sectionService.getSubclassSections(this.selectedSubclassCode).subscribe(data =>{
      this.sectionList=data;
      this.selectedSectionList=this.sectionList.filter(section=>section.subclassCode == this.selectedSubclassCode);

      log.debug("Filtered Section List", this.selectedSectionList)

    })
  }
  /**
 * Creates and initializes a section details form.
 * Utilizes the 'FormBuilder'to create a form group ('sectionDetailsForm').
 * Defines form controls for various section-related fields, setting initial values as needed.
 */
  createSectionDetailsForm(){
    this.sectionDetailsForm=this.fb.group({
      calcGroup: [''],
      code: [''],
      compute: [''],
      description: [''],
      freeLimit: [''],
      limitAmount: [''],
      multiplierDivisionFactor: [''],
      multiplierRate: [''],
      premiumAmount: [''],
      premiumRate: [''],
      quotRiskCode: [''],
      rateDivisionFactor: [''],
      rateType: [''],
      rowNumber: [''],
      sectionCode: [''],
      sectionShortDescription: [''],
      sectionType: [''],
      sumInsuredLimitType: [''],
      sumInsuredRate: ['']
  });
  }
  
  onCheckboxChange(section: subclassSection) {

    log.debug("Checked Section Data",section)
    this.checkedSectionCode=section.sectionCode;
    this.checkedSectionDesc=section.sectionShortDescription;
    this.checkedSectionType=section.sectionType;

  }
  
  
  /**
 * Creates a new risk section associated with the current risk.
 * Takes section data from the 'sectionDetailsForm', sends it to the server
 * to create a new risk section associated with the current risk, and handles
 * the response data by displaying a success or error message.
 */
  createRiskSection(){
    const section = this.sectionDetailsForm.value;
    this.sectionArray = [section];
    section.calcGroup = 1;
    section.code = null;
    section.compute = null;
    section.description = null;
    section.freeLimit = 0;
    section.limitAmount = 0;
    section.multiplierDivisionFactor = 0;
    section.multiplierRate = 0;
    section.premiumAmount = 0;
    section.premiumRate = 0;
    section.rateDivisionFactor = 0;
    section.rateType = null;
    section.rowNumber = 0;
    section.sumInsuredLimitType = null;
    section.sumInsuredRate = 0;

    section.sectionCode=this.checkedSectionCode;
    section.sectionShortDescription=this.checkedSectionDesc;
    section.sectionType=this.checkedSectionType;

    log.debug("Section Form Array",this.sectionArray)
    this.quotationService.createRiskSection(this.riskCode,this.sectionArray).subscribe(data =>{
      
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset()
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        this.sectionDetailsForm.reset()
      }
    })
  }
  onSelectSection(event: any){
    this.selectedSection=event;
    this.sectionDetailsForm.patchValue( this.selectedSection)
  }
  updateRiskSection(){
    const section = this.sectionDetailsForm.value;
    this.sectionArray = [section];

    this.quotationService.updateRiskSection(this.riskCode,this.sectionArray).subscribe((data)=>{
      try{
        this.sectionDetailsForm.reset()
        log.info(section)
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Section Updated'});
      }catch(error){
        log.info(section)
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        this.sectionDetailsForm.reset()
      }  
    })
  }

  finish(){
    this.router.navigate(['/home/gis/quotation/quotation-summary'])
  }
  
}
