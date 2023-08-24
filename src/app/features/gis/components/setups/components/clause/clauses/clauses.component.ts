import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Clause, Record1} from "../../../data/gisDTO";
import {MessageService} from "primeng/api";
import {DynamicFormFields} from "../../../../../../../shared/utils/dynamic.form.fields";
import {DynamicFormButtons} from "../../../../../../../shared/utils/dynamic.form.button";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {interval, retryWhen, tap} from "rxjs";

enum Types {
  clause = "CL",
  warranty = "WT",
  specialConditions = "SC",
  excess = "E",
  peril = "P",
  exclusion = "EL",
  extension = "ET",
  memo = "M"
}

@Component({
  selector: 'app-clauses',
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.css']
})
export class ClausesComponent {
  allClauses: any[] = [];
  selected: any;
  isupdate: boolean = true;
  filterby: any;
  selectedCode: any;
  clauseForm: FormGroup
  singleClauseDetails: any;
  Types = Types;
  isDisplayed: boolean;
  dateEdited: any;
  editedBy: any;
  show: boolean = false;
  searchForm:FormGroup;

  formFields: DynamicFormFields[];
  public buttonConfig: DynamicFormButtons;

  constructor(
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private clauseService: ClauseService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllClauses();
    this.getSingleClause();
    this.createForm();
    // this.formFields = this.clausesForm();
    // this.buttonConfig = this.actionButtonConfig();
  }

  record: Record1 = {
    id: 1,
    name: 'Example Record',
    dateEdited: new Date(),
    editedBy: 'John Doe'
  };


  createForm() {

    const randomString = Math.random().toString(36).substring(2, 5);
    this.clauseForm = this.fb.group({
      code: new FormControl(''),
      isCurrent: new FormControl(''),
      heading: new FormControl(''),
      type: new FormControl(''),
      isEditable: new FormControl(''),
      wording: new FormControl(''),
      short_description: "randomString",
      is_lien: "string",
      ins: "string",
      merge: "string",
      organization_code: 2,
      version: 1,
      updated_at: "2022-04-12",
      updated_by: "TQUEST",
    })

  }

  isActive(item: any) {
    return this.selected === item;
  }

  //get all the clauses
  getAllClauses() {
    this.clauseService.getClauses().pipe(retryWhen((_) => interval(1000)),
      tap(() => (this.isDisplayed = true)),).subscribe(data => {
      /*this.allClauses = data._embedded.clause_dto_list.map(data => {
        let temp = data;
        temp['name'] = data.heading;
        return temp;
      });*/
      this.allClauses = data._embedded.clause_dto_list;
      console.log("all clauses", this.allClauses)
      this.isDisplayed = true;
      this.cdr.detectChanges();
    })
  }
  selectedClause(code: any, updatedAt: any, updatedBy: any) {
    console.log("this is the selected clause", code)
    this.clauseService.setClauseCode(code)
    const dateTimeStr = updatedAt ? updatedAt : '';
    const dateStr = dateTimeStr.substr(0, 10);
    this.dateEdited = dateStr
    this.editedBy = updatedBy
  }
  //get a single clause details
  getSingleClause() {
    this.clauseService.getClauseCode().subscribe(id => {
      this.selectedCode = id;
      this.clauseService.getSingleClause(this.selectedCode).subscribe(data => {
        this.singleClauseDetails = data
        console.log("this is the selected clauseee", this.singleClauseDetails)
        this.clauseForm.patchValue(this.singleClauseDetails)
        this.cdr.detectChanges();
      })
    })
  }
  createNewClause() {
    this.clauseForm.reset();
    this.isupdate = false;
  }
  save() {
    if (this.isupdate) {
      this.updateClause()
    }
    else {
      this.createClause()
      this.clauseForm.reset();
    }
  }
  createClause() {
    const randomString = Math.random().toString(36).substring(2, 5);
    const requestBody: Clause = this.clauseForm.value;
    requestBody.version = 2;
    requestBody.short_description = randomString
    requestBody.is_lien = "Y"
    requestBody.ins = "Y"
    requestBody.merge = "Y"
    requestBody.organization_code = 2
    try {
      this.clauseService.createClause(requestBody).subscribe(data => {

        this.showSuccess
        console.log("Created Clause", data)
        this.cdr.detectChanges();
      })

    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

    }

  }
  /* update clauses */

  updateClause() {
    const randomString = Math.random().toString(36).substring(2, 5);
    const requestBody: Clause = this.clauseForm.value;
    requestBody.code = null;
    requestBody.organization_code = 2;
    requestBody.version = 3
    requestBody.short_description = randomString
    try {
      this.clauseService.updateClause(requestBody, this.selectedCode).subscribe(data => {
        console.log("Updated successfully here")
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }

  }
  /**REVISE CLAUSE */
  reviseClause(){
    const requestBody: Clause = this.clauseForm.value
    requestBody.version = 2
    this.clauseService.reviseClause(requestBody,requestBody.code).subscribe(res =>{
      this.reviseSuccess()
    })
  }
  /**DELETE CLAUSE */
  deleteClause(){
    const requestBody: Clause = this.clauseForm.value
    this.clauseService.deleteClause(requestBody.code).subscribe(res =>{
      this.deleteSuccess()
    })
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created' });
  }
  reviseSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Revised' });
  }
  deleteSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted' });
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured' });
  }

/*  clausesForm(): DynamicFormFields[]{
    return [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        required: false,
        disabled:true,
        placeholder: '',
        value: ""

      },
      {
        name: 'current',
        label: 'Current',
        type: 'dropdown',
        required: false,
        disabled:false,
        placeholder: '',
        options: [
          {value: 'Y', label: 'Yes' },
          {value: 'N', label: 'No' },
        ],
      },
      {
        name: 'heading',
        label: 'Heading',
        type: 'text',
        required: false,
        disabled:false,
        placeholder: ''
      },
      {
        name: 'type',
        label: 'Type',
        type: 'dropdown',
        required: false,
        disabled:false,
        placeholder: '',
        options: [
          {value: 'CL', label: 'Clause' },
          {value: 'WA', label: 'Warranty' },
          {value: 'SP', label: 'Special Conditions' },
          {value: 'EX', label: 'Excess' },
          {value: 'PE', label: 'Peril' },
          {value: 'EC', label: 'Exclusion' },
          {value: 'ET', label: 'Extension' },
          {value: 'MM', label: 'Memo' },
        ],
      },
      {
        name: 'clauseEditable',
        label: 'Clause Editable?',
        type: 'dropdown',
        required: false,
        disabled:false,
        placeholder: '',
        options: [
          {value: 'Y', label: 'Yes' },
          {value: 'N', label: 'No' },
        ],
      },
      {
        name: 'wording',
        label: 'Wording',
        type: 'textarea',
        required: false,
        disabled:false,
        placeholder: ''
      },

    ];
  }*/

  actionButtonConfig() : DynamicFormButtons{
    return {
      submit: { label: 'Save', visible: true, alignment: 'end' },
      back: { label: 'Revise', visible: true, alignment: 'start' },
      center: { label: 'Center', visible: false, alignment: 'center' },

    };
  }

  /*receiveData(data) {

    this.show = false;
    let temp = this.clauseForm
    temp[0].value = data.code;
    temp[2].value = data.heading;
    temp[5].value = data.wording;
    this.clauseForm = temp;
    this.cdr.detectChanges();
    this.show = true;
  }*/
}
