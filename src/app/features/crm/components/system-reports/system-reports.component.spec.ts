import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemReportsComponent } from './system-reports.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {ReportsService} from "../../../../shared/services/reports/reports.service";
import {of} from "rxjs";
import {SetupsParametersService} from "../../../../shared/services/setups-parameters.service";
import {ReportFileDTO, SystemReportDto} from "../../../../shared/data/common/reports-dto";

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

const mockSystemReportData: SystemReportDto = {
  application_level: "",
  code: 0,
  datafile: "",
  description: "",
  name: "",
  order: 0,
  print_srv_appl: "",
  print_srvc_appl: "",
  rsm_code: 0,
  short_description: "",
  status: "",
  system_code: 0,
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

export class MockSetupsParametersService {
  getParameters = jest.fn().mockReturnValue(of());
}

describe('SystemReportsComponent', () => {
  let component: SystemReportsComponent;
  let fixture: ComponentFixture<SystemReportsComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let reportServiceStub: ReportsService;
  let setupsParametersService: SetupsParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemReportsComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: ReportsService, useClass: MockReportService },
        { provide: SetupsParametersService, useClass: MockSetupsParametersService }
      ]
    });
    fixture = TestBed.createComponent(SystemReportsComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    reportServiceStub = TestBed.inject(ReportsService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch report details on onReportSelect', () => {
    const report = { ...mockReportData };
    component.onReportSelect(report);

    expect(component.selectedReport).toEqual(report);
  });

  test('should fetch system reports', () => {
    const reportCode = 1;
    const applicationLevel = 'SYSR';
    const reportDetails = { ...mockSystemReportData[0] };
    jest.spyOn(reportServiceStub, 'getReportsBySystem').mockReturnValue(of(reportDetails));

    component.fetchReports(reportCode, applicationLevel);

    expect(reportServiceStub.getReportsBySystem).toHaveBeenCalledWith(reportCode, applicationLevel);
    expect(component.systemReportsData).toEqual(reportDetails);
  });

  test('should fetch report details', () => {
    const reportCode = 1;
    const applicationLevel = 'DIDR';
    const reportDetails = { ...mockSystemReportData[0] };
    jest.spyOn(reportServiceStub, 'getReportsBySystem').mockReturnValue(of(reportDetails));

    component.fetchDirectDebitReports(reportCode, applicationLevel);

    expect(reportServiceStub.getReportsBySystem).toHaveBeenCalledWith(reportCode, applicationLevel);
    expect(component.directDebitReportsData).toEqual(reportDetails);
  });

  test('show/hide direct debit reports', () => {
    const debitParam = 'DIRECT_DEBIT_RPTS';
    jest.spyOn(setupsParametersService, 'getParameters').mockReturnValue(of());
    component.defineDebitReportsVisibility();

    expect(setupsParametersService.getParameters).toHaveBeenCalledWith(debitParam);
  });
});
