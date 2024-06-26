import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { Router } from '@angular/router';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import {Logger, untilDestroyed} from '../../../../../../shared/shared.module'
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { Binder, Binders, Clause, Clauses, Products, Subclass, Subclasses, SubclassesDTO, riskClauses, subclassClauses, subclassSection, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { ProductService } from '../../../../../gis/services/product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { Calendar } from 'primeng/calendar';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { riskSection } from '../../data/quotationsDTO';
import { MessageService } from 'primeng/api';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import {ClientDTO} from "../../../../../entities/data/ClientDTO";
import {ClientService} from "../../../../../entities/services/client/client.service";
import { forkJoin } from 'rxjs';

const log = new Logger('RiskSectionDetailsComponent');

@Component({
  selector: 'app-risk-section-details',
  templateUrl: './risk-section-details.component.html',
  styleUrls: ['./risk-section-details.component.css']
})
export class RiskSectionDetailsComponent {

  @ViewChild('editSectionModal') editSectionModal!: ElementRef;

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
  allSubclassList:Subclasses[]
  // filteredSubclass:Subclass[];
  // selectedSubclassCode:any;
  allMatchingSubclasses=[];

  subclassCoverType:any;
  coverTypeCode:any;
  selectedCoverType:any;
  filteredSubclass:Subclass[];
  selectedSubclass: any;
  selectedSubclassCode:any

  formData: any;
  clientFormData:any;
  riskDetailsForm:FormGroup;

  selectProductCode:any;
  productList:Products;
  description:any;

  binderList:any;
  binderListDetails:any;
  selectedBinderList:any;
  selectedBinderCode:any;

  // selectedDates: Date[]=[];
  // rangeDates: Date[]=[];
  coverFromDate: string;
  coverToDate: string;

  clauseList:Clause[];
  selectedClauseList:Clause[];
  SubclauseList:subclassClauses[];
  selectedSubClauseList:subclassClauses[];
  selectedClauseCode:any;
  // clauseDetail:any;
  selectedClauses:any

  riskSectionList:riskSection[];
  sectionList:any;
  selectedSectionList:subclassSection[];
  sectionDetailsForm:FormGroup;
  subclassSectionCoverList:any;
  mandatorySections:any;
  filteredMandatorySections :any;
  searchText: string = '';



  quotationDetails:any

  checkedSectionCode:any;
  checkedSectionDesc:any;
  checkedSectionType:any;
  sectionArray:any;
  selectedSection:any;

  scheduleDetailsForm:FormGroup;
  scheduleData:any;
  scheduleList:any;
  selectedSchedule:any;
  updatedSchedule:any;
  updatedScheduleData:any;
  passedlevel:any;

  vehicleMakeList:vehicleMake[];
  vehicleModelList:any;
  vehicleModelDetails:vehicleModel[];
  filteredVehicleModel:any;
  selectedVehicleMakeCode:any;
  vehiclemakeModel:any;
  selectedVehicleMakeName:any;
  selectedVehicleModelName:any;

  premiumList:any;

  isFromDateSelected = false;
  isToDateSelected = false;
  passedRiskId:any;

  editing = false; // Add other properties as needed
  modalHeight: number = 200; // Initial height
  products: Products[];
  coverFrom:any;
  coverTo:any;

  riskClausesList:riskClauses[];
  selectedRiskClause:Clause;
  selectedRiskClauseCode:any;

  selectedSections: any[] = [];
  premiumListIndex = 0;
  sections: any[] = [];

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
    public subclassSectionCovertypeService:SubClassCoverTypesSectionsService,
    public vehicleMakeService:VehicleMakeService,
    public vehicleModelService:VehicleModelService,
    public producSetupService: ProductsService,
    public premiumRateService: PremiumRateService,
    public riskClauseService:RiskClausesService,
    public globalMessagingService: GlobalMessagingService,


    public fb:FormBuilder,
    public cdr:ChangeDetectorRef,
    private renderer: Renderer2

  ){}
    public isCollapsibleOpen = false;
    public isOtherDetailsOpen = false;
    public isSectionDetailsOpen = false;
    public isThirdDetailsOpen = false;

    ngOnInit(): void {

      const quotationFormDetails = sessionStorage.getItem('quotationFormDetails');
      this.formData = JSON.parse(quotationFormDetails) ;
      this.clientFormData=this.sharedService.getFormData();
      this.quotationCode=sessionStorage.getItem('quotationCode');
      this.createRiskDetailsForm();
      this.coverFrom = sessionStorage.getItem('coverFrom');
      this.coverTo = sessionStorage.getItem('coverTo');
      this.riskDetailsForm.controls['dateWithEffectFrom'].patchValue(this.coverFrom);
      this.riskDetailsForm.controls['dateWithEffectTo'].patchValue(this.coverTo);
      log.debug(this.quotationCode ,"RISK DETAILS Screen Quotation No:");
      log.debug(this.formData ,"Form Data");
      log.debug(this.clientFormData ,"CLIENT Form Data");


      log.debug(this.formData ,"Form Data");
      this.loadAllSubclass();
      this.getVehicleMake();
      // this.getVehicleModel();

      // this.loadFormData();

      this.createSectionDetailsForm();
      this.createScheduleDetailsForm();

      const riskFormDetails = sessionStorage.getItem('riskFormData');
      console.log('Risk form details session storage',riskFormDetails,)

      const sections=sessionStorage.getItem('sections')
      console.log("Sections",sections)
      if (sections){

        this.sectionArray = JSON.parse(sections)
        console.log("parsed sections", this.sectionArray)
      }
      const schedules =sessionStorage.getItem('schedules')
      console.log("Schedules",schedules)
      if (schedules){
        this.scheduleList = JSON.parse(schedules)
        console.log("parsed Schedules", this.scheduleList)
      }
      // if (riskFormDetails) {
      //   const parsedData = JSON.parse(riskFormDetails);
      //   console.log(parsedData)
      //   this.riskDetailsForm.setValue(parsedData);

      // }


      this.riskDetailsForm.get('propertyId').valueChanges.subscribe((value) => {
        this.riskIdPassed(value);
      });
      this.riskDetailsForm.get('coverTypeShortDescription').valueChanges.subscribe((selectedValue) => {
        console.log('Selected CoverType:', selectedValue);
        this.selectedCoverType=selectedValue
        console.log('Selected CoverType:', this.selectedCoverType);
      });
      this.riskDetailsForm.get('dateWithEffectFrom').valueChanges.subscribe(() => {
        this.updateCoverToDate();
      });





  }
  ngOnDestroy(): void {}

  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
}
onResize(event: any) {
  this.modalHeight = event.height;
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

  showSelectFromDateMessage() {
    if (!this.isFromDateSelected) {
      this.globalMessagingService.displayInfoMessage('Information', 'Select the "Cover From" date')

      
    }
  }

  showSelectToDateMessage() {
    if (!this.isFromDateSelected) {
      this.isFromDateSelected = true;
      this.globalMessagingService.clearMessages;
      this.globalMessagingService.displayInfoMessage('Information', 'Select the "Cover To" date')

    } else if (!this.isToDateSelected) {
      this.isToDateSelected = true;
      this.globalMessagingService.clearMessages;
    }
  }
  // This method updates the "Cover To" date when "Cover From" changes


updateCoverToDate() {
  this.coverFromDate = this.riskDetailsForm.get('dateWithEffectFrom').value;

  if (this.coverFromDate) {
    const selectedDate = new Date(this.coverFromDate);
    selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    this.riskDetailsForm.patchValue({
      dateWithEffectTo: selectedDate.toISOString().split('T')[0]
    });
  } else {
    this.riskDetailsForm.patchValue({
      dateWithEffectTo: ''
    });
  }
}
   /**
 * Fetches all subclass data from the subclass service,
 */
   loadAllSubclass(){
    return this.subclassService.getAllSubclasses().subscribe(data=>{
      this.allSubclassList=data;
      log.debug(this.allSubclassList," from the service All Subclass List");
      this.cdr.detectChanges();
      this.loadFormData()
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
    this.getProductSubclass(this.selectProductCode);
    // this.getSubclasses();

    this.getClient();

  }



   /**
 * Retrieves product subclasses for a specific product.
 *
 * This method makes an HTTP request to the GIS service to fetch product subclasses and filters the results
 * to obtain subclasses associated with a particular product.
 *
 * @param productCode - The code of the product for which subclasses are to be retrieved. *
 * @returns void
 */
  //  getSubclasses() {
  //   this.gisService.getASubclasses().subscribe(data => {
  //     this.subClassList = data._embedded.product_subclass_dto_list
  //     this.filteredSubclass = this.subClassList.filter(prod => prod.product_code == this.selectProductCode)
  //     log.debug(this.filteredSubclass, 'Selected Product code Subclass')
  //     this.cdr.detectChanges();
  //   })
  // }

  getProductSubclass(code: number) {
    this.gisService.getProductSubclasses(code).subscribe(data => {
      this.subClassList = data._embedded.product_subclass_dto_list;
      log.debug(this.subClassList, 'Product Subclass List');


      this.subClassList.forEach(element => {
        const matchingSubclasses = this.allSubclassList.filter(subCode => subCode.code === element.sub_class_code);
        this.allMatchingSubclasses.push(...matchingSubclasses); // Merge matchingSubclasses into allMatchingSubclasses
      });

      log.debug("Retrieved Subclasses by code", this.allMatchingSubclasses);


      this.cdr.detectChanges();
    });
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
    this.loadAllBinders();
    this.loadSubclassClauses(this.selectedSubclassCode);
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
      // this.loadSubclassSectionCovertype();

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
      // dateRange:[''],
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
  //  loadAllBinders(code:any){
  //   this.binderService.getAllBindersQuotation().subscribe(data=>{
  //     this.binderList=data._embedded.binder_dto_list;
  //     this.selectedBinderList=this.binderList.filter(binder=>binder.sub_class_code == code);
  //     this.selectedBinderCode=this.selectedBinderList[0].code;
  //    log.debug('Filtered Binder', this.selectedBinderList);
  //    log.debug('Filtered Binder code', this.selectedBinderCode);

  //     this.cdr.detectChanges();

  //   })
  // }
  loadAllBinders() {
    this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(data => {
       this.binderList=data;
        this.binderListDetails = this.binderList._embedded.binder_dto_list;
        console.log("All Binders Details:", this.binderListDetails); // Debugging
        this.selectedBinderCode=this.binderListDetails[0].code;

        this.cdr.detectChanges();
    });
  }

  /**
 * Retrieves subclass clauses and updates related properties.
 * Sends an HTTP request to fetch subclass clauses, filters them based on a provided 'code',
 * and updates properties like 'selectedSubClauseList' and 'selectedClauseCode'.
 * Also initiates the 'loadAllClauses()' method.
 */
  loadSubclassClauses(code:any){
    this.subclassService.getSubclassClauses(code).subscribe(data =>{
      this.SubclauseList=data;
      // this.selectedSubClauseList=this.SubclauseList.filter(clause=>clause.subClassCode == code);
      // this.selectedClauseCode=this.selectedSubClauseList[0].clauseCode;

      log.debug('subclass ClauseList#####',this.SubclauseList)

      // log.debug('ClauseList',this.selectedSubClauseList)
      // log.debug('ClauseCode********',this.selectedClauseCode)
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
  // loadAllClauses(){
  //   this.subclassService.getAllClauses().subscribe(data =>{
  //     this.clauseList=data._embedded.clause_dto_list
  //     log.debug('Clause hope List',this.clauseList)

  //     this.selectedClauseList=this.clauseList.filter(clausesub=>clausesub.code == this.selectedClauseCode);
  //     log.debug('ClauseSelectdList',this.selectedClauseList)
  //   })
  // }
  loadAllClauses() {
    // Extract clause codes from selectedSubClauseList
    const subClauseCodes = this.SubclauseList.map(subClause => subClause.clauseCode);
    log.debug('Retrived Clause Codes',subClauseCodes)

    // Check if there are any subClauseCodes before making the request
    if (subClauseCodes.length === 0) {
      // Handle the case when there are no subClauseCodes
      return;
    }

    // Make the request to get all clauses based on the subClauseCodes
    this.subclassService.getAllClauses().subscribe(data => {
      this.clauseList = data._embedded.clause_dto_list;

      // Filter clauseList based on subClauseCodes
      this.selectedClauseList = this.clauseList.filter(clause => subClauseCodes.includes(clause.code));
      sessionStorage.setItem("riskClauses",JSON.stringify(this.selectedClauseList))
      log.debug('All ClauseList', this.clauseList);
      log.debug('ClauseSelectdList', this.selectedClauseList);
    });
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

  getVehicleMake(){
    this.vehicleMakeService.getAllVehicleMake().subscribe(data =>{
      this.vehicleMakeList=data;
      log.debug("VehicleMake",this.vehicleMakeList)
    })
  }

  // onVehicleMakeSelected(event: any) {
  //   log.debug("event logged",event.target.value[0].code)
  //   const selectedValue = event.target.value;
  //   this.selectedVehicleMakeCode=selectedValue;
  //   console.log(`Selected vehicle value: ${selectedValue}`);
  //   log.debug(this.selectedVehicleMakeCode,'Sekected vehicle make Code')

  //   this.getVehicleModel();
  // }
  onVehicleMakeSelected(event: any) {
    const selectedValue = event.target.value;
    log.debug("SELECTED CODE:",selectedValue)

    this.selectedVehicleMakeCode=selectedValue;


    // Convert selectedValue to the appropriate type (e.g., number)
    const typedSelectedValue = this.convertToCorrectType(selectedValue);

    // Find the selected object using the converted value
    const selectedObject = this.vehicleMakeList.find(vehicleMake => vehicleMake.code === typedSelectedValue);

    // Check if the object is found
    if (selectedObject) {
      console.log('Selected Vehicle Object:', selectedObject);
      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Object not found');
    }
    this.getVehicleModel();
    this.selectedVehicleMakeName=selectedObject.name
  }

  convertToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your identifier
    // For example, if your identifier is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }


  getVehicleModel(){
    this.vehicleModelService.getAllVehicleModel().subscribe(data =>{
      this.vehicleModelList=data;
      log.debug("VehicleModel",this.vehicleModelList);
      this.vehicleModelDetails=this.vehicleModelList._embedded.vehicle_model_dto_list;
      log.debug("Vehicle Model Details",this.vehicleModelDetails);
      this.filteredVehicleModel=this.vehicleModelDetails.filter(model=>model.vehicle_make_code == this.selectedVehicleMakeCode);
      log.debug("Filtered Vehicle Model Details",this.filteredVehicleModel);

    })
  }
  onVehicleModelSelected(event: any) {
    const selectedValue = event.target.value;

    // Convert selectedValue to the appropriate type (e.g., number)
    const typedSelectedValue = this.convertToCorrectType(selectedValue);

    // Find the selected object using the converted value
    const selectedObject = this.filteredVehicleModel.find(vehicleModel => vehicleModel.code === typedSelectedValue);

    // Check if the object is found
    if (selectedObject) {
      console.log('Selected Vehicle Model:', selectedObject);
      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Model not found');
    }
    this.selectedVehicleModelName=selectedObject.name;
    this.vehiclemakeModel= this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;
    console.log('Selected Vehicle make model',this.vehiclemakeModel);

  }

  convertModelToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your code property
    // For example, if your code property is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }

  createRiskDetail(){
    const risk = this.riskDetailsForm.value;
    // const dateWithEffectFromC=risk.dateRange[0];
    // const dateWithEffectToC=risk.dateRange[1];

    risk.binderCode=this.selectedBinderCode;
    risk.coverTypeCode=this.coverTypeCode;
    risk.insuredCode=this.insuredCode;
    risk.productCode=this.selectProductCode;
    risk.itemDescription=this.vehiclemakeModel;
    delete risk.dateRange;
    const riskArray = [risk];
    // const propertyIdValue = this.riskDetailsForm.get('propertyId').value;
    console.log(riskArray)
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
        this.globalMessagingService.displaySuccessMessage('Success', 'Risk Created')

        // this.riskDetailsForm.reset()
      } catch (error) {
        this.globalMessagingService.displayErrorMessage('Error', 'Error try again later')

        // this.riskDetailsForm.reset()
      }
      sessionStorage.setItem('riskFormData', JSON.stringify(this.riskDetailsForm.value));

      this.loadRiskSections();
      // this.loadRiskSubclassSection();
      // this.loadSubclassSectionCovertype();
      this.createSchedule();
      this.loadRiskClauses();
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
  loadSubclassSectionCovertype(){
    this.subclassSectionCovertypeService.getSubclassCovertypeSections().subscribe(data =>{
      this.subclassSectionCoverList=data;
      log.debug("Subclass Section Covertype:",this.subclassSectionCoverList);
      this.mandatorySections=this.subclassSectionCoverList.filter(section=>section.subClassCode == this.selectedSubclassCode && section.isMandatory =="Y");
      log.debug("Mandatory Section Covertype:",this.mandatorySections);

      if(this.mandatorySections.length > 0){
        this.selectedSectionList = this.mandatorySections[0];
        log.debug("Selected Section ", this.selectedSectionList)

      }else {

      }
      // this.sharedService.setQuickSectionDetails(this.mandatorySections);
      this.filterMandatorySections()
    })
  }

  filterMandatorySections(){
    log.debug("selectedCover should be coverdesc",this.selectedCoverType)
        if (this.selectedCoverType) {
          this.filteredMandatorySections = this.mandatorySections.filter(section =>
            section.coverTypeShortDescription == (this.selectedCoverType == "COMP" ? "COMPREHENSIVE" : this.selectedCoverType));
              log.debug("Filtered Section", this.filteredMandatorySections);
        } else {
          this.filteredMandatorySections = this.mandatorySections;
        }
      }

      riskIdPassed(event: any): void {


        if (event instanceof Event) {
          this.passedRiskId = (event.target as HTMLInputElement).value;
        } else {
          this.passedRiskId = event;
        }

        if ( this.passedRiskId !== undefined) {
          console.log('Passed Risk Id',  this.passedRiskId);
        } else {
          console.error('Unable to retrieve value from the event object.');
        }
      }



      matchesSearch(description: string): boolean {
        return description.toLowerCase().includes(this.searchText.toLowerCase());
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

  // onCheckboxChange(section: subclassSection) {

  //   log.debug("Checked Section Data",section)
  //   this.checkedSectionCode=section.sectionCode;
  //   this.checkedSectionDesc=section.sectionShortDescription;
  //   this.checkedSectionType=section.sectionType;
  //   this.getPremiumRates()
  //   this.getSectionbyCode()
  // }
 
  onCheckboxChange(section: any): void {
    const index = this.selectedSections.findIndex(s => s.code === section.code);
    if (index === -1) {
      this.selectedSections.push(section);
    } else {
      this.selectedSections.splice(index, 1);
    }
    log.debug("Selected Sections",this.selectedSections);
    this.getPremium(this.selectedSections);

  }


  /**
 * Creates a new risk section associated with the current risk.
 * Takes section data from the 'sectionDetailsForm', sends it to the server
 * to create a new risk section associated with the current risk, and handles
 * the response data by displaying a success or error message.
 */
  // createRiskSection(){
  //   const section = this.sectionDetailsForm.value;

  //   if (this.premiumList.length > 0 && this.premiumListIndex < this.premiumList.length) {
  //     console.log(`Using sectionCode: ${this.premiumList[this.premiumListIndex].sectionCode} (Premium List Index: ${this.premiumListIndex})`);
  
  //     // Log the current premiumListIndex before incrementing
  //     console.log(`Current premiumListIndex before increment: ${this.premiumListIndex}`);
  
  //     // Increment the premiumListIndex and wrap around using modulo
  //     this.premiumListIndex = (this.premiumListIndex + 1) % this.premiumList.length;
  
  //     // Log the updated premiumListIndex after incrementing
  //     console.log(`Updated premiumListIndex after increment: ${this.premiumListIndex}`);
  
  //     section.sectionCode = this.premiumList[this.premiumListIndex].sectionCode;
  //     section.sectionShortDescription = this.premiumList[this.premiumListIndex].sectionShortDescription;
  //     section.sectionType = this.premiumList[this.premiumListIndex].sectionType;

  //     // section.sectionCode=this.checkedSectionCode;
  //     // section.sectionShortDescription=this.checkedSectionDesc;
  //     // section.sectionType=this.sectionList.type;

  //   } else {
  //     // Handle scenario when premiumList is empty or index is out of bounds
  //     console.error('Premium list is empty or index is out of bounds.');
  //     return; // or throw an error, handle as per your requirement
  //   }
  //   this.sectionArray = [section];
  //   section.calcGroup = 1;
  //   section.code = null;
  //   section.compute = "Y";
  //   section.description = null;
  //   section.freeLimit = 0;
  //   section.limitAmount = 0;
  //   section.multiplierDivisionFactor = this.premiumList[0].multiplierDivisionFactor;
  //   section.multiplierRate = 0;
  //   section.premiumAmount = 0;
  //   section.premiumRate = this.premiumList[0].rate;
  //   section.rateDivisionFactor = this.premiumList[0].divisionFactor;
  //   section.rateType = this.premiumList[0].rateType;
  //   section.rowNumber = 0;
  //   section.sumInsuredLimitType = null;
  //   section.sumInsuredRate = 0;

  //   // section.sectionCode=this.checkedSectionCode;
  //   // section.sectionShortDescription=this.checkedSectionDesc;
  //   // section.sectionType=this.sectionList.type;

  //   log.debug("Section Form Array",this.sectionArray)

  //   this.quotationService.createRiskSection(this.riskCode,this.sectionArray).subscribe(data =>{

  //     try {
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
  //       this.sectionDetailsForm.reset()
  //     } catch (error) {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
  //       this.sectionDetailsForm.reset()
  //     }
  //   })
  // }
  createRiskSection() {
    const sectionTemplate = this.sectionDetailsForm.value;

    if (this.premiumList.length > 0) {
        const sections = this.premiumList.map((premiumItem, index) => {
            // Create a new section object from the template
            const section = { ...sectionTemplate };

            // Assign values from the premium item to the section
            section.sectionCode = premiumItem.sectionCode;
            section.sectionShortDescription = premiumItem.sectionShortDescription;
            section.sectionType = premiumItem.sectionType;
            section.calcGroup = 1;
            section.code = null;
            section.compute = "Y";
            section.description = null;
            section.freeLimit = 0;
            section.limitAmount = 0;
            section.multiplierDivisionFactor = premiumItem.multiplierDivisionFactor;
            section.multiplierRate = 0;
            section.premiumAmount = 0;
            section.premiumRate = premiumItem.rate;
            section.rateDivisionFactor = premiumItem.divisionFactor;
            section.rateType = premiumItem.rateType;
            section.rowNumber = 0;
            section.sumInsuredLimitType = null;
            section.sumInsuredRate = 0;

            return section;
        });

        // Log the sections array
        console.log("Sections to be created:", sections);
        this.sections=sections;
        console.log("Sections to be created:", this.sections);

        // Send the array of sections to the service
        this.quotationService.createRiskSection(this.riskCode, sections).subscribe(data => {
            try {
                this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created')

                this.sectionDetailsForm.reset();
            } catch (error) {
              this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

                this.sectionDetailsForm.reset();
            }
        });
    } else {
        // Handle scenario when premiumList is empty
        console.error('Premium list is empty.');
        this.globalMessagingService.displayErrorMessage('Error', 'Premium list is empty')

        return;
    }
}


  onSelectSection(event: any){
    this.selectedSection=event;
    log.info("Patched section",this.selectedSection)
    this.sectionDetailsForm.patchValue( this.selectedSection)
  }
  onSaveDetailsClick() {
    this.updateRiskSection();

    // Close the modal
    const modalElement: HTMLElement | null = this.editSectionModal.nativeElement;
    if (modalElement) {
      this.renderer.removeClass(modalElement, 'show'); // Remove 'show' class to hide the modal
      this.renderer.setStyle(modalElement, 'display', 'none'); // Set display property to 'none'
    }

  }
  updateRiskSection(){
    const section = this.sectionDetailsForm.value;
    this.sectionArray = [section];

    this.quotationService.updateRiskSection(this.riskCode,this.sectionArray).subscribe((data)=>{
      try{
        sessionStorage.setItem('limitAmount', this.sectionDetailsForm.value.limitAmount)

        this.sectionDetailsForm.reset()
        log.info(section)

        this.globalMessagingService.displaySuccessMessage('Success', 'Section Updated')

      }catch(error){
        log.info(section)
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        this.sectionDetailsForm.reset()
      }
    })
  }

   onEditButtonClick(selectedSection: any) {
    this.selectedSection = selectedSection;

    // Open the modal
    const modalElement: HTMLElement | null = this.editSectionModal.nativeElement;
    if (modalElement) {
      this.renderer.addClass(modalElement, 'show'); // Add 'show' class to make it visible
      this.renderer.setStyle(modalElement, 'display', 'block'); // Set display property to 'block'
    }
  }

  // createScheduleDetailsForm(){
  //   this.scheduleDetailsForm=this.fb.group({
  //     details: {
  //       level1: {
  //         bodyType: [''],
  //         yearOfManufacture: [''],
  //         color: [''],
  //         engineNumber: [''],
  //         cubicCapacity: [''],
  //         Make: [''],
  //         coverType: [''],
  //         registrationNumber: [''],
  //         chasisNumber: [''],
  //         tonnage: [''],
  //         carryCapacity: [''],
  //         logBook: [''],
  //         value: ['']
  //       }
  //   },
  //   riskCode: [''],
  //   transactionType:[''],
  //   version:['']
  // });
  // }
  createScheduleDetailsForm() {
    this.scheduleDetailsForm = this.fb.group({
      details: this.fb.group({
        level1: this.fb.group({
          bodyType: [''],
          yearOfManufacture: [''],
          color: [''],
          engineNumber: [''],
          cubicCapacity: [''],
          Make: [''],
          coverType: [''],
          registrationNumber: [''],
          chasisNumber: [''],
          tonnage: [''],
          carryCapacity: [''],
          logBook: [''],
          value: [''],
          age: [''],
          itemNo: [''],
          terrorismApplicable: [''],
          securityDevice1: [''],
          motorAccessories: [''],
          model: [''],
          securityDevice: [''],
          regularDriverName: [''],
          schActive: [''],
          licenceNo: [''],
          driverLicenceDate: [''],
          driverSmsNo: [''],
          driverRelationInsured: [''],
          driverEmailAddress: ['']
        }),
      }),
      riskCode: [''],
      transactionType: [''],
      version: [''],
    });
  }

  createSchedule() {
    const schedule = this.scheduleDetailsForm.value;
  log.debug("passedriskid",this.passedRiskId);
  log.debug("passedcovertype",this.selectedCoverType)

    // Set specific default values for some fields
    schedule.details.level1.bodyType = null;
    schedule.details.level1.yearOfManufacture = null;
    schedule.details.level1.color = "red";
    schedule.details.level1.engineNumber = null;
    schedule.details.level1.cubicCapacity = null;
    schedule.details.level1.Make =this.selectedVehicleMakeName;
    schedule.details.level1.coverType = this.selectedCoverType;
    schedule.details.level1.registrationNumber = this.passedRiskId;
    schedule.details.level1.chasisNumber = null;
    schedule.details.level1.tonnage = null;
    schedule.details.level1.carryCapacity = null;
    schedule.details.level1.logBook = null;
    schedule.details.level1.value = null;
    schedule.riskCode = this.riskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;

    this.quotationService.createSchedule(schedule).subscribe(
      (data) => {
        try {
          this.scheduleData = data;
          this.scheduleList=this.scheduleData._embedded
          console.log("Schedule Data:", this.scheduleData);
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created')

        } catch (error) {
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        }
      },
      (error) => {
        console.error('Error creating schedule:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

      }
    );
  }
   // This method Clears the Schedule Detail form by resetting the form model
   clearForm() {
    this.scheduleDetailsForm.reset();

  }
  onSelectSchedule(event: any){
    this.selectedSchedule=event;
    log.info("Patched Schedule",this.selectedSchedule)
    this.scheduleDetailsForm.patchValue( this.selectedSchedule)
    let level=this.selectedSchedule.details;
    log.info("Patched level",level)
    this.deleteScheduleForLevel();
  }
  openEditScheduleModal(){
    if(!this.selectedSchedule){
      this.globalMessagingService.displayErrorMessage('Error', 'Select a Schedule to continue')
    }else{
      document.getElementById("openModalButtonEdit").click();
  
    }
  }
  updateSchedule(){
    const schedule = this.scheduleDetailsForm.value;
    schedule.riskCode = this.riskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;
    this.quotationService.updateSchedule(schedule).subscribe(data=>{
      this.updatedScheduleData=data;
      console.log('Updated Schedule Data:', this.updatedScheduleData);
      this.updatedSchedule=this.updatedScheduleData._embedded;
      console.log('Updated Schedule  nnnnn:', this.updatedSchedule);
      this.scheduleList = this.updatedSchedule;
      log.debug("UPDATED SCHEDULE LIST:",this.scheduleList)
      const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
      if (index !== -1) {
        this.scheduleList[index] = this.updatedSchedule;
        this.cdr.detectChanges();
      }

      try{

        this.scheduleDetailsForm.reset()
        this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated')

      }catch(error){
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        this.scheduleDetailsForm.reset()
      }
    })
    this.cdr.detectChanges();

  }
  deleteScheduleForLevel() {
    const levelNumber = this.extractLevelNumber(this.selectedSchedule.details);
    if (levelNumber !== null) {
      this.passedlevel =levelNumber;
      console.log("the level passsed",this.passedlevel)
    } else {
      console.log("No 'level' property found in the object.");
    }
  }
  extractLevelNumber(obj: any): number | null {
    const keys = Object.keys(obj);
    const levelKey = keys.find(key => key.startsWith('level'));
    const levelNumber = levelKey ? parseInt(levelKey.match(/\d+/)[0], 10) : null;
    return levelNumber;
  }
  deleteSchedule() {
    if (this.selectedSchedule && this.selectedSchedule.code) {
      let level = this.passedlevel;

      // Ensure that level is a number
      if (typeof level === 'number') {
        let scheduleCode = this.selectedSchedule.code;
        let riskCode = this.selectedSchedule.riskCode;

        this.quotationService.deleteSchedule(level, riskCode, scheduleCode).subscribe(() => {
          // Remove the deleted schedule from the scheduleList
          this.scheduleList = this.scheduleList.filter(schedule => schedule.code !== scheduleCode);

          this.globalMessagingService.displaySuccessMessage('Success', 'Deleted Successfully')

        }, error => {
          console.error('Error deleting schedule:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        });
      } else {
        console.log('Invalid level number:', level);
        // Handle the case where level is not a valid number
      }
    } else {
      // Handle the case where selectedPremiumRate is undefined or does not have a code property
      this.globalMessagingService.displayErrorMessage('Error', 'Select a Schedule to continue')

    }
  }




  finish(){
    console.log('sections',this.sectionArray)
    console.log('Schedules',this.scheduleList)

    sessionStorage.setItem('sections', JSON.stringify(this.sectionArray))
    sessionStorage.setItem('schedules', JSON.stringify(this.scheduleList))

    this.router.navigate(['/home/gis/quotation/quotation-summary'])
  }
  getSectionbyCode(){
    this.sectionService.getSectionByCode(this.checkedSectionCode).subscribe(data =>{
      this.sectionList=data;
      sessionStorage.setItem('sectionType', this.sectionList.type)
      console.log(this.sectionList.type, "SECTION LIST WITH TYPE")
    })
  }
  getPremiumRates() {
    const selectedSectionCode = this.checkedSectionCode;
    this.premiumRateService.getAllPremiums(selectedSectionCode, this.selectedBinderCode, this.selectedSubclassCode).subscribe(data => {
      this.premiumList = data;
      log.debug(this.premiumList[0].multiplierDivisionFactor, "premium List");
      sessionStorage.setItem('premiumRate', this.premiumList[0].rate)
      sessionStorage.setItem('multiplierDivisionFactor', this.premiumList[0].multiplierDivisionFactor)
      sessionStorage.setItem('divisionFactor', this.premiumList[0].divisionFactor)
      sessionStorage.setItem('rateType', this.premiumList[0].rateType)
      sessionStorage.setItem('premiumRate', this.premiumList[0].rate)
      // this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
    });
  }
  // getPremium(passedSections: any[]) {
    
  //   const sections = passedSections;
  //   log.debug("Sections passed to premium service:", sections);

  //   // Create an array to store observables returned by each service call
  //   const observables = sections?.map(section => {
  //     return this.premiumRateService.getAllPremiums(section.sectionCode, this.selectedBinderCode, this.selectedSubclassCode);
  //   });

  //   // Use forkJoin to wait for all observables to complete
  //   forkJoin(observables).subscribe((data: any[]) => {
  //     // data is an array containing the results of each service call
  //     const newPremiumList = data.flat(); // Flatten the array if needed
  //     log.debug("New Premium List", newPremiumList);

  //     // Check if premiumList is an array (safeguard against initialization issues)
  //     if (!Array.isArray(this.premiumList)) {
  //       this.premiumList = [];
  //     }

  //     // Append newPremiumList to existing premiumList
  //     this.premiumList = [...this.premiumList, ...newPremiumList];
  //     log.debug("Updated Premium List", this.premiumList);
  //   });
  // }
  getPremium(passedSections: any[]) {
    const sections = passedSections;
    log.debug("Sections passed to premium service:", sections);
  
    // Create an array to store observables returned by each service call
    const observables = sections?.map(section => {
      return this.premiumRateService.getAllPremiums(section.sectionCode, this.selectedBinderCode, this.selectedSubclassCode);
    });
  
    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe((data: any[]) => {
      // Flatten the array if needed
      const newPremiumList = data.flat();
      log.debug("New Premium List", newPremiumList);
  
      // Check if premiumList is an array (safeguard against initialization issues)
      if (!Array.isArray(this.premiumList)) {
        this.premiumList = [];
      }
  
      // Create a Set to track existing premium codes
      const premiumCodeSet = new Set(this.premiumList.map(premium => premium.code));
  
      // Filter out any new premiums that already exist in the premiumList
      const uniqueNewPremiumList = newPremiumList.filter(premium => !premiumCodeSet.has(premium.code));
  
      // Append uniqueNewPremiumList to existing premiumList
      this.premiumList = [...this.premiumList, ...uniqueNewPremiumList];
      log.debug("Updated Premium List", this.premiumList);
    });
  }
  
  loadRiskClauses(){
    this.quotationService.getRiskClauses(this.riskCode).subscribe(data =>{
      this.riskClausesList=data;
      log.debug("Risk Clauses List:",this.riskClausesList)
    })
  }

  onSelectRiskClauses(event: any){
    this.selectedRiskClause=event;
    log.info("Patched Risk Section",this.selectedRiskClause);
    this.selectedRiskClauseCode=this.selectedRiskClause.code;
    log.debug("SELECTED RISK CLAUSE CODE:",this.selectedRiskClauseCode);
    log.debug("SELECTED PRODUCT CODE:",this.selectProductCode);
    log.debug("SELECTED RISK CODE:",this.riskCode);
    log.debug("SELECTED Quote CODE:",this.quotationCode);

    this.captureRiskClause();
  }
  // captureRiskClause(){
  //   this.quotationService.captureRiskClauses(this.selectedRiskClauseCode,this.selectProductCode,this.quotationCode, this.riskCode).subscribe(data =>{
  //     log.debug("Response from capture risk endpont:",data);
  //     this.globalMessagingService.displaySuccessMessage('Success', 'Risk Clauses successfully captured');

  //   })
  // }
  captureRiskClause() {
    this.quotationService
      .captureRiskClauses(this.selectedRiskClauseCode,this.selectProductCode,this.quotationCode, this.riskCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            log.info(`Response from capture risk endpont`, data);
          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        // error: (err) => {

        //   this.globalMessagingService.displayErrorMessage(
        //     'Error',
        //     this.errorMessage
        //   );
        //   log.info(`error >>>`, err);
        // },
      });
  }

}
