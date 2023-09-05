import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReportsComponent } from './my-reports.component';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClientTestingModule} from "@angular/common/http/testing";

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

describe('MyReportsComponent', () => {
  let component: MyReportsComponent;
  let fixture: ComponentFixture<MyReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyReportsComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    fixture = TestBed.createComponent(MyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
