import { ComponentFixture, TestBed } from '@angular/core/testing';

import {ReportDefinitionComponent} from './report-definition.component';
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {of} from "rxjs";
import {ReusableInputComponent} from "../../../../../shared/components/reusable-input/reusable-input.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {SharedModule} from "../../../../../shared/shared.module";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {TableModule} from "primeng/table";
import {TranslateModule} from "@ngx-translate/core";
import {SystemReportModule, SystemReportSubModule, SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";
import {SystemReportDto} from "../../../../../shared/data/common/reports-dto";

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of());
}

export class MockSystemsService {
  getSystemReportModules = jest.fn().mockReturnValue(of(mockReportModule));
  createSystemReportModule = jest.fn().mockReturnValue(of());
  updateSystemReportModule = jest.fn().mockReturnValue(of());
  deleteSystemReportModule = jest.fn().mockReturnValue(of());
  getSystems = jest.fn().mockReturnValue(of(mockSystem));
  getSystemReportSubModules = jest.fn().mockReturnValue(of(mockReportSubModule));
  createSystemReportSubModule = jest.fn().mockReturnValue(of());
  updateSystemReportSubModule = jest.fn().mockReturnValue(of());
}

export class MockReportsService {
  getAssignedOrUnassignedReports = jest.fn().mockReturnValue(of(mockSystemReport));
  assignOrUnassignReport = jest.fn().mockReturnValue(of(mockSystemReport));
  updateReportDetails = jest.fn().mockReturnValue(of());
}

const mockSystem: SystemsDto[] = [
  {
    "id": 1,
    "systemName": "System one",
    "shortDesc": "System one desc",
  }
];

const mockReportModule: SystemReportModule[] = [
  {
    "id": 1,
    "name": "Module one",
    "description": "Module desc",
    "systemCode": 34,
    "system": mockSystem[0],
  }
]

const mockReportSubModule: SystemReportSubModule[] = [
  {
    "id": 1,
    "name": "Sub module one",
    "description": "Description for sub module",
    "moduleId": 354,
  }
];

const mockSystemReport: SystemReportDto[] = [
  {
    "code": 1,
    "systemCode": 15,
    "name": "Report name",
    "description": "Report description",
    "datafile": "",
    "applicationLevel": "SYS",
    "status": "",
    "rsmCode": 20,
    "order": 3,
    "printSrvAppl": "",
    "printSrvcAppl": "",
    "type": "",
    "visible": "",
    "shortDescription": "",
    "update": ""
  },
  {
    "code": 2,
    "systemCode": 15,
    "name": "Report name two",
    "description": "Report description two",
    "datafile": "",
    "applicationLevel": "SYS",
    "status": "",
    "rsmCode": 20,
    "order": 3,
    "printSrvAppl": "",
    "printSrvcAppl": "",
    "type": "",
    "visible": "",
    "shortDescription": "",
    "update": ""
  }
];

describe('ReportDefinitionComponent', () => {
  let component: ReportDefinitionComponent;
  let fixture: ComponentFixture<ReportDefinitionComponent>;
  let systemsServiceStub: SystemsService;
  let messageServiceStub: GlobalMessagingService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let reportsServiceStub: ReportsService;
  jest.mock('ng2-pdf-viewer', () => ({
    PdfViewerComponent: jest.fn(),
  }));
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportDefinitionComponent,
        ReusableInputComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryService },
        { provide: SystemsService, useClass: MockSystemsService },
        { provide: ReportsService, useClass: MockReportsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ReportDefinitionComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    systemsServiceStub = TestBed.inject(SystemsService);
    reportsServiceStub = TestBed.inject(ReportsService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should open define module Modal', () => {
    component.selectedSystem = <SystemsDto>{};  // or set it to an appropriate value

    component.openDefineModuleModal();

    const modal = document.getElementById('moduleDefinitionModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close define module Modal', () => {
    const modal = document.getElementById('moduleDefinitionModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefineModuleModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open define sub module Modal', () => {
    component.openSubModuleModal();

    const modal = document.getElementById('subModuleDefinitionModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close define sub module Modal', () => {
    const modal = document.getElementById('subModuleDefinitionModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeSubModuleModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should save module', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveModuleBtn');
    button.click();
    fixture.detectChanges();
    expect(systemsServiceStub.createSystemReportModule.call).toBeTruthy();
    expect(systemsServiceStub.createSystemReportModule.call.length).toBe(1);
  });

  test('should save submodule', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveSubModuleBtn');
    button.click();
    fixture.detectChanges();
    expect(systemsServiceStub.createSystemReportSubModule.call).toBeTruthy();
    expect(systemsServiceStub.createSystemReportSubModule.call.length).toBe(1);
  });

  test('should open the product define module modal and set form values when a module is selected', () => {
    const mockSelectedModule = mockReportModule[0];
    component.selectedModule = mockSelectedModule;
    const spyOpenDefineModuleModal = jest.spyOn(component, 'openDefineModuleModal');
    const patchValueSpy = jest.spyOn(
      component.defineModuleForm,
      'patchValue'
    );

    component.editModule();

    expect(spyOpenDefineModuleModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      moduleName: mockSelectedModule.name,
      moduleDescription: mockSelectedModule.description,
      system:  component.selectedSystem?.systemName,
    });
  });

  test('should open the product define sub module modal and set form values when a sub module is selected', () => {
    const mockSelectedSubModule = mockReportSubModule[0];
    component.selectedSubModule = mockSelectedSubModule;
    const spyOpenDefineSubModuleModal = jest.spyOn(component, 'openSubModuleModal');
    const patchValueSpy = jest.spyOn(
      component.defineSubModuleForm,
      'patchValue'
    );

    component.editSubModule();

    expect(spyOpenDefineSubModuleModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      subModuleName: mockSelectedSubModule.name,
      subModuleDescription: mockSelectedSubModule.description,
    });
  });

  test('should display an error message when no module is selected during edit', () => {
    component.selectedModule = null;

    component.editModule();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No module is selected!'
    );
  });

  test('should display an error message when no sub module is selected during edit', () => {
    component.selectedSubModule = null;

    component.editSubModule();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No sub module is selected!'
    );
  });

  test('should confirm module deletion when a module is selected', () => {
    component.selectedModule = mockReportModule[0];
    const selectedModuleId = mockReportModule[0].id;

    const spydeleteModuleConfirmation = jest.spyOn(systemsServiceStub, 'deleteSystemReportModule');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spyDeleteModule = jest.spyOn(component, 'deleteModule');
    component.deleteModule();

    const button = fixture.debugElement.nativeElement.querySelector('#moduleConfirmationModal');
    button.click();

    component.confirmModuleDelete();

    expect(spyDeleteModule).toHaveBeenCalled();
    expect(spydeleteModuleConfirmation).toHaveBeenCalledWith(selectedModuleId);
  });

  test('should fetch systems data', () => {
    jest.spyOn(systemsServiceStub,'getSystems');

    component.getAllSystems();
    expect(systemsServiceStub.getSystems).toHaveBeenCalled();
    expect(component.systems).toEqual(mockSystem);
  });

  test('should fetch modules data', () => {
    jest.spyOn(systemsServiceStub,'getSystemReportModules');
    const systemId = mockSystem[0].id;
    component.getAllSystemReportModules(systemId);
    expect(systemsServiceStub.getSystemReportModules).toHaveBeenCalled();
    expect(component.modulesData).toEqual(mockReportModule);
  });

  test('should fetch submodules data', () => {
    jest.spyOn(systemsServiceStub,'getSystemReportSubModules');
    const moduleId = mockReportModule[0].id;
    component.getAllSystemReportSubModules(moduleId);
    expect(systemsServiceStub.getSystemReportSubModules).toHaveBeenCalled();
    expect(component.subModuleData).toEqual(mockReportSubModule);
  });

  test('should set selectedModule and fetch its sub-modules', () => {
    const getAllSystemReportSubModulesSpy = jest.spyOn(component, 'getAllSystemReportSubModules');

    component.onSelectModule(mockReportModule[0]);

    expect(component.selectedModule).toEqual(mockReportModule[0]);
    expect(getAllSystemReportSubModulesSpy).toHaveBeenCalledWith(mockReportModule[0].id);
  });

  test('should set selectedSubModule and fetch all and assigned reports', () => {
    const fetchAllUnAssignedReportsSpy = jest.spyOn(component, 'fetchAllUnAssignedReports');
    const fetchAssignedReportsSpy = jest.spyOn(component, 'fetchAssignedReports');

    component.onSelectSubModule(mockReportSubModule[0]);

    expect(component.selectedSubModule).toEqual(mockReportSubModule[0]);
    expect(fetchAllUnAssignedReportsSpy).toHaveBeenCalledWith(null);
    expect(fetchAssignedReportsSpy).toHaveBeenCalledWith(mockReportSubModule[0].id);
  });

  test('should toggle dropdown visibility', () => {
    const mockReport = { id: 1, name: 'Test Report' };
    const anotherReport = { id: 2, name: 'Another Report' };

    component.showInputForReport = null;
    component.toggleDropdown(mockReport);
    expect(component.showInputForReport).toEqual(mockReport);

    component.toggleDropdown(mockReport);
    expect(component.showInputForReport).toBeNull();

    component.toggleDropdown(anotherReport);
    expect(component.showInputForReport).toEqual(anotherReport);
  });

  test('should fetch unassigned reports data', () => {
    jest.spyOn(reportsServiceStub,'getAssignedOrUnassignedReports');
    const submoduleId = mockReportSubModule[0].id;
    component.fetchAllUnAssignedReports(submoduleId);
    expect(reportsServiceStub.getAssignedOrUnassignedReports).toHaveBeenCalled();
    expect(component.allReportsData).toEqual(mockSystemReport);
  });

  test('should fetch assigned reports data', () => {
    jest.spyOn(reportsServiceStub,'getAssignedOrUnassignedReports');
    const submoduleId = mockReportSubModule[0].id;
    component.fetchAssignedReports(submoduleId);
    expect(reportsServiceStub.getAssignedOrUnassignedReports).toHaveBeenCalled();
    expect(component.assignedReportsData).toEqual(mockSystemReport);
  });

  test('should assign reports when status is "A"', async () => {
    component.selectedReport = mockSystemReport;
    component.selectedSubModule = mockReportSubModule[0];
    jest.spyOn(reportsServiceStub,'assignOrUnassignReport');

    await component.assignOrUnassignReport('A');

    expect(reportsServiceStub.assignOrUnassignReport).toHaveBeenCalledWith({
      code: [1, 2],
      subModuleCode: 1,
    });
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully assigned reports to sub module');
    expect(component.selectedReport).toEqual([]);
  });

  test('should unassign reports when status is "U"', async () => {
    component.selectedAssignedReport = mockSystemReport;
    jest.spyOn(reportsServiceStub,'assignOrUnassignReport');

    await component.assignOrUnassignReport('U');

    expect(reportsServiceStub.assignOrUnassignReport).toHaveBeenCalledWith({
      code: [1, 2],
      subModuleCode: null,
    });
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully unassigned report(s) from sub module');
    expect(component.selectedAssignedReport).toEqual([]);
  });

  it('should update report description correctly', () => {
    const mockEvent = {
      target: {
        value: 'New report description'
      }
    } as unknown as Event;

    const mockReport = { code: 'report1' };

    component.updateReportDescription(mockEvent, mockReport);

    expect(component.reportDescription).toBe('New report description');
  });

  test('should display error if no report is selected for unassigned reports', () => {
    component.selectedReport = [];
    component.saveReportDescription('U');

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith('Error', 'No report is selected');
  });

  test('should display error if no report is selected for assigned reports', () => {
    component.selectedAssignedReport = [];
    component.saveReportDescription('A');

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith('Error', 'No assigned report is selected');
  });

  it('should update report description for unassigned report', () => {
    component.selectedReport = mockSystemReport;
    component.reportDescription = 'Updated description';
    jest.spyOn(reportsServiceStub,'updateReportDetails');

    component.saveReportDescription('U');

    expect(reportsServiceStub.updateReportDetails).toHaveBeenCalledWith(1, 'Updated description');
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Report description updated successfully');
    expect(component.selectedReport).toEqual([]);
    expect(component.reportDescription).toBe('');
  });

  it('should update report description for assigned report', () => {
    component.selectedAssignedReport = mockSystemReport;
    component.reportDescription = 'Another updated description';
    jest.spyOn(reportsServiceStub,'updateReportDetails');

    component.saveReportDescription('A');

    expect(reportsServiceStub.updateReportDetails).toHaveBeenCalledWith(1, 'Another updated description');
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Report description updated successfully');
    expect(component.selectedAssignedReport).toEqual([]);
    expect(component.reportDescription).toBe('');
  });
});
