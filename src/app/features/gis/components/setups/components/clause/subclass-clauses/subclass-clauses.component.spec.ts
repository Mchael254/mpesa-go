import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubclassClausesComponent } from './subclass-clauses.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {MessageService} from "primeng/api";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {CoverTypeService} from "../../../services/cover-type/cover-type.service";
import {of} from "rxjs";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {BankService} from "../../../../../../../shared/services/setups/bank.service";

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
 export class MockCoverTypeService {
   getAllCovertypes = jest.fn().mockReturnValue(of());
 }

export class MockClauseService {
  getAllSubclasses = jest.fn().mockReturnValue(of());
}
describe('SubclassClausesComponent', () => {
  let component: SubclassClausesComponent;
  let fixture: ComponentFixture<SubclassClausesComponent>;
  let spinnerStub: NgxSpinnerService;
  let clauseServiceStub: ClauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubclassClausesComponent],
      imports: [
        HttpClientTestingModule,
        NgxSpinnerModule.forRoot(),
      ],
      providers: [
        { provide: GlobalMessagingService },
        { provide: MessageService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: CoverTypeService, useClass: MockCoverTypeService },
        { provide: ClauseService, useClass: MockClauseService },
        { provide: BankService}
      ]
    });
    fixture = TestBed.createComponent(SubclassClausesComponent);
    component = fixture.componentInstance;
    clauseServiceStub = TestBed.inject(ClauseService);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
