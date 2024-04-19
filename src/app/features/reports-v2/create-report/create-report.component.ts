import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../shared/data/common/BreadCrumbItem";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReportService} from "../../reports/services/report.service";
import {Logger} from "../../../shared/services";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {Metrics, SubjectAreaCategory} from "../../../shared/data/reports/subject-area-category";
import {take} from "rxjs/operators";
import {Criteria} from "../../../shared/data/reports/criteria";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {ReportServiceV2} from "../services/report.service";
import { ReportV2 } from '../../../shared/data/reports/report';
import { AuthService } from '../../../shared/services/auth.service';
import { tap } from 'rxjs';
import { ChatBotComponent } from '../chat-bot/chat-bot.component';
import {Profile} from "../../../shared/data/auth/profile";

const log = new Logger('CreateReportComponent');
@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {

  @ViewChild(ChatBotComponent) chatBot: ChatBotComponent

  createReportBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Criteria',
      url: 'reportsv2/create-report'
    },
    {
      label: 'Preview',
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
  public dimensions = [];
  public filteredDimensions = [];
  public isCriteriaButtonActive: boolean = true;
  reportName: string = '';
  reportNameRec: string = 'Report Name';
  metrics: any = {};
  filteredMetrics: any = [];
  filters: any = [];
  sort: any = [];
  subCategoryCategoryAreas: any[] = [];
  public shouldShowContinueButton: boolean = false;
  public selectedReport: ReportV2;
  public reportId: number;

  private currentUser: Profile;
  public showChatBot: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private reportServiceV2: ReportServiceV2,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Initializes the component by:
   * 1. Creating search form
   * 2. Getting a list of subject areas
   * 3. Check if reportId exist or if navigation was from preview screen and fetch report
   * @return void
   */
  ngOnInit(): void {
    const isFromPreview = this.activatedRoute.snapshot.queryParams['fromPreview'];
    this.reportId = +this.activatedRoute.snapshot.params['id'];
    const reportParams = this.sessionStorageService.getItem(`reportParams`);

    if (isFromPreview && reportParams) {
      this.criteria = reportParams.criteria;
      this.filters = reportParams.filters;
      this.sort = reportParams.sort;
      this.reportNameRec = reportParams.reportNameRec;
    } else if (this.reportId) {
      // this.getReport(this.reportId)
    }
    this.getSubjectAreas();
    this.createSearchForm();
    this.currentUser = this.authService.getCurrentUser();
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
   * 1. gets a specific report by it's id
   * 2. extracts measures, dimensions, filters from report
   * 3. creates criteria array from #2 above
   * @param id of type number
   * @return void
   */
  // getReport(id: number): void {
  //   this.reportServiceV2.getReportById(id)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (res) => {
  //         this.selectedReport = res;
  //         this.measures = JSON.parse(res.measures);
  //         this.dimensions = JSON.parse(res.dimensions);
  //         this.filters = JSON.parse(res.filter);
  //         this.criteria = [...this.measures, ...this.dimensions];
  //         this.reportNameRec = res.name;
  //         log.info(`report >>> `, res, this.measures, this.dimensions, this.filters);
  //       },
  //       error: (e) => { log.info(`error >>>`, e)}
  //     })
  // }

  /**
   * The function `getCategoriesBySubjectAreaId` retrieves categories based on a subject area ID and updates the selected
   * subject area, subject area categories, metrics, and filters accordingly.
   * @param {SubjectArea} s - The parameter "s" in the function "getCategoriesBySubjectAreaId" represents an object of type
   * "SubjectArea".
   */
  getCategoriesBySubjectAreaId(s: SubjectArea): void {
    this.selectedSubjectArea = s.subjectAreaName;
    this.subjectAreaCategories = null;
    this.showSubjectAreas = false;
    this.searchForm.reset();
    this.reportService.getCategoriesBySubjectAreaId(s.id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.subjectAreaCategories = res;
          log.info(`subjectAreaCategories>>>`, this.subjectAreaCategories);

          const metrics = res.filter((item) => item.name === 'Metrics');
          // log.info('metrics >>>>',metrics[0]);
          this.metrics = metrics[0];
          this.filteredMetrics = this.metrics?.subCategory;

          const dimensions = res.filter((item) => item.name !== 'Metrics');
          // log.info('dimensions >>>', dimensions);
          this.dimensions = dimensions;
          this.filteredDimensions = this.dimensions;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
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
    .pipe(take(1))
    .subscribe({
      next: (res) => {
        this.subjectAreas = res;
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.message);
      }
    })
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

    // console.log(`category<metrics> ==> `, category);
    // console.log(`subCategory ==> `, subCategory);
    // console.log(`query ==> `, query);
    // console.log(`queryObject ==> `, this.queryObject);

    const criterion = `${this.queryObject.transaction}.${this.queryObject.query}`;
    const checkCriterion = this.checkIfCriterionExists(criterion, this.measures, this.dimensions);
    if (checkCriterion) {
      const detail = `${this.queryObject.queryName} already selected.`;
      this.globalMessagingService.displayErrorMessage('error', detail);
      return;
    }

    this.criteria.push(this.queryObject);
    this.splitDimensionsAndMeasures(this.queryObject);
    this.shouldShowContinueButton = true;
    // console.log(`criteria ==> `, this.criteria);
    // console.log(`===============================`)
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


  /**
   * Deletes a criterion from the list of criteria
   * @param criteria of type criteria
   */
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

    let filterToRemove, filterToRemoveIndex;
    this.filters.forEach((filter, index) => {
      log.info(`filter >>>`, filter)
      if (filter.member === criteriaToRemove) {
        filterToRemove = filter;
        filterToRemoveIndex = index;
        log.info(`found one >>> `, filterToRemove, filterToRemoveIndex)
      }
    });
    this.filters.splice(filterToRemoveIndex, 1);

  }

  updateSubCategoryCategoryAreas(subCategoryElement: any[]): void {
    this.subCategoryCategoryAreas = subCategoryElement;
  }

  /**
   * 1. creates a report parameters and save to session storage for use on next screen
   * 2. navigate to report-preview screen
   */
  // viewPreview(): void {
  //   const reportParams = {
  //     criteria: this.criteria,
  //     reportNameRec: this.reportNameRec,
  //     filters: this.filters,
  //     sort: this.sort,
  //   }
  //   this.sessionStorageService.setItem(`reportParams`, reportParams);
  //   this.router.navigate(['/home/reportsv2/preview'])
  // }

  viewPreview(): void {
    // const reportNameRec = this.reportName === '' ? this.selectedReport?.name : '';

    let filters = [];
    if (this.filters.length > 0) {
      this.filters.forEach(filter => filters.push(filter.filter));
    } else if(this.selectedReport?.filter) {
      filters = JSON.parse(this.selectedReport?.filter)
    }

    const reportParams = {
      criteria: this.criteria,
      reportNameRec: this.reportNameRec,
      filters,
      sort: this.sort || this.selectedReport.sort,
      dashboardId: this.selectedReport?.dashboardId,
      folder: this.selectedReport?.folder,
      charts: this.selectedReport?.charts,
      createdBy: this.selectedReport?.createdBy,
    }
    this.sessionStorageService.setItem(`reportParams`, reportParams);
    log.info(`report params >>>`, reportParams);

    const measures = this.criteria.filter(measure => measure.category === 'metrics');
    const dimensions = this.criteria.filter(measure => measure.category !== 'metrics');

    // let charts = [{
    //   backgroundColor: "",
    //   borderColor: "",
    //   chartReportId: 0,
    //   colorScheme: 0,
    //   evenColor: "",
    //   evenOddAppliesTo: "",
    //   //id: 0, // 16685487
    //   length: 0,
    //   name: "",
    //   oddColor: "",
    //   order: 0,
    //   type: 'table',
    //   width: 0
    // }]

    const filter = filters.length > 0 ? JSON.stringify(filters) : '';

    const report: ReportV2 = {
      charts: [],
      createdBy: this.currentUser.code,
      createdDate: '',
      dashboardId: null,
      dimensions: JSON.stringify(dimensions),
      filter,
      folder: 'M',
      // id: null,
      length: 0,
      measures: JSON.stringify(measures),
      name: this.reportNameRec,
      order: 0,
      width: 0,
      sort: JSON.stringify(this.sort)
    }

    this.createReport(report);
  }


  createReport(report: ReportV2): void {
    log.info(`created report >>> `, report);
    this.reportServiceV2.createReport(report)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.reportId = res.id;
          this.router.navigate([`/home/reportsv2/preview/${this.reportId}`],
            { queryParams: { isEditing: false }});
          log.info(`created report >>> `, res);
        },
        error: (e) => {
          this.globalMessagingService.displayErrorMessage('error', `${e.status}: ${e.message}`);
        }
      });
  }

  /**
   *1. update the filter array based on selected filter
   * @param filter
   * @return void
   */
  updateFilter(filter): void {
    log.info(`filter to save ==> `, filter);
    this.criteria.forEach((criterion) => {
      console.log(`criterion ==> `, criterion, criterion.query == filter.queryObject.query)
      if (criterion.query == filter.queryObject.query && filter.filter !== null) {
        criterion.filter = filter.queryObject.filter
        this.filters.push(filter)
        console.log(`pushing filter to this.filters ==> `, this.filters)
      } else if (criterion.query == filter.queryObject.query && filter.filter === null) {
        this.filters = this.filters.filter(item => item.queryObject.queryName === filter.queryObject.queryName ? null : item);
        delete criterion.filter
      }
    });
    log.info(`filter >>> `, this.filters);
    // this.loadChart();
  }

  /**
   *1. update the sort array based on selected sort
   * @param sort
   * @return void
   */
  updateSort(sort): void {
    this.criteria.forEach((criterion, i) => {
      if (criterion.query == sort?.queryObject?.query && sort.sortValue !== null) {
        criterion.sort = sort.queryObject.sort
        this.sort.push(JSON.stringify(sort.sortValue))
      } else if (criterion.query === sort?.queryObject?.query && sort.sortValue === null) {
        this.sort = this.sort.filter(item => {
          const sortItem = JSON.parse(item);
          // console.log(sortItem, `${sort.queryObject.transaction}.${this.queryObject.query}`);
          return sortItem[0] !== `${this.queryObject.transaction}.${this.queryObject.query}` ? item : null
        });
        delete criterion.sort
      }
    });
    log.info(`sort >>> `, this.sort);
  }

  /**
   * Calls a method in the child component (ChatBotComponent) to show the chat window
   * @returns void
   */
  showAIBot(): void {
    this.chatBot.showAIBot()
  }

  /**
   * Filters the metrics and dimensions and returns filtered result
   * returns the filtered value (metrics || dimensions)
   * @param event: HTML event
   * @param arr: event to be filtered (metrics || dimensions)
   * @param filterType the array type that is being filtered (metrics || dimensions)
   * @returns void
   */
  filterMetricsAndDimensions(event: any, arr: any, filterType: string): void {
    const filterValue = event.target.value;
    const subCategory = arr;
    const filteredResult = subCategory.filter(s => (
      s.name.toLowerCase()).includes(filterValue.toLowerCase()) ? s : null);

    filterType === 'metrics' ? this.filteredMetrics = filteredResult : this.filteredDimensions = filteredResult;
  }

}
