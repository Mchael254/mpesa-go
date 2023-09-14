import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReportsComponent } from './ticket-reports.component';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {Logger} from "../../../../../../shared/services";

describe('TicketReportsComponent', () => {
  let component: TicketReportsComponent;
  let fixture: ComponentFixture<TicketReportsComponent>;
  let routerStub: Router;
  let activatedRouterStub: ActivatedRoute;
  let log : Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketReportsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });
    fixture = TestBed.createComponent(TicketReportsComponent);
    component = fixture.componentInstance;
    routerStub = TestBed.inject(Router);
    activatedRouterStub = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch reports for claims module', () => {
    const moduleName = 'C';
    const reportName = 'ClaimReport';

    jest.spyOn(component, 'fetchReports');
    jest.spyOn(component, 'getReportLink');

    component.fetchReports(moduleName, reportName);

    expect(component.reportsWithLinks).toEqual([{ name: 'Claim Voucher Report', link: 'http://10.176.18.211:9991/reports/claim_voucher_report?output=HTML' }]);
  });
});
