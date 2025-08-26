import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthAmlComponent } from './wealth-aml.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {OccupationService} from "../../../../../../shared/services/setups/occupation/occupation.service";
import {SectorService} from "../../../../../../shared/services/setups/sector/sector.service";
import {AccountService} from "../../../../services/account/account.service";
import {of} from "rxjs";
import {UtilService} from "../../../../../../shared/services";
import {ClientService} from "../../../../services/client/client.service";

const wealthAmlRecord =  {
  id: 3741,
  nationalityCountryId: null,
  citizenshipCountryId: null,
  fundsSource: "SALARY",
  employmentStatus: "NOT_EMPLOYED",
  maritalStatus: null,
  occupationId: 101,
  occupation: null,
  sectorId: 10,
  sector: null,
  tradingName: null,
  registeredName: null,
  certificateRegistrationNumber: null,
  certificateYearOfRegistration: null,
  sourceOfWealthId: 2,
  parentCountryId: null,
  operatingCountryId: null,
  crFormRequired: null,
  crFormYear: null,
  partyAccountId: 4206,
  insurancePurpose: "22",
  premiumFrequency: "AD_HOC",
  distributeChannel: "SMS",
  parentCompany: null,
  category: null,
  modeOfIdentity: null,
  idNumber: null,
  cr12Details: [],
  createdBy: null,
  createdDate: null,
  modifiedBy: null,
  modifiedDate: null,
  operatingCountry: null,
  nationalityCountry: null,
  citizenshipCountry: null,
  parentCountry: null
};

const wealthAmlField = {
  sectionId: "wealth_aml",
  fieldId: "fundsSource",
  type: "select",
  label: {
    en: "fund source",
    ke: "Aina ya Mteja",
    fr: "Type de Client"
  },
  dynamicLabel: null,
  defaultValue: null,
  visible: true,
  disabled: false,
  validations: [],
  conditions: [],
  order: 4,
  tooltip: {
    en: "",
    fr: "",
    ke: ""
  },
  placeholder: {
    en: "",
    fr: "",
    ke: ""
  },
  isMandatory: true,
  options: []
};

describe('WealthAmlComponent', () => {
  let component: WealthAmlComponent;
  let fixture: ComponentFixture<WealthAmlComponent>;

  let mockMessagingService = {
    displaySuccessMessage: jest.fn(),
    displayErrorMessage: jest.fn()
  };

  const mockBankService = {
    getFundSource: jest.fn(),
  }

  const mockOccupationService = {
    getOccupations: jest.fn(),
  }

  const mockSectorService = {
    getSectors: jest.fn(),
  }

  const mockClientService = {
    deleteAmlRecord: jest.fn(),
    updateClientSection: jest.fn(),
  }

  const mockAccountService = {
    getCommunicationChannels: jest.fn(),
    getPremiumFrequencies: jest.fn(),
    getEmploymentTypes: jest.fn(),
    getInsurancePurpose: jest.fn(),
  }

  const mockUtilService = {
    currentLanguage: of('en')
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WealthAmlComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: GlobalMessagingService, useValue: mockMessagingService },
        { provide: BankService, useValue: mockBankService },
        { provide: OccupationService, useValue: mockOccupationService },
        { provide: SectorService, useValue: mockSectorService },
        { provide: AccountService, useValue: mockAccountService },
        { provide: ClientService, useValue: mockClientService },
        { provide: UtilService, useValue: mockUtilService },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(WealthAmlComponent);
    component = fixture.componentInstance;

    const sectorField = { ...wealthAmlField, fieldId: 'sector' };
    const occupationField = { ...wealthAmlField, fieldId: 'occupation' };
    const distributeChannelField = { ...wealthAmlField, fieldId: 'distributeChannel' };
    const employmentField = { ...wealthAmlField, fieldId: 'employmentStatus' };
    const insurancePurposeField = { ...wealthAmlField, fieldId: 'insurancePurpose' };
    const premiumFreqField = { ...wealthAmlField, fieldId: 'premiumFrequency' };

    component.formFieldsConfig = {
      fields: [
        wealthAmlField,
        sectorField,
        occupationField,
        distributeChannelField,
        employmentField,
        insurancePurposeField,
        premiumFreqField,
      ],
      label: {
        en: '',
        fr: '',
        ke: ''
      }
    }

    component.wealthAmlDetails = [wealthAmlRecord]

    jest.spyOn(mockBankService, 'getFundSource').mockReturnValue(of([]));
    jest.spyOn(mockOccupationService, 'getOccupations').mockReturnValue(of([]));
    jest.spyOn(mockSectorService, 'getSectors').mockReturnValue(of([]));
    jest.spyOn(mockAccountService, 'getCommunicationChannels').mockReturnValue(of([]));
    jest.spyOn(mockAccountService, 'getPremiumFrequencies').mockReturnValue(of([]));
    jest.spyOn(mockAccountService, 'getEmploymentTypes').mockReturnValue(of([]));
    jest.spyOn(mockAccountService, 'getInsurancePurpose').mockReturnValue(of([]));
    jest.spyOn(mockClientService, 'deleteAmlRecord').mockReturnValue(of({}));
    jest.spyOn(mockClientService, 'updateClientSection').mockReturnValue(of({ wealthAmlDetails: wealthAmlRecord }));

    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should open editWealthAmlDialog', () => {
    component.openEditWealthAmlDialog(true, wealthAmlRecord);
    expect(component.shouldShowEditForm).toBe(true);
    expect(component.selectedWealthAmlRecord).toBe(wealthAmlRecord);
  });

  test('should patch form values', () => {
    component.patchFormValues(wealthAmlRecord);
    // todo: write assertions
  });

  test('should edit wealthAmlDetails', () => {
    component.selectedWealthAmlRecord = wealthAmlRecord;
    component.editForm = new FormBuilder().group({
      fundsSource: ['BUSINESS'],
      employmentStatus: ['NOT_EMPLOYED'],
      occupation: ['ADMINISTRATOR'],
      sector: ['AVIATION'],
      insurancePurpose: ['22'],
      premiumFrequency: ['ANNUAL'],
      distributeChannel: ['EMAIL']
    });

    jest.spyOn(component, 'prepareUpdatePayload');

    component.editWealthAmlDetails();

    expect(component.shouldShowEditForm).toBe(true);
    expect(component.editForm.value).toBeTruthy();
    expect(component.prepareUpdatePayload).toHaveBeenCalled();
    expect(mockClientService.updateClientSection).toHaveBeenCalled();
  });

  test('should add new wealthAmlDetails', () => {
    component.selectedWealthAmlRecord = null;

    component.editForm = new FormBuilder().group({
      fundsSource: ['BUSINESS'],
      employmentStatus: ['NOT_EMPLOYED'],
      occupation: ['ADMINISTRATOR'],
      sector: ['AVIATION'],
      insurancePurpose: ['22'],
      premiumFrequency: ['ANNUAL'],
      distributeChannel: ['EMAIL']
    });

    jest.spyOn(component, 'prepareAddPayload');

    component.editWealthAmlDetails();

    expect(component.shouldShowEditForm).toBe(true);
    expect(component.editForm.value).toBeTruthy();
    expect(component.prepareAddPayload).toHaveBeenCalled();
  });

  test('should delete wealthAml record', () => {
    component.selectedWealthAmlRecord = wealthAmlRecord;
    jest.spyOn(component, 'prepareTableDetails');

    component.deleteAmlRecord();

    expect(mockClientService.deleteAmlRecord).toHaveBeenCalled();
    expect(mockMessagingService.displaySuccessMessage).toHaveBeenCalled();
    expect(component.prepareTableDetails).toHaveBeenCalled();
  });

});
