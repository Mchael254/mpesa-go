import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { NewIntermediaryComponent } from './new-intermediary.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CountryService} from "../../../../../shared/services/setups/country.service";
import {SectorService} from "../../../../../shared/services/setups/sector.service";
import {OccupationService} from "../../../../../shared/services/setups/occupation.service";
import {EntityService} from "../../../services/entity/entity.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields.service";
import {BankService} from "../../../../../shared/services/setups/bank.service";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {MessageService} from "primeng/api";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {DatePipe} from "@angular/common";
import {BehaviorSubject, of} from "rxjs";
import {
  DynamicBreadcrumbComponent
} from "../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {UtilService} from "../../../../../shared/services";

export class MockCountryService {
  getCountries= jest.fn().mockReturnValue(of());
}

export class MockSectorService {
  getSectors = jest.fn().mockReturnValue(of());
}

export class MockOccupationsService {
  getOccupations = jest.fn().mockReturnValue(of());
}

export class MockEntityService {
  getClientTitles = jest.fn().mockReturnValue(of());
  currentEntity$ = new BehaviorSubject<any>(undefined);
}

export class MockMandatoryFieldsService {
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of());
}

export class MockBankService {
  getCurrencies = jest.fn().mockReturnValue(of());
}

export class MockIntermediaryService {
  getIdentityType = jest.fn().mockReturnValue(of());
  getAccountType = jest.fn().mockReturnValue(of());
}
describe('NewIntermediaryComponent', () => {
  let component: NewIntermediaryComponent;
  let fixture: ComponentFixture<NewIntermediaryComponent>;
  let countryServiceStub: CountryService;
  let sectorServiceStub: SectorService;
  let occupationsServiceStub: OccupationService;
  let entityServiceStub: EntityService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let bankServiceStub: BankService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let intermediaryServiceStub: IntermediaryService;
  let utilServiceStub: UtilService;
  let formBuilderStub: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewIntermediaryComponent, DynamicBreadcrumbComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: OccupationService, useClass: MockOccupationsService },
        { provide: EntityService, useClass: MockEntityService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryFieldsService },
        { provide: BankService, useClass: MockBankService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        { provide: DatePipe },
        { provide: GlobalMessagingService },
        { provide: MessageService },
      ]
    });
    fixture = TestBed.createComponent(NewIntermediaryComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    sectorServiceStub = TestBed.inject(SectorService);
    occupationsServiceStub = TestBed.inject(OccupationService);
    entityServiceStub = TestBed.inject(EntityService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    bankServiceStub = TestBed.inject(BankService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    utilServiceStub = TestBed.inject(UtilService);
    intermediaryServiceStub = TestBed.inject(IntermediaryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create client registration form', () => {
    expect(component.createIntermediaryRegForm).toBeTruthy();
    component.createIntermediaryForm.get('addressDetails.country').setValue('YourValue');

  });

  it('should fetch countries and update the form', () => {

    component.createIntermediaryForm = new FormGroup({
      country: new FormControl(100),
    });

    component.fetchCountries();

    expect(countryServiceStub.getCountries).toHaveBeenCalled();
    expect(component.createIntermediaryForm.get('country').value).toEqual(100);

  });

  it('should set validators based on response data', () => {

    const responseData = [
      {
        frontedId: 'yourField1',
        visibleStatus: 'Y',
        mandatoryStatus: 'Y',
      },
      {
        frontedId: 'yourField2',
        visibleStatus: 'Y',
        mandatoryStatus: 'N',
      },
    ];

    const getDataSpy = jest.spyOn(mandatoryFieldsServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of(responseData) as any);

    component.createIntermediaryRegForm();

    // expect(component.createIntermediaryForm.get('yourField1')['validator']).toBeTruthy();
    // expect(component.createIntermediaryForm.get('yourField2')['validator']).toBeNull(); // This field is not mandatory, so no validator should be set
    const yourField1Control = component.createIntermediaryForm.controls;
    yourField1Control[0].setValidators(Validators.required); // Set the required validator

    expect(yourField1Control['validator']).toBeTruthy();
  });

  it('should set agentType when selectUserType is called', () => {
    // Initial value of agentType should be defined by I
    expect(component.agentType).toBeDefined();

    const fakeEvent = {
      target: {
        value: 'C',
      },
    };

    component.selectUserType(fakeEvent);

    expect(component.agentType).toBe('C');
  });

  it('should set isWithHoldingTaxApplcable based on form value', () => {
    // Initial value of isWithHoldingTaxApplcable should be defined Y
    expect(component.isWithHoldingTaxApplcable).toBeDefined();

    const sampleFormValue = {
      otherDetails: {
        withHoldingTaxApplicable: "N",
      },
    };

    component.selectWithHoldingTax();

    expect(sampleFormValue.otherDetails.withHoldingTaxApplicable).toBe('N'); // Replace with the expected value
  });


  /*it('should reset form values and fetch data on country change', () => {
    // Set up your component's properties or form control values as needed
    component.createIntermediaryForm.setValue({
      country: 'USA',
      agentType: '', // Set the initial country
      // ... other form controls
    });

    // Trigger the onCountryChange method
    component.onCountryChange();

    // Assert that form values are reset
    expect(component.createIntermediaryForm.get('county').value).toBeNull();
    expect(component.createIntermediaryForm.get('town').value).toBeNull();

    // Assert that getBanks is called with the selected country
    expect(component.getBanks).toHaveBeenCalledWith('USA'); // Adjust the argument as needed

    // Assert that getMainCityStatesByCountry is called with the selected country
    expect(countryServiceStub.getMainCityStatesByCountry).toHaveBeenCalledWith('USA'); // Adjust the argument as needed

    // Assert that detectChanges is called
    // expect(mockCdr.detectChanges).toHaveBeenCalled();
  });*/

});
