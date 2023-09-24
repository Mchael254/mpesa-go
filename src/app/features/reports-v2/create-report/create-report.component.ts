import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BreadCrumbItem} from "../../../shared/data/common/BreadCrumbItem";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReportService} from "../../reports/services/report.service";
import {Logger} from "../../../shared/services";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {Metrics, SubjectAreaCategory} from "../../../shared/data/reports/subject-area-category";
import {take} from "rxjs/operators";
import {Criteria} from "../../../shared/data/reports/criteria";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";

const log = new Logger('CreateReportComponent');
@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {

  createReportBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Criteria',
      url: '/reportsv2/create-report'
    },
    {
      label: 'Configure',
      url: '',
    },
  ];
  public searchForm: FormGroup;
  public subjectAreas: SubjectArea[] = [];
  public selectedSubjectArea: string = null;
  public subjectAreaCategories: SubjectAreaCategory[] = [];
  public showSubjectAreas: boolean = false;
  public queryObject: Criteria = {};
  public criteria: Criteria[] = [];
  public measures: string[] = [];
  public dimensions: string[] = [];
  public isCriteriaButtonActive: boolean = true;
  reportName: string = '';
  reportNameRec: string = '';
  metrics: any = {};
  filters: any = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService,
    private globalMessagingService: GlobalMessagingService,
  ) {}

  ngOnInit(): void {
    this.getSubjectAreas();
    this.createSearchForm();
  }

  /**
   * The function creates a search form using the FormBuilder module in Angular.
   */
  createSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      subjectArea: ['']
    });
  }

  /**
   * The function `getCategoriesBySubjectAreaId` retrieves categories based on a subject area ID and updates the selected
   * subject area, subject area categories, metrics, and filters accordingly.
   * @param {SubjectArea} s - The parameter "s" in the function "getCategoriesBySubjectAreaId" represents an object of type
   * "SubjectArea".
   */
  getCategoriesBySubjectAreaId(s: SubjectArea): void {
    console.log(`subject area from click`, s)
    this.selectedSubjectArea = s.subjectAreaName;
    // this.subjectAreaCategories = null;
    this.showSubjectAreas = false;
    this.searchForm.reset();
    this.reportService.getCategoriesBySubjectAreaId(s.id)
      .pipe(take(1))
      .subscribe(res => {
        this.subjectAreaCategories = res;
        log.info(`subjectAreaCategories>>>`, this.subjectAreaCategories);

        const metrics = res.filter((item) => item.name === 'Metrics');
        log.info('>>>>',metrics[0]);
        this.metrics = metrics[0];

        const filters = res.filter((item) => item.name !== 'Metrics');
        log.info('filters',filters);
        this.filters = filters;

        this.cdr.detectChanges();
      });
  }

  /**
   * The function updates the value of reportNameRec based on the change in reportName.
   * @param {any} event
   */
  onReportNameChange(event: any) {
    // Handle the change in reportName and populate reportNameRec accordingly
    this.reportNameRec = event.target.value;
  }
  /**
   * The function "getSubjectAreas" retrieves subject areas from a report service and logs them.
   */
  getSubjectAreas(): void {
    this.reportService.getSubjectAreas()
      .subscribe((res) => {
        this.subjectAreas = res;
        log.info(`all Subject Areas >>>`, this.subjectAreas);
      });
  }
  /**
   * The function `selectCriteria` takes in a category, subcategory, and query, and adds them to a criteria array if they
   * do not already exist.
   * @param category - The category parameter represents the selected category. It has two properties: description and
   * name. The description property describes the category, while the name property represents the name of the category.
   * @param subCategory - The subCategory parameter is an object that represents a subcategory. It has the following
   * properties:
   * @param query - The `query` parameter is an object that contains the following properties:
   * @returns The function does not have a return statement.
   */
  selectCriteria(category, subCategory, query): void {

    this.queryObject = {
      category: category.description,
      categoryName: category.name,
      subcategory: subCategory.description,
      subCategoryName: subCategory.name,
      transaction: subCategory.value,
      query: query.value,
      queryName: query.name
    }

    const criterion = `${this.queryObject.transaction}.${this.queryObject.query}`;
    const checkCriterion = this.checkIfCriterionExists(criterion, this.measures, this.dimensions);
    if (checkCriterion) {
      const detail = `${this.queryObject.query} already selected.`;
      this.globalMessagingService.displayErrorMessage('error',detail);
      return;
    }

    this.criteria.push(this.queryObject);
    this.splitDimensionsAndMeasures(this.queryObject);
  }

  /**
   * The function splits a query object into dimensions and measures based on its category.
   * @param {Criteria} queryObject - The queryObject parameter is an object that contains the following properties:
   */
  splitDimensionsAndMeasures(queryObject: Criteria): void {
    const criterion = `${queryObject.transaction}.${queryObject.query}`;
    if (queryObject.category === 'metrics') {
      this.measures.push(criterion);
    } else {
      this.dimensions.push(criterion);
    }
  }

  /**
   * The function checks if a given criterion exists in either the measures or dimensions array.
   * @param criterion - The criterion parameter is the value that we want to check if it exists in the measures or
   * dimensions arrays.
   * @param measures - An array of measures (e.g. ["sales", "revenue", "profit"])
   * @param dimensions - The "dimensions" parameter is an array that contains a list of dimensions.
   * @returns a boolean value. It returns true if the criterion exists in either the measures or dimensions array, and
   * false otherwise.
   */
  checkIfCriterionExists(criterion, measures, dimensions): boolean {
    if (measures.indexOf(criterion) === -1 && dimensions.indexOf(criterion) === -1 ) {
      return false;
    } else {
      return true;
    }
  }


  deleteCriteria(criteria: Criteria): void {
    const index = this.criteria.indexOf(criteria);
    if (index > -1) {
      this.criteria.splice(index, 1);
    }

    const criteriaToRemove = `${criteria.transaction}.${criteria.query}`
    if (criteria.category === 'metrics') {
      const index = this.measures.indexOf(criteriaToRemove);
      this.measures.splice(index, 1);
    } else {
      const index = this.dimensions.indexOf(criteriaToRemove);
      this.dimensions.splice(index, 1);
    }

  }
}
