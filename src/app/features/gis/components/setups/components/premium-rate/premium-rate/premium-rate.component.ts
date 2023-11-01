import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PremiumRateService } from '../../../services/premium-rate/premium-rate.service';
import { SubclassesService } from '../../../services/subclasses/subclasses.service';
import { BinderService } from '../../../services/binder/binder.service';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import {Logger} from '../../../../../../../shared/shared.module'

const log = new Logger('PremiumRateComponent');

@Component({
  selector: 'app-premium-rate',
  templateUrl: './premium-rate.component.html',
  styleUrls: ['./premium-rate.component.css']
})

/**
 * This Angular class, `PremiumRateComponent`, manages the functionality related to premium rates.
 *  It handles the selection of subclasses, sections, binders, and premium rates, 
 * allowing users to view, create, update, and delete premium rate data. 
 */
export class PremiumRateComponent implements OnInit {


  subClassList:any;
  selected:any;
  selectedSubClassPeril;any
  subClassDetail:any;
  filteredSubclass:any;
  filterBy:any;

  sectionList:any;
  sectionDetails:any;
  selectedSection:any;
  selectedItemCode:any;
  filteredSection:any;

  binderList:any;
  binderListDetails:any;
  selectedBinderList:any;
  selectedBinder:any;

  premiumList:any;
  selectedPremuimList:any;
  premiumForm:FormGroup;
  searchForm:FormGroup;
  selectedPremium:any;
  selectedPremiumRate:any;


  showAddPremium: boolean = false;
  showEditPremium: boolean = false;
  showDeleteCover:boolean = false;
  showcover:boolean = false;
  showButtons: boolean = true;
  // isDisabled: boolean = true; 





  @ViewChild('dt1') dt1: Table | undefined;

  
  constructor(
    public fb:FormBuilder,
    public service:PremiumRateService,
    public subclassService:SubclassesService,
    public binderService:BinderService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,
    private spinner: NgxSpinnerService,

  ) { }
 /**
   * Initialize component by:
   * 1.Initialize the create Premium Form
   * 2. Load all Subclass and displays a spinner to indicate loading
   */
  ngOnInit(): void {
    this.loadAllSubclass();
    this.createPremiumForm();
    this.spinner.show();

  }

  /**
 * Fetches all subclass data from the subclass service,
 * populates class variables, updates the UI, and handles
 * loading indicators.
 */
  loadAllSubclass(){
    return this.subclassService.getAllSubclasses().subscribe(data=>{
      this.subClassList=data;
      this.filteredSubclass=this.subClassList;
      // log.debug(this.subClassList,"Subclass List")
      this.spinner.hide();

      this.cdr.detectChanges();

    })
  }
  /**
 * Loads details and related data for a specific subclass identified by the provided code.
 * Retrieves subclass information, triggers UI updates, and fetches associated sections and binders.
 * @param code The code of the subclass to be loaded.
 */
  loadSubClass(code:any){
    this.subclassService.getSubclasses(code).subscribe(res=>{
      this.subClassDetail=res;
      this.cdr.detectChanges();
    });
    this.loadAllSections(code);
    this.selectedSubClassPeril=code
    // log.debug(this.selectedSubClassPeril,"this is the subclassPerilCode")
    this.loadAllBinders(code);
    // this.selectedBinder=code;
    // this.loadAllPremiums(code);
    
  }
  /**
 * Filters the list of subclasses based on a search input.
 * It takes an event containing the user's input, converts it to uppercase for case-insensitive matching,
 * and filters the 'subClassList' to include only those elements whose 'description' property includes the search value. 
 * @param event - The event object containing the user's input.
 */
  filterSubclass(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSubclass = this.subClassList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }
/**
 * Loads and updates sections for a given subclass code.
 * Retrieves section data via an HTTP request, updates 'sectionList'
 * and 'filteredSection,' and triggers UI updates.
 * @param code - The subclass code for which sections are loaded.
 */
  loadAllSections(code:any){
    return this.subclassService.getSubclassSectionBySCode(code).subscribe(data=>{
      this.sectionList=data;
      this.filteredSection=this.sectionList;
      // log.debug(this.sectionList)
      this.cdr.detectChanges();
    })
  }

  /**
 * Filters the list of sections based on a search input.
 * It takes an event containing the user's input, converts it to uppercase for case-insensitive matching,
 * and filters the 'sectionList' to include only those elements whose 'sectionShortDescription' property includes the search value. 
 * @param event - The event object containing the user's input.
 */
  filterSection(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSection = this.sectionList.filter((el) => el.sectionShortDescription.includes(searchValue));
    this.cdr.detectChanges();
  }
  /**
 * Updates the selected section and its code based on provided data.
 * Typically used when a user selects a section.
 *
 * @param data - The selected section data.
 */
  loadSections(data:any){
    this.selectedSection=data;
    // log.debug(this.selectedSection,'This is a section')
    this.selectedItemCode=this.selectedSection.sectionCode;
    // this.loadAllPremiums(selectedItemCode);
   
  }
  /**
 * Loads and updates the list of binders for a specific subclass.
 * Retrieves binder data via an HTTP request, updates 'binderList' and 'binderListDetails,'
 * and filters 'selectedBinderList' to include only binders matching the provided subclass code.
 *
 * @param code - The subclass code for which binders are loaded.
 */
  loadAllBinders(code:any){
    this.binderService.getAllBinders().subscribe(data=>{
      this.binderList=data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      this.selectedBinderList=this.binderListDetails.filter(binder=>binder.sub_class_code === code);
     
      this.cdr.detectChanges();

    })
  }
  /**
 * Sets the selected binder code based on the provided code.
 * This method is typically called when a user selects a binder, and it updates the 'selectedBinder'
 * property with the provided code.
 * @param code - The code of the selected binder.
 */
  selectedBinderCode(code: any){
    this.selectedBinder=code;
    // log.debug("The selected Binder Code", this.selectedBinder)
  }
  /**
 * Loads and updates binder details for a specific binder identified by the provided code.
 * Retrieves binder data via an HTTP request and updates the 'binderListDetails' property.
 * @param code - The code of the binder for which details are loaded.
 */
  loadBinders(code:any){
    return this.binderService.getBinders(code).subscribe(res=>{
      this.binderListDetails=res;
      this.cdr.detectChanges();
    });
  }
  /**
 * Retrieves premium data via an HTTP request using the provided section code, binder code, and subclass code.
 * It then updates the 'premiumList' with the retrieved data and filters 'selectedPremiumList' to include
 * premiums that match the given codes. Finally, it triggers change detection to update the UI.
 * @param binderCode - The code of the binder for which premiums are loaded.
 * @param subclassCode - The code of the subclass for which premiums are loaded.
 */
  loadAllPremiums( binderCode:any, subclassCode:any){
   let sectionCode =  this.selectedSection.sectionCode 
    // log.debug(sectionCode,binderCode,subclassCode, "The code from get all premiums")
    this.service.getAllPremiums(sectionCode, binderCode, subclassCode).subscribe(data=>{
      this.premiumList=data;
      // log.debug(this.premiumList,"premium List")
      this.selectedPremuimList=this.premiumList.filter(premium=>premium.sectionCode === sectionCode && premium.binderCode === binderCode && premium.subClassCode === subclassCode);
      // log.debug(this.selectedPremuimList,"Premium slected")
      this.cdr.detectChanges();

    })
  } 
  /**
 * Loads and updates premium rate information for a specific premium identified by the provided code.
 * Retrieves premium data via an HTTP request using the provided premium code, updates the 'premiumList'
 * property, sets the 'selectedPremium' to the provided code.
 * @param code - The code of the premium for which details are loaded.
 */
  loadPremiums(code:any){
    return this.service.getPremiums(code).subscribe(res=>{
      this.premiumList=res;
      this.selectedPremium=code;
      this.cdr.detectChanges();
    });
  }
  /**
 * Creates and initializes the premium rate form using Angular's FormBuilder.
 * This method defines form controls and validators for various premium rate attributes,
 * It also initializes a separate search form for filtering premium rates.
 */
  createPremiumForm(){
    this.premiumForm=this.fb.group({
      sectionShortDescription: ['', Validators.required],
      rate:  ['', Validators.required],
      dateWithEffectFrom:  [''],
      dateWithEffectTo: [''],
      subClassCode:['', Validators.required],
      binderCode:['', Validators.required],
      rangeFrom: ['', Validators.required],
      rangeTo: ['', Validators.required],
      rateDescription: ['', Validators.required],
      divisionFactor: [''],
      rateType: ['', Validators.required],
      premiumMinimumAmount: [''],
      proratedOrFull: ['', Validators.required],
      premiumEndorsementMinimumAmount: [''],
      multiplierRate: [''],
      multiplierDivisionFactor:[''],
      maximumRate: [''],
      minimumRate: [''],
      freeLimit: [''],
      isNoClaimDiscountApplicable:[''],
      isExProtectorApplication: [''],
      noClaimDiscountLevel: [''],
      doesCashBackApply: ['',],
      cashBackLevel: [''],
      rateFrequencyType: [''],
      isSumInsuredLimitApplicable: [''],

  });
  this.searchForm=this.fb.group({
    search:['']
  })
}

/**
 * Creates a new premium rate based on the data entered in the premium rate form.
 * It extracts the form values, sets specific properties like section code, subclass code, and binder code,
 * and sends the data to the 'service' for creating a new premium rate via an HTTP request.
 * After submission, it displays a success message if successful or an error message in case of failure,
 * and resets the premium rate form.
 */
createPremium(){
  const premium = this.premiumForm.value
  premium.sectionCode=this.selectedSection.sectionCode;
  premium.sectionShortDescription = null;
  premium.subClassCode=this.selectedSubClassPeril;
  premium.binderCode=this.selectedBinder;
  premium.isSumInsuredLimitApplicable = "Y";
  this.service.createPremium(premium).subscribe((data: {}) => {
    try {
      // log.debug(this.premiumForm.value);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      this.premiumForm.reset()
    } catch (error) {
      // log.debug(this.premiumForm.value);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
      this.premiumForm.reset()
    }
  });
  
}
/**
 * Performs a test operation to check if a binder is selected.
 * If a binder is not selected, it displays an error message using the 'messageService.'
 * Otherwise, it triggers a click event on an element with the ID 'openModalButton.'
 * This function is typically used to prompt the user to select a binder before proceeding.
 */
test(){
  if(!this.selectedBinder){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Binder to continue'});
  }else{
    document.getElementById("openModalButton").click();

  }
}
/**
 * Performs a test operation to check if both a binder and a premium rate are selected for editing.
 * If either the binder or premium rate is not selected, it displays an error message using the 'messageService.'
 * Otherwise, it triggers a click event on an element with the ID 'openModalButtonEdit.'
 * This function is typically used to prompt the user to select both a binder and a premium rate before proceeding with editing.
 */
testEdit(){
  if(!this.selectedBinder && !this.selectedPremiumRate){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Binder to continue'});
  }else{
    document.getElementById("openModalButtonEdit").click();

  }
}
/**
 * Performs a test operation to check if a premium rate is selected for deletion.
 * If no premium rate is selected, it displays an error message using the 'messageService.'
 * Otherwise, it triggers a click event on an element with the ID 'openModalButtonDelete.'
 * This function is typically used to prompt the user to select a premium rate before proceeding with deletion.
 */
testDelete(){
  if(!this.selectedPremiumRate){
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Premium to continue'});
  }else{
    document.getElementById("openModalButtonDelete").click();

  }
}
/**
 * Handles the selection of a premium rate from a user interface event.
 * It updates the 'selectedPremiumRate' property with the selected premium rate data
 * and patches the premium rate form with the selected premium rate values.
 * @param event - The event containing the selected premium rate data.
 */
onselectPremium(event: any){
  this.selectedPremiumRate = event
  this.premiumForm.patchValue( this.selectedPremiumRate)
  // log.info( this.selectedPremiumRate)
}
/**
 * Updates an existing premium rate with new data provided in the premium rate form.
 * After the update operation, it displays a success message if successful or an error message in case of failure,
 * and resets the premium rate form.
 */
updatePremium(){
  const premium = this.premiumForm.value
  premium.sectionCode=this.selectedSection.sectionCode;
  premium.sectionShortDescription = null;
  let id = this.selectedPremiumRate.code;
  this.service.updatePremium(premium,id).subscribe((data)=>{
    try{
      this.premiumForm.reset()
      log.info(premium)
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Premium Updated'});
    }catch(error){
      log.info(premium)
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      this.premiumForm.reset()
    }  
  })
}
// deletePremium(){
//   let id = this.selectedPremiumRate.code;
//     this.service.deletePremium(id).subscribe((data)=>{
//       try{
//         this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted Succesfully'});
//       }catch(error){
//         this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
//       }
//     })
// }
/**
 * Deletes a premium rate based on the selected premium rate and its code.
 * If a valid premium rate with a code is selected, it sends a delete request to the 'service' to delete the premium rate.
 * After the deletion operation, it displays a success message if successful or an error message in case of failure.
 * If no valid premium rate is selected, it displays an error message to prompt the user to select a premium rate for deletion.
 */
deletePremium() {
  if (this.selectedPremiumRate && this.selectedPremiumRate.code) {
    let id = this.selectedPremiumRate.code;
    this.service.deletePremium(id).subscribe((data) => {
      try {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Deleted Successfully'});
      } catch (error) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error, try again later'});
      }
    });
  } else {
    // Handle the case where selectedPremiumRate is undefined or does not have a code property
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Premium to continue'});
  }
}
/**
 * Applies a global filter to a data table component to filter its contents based on the provided search value.
 * This method is typically used for global searching across all columns of a data table.
 * @param $event - The event that triggered the filter action.
 * @param stringVal - The search value to filter the data table contents.
 */
applyFilterGlobal($event, stringVal) {
  log.info(`calling global filter`, stringVal);
  this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}
/**
 * Displays the "Add Premium" card by setting the corresponding boolean flags and hiding other related cards and buttons.
 * This method is typically used to show the form for adding a new premium rate and hide other unrelated elements on the UI.
 */
showAddPremiumCard() {
  this.showAddPremium = true;
  this.showEditPremium = false;
  this.showDeleteCover=false;
  this.showcover = false;
  this.showButtons = false;
}
/**
 * Hides the "Add Premium" card by setting the corresponding boolean flags and showing related buttons.
 * This method is typically used to hide the form for adding a new premium rate and show other related elements like buttons.
 */
hideAddPremiumCard() {
  this.showAddPremium = false;
  this.showButtons = true;
}
/**
 * Displays the "Edit Premium" card by setting the corresponding boolean flags and hiding other related cards and buttons.
 * This method is typically used to show the form for editing an existing premium rate and hide other unrelated elements on the UI.
 */
showEditPremiumCard() {
  this.showAddPremium = false;
  this.showEditPremium = true;
  this.showDeleteCover=false;
  this.showcover = false;
  this.showButtons = false;
}
/**
 * Hides the "Edit Premium" card by setting the corresponding boolean flags and showing related buttons.
 * This method is typically used to hide the form for adding a new premium rate and show other related elements like buttons.
 */
hideEditPremiumCard() {
  this.showEditPremium = false;
  this.showButtons = true;
}
// showCoverCard() {
//   this.showcover = true;
//   this.showAddPremium = false;
//   this.showEditPremium = false;
//   this.showDeleteCover=false;
//   this.showButtons = false;
// }
// hideCoverCard() {
//   this.showcover = false;
//   this.showButtons = true;
// }


}
