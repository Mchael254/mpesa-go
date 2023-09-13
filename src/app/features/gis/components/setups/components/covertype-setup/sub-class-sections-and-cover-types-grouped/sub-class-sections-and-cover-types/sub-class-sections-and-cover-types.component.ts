import {ChangeDetectorRef, Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {Logger} from "../../../../../../../../shared/services";
import {SubClassSectionsService} from "../../../../services/sub-class-sections/sub-class-sections.service";
import {SubClassCoverTypesService} from "../../../../services/sub-class-cover-types/sub-class-cover-types.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {coverType, subclassCoverSections, SubclassesDTO, subSections} from "../../../../data/gisDTO";
import {SectionsService} from "../../../../services/sections/sections.service";
import {
  SubClassCoverTypesSectionsService
} from "../../../../services/sub-class-cover-types-sections/sub-class-cover-types-sections.service";
import {combineLatest, forkJoin} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {CoverTypesService} from "../../../../services/cover-types/cover-types.service";
import {CurrencyService} from "../../../../../../../../shared/services/setups/currency/currency.service";
import {GlobalMessagingService} from "../../../../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('SubClassSectionsAndCoverTypesComponent');

@Component({
  selector: 'app-sub-class-sections-and-cover-types',
  templateUrl: './sub-class-sections-and-cover-types.component.html',
  styleUrls: ['./sub-class-sections-and-cover-types.component.css']
})
export class SubClassSectionsAndCoverTypesComponent implements OnInit{

  @ViewChild('cancelSection', {read: ElementRef}) cancelSectionTask: ElementRef;
  @ViewChild('cancelSectionUpdate', {read: ElementRef}) cancelSectionUpdateTask: ElementRef;
  @ViewChild('cancelCreateCovertype', {read: ElementRef}) cancelCovertypeCreateTask: ElementRef;
  @ViewChild('cancelUpdateCovertype', {read: ElementRef}) cancelCovertypeUpdateTask: ElementRef;

  activeTab = signal('Sections');
  filterBy: any
  filterby: any
  subclassCode: number

  sections: FormGroup;
  coverTypeForm: FormGroup;
  updateCoverTypeForm: FormGroup;

  allSubclassSections: any
  selectedSection: any[];
  selected: any
  selectedCovertype: any
  allSections: any
  allSubCovSec: any;


  covertypeCode: any
  subclassCoverType: any;
  unassignedSection: any;
  allCovertypes: any;
  currencies: any;
  filtersect: any[];
  subFilter: any[];

  subclassList: SubclassesDTO[];
  filterSubCovSec: any[];
  subclassSections: any = [];
  loadSubclassSection: any = [];
  sourceSubCovSec: any[];

  private coverTypeOperation: string =  'add';

  constructor(
    public fb: FormBuilder,
    private subclassSectionsService: SubClassSectionsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    private subClassCoverTypeSectionService: SubClassCoverTypesSectionsService,
    private sectionsService: SectionsService,
    private coverTypeService: CoverTypesService,
    private currencyService: CurrencyService,
    private messageService: GlobalMessagingService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createSubSections()
    this.getAllCovertypes()
    this.getAllCurrencies()
    this.createCoverTypeForm()
    this.createUpdateCoverTypeForm();
  }


  /**
   * Create cover type form
   */
  createCoverTypeForm() {
    this.coverTypeForm = this.fb.group({
      certificateTypeCode: 20,
      certificateTypeShortDescription: ['private'],
      code: null,
      coverTypeCode: [''],
      coverTypeShortdescription: [''],
      defaultSumInsured: [''],
      description: [''],
      installmentPeriod: [''],
      installmentType: [''],
      isDefault: [''],
      maximumInstallments: [''],
      minimumPremium: [''],
      organizationCode: 2,
      paymentInstallmentPercentage: [''],
      subClassCode: 201,
      sumInsuredCurrencyCode: [''],
      sumInsuredExchangeRate: [''],
      surveyEvaluationRequired: ['']
    })
  }

  createUpdateCoverTypeForm() {
    this.updateCoverTypeForm = this.fb.group({
      certificateTypeCode: 20,
      certificateTypeShortDescription: "private",
      code: null,
      coverTypeCode:[''],  //new FormControl(''),
      coverTypeShortdescription: [''], //new FormControl(''),
      defaultSumInsured: [''],
      description: [''],
      installmentPeriod: [''],
      installmentType: [''],
      isDefault: [''],
      maximumInstallments: [''],
      minimumPremium: [''],
      organizationCode: 2,
      paymentInstallmentPercentage: [''],
      subClassCode: 201,
      sumInsuredCurrencyCode: [''],
      sumInsuredExchangeRate: [''],
      surveyEvaluationRequired: ['']
    });
  }

  sectionData: subclassCoverSections = {
    code: null,
    coverTypeCode: 102,
    coverTypeShortDescription: 'Cover Type',
    isMandatory: 'Y',
    order: 3,
    organizationCode: 2,
    sectionCode: 5,
    sectionShortDescription: 'Section Description',
    subClassCode: 6,
    subClassCoverTypeCode: 494
  };

  /**
   * Create subclasssections form
   */
  createSubSections() {
    this.sections = this.fb.group({
      code: null,
      declaration: [''],
      excessDetails: [''],
      newSectionCode: 0,
      newSectionShortDescription: [''],
      sectionCode: [''],
      sectionShortDescription: [''],
      sectionType: [''],
      subclassCode: 121,
      szaCode: 0,
      szaShortDesc: [''],
      version: 0,
      wef: [''],
      wet:['']
    })
  }

  /**
   * Load Sections under a specific subclass
   * @param code of type number
   */
  loadAllSectionsBySubclassCode(code: number) {
    this.subclassSectionsService.getSubclassSectionBySCode(code).subscribe(data => {
      this.allSubclassSections = data;
      this.subclassSections.setsubSecArray(this.allSubclassSections)
      console.log(this.allSubclassSections)
      this.cdr.detectChanges();
    })
    this.loadAllSections()
  }

  /**
   * Load all sections and filter out the assigned sections to get unassigned sub class sections
   */
  loadAllSections(){
    return this.sectionsService.getAllSections().subscribe(data =>{
      this.allSections = data;
      let unassignedSections = [];
      this.allSections.forEach(unassignedSection => {
        const isAssigned = this.allSubclassSections.some(assigned => assigned.sectionCode === unassignedSection.code);
        if (!isAssigned) {
          unassignedSections.push(unassignedSection);
        }
      });
      this.unassignedSection = unassignedSections;
      this.cdr.detectChanges();
    })
  }

  /**
   * Picklist actions buttons handler
   * @param event
   * @param action
   */
  onMoveItem(event: any, action: string) {
    switch (action) {
      case 'moveToTarget':
        // Track move to target button click
        console.log('Move to Target button clicked');
        this.onMoveItems(event);
        break;
      case 'moveAllToTarget':
        // Track move all to target button click
        console.log('Move All to Target button clicked');
        this.onMoveAllItem(event);
        break;
      case 'moveToSource':
        // Track move to source button click
        console.log('Move to Source button clicked');
        this.deleteonMoveItem(event);
        break;
      case 'moveAllToSource':
        // Track move all to source button click
        console.log('Move All to Source button clicked');
        this.deleteonMoveAllItems(event)
        break;
      default:
        break;
    }
  }

  /**
   * Load cover types by subclass code
   * @param code {number} subclass code
   */
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService
      .getSubclassCovertypeBySCode(code)
      .subscribe(data => {
      this.subclassCoverType = data;
      this.cdr.detectChanges();
    })
  }

  /**
   * Method to select an unassigned section
   * @param code
   */
  onRowSelect(code: any){
    this.covertypeCode = code

  }

  /**
   * Get all subclass cover type sections
   */
  getallSubCovSections(){

    this.subClassCoverTypeSectionService.getAllSubCovSection().subscribe(data =>{
      this.allSubCovSec = data;
      this.filterSubCovSec = this.allSubCovSec.filter(sub => sub.subClassCode === this.subclassCode
        && sub.coverTypeCode === this.covertypeCode
      );
      this.subclassSectionsService.setFilteredArray(this.filterSubCovSec)
      this.cdr.detectChanges();
      console.log(this.filterSubCovSec,this.subclassCode ,this.covertypeCode, "Hello")
    })
  }

  /**
   * Method to filter out assigned sections from unassigned sections
   * and display them in the picklist
   */
  compareSections() {
    combineLatest([
      this.subclassSectionsService.getFilteredArray(),
      this.subclassSectionsService.getsubSecArray(),
    ]).subscribe(([filtersect, subFilter]) => {
      this.filtersect = filtersect;
      this.subFilter = subFilter;

      this.sourceSubCovSec = this.subFilter.filter((subclassSections) => {
        return !this.filtersect.some(
          (subclassCovertypeSections) =>
            subclassCovertypeSections.sectionCode === subclassSections.sectionCode
        );
      });

      console.log(
        "Unassigned Tasks >>>>",
        this.sourceSubCovSec,
        "Assigned Tasks >>>>",
        this.filterSubCovSec
      );
    });
  }

  onMoveItems(event){
    console.log("Event listening", event.items)
    const movedItem = event.items[0];
    this.sectionData = {
      code: null,
      coverTypeCode: this.covertypeCode,
      coverTypeShortDescription: 'Cover Type',
      isMandatory: 'Y',
      order: 3,
      organizationCode: 2,
      sectionCode:  movedItem.sectionCode,
      sectionShortDescription: 'Section Description',
      subClassCode: this.subclassCode,
      subClassCoverTypeCode: 494,
    }
    try {
      this.subClassCoverTypeSectionService.createSub(this.sectionData).subscribe(data =>{
        this.messageService.displaySuccessMessage( 'Success', 'Successfully created' );
      })
    } catch (error) {
      this.messageService.displayErrorMessage( 'Error','Error, try again later' );
    }
  }

  /**
   * Method to assign a subclass section to a covertype
   * and hence create a subclass covertype section
   * and move all items from source to target within picklist
   * @param event
   */
  onMoveAllItem(event){
    const observables = event.items.map(element =>{
      const sectionsArray = this.sectionData = {
        code: null,
        coverTypeCode: this.covertypeCode,
        coverTypeShortDescription: 'Cover Type',
        isMandatory: 'Y',
        order: 3,
        organizationCode: 2,
        sectionCode:  element.sectionCode,
        sectionShortDescription: 'Section Description',
        subClassCode: this.subclassCode,
        subClassCoverTypeCode: 494,
      } as any
      return this.subClassCoverTypeSectionService.createSub(sectionsArray);
    });
    forkJoin(observables).subscribe(
      () => {
        console.log("All records created successfully");
        //this.showSuccess();
        this.selectedSection = [];
      },
      (error: HttpErrorResponse) => {
        this.messageService.displayErrorMessage( 'Error',  'Error, try again later' );
      }
    );
  }

  /**
   * Method to delete a subclass covertype section from a sub-class
   * and move all items from target to source within picklist
   * @param event
   */
  deleteonMoveItem(event){
    this.subClassCoverTypeSectionService
      .deleteSubCovSec(event.items[0].code)
      .subscribe(del =>{
      console.log("Successfully deleted", del)
    });

  }

  /**
   * Method to delete all subclass covertype sections
   * and move items from target to source within picklist (from subclass covertype section) to unassigned sublass section
   * @param event
   */
  deleteonMoveAllItems(event){
    const observables = event.items.map(element =>{
      return this.subClassCoverTypeSectionService
        .deleteSubCovSec(element.code)
    });
    forkJoin(observables).subscribe(
      () => {
        console.log("All records deleted successfully");
        //this.showSuccess();
        this.selectedSection = [];
      },
      (error: HttpErrorResponse) => {
        this.messageService
          .displayErrorMessage( 'Error',  'Error, try again later' );
      }
    );
  }

  /**
   * Fetch all cover types
   */
  getAllCovertypes() {
    this.coverTypeService.getAllCovertypes1().subscribe(data => {
      this.allCovertypes = data?._embedded?.cover_type_dto_list
    })
  }

  /***
   * Fetch all currencies
   */
  getAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe(data => {
      this.currencies = data;
    })
  }

  /**
   * Update a subclass cover type
   */
  updateCovertype(){
    const cancelUpdate = this.cancelCovertypeUpdateTask.nativeElement
    // const requestBody: coverType = this.coverTypeForm.value;
    const requestBody: coverType = this.updateCoverTypeForm.value;
    const updateCode = requestBody.code
    requestBody.code = null;
    requestBody.organizationCode = 2;
    try {
      this.subclassCoverTypesService.updateSubCovertype(requestBody, updateCode).subscribe(data =>{
        cancelUpdate.click()
        this.messageService
          .displaySuccessMessage( 'Success',  'Successfully updated subclass cover type');
      })
    } catch (error) {
      this.messageService.displayErrorMessage( 'Error',  'Error, try again later');
    }
  }

  /**
   * Create a subclass cover type
   */
  createCovertype() {

    const cancelCovertypeBtn = this.cancelCovertypeCreateTask.nativeElement
    console.log(this.coverTypeForm.value)
    const requestBody: coverType = this.coverTypeForm.value;
    requestBody.certificateTypeShortDescription = null;
    requestBody.certificateTypeCode = null
    requestBody.subClassCode = this.subclassCode
    requestBody.organizationCode = 2
    try {
      this.subclassCoverTypesService.createSubCovertype(requestBody).subscribe(data =>{
        cancelCovertypeBtn.click()
        this.messageService.displaySuccessMessage( 'Success',  'Successfully created subclass cover type' );
      })
    } catch (error) {
      this.messageService.displayErrorMessage( 'Error',  'Error, try again later' );
    }
  }

  /**
   * Get selected cover type and patch it to the form
   * and fetch all subclass covertype sections for the selected cover type
   * @param item which is the selected cover type
   */
  onSelectCovertype(item: any){
    this.selectedCovertype = item;
    this.covertypeCode =  this.selectedCovertype.coverTypeCode;
    console.log(this.covertypeCode);
    // this.coverTypeForm.patchValue(this.selectedCovertype);
    this.updateCoverTypeForm.patchValue(this.selectedCovertype);
    this.getallSubCovSections();
    this.compareSections();
  }

  /**
   * Get changed cover type and patch the details to the cover type form
   * @param event
   */
  onCovertypesChange(event: any) {
    let value = (event.target as HTMLSelectElement).value;
    const selectedCovertypes = this.allCovertypes.find((CT) => CT.description === value);

    const formControl = this.coverTypeOperation === 'update' ? this.updateCoverTypeForm.get('coverTypeCode') :
      this.coverTypeForm.get('coverTypeCode');

    formControl.setValue(selectedCovertypes?.code || '');
  }

  /**
   * Get changed section and patch the details to the subclass section form
   * @param event
   */
  onSectionChange(event: any){
    let value = (event.target as HTMLSelectElement).value;
    const selectedsection = this.loadSubclassSection.find((CT) => CT.sectionType === value);
    if (selectedsection) {
      this.sections.get('sectionCode').setValue(selectedsection.sectionCode);
    } else {
      this.sections.get('sectionCode').setValue('');
    }
  }

  /**
   * Get selected section and retrieve subclass sections by the current sub class ode
   * @param event
   */
  onselectSection(event: any){
    this.getSubclassSecByCode(this.subclassCode)
    this.selected = event
    this.sections.patchValue( this.selected)
  }

  /**
   * Retrieve subclass section details by its code
   * @param code which is the subclass section code
   */
  getSubclassSecByCode(code: any) {
    console.log(this.loadSubclassSection)
    this.subclassSectionsService.getSubclassSectionBySCode(code).subscribe(data => {
      this.loadSubclassSection = data;
      console.log(this.loadSubclassSection)
      //this.sections.patchValue(this.loadSubclass)
      this.cdr.detectChanges();
    })
  }

  /**
   * Update a sub class section
   */
  updateSubSections(){
    const cancelUpdate = this.cancelSectionUpdateTask.nativeElement
    const subsect: subSections = this.sections.value;
    const sectionNewCode = subsect.code
    subsect.code = null;
    try {
      this.subclassSectionsService.updatesubSection(subsect, sectionNewCode).subscribe(data =>{
        cancelUpdate.click()
        this.messageService.displaySuccessMessage( 'Success',  'Successfully updated');
      })
    } catch (error) {
      this.messageService.displayErrorMessage( 'Error',  'Error, try again later');
    }
  }

  /**
   * Create subclass section from modal when clicking save button
   */
  onclickSelect(){

    const cancelSectionBtn = this.cancelSectionTask.nativeElement;
    const observables = this.selectedSection.map(element => {

      const  sectionsArray: subSections = {
        code: null,
        declaration: "N",
        excessDetails: element.excessDetails,
        newSectionCode: 0,
        newSectionShortDescription: "string",
        sectionCode: element.code,
        sectionShortDescription:  element.shortDescription,
        sectionType: element.type,
        subclassCode: this.subclassCode,
        szaCode: 0,
        szaShortDesc: "string",
        version: 0,
        wef: "2013-03-10",
        wet: "2013-03-10"
      } as any
      //console.log("Try this Sections data", sectionsArray);

      return this.subclassSectionsService.createSubSections(sectionsArray);

    });
    forkJoin(observables).subscribe(
      () => {
        console.log("All records created successfully");
        cancelSectionBtn.click();
        this.messageService.displaySuccessMessage( 'Success',  'Successfully created');
        this.selectedSection = [];
      },
      (error: HttpErrorResponse) => {
        this.messageService.displayErrorMessage( 'Error',  'Error, try again later');
      }
    );
  }

  /**
   * Get selected subclass and load all sections by subclass code.
   * It also loads all cover types by the selected subclass code
   * @param event of type number
   */
  getSelectedSubclass(event: number) {
    this.loadAllSectionsBySubclassCode(event);
    this.loadCovertypeBySubclassCode(event);
    this.subclassCode = event;
  }


  /**
   * Select the current active tab
   * @param activeTab of type string
   */
  selectTab(activeTab: string) {
    this.activeTab.set(activeTab);
  }

  setCoverTypeAction(action: string) {
    this.coverTypeOperation = action;
  }
}
