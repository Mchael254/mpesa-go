import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityOtherDetailsComponent } from './entity-other-details.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {ViewEntityComponent} from "../view-entity.component";

describe('EntityOtherDetailsComponent', () => {
  let component: EntityOtherDetailsComponent;
  let fixture: ComponentFixture<EntityOtherDetailsComponent>;

  beforeEach(() => {

    const country: CountryDto = {
      adminRegMandatory: "",
      adminRegType: "",
      currSerial: 0,
      currency: {
        createdBy: "",
        createdDate: "",
        decimalWord: "",
        id: 0,
        modifiedBy: "",
        modifiedDate: "",
        name: "",
        numberWord: "",
        roundingOff: 0,
        symbol: ""
      },
      drugTraffickingStatus: "",
      drugWefDate: "",
      drugWetDate: "",
      highRiskWefDate: "",
      highRiskWetDate: "",
      id: 0,
      isShengen: "",
      mobilePrefix: 0,
      name: "",
      nationality: "",
      risklevel: "",
      short_description: "",
      subAdministrativeUnit: "",
      telephoneMaximumLength: 0,
      telephoneMinimumLength: 0,
      unSanctionWefDate: "",
      unSanctionWetDate: "",
      unSanctioned: "",
      zipCode: 0,
      zipCodeString: ""
    }

    TestBed.configureTestingModule({
      declarations: [EntityOtherDetailsComponent, ViewEntityComponent],
      imports: [],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(EntityOtherDetailsComponent);
    component = fixture.componentInstance;
    component.countries = [country];
    component.nokList = [];
    component.bankDetails = {};
    component.wealthAmlDetails = {};
    component.partyAccountDetails = { nextOfKinDetailsList: [] }
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should get payment details', () => {
    const emitSpy = jest.spyOn(component.fetchPaymentDetails, 'emit');
    const button = fixture.nativeElement.querySelector('#get-payment-details');
    button.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalled();
  });

  test('should get wealthAml details', () => {
    const emitSpy = jest.spyOn(component.fetchWealthAmlDetails, 'emit');
    const button = fixture.nativeElement.querySelector('#get-wealth-aml-details');
    button.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalled();
  });


});
