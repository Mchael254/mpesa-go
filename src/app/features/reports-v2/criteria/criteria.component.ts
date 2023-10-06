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
  @Output() public sort: EventEmitter<any> = new EventEmitter<any>();

  public filterForm: FormGroup
  public metricConditions = [
    {label: 'Greater than', value: 'gt'},
    {label: 'Greater than or equal', value: 'gte'},
    {label: 'Lower than', value: 'lt'},
    {label: 'Lower than or equal', value: 'lte'},
    {label: 'Equals', value: 'equals'},
    {label: 'Not equals', value: 'notEquals'},
    {label: 'Between', value: 'between'},
  ];

  public dimensionConditions = [
    {label: 'Starts with', value: 'startsWith'},
    {label: 'Contains', value: 'contains'},
    {label: 'Not contains', value: 'notContains'},
    {label: 'Ends with', value: 'endsWith'},
  ];

  public dateConditions = [
    {label: 'In date range', value: 'inDateRange'},
    {label: 'Not in date range', value: 'inDateRange'},
    {label: 'Before date', value: 'beforeDate'},
    {label: 'After date', value: 'afterDate'},
  ]

  public conditions = []

  public selectedCriterion: Criteria;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Initializes the component by creating a filter form
   */
  ngOnInit(): void {
    this.createFilterForm();
  }

  /**
   * Creates a filter form
   */
  createFilterForm(): void {
    this.filterForm = this.fb.group({
      operator: [''],
      value: ['']
    });
  }

  /**
   * Selects a criteria for the purpose of filtering or sorting
   * Determines which condition to apply depending on criteria category
   * @param criterion of type Criteria
   */
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

  /**
   * Deletes a criterion
   * @param criterion
   */
  deleteCriteria(criterion: Criteria) {
    this.deleteCriteriaDetails.emit(criterion);
  }

  /**
   * 1. constructs a filter based on selected criteria and filter form values
   * 2. Adds the filter to the filters array
   * 3. Emits the filter & selected criteria to parent component for further manipulation
   */
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
    this.filter.emit(reportOptions);
  }

  /**
   * 1. creates a sort object within an array from selected criterion & selected sort type
   * 2. Emits the sort value and selected criterion to parent component for further manipulation
   * @param sort string
   * @return void
   */
  addSorting(sort: string): void {
    const sortValue = [
      `${this.selectedCriterion.transaction}.${this.selectedCriterion.query}`,
      `${sort}`
    ];
    this.selectedCriterion.sort = `Sort order: ${sort}`;
    const sortOptions = {
      sortValue,
      queryObject: this.selectedCriterion
    };
    this.sort.emit(sortOptions);
  }

}
