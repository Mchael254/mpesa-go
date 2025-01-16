import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { EditContactAddressFormComponent } from './edit-contact-address-form.component';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import { ProspectService } from '../../../../../../../features/entities/services/prospect/prospect.service';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import {
  CountryDto,
  TownDto,
} from '../../../../../../../shared/data/common/countryDto';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const mockCountries: CountryDto[] = [
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
    subAdministrativeUnit: '',
    telephoneMaximumLength: 0,
    telephoneMinimumLength: 0,
    unSanctionWefDate: '',
    unSanctionWetDate: '',
    unSanctioned: '',
    zipCode: 0,
    zipCodeString: '',
  },
];

const mockTowns: TownDto[] = [
  {
    id: 0,
    country: undefined,
    shortDescription: '',
    name: '',
    state: undefined,
  },
];

const mockProspect = {
  mobileNumber: { internationalNumber: '+254723145321' },
  emailAddress: 'test@example.com',
  telNumber: { internationalNumber: '+254721145321' },
  country: 1,
  town: 1,
  postalAddress: '123 Street',
  postalCode: '00100',
  physicalAddress: '123 Physical Street',
};

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountries));
  getTownsByCountry = jest.fn().mockReturnValue(of(mockTowns));
}

export class MockProspectService {
  updateProspect = jest.fn().mockReturnValue(of({}));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('EditContactAddressFormComponent', () => {
  let component: EditContactAddressFormComponent;
  let fixture: ComponentFixture<EditContactAddressFormComponent>;
  let countryServiceStub: CountryService;
  let prospectServiceStub: ProspectService;
  let messagingServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditContactAddressFormComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgxIntlTelInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: ProspectService, useClass: MockProspectService },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(EditContactAddressFormComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    prospectServiceStub = TestBed.inject(ProspectService);
    messagingServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch countries on init', () => {
    jest.spyOn(countryServiceStub, 'getCountries');
    component.ngOnInit();
    expect(countryServiceStub.getCountries).toHaveBeenCalled();
    expect(component.countryData).toEqual(mockCountries);
  });

  test('should fetch towns on country change', () => {
    jest.spyOn(countryServiceStub, 'getTownsByCountry');
    component.selectedCountry = 1;
    component.onCountryChange();
    expect(countryServiceStub.getTownsByCountry).toHaveBeenCalledWith(1);
    expect(component.townData).toEqual(mockTowns);
  });

  test('should submit valid form and call updateProspect', () => {
    component.extras = { partyAccountId: 122, prospectId: 123 };
    component.prospectContactAddressForm.setValue(mockProspect);

    component.updateDetails();

    expect(prospectServiceStub.updateProspect).toHaveBeenCalledWith(
      {
        mobileNumber: mockProspect.mobileNumber.internationalNumber,
        emailAddress: mockProspect.emailAddress,
        telNumber: mockProspect.telNumber.internationalNumber,
        country: mockProspect.country,
        town: mockProspect.town,
        postalAddress: mockProspect.postalAddress,
        postalCode: mockProspect.postalCode,
        physicalAddress: mockProspect.physicalAddress,
      },
      123
    );

    expect(messagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated Prospect Details'
    );
  });
});
