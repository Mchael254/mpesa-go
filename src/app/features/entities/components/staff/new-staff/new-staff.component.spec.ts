import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewStaffComponent } from './new-staff.component';
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {StepsModule} from "primeng/steps";
import {AssignAppsComponent} from "../assign-apps/assign-apps.component";
import {StaffProfileComponent} from "../staff-profile/staff-profile.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthService} from "../../../../../shared/services/auth.service";
import {StaffService} from "../../../services/staff/staff.service";
import {BrowserStorage} from "../../../../../shared/services/storage";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {By} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DebugElement} from "@angular/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
// @ts-ignore
import {
  MockAppConfigService, MockAuthService,
  MockBrowserStorage, MockGlobalMessagingService, MockLocalStorageService,
  newAccountResponse,
  staffAccount,
  staffDto
} from "../../../data/staffTestData/staffTestData";
import {MockStaffService} from "../list-staff/list-staff.component.spec";

const mockStaffAccount = staffAccount;
const mockCreatedAccountResponse = newAccountResponse;

describe('NewStaffComponent', () => {
  let component: NewStaffComponent;
  let messageServiceStub: GlobalMessagingService;
  let spinnerStub: NgxSpinnerService;
  let routerStub: Router;
  let fixture: ComponentFixture<NewStaffComponent>;

  let staffProfileComponent2 : DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StepsModule,DropdownModule,TableModule,NgxSpinnerModule.forRoot(), HttpClientTestingModule,
        FormsModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [NewStaffComponent, StaffProfileComponent, AssignAppsComponent],
      providers: [
          { provide: GlobalMessagingService, useClass: MockGlobalMessagingService },
          {provide: AuthService, useClass: MockAuthService},
          {provide: StaffService, useClass: MockStaffService},
          {provide: BrowserStorage, useClass: MockBrowserStorage},
          {provide: LocalStorageService, useClass: MockLocalStorageService},
          {provide: AppConfigService, useClass: MockAppConfigService},
          { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStaffComponent);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    spinnerStub =  TestBed.inject(NgxSpinnerService);
    routerStub = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach( () => {
    // Manually initialize the steps array
    component.steps = [
      {
        label: 'Staff Profile',
        tooltip: 'Add Staff Profile Details',
        title: 'Add Staff Profile Details',
        separator: true,
        command: (event: any) => {},
        state: { completed: false, errorMessage: 'Fill missing user profile details before proceeding' }
      },
      {
        label: 'Assign Apps',
        command: (event: any) => {},
        state: { completed: false }
      }
    ];

    fixture.detectChanges();
  })

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the steps array', () => {
    expect(component.steps).toBeDefined();
    expect(component.steps.length).toBe(2); // Assuming there are always two steps
  });

  it('should change the active step when calling changeStep method', () => {
    const index = 1; // Assuming the index of the step to change to is 1

    expect(component.activeIndex).toEqual(0);

    component.steps[component.activeIndex].state['completed'] = true;
    component.changeStep(index);

    expect(component.activeIndex).toEqual(index);
  });

  it('should submit staff profile details and go to the next step', () => {
    const goToNextStepSpy = jest.spyOn(component, 'goToNextStep');
    // Spy on the submitStaffProfile method

    const submittedProfileSpy =   jest.spyOn(component, 'submitStaffProfile');
    staffProfileComponent2 = fixture.debugElement.query(By.css('app-staff-profile'));


    // Simulate the event emission
    staffProfileComponent2.triggerEventHandler('saved', true);

    fixture.detectChanges();

    expect(submittedProfileSpy).toHaveBeenCalled();
    expect(component.staffProfileValid).toBe(true);
    expect(component.steps[component.activeIndex-1].state['completed']).toBe(true);
    expect(component.activeIndex).toBe(1); // Assuming the next step index is 1
    expect(goToNextStepSpy).toHaveBeenCalled();
  });

  // it('should submit assigned apps and go to the next step', () => {
  //   const assignedAppsSpy = jest.spyOn(component, 'submitAssignedApps');
  //   const goToNextStepSpy = jest.spyOn(component, 'goToNextStep');
  //
  //   component.activeIndex = 1;
  //
  //   const assignAppsComponent = fixture.debugElement.query(By.css('app-assign-apps'));
  //
  //   component.steps[component.activeIndex-1].state['completed'] = true;
  //   assignAppsComponent.triggerEventHandler('assigned', true );
  //   fixture.detectChanges();
  //
  //   expect(assignedAppsSpy).toHaveBeenCalled();
  //   expect(component.assignAppsValid).toBe(true);
  //   expect(component.steps[1].state['completed']).toBe(true);
  //   expect(component.activeIndex).toBe(2);
  //   expect(goToNextStepSpy).toHaveBeenCalled();
  // });

  it('should call goToNextStep with the provided event when assigned event is emitted', () => {
    // Arrange
    const index = 1; // Use the same index as the activeIndex in the ngIf
    const goToNextStepSpy = jest.spyOn(component, 'goToNextStep');

    // Act
    component.activeIndex = index;
    component.submitAssignedApps(event);

    // Assert
    expect(component.assignAppsValid).toBe(true);
    expect(component.steps[index].state['completed']).toBe(true);
    expect(goToNextStepSpy).toHaveBeenCalled();
  });



  it('should display error message and not change step if activeIndex is not 0 and submittedPrevious is false', () => {
    // Arrange
    component.activeIndex = 1;
    component.submittedPrevious = false;

    const displayErrorMessageSpy = jest.spyOn(messageServiceStub, 'displayErrorMessage');
    const changeStepSpy = jest.spyOn(component, 'changeStep');

    component.goToNextStep(null);

    expect(displayErrorMessageSpy).toHaveBeenCalledWith(
        'Missing details',
        component.steps[component.activeIndex - 1].state['errorMessage']
    );
    expect(changeStepSpy).not.toHaveBeenCalled();
  });

  it('should show spinner, hide spinner, and navigate to staff list when activeIndex is greater than or equal to steps length', (done) => {
    // Arrange
    component.activeIndex = component.steps.length;

    const showSpy = jest.spyOn(spinnerStub, 'show');
    const hideSpy = jest.spyOn(spinnerStub, 'hide').mockResolvedValue(undefined);
    const navigateSpy = jest.spyOn(routerStub, 'navigate').mockResolvedValue(true);

    // Act
    component.changeStep(component.activeIndex);

    // Assert
    expect(showSpy).toHaveBeenCalled();

    setTimeout(() => {
      expect(hideSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['home/entity/staff/list']);
      done();
    }, 1000);
  });

  it('should show error message and not update activeIndex if previous steps are not completed', () => {
    // Arrange
    component.activeIndex = 1;
    component.steps = [
      { state: { completed: true } },
      { state: { completed: false } },
      { state: { completed: false } }
    ];

    const displayErrorMessageSpy = jest.spyOn(messageServiceStub, 'displayErrorMessage');

    // Act
    component.changeStep(2);

    // Assert
    expect(component.activeIndex).toBe(1);
    expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Please complete the previous steps before proceeding.');
  });

});
