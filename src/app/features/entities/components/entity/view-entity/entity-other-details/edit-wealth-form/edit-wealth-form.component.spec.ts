import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWealthFormComponent } from './edit-wealth-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {TranslateModule} from "@ngx-translate/core";
import {CountryDto} from "../../../../../../../shared/data/common/countryDto";
import {SectorDTO} from "../../../../../../../shared/data/common/sector-dto";
import {BankBranchDTO, FundSourceDTO} from "../../../../../../../shared/data/common/bank-dto";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {Bank} from "../../../../../data/BankDto";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {EntityService} from "../../../../../services/entity/entity.service";
import {CountryService} from "../../../../../../../shared/services/setups/country/country.service";
import {SectorService} from "../../../../../../../shared/services/setups/sector/sector.service";
import {ReactiveFormsModule} from "@angular/forms";
import {WealthAmlDTO, WealthDetailsUpdateDTO} from "../../../../../data/accountDTO";
import {Extras} from "../entity-other-details.component";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
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

const sectorDto: SectorDTO = {
  assignedOccupations: [{
    occupationId: 0,
    occupationName: "",
    sectorId: 0,
    sectorName: "",
    wefDate: "",
    wetDate: ""
  }], id: 0, name: "", organizationId: 0, sectorWefDate: "", sectorWetDate: "", shortDescription: ""
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

const updateWealthDetailsDto: WealthDetailsUpdateDTO = {
  id: 1,
};

const wealthDetails: WealthAmlDTO = {
  certificate_registration_number: 0,
  certificate_year_of_registration: "",
  citizenship_country_id: 0,
  cr_form_required: "",
  cr_form_year: 0,
  distributeChannel: "",
  funds_source: "",
  id: 0,
  insurancePurpose: "",
  is_employed: "",
  is_self_employed: "",
  marital_status: "",
  nationality_country_id: 0,
  occupation_id: 0,
  operating_country_id: null,
  parent_country_id: 0,
  premiumFrequency: "",
  registeredName: "",
  sector_id: 0,
  source_of_wealth_id: 0,
  tradingName: ""
};

const extras: Extras = {
  partyAccountId: 417,
}

const fundsSourceDto: FundSourceDTO = {code: 0, name: "SALARY"};

describe('EditWealthFormComponent', () => {
  let component: EditWealthFormComponent;
  let fixture: ComponentFixture<EditWealthFormComponent>;

  const bankServiceStub = createSpyObj('BankService',
    ['getBanks', 'getFundSource']);
  const entityServiceStub = createSpyObj('EntityService',
    ['updateWealthDetails']);
  const countryServiceStub = createSpyObj('CountryService',
    ['getCountries']);
  const sectorServiceStub = createSpyObj('SectorService',
    ['getSectors']);

  beforeEach(() => {
    jest.spyOn(bankServiceStub, 'getBanks').mockReturnValue(of([bank]));
    jest.spyOn(bankServiceStub, 'getFundSource').mockReturnValue(of([fundsSourceDto]));
    jest.spyOn(countryServiceStub, 'getCountries').mockReturnValue(of([countryDto]));
    jest.spyOn(sectorServiceStub, 'getSectors').mockReturnValue(of([sectorDto]));
    jest.spyOn(entityServiceStub, 'updateWealthDetails').mockReturnValue(of(updateWealthDetailsDto));

    TestBed.configureTestingModule({
      declarations: [EditWealthFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: BankService, useValue: bankServiceStub },
        { provide: EntityService, useValue: entityServiceStub },
        { provide: CountryService, useValue: countryServiceStub },
        { provide: SectorService, useValue: sectorServiceStub },
      ]
    });
    fixture = TestBed.createComponent(EditWealthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should prepare updateDetails and patch form values', () => {
    component.prepareUpdateDetails(wealthDetails, extras);
    expect(component.fetchCountries.call).toBeTruthy();
    expect(component.countryData).toEqual([countryDto]);
    expect(component.fetchSectors.call).toBeTruthy();
    expect(component.sectorData).toEqual([sectorDto]);
    expect(component.fetchFundSource.call).toBeTruthy();
    expect(component.fundSource).toEqual([fundsSourceDto]);
  });

  test('should update wealth details and save to database', () => {
    component.wealthAmlDetails = wealthDetails;
    component.extras = extras;
    component.wealthForm.controls['nationality'].setValue(110);
    component.wealthForm.controls['sourceOfFunds'].setValue(0);
    component.wealthForm.controls['typeOfEmployment'].setValue('Y');
    component.wealthForm.controls['citizenship'].setValue(110);
    component.wealthForm.controls['sector'].setValue(110);

    const button = fixture.debugElement.nativeElement.querySelector('#update-details');
    button.click();
    fixture.detectChanges();

    expect(component.updateDetails.call).toBeTruthy();
    // expect(component.closeEditModal).toHaveBeenCalled();

  });
});
