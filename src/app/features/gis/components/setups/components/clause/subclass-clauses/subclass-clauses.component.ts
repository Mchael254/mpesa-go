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
  subclassCovertype:any;
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
  loadSubclass(code){
    this.clauseService.getSubclasses(code).subscribe(res=>{
      this.subclass = res
      this.subclassForm.patchValue(this.subclass)
    })
  }
  isActive(item: any) {
    return this.selected === item;
  }

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


  loadSubclassCovertypes(code){
    this.clauseService.getSubclassCovertypeBySCode(code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.subclassCovertype = res
    })
  }
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
  loadClauses(){
    this.clauseService.getAllSubclassClauses()
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
      this.allClauses = res
      console.log(this.allClauses)
    })
  }

  deleteSubClassClause() {
    this.clauseService.deleteSubclassClause(this.editClauseForm.value.clauseCode, this.subclass.code)
      .pipe(untilDestroyed(this))
      .subscribe(res=>{
        this.allClauses = res
        console.log(this.allClauses)
      })
  }
  loadsingleclause(code, subCode){
    this.clauseService.getSubclassClause(code, subCode)
      .subscribe(res=>{
      this.data = res
    })
  }

  updateSubclassClauses(){
    console.log(this.singleClause)
    console.log(this.editClauseForm.value.clauseCode)
    const randomString = Math.random().toString(36).substring(2, 5);
    const updateSubclassClauseValues = this.editClauseForm.getRawValue();
    updateSubclassClauseValues.shortDescription = "First loss Memo";

    this.clauseService.updateSubclassClause(updateSubclassClauseValues,this.editClauseForm.value.clauseCode, this.subclass.code)
      .subscribe(res=>{
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated' );
        console.log("on update subclass clauses", res)
    })
    this.cdr.detectChanges();
  }

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
  updateSubclassCoverType(){
    // console.log(this.addEditCoverTypeForm.value.code)
    const updateSubClassCoverTypeValues = this.addEditCoverTypeForm.getRawValue();
    const updateSubclassCoverType: any = {
      code: null,
      coverTypeCode: this.subclassCovertype[0].coverTypeCode,
      coverTypeShortDescription: null,
      subClassCode: this.subclassCovertype[0].subClassCode,
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
    this.clauseService.updateSubclassCoverType(updateSubclassCoverType,this.subclassCovertype[0].code)
      .subscribe(res=>{
        this.globalMessagingService.displaySuccessMessage('Success','Successfully Updated' );
        console.log("on update subclass cover type", res)
      })
  }

  onMoveItems(event) {
    console.log("Event listening", event.items)
    const movedItem = event.items[0];
    console.log('subclass code', this.subclass.code)
    console.log('covertype code', this.subclassCovertype)
    console.log('moved item', movedItem)
    console.log('clause code', movedItem.clauseCode)
    this.subClassCoverTypeClauseData = [{
      code: this.subclassCovertype[0].code,
      subClassCode: this.subclass.code,
      subClassCoverTypeCode: this.subclassCovertype[0].code,
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

  loadCoverTypeClauses(code) {

    this.subclassCovertypeClauses = this.finalList;
    console.log("CoverTypeClauses", this.subclassCovertypeClauses);
    console.log("code need", this.subclassCovertype[0].code);

    this.clauseService.getSingleSubclassCovertype(code)
      .pipe(untilDestroyed(this))
      .subscribe(res=> {
        this.covertypeCode = res.code

        this.addEditCoverTypeForm.patchValue(res)

      })
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
  }

  resetSubClassCoverTypeForm() {
    this.addEditCoverTypeForm.reset();
  }

  filterSubClasses(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSubClasses = this.subclassList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

  deleteCoverTypeClauses() {
    console.log('delete', this.covertypeCode)
    this.clauseService.deleteSingleSubclassCovertype(this.covertypeCode)
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success','Successfully deleted' );
      });
  }
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

  getCoverTypes() {
    this.coverTypeService.getAllCovertypes().subscribe((data)=>{
      this.coverTypeData = data._embedded.cover_type_dto_list;
    })
  }
}
