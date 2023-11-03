import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Logger} from "../../../shared/services";
import {Criteria} from "../../../shared/data/reports/criteria";
import {FormBuilder, FormGroup} from "@angular/forms";

const log = new Logger('CriteriaPillComponent')
@Component({
  selector: 'app-criteria-pill',
  templateUrl: './criteria-pill.component.html',
  styleUrls: ['./criteria-pill.component.css']
})
export class CriteriaPillComponent implements OnInit {

  public visible: boolean = false;
  @Input() public queryObject: Criteria;
  @Output() public deleteCriteriaDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() public filter: EventEmitter<any> = new EventEmitter<any>();
  public filterForm: FormGroup

  public conditions = [
    {label: 'Greater than', value: 'greaterThan'},
    {label: 'Greater than or equal', value: 'greaterThanOrEqual'},
    {label: 'Lower than', value: 'lowerThan'},
    {label: 'Lower than or equal', value: 'lowerThanOrEqual'},
    {label: 'Equal', value: 'equal'},
    {label: 'Between', value: 'between'},
  ]
  public shouldShowSortOption: boolean = false;
  constructor(
    private fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.createFilterForm();
  }

  createFilterForm(): void {
    this.filterForm = this.fb.group({
      operator: [''],
      value: ['']
    });
  }

  selectCriteria(criteria: Criteria) {
    this.deleteCriteriaDetails.emit(criteria);
  }


  addFilter(queryObject: Criteria) {
    log.info(`criteria to filter >>> `, queryObject)
    const formValues = this.filterForm.getRawValue()
    const filter = {
      member: `${queryObject.transaction}.${queryObject.query}`,
      operator: formValues.operator,
      values: [formValues.value]
    }
    this.queryObject.filter =  `${this.queryObject.queryName} ${filter.operator} ${filter.values[0]}`
    this.filter.emit({ filter, queryObject: this.queryObject });
  }

}
