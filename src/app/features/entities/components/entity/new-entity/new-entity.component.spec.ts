import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NewEntityComponent } from './new-entity.component';
import { EntityService } from '../../../services/entity/entity.service';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { PartyTypeDto } from '../../../data/partyTypeDto';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { AppConfigService } from '../../../../../core/config/app-config-service';
import { MandatoryFieldsDTO } from '../../../../../shared/data/common/mandatory-fields-dto';
import { DynamicBreadcrumbComponent } from '../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';

const partyType: PartyTypeDto[] = [{
  id: 0,
  organizationId: 0,
  partyTypeLevel: 0,
  partyTypeName: '',
  partyTypeShtDesc: '',
  partyTypeVisible: ''
}]

const IdentityMode: IdentityModeDTO = {
  id: 0,
  name: '',
  identityFormat: '',
  identityFormatError: '',
  organizationId: 0,
}

const entity: EntityDto[] = [
  {
  categoryName: '',
  countryId: 0,
  dateOfBirth: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  id: 0,
  modeOfIdentity: IdentityMode,
  modeOfIdentityName: '',
  identityNumber: 0,
  name: '',
  organizationId: 0,
  pinNumber: '',
  profilePicture: '',
  profileImage: '',
  partyTypeId: 0,
  }
]

const group: MandatoryFieldsDTO[] = [{
  id: 0,
  fieldName: '',
  fieldLabel: '',
  mandatoryStatus: '',
  visibleStatus: '',
  disabledStatus: '',
  frontedId: '',
  screenName: '',
  groupId: '',
  module: ''
}]

export class MockEntityService {
  getPartiesType = jest.fn().mockReturnValue(of(partyType));
  getIdentityType = jest.fn().mockReturnValue(of(IdentityMode));
  saveEntityDetails = jest.fn().mockReturnValue(of(entity));
}

export class MockMessageService {
  displayErrorMessage = jest.fn((summary,detail ) => {return});
  displaySuccessMessage = jest.fn((summary, detail) => { return });
  clearMessages = jest.fn();
}

export class MockMandatoryFieldService { 
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of(group));
}
const MockAppConfig = {
  config: {
    organization: {
      passport_regex: "^[A-Z]{1,2}[0-9]{6,8}[A-Z]{0,1}$",
      pin_regex: "^[A][0-9]{9}[A-Z]{1}",
      birth_cert_regex: "^[0-9]{3}\\/[0-9]{5}$",
      national_ID_regex: "^[0-9]{8}$",
      alien_number_regex: "^A[0-9]{8}$",
      huduma_number_regex: "^[0-9]{5}-[0-9]{5}-[0-9]{4}$",
      registration_number_regex: "^[0-9]{5}\\/[0-9]{5}$",
      drivers_license_number_regex: "^[0-9]{9}$",
      cert_of_incorporation_number_regex: "^[a-zA-Z0-9_]{3}\\/[a-zA-Z0-9_]{3}\\/[0-9]{6}$"
    }
  }
}

describe('NewEntityComponent', () => {
  let component: NewEntityComponent;
  let fixture: ComponentFixture<NewEntityComponent>;
  let appConfigServiceStub: AppConfigService;
  let entityServiceStub: EntityService;
  let messageServiceStub: GlobalMessagingService;
  let mandatoryServiceStub: MandatoryFieldsService;
  let activatedRoute: ActivatedRoute;
  let routeStub: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewEntityComponent,
        DynamicBreadcrumbComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: GlobalMessagingService, useClass: MockMessageService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryFieldService },
        { provide: AppConfigService, useValue: MockAppConfig }
      ]
    });
    fixture = TestBed.createComponent(NewEntityComponent);
    component = fixture.componentInstance;
    entityServiceStub = TestBed.inject(EntityService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryServiceStub = TestBed.inject(MandatoryFieldsService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

    test('component initial state', () => {
    expect(component.entityRegistrationForm).toBeDefined();
    expect(component.entityRegistrationForm.invalid).toBeTruthy();
    expect(component.selectRoleModalForm).toBeDefined();
    expect(component.selectRoleModalForm.invalid).toBeTruthy();
  });

  test('should have EntityRegistration form', () => {
    expect(component.entityRegistrationForm).toBeTruthy();
    expect(typeof component.entityRegistrationForm.controls).toBe('object');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('category');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('date_of_birth');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('mode_of_identity');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('entity_name');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('identity_number');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('pin_number');
    expect(Object.keys(component.entityRegistrationForm.controls)).toContain('assign_role');
  });

  test('should have SelectRoleModal form', () => {
    expect(component.selectRoleModalForm).toBeTruthy();
    expect(typeof component.selectRoleModalForm.controls).toBe('object');
    expect(Object.keys(component.selectRoleModalForm.controls)).toContain('partyType');
  });

  test('should get Parties Type data', () => {
    jest.spyOn(entityServiceStub, 'getPartiesType');
    component.ngOnInit();
    fixture.detectChanges();
    expect(entityServiceStub.getPartiesType.call).toBeTruthy();
  });

  test('should get Identity Type data', () => {
    jest.spyOn(entityServiceStub, 'getIdentityType');
    component.ngOnInit();
    fixture.detectChanges();
    expect(entityServiceStub.getIdentityType.call).toBeTruthy();
  });

  test('should hide modal after button click', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#closeBtn');
    button.click();
    fixture.detectChanges();
    expect(component.onAssignRole.call).toBeTruthy();
  })
});
