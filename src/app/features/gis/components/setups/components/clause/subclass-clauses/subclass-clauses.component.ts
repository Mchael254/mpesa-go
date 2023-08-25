import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-subclass-clauses',
  templateUrl: './subclass-clauses.component.html',
  styleUrls: ['./subclass-clauses.component.css']
})
export class SubclassClausesComponent implements OnInit{

  subclassList:any
  isDisplayed:boolean;
  filterBy: any;
  selected: any;
  subclass:any;
  subclassForm:FormGroup;
  subclassClauses:any;
  clauseList:any;
  finalList:any= [];
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

  constructor(
    private clauseService: ClauseService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,

  ) {}

  ngOnInit(): void {
    this.loadAllSubclasses()
    this.createForm()
    this.loadClauses()
    this.mandatory = [
      { label: 'Y', value: 'Y' },
      { label: 'N', value: 'N' },


    ];
  }

  loadAllSubclasses(){
    this.clauseService.getAllSubclasses()
      .pipe(tap(() => (this.isDisplayed = true)))
      .subscribe(res=>{
      this.subclassList = res
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
  }

  loadAllSubclassClauses(code) {
    this.clauseService.getAllSubclassClauses().subscribe(res => {
      this.subclassClauses = res;
      console.log("res", res);

      const result = this.subclassClauses.filter(obj => {
        return obj.subClassCode === code;
      });

      console.log("clause code");
      for (let i of result) {
        console.log(i.clauseCode); // Access and log the clauseCode property of each item
        this.clauseService.getSingleClause(i.clauseCode).subscribe(res => {
          this.clauseList = res;
          this.finalList.push(this.clauseList);
        });
      }

      console.log("final list", this.finalList);
    });
  }


  loadSingleSubclassClause(code){
    console.log("subclass", this.subclass);
    this.clauseService.getSubclassClause(code, this.subclass.code).subscribe(res=>{
      this.singleClause = res
      this.editClauseForm.patchValue(this.singleClause)
      this.editClauseForm.controls['version'].setValue(0);

    })
  }


  loadSubclassCovertypes(code){
    this.clauseService.getSubclassCovertypeBySCode(code).subscribe(res=>{
      this.subclassCovertype = res
    })
  }
  singleSCoverType(code){
    this.clauseService.getSingleSubclassCovertype(code).subscribe(res=>{
        this.covertypeCode = res.code

        this.clauseService.getCovertypeToClauses().subscribe(res=>{
          this.covertypetoclause = res
          const result = this.covertypetoclause.filter((obj) => {
            return obj.subClassCoverTypeCode === this.covertypeCode;
          })

          this.covertypetoclauseList = result
          console.log("covertypetoclauseList", this.covertypetoclauseList)

        })
      }
    )
  }
  loadClauses(){
    this.clauseService.getAllSubclassClauses().subscribe(res=>{
      this.allClauses = res
      console.log(this.allClauses)
    })
  }
  loadsingleclause(code, subCode){
    this.clauseService.getSubclassClause(code, subCode).subscribe(res=>{
      this.data = res
    })
  }

  updateSubclassClauses(){
    console.log(this.singleClause)
    console.log(this.editClauseForm.value.clauseCode)
    this.clauseService.updateSubclassClause(this.editClauseForm.value,this.editClauseForm.value.clauseCode, this.subclass.code)
      .subscribe(res=>{
      console.log("on update subclass clauses", res)
    })
  }
}
