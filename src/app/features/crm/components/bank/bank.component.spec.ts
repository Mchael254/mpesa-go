import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankComponent } from './bank.component';
import {BankService} from "../../../../shared/services/setups/bank/bank.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {CountryService} from "../../../../shared/services/setups/country/country.service";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";
import {BankDTO} from "../../../../shared/data/common/bank-dto";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {MandatoryFieldsDTO} from "../../../../shared/data/common/mandatory-fields-dto";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../core/config/app-config-service";
import {Logger} from "../../../../shared/services";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TableModule} from "primeng/table";

const mockBankData: BankDTO[] =[
  {
    administrativeCharge: 0,
    allowPesalink: "",
    bankAccountNoCharacters: 0,
    bankLogo: "",
    bankSortCode: "",
    bankType: "",
    countryId: 0,
    countryName: "",
    ddiCharge: 0,
    directDebitFormat: "",
    directDebitReportCode: 0,
    forwardingBankId: 0,
    forwardingBankName: "",
    hasParentBank: "",
    id: 0,
    isDirectDebitSupported: "",
    isEftSupported: "",
    isForwardingBank: "",
    isNegotiatedBank: "",
    maximumAccountNoCharacters: "",
    minimumAccountNoCharacters: "",
    name: "",
    parentBankId: 0,
    parentBankName: "",
    physicalAddress: "",
    remarks: "",
    short_description: "",
    status: "",
    withEffectiveFrom: "",
    withEffectiveTo: ""

  }];

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'country',
    screenName: '',
    groupId: '',
    module: '',
  },
];
export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of());
}

export class MockBankService {
  getBanks = jest.fn().mockReturnValue(of(mockBankData));
  createBank = jest.fn().mockReturnValue(of());
  updateBank = jest.fn().mockReturnValue(of());
  deleteBank = jest.fn().mockReturnValue(of());
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of(mockMandatoryData));
}

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

describe('BankComponent', () => {
  let component: BankComponent;
  let fixture: ComponentFixture<BankComponent>;
  let countryServiceStub: CountryService;
  let bankServiceStub: BankService;
  let messageServiceStub: GlobalMessagingService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let appConfigServiceStub: AppConfigService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BankComponent,
        ReusableInputComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: BankService, useClass: MockBankService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryService },
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(BankComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    bankServiceStub = TestBed.inject(BankService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch banks data', () => {
    jest.spyOn(bankServiceStub, 'getBanks');
    component.fetchBanks();
    expect(bankServiceStub.getBanks).toHaveBeenCalled();
    expect(component.bankData).toEqual(mockBankData);
  });

  test('should open bank Modal', () => {
    component.openBankModal();

    const modal = document.getElementById('bankModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close bank Modal', () => {
    const modal = document.getElementById('bankModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBankModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should select a bank on onBankRowSelect', () => {
    const selectedBank = mockBankData[0];
    component.onBankRowSelect(selectedBank);
    expect(component.selectedBank).toEqual(selectedBank);
  });

  test('should open the bank modal and set form values when a bank is selected', () => {
    const mockselectedBank = mockBankData[0];
    component.selectedBank = mockselectedBank;
    const spyOpenBankModal = jest.spyOn(component, 'openBankModal');
    const patchValueSpy = jest.spyOn(
      component.createBankForm,
      'patchValue'
    );

    component.editBank();

    expect(spyOpenBankModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      shortDescription: mockselectedBank.short_description,
      bankName: mockselectedBank.name,
      parentBank: mockselectedBank.hasParentBank,
      country: mockselectedBank.countryId,
      ddForwardingBank: mockselectedBank.forwardingBankId,
      eftSupport: mockselectedBank.isEftSupported,
      classify: mockselectedBank.bankType,
      accountNoCharacters: mockselectedBank.bankAccountNoCharacters,
      bankDDICharge: mockselectedBank.ddiCharge,
      adminCharge: mockselectedBank.administrativeCharge,
      pesaLink: mockselectedBank.allowPesalink,
      status: mockselectedBank.status,
      logo: mockselectedBank.bankLogo,
    });
  });

  test('should display an error message when no bank is selected during edit', () => {
    component.selectedBank = null;

    component.editBank();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No bank is selected!'
    );
  });

  test('should show the bank confirmation modal when deleteBank is called', () => {
    const spydeleteBank = jest.spyOn(component, 'deleteBank');
    component.deleteBank();

    expect(spydeleteBank).toHaveBeenCalled();
    expect(component.bankConfirmationModal.show).toBeTruthy;
  });

  test('should confirm bank deletion when a bank is selected', () => {
    component.selectedBank = mockBankData[0];
    const selectedBankId = mockBankData[0].id;

    const spydeleteBankConfirmation = jest.spyOn(
      bankServiceStub,
      'deleteBank'
    );

    const spydisplaySuccessMessage = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    const spydeleteBank = jest.spyOn(component, 'deleteBank');
    component.deleteBank();

    const button = fixture.debugElement.nativeElement.querySelector(
      '#bankConfirmationModal'
    );
    button.click();

    component.confirmBankDelete();

    expect(spydeleteBank).toHaveBeenCalled();
    expect(spydeleteBankConfirmation).toHaveBeenCalledWith(
      selectedBankId
    );
  });
});
