import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserStorage} from "../../../../shared/services/storage";
import {AuthService} from "../../../../shared/services/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {EntityService} from "../../../entities/services/entity/entity.service";


export class MockAuthService {
  getCurrentUser = jest.fn().mockReturnValue({ userName: 'GISADMIN'})
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const entityServiceStub = createSpyObj('EntityService',
    ['fetchGisPoliciesByUser', 'fetchGisQuotationsByUser'])

  const transaction = {
    _embedded:
      [
        {
          quotation_no: 100,
          client_name: 'Test Client',
          sum_insured: 25000,
          premium: 2500,
          intermediary: 'Agent',
          date_created: '08-08-2024',
          cover_from: '08-08-2024',
          cover_to: '08-08-2024',
          status: 'A',
          currency: 'KES'
        }
      ]
  };

  beforeEach(() => {
    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByUser')
      .mockReturnValue(of(transaction));

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByUser')
      .mockReturnValue(of(transaction));

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: EntityService, useValue: entityServiceStub },
        BrowserStorage
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.user.userName).toBe('GISADMIN');
    expect(component.fetchGisPoliciesByUser.call).toBeTruthy();
    expect(component.fetchGisQuotationsByUser.call).toBeTruthy();
  });
});
