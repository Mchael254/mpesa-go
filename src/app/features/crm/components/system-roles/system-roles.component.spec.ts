import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRolesComponent } from './system-roles.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {createSpyObj} from "jest-createspyobj";
import {of, throwError} from "rxjs";
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {SystemRole} from "../../../../shared/data/common/system-role";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MessageService} from "primeng/api";
import {ProcessArea} from "../../../../shared/data/common/process-area";
import {ProcessSubArea} from "../../../../shared/data/common/process-sub-area";
import {RoleArea} from "../../../../shared/data/common/role-area";
import {SentenceCasePipe} from "../../../../shared/pipes/sentence-case/sentence-case.pipe";

const systems: SystemsDto[] = [{id: 111, shortDesc: "TEST SYSTEM", systemName: "TEST SYSTEM"}];
const systemRoles: SystemRole[] = [{
  authorized: "Y",
  authorizedBy: "admin",
  createdAt: "2024-11-20",
  createdBy: "2024-11-20",
  editedBy: "",
  id: 123,
  organizationId: 2,
  roleName: "Sample Role",
  shortDesc: "Sample",
  status: "A",
  systemCode: 111
}]

const roleArea: RoleArea = {
  description: "testing role area",
  id: 507,
  name: "sample role",
  shortDesc: "sample short desct",
  system: undefined,
  systemCode: 37,
  visible: "Y"
};

const processArea: ProcessArea = {
  id: 0, name: "",
  roleAreaCode: 0,
  shortDesc: "",
  visible: ""
}

const processSubArea: ProcessSubArea = {
  id: 0,
  name: "",
  processAreaCode: 0,
  roleAreaCode: 0,
  shortDesc: "",
  type: "",
  userCode: 0,
  visible: ""
}


describe('SystemRolesComponent', () => {
  let component: SystemRolesComponent;
  let fixture: ComponentFixture<SystemRolesComponent>;

  const systemsServiceStub = createSpyObj('SystemsService', [
    'getSystems', 'getSystemRoles', 'createRole', 'editRole', 'deleteRole', 'getSystemRolesAreas',
    'getProcessAreas', 'getProcessSubAreas', 'getRolesAreas'
  ])

  beforeEach(() => {
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of(systems));
    jest.spyOn(systemsServiceStub, 'getSystemRoles').mockReturnValue(of(systemRoles));
    jest.spyOn(systemsServiceStub, 'createRole').mockReturnValue(of(systemRoles[0]));
    jest.spyOn(systemsServiceStub, 'editRole').mockReturnValue(of(systemRoles[0]));
    jest.spyOn(systemsServiceStub, 'deleteRole').mockReturnValue(null);
    jest.spyOn(systemsServiceStub, 'getRolesAreas').mockReturnValue(of([roleArea]));
    jest.spyOn(systemsServiceStub, 'getProcessAreas').mockReturnValue(of([processArea]));
    jest.spyOn(systemsServiceStub, 'getProcessSubAreas').mockReturnValue(of([processSubArea]));

    TestBed.configureTestingModule({
      declarations: [SystemRolesComponent, SentenceCasePipe],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        MessageService,
        { provide: SystemsService, useValue: systemsServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(SystemRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.fetchSystems.call).toBeTruthy();
  });

  test('should select system, then system role', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.select-system');
    button.click();
    fixture.detectChanges();
    expect(component.selectSystem.call).toBeTruthy();
    expect(component.systems.length).toBe(1);
    expect(component.systemRoles.length).toBe(1);

    const roleButton = fixture.debugElement.nativeElement.querySelector('.select-role');
    roleButton.click();
    fixture.detectChanges();
    expect(component.selectRole.call).toBeTruthy();
    expect(component.selectedRole).toBe(systemRoles[0]);
  });

  test('should save Role', () => {

    const systemButton = fixture.debugElement.nativeElement.querySelector('.select-system');
    systemButton.click();
    fixture.detectChanges();

    component.roleForm.setValue({
      roleName: 'Test Role',
      shortDesc: 'TR',
      createdAt: '',
      status: 'A',
      authorized: 'Y'
    });

    const button = fixture.debugElement.nativeElement.querySelector('#save-details');
    button.click();
    fixture.detectChanges();

    expect(component.createRole.call).toBeTruthy();
    expect(component.fetchSystemRoles.call).toBeTruthy();
  });

  test('should edit selected Role', () => {
    const systemButton = fixture.debugElement.nativeElement.querySelector('.select-system');
    systemButton.click();
    fixture.detectChanges();

    const selectRoleButton = fixture.debugElement.nativeElement.querySelector('.select-role');
    selectRoleButton.click();
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('#prepare-edit-role');
    button.click();
    fixture.detectChanges();

    const saveDetails = fixture.debugElement.nativeElement.querySelector('#save-details');
    saveDetails.click();
    fixture.detectChanges();

    expect(component.editRole.call).toBeTruthy();
    expect(component.fetchSystemRoles.call).toBeTruthy();
  });

  test('should delete system role', () => {
    const systemButton = fixture.debugElement.nativeElement.querySelector('.select-system');
    systemButton.click();
    fixture.detectChanges();

    const selectRoleButton = fixture.debugElement.nativeElement.querySelector('.select-role');
    selectRoleButton.click();
    fixture.detectChanges();
    expect(component.prepareEditRole.call).toBeTruthy()

    const deleteRoleButton = fixture.debugElement.nativeElement.querySelector('#delete-role-btn');
    deleteRoleButton.click();
    fixture.detectChanges();
    expect(component.deleteRole.call).toBeTruthy()
  })

  test('should reset form values', () => {
    const systemButton = fixture.debugElement.nativeElement.querySelector('.select-system');
    systemButton.click();
    fixture.detectChanges();

    const resetButton = fixture.debugElement.nativeElement.querySelector('#reset-form');
    resetButton.click();
    fixture.detectChanges();

    expect(component.resetFormValues.call).toBeTruthy();
  });

  test('fetch process areas', () => {
    // select a system
    const systemButton = fixture.debugElement.nativeElement.querySelector('.select-system');
    systemButton.click();
    fixture.detectChanges();

    // select a role
    const roleButton = fixture.debugElement.nativeElement.querySelector('.select-role');
    roleButton.click();
    fixture.detectChanges();

    // fetch process areas
    const processAreaButton = fixture.debugElement.nativeElement.querySelector('#fetchProcessArea');
    processAreaButton.click();
    fixture.detectChanges();

    expect(component.fetchProcessAreas.call).toBeTruthy();
    expect(component.processAreas.length).toBe(1);
  });

  /*test('fetch process sub areas', () => {
    // select a system
    const systemButton = fixture.debugElement.nativeElement.querySelector('.select-system');
    systemButton.click();
    fixture.detectChanges();

    // select a role
    const roleButton = fixture.debugElement.nativeElement.querySelector('.select-role');
    roleButton.click();
    fixture.detectChanges();

    // fetch process areas
    const processAreaButton = fixture.debugElement.nativeElement.querySelector('#fetchProcessArea');
    processAreaButton.click();
    fixture.detectChanges();

    // fetch process sub areas
    const processSubAreaButton = fixture.debugElement.nativeElement.querySelector('#fetchProcessSubAreas');
    processSubAreaButton.click();
    fixture.detectChanges();

    expect(component.fetchProcessSubAreas.call).toBeTruthy();
    expect(component.processSubAreas.length).toBe(1);
  });*/

  /*test('get systems fail', () => {
    const error = {
      error: { message: 'Failed'}
    };

    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValueOnce(throwError(() => error));
    const button = fixture.debugElement.nativeElement.querySelector('.select-system');
    button.click();
    fixture.detectChanges();
  });*/

});
