import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankComponent } from './bank.component';
import {BankService} from "../../../../shared/services/setups/bank/bank.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {CountryService} from "../../../../shared/services/setups/country/country.service";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";
import {BankBranchDTO, BankChargeDTO, BankDTO} from "../../../../shared/data/common/bank-dto";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {MandatoryFieldsDTO} from "../../../../shared/data/common/mandatory-fields-dto";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../core/config/app-config-service";
import {Logger} from "../../../../shared/services";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TableModule} from "primeng/table";
import {OrganizationService} from "../../services/organization.service";
import {CountryDto, TownDto} from "../../../../shared/data/common/countryDto";

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

const mockBankBranchData: BankBranchDTO[] = [
  {
    bankId: 0,
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
  }];

const mockBankChargeData: BankChargeDTO[] = [{
  bankCode: 0,
  bankName: "",
  dateFrom: "",
  dateTo: "",
  id: 0,
  productCode: 0,
  productName: "",
  rate: 0,
  rateType: "",
  systemCode: 0,
  systemName: ""
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
  getTownsByCountry = jest.fn().mockReturnValue(of());
}

export class MockBankService {
  getBanks = jest.fn().mockReturnValue(of(mockBankData));
  createBank = jest.fn().mockReturnValue(of());
  updateBank = jest.fn().mockReturnValue(of());
  deleteBank = jest.fn().mockReturnValue(of());
  getBankBranchesByBankId = jest.fn().mockReturnValue(of(mockBankBranchData));
  deleteBankBranch = jest.fn().mockReturnValue(of());
  createBankBranch = jest.fn().mockReturnValue(of());
  updateBankBranch = jest.fn().mockReturnValue(of());
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

export class MockOrganizationService {
  getOrganizationBranch = jest.fn().mockReturnValue(of());
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
  let organizationServiceStub: OrganizationService;

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
        { provide: OrganizationService, useClass: MockOrganizationService },
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
    organizationServiceStub = TestBed.inject(OrganizationService);
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

  test('should fetch bank branches data', () => {
    jest.spyOn(bankServiceStub, 'getBankBranchesByBankId');
    jest.spyOn(bankServiceStub,'getBanks');
    const bankId = mockBankData[0].id;
    component.fetchBankBranches(bankId);
    expect(bankServiceStub.getBankBranchesByBankId).toHaveBeenCalled();
    expect(component.bankBranchData).toEqual(mockBankBranchData);
  });

  test('should fetch countries', () => {
    const mockCountryData = <CountryDto[]>{};

    const getCountriesSpy = jest.spyOn(countryServiceStub, 'getCountries').mockReturnValue(of(mockCountryData));

    component.fetchCountries();

    expect(getCountriesSpy).toHaveBeenCalled();

    // Since getCountries returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.countriesData).toEqual(mockCountryData);
    });
  });

  test('should fetch towns and log info message', () => {
    const mockTownData = <TownDto[]>{};

    const getTownsSpy = jest.spyOn(countryServiceStub, 'getTownsByCountry').mockReturnValue(of(mockTownData));

    component.fetchTowns(1);

    expect(getTownsSpy).toHaveBeenCalled();

    // Since getCountries returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.townData).toEqual(mockTownData);
    });
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

  test('should open bank branch Modal', () => {

    // Mocking selectedBank for the test
    component.selectedBank = <BankDTO>{};  // or set it to an appropriate value

    component.openBankBranchModal();

    const modal = document.getElementById('bankBranchModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
    /*expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No bank is selected!'
    );*/
  });

  test('should close bank branch Modal', () => {
    const modal = document.getElementById('bankBranchModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBankBranchModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should select a bank on onBankRowSelect', () => {
    const spyFetchBankBranches = jest.spyOn(component, 'fetchBankBranches')
    const selectedBank = mockBankData[0];
    component.onBankRowSelect(selectedBank);
    expect(component.selectedBank).toEqual(selectedBank);
    expect(spyFetchBankBranches).toHaveBeenCalledWith(selectedBank.id);
  });

  test('should select a bank on onBankBranchRowSelect', () => {
    const selectedBankBranch = mockBankBranchData[0];
    component.onBankBranchRowSelect(selectedBankBranch);
    expect(component.selectedBankBranch).toEqual(selectedBankBranch);
  });

  test('should select a bank on onBankChargeRowSelect', () => {
    const selectedBankCharge = mockBankChargeData[0];
    component.onBankChargeRowSelect(selectedBankCharge);
    expect(component.selectedBankCharge).toEqual(selectedBankCharge);
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

  test('should open the bank branch modal and set form values when a bank branch is selected', () => {
    const mockselectedBankBranch = mockBankBranchData[0];
    component.selectedBankBranch = mockselectedBankBranch;
    const spyOpenBankBranchModal = jest.spyOn(component, 'openBankBranchModal');
    const patchValueSpy = jest.spyOn(
      component.createBankBranchForm,
      'patchValue'
    );

    component.editBankBranch();

    expect(spyOpenBankBranchModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      branchName: mockselectedBankBranch.branchCode,
      bankBranchName: mockselectedBankBranch.name,
      bankEmail: mockselectedBankBranch.email,
      bankBranchShortDescription: mockselectedBankBranch.short_description,
      countryCode: mockselectedBankBranch.countryCode,
      town: mockselectedBankBranch.townCode,
      refCode: mockselectedBankBranch.referenceCode,
      eftSupport: mockselectedBankBranch.eftSupported,
      ddiSupport: mockselectedBankBranch.directDebitSupported,
      contactPersonName: mockselectedBankBranch.contactPersonName,
      contactPersonPhone: mockselectedBankBranch.contactPersonPhone,
      contactPersonEmail: mockselectedBankBranch.contactPersonEmail,
      physicalAddress: mockselectedBankBranch.physicalAddress,
      postalAddress: mockselectedBankBranch.postalAddress
    });
  });

  test('should open the bank charge modal and set form values when a bank charge is selected', () => {
    const mockselectedBankCharge = mockBankChargeData[0];
    component.selectedBankCharge = mockselectedBankCharge;
    const spyOpenBankChargeModal = jest.spyOn(component, 'openBankChargeModal');
    const patchValueSpy = jest.spyOn(
      component.createBankChargeForm,
      'patchValue'
    );

    component.editBankCharge();

    expect(spyOpenBankChargeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      dateFrom: mockselectedBankCharge.dateFrom,
      dateTo: mockselectedBankCharge.dateTo,
      product: mockselectedBankCharge.productName,
      rate: mockselectedBankCharge.rate,
      rateType: mockselectedBankCharge.rateType,
      system: mockselectedBankCharge.systemName
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

  test('should display an error message when no bank branch is selected during edit', () => {
    component.selectedBankBranch = null;

    component.editBankBranch();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No bank branch is selected!'
    );
  });

  test('should display an error message when no bank charge is selected during edit', () => {
    component.selectedBankCharge = null;

    component.editBankCharge();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No bank charge is selected!'
    );
  });

  test('should show the bank confirmation modal when deleteBank is called', () => {
    const spydeleteBank = jest.spyOn(component, 'deleteBank');
    component.deleteBank();

    expect(spydeleteBank).toHaveBeenCalled();
    expect(component.bankConfirmationModal.show).toBeTruthy;
  });

  test('should show the bank branch confirmation modal when deleteBankBranch is called', () => {
    const spydeleteBankBranch = jest.spyOn(component, 'deleteBankBranch');
    component.deleteBankBranch();

    expect(spydeleteBankBranch).toHaveBeenCalled();
    expect(component.bankBranchConfirmationModal.show).toBeTruthy;
  });

  test('should show the bank confirmation modal when deleteBank is called', () => {
    const spydeleteBankCharge = jest.spyOn(component, 'deleteBankCharge');
    component.deleteBankCharge();

    expect(spydeleteBankCharge).toHaveBeenCalled();
    expect(component.bankChargeConfirmationModal.show).toBeTruthy;
  });

  test('should confirm bank deletion when a bank is selected', () => {
    component.selectedBank = mockBankData[0];
    const selectedBankId = mockBankData[0].id;

    const spydeleteBankConfirmation = jest.spyOn(bankServiceStub, 'deleteBank');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeleteBank = jest.spyOn(component, 'deleteBank');
    component.deleteBank();

    const button = fixture.debugElement.nativeElement.querySelector('#bankConfirmationModal');
    button.click();

    component.confirmBankDelete();

    expect(spydeleteBank).toHaveBeenCalled();
    expect(spydeleteBankConfirmation).toHaveBeenCalledWith(selectedBankId);
  });

  test('should confirm bank branch deletion when a bank branch is selected', () => {
    component.selectedBankBranch = mockBankBranchData[0];
    const selectedBankBranchId = mockBankBranchData[0].id;

    const spydeleteBankBranchConfirmation = jest.spyOn(bankServiceStub, 'deleteBankBranch');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeleteBankBranch = jest.spyOn(component, 'deleteBankBranch');
    component.deleteBankBranch();

    const button = fixture.debugElement.nativeElement.querySelector('#bankBranchConfirmationModal');
    button.click();

    component.confirmBankBranchDelete();

    expect(spydeleteBankBranch).toHaveBeenCalled();
    expect(spydeleteBankBranchConfirmation).toHaveBeenCalledWith(selectedBankBranchId);
  });

  test('should confirm bank charge deletion when a bank charge is selected', () => {
    component.selectedBankCharge = mockBankChargeData[0];
    const selectedBankChargeId = mockBankChargeData[0].rate;

    // const spydeleteBankChargeConfirmation = jest.spyOn(bankServiceStub, 'deleteBank');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeleteBankCharge = jest.spyOn(component, 'deleteBankCharge');
    component.deleteBankCharge();

    const button = fixture.debugElement.nativeElement.querySelector('#bankChargeConfirmationModal');
    button.click();

    component.confirmBankChargeDelete();

    expect(spydeleteBankCharge).toHaveBeenCalled();
    // expect(spydeleteBankChargeConfirmation).toHaveBeenCalledWith(selectedBankChargeId);
  });

  test('should save banks', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveBankBtn');
    button.click();
    fixture.detectChanges();
    expect(bankServiceStub.createBank.call).toBeTruthy();
    expect(bankServiceStub.createBank.call.length).toBe(1);
  });

  test('should save banks branch', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveBankBranchBtn');
    button.click();
    fixture.detectChanges();
    expect(bankServiceStub.createBankBranch.call).toBeTruthy();
    expect(bankServiceStub.createBankBranch.call.length).toBe(1);
  });

  /*test('should save banks charge', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveBankChargeBtn');
    button.click();
    fixture.detectChanges();
    expect(bankServiceStub.createBankBranch.call).toBeTruthy();
    expect(bankServiceStub.createBankBranch.call.length).toBe(1);
  });*/
});
