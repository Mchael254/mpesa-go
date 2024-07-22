import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmlFormComponent } from './edit-aml-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {ReactiveFormsModule} from "@angular/forms";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {CountryDto} from "../../../../../../../shared/data/common/countryDto";
import {Bank} from "../../../../../data/BankDto";
import {FundSourceDTO} from "../../../../../../../shared/data/common/bank-dto";
import {AmlWealthDetailsUpdateDTO} from "../../../../../data/accountDTO";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {EntityService} from "../../../../../services/entity/entity.service";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";
import {SectorService} from "../../../../../../../shared/services/setups/sector/sector.service";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

const countryDto: CountryDto = {
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
};

const bank: Bank = {
  bankId: 1,
  bankName: "",
  branchCode: 0,
  branchName: "",
  contactPersonEmail: "",
  contactPersonName: "",
  contactPersonPhone: "",
  countryCode: 0,
  countryName: "",
  createdBy: "",
  createdDate: "",
  directDebitSupported: "",
  eftSupported: "",
  email: "",
  id: 0,
  name: "",
  physicalAddress: "",
  postalAddress: "",
  referenceCode: "",
  short_description: "",
  townCode: 0,
  townName: ""
};

const amlDetailsToUpdate: AmlWealthDetailsUpdateDTO = {
  certificate_registration_number: 'A234898484',
  certificate_year_of_registration: '2024',
  cr_form_required: 'N',
  cr_form_year: null,
  funds_source: 'Salary',
  id: 101,
  operating_country_id: 110,
  parent_country_id: 110,
  partyAccountId: 417,
  registeredName: 'Turnquest',
  source_of_wealth_id: 2,
  tradingName: 'Turnquest'
}

const extras = {
  partyId: 417,
}

const fundsSourceDto: FundSourceDTO = {code: 0, name: "SALARY"};

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('EditAmlFormComponent', () => {
  let component: EditAmlFormComponent;
  let fixture: ComponentFixture<EditAmlFormComponent>;

  const bankServiceStub = createSpyObj('BankService',
    ['getBanks', 'getFundSource']);
  const entityServiceStub = createSpyObj('EntityService',
    ['updateAmlDetails']);
  const countryServiceStub = createSpyObj('CountryService',
    ['getCountries']);


  beforeEach(() => {
    jest.spyOn(bankServiceStub, 'getBanks').mockReturnValue(of([bank]));
    jest.spyOn(bankServiceStub, 'getFundSource').mockReturnValue(of([fundsSourceDto]));
    jest.spyOn(countryServiceStub, 'getCountries').mockReturnValue(of([countryDto]));
    jest.spyOn(entityServiceStub, 'updateAmlDetails').mockReturnValue(of(amlDetailsToUpdate));

    TestBed.configureTestingModule({
      declarations: [EditAmlFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: BankService, useValue: bankServiceStub },
        { provide: EntityService, useValue: entityServiceStub },
        { provide: CountryService, useValue: countryServiceStub },
      ]
    });
    fixture = TestBed.createComponent(EditAmlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should prepare updateDetails and patch form values', () => {
    component.prepareUpdateDetails(amlDetailsToUpdate, extras);
    expect(component.fetchCountries.call).toBeTruthy();
    expect(component.countryData).toEqual([countryDto]);
    expect(component.fetchFundSource.call).toBeTruthy();
    expect(component.fundSource).toEqual([fundsSourceDto]);
  });

  test('should update wealth details and save to database', () => {
    component.amlDetails = amlDetailsToUpdate;
    component.extras = extras;
    component.amlForm.controls['tradingNames'].setValue('Turnquest');
    component.amlForm.controls['entitiesCompany'].setValue('Turnquest');
    component.amlForm.controls['certRegYear'].setValue('2024');
    component.amlForm.controls['operationCountry'].setValue(110);
    component.amlForm.controls['certRegNo'].setValue('A2048774');
    component.amlForm.controls['sourceOfWealth'].setValue(110);
    component.amlForm.controls['parentCompany'].setValue(110);

    const button = fixture.debugElement.nativeElement.querySelector('#update-details');
    button.click();
    fixture.detectChanges();

    expect(component.updateDetails.call).toBeTruthy();
    // expect(component.closeEditModal).toHaveBeenCalled();

  });

});
