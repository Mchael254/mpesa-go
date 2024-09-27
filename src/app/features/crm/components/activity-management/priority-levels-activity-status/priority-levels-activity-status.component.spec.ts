import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityLevelsActivityStatusComponent } from './priority-levels-activity-status.component';
import {createSpyObj} from "jest-createspyobj";
import {ActivityStatus, PriorityLevel} from "../../../data/activity";
import {of, throwError} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ActivityService} from "../../../services/activity.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {MessageService} from "primeng/api";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}

describe('PriorityLevelsActivityStatusComponent', () => {
  const activityServiceStub = createSpyObj('ActivityService',
    ['getPriorityLevels', 'createPriorityLevel', 'updatePriorityLevel', 'deletePriorityLevel',
      'getActivityStatuses', 'createActivityStatus', 'updateActivityStatus', 'deleteActivityStatus']);

  let component: PriorityLevelsActivityStatusComponent;
  let fixture: ComponentFixture<PriorityLevelsActivityStatusComponent>;

  const priorityLevel: PriorityLevel = {
      "id": 1,
      "desc": "This is a detailed description of the item or field.",
      "shortDesc": "Short description"
    }
  ;

  const activityStatus: ActivityStatus = {
      "id": 1,
      "desc": "This is a detailed description of the item or field.",
      "code": 101
    }
  ;

  beforeEach(() => {

    jest.spyOn(activityServiceStub, 'getPriorityLevels').mockReturnValue(of([priorityLevel]));
    jest.spyOn(activityServiceStub, 'createPriorityLevel').mockReturnValue(of(priorityLevel));
    jest.spyOn(activityServiceStub, 'updatePriorityLevel').mockReturnValue(of(priorityLevel));
    jest.spyOn(activityServiceStub, 'deletePriorityLevel').mockReturnValue(of('success'));

    jest.spyOn(activityServiceStub, 'getActivityStatuses').mockReturnValue(of([activityStatus]));
    jest.spyOn(activityServiceStub, 'createActivityStatus').mockReturnValue(of(activityStatus));
    jest.spyOn(activityServiceStub, 'updateActivityStatus').mockReturnValue(of(activityStatus));
    jest.spyOn(activityServiceStub, 'deleteActivityStatus').mockReturnValue(of('success'));

    TestBed.configureTestingModule({
      declarations: [PriorityLevelsActivityStatusComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ActivityService, useValue: activityServiceStub },
        { provide: AppConfigService, useClass: MockAppConfigService },
        MessageService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(PriorityLevelsActivityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach( () => {
    component.editMode = false;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activityStatusCreateForm.call).toBeTruthy();
    expect(component.priorityLevelCreateForm.call).toBeTruthy();
    expect(component.getPriorityLevels.call).toBeTruthy();
    expect(component.getActivityStatuses.call).toBeTruthy();
  });

  test('should open define priority-level-modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-priority-level');
    button.click();
    fixture.detectChanges();
    expect(component.openDefinePriorityLevelModal.call).toBeTruthy();
  });

  test('should close define priority-level-modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.close-priority-level-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefinePriorityLevelModal.call).toBeTruthy();
  });

  test('should open define activity-status-modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-activity-status-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openActivityStatusModal.call).toBeTruthy();
  });

  test('should close define activity-status-modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.close-activity-status-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeActivityStatusModal.call).toBeTruthy();
  });

  test('should edit priority-level', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.edit-priority-level');
    button.click();
    fixture.detectChanges();
    expect(component.editPriorityLevel.call).toBeTruthy();
  });

  test('should edit activity-status', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.edit-activity-status');
    button.click();
    fixture.detectChanges();
    expect(component.editActivityStatus.call).toBeTruthy();
  });

  test('should throw error when getting priority-levels fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'getPriorityLevels').mockReturnValueOnce(throwError(() => error));
    component.getPriorityLevels();
    expect(component.getPriorityLevels.call).toBeTruthy();
  });

  test('should throw error when getting activity-statuses fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'getActivityStatuses').mockReturnValueOnce(throwError(() => error));
    component.getActivityStatuses();
    expect(component.getActivityStatuses.call).toBeTruthy();
  });

  test('should create priority level', () => {
    component.priorityLevelForm.controls['desc'].setValue('test');
    component.priorityLevelForm.controls['shtDesc'].setValue('shortDesc');
    const button = fixture.debugElement.nativeElement.querySelector('.create-priority-level');
    button.click();
    fixture.detectChanges();
    expect(component.createPriorityLevel.call).toBeTruthy();
    expect(component.createNewPriorityLevel.call).toBeTruthy();
  });

  test('should throw error when create priority level fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'createPriorityLevel')
      .mockReturnValueOnce(throwError(() => error));

    component.priorityLevelForm.controls['desc'].setValue('test create');
    component.priorityLevelForm.controls['shtDesc'].setValue('short_Desc');
    const button = fixture.debugElement.nativeElement.querySelector('.create-priority-level');
    button.click();
    fixture.detectChanges();

    expect(component.createPriorityLevel.call).toBeTruthy();
    expect(component.createNewPriorityLevel.call).toBeTruthy();
  });

  test('should update priority level', () => {
    component.selectedPriorityLevel = priorityLevel;
    component.priorityLevelForm.controls['desc'].setValue('test update');
    component.priorityLevelForm.controls['shtDesc'].setValue('shortDesc update');
    const button = fixture.debugElement.nativeElement.querySelector('.edit-priority-level');
    button.click();
    fixture.detectChanges();

    expect(component.editMode).toEqual(true);
    expect(component.createPriorityLevel.call).toBeTruthy();
    expect(component.updatePriorityLevel.call).toBeTruthy();
  });

  test('should throw error when update priority level fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'updatePriorityLevel')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedPriorityLevel = priorityLevel;
    component.editPriorityLevel();

    component.priorityLevelForm.controls['desc'].setValue('test update');
    component.priorityLevelForm.controls['shtDesc'].setValue('shortDescU');
    const button = fixture.debugElement.nativeElement.querySelector('.create-priority-level');
    button.click();
    fixture.detectChanges();

    expect(component.createPriorityLevel.call).toBeTruthy();
    expect(component.updatePriorityLevel.call).toBeTruthy();
  });

  test('should delete priority level', () => {
    component.selectedPriorityLevel = priorityLevel;

    const button = fixture.debugElement.nativeElement.querySelector('.delete-priority-level');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeletePriorityLevel.call).toBeTruthy();
  });

  test('should throw error when delete priority level fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'deletePriorityLevel').mockReturnValueOnce(throwError(() => error));

    component.selectedPriorityLevel = priorityLevel;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-priority-level');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeletePriorityLevel.call).toBeTruthy();
  });


  test('should create activity-status', () => {
    component.activityStatusForm.controls['desc'].setValue('test desc');
    component.activityStatusForm.controls['shtDesc'].setValue(101);
    const button = fixture.debugElement.nativeElement.querySelector('.create-activity-status');
    button.click();
    fixture.detectChanges();
    expect(component.createActivityStatus.call).toBeTruthy();
    expect(component.createNewActivityStatus.call).toBeTruthy();
  });

  test('should throw error when create activity-status fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'createActivityStatus').mockReturnValueOnce(throwError(() => error));

    component.activityStatusForm.controls['desc'].setValue('test create');
    component.activityStatusForm.controls['shtDesc'].setValue('shortDesc');
    const button = fixture.debugElement.nativeElement.querySelector('.create-activity-status');
    button.click();
    fixture.detectChanges();

    expect(component.createActivityStatus.call).toBeTruthy();
    expect(component.createNewActivityStatus.call).toBeTruthy();
  });

  test('should activity-status', () => {
    component.selectedActivityStatus = activityStatus;
    component.editActivityStatus();
    component.activityStatusForm.controls['desc'].setValue('testU');
    component.activityStatusForm.controls['shtDesc'].setValue('shortDescU');
    const button = fixture.debugElement.nativeElement.querySelector('.create-activity-status');
    button.click();
    fixture.detectChanges();

    expect(component.createActivityStatus.call).toBeTruthy();
    expect(component.createNewActivityStatus.call).toBeTruthy();
  });

  test('should throw error when activity-status fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'updateActivityStatus').mockReturnValueOnce(throwError(() => error));

    component.selectedActivityStatus = activityStatus;
    component.editActivityStatus();

    component.activityStatusForm.controls['desc'].setValue('test update');
    component.activityStatusForm.controls['shtDesc'].setValue('shtDescU');
    const button = fixture.debugElement.nativeElement.querySelector('.create-activity-status');
    button.click();
    fixture.detectChanges();

    expect(component.createActivityStatus.call).toBeTruthy();
    expect(component.createNewActivityStatus.call).toBeTruthy();
  });

  test('should delete activity-status', () => {
    component.selectedActivityStatus = activityStatus;

    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity-status');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityStatus.call).toBeTruthy();
  });

  test('should throw error when delete activity-status fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'deleteActivityStatus').mockReturnValueOnce(throwError(() => error));

    component.selectedActivityStatus = activityStatus;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity-status');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityStatus.call).toBeTruthy();
  });

});
