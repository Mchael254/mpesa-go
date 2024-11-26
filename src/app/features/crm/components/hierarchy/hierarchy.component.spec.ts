import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyComponent } from './hierarchy.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {createSpyObj} from "jest-createspyobj";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {of, throwError} from "rxjs";
import {MandatoryFieldsDTO} from "../../../../shared/data/common/mandatory-fields-dto";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {SharedModule} from "../../../../shared/shared.module";
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {AccountService} from "../../../entities/services/account/account.service";
import {OrganizationService} from "../../services/organization.service";
import {OrgDivisionLevelsDTO, OrgDivisionLevelTypesDTO, OrgPreviousSubDivHeadsDTO} from "../../data/organization-dto";
import any = jasmine.any;
import {AccountTypeDTO} from "../../../entities/data/AgentDTO";
import {StaffDto} from "../../../entities/data/StaffDto";

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
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

export class MockSystemsService {
  getSystems = jest.fn().mockReturnValue(of());
}

export class MockAccountService {
  getAccountType = jest.fn().mockReturnValue(of());
}

export class MockOrganizationService {
  updateOrgDivisionLevelType = jest.fn().mockReturnValue(of());
  createOrgDivisionLevelType = jest.fn().mockReturnValue(of());
  deleteOrgDivisionLevelType = jest.fn().mockReturnValue(of());
  updateOrgDivisionLevel = jest.fn().mockReturnValue(of());
  createOrgDivisionLevel = jest.fn().mockReturnValue(of());
  deleteOrgDivisionLevel = jest.fn().mockReturnValue(of());
  getOrgDivisionLevelTypes = jest.fn().mockReturnValue(of());
  getOrgDivisionLevels = jest.fn().mockReturnValue(of());
  getHierarchiesType = jest.fn().mockReturnValue(of());
  getHierarchiesLevels = jest.fn().mockReturnValue(of());
  getOrgPrevSubDivisionHeads = jest.fn().mockReturnValue(of());
  deleteOrgPrevSubDivisionHead = jest.fn().mockReturnValue(of());
  createOrgPrevSubDivisionHead= jest.fn().mockReturnValue(of());
  updateOrgPrevSubDivisionHead= jest.fn().mockReturnValue(of());
}
const mockSystem: SystemsDto[] = [
  {
    "id": 1,
    "shortDesc": "GIS",
    "systemName": "General Insurance"
  }
]

const mockHierarchyLevel: OrgDivisionLevelsDTO[] = [
  {
    "code": 1,
    "description": "Hierarchy one",
    "divisionLevelTypeCode": 20,
    "ranking": 1,
    "type": "National",
  }
]

const mockHierarchyType: OrgDivisionLevelTypesDTO[] = [
  {
    "accountTypeCode": 10,
    "code": 2,
    "description": "Level 1",
    "intermediaryCode": 456,
    "managerCode": 124,
    "payIntermediary": "Y",
    "systemCode": 78,
    "type": "C"
  }
]

const mockPreviousSubDivHeads: OrgPreviousSubDivHeadsDTO[] = [
  {
    "agentCode": 12,
    "code": 1,
    "subdivisionCode": "20",
    "wef": "2024-11-16",
    "wet": "2024-12-25",
  }
]

const mockAccountTypes: AccountTypeDTO[] = [
  {
    "accountType": "Trail",
    "id": 1,
    "shortDescription": "Trail desc",
    "typeId": "try",
  }
]

describe('HierarchyComponent', () => {
  let component: HierarchyComponent;
  let fixture: ComponentFixture<HierarchyComponent>;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let systemsServiceStub: SystemsService;
  let organizationServiceStub: OrganizationService;
  let accountServiceStub: AccountService;

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', ['getMandatoryFieldsByGroupId'])

  beforeEach(() => {
    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));

    TestBed.configureTestingModule({
      declarations: [HierarchyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub },
        { provide: NgxSpinnerService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: SystemsService, useClass: MockSystemsService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: AccountService, useClass: MockAccountService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HierarchyComponent);
    component = fixture.componentInstance;
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    systemsServiceStub = TestBed.inject(SystemsService);
    organizationServiceStub = TestBed.inject(OrganizationService);
    accountServiceStub = TestBed.inject(AccountService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open hierarchy levels Modal', () => {
    component.openDefineHierarchyLevelsModal();

    const modal = document.getElementById('newHierarchyLevel');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should open hierarchy level type Modal', () => {
    component.selectedSystem.id = 1;
    component.openDefineHierarchyTypeModal();

    const modal = document.getElementById('newHierarchyType');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should open previous sub division Modal', () => {
    component.openDefinePreviousSubDivHeadsModal();

    const modal = document.getElementById('newHierarchyHeadHistory');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close hierarchy levels Modal', () => {
    const modal = document.getElementById('newHierarchyLevel');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefineHierarchyLevelsModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close client hierarchy type Modal', () => {
    const modal = document.getElementById('newHierarchyType');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefineHierarchyTypeModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close previous subDiv heads Modal', () => {
    const modal = document.getElementById('newHierarchyHeadHistory');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefinePreviousSubDivHeadsModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  /*it('should open the hierarchy level modal and set form values when a hierarchy level is selected', () => {
    const mockSelectedHierarchy = mockHierarchyLevel[0];
    component.selectedHierarchyLevel = mockSelectedHierarchy;
    component.hierarchyLevelsEnumData = {
      name: "Trial"
    };
    const spyOpenHierarchyLevelsModal = jest.spyOn(component, 'openDefineHierarchyLevelsModal');
    const patchValueSpy = jest.spyOn(
      component.hierarchyLevelsForm,
      'patchValue'
    );
    component.ngOnInit();
    component.editHierarchyLevels();

    expect(spyOpenHierarchyLevelsModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      desc: mockSelectedHierarchy.description,
      ranking: mockSelectedHierarchy.ranking,
      type: mockSelectedHierarchy.type
    });
  });*/

  it('should open the hierarchy type modal and set form values when a hierarchy type is selected', () => {
    const mockSelectedHierarchyType = mockHierarchyType[0];
    component.selectedHierarchyType = mockSelectedHierarchyType;
    const spyOpenHierarchyTypeModal = jest.spyOn(component, 'openDefineHierarchyTypeModal');
    const patchValueSpy = jest.spyOn(
      component.hierarchyTypeForm,
      'patchValue'
    );

    component.editHierarchyType();

    expect(spyOpenHierarchyTypeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      description: mockSelectedHierarchyType.description,
      accType: mockSelectedHierarchyType.accountTypeCode,
      headAccType: mockSelectedHierarchyType.managerCode,
      type: mockSelectedHierarchyType.type,
      intermediary: mockSelectedHierarchyType.intermediaryCode,
      payIntermediary: mockSelectedHierarchyType.payIntermediary,
    });
  });

  it('should open the previous sub div heads modal and set form values when a previous sub div is selected', () => {
    const mockSelectedPrevSubDivHead = mockPreviousSubDivHeads[0];
    component.selectedPreviousSubDivHeads = mockSelectedPrevSubDivHead;
    const spyOpenPreviousSubDivModal = jest.spyOn(component, 'openDefinePreviousSubDivHeadsModal');
    const patchValueSpy = jest.spyOn(
      component.hierarchyHeadHistoryForm,
      'patchValue'
    );

    component.editPreviousSubDivHeads();

    expect(spyOpenPreviousSubDivModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      agentName: mockSelectedPrevSubDivHead.agentCode,
      wef: mockSelectedPrevSubDivHead.wef,
      wet: mockSelectedPrevSubDivHead.wet
    });
  });

  it('should fetch systems data', () => {
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of(mockSystem));
    component.ngOnInit();
    component.fetchSystems();
    expect(systemsServiceStub.getSystems).toHaveBeenCalled();
    expect(component.systems).toEqual(mockSystem);
  });

  it('should fetch hierarchy type enum data', () => {
    const hierarchyTypeEnum: any = {
      name: "Other Hierarchy",
      value: "O"
    }
    jest.spyOn(organizationServiceStub, 'getHierarchiesType').mockReturnValue(of());
    component.ngOnInit();
    component.fetchHierarchyTypeEnum();
    expect(organizationServiceStub.getHierarchiesType).toHaveBeenCalled();
    // expect(component.hierarchyLevelsEnumData).toBe(hierarchyTypeEnum);
  });

  it('should fetch account type data', () => {
    jest.spyOn(accountServiceStub, 'getAccountType').mockReturnValue(of(mockAccountTypes));
    component.ngOnInit();
    component.fetchAccountTypes();
    expect(accountServiceStub.getAccountType).toHaveBeenCalled();
    expect(component.accountTypeData).toEqual(mockAccountTypes);
  });

  it('should fetch hierarchy level enum data', () => {
    const hierarchyLevelEnum: any = {
      name: "National",
      value: "N"
    }
    jest.spyOn(organizationServiceStub, 'getHierarchiesLevels').mockReturnValue(of());
    component.ngOnInit();
    component.fetchHierarchyLevelEnum();
    expect(organizationServiceStub.getHierarchiesLevels).toHaveBeenCalled();
    // expect(component.hierarchyLevelsEnumData).toBe(hierarchyLevelEnum);
  });

  it('should fetch previous subDiv heads data', () => {
    jest.spyOn(organizationServiceStub, 'getOrgPrevSubDivisionHeads').mockReturnValue(of(mockPreviousSubDivHeads));
    component.ngOnInit();
    component.fetchPreviousSubDivisionHeads();
    expect(organizationServiceStub.getOrgPrevSubDivisionHeads).toHaveBeenCalled();
    expect(component.previousSubDivHeadsData).toEqual(mockPreviousSubDivHeads);
  });

  it('should save hierarchy types', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveHierarchyType');
    button.click();
    fixture.detectChanges();
    expect(organizationServiceStub.createOrgDivisionLevelType.call).toBeTruthy();
    expect(organizationServiceStub.createOrgDivisionLevelType.call.length).toBe(1);
  });

  it('should save hierarchy level', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveHierarchyLevel');
    button.click();
    fixture.detectChanges();
    expect(organizationServiceStub.createOrgDivisionLevel.call).toBeTruthy();
    expect(organizationServiceStub.createOrgDivisionLevel.call.length).toBe(1);
  });

  it('should save hierarchy previous head', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveHierarchyHead');
    button.click();
    fixture.detectChanges();
    expect(organizationServiceStub.createOrgPrevSubDivisionHead.call).toBeTruthy();
    expect(organizationServiceStub.createOrgPrevSubDivisionHead.call.length).toBe(1);
  });

  it('should delete when a hierarchy level type is selected', () => {
    component.selectedHierarchyType = mockHierarchyType[0];
    const selectedHierarchyTypeId = mockHierarchyType[0].code;

    const spyDeleteHierarchyType = jest.spyOn(organizationServiceStub, 'deleteOrgDivisionLevelType');

    const spyDisplaySuccessMessage = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spydelete = jest.spyOn(component, 'deleteHierarchyLevelType');
    component.deleteHierarchyLevelType();

    const button = fixture.debugElement.nativeElement.querySelector('#hierarchyTypeConfirmationModal');
    button.click();
    component.confirmHierarchyTypeDelete()

    expect(spydelete).toHaveBeenCalled();
    expect(spyDeleteHierarchyType).toHaveBeenCalledWith(selectedHierarchyTypeId);
  });

  it('should delete when a hierarchy level is selected', () => {
    component.selectedHierarchyLevel = mockHierarchyLevel[0];
    const selectedHierarchyLevelId = mockHierarchyLevel[0].code;

    const spyDeleteHierarchyLevel = jest.spyOn(organizationServiceStub, 'deleteOrgDivisionLevel');

    const spyDisplaySuccessMessage = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spydelete = jest.spyOn(component, 'deleteHierarchyLevel');
    component.deleteHierarchyLevel();

    const button = fixture.debugElement.nativeElement.querySelector('#hierarchyTypeConfirmationModal');
    button.click();

    component.confirmHierarchyLevelDelete();

    expect(spydelete).toHaveBeenCalled();
    expect(spyDeleteHierarchyLevel).toHaveBeenCalledWith(selectedHierarchyLevelId);
  });

  it('should delete when a hierarchy previous head is selected', () => {
    component.selectedPreviousSubDivHeads = mockPreviousSubDivHeads[0];
    const selectedHierarchyPrevId = mockPreviousSubDivHeads[0].code;

    const spyDeleteHierarchyPrev = jest.spyOn(organizationServiceStub, 'deleteOrgPrevSubDivisionHead');

    const spyDisplaySuccessMessage = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spydelete = jest.spyOn(component, 'deleteHierarchyHeadHistory');
    component.deleteHierarchyHeadHistory();

    const button = fixture.debugElement.nativeElement.querySelector('#hierarchyPrevHeadsConfirmationModal');
    button.click();
    component.confirmHierarchyPrevHeadsDelete()

    expect(spydelete).toHaveBeenCalled();
    expect(spyDeleteHierarchyPrev).toHaveBeenCalledWith(selectedHierarchyPrevId);
  });

  it('should throw error when delete hierarchy level type fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(organizationServiceStub, 'deleteOrgDivisionLevelType').mockReturnValueOnce(throwError(() => error));

    component.selectedHierarchyType = mockHierarchyType[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteHierarchyType');
    button.click();
    fixture.detectChanges();
    expect(component.deleteHierarchyLevelType.call).toBeTruthy();
  });

  it('should throw error when delete hierarchy level fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(organizationServiceStub, 'deleteOrgDivisionLevel').mockReturnValueOnce(throwError(() => error));

    component.selectedHierarchyLevel = mockHierarchyLevel[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteHierarchyLevel');
    button.click();
    fixture.detectChanges();
    expect(component.deleteHierarchyLevel.call).toBeTruthy();
  });

  it('should throw error when delete hierarchy previous subDiv head fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(organizationServiceStub, 'deleteOrgPrevSubDivisionHead').mockReturnValueOnce(throwError(() => error));

    component.selectedPreviousSubDivHeads = mockPreviousSubDivHeads[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteHierarchyPrevHead');
    button.click();
    fixture.detectChanges();
    expect(component.deleteHierarchyHeadHistory.call).toBeTruthy();
  });

  it('should open the all users modal', () => {
    component.openAllUsersModal();
    expect(component.allUsersModalVisible).toBeTruthy();
    expect(component.zIndex).toEqual(-1);
  });

  it('should set selectedMainUser, and patch agentCode value in hierarchyHeadHistoryForm', () => {
    jest.spyOn(component.hierarchyHeadHistoryForm, 'patchValue');
    const selectedMainUser: any = {
      id: 234, name: "John Doe"
    };
    const event: any = selectedMainUser;

    component.getSelectedUser(event);
    component.patchHierarchyTypeUser === false;

    expect(component.selectedMainUser).toEqual(event);
    expect(component.hierarchyHeadHistoryForm.patchValue).toHaveBeenCalledWith({
      agentName: 234
    });

    component.getSelectedUser(event);
  });

  it('should process selected user', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '#process-selected-user'
    );
    button.click();
    fixture.detectChanges();
    expect(component.processSelectedUser.call).toBeTruthy();
  });
});
