import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankFormComponent } from './edit-bank-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('EditBankFormComponent', () => {
  let component: EditBankFormComponent;
  let fixture: ComponentFixture<EditBankFormComponent>;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBankFormComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ]
    });
    fixture = TestBed.createComponent(EditBankFormComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
