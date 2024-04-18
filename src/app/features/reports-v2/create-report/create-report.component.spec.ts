import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportComponent } from './create-report.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {MessageService} from "primeng/api";
import {AuthService} from "../../../shared/services/auth.service";
import {AppConfigService} from "../../../core/config/app-config-service";
import {ActivatedRoute} from "@angular/router";
import {ReportService} from "../../reports/services/report.service";
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../shared/data/web-admin";
import {createSpyObj} from "jest-createspyobj";
import {DynamicBreadcrumbComponent} from "../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {DropdownModule} from "primeng/dropdown";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
      cubejsDefaultUrl: `http://10.176.18.211:4000/cubejs-api/v1`
    };
  }
}

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
}

export class MockActivatedRoute {
  testParams = {reportId: 1}
  queryParams = of(this.testParams)
  get snapshot() {
    return { params: this.testParams, queryParams: this.testParams };
  }
}

describe('CreateReportComponent', () => {

  const reportServiceStub = createSpyObj('ReportService', [
    'getReports', 'getSubjectAreas', 'getCategoriesBySubjectAreaId'
  ]);

  let component: CreateReportComponent;
  let fixture: ComponentFixture<CreateReportComponent>;

  let authService: AuthService;
  let appConfigService: AppConfigService;
  let globalMessagingServiceStub: GlobalMessagingService;

  const subjectAreas: SubjectArea[] = [
    {
      id: 1,
      subjectAreaName: 'General Insurance Underwriting'
    }
  ];

  beforeEach(() => {
    jest.spyOn(reportServiceStub, 'getSubjectAreas' ).mockReturnValue(of(subjectAreas));
    // jest.spyOn(reportServiceStub, 'getCategoriesBySubjectAreaId' ).mockReturnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [
        CreateReportComponent,
        DynamicBreadcrumbComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
    ],
      providers: [
        GlobalMessagingService,
        MessageService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute},
        { provide: ReportService, useValue: reportServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CreateReportComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    appConfigService = TestBed.inject(AppConfigService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch and set categories correctly', () => {
    const subjectArea = { id: 1, subjectAreaName: 'General Insurance Underwriting' };
    
    const mockResponse = [
      {
        id: 0,
        name: 'Premium',
        subjectAreaId: 0,
        subCategory: {
          code: 0,
          name: 'Premium amount',
          queryName: 'query',
          description: 'premium description',
          categoryAreas: [],
        },
        description: 'string',
      }
    ];

    // Create a spy on the service method to return the mock response
    const getCategoriesSpy = jest.spyOn(reportServiceStub, 'getCategoriesBySubjectAreaId').mockReturnValue(of(mockResponse));

    component.getCategoriesBySubjectAreaId(subjectArea);

    // Expectations
    expect(getCategoriesSpy).toHaveBeenCalledWith(subjectArea.id);
    // expect(component.subjectAreaCategories).toEqual(mockResponse);
  });

  test('should add criteria when criterion does not exist', () => {
    // Mock data
    const category = { name: 'Category Name', description: 'Category Description' };
    const subCategory = { name: 'Subcategory Name', description: 'Subcategory Description', value: 'Subcategory Value' };
    const query = { name: 'Query Name', value: 'Query Value' };

    // Spy on the checkIfCriterionExists method
    const checkIfCriterionExistsSpy = jest.spyOn(component, 'checkIfCriterionExists').mockReturnValue(false);

    // Call the selectCriteria method
    component.selectCriteria(category, subCategory, query);

    // Expectations
    expect(checkIfCriterionExistsSpy).toHaveBeenCalledWith(`${subCategory.value}.${query.value}`, component.measures, component.dimensions);
    // expect(component.criteria).toContain({
    //   category: category.description,
    //   categoryName: category.name,
    //   subcategory: subCategory.description,
    //   subCategoryName: subCategory.name,
    //   transaction: subCategory.value,
    //   query: query.value,
    //   queryName: query.name
    // });
    expect(component.criteria.length).toBeGreaterThan(0);
  });

  test('should display an error message when the criterion already exists', () => {
    // Mock data
    const category = { name: 'Category Name', description: 'Category Description' };
    const subCategory = { name: 'Subcategory Name', description: 'Subcategory Description', value: 'Subcategory Value' };
    const query = { name: 'Query Name', value: 'Query Value' };

    // Mock the checkIfCriterionExists method to return true (criterion already exists)
    jest.spyOn(component, 'checkIfCriterionExists').mockReturnValue(true);

    // Spy on the globalMessagingService.displayErrorMessage method
    const displayErrorMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');

    // Call the selectCriteria method
    component.selectCriteria(category, subCategory, query);

    // Expectations
    expect(displayErrorMessageSpy).toHaveBeenCalledWith('error', `${query.value} already selected.`);
    expect(component.criteria.length).toBe(0); // Criteria should not be added
  });
});
