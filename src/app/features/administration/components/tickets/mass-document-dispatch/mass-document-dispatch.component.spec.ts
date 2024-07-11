import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassDocumentDispatchComponent } from './mass-document-dispatch.component';
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TicketsService} from "../../../services/tickets.service";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../../../../shared/shared.module";
import {TableModule} from "primeng/table";
import {of} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {BankDTO} from "../../../../../shared/data/common/bank-dto";
import {FormsModule} from "@angular/forms";


export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockPoliciesService {

}

export class MockTicketsService {
  setCurrentTickets = jest.fn().mockReturnValue(of);
  sortTickets = jest.fn().mockReturnValue(of());
}

export class MockTranslateService {
  getTranslation = jest.fn().mockReturnValue(of());
  get = jest.fn().mockReturnValue(of());
}

describe('MassDocumentDispatchComponent', () => {
  let component: MassDocumentDispatchComponent;
  let fixture: ComponentFixture<MassDocumentDispatchComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let policiesServiceStub: PoliciesService;
  let spinnerStub: NgxSpinnerService;
  let ticketServiceStub: TicketsService;
  let reportServiceStub: ReportsService;
  let translateServiceStub: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MassDocumentDispatchComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        TableModule,
        FormsModule
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: PoliciesService, useClass: MockPoliciesService },
        { provide: NgxSpinnerService },
        { provide: TicketsService, useClass: MockTicketsService },
        { provide: ReportsService },
        { provide: TranslateService, useClass: MockTranslateService },

      ]
    });
    fixture = TestBed.createComponent(MassDocumentDispatchComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    policiesServiceStub = TestBed.inject(PoliciesService);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    ticketServiceStub = TestBed.inject(TicketsService);
    reportServiceStub = TestBed.inject(ReportsService);
    translateServiceStub = TestBed.inject(TranslateService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Doc Dispatch Modal', () => {

    component.openDocDispatchModal();

    const modal = document.getElementById('docDispatchToggle');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close Doc Dispatch Modal', () => {
    const modal = document.getElementById('docDispatchToggle');

    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDocDispatchModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open Doc Confirm Modal', () => {

    component.openDocConfirmModal();

    const modal = document.getElementById('docConfirmToggle');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close Doc Confirm Modal', () => {
    const modal = document.getElementById('docConfirmToggle');

    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDocConfirmModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });
});
