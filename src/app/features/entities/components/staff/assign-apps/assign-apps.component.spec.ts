import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { AssignAppsComponent } from './assign-apps.component';
import {AppService} from "../../../../../shared/services/setups/app.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {StaffService} from "../../../services/staff/staff.service";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {TableModule} from "primeng/table";
import {NgxSpinnerModule} from "ngx-spinner";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MockAppConfigService,
  MockAuthService,
  MockBrowserStorage,
  MockGlobalMessagingService,
  MockLocalStorageService
} from "../new-staff/new-staff.component.spec";
import {AuthService} from "../../../../../shared/services/auth.service";
import {BrowserStorage} from "../../../../../shared/services/storage";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {SortFilterService} from "../../../../../shared/services/sort-filter.service";
import {MockSortFilterService} from "../list-staff/list-staff.component.spec";
import {apps, newStaffDto} from "../../../data/staffTestData/staffTestData";

export class MockAppService {
  getApps = jest.fn().mockReturnValue(apps);
}

export class MockGlobalMessagingServiceMock  {
  displayErrorMessage = jest.fn();
  displaySuccessMessage = jest.fn();
}

export class MockStaffService {
  newStaffObservable = of(null);
  assignUserSystemApps = jest.fn().mockReturnValue(of(null));
}

describe('AssignAppsComponent', () => {
  let component: AssignAppsComponent;
  let appServiceStub: Partial<AppService>;
  let globalMessagingServiceStub: Partial<GlobalMessagingService>;
  let staffServiceStub: Partial<StaffService>;

  let fixture: ComponentFixture<AssignAppsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TableModule,NgxSpinnerModule.forRoot(), HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      declarations: [AssignAppsComponent],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessagingServiceMock },
        {provide: AuthService, useClass: MockAuthService},
        {provide: StaffService, useClass: MockStaffService},
        {provide: BrowserStorage, useClass: MockBrowserStorage},
        {provide: LocalStorageService, useClass: MockLocalStorageService},
        {provide: AppConfigService, useClass: MockAppConfigService},
        {provide: SortFilterService, useClass: MockSortFilterService} ,
        {provide: AppService, useClass: MockAppService} ,
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    });
    fixture = TestBed.createComponent(AssignAppsComponent);
    staffServiceStub = TestBed.inject(StaffService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    appServiceStub = TestBed.inject(AppService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch system apps on initialization', () => {
    // Arrange
    const getAppsSpy = jest.spyOn(appServiceStub, 'getApps');

    // Act
    component.ngOnInit();

    // Assert
    expect(getAppsSpy).toHaveBeenCalled();
    expect(component.apps).toEqual(apps);
    expect(component.apps[0].clicked).toEqual(false);
  });

  it('should select or unselect an app', () => {
    // Arrange
    component.apps = [
      { systemCode: 1, clicked: false , systemName: 'CRM'},
      { systemCode: 2, clicked: false, systemName: 'GIS' }
    ];

    // Act
    component.selectApp(0);

    // Assert
    expect(component.apps[0].clicked).toBe(true);
    expect(component.assignedApps).toEqual([1]);

    // Act
    component.selectApp(1);

    // Assert
    expect(component.apps[1].clicked).toBe(true);
    expect(component.assignedApps).toEqual([1, 2]);

    // Act
    component.selectApp(0);

    // Assert
    expect(component.apps[0].clicked).toBe(false);
    expect(component.assignedApps).toEqual([2]);
  });

  it('should assign apps to staff', () => {
    const assignedAppsSpy = jest.spyOn(staffServiceStub, 'assignUserSystemApps');
    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    // Arrange
    component.newlyCreatedStaff = newStaffDto;
    component.assignedApps = [1, 2];

    // Act
    component.assignApps();

    // Assert
    expect(assignedAppsSpy).toHaveBeenCalledWith(newStaffDto?.id, { assignedSystems: [1, 2] });
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', 'Hooray!! You have successfully assigned apps');
  });

  it('should display an error message if staff details are missing', () => {
    const assignedAppsSpy = jest.spyOn(staffServiceStub, 'assignUserSystemApps');
    const displayErrorMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');

    // Arrange
    component.newlyCreatedStaff = null;

    // Act
    component.assignApps();

    // Assert
    expect(displayErrorMessageSpy).toHaveBeenCalledWith('Staff Details Missing', 'Staff Details missing. Fill in Staff Profile Details before proceeding');
    expect(assignedAppsSpy).not.toHaveBeenCalled();
  });


});
