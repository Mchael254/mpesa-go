import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DynamicFormFields} from "../../utils/dynamic.form.fields";
import {DynamicFormButtons} from "../../utils/dynamic.form.button";
import {TableDetail} from "../../data/table-detail";

@Component({
  selector: 'app-dynamic-setup-table-screen',
  templateUrl: './dynamic-setup-table-screen.component.html',
  styleUrls: ['./dynamic-setup-table-screen.component.css']
})
export class DynamicSetupTableScreenComponent implements OnInit{

  @Input() ratesList:any =[];
  @Output() saveButtonClick: EventEmitter<void> = new EventEmitter<void>();
  formFields: DynamicFormFields[];
  public buttonConfig: DynamicFormButtons;

  tableDetails: TableDetail;
  pageSize: 5;

  cols = [
    { field: 'minimum_days', header: 'From' },
    { field: 'maximum_days', header: 'To' },
    { field: 'annual_premium_rate', header: 'Annual Promotion Rule' },
    { field: 'rate_division_factor', header: 'Rate Division Factor' },
    { field: 'date_with_effect_from', header: 'WEF' },
    { field: 'date_with_effect_to', header: 'WET' },
  ];

  constructor()
  {
    this.tableDetails = {
      cols: this.cols,
      rows: this.ratesList?.content,
    }
  }

  ngOnInit(): void {
    this.formFields = this.ratesForm();
    this.buttonConfig = this.actionButtonConfig();

    this.tableDetails = {
      cols: this.cols,
      rows: this.ratesList?.content,
    }
  }

  onSaveButtonClick() {
    this.saveButtonClick.emit();
  }

  ratesForm(): DynamicFormFields[]{
    return [
      {
        name: 'from',
        label: 'From',
        type: 'text',
        required: false,
        disabled:false,
        placeholder: '',
        value: ""

      },
      {
        name: 'to',
        label: 'To',
        type: 'text',
        required: false,
        disabled:false,
        placeholder: ''
      },
      {
        name: 'annualPremiumRate',
        label: 'Annual Premium Rate',
        type: 'number',
        required: false,
        disabled:false,
        placeholder: ''
      },
      {
        name: 'rateDivisionFactor',
        label: 'Rate Division Factor',
        type: 'number',
        required: false,
        disabled:false,
        placeholder: ''
      },
      {
        name: 'wet',
        label: 'WET',
        type: 'date',
        required: false,
        disabled:false,
        placeholder: ''
      },
      {
        name: 'wef',
        label: 'WEF',
        type: 'date',
        required: false,
        disabled:false,
        placeholder: ''
      },

    ];
  }

  actionButtonConfig() : DynamicFormButtons{
    return {
      submit: { label: 'Save', visible: true, alignment: 'end' },
      back: { label: 'Cancel', visible: true, alignment: 'start' },
      center: { label: 'Center', visible: false, alignment: 'center' },

    };
  }
}
