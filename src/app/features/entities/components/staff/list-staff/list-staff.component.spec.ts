import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { ListStaffComponent } from './list-staff.component';
import {StaffService} from "../../../services/staff/staff.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {
  DynamicBreadcrumbComponent
} from "../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {RouterTestingModule} from "@angular/router/testing";
import {TableModule} from "primeng/table";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {DynamicTableComponent} from "../../../../../shared/components/dynamic-table/dynamic-table.component";
import {of, throwError} from "rxjs";
import {newStaffDto, staffData, staffDto} from "../../../data/staffTestData/staffTestData";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../shared/services/auth.service";
import {BrowserStorage} from "../../../../../shared/services/storage";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {
  MockAppConfigService,
  MockAuthService,
  MockBrowserStorage,
  MockGlobalMessagingService,
  MockLocalStorageService
} from "../new-staff/new-staff.component.spec";
import {SortFilterService} from "../../../../../shared/services/sort-filter.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {StaffDto} from "../../../data/StaffDto";
import {LazyLoadEvent} from "primeng/api";

const staffDtoPagination: Pagination<StaffDto> = {
  first: true, last: true, number: 2, numberOfElements: 2, size: 5, totalPages: 1,
  content: staffData,
  totalElements: 2
};

const indivDataPagination: Pagination<StaffDto> = {
  first: true, last: true, number: 1, numberOfElements: 1, size: 5, totalPages: 1,
  content: [staffData[0]],
  totalElements: 1
};

const groupDataPagination: Pagination<StaffDto> = {
  first: true, last: true, number: 1, numberOfElements: 1, size: 5, totalPages: 1,
  content: [staffData[1]],
  totalElements: 1
};

export class MockStaffService{
  getStaff = jest.fn().mockImplementation((page, size, userType, sortList, order, supervisor) => {
    if(userType === 'G') return groupDataPagination;
    return indivDataPagination;
  });

  newStaffObservable = of(newStaffDto);
  setNewStaffAccount = jest.fn();
}

export class MockSortFilterService {

}

describe('ListStaffComponent', () => {
  let component: ListStaffComponent;
  let staffServiceStub: StaffService;
  let formBuilderStub: FormBuilder;
  let routerStub: Router;
  let spinnerStub: NgxSpinnerService;

  let fixture: ComponentFixture<ListStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TableModule,NgxSpinnerModule.forRoot(), HttpClientTestingModule,
        FormsModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [ListStaffComponent, DynamicBreadcrumbComponent, DynamicTableComponent],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessagingService },
        {provide: AuthService, useClass: MockAuthService},
        {provide: StaffService, useClass: MockStaffService},
        {provide: BrowserStorage, useClass: MockBrowserStorage},
        {provide: LocalStorageService, useClass: MockLocalStorageService},
        {provide: AppConfigService, useClass: MockAppConfigService},
        {provide: SortFilterService, useClass: MockSortFilterService} ,
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    });
    fixture = TestBed.createComponent(ListStaffComponent);
    routerStub = TestBed.inject(Router);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    staffServiceStub = TestBed.inject(StaffService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with staff data', () => {
    const getStaffDataSpy = jest.spyOn(component, 'getStaffData').mockReturnValue(of(indivDataPagination));
    const showSpy = jest.spyOn(spinnerStub, 'show');

    // Act
    component.ngOnInit();

    // Assert
    expect(showSpy).toHaveBeenCalled();
    expect(getStaffDataSpy).toHaveBeenCalled();
    expect(component.indivData).toEqual(indivDataPagination);
    expect(component.tableDetails.rows).toEqual(indivDataPagination.content);
  });

  it('should load staff data when triggered by table event', () => {
    const getStaffDataSpy = jest.spyOn(component, 'getStaffData')
        .mockReturnValue(
            of(indivDataPagination)
        );
    const refreshDataSpy = jest.spyOn(component, 'refreshStaffData');
    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');

    jest.spyOn(staffServiceStub, 'getStaff').mockReturnValue(of(indivDataPagination));

    const event: LazyLoadEvent = { first: 0, last: 0,  rows: 5, sortField: 'username', sortOrder: 1 };

    component.loadStaff(event);

    expect(getStaffDataSpy).toHaveBeenCalledWith(0, 'username', 'desc');
    expect(refreshDataSpy).toHaveBeenCalledWith(indivDataPagination);
    expect(hideSpinnerSpy).toHaveBeenCalled();
    expect(component.indivData).toEqual(indivDataPagination);
    expect(component.tableDetails.rows).toEqual(indivDataPagination?.content);
  });


  it('should hide the spinner on error', () => {
    // Arrange
    const event: LazyLoadEvent = { first: 0, last: 0,  rows: 5, sortField: 'username', sortOrder: 1 };

    const error = new Error('Failed to load staff data');
    const getStaffDataSpy = jest.spyOn(component, 'getStaffData').mockReturnValue(throwError(error));
    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');

    // Act
    component.loadStaff(event);

    expect(hideSpinnerSpy).toHaveBeenCalled();
  });


  it('should select the active tab and refresh staff data', () => {
    // Arrange
    const activeTab = 'Group';

    const getStaffDataSpy = jest.spyOn(component, 'getStaffData')
        .mockReturnValue(
            of(groupDataPagination)
        );
    const refreshDataSpy = jest.spyOn(component, 'refreshStaffData');
    const showSpinnerSpy = jest.spyOn(spinnerStub, 'show');
    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');

    component.selectTab(activeTab);

    expect(component.activeTab2).toBe(activeTab);
    expect(component.userType).toBe('group');

    expect(showSpinnerSpy).toHaveBeenCalled();
    expect(getStaffDataSpy).toHaveBeenCalledWith(0);
    expect(refreshDataSpy).toHaveBeenCalled();
    expect(hideSpinnerSpy).toHaveBeenCalled();

    expect(component.indivData).toEqual(groupDataPagination);
    expect(component.tableDetails.rows).toEqual(groupDataPagination.content);
  });

  it('should navigate to new entity page when creating a new staff', async () => {
    const navigateSpy = jest.spyOn(routerStub, 'navigate').mockResolvedValue(true);

    component.gotoEntityPage();

    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/new'], {
      queryParams: { entityType: 'Staff' }
    });
  });


});
