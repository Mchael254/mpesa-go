import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PremiumRateService } from '../../../services/premium-rate/premium-rate.service';
import { SubclassesService } from '../../../services/subclasses/subclasses.service';
import { BinderService } from '../../../services/binder/binder.service';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from 'src/app/shared/shared.module';

const log = new Logger('PremiumRateComponent');

@Component({
  selector: 'app-premium-rate',
  templateUrl: './premium-rate.component.html',
  styleUrls: ['./premium-rate.component.css']
})

/**
 * This Angular class, `PremiumRateComponent`, manages the functionality related to insurance premium rates.
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
  
  filterSubclass(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSubclass = this.subClassList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

  loadAllSections(code:any){
    return this.subclassService.getSubclassSectionBySCode(code).subscribe(data=>{
      this.sectionList=data;
      this.filteredSection=this.sectionList;
      // log.debug(this.sectionList)
      this.cdr.detectChanges();
    })
  }
  filterSection(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSection = this.sectionList.filter((el) => el.sectionShortDescription.includes(searchValue));
    this.cdr.detectChanges();
  }
  loadSections(data:any){
    this.selectedSection=data;
    // log.debug(this.selectedSection,'This is a section')
    this.selectedItemCode=this.selectedSection.sectionCode;
    // this.loadAllPremiums(selectedItemCode);
   
  }
  loadAllBinders(code:any){
    this.binderService.getAllBinders().subscribe(data=>{
      this.binderList=data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      this.selectedBinderList=this.binderListDetails.filter(binder=>binder.sub_class_code === code);
     
      this.cdr.detectChanges();

    })
  }
  selectedBinderCode(code: any){
    this.selectedBinder=code;
    // log.debug("The selected Binder Code", this.selectedBinder)
  }
  loadBinders(code:any){
    return this.binderService.getBinders(code).subscribe(res=>{
      this.binderListDetails=res;
      this.cdr.detectChanges();
    });
  }
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
  loadPremiums(code:any){
    return this.service.getPremiums(code).subscribe(res=>{
      this.premiumList=res;
      this.selectedPremium=code;
      this.cdr.detectChanges();
    });
  }
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
test(){
  if(!this.selectedBinder){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Binder to continue'});
  }else{
    document.getElementById("openModalButton").click();

  }
}
testEdit(){
  if(!this.selectedBinder && !this.selectedPremiumRate){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Binder to continue'});
  }else{
    document.getElementById("openModalButtonEdit").click();

  }
}
testDelete(){
  if(!this.selectedPremiumRate){
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Premium to continue'});
  }else{
    document.getElementById("openModalButtonDelete").click();

  }
}
onselectPremium(event: any){
  this.selectedPremiumRate = event
  this.premiumForm.patchValue( this.selectedPremiumRate)
  log.info( this.selectedPremiumRate)
}
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
deletePremium(){
  let id = this.selectedPremiumRate.code;
    this.service.deletePremium(id).subscribe((data)=>{
      try{
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted Succesfully'});
      }catch(error){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      }
    })
}
applyFilterGlobal($event, stringVal) {
  log.info(`calling global filter`, stringVal);
  this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

showAddPremiumCard() {
  this.showAddPremium = true;
  this.showEditPremium = false;
  this.showDeleteCover=false;
  this.showcover = false;
  this.showButtons = false;
}

hideAddPremiumCard() {
  this.showAddPremium = false;
  this.showButtons = true;
}
showEditPremiumCard() {
  this.showAddPremium = false;
  this.showEditPremium = true;
  this.showDeleteCover=false;
  this.showcover = false;
  this.showButtons = false;
}
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
