import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../shared/data/common/BreadCrumbItem";
import {FormBuilder, FormGroup} from "@angular/forms";
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
import { ReportV2 } from 'src/app/shared/data/reports/report';
import { AuthService } from 'src/app/shared/services/auth.service';
import { tap } from 'rxjs';

const log = new Logger('CreateReportComponent');
@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {

  @ViewChild("queryTerm") queryTermField: ElementRef;

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
  public chatForm: FormGroup;
  public subjectAreas: SubjectArea[] = [];
  public selectedSubjectArea: string = null;
  public subjectAreaCategories: SubjectAreaCategory[] = [];
  public showSubjectAreas: boolean = false;
  public queryObject: Criteria = {};
  public criteria: Criteria[] = [];
  public measures: string[] = [];
  public dimensions = [];
  public isCriteriaButtonActive: boolean = true;
  reportName: string = '';
  reportNameRec: string = '';
  metrics: any = {};
  filters: any = [];
  sort: any = [];
  subCategoryCategoryAreas: any[] = [];
  public shouldShowContinueButton: boolean = false;
  public selectedReport: ReportV2;
  public reportId: number;

  private currentUser;

  public shouldShowChatBot: boolean = false;
  public conversations: ChatMessage[] = [];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private reportServiceV2: ReportServiceV2,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
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
      this.getReport(this.reportId)
    }
    this.getSubjectAreas();
    this.createSearchForm();
    this.createChatForm();
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
   * The function creates a chat form using the FormBuilder module in Angular.
   */
  createChatForm(): void {
    this.chatForm = this.fb.group({
      queryTerm: ['']
    });
  }
  

  /**
   * 1. gets a specific report by it's id
   * 2. extracts measures, dimensions, filters from report
   * 3. creates criteria array from #2 above
   * @param id of type number
   * @return void
   */
  getReport(id: number): void {
    this.reportServiceV2.getReportById(id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.selectedReport = res;
          this.measures = JSON.parse(res.measures);
          this.dimensions = JSON.parse(res.dimensions);
          this.filters = JSON.parse(res.filter);
          this.criteria = [...this.measures, ...this.dimensions];
          this.reportNameRec = res.name;
          log.info(`report >>> `, res, this.measures, this.dimensions, this.filters);
        },
        error: (e) => { log.info(`error >>>`, e)}
      })
  }

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

          const dimensions = res.filter((item) => item.name !== 'Metrics');
          // log.info('dimensions >>>', dimensions);
          this.dimensions = dimensions;
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

    const criterion = `${this.queryObject.transaction}.${this.queryObject.query}`;
    const checkCriterion = this.checkIfCriterionExists(criterion, this.measures, this.dimensions);
    if (checkCriterion) {
      const detail = `${this.queryObject.query} already selected.`;
      this.globalMessagingService.displayErrorMessage('error',detail);
      return;
    }

    this.criteria.push(this.queryObject);
    this.splitDimensionsAndMeasures(this.queryObject);
    this.shouldShowContinueButton = true;
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
    const reportNameRec = this.reportName === '' ? this.selectedReport?.name : ''

    const reportParams = {
      criteria: this.criteria,
      reportNameRec: this.reportNameRec,
      filters: this.filters || this.selectedReport.filter,
      sort: this.sort || this.selectedReport.sort,
      dashboardId: this.selectedReport?.dashboardId,
      folder: this.selectedReport?.folder,
      charts: this.selectedReport?.charts,
      createdBy: this.selectedReport?.createdBy,
    }
    this.sessionStorageService.setItem(`reportParams`, reportParams);
    log.info(`report params >>>`, reportParams)

    const measures = this.criteria.filter(measure => measure.category === 'metrics');
    const dimensions = this.criteria.filter(measure => measure.category !== 'metrics');

    let charts = [{
      backgroundColor: "",
      borderColor: "",
      chartReportId: 0,
      colorScheme: 0,
      evenColor: "",
      evenOddAppliesTo: "",
      //id: 0, // 16685487
      length: 0,
      name: "",
      oddColor: "",
      order: 0,
      type: 'table',
      width: 0
    }]

    const filter = this.filters.length > 0 ? JSON.stringify(this.filters) : '';

    const report: ReportV2 = {
      charts: [],
      createdBy: this.currentUser.id,
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
      width: 0
    }

    this.createReport(report);

    // if(isNaN(this.reportId)) {
    //   this.router.navigate(['/home/reportsv2/preview']);
    // } else {
    //   this.router.navigate([`/home/reportsv2/preview/${this.reportId}`]);
    // }
    
  }


  createReport(report: ReportV2): void {
    this.reportServiceV2.createReport(report)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          // this.globalMessagingService.displaySuccessMessage('success', 'Report successfully saved')
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
    this.criteria.forEach((criterion) => {
      if (criterion == filter.queryObject) {
        criterion.filter = filter.queryObject.filter
        this.filters.push(filter)
      }
    });
    log.info(`filter >>> `, filter, this.filters);
    // this.loadChart();
  }

  /**
   *1. update the sort array based on selected sort
   * @param sort
   * @return void
   */
  updateSort(sort): void {
    this.criteria.forEach((criterion) => {
      if (criterion == sort.queryObject) {
        criterion.sort = sort.queryObject.sort
        this.sort.push(sort.sortValue)
      }
    });
    log.info(`sort >>> `, sort)
    // this.loadChart();
  }


  showAIBot(): void {
    this.shouldShowChatBot = !this.shouldShowChatBot;
    setTimeout(() => {
      this.conversations.push({
        user: 'bot',
        message: 'Welcome to our Reports Section! I\'m here to assist you in exploring and generating insightful reports.'
       });
    }, 1000)
  }

  clearChat(): void {
    this.conversations = [];
  }

  closeChatBox() {
    this.shouldShowChatBot = false;
  }

  getQueryResult() {
    const queryTerm = this.chatForm.getRawValue().queryTerm;
    log.info(`query term: `, queryTerm);
    this.conversations.push(
      {
        message: queryTerm,
        user: 'me'
      },
      {
        message: 'loading...',
        user: 'bot'
      }
    );

    this.chatForm.patchValue({queryTerm: ''})

    this.reportServiceV2.aiBotQuestion(queryTerm)
    .pipe(
      take(1),
      tap((res) => {
        console.log(`aibot feedback >>>`, res)
      })
      )
    .subscribe({
      next: (res) => {
        this.conversations.pop();
        this.conversations.push({
          message: res.result,
          user: 'bot'
        });
      },
      error: (err) => {
        let errorMessage = '';
        if (err.error.message) {
          errorMessage = err.error.message
        } else {
          errorMessage = err.message
        }
        this.conversations.pop();
        this.conversations.push({
          message: "Chat service currently unavailable.",
          user: 'bot'
        });
        this.globalMessagingService.displayErrorMessage('Error', errorMessage)
      }
    })
  }
  

}

interface ChatMessage {
  message: string,
  user: string
}
