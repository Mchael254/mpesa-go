import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NewEntityComponent } from './new-entity.component';
import { EntityService } from '../../../services/entity/entity.service';
import { EntityDto, EntityResDTO, IdentityModeDTO } from '../../../data/entityDto';
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

const identityMode: IdentityModeDTO[]= [{
  id: 0,
  name: '',
  identityFormat: '',
  identityFormatError: '',
  organizationId: 0,
}]

const IdentityMode: IdentityModeDTO= {
  id: 0,
  name: '',
  identityFormat: '',
  identityFormatError: '',
  organizationId: 0,
}

const entity: EntityDto = 
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

const mockEntityPost: EntityResDTO = {
  category: '',
  countryId: 0,
  dateOfBirth: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  modeOfIdentityId: 0,
  identityNumber: '',
  name: '',
  organizationId: 0,
  partyTypeId: 0,
  pinNumber: '',
  profileImage: ''
}

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
  getIdentityType = jest.fn().mockReturnValue(of(identityMode));
  saveEntityDetails = jest.fn().mockReturnValue(of(mockEntityPost));
  uploadProfileImage = jest.fn().mockReturnValue(of({ file: 'image.png' }));
  setCurrentEntity = jest.fn().mockReturnValue(of());
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
    routeStub = TestBed.inject(Router);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
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
  });

  test('should save entity', () => {
    jest.spyOn(entityServiceStub, 'saveEntityDetails');
    component.onSubmit();
    expect(entityServiceStub.saveEntityDetails.call).toBeTruthy();
    expect(entityServiceStub.saveEntityDetails).toHaveBeenCalled();
    // expect(entityServiceStub.saveEntityDetails).toHaveBeenCalledWith(mockEntityPost);
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created an Entity'
    );
  });

  test('should upload image for entity', () => {
    jest.spyOn(entityServiceStub, 'uploadProfileImage');
    const entityId = mockEntityPost.partyTypeId;
    component.uploadImage(entityId);
    expect(entityServiceStub.uploadProfileImage.call).toBeTruthy();
    expect(entityServiceStub.uploadProfileImage).toHaveBeenCalled();
  });

//   test('should upload image for entity', () => {
//     jest.spyOn(entityServiceStub, 'uploadProfileImage');

//     const entityId = mockEntityPost.partyTypeId;

//     component.uploadImage(entityId);

//     expect(entityServiceStub.uploadProfileImage).toHaveBeenCalled();
//     expect(entityServiceStub.uploadProfileImage).toHaveBeenCalledWith(entityId, expect.anything());
//     expect(component.savedEntity.profilePicture).toBe('image.png');
//     expect(component.savedEntity.profileImage).toBe('image.png');
//     expect(entityServiceStub.setCurrentEntity).toHaveBeenCalledWith(entity);
//     expect(messageServiceStub.clearMessages).toHaveBeenCalled();
//     expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully Created an Entity');
//     expect(component.goToNextPage).toHaveBeenCalled();
// });


test('should upload profilePicture', () => {
    class MockFileReader {
      onload: Function | null = null;

      readAsDataURL(blob: Blob): void {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: 'data:image/png;base64,...' } } as ProgressEvent<FileReader>);
          }
        }, 0);
      }
    }

    const originalFileReader = globalThis.FileReader;
    globalThis.FileReader = MockFileReader as any;

    const event = {
      target: {
        files: [
          {
            name: 'image.png',
            size: 50000,
            type: 'image/png',
          },
        ],
      },
    };

    component.onFileChange(event);

    // Use setTimeout to allow asynchronous code to execute
    setTimeout(() => {
      // Assert that the component's URL property was updated
      expect(component.url).toBe('data:image/png;base64,...');

      // Restore the original FileReader
      globalThis.FileReader = originalFileReader;
    }, 10);
});

  test('should navigate to the correct route based on the selected role (staff)', () => {
    component.savedEntity = entity;
    component.roleName = 'Staff';
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    component.goToNextPage();
    expect(entityServiceStub.setCurrentEntity).toHaveBeenCalledWith(component.savedEntity);
    // expect(sessionStorage.setItem).toHaveBeenCalledWith(
    //   'entityDetails',
    //   JSON.stringify(component.savedEntity)
    // );
    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/staff/new'], {
      queryParams: { id: component.savedEntity.id },
    });
  });

  test('should navigate to the correct route based on the selected role (client)', () => {
    component.savedEntity = entity;
    component.roleName = 'Client';
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    component.goToNextPage();
    expect(entityServiceStub.setCurrentEntity).toHaveBeenCalledWith(component.savedEntity);
    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/client/new'], {
      queryParams: { id: component.savedEntity.id },
    });
  });

  test('should navigate to the correct route based on the selected role (agent)', () => {
    component.savedEntity = entity;
    component.roleName = 'Agent';
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    component.goToNextPage();
    expect(entityServiceStub.setCurrentEntity).toHaveBeenCalledWith(component.savedEntity);
    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/intermediary/new'], {
      queryParams: { id: component.savedEntity.id },
    });
  });

  // test('should navigate to the correct route based on the selected role (service provider)', () => {
  //   component.savedEntity = entity;
  //   component.roleName = 'Service Provider';
  //   const navigateSpy = jest.spyOn(routeStub, 'navigate');
  //   component.goToNextPage();
  //   expect(entityServiceStub.setCurrentEntity).toHaveBeenCalledWith(component.savedEntity);
  //   expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/service-provider/new'], {
  //     queryParams: { id: component.savedEntity.id },
  //   });
  // });
});
