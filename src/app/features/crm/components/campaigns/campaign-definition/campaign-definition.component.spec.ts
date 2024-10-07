import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDefinitionComponent } from './campaign-definition.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../../../../shared/shared.module";
import {NgxSpinnerService} from "ngx-spinner";
import {ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {ActivityService} from "../../../services/activity.service";
import {CurrencyService} from "../../../../../shared/services/setups/currency/currency.service";
import {OrganizationService} from "../../../services/organization.service";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {LeadsService} from "../../../services/leads.service";
import {ClientService} from "../../../../entities/services/client/client.service";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {CampaignsService} from "../../../services/campaigns..service";
import {ProductService} from "../../../../lms/service/product/product.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {ProductsService} from "../../../../gis/components/setups/services/products/products.service";
import {
  MockCampaignService, MockCurrencyService,
  MockGlobalMessageService,
  MockOrganizationService, MockStaffService,
  MockSystemsService
} from "../campaigns.component.spec";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {MandatoryFieldsDTO} from "../../../../../shared/data/common/mandatory-fields-dto";

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

const mandatoryField: MandatoryFieldsDTO = {
  "id": 1,
  "fieldName": "username",
  "fieldLabel": "Username",
  "mandatoryStatus": "required",
  "visibleStatus": "Y",
  "disabledStatus": "enabled",
  "frontedId": "field-username",
  "screenName": "loginScreen",
  "groupId": "authGroup",
  "module": "authentication"
}

describe('CampaignDefinitionComponent', () => {
  let component: CampaignDefinitionComponent;
  let fixture: ComponentFixture<CampaignDefinitionComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let gisProductServiceStub: ProductsService
  let lmsProductServiceStub: ProductService;
  let campaignsServiceStub: CampaignsService;
  let staffServiceStub: StaffService;
  let clientServiceStub: ClientService;
  let leadServiceStub: LeadsService;
  let systemsServiceStub: SystemsService;
  let organizationServiceStub: OrganizationService;
  let currencyServiceStub: CurrencyService;
  let activityServiceStub: ActivityService;
  let mockSpinnerServiceStub: NgxSpinnerService;
  let mockCdr: ChangeDetectorRef;

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', ['getMandatoryFieldsByGroupId'])

  beforeEach(() => {
    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));
    TestBed.configureTestingModule({
      declarations: [CampaignDefinitionComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: CampaignsService, useClass: MockCampaignService },
        { provide: SystemsService, useClass: MockSystemsService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: NgxSpinnerService },
        { provide: ChangeDetectorRef },
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub },
        { provide: ProductsService, useValue: gisProductServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CampaignDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    gisProductServiceStub = TestBed.inject(ProductsService)
    lmsProductServiceStub = TestBed.inject(ProductService);
    campaignsServiceStub = TestBed.inject(CampaignsService);
    staffServiceStub = TestBed.inject(StaffService);
    clientServiceStub = TestBed.inject(ClientService);
    leadServiceStub = TestBed.inject(LeadsService);
    systemsServiceStub = TestBed.inject(SystemsService);
    organizationServiceStub = TestBed.inject(OrganizationService);
    currencyServiceStub = TestBed.inject(CurrencyService);
    activityServiceStub = TestBed.inject(ActivityService);
    mockSpinnerServiceStub = TestBed.inject(NgxSpinnerService);
    mockCdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
