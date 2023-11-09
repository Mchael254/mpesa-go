import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterComponent } from './system-parameter.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {MessageService} from "primeng/api";
import {ReactiveFormsModule} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {ParametersService} from "../../../services/parameters/parameters.service";
import {Params} from "../../../data/gisDTO";


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

const params: Params = {
  code: 0,
  description: "",
  name: "sample ",
  organizationCode: 0,
  status: "",
  value: "",
  version: 0
}

const mockParamService = {
  getAllParams: jest.fn().mockReturnValue(of([params])),
  createParam: jest.fn().mockReturnValue(of(params)),
  updateParam: jest.fn().mockReturnValue(of(params)),
  deleteParameter: jest.fn().mockReturnValue(of(params)),
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
    expect(component.getAllParams.call).toBeTruthy();
    expect(component.createParameterForm.call).toBeTruthy();
    expect(component.filteredParams.length).toEqual(1);
  });

  test('should filter params', () => {
    const input = fixture.debugElement.nativeElement.querySelector('#filterParams');
    input.value = 'sample';
    input.dispatchEvent(new Event('keyup'));
    expect(component.filterParams.length).toEqual(1)
  });

  test('should select param', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.selectParam');
    button.click();
    expect(component.selectedParam).toBe(params)
  });

  test('should save parameter', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveParameter');
    button.click();
    expect(component.createParameter.call).toBeTruthy();
    expect(component.getAllParams.call).toBeTruthy();
  });

  test('should update parameter', () => {
    // component.isUpdateParam = true;
    const button = fixture.debugElement.nativeElement.querySelector('.selectParam');
    button.click();

    const saveButton = fixture.debugElement.nativeElement.querySelector('#saveParameter');
    saveButton.click();

    expect(component.createParameter.call).toBeTruthy();
    expect(component.getAllParams.call).toBeTruthy();
  });

  test('should reset form', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#resetForm');
    button.click();
    expect(component.resetForm.call).toBeTruthy();
    expect(component.isUpdateParam).toBe(false);
  });

  test('should delete parameter', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.selectParam');
    button.click();

    const deleteButton = fixture.debugElement.nativeElement.querySelector('#deleteParam');
    deleteButton.click();

    expect(component.deleteParameter.call).toBeTruthy();
  });

});
