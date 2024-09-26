import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypesComponent } from './activity-types.component';
import {MessageService} from "primeng/api";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {createSpyObj} from "jest-createspyobj";
import {of, throwError} from "rxjs";
import {ActivityType} from "../../../data/activity";
import {ActivityService} from "../../../services/activity.service";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {TranslateModule} from "@ngx-translate/core";
import {MandatoryFieldsDTO} from "../../../../../shared/data/common/mandatory-fields-dto";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";

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

describe('ActivityTypesComponent', () => {
  const activityServiceStub = createSpyObj('ActivityService',
    ['getActivityTypes', 'updateActivityType', 'createActivityType', 'deleteActivityType']);

  const systemServiceStub = createSpyObj('SystemsService', ['getSystems']);

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', ['getMandatoryFieldsByGroupId'])

  let component: ActivityTypesComponent;
  let fixture: ComponentFixture<ActivityTypesComponent>;

  const activityType: ActivityType = {
    "id": 102,
    "desc": "System maintenance scheduled",
    "systemCode": 5001
  }

  const system: SystemsDto = {
    "id": 1,
    "shortDesc": "Sample Short Description",
    "systemName": "Sample System Name"
  }

  const mandatoryField: MandatoryFieldsDTO = {
    "id": 1,
    "fieldName": "username",
    "fieldLabel": "Username",
    "mandatoryStatus": "required",
    "visibleStatus": "Y",
    "disabledStatus": "enabled",
    "frontedId": "field-username",
    "screenName": "loginScreen",
    "groupId": "authGroup",
    "module": "authentication"
  }


  beforeEach(() => {
    jest.spyOn(activityServiceStub, 'getActivityTypes').mockReturnValue(of([activityType]));
    jest.spyOn(activityServiceStub, 'updateActivityType').mockReturnValue(of(activityType));
    jest.spyOn(activityServiceStub, 'createActivityType').mockReturnValue(of(activityType));
    jest.spyOn(activityServiceStub, 'deleteActivityType').mockReturnValue(of('success'));
    jest.spyOn(systemServiceStub, 'getSystems').mockReturnValue(of([system]));

    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));

    TestBed.configureTestingModule({
      declarations: [ActivityTypesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        MessageService,
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ActivityService, useValue: activityServiceStub },
        { provide: SystemsService, useValue: systemServiceStub },
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ActivityTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.fetchSystems.call).toBeTruthy();
    expect(component.getActivityTypes.call).toBeTruthy();
    expect(component.activityTypeData.length).toEqual(1);
    expect(component.systems.length).toEqual(1);
  });

  test('should select system', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.select-system');
    button.click();
    fixture.detectChanges();
    expect(component.selectSystem.call).toBeTruthy();
  });

  test('should throw error when fetching systems fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(systemServiceStub, 'getSystems').mockReturnValueOnce(throwError(() => error));
    expect(component.fetchSystems.call).toBeTruthy();
  });

  test('should throw error when get activity-types fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'getActivityTypes').mockReturnValueOnce(throwError(() => error));
    expect(component.getActivityTypes.call).toBeTruthy();
  });


  test('should open activity type modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-activity-type-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openDefineActivityTypeModal.call).toBeTruthy();
  });

  test('should close activity type modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.close-activity-type-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineActivityTypeModal.call).toBeTruthy();
  });

  test('should edit activity type', () => {
    component.selectedActivityType = activityType;
    const button = fixture.debugElement.nativeElement.querySelector('.edit-activity-type');
    button.click();
    fixture.detectChanges();
    expect(component.editActivityType.call).toBeTruthy();
  });

  test('should save activity type', () => {
    component.activityTypeForm.controls['description'].setValue('test');
    const button = fixture.debugElement.nativeElement.querySelector('.save-activity-type');
    button.click();
    fixture.detectChanges();
    expect(component.saveActivityType.call).toBeTruthy();
    expect(component.createNewActivityType.call).toBeTruthy();
  });

  test('should throw error when save activity-type fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'createActivityType').mockReturnValueOnce(throwError(() => error));

    component.activityTypeForm.controls['description'].setValue('test');
    const button = fixture.debugElement.nativeElement.querySelector('.save-activity-type');
    button.click();
    fixture.detectChanges();
  });

  test('should update activity type', () => {
    component.selectedActivityType = activityType;
    component.editActivityType();
    component.activityTypeForm.controls['description'].setValue('test');

    const button = fixture.debugElement.nativeElement.querySelector('.save-activity-type');
    button.click();
    fixture.detectChanges();
    expect(component.saveActivityType.call).toBeTruthy();
    expect(component.updateActivityType.call).toBeTruthy();
  });

  test('should throw error when update activity-type fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'updateActivityType').mockReturnValueOnce(throwError(() => error));

    component.selectedActivityType = activityType;
    component.editActivityType();
    component.activityTypeForm.controls['description'].setValue('test');

    const button = fixture.debugElement.nativeElement.querySelector('.save-activity-type');
    button.click();
    fixture.detectChanges();
  });

  test('should delete activity type', () => {
    component.selectedActivityType = activityType;

    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity-type');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityType.call).toBeTruthy();
  });

  test('should throw error when delete activity-type fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'deleteActivityType').mockReturnValueOnce(throwError(() => error));

    component.selectedActivityType = activityType;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity-type');
    button.click();
    fixture.detectChanges();
  });

});
