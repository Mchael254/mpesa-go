import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

import { NewLeadComponent } from './new-lead.component';
import { CountryService } from '../../../../../shared/services/setups/country/country.service';
import { LeadsService } from '../../../../../features/crm/services/leads.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { SystemsService } from '../../../../../shared/services/setups/systems/systems.service';
import { EntityService } from '../../../services/entity/entity.service';
import { ProductsService } from '../../../../../features/gis/components/setups/services/products/products.service';
import { ClientService } from '../../../services/client/client.service';
import { AccountService } from '../../../services/account/account.service';
import { SetupsParametersService } from '../../../../../shared/services/setups-parameters.service';
import { SectorService } from '../../../../../shared/services/setups/sector/sector.service';
import { OccupationService } from '../../../../../shared/services/setups/occupation/occupation.service';
import { CurrencyService } from '../../../../../shared/services/setups/currency/currency.service';
import { OrganizationService } from '../../../../../features/crm/services/organization.service';
import { CampaignsService } from '../../../../../features/crm/services/campaigns..service';
import { ActivityService } from '../../../../../features/crm/services/activity.service';
import { StaffService } from '../../../services/staff/staff.service';
import { IntermediaryService } from '../../../services/intermediary/intermediary.service';
import { UtilService } from '../../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { ProductService } from '../../../../../features/lms/service/product/product.service';
import { MandatoryFieldsDTO } from '../../../../../shared/data/common/mandatory-fields-dto';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { CurrencyDTO } from 'src/app/shared/data/common/currency-dto';
import {
  OrganizationDTO,
  OrganizationDivisionDTO,
} from 'src/app/features/crm/data/organization-dto';
import { SectorDTO } from 'src/app/shared/data/common/sector-dto';
import { OccupationDTO } from 'src/app/shared/data/common/occupation-dto';
import { EntityDto } from '../../../data/entityDto';

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'description',
    screenName: '',
    groupId: '',
    module: '',
  },
];

const mockCountryData: CountryDto[] = [
  {
    adminRegMandatory: '',
    adminRegType: '',
    currSerial: 0,
    currency: {
      createdBy: '',
      createdDate: '',
      decimalWord: '',
      id: 0,
      modifiedBy: '',
      modifiedDate: '',
      name: '',
      numberWord: '',
      roundingOff: 0,
      symbol: '',
    },
    drugTraffickingStatus: '',
    drugWefDate: '',
    drugWetDate: '',
    highRiskWefDate: '',
    highRiskWetDate: '',
    id: 0,
    isShengen: '',
    mobilePrefix: 0,
    name: '',
    nationality: '',
    risklevel: '',
    short_description: '',
    telephoneMaximumLength: 0,
    telephoneMinimumLength: 0,
    unSanctionWefDate: '',
    unSanctionWetDate: '',
    unSanctioned: '',
    zipCode: 0,
    subAdministrativeUnit: '',
    zipCodeString: '',
  },
];

const mockCurrencyData: CurrencyDTO[] = [
  {
    decimalWord: '',
    id: 0,
    name: '',
    numberWord: '',
    roundingOff: 0,
    symbol: '',
  },
];

const mockOrganizationData: OrganizationDTO[] = [
  {
    address: {
      box_number: '',
      country_id: 0,
      estate: '',
      fax: '',
      house_number: '',
      id: 0,
      is_utility_address: '',
      phone_number: '',
      physical_address: '',
      postal_code: '',
      residential_address: '',
      road: '',
      state_id: 0,
      town_id: 0,
      utility_address_proof: '',
      zip: '',
    },
    country: undefined,
    currency_id: 0,
    emailAddress: '',
    faxNumber: '',
    groupId: 0,
    id: 0,
    license_number: '',
    manager: 0,
    motto: '',
    name: '',
    organizationGroupLogo: '',
    organizationLogo: '',
    organization_type: '',
    paybill: 0,
    physicalAddress: '',
    pin_number: '',
    postalAddress: 0,
    postalCode: '',
    primaryTelephoneNo: '',
    primarymobileNumber: '',
    registrationNo: '',
    secondaryMobileNumber: '',
    secondaryTelephoneNo: '',
    short_description: '',
    state: {
      country: undefined,
      id: 0,
      name: '',
      shortDescription: '',
    },
    town: {
      country: '',
      id: 0,
      name: '',
      shortDescription: '',
      state: '',
    },
    vatNumber: '',
    webAddress: '',
    bankBranchId: 0,
    bankId: 0,
    swiftCode: '',
    bank_account_name: '',
    bank_account_number: '',
    customer_care_email: '',
    customer_care_name: '',
    customer_care_primary_phone_number: 0,
    customer_care_secondary_phone_number: 0,
  },
];

const mockDivisionData: OrganizationDivisionDTO[] = [
  {
    id: 1,
    is_default_division: 'YES',
    name: 'Test Division',
    order: 0,
    organization_id: mockOrganizationData[0].id,
    short_description: '',
    status: '',
  },
];

const mockSectorsData: SectorDTO[] = [
  {
    id: 1,
    shortDescription: 'TS',
    name: 'Test Sector',
    sectorWefDate: '',
    sectorWetDate: '',
    organizationId: 2,
    assignedOccupations: [
      {
        occupationId: 0,
        occupationName: '',
        sectorId: 0,
        sectorName: '',
        wefDate: '',
        wetDate: '',
      },
    ],
  },
];

const mockOcuppationsData: OccupationDTO[] = [
  {
    id: 1,
    shortDescription: 'TO',
    name: 'Test Occupation',
    wefDate: '',
    wetDate: '',
    organizationId: 2,
    assignedSectors: [
      {
        occupationId: 0,
        occupationName: '',
        sectorId: 0,
        sectorName: '',
        wefDate: '',
        wetDate: '',
      },
    ],
  },
];

const mockEntityDetails: EntityDto = {
  categoryName: '',
  countryId: 0,
  dateOfBirth: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  id: 0,
  modeOfIdentity: undefined,
  identityNumber: 0,
  name: '',
  organizationId: 0,
  pinNumber: '',
  profilePicture: '',
  profileImage: '',
};

export class MockEntityService {
  getEntityById = jest.fn().mockReturnValue(of(mockEntityDetails));
}

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountryData));
}

export class MockClientService {
  getClientType = jest.fn().mockReturnValue(of());
}

export class MockAccountService {
  getClientTitles = jest.fn().mockReturnValue(of());
  getIdentityMode = jest.fn().mockReturnValue(of());
}

export class MockSetupsParametersService {
  getParameters = jest.fn().mockReturnValue(of());
}

export class MockLeadsService {
  createLead = jest.fn().mockReturnValue(of());
  getLeadSources = jest.fn().mockReturnValue(of());
  getLeadStatuses = jest.fn().mockReturnValue(of());
}

export class MockSystemsService {
  getSystems = jest.fn().mockReturnValue(of());
}

export class MockSectorService {
  getSectors = jest.fn().mockReturnValue(of(mockSectorsData));
}

export class MockOccupationService {
  getOccupations = jest.fn().mockReturnValue(of(mockOcuppationsData));
}

export class MockCurrencyService {
  getCurrencies = jest.fn().mockReturnValue(of(mockCurrencyData));
}
export class MockOrganizationService {
  getOrganization = jest.fn().mockReturnValue(of(mockOrganizationData));
  getOrganizationDivision = jest.fn().mockReturnValue(of(mockDivisionData));
}

export class MockCampaignsService {
  getCampaigns = jest.fn().mockReturnValue(of());
}

export class MockActivityService {
  getActivities = jest.fn().mockReturnValue(of());
}

export class MockStaffService {
  getStaff = jest.fn().mockReturnValue(of());
}

export class MockIntermediaryService {
  getAgents = jest.fn().mockReturnValue(of());
}

export class MockUtilService {}

export class MockMandatoryFieldsService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockProductsService {
  getAllProducts = jest.fn().mockReturnValue(of());
}

export class MockProductService {
  getListOfProduct = jest.fn().mockReturnValue(of());
}

describe('NewLeadComponent', () => {
  let component: NewLeadComponent;
  let fixture: ComponentFixture<NewLeadComponent>;
  let countryServiceStub: CountryService;
  let leadsServiceStub: LeadsService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let entityServiceStub: EntityService;
  let systemsServiceStub: SystemsService;
  let gisProductsServiceStub: ProductsService;
  let clientServiceStub: ClientService;
  let accountServiceStub: AccountService;
  let setupsParamServiceStub: SetupsParametersService;
  let sectorServiceStub: SectorService;
  let occupationServiceStub: OccupationService;
  let currencyServiceStub: CurrencyService;
  let organizationServiceStub: OrganizationService;
  let campaignsServiceStub: CampaignsService;
  let activityServiceStub: ActivityService;
  let staffServiceStub: StaffService;
  let intermediaryServiceStub: IntermediaryService;
  let utilServiceStub: UtilService;
  let mandatoryFieldServiceStub: MandatoryFieldsService;
  let lmsProductServiceStub: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewLeadComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: ClientService, useClass: MockClientService },
        { provide: AccountService, useClass: MockAccountService },
        {
          provide: SetupsParametersService,
          useClass: MockSetupsParametersService,
        },
        { provide: LeadsService, useClass: MockLeadsService },
        { provide: SystemsService, useClass: MockSystemsService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: OccupationService, useClass: MockOccupationService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: CampaignsService, useClass: MockCampaignsService },
        { provide: ActivityService, useClass: MockActivityService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        { provide: UtilService, useClass: MockUtilService },
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryFieldsService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
        { provide: ProductsService, useClass: MockProductsService },
        { provide: ProductService, useClass: MockProductService },
        { provide: DatePipe },
        ChangeDetectorRef,
      ],
    });
    fixture = TestBed.createComponent(NewLeadComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    leadsServiceStub = TestBed.inject(LeadsService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    entityServiceStub = TestBed.inject(EntityService);
    systemsServiceStub = TestBed.inject(SystemsService);
    gisProductsServiceStub = TestBed.inject(ProductsService);
    lmsProductServiceStub = TestBed.inject(ProductService);
    clientServiceStub = TestBed.inject(ClientService);
    accountServiceStub = TestBed.inject(AccountService);
    setupsParamServiceStub = TestBed.inject(SetupsParametersService);
    sectorServiceStub = TestBed.inject(SectorService);
    occupationServiceStub = TestBed.inject(OccupationService);
    currencyServiceStub = TestBed.inject(CurrencyService);
    organizationServiceStub = TestBed.inject(OrganizationService);
    campaignsServiceStub = TestBed.inject(CampaignsService);
    activityServiceStub = TestBed.inject(ActivityService);
    staffServiceStub = TestBed.inject(StaffService);
    intermediaryServiceStub = TestBed.inject(IntermediaryService);
    utilServiceStub = TestBed.inject(UtilService);
    mandatoryFieldServiceStub = TestBed.inject(MandatoryFieldsService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch countries on fetchCountries', () => {
    component.fetchCountries();
    expect(countryServiceStub.getCountries).toHaveBeenCalled();
    expect(component.countryData).toEqual(mockCountryData);
  });

  test('should handle error when fetching countries', () => {
    const errorMessage = 'Failed to fetch countries';
    jest
      .spyOn(countryServiceStub, 'getCountries')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    component.fetchCountries();

    expect(component.errorOccurred).toBeTruthy();
    expect(component.errorMessage).toBe(errorMessage);
    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      errorMessage
    );
  });

  test('should toggle card', () => {
    component.isCardOpen = [false, false];
    component.toggleCard(0);
    expect(component.isCardOpen[0]).toBeTruthy();
    component.toggleCard(0);
    expect(component.isCardOpen[0]).toBeFalsy();
  });

  test('should call fetchLmsProducts on system change to 27', () => {
    const fetchLmsProductsSpy = jest.spyOn(component, 'fetchLmsProducts');
    component.onSystemChange(27);
    expect(fetchLmsProductsSpy).toHaveBeenCalled();
  });

  test('should call fetchGisProducts on system change to 37', () => {
    const fetchGisProductsSpy = jest.spyOn(component, 'fetchGisProducts');
    component.onSystemChange(37);
    expect(fetchGisProductsSpy).toHaveBeenCalled();
  });
});
