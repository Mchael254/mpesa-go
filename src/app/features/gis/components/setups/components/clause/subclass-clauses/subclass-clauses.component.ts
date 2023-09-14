import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {SubclassCoverTypeClause} from "../../../data/gisDTO";
import {untilDestroyed} from "../../../../../../../shared/services/until-destroyed";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {CurrencyDTO} from "../../../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {CoverTypeService} from "../../../services/cover-type/cover-type.service";

@Component({
  selector: 'app-subclass-clauses',
  templateUrl: './subclass-clauses.component.html',
  styleUrls: ['./subclass-clauses.component.css']
})
export class SubclassClausesComponent implements OnInit{

  subclassList:any
  isDisplayed:boolean;
  filterBy: string = '';
  selected: any;
  subclass:any;
  subclassForm:FormGroup;
  subclassClauses:any;
  clauseList:any;
  finalList:any[]= [];
  subclassCovertype:any=[];
  mandatorysubclassCovertype:any;
  covertypeCode:number;
  covertypetoclause:any;
  covertypetoclauseList:any = []
  list1: any[] = [];
  list2: any[] = [];
  allClauses:any;
  mandatory:any
  data:any[];
  singleClause:any;
  editClauseForm:FormGroup;
  addEditCoverTypeForm: FormGroup;
  subClassCoverTypeClauseData: SubclassCoverTypeClause[] = [];
  filteredSubclassList: any[] = [];
  subclassCovertypeClauses:any[] = [];
  public filteredSubClasses: any;
  selectedClause: any;
  selectedClauses: any[] = [];
  currenciesData: CurrencyDTO[];
  coverTypeData: any[];

  constructor(
    private clauseService: ClauseService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private spinner: NgxSpinnerService,
    private bankService: BankService,
    private coverTypeService: CoverTypeService

  ) {}

  ngOnInit(): void {
    this.loadAllSubclasses()
    this.createForm()
    this.loadClauses()
    this.mandatory = [
      { label: 'Y', value: 'Y' },
      { label: 'N', value: 'N' },


    ];
    this.spinner.show();
    this.getCurrencies();
    this.getCoverTypes();
  }

  /**
   * The function `loadAllSubclasses()` retrieves all subclasses from the `clauseService`, assigns the result to
   * `subclassList` and `filteredSubClasses`, and then hides the spinner and triggers change detection.
   */
  loadAllSubclasses(){
    this.clauseService.getAllSubclasses()
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.subclassList = res
        this.filteredSubClasses = res

        this.spinner.hide();
        this.cdr.detectChanges();

    })
  }
  /**
   * The function `loadSubclass` retrieves subclasses from a service and updates the subclass form with the retrieved data.
   * @param code - The "code" parameter is a value that is used to retrieve subclasses from the clauseService. It is passed
   * as an argument to the getSubclasses() method.
   */
  loadSubclass(code){
    this.clauseService.getSubclasses(code).subscribe(res=>{
      this.subclass = res
      this.subclassForm.patchValue(this.subclass)
    })
  }
  /**
   * The isActive function checks if the selected item is equal to the given item.
   * @param {any} item - The `item` parameter is of type `any`, which means it can be any data type.
   * @returns a boolean value indicating whether the `selected` property is equal to the `item` parameter.
   */
  isActive(item: any) {
    return this.selected === item;
  }

  /**
   * The function creates three form groups for subclass, edit clause, and add/edit cover type.
   */
  createForm(){
    this.subclassForm = this.fb.group({
      code:[''],
      description:['']
    })

    this.editClauseForm = this.fb.group({
      clauseCode: [''],
      clauseExpires:[''],
      isLienClause:[''],
      isMandatory:[''],
      isRescueClause:[''],
      shortDescription:[''],
      subClassCode:[''],
      version:['']

    })

    this.addEditCoverTypeForm = this.fb.group({
      code: [''],
      coverTypeShortDescription: [''],
      description: [''],
      isDefault: [''],
      defaultSumInsured: [''],
      sumInsuredExchangeRate: [''],
      sumInsuredCurrencyCode: [''],
      paymentInstallmentPercentage: [''],
      maximumInstallments: [''],
      installmentPeriod: ['']
    })
  }

  /**
   * The function loads all subclass clauses, filters them based on a given code, and retrieves the corresponding single
   * clause for each filtered result.
   * @param code - The `code` parameter is a value that is used to filter the `subclassClauses` array. It is used to find
   * objects in the array that have a `subClassCode` property equal to the `code` value.
   */
  loadAllSubclassClauses(code) {
    this.clauseService.getAllSubclassClauses()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
      this.subclassClauses = res;
      // console.log("res", res);

      const result = this.subclassClauses.filter(obj => {
        return obj.subClassCode === code;
      });

      console.log("clause code");
      for (let i of result) {
        console.log(i.clauseCode); // Access and log the clauseCode property of each item
        this.clauseService.getSingleClause(i.clauseCode).subscribe(res => {
          this.clauseList = res;
          this.finalList.push(this.clauseList);
          this.cdr.detectChanges();
        });
      }

      console.log("final list", this.finalList);
    });
  }

  /**
   * The function `loadSingleSubclassClause` retrieves a single subclass clause based on a given code and updates the form
   * with the retrieved data.
   * @param code - The `code` parameter is a variable that represents the code of a clause.
   */
  loadSingleSubclassClause(code){
    console.log("subclass", this.subclass);
    this.clauseService.getSubclassClause(code, this.subclass.code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.singleClause = res
      this.editClauseForm.patchValue(this.singleClause)
      this.editClauseForm.controls['version'].setValue(0);

    })
  }

  /**
   * The function `loadSubclassCovertypes` retrieves subclass cover types based on a given code.
   * @param code - The parameter "code" is a variable that represents a code value. It is used as an input to the
   * `getSubclassCovertypeBySCode` method of the `clauseService` object. This method is expected to return a response,
   * which is then assigned to the `subclassCovertype
   */
  loadSubclassCovertypes(code){
    this.clauseService.getSubclassCovertypeBySCode(code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.subclassCovertype = res
    })
  }
  /**
   * The function `singleSCoverType` retrieves and sets values for a cover type and its associated clauses based on a given
   * code.
   * @param code - The `code` parameter is a string that represents the code of a subclass cover type.
   */
  singleSCoverType(code){
    this.clauseService.getSingleSubclassCovertype(code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
        this.covertypeCode = res.code


        this.addEditCoverTypeForm.patchValue(res)

        this.clauseService.getCovertypeToClauses().subscribe(res=>{
          this.covertypetoclause = res
          const result = this.covertypetoclause.filter((obj) => {
            return obj.subClassCoverTypeCode === this.covertypeCode;
          })

          this.covertypetoclauseList = result
          console.log("covertypetoclauseList", this.covertypetoclauseList)

          this.clauseService.getSubclassClause(code, this.subclass.code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.singleClause = res
      this.editClauseForm.patchValue(this.singleClause)
      this.editClauseForm.controls['version'].setValue(0);

    })

        })
      }
    )
  }
  /**
   * The function `loadClauses()` retrieves all subclass clauses using a service, stores the result in the `allClauses`
   * variable, and logs the result to the console.
   */
  loadClauses(){
    this.clauseService.getAllSubclassClauses()
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.allClauses = res
      console.log(this.allClauses)
    })
  }

  /**
   * The function `deleteSubClassClause()` deletes a subclass clause using the `clauseCode` and `subclass.code` values from
   * the `editClauseForm` and updates the `allClauses` array with the response.
   */
  deleteSubClassClause() {
    this.clauseService.deleteSubclassClause(this.editClauseForm.value.clauseCode, this.subclass?.code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
        this.allClauses = res
        console.log(this.allClauses)
      })
  }
  /**
   * The function "loadsingleclause" retrieves a subclass clause using the provided code and subCode, and assigns the
   * result to the "data" variable.
   * @param code - The code parameter is used to specify the main code or class for which you want to retrieve a single
   * clause. It is typically a unique identifier or key that identifies the main code or class.
   * @param subCode - The `subCode` parameter is a code that represents a specific subclass.
   */
  loadsingleclause(code, subCode){
    this.clauseService.getSubclassClause(code, subCode)
      .subscribe(res=>{
      this.data = res
    })
  }

  /**
   * The function `updateSubclassClauses()` updates a subclass clause with new values and displays a success message.
   */
  updateSubclassClauses(){
    console.log(this.singleClause)
    console.log(this.editClauseForm.value.clauseCode)
    const randomString = Math.random().toString(36).substring(2, 5);
    const updateSubclassClauseValues = this.editClauseForm.getRawValue();
    updateSubclassClauseValues.shortDescription = "First loss Memo";

    this.clauseService.updateSubclassClause(updateSubclassClauseValues,this.editClauseForm.value.clauseCode, this.subclass?.code)
      .subscribe(res=>{
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated' );
        console.log("on update subclass clauses", res)
    })
    this.cdr.detectChanges();
  }

  /**
   * The function "addSubclassClauses()" logs a selectedClause, sets the selectedClauses array to contain the selectedClause, and
   * then calls the clauseService to add the selectedClause as a subclass clause.
   */
  addSubclassClauses() {
    console.log("add subclass clauses", this.selectedClause)
    this.selectedClauses = [this.selectedClause];
    const selectedClause = this.selectedClauses;
    /*if (selectedClause.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one clause to add' });
      return;
    }*/
    this.clauseService.addSubclassClause(this.selectedClause)
      .subscribe(res=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Successfully added clause' );
        console.log("on add subclass clauses", res)
      })
  }
  /**
   * The function `updateSubclassCoverType()` updates the values of a subclass cover type.
   */
  updateSubclassCoverType(){
    // console.log(this.addEditCoverTypeForm.value.code)
    const updateSubClassCoverTypeValues = this.addEditCoverTypeForm.getRawValue();
    const updateSubclassCoverType: any = {
      code: null,
      coverTypeCode: this.subclassCovertype[0]?.coverTypeCode,
      coverTypeShortDescription: null,
      subClassCode: this.subclassCovertype[0]?.subClassCode,
      certificateTypeCode: null,
      certificateTypeShortDescription: null,
      minimumPremium: null,
      description: updateSubClassCoverTypeValues.description,
      isDefault: updateSubClassCoverTypeValues.isDefault,
      defaultSumInsured: updateSubClassCoverTypeValues.defaultSumInsured,
      sumInsuredCurrencyCode: updateSubClassCoverTypeValues.sumInsuredCurrencyCode,
      sumInsuredExchangeRate: updateSubClassCoverTypeValues.sumInsuredExchangeRate,
      installmentType: "NONE",
      paymentInstallmentPercentage: null,
      maximumInstallments: null,
      installmentPeriod: null,
      surveyEvaluationRequired: "N",
      organizationCode: 2
    }
    this.clauseService.updateSubclassCoverType(updateSubclassCoverType,this.subclassCovertype[0]?.code)
      .subscribe(res=>{
        this.globalMessagingService.displaySuccessMessage('Success','Successfully Updated' );
        console.log("on update subclass cover type", res)
      })
  }

  /**
   * The `onMoveItems` function logs various values and then creates a new subClassCoverTypeClause using the
   * `clauseService`.
   * @param event - The `event` parameter is an object that contains information about the event that triggered the
   * `onMoveItems` function. It includes details about the items that were moved.
   */
  onMoveItems(event) {
    console.log("Event listening", event.items)
    const movedItem = event.items[0];
    console.log('subclass code', this.subclass?.code)
    console.log('covertype code', this.subclassCovertype)
    console.log('moved item', movedItem)
    console.log('clause code', movedItem.clauseCode)
    this.subClassCoverTypeClauseData = [{
      code: this.subclassCovertype[0]?.code,
      subClassCode: this.subclass?.code,
      subClassCoverTypeCode: this.subclassCovertype[0]?.code,
      clausesShortDescription: null,
      clauseCode: movedItem.code,
      isMandatory: "Y",
      version: 0
    }]
    try {
      this.clauseService.createSubClassCoverTypeClause(this.subClassCoverTypeClauseData)
        .pipe(untilDestroyed(this))
        .subscribe(data =>{
        this.globalMessagingService.displaySuccessMessage('Success','Successfully created' );
      })
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
    }
    this.cdr.detectChanges();
  }

  /**
   * The function `deleteOnMoveItem` is used to delete a cover type from a list of clauses and display success or error
   * messages accordingly.
   * @param event - The event parameter is an object that contains information about the event that triggered the function.
   * It includes details about the item that was moved, such as its code or other relevant data.
   */
  deleteOnMoveItem(event) {
    console.log("these", event)
    try {
    this.clauseService.deleteCovertypeToClauses(event.items[0].code)
      .pipe(untilDestroyed(this))
      .subscribe(data =>{
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted' );
      })
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
    }
    this.cdr.detectChanges();
  }

  /**
   * The function "loadCoverTypeClauses" loads cover type clauses and updates the form with the cover type code.
   * @param code - The "code" parameter is a variable that represents a specific code value. It is used as an input to
   * retrieve data related to a single subclass cover type.
   */
  loadCoverTypeClauses(code) {

    this.subclassCovertypeClauses = this.finalList;
    console.log("CoverTypeClauses", this.subclassCovertypeClauses);
    console.log("code need", this.subclassCovertype[0]?.code);

    this.clauseService.getSingleSubclassCovertype(code)
      .pipe(untilDestroyed(this))
      .subscribe(res=> {
        this.covertypeCode = res.code

        this.addEditCoverTypeForm.patchValue(res)

      })
    this.cdr.detectChanges();
  }

  /**
   * The ngOnDestroy function is a lifecycle hook that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {
  }

  /**
   * The function resets a form for adding or editing a cover type.
   */
  resetSubClassCoverTypeForm() {
    this.addEditCoverTypeForm.reset();
  }

  /**
   * The function filters a list of subclasses based on a search value and updates the filteredSubClasses array.
   * @param {any} event - The event parameter is an object that represents the event that triggered the function. It is
   * typically passed in when the function is called as an event handler. In this case, it is expected to have a target
   * property, which represents the element that triggered the event.
   */
  filterSubClasses(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSubClasses = this.subclassList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

  /**
   * The function `deleteCoverTypeClauses()` deletes a single subclass cover type and displays a success message.
   */
  deleteCoverTypeClauses() {
    console.log('delete', this.covertypeCode)
    this.clauseService.deleteSingleSubclassCovertype(this.covertypeCode)
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success','Successfully deleted' );
      });
  }
  /**
   * The function `getCurrencies()` retrieves currency data from a bank service and assigns it to the `currenciesData`
   * variable.
   */
  getCurrencies() {
    this.bankService.getCurrencies()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.currenciesData = data;
        },
      );
  }

  /**
   * The function "getCoverTypes" retrieves all cover types from the coverTypeService and assigns the data to the
   * coverTypeData variable.
   */
  getCoverTypes() {
    this.coverTypeService.getAllCovertypes().subscribe((data)=>{
      this.coverTypeData = data._embedded.cover_type_dto_list;
    })
  }
}
