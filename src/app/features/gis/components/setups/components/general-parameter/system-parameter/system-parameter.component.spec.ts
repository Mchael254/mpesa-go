import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterComponent } from './system-parameter.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {MessageService} from "primeng/api";
import {ReactiveFormsModule} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {ParametersService} from "../../../services/parameters/parameters.service";


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

const mockParamService = {
  getAllParams: jest.fn()
    .mockReturnValue(of([]))
}

describe('SystemParameterComponent', () => {
  let component: SystemParameterComponent;
  let fixture: ComponentFixture<SystemParameterComponent>;
  let paramService: ParametersService

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemParameterComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ParametersService, useValue: mockParamService },
        MessageService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(SystemParameterComponent);
    component = fixture.componentInstance;
    paramService = TestBed.inject(ParametersService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should get all params', () => {
    component.ngOnInit();
    fixture.detectChanges();
  });

});
