import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DynamicFormFields } from '../../utils/dynamic.form.fields';

@Component({
  selector: 'app-dynamic-setup-form-screen',
  templateUrl: './dynamic-setup-form-screen.component.html',
  styleUrls: ['./dynamic-setup-form-screen.component.css'],
  standalone : false
})
export class DynamicSetupFormScreenComponent {
  // selected :any;
  // editParamForm:FormGroup;
  // constructor(
  //   public fb: FormBuilder,
  //   public cdr: ChangeDetectorRef
  // ) { }

  // ngOnInit(): void {
  //   this.createClassForm();
  // }


  //  isActive(item: any) {
  // }
  // cancel(){

  //  }
  //  createClassForm(){

  //  }

  //  addParam(){

  //  }
  //  updateParam(){

  //  }




  @Input() formFields: DynamicFormFields[];
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBackButton: EventEmitter<any> = new EventEmitter<any>();
  @Output() centerButton: EventEmitter<any> = new EventEmitter<any>();
  @Input() title: string = 'Dynamic Form';
  @Input() fieldsPerRow: number = 1; // Input attribute to specify fields per row
  @Input() actionButtonConfig: any = {
    submit: { label: 'Save and Continue', visible: true, alignment: 'end' },
    back: { label: 'Back', visible: true, alignment: 'start' }
  };
  rows: any[]; // To store rows of form fields
  form:string
  @Input() dynamicForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.formFields)
    this.rows = this.chunkArray(this.formFields, this.fieldsPerRow);

    const formGroupConfig = {};
    this.formFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      formGroupConfig[field.name] = new FormControl({ value: field.value || '', disabled: field?.disabled }, validators);

    });

    this.dynamicForm = this.formBuilder.group(formGroupConfig);
  }

  onSubmitForm() {

    if (this.dynamicForm.valid) {
      const formValues = this.dynamicForm.value;
      this.formSubmitted.emit(formValues); // Emit the event with formValues
    }
  }

  onCenterButton() {
    if (this.dynamicForm.valid) {
      const formValues = this.dynamicForm.value;
      this.centerButton.emit(formValues); // Emit the event with formValues
    }
  }

  goBack() {
    if (this.dynamicForm.valid) {
      const formValues = this.dynamicForm.value;
      this.formSubmitted.emit(formValues); // Emit the event with formValues
    }
  }

  chunkArray(array: any[], chunkSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  onCenterAction(){}

}
