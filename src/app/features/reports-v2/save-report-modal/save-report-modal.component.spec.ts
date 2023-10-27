import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveReportModalComponent } from './save-report-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AppConfigService} from "../../../core/config/app-config-service";
import { ReactiveFormsModule } from '@angular/forms';
import {createSpyObj} from "jest-createspyobj";
import { of } from 'rxjs';
import { ReportService } from '../../reports/services/report.service';



export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
      cubejsDefaultUrl: `http://10.176.18.211:4000/cubejs-api/v1`
    };
  }
}

describe('SaveReportModalComponent', () => {
  const reportServiceStub = createSpyObj('ReportService', [
    'getDashboards', 
  ]);

  let component: SaveReportModalComponent;
  let fixture: ComponentFixture<SaveReportModalComponent>;
  let appConfigService: AppConfigService;

  const dashboards = [
    {
      id: 123456,
      createdBy: 834,
      createdDate: '2023-10-11',
      reports: [],
      name: 'Tesing dashboard'
    }
  ]

  beforeEach(() => {
    jest.spyOn(reportServiceStub, 'getDashboards' ).mockReturnValue(of(dashboards));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [SaveReportModalComponent],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ReportService, useValue: reportServiceStub },
      ],
    });
    fixture = TestBed.createComponent(SaveReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.createSaveReportForm.call).toBeTruthy();
    expect(component.fetchDashboards.call).toBeTruthy();
    expect(component.dashboards).toBe(dashboards)
  });

  test('save report', () => {
    component.saveReportForm.controls['reportName'].setValue('Test Report');
    component.saveReportForm.controls['dashboard'].setValue(1234);
    component.saveReportForm.controls['destination'].setValue('M');

    const button = fixture.debugElement.nativeElement.querySelector('#saveReportBtn');
    button.click();
    fixture.detectChanges();

    expect(component.saveReport.call).toBeTruthy();
  });

});
