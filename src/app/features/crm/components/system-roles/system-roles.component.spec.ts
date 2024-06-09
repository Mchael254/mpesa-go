import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRolesComponent } from './system-roles.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {SystemRole} from "../../../../shared/data/common/system-role";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

const systems: SystemsDto[] = [{id: 111, shortDesc: "", systemName: ""}];
const systemRoles: SystemRole[] = [{
  authorized: "Y",
  authorizedBy: "admin",
  createdAt: "",
  createdBy: "",
  editedBy: "",
  id: 111,
  organizationId: 2,
  roleName: "Sample Role",
  shortDesc: "Sample",
  status: "A",
  systemCode: 123
}]

describe('SystemRolesComponent', () => {
  let component: SystemRolesComponent;
  let fixture: ComponentFixture<SystemRolesComponent>;

  const systemsServiceStub = createSpyObj('SystemsService', [
    'getSystems', 'getSystemRoles',
  ])

  beforeEach(() => {
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of(systems));
    jest.spyOn(systemsServiceStub, 'getSystemRoles').mockReturnValue(of(systemRoles));

    TestBed.configureTestingModule({
      declarations: [SystemRolesComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
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


});
