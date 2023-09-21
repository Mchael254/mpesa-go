import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenCodesComponent } from './screen-codes.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {MessageService} from "primeng/api";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {ScreenCode, ScreenCodes} from "../../../data/gisDTO";
import {ScheduleService} from "../../../services/schedule/schedule.service";

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

const screenCode: ScreenCode = {
  claimScheduleReport: null,
  code: "TEST",
  coverSummaryName: null,
  endorsementSchedule: "",
  fleetName: null,
  helpContent: null,
  isScheduleRequired: "",
  level: "",
  numberOfRisks: null,
  organization_code: 0,
  policyDocumentName: null,
  policyDocumentRiskNoteName: null,
  policySchedule: null,
  renewalCertificates: null,
  renewalNotice: "",
  riskNoteName: null,
  riskReportName: "",
  scheduleReportName: "",
  screenId: 0,
  screenName: "",
  screenTitle: null,
  screenType: null,
  screen_description: "",
  showDefaultRisks: "",
  showSumInsured: "",
  version: 0,
  xmlNiskNoteName: null
}

const screenCodes: ScreenCodes = {_embedded: {screen_dto_list: [screenCode]}}

const mockScheduleService = {
  getAllScreenCodes: jest.fn().mockReturnValue(of(screenCodes)),
  createScreenCode: jest.fn().mockReturnValue(of(screenCode)),
  updateScreenCode: jest.fn().mockReturnValue(of(screenCode)),
  // deleteParameter: jest.fn().mockReturnValue(of()),
}

describe('ScreenCodesComponent', () => {
  let component: ScreenCodesComponent;
  let fixture: ComponentFixture<ScreenCodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenCodesComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ScheduleService, useValue: mockScheduleService },
        MessageService
      ],
      schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
    });
    fixture = TestBed.createComponent(ScreenCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loadAllScreenCodes.call).toBeTruthy();
    expect(component.createScreenForm.call).toBeTruthy();
  });

  test('should filter screen codes', () => {
    const input = fixture.debugElement.nativeElement.querySelector('#filterScreenCodes');
    input.value = 'TEST';
    input.dispatchEvent(new Event('keyup'));
    expect(component.filteredScreenCodes.length).toEqual(1)
  });

  test('should select screen code', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#selectScreenCode');
    button.click();
    expect(component.selectedScreenCode).toBe(screenCode)
  });

  test('should save screen code', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#createUpdateScreenCode');
    button.click();
    expect(component.createScreenCode.call).toBeTruthy();
  });

  test('should update parameter', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#selectScreenCode');
    button.click();

    const saveButton = fixture.debugElement.nativeElement.querySelector('#createUpdateScreenCode');
    saveButton.click();
    expect(component.updateScreenCode.call).toBeTruthy();
  });

  test('should reset form', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#resetForm');
    button.click();
    expect(component.resetForm.call).toBeTruthy();
    expect(component.isUpdateScreenCode).toBe(false);
  });

});
