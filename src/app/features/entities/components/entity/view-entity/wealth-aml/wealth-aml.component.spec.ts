import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthAmlComponent } from './wealth-aml.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('WealthAmlComponent', () => {
  let component: WealthAmlComponent;
  let fixture: ComponentFixture<WealthAmlComponent>;

  let mockMessagingService = {
    displaySuccessMessage: jest.fn(),
    displayErrorMessage: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WealthAmlComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: GlobalMessagingService, useValue: mockMessagingService },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(WealthAmlComponent);
    component = fixture.componentInstance;

    component.formFieldsConfig = {
      fields: [],
    }


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
