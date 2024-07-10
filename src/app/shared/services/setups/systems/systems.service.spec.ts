import { TestBed } from '@angular/core/testing';

import { SystemsService } from './systems.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {SystemModule, SystemsDto} from "../../../data/common/systemsDto";
import {SystemRole} from "../../../data/common/system-role";
import {RoleArea} from "../../../data/common/role-area";
import {ProcessArea} from "../../../data/common/process-area";
import {ProcessSubArea} from "../../../data/common/process-sub-area";

describe('SystemsService', () => {
  let service: SystemsService;
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SystemsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get all systems', () => {
    const system: SystemsDto = {id: 0, shortDesc: "", systemName: ""};

    service.getSystems().subscribe(systems => {
      expect(systems).toBeTruthy();
      expect(systems.length).toBe(1);
    });

    const req = httpTestingController.expectOne(`/crm/setups/systems`);
    expect(req.request.method).toEqual('GET');
    req.flush([system])
  });

  test('should get system modules', () => {
    const systemModule: SystemModule = {description: "", id: 0, shortDescription: "", systemId: 0, systemName: ""};

    service.getSystemModules().subscribe(systemModules => {
      expect(systemModules).toBeTruthy();
      expect(systemModules.length).toBe(1);
    });

    const req = httpTestingController.expectOne(`/crm/setups/system-modules`);
    expect(req.request.method).toEqual(`GET`);
    req.flush([systemModule]);
  });

  test('should get system roles', () => {
    const systemRole: SystemRole = {id: 0, roleName: ""};
    const systemCode: number = 37;

    service.getSystemRoles(systemCode).subscribe(systemRoles => {
      expect(systemRoles).toBeTruthy();
      expect(systemRoles.length).toBe(1);
    });

    const req = httpTestingController.expectOne(`/user/administration/roles?systemCode=${systemCode}`);
    expect(req.request.method).toEqual(`GET`);
    req.flush([systemRole]);
  });

  test('should create role', () => {
    const systemRole: SystemRole = {id: 0, roleName: ""};
    service.createRole(systemRole).subscribe(systemRole => {
      expect(systemRole).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/user/administration/roles`);
    expect(req.request.method).toEqual(`POST`);
    req.flush(systemRole);
  });

  test('should edit role', () => {
    const systemRole: SystemRole = {id: 557, roleName: "Sample Role"};
    service.editRole(systemRole).subscribe(systemRole => {
      expect(systemRole).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/user/administration/roles/${systemRole.id}`);
    expect(req.request.method).toEqual(`PUT`);
    req.flush(systemRole);
  });

  test('should delete role', () => {
    service.deleteRole(557).subscribe(systemRole => {
      expect(systemRole).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/user/administration/roles/557`);
    expect(req.request.method).toEqual(`DELETE`);
    req.flush('');
  });

  test('should get role areas', () => {
    const roleArea: RoleArea = {
      description: "",
      id: 0,
      name: "",
      shortDesc: "",
      system: undefined,
      systemCode: 0,
      visible: ""
    };
    const roleId = 123;

    service.getRolesAreas(roleId).subscribe(roleAreas => {
      expect(roleAreas).toBeTruthy();
      expect(roleAreas.length).toBe(1);
    });

    const req = httpTestingController.expectOne(`/user/administration/role-area?systemCode=${roleId}`);
    expect(req.request.method).toEqual(`GET`);
    req.flush([roleArea]);
  });

  test('should get process areas', () => {
    const processArea: ProcessArea = {id: 0, name: "", roleAreaCode: 0, shortDesc: "", visible: ""};
    const roleAreaCode: number = 123;

    service.getProcessAreas(roleAreaCode).subscribe(processArea => {
      expect(processArea).toBeTruthy();
      expect(processArea.length).toBe(1);
    });

    const req = httpTestingController.expectOne(`/user/administration/process-area?roleAreaCode=${roleAreaCode}`);
    expect(req.request.method).toEqual(`GET`);
    req.flush([processArea]);
  });

  test('should get process sub areas', () => {
    const processSubArea: ProcessSubArea = {
      id: 0,
      name: "",
      processAreaCode: 0,
      roleAreaCode: 0,
      shortDesc: "",
      type: "",
      userCode: 0,
      visible: ""
    };
    const processAreaCode: number = 123;

    service.getProcessSubAreas(processAreaCode).subscribe(processSubArea => {
      expect(processSubArea).toBeTruthy();
      expect(processSubArea.length).toBe(1);
    });

    const req = httpTestingController.expectOne(`/user/administration/process-sub-area?processAreaCode=${processAreaCode}`);
    expect(req.request.method).toEqual(`GET`);
    req.flush([processSubArea]);
  });

});
