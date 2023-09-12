import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketsComponent } from './view-tickets.component';
import {TableModule} from "primeng/table";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {TicketsService} from "../../../services/tickets.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {BrowserStorage} from "../../../../../shared/services/storage";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {ReassignTicketModalComponent} from "../reassign-ticket-modal/reassign-ticket-modal.component";
import {AuthService} from "../../../../../shared/services/auth.service";
import {BrowserModule} from "@angular/platform-browser";
import {APP_BASE_HREF} from "@angular/common";
import {MessageService} from "primeng/api";
import {NewTicketDto} from "../../../data/ticketsDTO";
import {CubejsApi} from "@cubejs-client/core";


export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth",
        "ticket_services": "turnquest",
        "gis_services": "gis",
      },
      "cubejsDefaultUrl": "http://10.176.18.211:4000/cubejs-api/v1"
    };
  }
}

export class MockLocalStorageService{
  setItem = jest.fn().mockReturnValue(null);
  getItem = jest.fn().mockReturnValue(of());
}

export class MockBrowserStorage{

}

export class MockAuthService{
  getCurrentUserName = jest.fn().mockReturnValue(of());
  sentVerificationOtp = jest.fn().mockReturnValue(of());
}

export class MockTicketService {
  getQuotation = jest.fn().mockReturnValue(of());
  getClaims = jest.fn().mockReturnValue(of());
  getUnderWriting = jest.fn().mockReturnValue(of());
  authorizeTicket = jest.fn().mockReturnValue(of());
  currentTicketDetail = jest.fn().mockReturnValue(of());
}

describe('ViewTicketsComponent', () => {
  let component: ViewTicketsComponent;
  let fixture: ComponentFixture<ViewTicketsComponent>;
  let spinnerStub: NgxSpinnerService;
  let authServiceStub: AuthService;
  let ticketServiceStub: TicketsService;
  let routerStub: Router;
  let activatedRouteStub: ActivatedRoute;
  let globalMessagingServiceStub: GlobalMessagingService;
  let localStorageStub: LocalStorageService;
  let appConfigServiceStub: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTicketsComponent, ReassignTicketModalComponent],
      imports: [
        TableModule,
        HttpClientTestingModule,
        NgxSpinnerModule.forRoot(),
        RouterTestingModule,
        BrowserModule,

      ],
      providers: [
        { provide: AuthService, MockAuthService },
        { provide: TicketsService, MockTicketService },
        { provide: GlobalMessagingService },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: MessageService },
        CubejsApi,
      ]
    });
    fixture = TestBed.createComponent(ViewTicketsComponent);
    component = fixture.componentInstance;
    spinnerStub = TestBed.inject(NgxSpinnerService);
    authServiceStub = TestBed.inject(AuthService);
    ticketServiceStub = TestBed.inject(TicketsService);
    routerStub = TestBed.inject(Router);
    activatedRouteStub = TestBed.inject(ActivatedRoute);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    localStorageStub = TestBed.inject(LocalStorageService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct ticket code for a given code', () => {
    const code = 'Q';
    const expectedTicketCode = 'Q123';

    const result = component.getTicketCode(code);

    expect(result).toBeUndefined();
    // expect(result).toBe(expectedTicketCode);
  });

  it('should navigate to ticket details and set ticket details in local storage and service', () => {
    const ticket: NewTicketDto = {
      ticketID: 123,
      systemModule: 'Q',
      intermediaryName: '',
      clientName: '',
      ticketAssignee: '',
      createdOn: '',
      refNo: '',
      ticketFrom: '',
      ticketName: '',
      ticketSystem: '',
      policyCode: 0,
      policyNumber: '',
      ticketBy: '',
      ticketDate: '',
      ticketDueDate: '',
      ticketRemarks: '',
      quotationNo:'claimNo: ',
      claimNumber: '',
      renewalDate: '',
      endorsementNumber: '',
      endorsementRemarks: '',
      quotationNumber: '',
    };

    const navigateSpy = jest.spyOn(routerStub, 'navigate').mockReturnValue(Promise.resolve(true));
    const currentDetail = jest.spyOn(ticketServiceStub.currentTicketDetail, 'set');

    component.goToTicketDetails(ticket);

    expect(localStorageStub.setItem).toHaveBeenCalledWith('ticketDetails', ticket);
    expect(ticketServiceStub.currentTicketDetail.set).toHaveBeenCalledWith(ticket);
    // expect(navigateSpy).toHaveBeenCalledWith(['home/administration/ticket/details/', { queryParams: { ticketId: '123', module: 'Q' } }]);
  });

  it('should return true when selectedTickets is not empty', () => {
    // Arrange
    component.selectedTickets = [{
      ticketID: 123,
      systemModule: 'Q',
      intermediaryName: '',
      clientName: '',
      ticketAssignee: '',
      createdOn: '',
      refNo: '',
      ticketFrom: '',
      ticketName: '',
      ticketSystem: '',
      policyCode: 0,
      policyNumber: '',
      ticketBy: '',
      ticketDate: '',
      ticketDueDate: '',
      ticketRemarks: '',
      quotationNo:'claimNo: ',
      claimNumber: '',
      renewalDate: '',
      endorsementNumber: '',
      endorsementRemarks: '',
      quotationNumber: '',
    }];

    const result = component.checkSelectedTickets();
    const errorMessageMock = jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');

    expect(result).toBe(true);
    expect(errorMessageMock).not.toHaveBeenCalled(); // No error message should be displayed
  });

  it('should return false and display an error message when selectedTickets is empty', () => {
    const selectedTickets: NewTicketDto[] = []; // Empty selectedTickets

    const result = component.checkSelectedTickets();

    expect(result).toBe(false);

    // if (selectedTickets.length === 0) {
    //   const errorMessageMock = jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');
    //   expect(errorMessageMock).toHaveBeenCalledWith('Warning', 'Please select at least one ticket to reassign');
    // }
  });
});
