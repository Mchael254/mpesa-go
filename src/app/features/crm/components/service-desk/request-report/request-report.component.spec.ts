import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReportComponent } from './request-report.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {of} from "rxjs";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";
import {
  ReportFileDTO,
  SystemReportDto
} from "../../../../../shared/data/common/reports-dto";

const mockReportData: ReportFileDTO = {
  bytes: "",
  dataFile: "",
  errorMsg: "",
  outputFile: "",
  params: [],
  reportFormat: "",
  reportName: "",
  rptCode: 0,
  rptPrntSrvAppl: "",
  rptTmplCode: 0,
  styleFile: "",
  templateFile: ""

}

const mockSystemReportData: SystemReportDto = {
  applicationLevel: "",
  code: 0,
  datafile: "",
  description: "",
  name: "",
  order: 0,
  printSrvAppl: "",
  printSrvcAppl: "",
  rsmCode: 0,
  shortDescription: "",
  status: "",
  systemCode: 0,
  type: "",
  update: "",
  visible: ""

}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockReportService {
  getReportsBySystem= jest.fn().mockReturnValue(of());
}

describe('RequestReportComponent', () => {
  let component: RequestReportComponent;
  let fixture: ComponentFixture<RequestReportComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let reportServiceStub: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestReportComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: ReportsService, useClass: MockReportService}
      ]
    });
    fixture = TestBed.createComponent(RequestReportComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    reportServiceStub = TestBed.inject(ReportsService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch report details', () => {
    const reportCode = 1;
    const applicationLevel = 'SYSR';
    const reportDetails = { ...mockSystemReportData[0] };
    jest.spyOn(reportServiceStub, 'getReportsBySystem').mockReturnValue(of(reportDetails));

    component.fetchReports(reportCode, applicationLevel);

    expect(reportServiceStub.getReportsBySystem).toHaveBeenCalledWith(reportCode, applicationLevel);
    expect(component.serviceRequestReportsData).toEqual(reportDetails);
  });

  test('should fetch report details on onReportSelect', () => {
    const report = { ...mockReportData };
    component.onReportSelect(report);

    expect(component.selectedReport).toEqual(report);
  });
});
