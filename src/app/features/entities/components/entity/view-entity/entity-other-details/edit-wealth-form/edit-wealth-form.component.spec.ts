import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWealthFormComponent } from './edit-wealth-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {TranslateModule} from "@ngx-translate/core";

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

describe('EditWealthFormComponent', () => {
  let component: EditWealthFormComponent;
  let fixture: ComponentFixture<EditWealthFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditWealthFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ]
    });
    fixture = TestBed.createComponent(EditWealthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
