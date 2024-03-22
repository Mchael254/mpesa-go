import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-cheque-authorization',
  templateUrl: './cheque-authorization.component.html',
  styleUrls: ['./cheque-authorization.component.css']
})
export class ChequeAuthorizationComponent implements OnInit {

  public pageSize: 5;
  columnsForm: FormGroup;

  columns: any;
  public shouldShowColumnSelect: boolean = false;

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.createColumnsForm();
    this.columns = {
      refNo: true,
      date: true,
      requestDate: true,
      type: true,
      paymentMethod: true,
      narrative: true,
      bankAccount: true,
      chequeNumber: true,
      amount: true,
      payee: true,
      remarks: true
    }
  }

  createColumnsForm() {
    this.columnsForm = this.fb.group({
      refNo: [''],
      date: [''],
      requestDate: [''],
      type: [''],
      paymentMethod: [''],
      narrative: [''],
      bankAccount: [''],
      chequeNumber: [''],
      amount: [''],
      payee: [''],
      remarks: ['']
    })
  }

  showHideColumn(event) {
    const column = event.target.value;
    this.columns[column] = !this.columns[column]
    console.log(column, this.columns);
  }

  showSelectedColumns() {
    const formValues = this.columnsForm.getRawValue();
    this.columns = { ...formValues }
    // {refNo: true, date: true, requestDate: true}
    console.log(formValues)
  }

  showColumnSelect() {
    this.shouldShowColumnSelect = !this.shouldShowColumnSelect;
    // console.info(`clicked`, this.shouldShowColumnSelect)
  }
  closeColumnSelect(): void {
    this.shouldShowColumnSelect = false;
  }
}
