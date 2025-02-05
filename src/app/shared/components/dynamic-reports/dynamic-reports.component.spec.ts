import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicReportsComponent } from './dynamic-reports.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {ReportsService} from "../../services/reports/reports.service";
import {of} from "rxjs";
import {ReportFileDTO, ReportFileParams} from "../../data/common/reports-dto";

const mockReportData: ReportFileDTO = {
  bytes: "",
  data_file: "",
  error_msg: "",
  output_file: "",
  params: [],
  report_format: "",
  report_name: "",
  rpt_code: 0,
  rpt_prnt_srv_appl: "",
  rpt_tmpl_code: 0,
  style_file: "",
  template_file: ""

}

const mockReportFileParams: ReportFileParams = {
  active: "",
  code: 0,
  desc: "",
  name: "",
  prompt: "",
  query_data: [],
  rpt_code: 0,
  type: "",
  user_required: ""

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
  getReportDetails= jest.fn().mockReturnValue(of());
  getReportParameterDetails = jest.fn().mockReturnValue(of());
  generateCRMReport = jest.fn().mockReturnValue(of());
}

describe('DynamicReportsComponent', () => {
  let component: DynamicReportsComponent;
  let fixture: ComponentFixture<DynamicReportsComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let reportServiceStub: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicReportsComponent],
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
    fixture = TestBed.createComponent(DynamicReportsComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    reportServiceStub = TestBed.inject(ReportsService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should update the selected report on onReportSelect', () => {
    const report = { ...mockReportData };
    component.onReportSelect(report);

    expect(component.selectedReport).toEqual(report);
  });

  test('should fetch report details', () => {
    const reportCode = 1;
    const reportDetails = { ...mockReportData };
    jest.spyOn(reportServiceStub, 'getReportDetails').mockReturnValue(of(reportDetails));

    component.fetchReportDetails(reportCode);

    expect(reportServiceStub.getReportDetails).toHaveBeenCalledWith(reportCode);
    expect(component.reportData).toEqual(reportDetails);
  });

  test('should fetch report parameter details', () => {
    const reportCode = 1;
    const paramCode = 1;
    const paramName = 'Agent'
    const reportParameterDetails = { ...mockReportFileParams };
    jest.spyOn(reportServiceStub, 'getReportParameterDetails').mockReturnValue(of(reportParameterDetails));

    component.fetchReportDetails(reportCode);
    component.fetchReportParameterDetails(paramCode, paramName);

    expect(reportServiceStub.getReportParameterDetails).toHaveBeenCalledWith(reportCode, paramCode);
    expect(component.reportParamData).toEqual(reportParameterDetails);
  });

  test('should generate report', () => {
    const report = { ...mockReportData };
    jest.spyOn(component, 'generateReport');
    component.generateReport(report);

    expect(component.generateReport).toHaveBeenCalledWith(report);
  });

  test('should open report download Modal', () => {
    component.openReportDownloadModal();

    const modal = document.getElementById('reportDownloadModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close report download Modal', () => {
    const modal = document.getElementById('reportDownloadModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeReportDownloadModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should download file', () => {
    const fileUrl = 'https://example.com/file.pdf';
    const fileName = 'report.pdf';
    const link = document.createElement('a');
    jest.spyOn(document, 'createElement').mockReturnValue(link);
    const clickSpy = jest.fn();
    link.click = clickSpy;

    component.download(fileUrl, fileName);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(link.href).toBe(fileUrl);
    expect(link.download).toBe(fileName);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
