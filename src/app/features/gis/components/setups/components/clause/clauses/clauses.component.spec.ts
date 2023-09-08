import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesComponent } from './clauses.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {AuthService} from "../../../../../../../shared/services/auth.service";
import {of} from "rxjs";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {MessageService} from "primeng/api";
import {BrowserStorage} from "../../../../../../../shared/services/storage";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {ReactiveFormsModule} from "@angular/forms";

export class MockClauseService {
  createClause = jest.fn().mockReturnValue(of());
  getClauses = jest.fn().mockReturnValue(of());
  setClauseCode = jest.fn().mockReturnValue(of());
  getClauseCode = jest.fn().mockReturnValue(of());
  getSingleClause = jest.fn().mockReturnValue(of());
  updateClause = jest.fn().mockReturnValue(of());
  reviseClause = jest.fn().mockReturnValue(of());
  deleteClause = jest.fn().mockReturnValue(of());
}
export class MockBrowserStorage{

}
export class MockAuthService{
  getCurrentUserName = jest.fn().mockReturnValue('testUser');
}
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
describe('ClausesComponent', () => {
  let component: ClausesComponent;
  let fixture: ComponentFixture<ClausesComponent>;
  let routeStub: Router;
  let spinnerStub: NgxSpinnerService;
  let clauseServiceStub: ClauseService;
  let authServiceStub: AuthService;
  let globalMessagingServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClausesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxSpinnerModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ClauseService, useClass: MockClauseService },
        { provide: GlobalMessagingService },
        { provide: MessageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    fixture = TestBed.createComponent(ClausesComponent);
    component = fixture.componentInstance;
    clauseServiceStub = TestBed.inject(ClauseService);
    routeStub = TestBed.inject(Router);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and set clauses', () => {

    const sampleClauses = [
      { id: 1, text: 'Clause 1' },
      { id: 2, text: 'Clause 2' },
    ];

    clauseServiceStub.getClauses();

    component.getAllClauses();

    fixture.whenStable().then(() => {

      expect(component.allClauses).toEqual(sampleClauses);
      expect(component.filteredClauses).toEqual(sampleClauses);

    });
  });

  it('should set clause code and update date and editor', () => {
    const code = '123';
    const updatedAt = '2023-08-24T12:34:56Z';
    const updatedBy = 'John Doe';

    component.selectedClause(code, updatedAt, updatedBy);

    expect(clauseServiceStub.setClauseCode).toHaveBeenCalledWith(code);

    expect(component.dateEdited).toBe('2023-08-24');
    expect(component.editedBy).toBe(updatedBy);
  });
  it('should reset the clauseForm and set isupdate to false', () => {
    component.clauseForm.get('isCurrent').setValue({ code: 'YourInitialCodeValue' }); // Provide a value for 'code'
    component.isupdate = true;

    component.createNewClause();

    expect(component.clauseForm.value).toEqual({ code: null }); // Make sure 'code' is set to null

    expect(component.isupdate).toBe(false);
  });
});
