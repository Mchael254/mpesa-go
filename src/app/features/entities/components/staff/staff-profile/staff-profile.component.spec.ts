// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { StaffProfileComponent } from './staff-profile.component';
// import {FormStateService} from "../../../../../shared/services/form-state/form-state.service";
// import {
//   MockAppConfigService, MockAuthService,
//   MockBranchService, MockBrowserStorage,
//   MockCountryService, MockDepartmentService, mockEntityDto,
//   MockEntityService,
//   MockFormStateService, MockGlobalMessagingService, MockLocalStorageService,
//   MockMandatoryFieldsService, MockUtilService
// } from "../../../data/staffTestData/staffTestData";
//
// import {StaffService} from "../../../services/staff/staff.service";
// import {EntityService} from "../../../services/entity/entity.service";
// import {CountryService} from "../../../../../shared/services/setups/country.service";
// import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields.service";
// import {DepartmentService} from "../../../../../shared/services/setups/department.service";
// import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
// import {UtilService} from "../../../../../shared/services";
// import {BranchService} from "../../../../../shared/services/setups/branch.service";
// import {of} from "rxjs";
// import {RouterTestingModule} from "@angular/router/testing";
// import {TableModule} from "primeng/table";
// import {NgxSpinnerModule} from "ngx-spinner";
// import {HttpClientTestingModule} from "@angular/common/http/testing";
// import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {BrowserStorage} from "../../../../../shared/services/storage";
// import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
// import {AppConfigService} from "../../../../../core/config/app-config-service";
// import {SortFilterService} from "../../../../../shared/services/sort-filter.service";
// import {MockSortFilterService, MockStaffService} from "../list-staff/list-staff.component.spec";
// import {AppService} from "../../../../../shared/services/setups/app.service";
// import {MockAppService} from "../assign-apps/assign-apps.component.spec";
// import {APP_BASE_HREF} from "@angular/common";
// import {AuthService} from "../../../../../shared/services/auth.service";
//
// describe('StaffProfileComponent', () => {
//   let component: StaffProfileComponent;
//   let staffServiceStub: StaffService;
//   let entityServiceStub: EntityService;
//   let formStateServiceStub: FormStateService;
//   let countryServiceStub: CountryService;
//   let mandatoryFieldsServiceStub: MandatoryFieldsService;
//   let departmentServiceStub: DepartmentService;
//   let globalMessagingServiceStub: GlobalMessagingService;
//   let utilServiceStub: UtilService;
//   let branchServiceStub: BranchService;
//
//   let fixture: ComponentFixture<StaffProfileComponent>;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule, TableModule,NgxSpinnerModule.forRoot(), HttpClientTestingModule,
//         FormsModule, ReactiveFormsModule],
//       declarations: [StaffProfileComponent],
//       providers: [
//           { provide: FormStateService, useClass: MockFormStateService},
//           { provide: StaffService, useClass: MockStaffService},
//           { provide: EntityService, useClass: MockEntityService},
//           { provide: CountryService, useClass: MockCountryService },
//           { provide: MandatoryFieldsService, useClass: MockMandatoryFieldsService },
//           { provide: DepartmentService, useClass: MockDepartmentService},
//           { provide: GlobalMessagingService, useClass: MockGlobalMessagingService},
//           { provide: UtilService, useClass: MockUtilService},
//           { provide: BranchService, useClass: MockBranchService},
//           { provide: BrowserStorage, useClass: MockBrowserStorage},
//           { provide: LocalStorageService, useClass: MockLocalStorageService},
//           { provide: AppConfigService, useClass: MockAppConfigService},
//           { provide: SortFilterService, useClass: MockSortFilterService} ,
//           { provide: AppService, useClass: MockAppService} ,
//           { provide: AuthService, useClass: MockAuthService},
//           { provide: APP_BASE_HREF, useValue: '/' },
//       ]
//     });
//     fixture = TestBed.createComponent(StaffProfileComponent);
//
//     staffServiceStub = TestBed.inject(StaffService);
//     entityServiceStub = TestBed.inject(EntityService);
//     formStateServiceStub = TestBed.inject(FormStateService);
//     countryServiceStub = TestBed.inject(CountryService);
//     departmentServiceStub = TestBed.inject(DepartmentService);
//     utilServiceStub = TestBed.inject(UtilService);
//     branchServiceStub = TestBed.inject(BranchService);
//     mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
//     globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
//
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should fetch form values on initialization', () => {
//     spyOn(component, 'fetchFormStateValues');
//     spyOn(component, 'createUserRegForm');
//     spyOn(component, 'fetchBranches');
//     spyOn(component, 'fetchDepartments');
//     spyOn(component, 'fetchCountries');
//     spyOn(component, 'fetchEntityById');
//
//     component.ngOnInit();
//     expect(component.fetchFormStateValues).toHaveBeenCalled();
//     expect(component.fetchEntityById).toHaveBeenCalled();
//     expect(component.fetchCountries).toHaveBeenCalled();
//     expect(component.fetchDepartments).toHaveBeenCalled();
//     expect(component.fetchBranches).toHaveBeenCalled();
//     expect(component.createUserRegForm).toHaveBeenCalled();
//   });
//
//     it('should fetch form state values and reset staffProfileTempData if persisted', () => {
//         const mockFormState = { persisted: true };
//         jest.spyOn(formStateServiceStub, 'getFormState').mockReturnValue(mockFormState);
//
//         component.fetchFormStateValues();
//
//         expect(formStateServiceStub.getFormState).toHaveBeenCalledWith(component.staffProfileFormStateKey);
//         expect(component.staffProfileTempData).toBeNull();
//     });
//
//
//
//
//
// });
