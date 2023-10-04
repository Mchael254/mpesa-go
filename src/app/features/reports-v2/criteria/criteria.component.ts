import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Criteria} from "../../../shared/data/reports/criteria";
import {Logger} from "../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";

const log = new Logger('CriteriaComponent')
@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit{

  @Input() criteria: Criteria[]
  public shouldShowSortOption: boolean = false;

  @Output() public deleteCriteriaDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() public filter: EventEmitter<any> = new EventEmitter<any>();

  public filterForm: FormGroup
  public metricConditions = [
    {label: 'Greater than', value: 'greaterThan'},
    {label: 'Greater than or equal', value: 'greaterThanOrEqual'},
    {label: 'Lower than', value: 'lowerThan'},
    {label: 'Lower than or equal', value: 'lowerThanOrEqual'},
    {label: 'Equal', value: 'equal'},
    {label: 'Between', value: 'between'},
  ]

  public dimensionConditions = [
    {label: 'Starts with', value: 'startsWith'},
    {label: 'Contains', value: 'contains'},
    {label: 'Ends with', value: 'endsWith'},
    {label: 'Same as', value: 'sameAs'},
    {label: 'Not same', value: 'notSame'},
  ]

  public conditions = []

  public selectedCriterion: Criteria;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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

  selectCriteria(criterion: Criteria) {
    this.conditions = [];
    this.selectedCriterion = criterion;
    this.conditions = criterion.category === 'metrics' ? this.metricConditions : this.dimensionConditions;
    this.filterForm.patchValue({
      operator: this.conditions[0].value,
      value: ''
    });
    this.cdr.detectChanges();
  }

  deleteCriteria(criterion: Criteria) {
    this.deleteCriteriaDetails.emit(criterion);
  }

  addFilter() {
    const formValues = this.filterForm.getRawValue();
    const filter = {
      member: `${this.selectedCriterion.transaction}.${this.selectedCriterion.query}`,
      operator: formValues.operator,
      values: [formValues.value]
    }
    this.selectedCriterion.filter =  `${this.selectedCriterion.queryName} ${filter.operator} ${filter.values[0]}`;

    const reportOptions = {
      filter,
      queryObject: this.selectedCriterion
    }
    // log.info(`report options >>> `, reportOptions)

    this.filter.emit(reportOptions);
  }

}
