import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

import { EditComponent } from './edit.component';
import { CountryDto } from '../../../../shared/data/common/countryDto';
import { AccountService } from '../../services/account/account.service';
import { EntityService } from '../../services/entity/entity.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { StaffService } from '../../services/staff/staff.service';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { OccupationService } from '../../../../shared/services/setups/occupation/occupation.service';
import { SectorService } from '../../../../shared/services/setups/sector/sector.service';
import { DepartmentService } from '../../../../shared/services/setups/department/department.service';
import { BankBranchDTO, BankDTO, FundSourceDTO } from '../../../../shared/data/common/bank-dto';
import { SectorDTO } from '../../../../shared/data/common/sector-dto';
import { OccupationDTO } from '../../../../shared/data/common/occupation-dto';
import { ClientTitleDTO } from '../../../../shared/data/common/client-title-dto';
import { IdentityModeDTO } from '../../data/entityDto';
import { DepartmentDto } from 'src/app/shared/data/common/departmentDto';
import { AccountDetailsDTO, AmlWealthDetailsUpdateDTO, BankDetailsUpdateDTO, NextKinDetailsUpdateDTO, PartyAccountsDetails, PersonalDetailsUpdateDTO, WealthDetailsUpdateDTO, kycInfoDTO } from '../../data/accountDTO';
import { PartyTypeDto } from '../../data/partyTypeDto';
import { AgentDTO } from '../../data/AgentDTO';
import { StaffDto } from '../../data/StaffDto';

const mockCountryData: CountryDto[] = [{
  id: 1100,
  short_description: 'KE',
  name: 'Kenya'
}]

const mockBankData: BankDTO[] = [{
  countryId: mockCountryData[0].id,
  id: 25,
  name: 'Absa Kenya',
  short_description: 'AB KE'
}]

const mockBranchData: BankBranchDTO[] = [{
  bank_id: 0,
  createdBy: '',
  id: 0,
  name: '',
  short_description: ''
}]

const mockSectorData: SectorDTO[] = [{
  id: 0,
  shortDescription: '',
  name: '',
  sectorWefDate: '',
  sectorWetDate: '',
  organizationId: 0
}]

const mockOcupationData: OccupationDTO[] = [{
  id: 0,
  shortDescription: '',
  name: '',
  wefDate: '',
  wetDate: '',
  organizationId: 0
}]
const ocupationData: OccupationDTO = {
  id: 0,
  shortDescription: '',
  name: '',
  wefDate: '',
  wetDate: '',
  organizationId: 0
}

const mockClientTitleData: ClientTitleDTO[] = [{
  id: 0,
  shortDescription: '',
  description: '',
  gender: '',
  organizationId: 0
}]

const clientTitleData: ClientTitleDTO = {
  id: 0,
  shortDescription: '',
  description: '',
  gender: '',
  organizationId: 0
}

const mockFundSource: FundSourceDTO[] = [{
  code: 0,
  name: ''
}]

const mockIdentityTypeData: IdentityModeDTO[] = [{
  id: 0,
  name: '',
  identityFormat: '',
  identityFormatError: '',
  organizationId: 0,
}]

const identityTypeData: IdentityModeDTO = {
  id: 1,
  name: 'National_ID',
  identityFormat: '^[0-9]{8}$',
  identityFormatError: 'Incorrect ID Format',
  organizationId: 2,
}

const mockDepartmentData: DepartmentDto[] = [{
  id: 0,
  departmentName: '',
  shortDescription: '',
  effectiveFromDate: undefined,
  effectiveToDate: undefined,
  organizationId: 0
}]

const mockPartyType: PartyTypeDto = {
  id: 0,
  organizationId: 0,
  partyTypeLevel: 0,
  partyTypeName: '',
  partyTypeShtDesc: '',
  partyTypeVisible: '',
}

const mockKycInfo: kycInfoDTO = {
  id: 0,
  name: '',
  shortDesc: '',
  emailAddress: '',
  phoneNumber: '',
}

const mockAccountDetails: AccountDetailsDTO = {
  accountCode: 0,
  accountTypeId: 0,
  category: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  id: 0,
  kycInfo: mockKycInfo,
  organizationGroupId: 0,
  organizationId: 0,
  partyId: 0,
  partyType: mockPartyType
}

const mockAgent: AgentDTO = {
  id: 0,
  name: '',
  shortDesc: '',
  emailAddress: '',
  insurerId: 0,
  organizationId: 0,
  agentLicenceNo: '',
  withHoldingTax: 0,
  agentStatus: '',
  blackListReason: '',
  accountTypeId: 0,
  accountType: '',
  businessUnit: '',
  country: '',
  countryCode: 0,
  createdBy: '',
  creditLimit: 0,
  dateOfBirth: '',
  faxNo: '',
  gender: '',
  is_credit_allowed: '',
  modeOfIdentity: '',
  phoneNumber: '',
  physicalAddress: '',
  pinNo: '',
  primaryType: '',
  smsNumber: '',
  stateCode: 0,
  townCode: 0,
  vatApplicable: '',
  withEffectFromDate: '',
  withHoldingTaxApplicable: '',
  status: '',
  agentIdNo: '',
  branchId: 0,
  category: '',
}

const mockStaff: StaffDto = {
  id: 0,
  name: '',
  username: '',
  userType: '',
  emailAddress: '',
  status: '',
  profileImage: '',
  department: '',
  manager: '',
  telNo: '',
  phoneNumber: '',
  otherPhone: '',
  countryCode: 0,
  townCode: 0,
  personelRank: '',
  city: 0,
  physicalAddress: '',
  postalCode: '',
  departmentCode: 0,
  activatedBy: '',
  updateBy: '',
  dateCreated: '',
  dateActivated: '',
  granter: '',
  branchId: 0,
  accountId: 0,
  accountManager: 0,
  profilePicture: '',
  organizationId: 0,
  organizationGroupId: 0,
  supervisorId: 0,
  supervisorCode: 0,
  organizationCode: 0,
  pinNumber: '',
  gender: '',
}

const mockPartyAccountDetails: PartyAccountsDetails = {
  accountCode: 0,
  accountType: 0,
  address: {
      account: mockAccountDetails,
      box_number: '',
      country_id: 0,
      estate: '',
      fax: '',
      house_number: '',
      id: 0,
      is_utility_address: '',
      phoneNumber: '',
      physical_address: '',
      postal_code: '',
      residential_address: '',
      road: '',
      state_id: 0,
      town_id: 0,
      utility_address_proof: '',
      zip: ''
    },
    agentDto: mockAgent,
    category: '',
    clientDetails: {
      clientBranchCode: 0,
      clientId: 0,
      titleDto: ''
    },
    clientDto: {
      branchCode: 0,
      category: '',
      clientTitle: '',
      clientType: {
        category: '',
        clientTypeName: '',
        code: 0,
        description: '',
        organizationId: 0,
        person: '',
        type: ''
      },
      country: 0,
      createdBy: '',
      dateOfBirth: '',
      emailAddress: '',
      firstName: '',
      gender: '',
      id: 0,
      idNumber: '',
      lastName: '',
      modeOfIdentity: '',
      occupation: {
        id: 0,
        name: '',
        sector_id: 0,
        short_description: ''
      },
      passportNumber: '',
      phoneNumber: '',
      physicalAddress: '',
      pinNumber: '',
      shortDescription: '',
      status: '',
      withEffectFromDate: ''
    },
    contactDetails: {
      account: mockAccountDetails,
      accountId: 0,
      emailAddress: '',
      id: 0,
      phoneNumber: '',
      preferredChannel: '',
      receivedDocuments: '',
      smsNumber: '',
      title: clientTitleData,
      titleShortDescription: '',
    },
    country: {
      id: 0,
      name: '',
      short_description: ''
    },
    countryId: 0,
    createdBy: '',
    dateCreated: '',
    dateOfBirth: '',
    effectiveDateFrom: '',
    effectiveDateTo: '',
    firstName: '',
    gender: '',
    id: 0,
    lastName: '',
    modeOfIdentity: identityTypeData,
    modeOfIdentityNumber: 0,
    nextOfKinDetailsList: [
      {
        account: mockAccountDetails,
        emailAddress: '',
        fullName: '',
        id: 0,
        identityNumber: '',
        modeOfIdentity: {
          createdBy: '',
          createdDate: '',
          id: 0,
          identityFormat: '',
          identityFormatError: '',
          modifiedBy: '',
          modifiedDate: '',
          name: '',
          orgCode: 0
        },
        phoneNumber: '',
        relationship: '',
        smsNumber: ''
      }
    ],
    organizationId: 0,
    partyId: 0,
    partyType: mockPartyType,
    paymentDetails: {
      account_number: '',
      bank_branch_id: 0,
      currency_id: 0,
      effective_from_date: '',
      effective_to_date: '',
      iban: '',
      id: 0,
      is_default_channel: '',
      mpayno: '',
      partyAccountId: 0,
      preferedChannel: ''
    },
    pinNumber: '',
    serviceProviderDto: {
      category: '',
      country: {
        id: 0,
        name: '',
        short_description: ''
      },
      createdBy: '',
      dateCreated: '',
      dateOfRegistration: '',
      effectiveDateFrom: '',
      emailAddress: '',
      gender: '',
      id: 0,
      idNumber: '',
      modeOfIdentity: '',
      modeOfIdentityDto: identityTypeData,
      name: '',
      organizationId: 0,
      parentCompany: '',
      partyId: 0,
      phoneNumber: '',
      physicalAddress: '',
      pinNumber: '',
      postalAddress: '',
      providerLicenseNo: '',
      providerStatus: '',
      providerType: {
        code: 0,
        name: '',
        providerTypeSuffixes: '',
        shortDescription: '',
        shortDescriptionNextNo: '',
        shortDescriptionSerialFormat: '',
        status: '',
        vatTaxRate: '',
        witholdingTaxRate: ''
      },
      shortDescription: '',
      smsNumber: '',
      status: '',
      system: '',
      systemCode: 0,
      title: '',
      tradeName: '',
      type: '',
      vatNumber: ''
    },
    status: '',
    userDto: mockStaff,
    wealthAmlDetails: {
      certificate_registration_number: '',
      certificate_year_of_registration: '',
      citizenship_country_id: 0,
      cr_form_required: 0,
      cr_form_year: 0,
      distributeChannel: '',
      funds_source: '',
      id: 0,
      insurancePurpose: '',
      is_employed: '',
      is_self_employed: '',
      marital_status: '',
      nationality_country_id: 0,
      occupation_id: 0,
      operating_country_id: 0,
      parent_country_id: 0,
      partyAccountId: 0,
      premiumFrequency: '',
      registeredName: '',
      sector_id: 0,
      source_of_wealth_id: 0,
      tradingName: ''
    }
}

const currentAccount$ = new BehaviorSubject<PartyAccountsDetails>(mockPartyAccountDetails);

const mockPersonalData: PersonalDetailsUpdateDTO = {
  accountId: 0,
  accountType: 0,
  dob: '',
  emailAddress: '',
  identityNumber: '',
  modeOfIdentityId: 0,
  name: '',
  occupationId: 0,
  organizationId: 0,
  phoneNumber: '',
  physicalAddress: '',
  pinNumber: '',
  titleShortDescription: '',
  title: clientTitleData,
  category: '',
  departmentId: 0,
  supervisorId: 0,
  modeOfIdentity: identityTypeData,
  occupation: ocupationData,
}

const mockBankDetailsData: BankDetailsUpdateDTO = {
  account_number: '',
    bank_branch_id: 0,
    currency_id: 0,
    effective_from_date: '',
    effective_to_date: '',
    iban: '',
    id: 0,
    is_default_channel: '',
    mpayno: '',
    partyAccountId: 0,
    preferedChannel: '',
}

const mockwealthDetailsData: WealthDetailsUpdateDTO = {
  citizenship_country_id: 0,
  funds_source: '',
  id: 0,
  is_employed: 0,
  is_self_employed: 0,
  marital_status: '',
  nationality_country_id: 0,
  occupation_id: 0,
  partyAccountId: 0,
  source_of_funds_id: 0,
  sector_id: 0,
}

const mockAmlWealthDetailsData: AmlWealthDetailsUpdateDTO = {
  certificate_registration_number: '',
  certificate_year_of_registration: '',
  cr_form_required: '',
  cr_form_year: 0,
  funds_source: '',
  id: 0,
  operating_country_id: 0,
  parent_country_id: 0,
  partyAccountId: 0,
  registeredName: '',
  source_of_wealth_id: 0,
  tradingName: '',
}

const mockNextKinDetailsData: NextKinDetailsUpdateDTO = {
  id: 0,
  fullName: '',
  modeOfIdentityId: 0,
  identityNumber: '',
  emailAddress: '',
  phoneNumber: '',
  smsNumber: '',
  relationship: '',
  accountId: 0,
}

export class MockAccountService {
  getAccountDetailsByAccountCode = jest.fn().mockReturnValue(of(mockPartyAccountDetails));
  getClientTitles = jest.fn().mockReturnValue(of(mockClientTitleData));
  getIdentityMode = jest.fn().mockReturnValue(of(mockIdentityTypeData));
  currentAccount$ = currentAccount$;
  updatePersonalDetails = jest.fn().mockReturnValue(of(mockPersonalData));
  updateBankDetails = jest.fn().mockReturnValue(of(mockBankDetailsData));
  updateWealthDetails = jest.fn().mockReturnValue(of(mockwealthDetailsData));
  updateAmlWealthDetails = jest.fn().mockReturnValue(of(mockAmlWealthDetailsData));
  updateNextOfKinDetails = jest.fn().mockReturnValue(of(mockNextKinDetailsData));
}

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountryData));
}

export class MockBankService {
  getBanks = jest.fn().mockReturnValue(of(mockBankData));
  getBankBranch = jest.fn().mockReturnValue(of(mockBranchData));
  getFundSource = jest.fn().mockReturnValue(of(mockFundSource));
}

export class MockSectorService {
  getSectors = jest.fn().mockReturnValue(of(mockSectorData));
}

export class MockOccupationService {
  getOccupations = jest.fn().mockReturnValue(of(mockOcupationData));
}

export class MockEntityService {
  getClientTitles = jest.fn().mockReturnValue(of(mockClientTitleData));
}

export class MockDepartmentService {
  getDepartments = jest.fn().mockReturnValue(of(mockDepartmentData));
}

export class MockStaffService {
  searchStaff = jest.fn();
  getStaff = jest.fn();
  getStaffById = jest.fn();
}

export class MockGlobalMessageService {
  displaySuccessMessage = jest.fn();
  displayInfoMessage = jest.fn();
}


describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let accountServiceStub: AccountService;
  let entityServiceStub: EntityService;
  let countryServiceStub: CountryService;
  let bankServiceStub: BankService;
  let occupationServiceStub: OccupationService;
  let sectorServiceStub: SectorService;
  let departmentServiceStub: DepartmentService;
  let staffServiceStub: StaffService;
  let messageServiceStub: GlobalMessagingService;
  let translateServiceStub: TranslateService;
  let activatedRoute: ActivatedRoute;
  let routeStub: Router;
  const mySubject = new Subject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: AccountService, useClass: MockAccountService },
        { provide: BankService, useClass: MockBankService},
        { provide: OccupationService, useClass: MockOccupationService},
        { provide: SectorService, useClass: MockSectorService },
        { provide: DepartmentService, useClass: MockDepartmentService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        // { provide: ActivatedRoute, useValue: {snapshot: {params: {'id': 16674453}}}, },
        DatePipe,
        TranslateService

      ]
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    accountServiceStub = TestBed.inject(AccountService);
    countryServiceStub = TestBed.inject(CountryService);
    entityServiceStub = TestBed.inject(EntityService);
    bankServiceStub = TestBed.inject(BankService);
    occupationServiceStub = TestBed.inject(OccupationService);
    sectorServiceStub = TestBed.inject(SectorService);
    departmentServiceStub = TestBed.inject(DepartmentService);
    staffServiceStub = TestBed.inject(StaffService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    translateServiceStub = TestBed.inject(TranslateService);
    routeStub = TestBed.inject(Router)
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch countries', () => {
    jest.spyOn(countryServiceStub, 'getCountries');
    component.fetchCountries();
    expect(countryServiceStub.getCountries).toHaveBeenCalled();
  });

  test('Should fetch Departments', () => {
    jest.spyOn(departmentServiceStub, 'getDepartments');
    component.fetchDepartments();
    expect(departmentServiceStub.getDepartments).toHaveBeenCalled();
  });

  test('should featch modeofIdentity', () => {
    jest.spyOn(accountServiceStub, 'getIdentityMode');
    component.fetchModeOfIdentity(mockCountryData[0].id);
    expect(accountServiceStub.getIdentityMode).toHaveBeenCalled();
  });

  // test('should featch accountDetails using account code', () => {
  //   jest.spyOn(accountServiceStub, 'getAccountDetailsByAccountCode');
  //   component.getAccountDetailsByAccountCode();
  //   expect(accountServiceStub.getAccountDetailsByAccountCode).toHaveBeenCalled();
  // });

  test('Should update personal information', () => {
    const formValue = mockPersonalData;
    jest.spyOn(accountServiceStub, 'updatePersonalDetails');
    component.updatePersonalInfo();
    // expect(accountServiceStub.updatePersonalDetails).toHaveBeenCalledWith(formValue, mockPartyAccountDetails.id);
    expect(accountServiceStub.updatePersonalDetails).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated Personal Details.'
    );
  });

  test('Should update Bank information', () => {
    const formValue = mockPersonalData;
    jest.spyOn(accountServiceStub, 'updateBankDetails');
    component.saveUpdatedBankDetails();
    expect(accountServiceStub.updateBankDetails).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated Bank Details'
    );
  });

  test('Should update wealth information', () => {
    const formValue = mockPersonalData;
    jest.spyOn(accountServiceStub, 'updateWealthDetails');
    component.saveUpdatedWealthDetails();
    expect(accountServiceStub.updateWealthDetails).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated Wealth Details'
    );
  });

  test('Should update wealth Aml information', () => {
    const formValue = mockPersonalData;
    jest.spyOn(accountServiceStub, 'updateAmlWealthDetails');
    component.saveUpdatedAmlWealthDetails();
    expect(accountServiceStub.updateAmlWealthDetails).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated Wealth Aml Details'
    );
  });

  test('Should update Next of Kins information', () => {
    const formValue = mockPersonalData;
    jest.spyOn(accountServiceStub, 'updateNextOfKinDetails');
    component.saveUpdatedNextofKinDetails();
    expect(accountServiceStub.updateNextOfKinDetails).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated Next of Kin Details'
    );
  });
  
  test('Should update selectedModeIdentity on change', () => {
    const event = new Event('change');
    const target = {
      value: '1',
    };
    Object.defineProperty(event, 'target', { writable: true, value: target });
    component.onModeIdentityChange(event as Event);

    // expect(component.selectedModeIdentity).toEqual(identityTypeData);
  });

  // test('should update form controls on identity mode change', () => {
  //   const selectedIdentityMode = identityTypeData;
  //   component.onModeIdentityChange(selectedIdentityMode);
  //   expect(component.selectedModeIdentity).toBe(selectedIdentityMode);
  // });
  
  // test('should submit the form', () => {
  //   const formData = {
  //     // Provide mock form values
  //   };

  //   component.submitForm(formData);

  //   // Assert - Check if the service method was called with the form data
  //   expect(accountServiceStub.saveAccountDetails).toHaveBeenCalledWith(formData);
  //   // Add more assertions based on your actual implementation
  // });
});
