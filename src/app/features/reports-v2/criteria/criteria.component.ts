import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Criteria} from "../../../shared/data/reports/criteria";
import {Logger} from "../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReportServiceV2} from "../services/report.service";

const log = new Logger('CriteriaComponent')
@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit{

  @ViewChild('closebutton') closebutton;

  @Input() criteria: Criteria[]
  public shouldShowSortOption: boolean = false;

  @Output() public deleteCriteriaDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() public filter: EventEmitter<any> = new EventEmitter<any>();
  @Output() public sort: EventEmitter<any> = new EventEmitter<any>();

  public filterForm: FormGroup
  public metricConditions = [];
  public dimensionConditions = [];
  public dateConditions = [];

  public conditions = [];
  public conditionsType: string = '';

  public selectedCriterion: Criteria;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private reportService: ReportServiceV2,
  ) { }

  /**
   * 1. Initializes the component by creating a filter form
   * 2. Fetches filter conditions from report service
   */
  ngOnInit(): void {
    this.createFilterForm();
    const conditions = this.reportService.fetchFilterConditions();
    this.metricConditions = conditions.metricConditions;
    this.dimensionConditions = conditions.dimensionConditions;
    this.dateConditions = conditions.dateConditions;
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
    log.info(`selected criterion ==> `, criterion);
    this.conditions = [];
    this.selectedCriterion = criterion;
    this.conditions = criterion.category === 'metrics' ? this.metricConditions : this.dimensionConditions;
    // log.info(`conditions ==> `, this.conditions);

    if (criterion.category === 'metrics') {
      this.conditions = this.metricConditions;
      this.conditionsType = 'metrics';
    } else if (criterion.category !== 'dimensions' && criterion.category !== 'whenFilters') {
      this.conditions = this.dimensionConditions;
      this.conditionsType = 'dimensions';
    } else if (criterion.category !== 'dimensions' && criterion.category === 'whenFilters') {
      this.conditions = this.dateConditions;
      this.conditionsType = 'date';
    }
    // log.info(`conditions 2 ==> `, this.conditions);

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
    this.closebutton.nativeElement.click();
  }


  /**
   * 1. Removes filter from the selected criteria
   * 2. Emits the selected criteria to remove filter from
   */
  removeFilter(criterion) {
    const reportOptions = { filter: null, queryObject: criterion };
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
    // log.info(`sortValue | selectedCriterion | sortOptions ==> `, sortValue, this.selectedCriterion, sortOptions)
    this.sort.emit(sortOptions);
  }

  /**
   * 1. Removes sorting from the selected criterion
   * 2. Emits the sort value and selected criterion to parent component for further manipulation
   * @return void 
   */
  removeSorting(criterion): void {
    // this.selectedCriterion.sort = null;
    log.info(`critrion to remove sorting from ==> `, criterion);
    const sortOptions = {
      sortValue: null,
      queryObject: criterion
    };
    this.sort.emit(sortOptions);
  }

}
