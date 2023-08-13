import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DynamicFormFields } from '../../utils/dynamic.form.fields';

@Component({
  selector: 'app-dynamic-form-modal',
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.css']
})
export class DynamicFormModalComponent {
  @Input() modalVisible: boolean;
  @Input() formFields: DynamicFormFields[];
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Input() title: string = 'Dynamic Form';
  @Input() fieldsPerRow: number = 1; // Input attribute to specify fields per row
  rows: any[]; // To store rows of form fields
  dynamicForm: FormGroup;
  @Output() actionEmitter: EventEmitter<void> = new EventEmitter<void>();

  emitAction() {
    this.actionEmitter.emit();
    this.modalVisible = false;
  }



  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
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
        this.modalVisible = false;
        this.actionEmitter.emit();

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

}
