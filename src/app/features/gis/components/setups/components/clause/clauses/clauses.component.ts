import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Clause, Record1} from "../../../data/gisDTO";
import {DynamicFormFields} from "../../../../../../../shared/utils/dynamic.form.fields";
import {DynamicFormButtons} from "../../../../../../../shared/utils/dynamic.form.button";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {interval, retryWhen, tap} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../../../../../../../shared/services/auth.service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";

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
  public filteredClauses: any;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary
  dateToday = `${this.year}-${this.month}-${this.day}`;

  formFields: DynamicFormFields[];
  public buttonConfig: DynamicFormButtons;

  constructor(
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    private clauseService: ClauseService,
    private globalMessagingService: GlobalMessagingService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
  ) { }

  /* In this method, the component performs initialization tasks such as retrieving data, setting up form controls, and
  showing a spinner. */
  ngOnInit(): void {
    this.getAllClauses();
    this.getSingleClause();
    this.createForm();
    this.spinner.show();
    // this.formFields = this.clausesForm();
    // this.buttonConfig = this.actionButtonConfig();
  }

  record: Record1 = {
    id: 1,
    name: 'Example Record',
    dateEdited: new Date(),
    editedBy: 'John Doe'
  };


  /**
   * The function creates a form.
   */
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
      updated_at: [''],
      updated_by: [''],
    })

  }

  /**
   * The isActive function checks if the selected item is equal to the given item.
   * @param {any} item - The `item` parameter is of type `any`, which means it can accept any data type.
   * @returns a boolean value indicating whether the `selected` property is equal to the `item` parameter.
   */
  isActive(item: any) {
    return this.selected === item;
  }

  //get all the clauses
  /**
   * The function `getAllClauses()` retrieves clauses from a service, assigns them to variables, and performs some
   * additional operations.
   */
  getAllClauses() {
    this.clauseService.getClauses().pipe(retryWhen((_) => interval(1000)),
      tap(() => (this.isDisplayed = true)),).subscribe(data => {
      /*this.allClauses = data._embedded.clause_dto_list.map(data => {
        let temp = data;
        temp['name'] = data.heading;
        return temp;
      });*/
      this.allClauses = data._embedded.clause_dto_list;
      this.filteredClauses = this.allClauses;
      console.log("all clauses", this.filteredClauses)
      this.spinner.hide();
      this.isDisplayed = true;
      this.cdr.detectChanges();
    })
  }
  /**
   * The function "selectedClause" logs the selected clause code, sets the clause code in the clause service, extracts the
   * date from the updatedAt parameter, and assigns the date and updatedBy parameter to the respective variables.
   * @param {any} code - The `code` parameter is the code of the selected clause.
   * @param {any} updatedAt - The `updatedAt` parameter is a variable that represents the date and time when the clause was
   * last updated.
   * @param {any} updatedBy - The `updatedBy` parameter is a value that represents the user who last updated the clause.
   */
  selectedClause(code: any, updatedAt: any, updatedBy: any) {
    console.log("this is the selected clause", code)
    this.clauseService.setClauseCode(code)
    const dateTimeStr = updatedAt ? updatedAt : '';
    const dateStr = dateTimeStr.substr(0, 10);
    this.dateEdited = dateStr
    this.editedBy = updatedBy
  }
  //get a single clause details
  /**
   * The function `getSingleClause()` retrieves a single clause from the clause service based on a selected code, and
   * updates the clause form with the retrieved data.
   */
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
  /**
   * The function "createNewClause" resets a form and sets a boolean variable to false.
   */
  createNewClause() {
    this.clauseForm.reset();
    this.isupdate = false;
  }
  /**
   * The `save()` function checks if an update is needed and either calls the `updateClause()` function or the
   * `createClause()` function and resets the form.
   */
  save() {
    if (this.isupdate) {
      this.updateClause()
    }
    else {
      this.createClause()
      this.clauseForm.reset();
    }
  }
  /**
   * The function `createClause()` creates a new clause with a random short description and various other properties, and
   * then sends a request to the server to create the clause.
   */
  createClause() {
    const loggedInUser = this.authService.getCurrentUserName()
    const randomString = Math.random().toString(36).substring(2, 5);
    const requestBody: Clause = this.clauseForm.value;
    requestBody.version = 2;
    requestBody.short_description = randomString
    requestBody.is_lien = "Y"
    requestBody.ins = "Y"
    requestBody.merge = "Y"
    requestBody.organization_code = 2
    requestBody.updated_at = this.dateToday
    requestBody.updated_by = loggedInUser
    try {
      this.clauseService.createClause(requestBody).subscribe(data => {

        this.globalMessagingService.displaySuccessMessage( 'Success', 'Successfully created' );
        console.log("Created Clause", data)
      })

    } catch (error) {
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

    }
    this.cdr.detectChanges();
  }

  /**
   * The `updateClause()` function updates a clause by sending a request to the server with the updated clause data.
   */
  updateClause() {
    const randomString = Math.random().toString(36).substring(2, 5);
    const requestBody: Clause = this.clauseForm.value;
    requestBody.code = null;
    requestBody.organization_code = 2;
    requestBody.version = 3
    requestBody.short_description = randomString
    try {
      this.clauseService.updateClause(requestBody, this.selectedCode).subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated' );
      })
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
    }

  }

  /**
   * The `reviseClause` function updates the version of a clause and sends a request to the clause service to revise the
   * clause.
   */
  reviseClause(){
    const requestBody: Clause = this.clauseForm.value
    requestBody.version = 2
    this.clauseService.reviseClause(requestBody,requestBody.code).subscribe(res =>{
      this.reviseSuccess()
    })
  }

  /**
   * The `deleteClause` function deletes a clause using the code provided in the request body and performs additional
   * actions upon successful deletion.
   */
  deleteClause(){
    const requestBody: Clause = this.clauseForm.value
    this.clauseService.deleteClause(requestBody.code).subscribe(res =>{
      this.deleteSuccess()
      this.getAllClauses();
      this.clauseForm.reset();
    })
  }
  /**
   * The function "showSuccess" displays a success message using the "globalMessagingService" with the title "Success" and
   * the content "Successfully Created".
   */
  showSuccess() {
    this.globalMessagingService.displaySuccessMessage('Success','Successfully Created' );
  }
  /**
   * The `reviseSuccess()` function displays a success message indicating that the revision was successful.
   */
  reviseSuccess() {
    this.globalMessagingService.displaySuccessMessage('Success','Successfully Revised' );
  }
  /**
   * The deleteSuccess function displays a success message indicating that the deletion was successful.
   */
  deleteSuccess() {
    this.globalMessagingService.displaySuccessMessage('Success','Successfully Deleted' );
  }
  /**
   * The function showError displays an error message using the globalMessagingService.
   */
  showError() {
    this.globalMessagingService.displayErrorMessage('Error', 'Error Occured' );
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

  /*actionButtonConfig() : DynamicFormButtons{
    return {
      submit: { label: 'Save', visible: true, alignment: 'end' },
      back: { label: 'Revise', visible: true, alignment: 'start' },
      center: { label: 'Center', visible: false, alignment: 'center' },

    };
  }*/

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
  /**
   * The function filters an array of clauses based on a search value and updates the filteredClauses array.
   * @param {any} event - The event parameter is an object that represents the event that triggered the filterClauses
   * function. It is typically an event object that contains information about the event, such as the target element that
   * triggered the event.
   */
  filterClauses(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredClauses = this.allClauses.filter((el) => el.heading.includes(searchValue));
    this.cdr.detectChanges();
  }
}
