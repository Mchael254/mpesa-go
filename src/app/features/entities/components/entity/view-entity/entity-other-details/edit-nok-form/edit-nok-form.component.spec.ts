import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNokFormComponent } from './edit-nok-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {EntityService} from "../../../../../services/entity/entity.service";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

const extras = {
  partyId: 417,
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('EditNokFormComponent', () => {
  let component: EditNokFormComponent;
  let fixture: ComponentFixture<EditNokFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditNokFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        // { provide: BankService, useValue: bankServiceStub },
        // { provide: EntityService, useValue: entityServiceStub },
        // { provide: CountryService, useValue: countryServiceStub },
      ]
    });
    fixture = TestBed.createComponent(EditNokFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
