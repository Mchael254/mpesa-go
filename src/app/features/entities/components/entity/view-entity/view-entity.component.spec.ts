import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ViewEntityComponent } from './view-entity.component';
import { EntityService } from '../../../services/entity/entity.service';
import { StaffService } from '../../../services/staff/staff.service';
import { ClientService } from '../../../services/client/client.service';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { IntermediaryService } from '../../../services/intermediary/intermediary.service';
import { AccountReqPartyId, IdentityModeDTO, ReqPartyById } from '../../../data/entityDto';
import { StaffDto, StaffResDto } from '../../../data/StaffDto';
import { AgentDTO } from '../../../data/AgentDTO';
import { ClientDTO, ClientTypeDTO } from '../../../data/ClientDTO';
import { ServiceProviderRes } from '../../../data/ServiceProviderDTO';
import { PartyTypeDto } from '../../../data/partyTypeDto';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../../services/account/account.service';
import { AccountDetailsDTO, ClientTitleDTO, PartyAccountsDetails, kycInfoDTO } from '../../../data/accountDTO';

const mockEntityData: ReqPartyById = {
  id: 16674453,
  modeOfIdentity: {
    id: 1,
    name: 'NATIONAL_ID',
    organizationId: 2,
    identityFormat: null,
    identityFormatError: null
  },
  modeOfIdentityNumber: '7368847474',
  name: 'New Staff',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  countryId: 1100,
  organizationId: 2,
  categoryName: '',
  dateOfBirth: '',
  pinNumber: '',
  profilePicture: null,
  profileImage: null
}

// const mockAccounts: AccountReqPartyId[] = [
//   {
//     id: 16674456,
//     accountTypeId: null,
//     partyId: 16674453,
//     effectiveDateFrom: "2022-11-17",
//     effectiveDateTo: null,
//     category: "Individual",
//     accountCode: 16674455,
//     partyType: null,
//     partyTypeName: "Staff",
//   },
//   {
//     id: 1667530,
//     accountTypeId: null,
//     partyId: 16674453,
//     effectiveDateFrom: "2022-11-17",
//     effectiveDateTo: null,
//     category: "Individual",
//     accountCode: 201235391,
//     partyType: null,
//     partyTypeName: "Agent"
//   },
//   {
//     id: 166753526,
//     accountTypeId: null,
//     partyId: 16674453,
//     effectiveDateFrom: "2022-11-17",
//     effectiveDateTo: null,
//     category: "Individual",
//     accountCode: 21178194,
//     partyType: null,
//     partyTypeName: "Client"
//   }
// ];

const mockStaffAccountData: StaffResDto = {
  activatedBy: "",
  city: 0,
  countryCode: 0,
  dateCreated: "",
  department: "",
  departmentCode: 0,
  emailAddress: "",
  granter: "",
  id: 0,
  manager: "",
  name: "",
  otherPhone: "",
  personelRank: "",
  phoneNumber: "",
  physicalAddress: "",
  postalCode: "",
  profilePicture: "",
  status: "",
  telNo: "",
  townCode: 0,
  updateBy: "",
  userType: "",
  username: ""
};

const mockAgentAccountData: AgentDTO = {};

const client: ClientTypeDTO = {
  category: '',
  clientTypeName: '',
  code: 0,
  description: '',
  organizationId: 0,
  person: '',
  type: ''
}

const mockClientAccountData: ClientDTO = {
  branchCode: 0,
  category: '',
  clientTitle: '',
  clientType: client,
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
  withEffectFromDate: '',
  clientTypeName: '',
  clientFullName: ''
};

const mockServiceProviderAccountData: ServiceProviderRes = {
  category: "",
  country: undefined,
  createdBy: "",
  dateCreated: "",
  effectiveDateFrom: "",
  emailAddress: "",
  gender: "",
  id: 0,
  idNumber: "",
  modeOfIdentity: "",
  modeOfIdentityDto: undefined,
  name: "",
  parentCompany: "",
  partyId: 0,
  phoneNumber: "",
  physicalAddress: "",
  pinNumber: "",
  postalAddress: "",
  providerLicenseNo: "",
  providerStatus: "",
  providerType: undefined,
  shortDescription: "",
  smsNumber: "",
  system: "",
  systemCode: 0,
  title: "",
  tradeName: "",
  type: "",
  vatNumber: ""
};

const mockAllPartyTypes: PartyTypeDto[] = [
  {
    id: 1,
    organizationId: 2,
    partyTypeName: "Staff",
    partyTypeShtDesc: "STAFF",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 2,
    organizationId: 2,
    partyTypeName: "Client",
    partyTypeShtDesc: "CLIENT",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 3,
    organizationId: 2,
    partyTypeName: "Agent",
    partyTypeShtDesc: "AGENT",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 4,
    organizationId: 2,
    partyTypeName: "Service Provider",
    partyTypeShtDesc: "SPR",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 33977485,
    organizationId: 2,
    partyTypeName: "Creditor",
    partyTypeShtDesc: "CRD",
    partyTypeVisible: null,
    partyTypeLevel: 2
  },
  {
    id: 33977493,
    organizationId: 2,
    partyTypeName: "Debtoris",
    partyTypeShtDesc: "DPRS",
    partyTypeVisible: "Y",
    partyTypeLevel: 2
  }
];

const mockUnAssignedPartyRoles: PartyTypeDto[] = [
  {
    id: 4,
    organizationId: 2,
    partyTypeName: "Service Provider",
    partyTypeShtDesc: "SPR",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
];

const mockAssignedPartyTypes: PartyTypeDto[] = [
  {
    id: 1,
    organizationId: 2,
    partyTypeName: "Staff",
    partyTypeShtDesc: "STAFF",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 2,
    organizationId: 2,
    partyTypeName: "Client",
    partyTypeShtDesc: "CLIENT",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 3,
    organizationId: 2,
    partyTypeName: "Agent",
    partyTypeShtDesc: "AGENT",
    partyTypeVisible: null,
    partyTypeLevel: 1
  },
  {
    id: 33977485,
    organizationId: 2,
    partyTypeName: "Creditor",
    partyTypeShtDesc: "CRD",
    partyTypeVisible: null,
    partyTypeLevel: 2
  },
  {
    id: 33977493,
    organizationId: 2,
    partyTypeName: "Debtoris",
    partyTypeShtDesc: "DPRS",
    partyTypeVisible: "Y",
    partyTypeLevel: 2
  }
]

const identityTypeData: IdentityModeDTO = {
  id: 1,
  name: 'National_ID',
  identityFormat: '^[0-9]{8}$',
  identityFormatError: 'Incorrect ID Format',
  organizationId: 2,
}

const clientTitleData: ClientTitleDTO = {
  id: 0,
  shortDescription: '',
  description: '',
  gender: '',
  organizationId: 0
}

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

export class MockEntityService {
  getEntityByPartyId = jest.fn().mockReturnValue(of(mockEntityData));
  getAccountById = jest.fn().mockReturnValue(of());
  getPartiesType = jest.fn().mockReturnValue(of(mockAllPartyTypes));
  uploadProfileImage = jest.fn().mockReturnValue(of({ file: 'image.png' }));
  setCurrentAccount = jest.fn();
  setCurrentEntity = jest.fn().mockReturnValue(of(currentAccount$));

}

export class MockAccountService {
  getAccountDetailsByAccountCode = jest.fn().mockReturnValue(of(mockPartyAccountDetails));
  getPartyAccountById = jest.fn();
  currentAccount$ = currentAccount$;
}
export class MockStaffService {
  getStaffById = jest.fn().mockReturnValue(of(mockStaffAccountData));
}

export class MockIntermediaryService {
  getAgentById = jest.fn().mockReturnValue(of(mockAgentAccountData));
}

export class MockClientService {
  getClientById = jest.fn().mockReturnValue(of(mockClientAccountData));
}

export class MockServiceProviderService {
  getServiceProviderById = jest.fn().mockReturnValue(of(mockServiceProviderAccountData));
}

describe('ViewEntityComponent', () => {
  let component: ViewEntityComponent;
  let fixture: ComponentFixture<ViewEntityComponent>;
  let entityServiceStub: EntityService;
  let accountServiceStub: AccountService;
  let staffServiceStub: StaffService;
  let clientServiceStub: ClientService;
  let serviceProviderServiceStub: ServiceProviderService;
  let intermediaryServiceStub: IntermediaryService;
  const mySubject = new Subject();

  let activatedRoute: ActivatedRoute;
  let routeStub: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEntityComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: AccountService, useClass: MockAccountService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: ClientService, useClass: MockClientService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        { provide: ServiceProviderService, useClass: MockServiceProviderService },
        { provide: ActivatedRoute, useValue: {snapshot: {params: {'id': 16674453}}}, },
      ]
    });
    fixture = TestBed.createComponent(ViewEntityComponent);
    component = fixture.componentInstance;
    accountServiceStub = TestBed.inject(AccountService);
    entityServiceStub = TestBed.inject(EntityService);
    staffServiceStub = TestBed.inject(StaffService);
    clientServiceStub = TestBed.inject(ClientService);
    serviceProviderServiceStub = TestBed.inject(ServiceProviderService);
    intermediaryServiceStub = TestBed.inject(IntermediaryService);

    routeStub = TestBed.inject(Router)
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize the component', () => {
    const createEntitySummaryFormSpy = jest.spyOn(component, 'createEntitySummaryForm');
    const createSelectRoleFormSpy = jest.spyOn(component, 'createSelectRoleForm');
    const getEntityByPartyIdSpy = jest.spyOn(component, 'getEntityByPartyId');
    const getEntityAccountByIdSpy = jest.spyOn(component, 'getEntityAccountById');

    component.ngOnInit();

    expect(createEntitySummaryFormSpy).toHaveBeenCalled();
    expect(createSelectRoleFormSpy).toHaveBeenCalled();
    expect(getEntityByPartyIdSpy).toHaveBeenCalled();
    expect(getEntityAccountByIdSpy).toHaveBeenCalled();
    expect(component.entityId).toEqual(16674453);
  });

  test('should create entitySummaryForm', () => {
    component.createEntitySummaryForm();

    expect(component.entitySummaryForm).toBeDefined();
  });

  test('should create selectRoleModalForm', () => {
    component.createSelectRoleForm();

    expect(component.selectRoleModalForm).toBeDefined();
  });

  test('should set the account code', () => {
    // const getEntityAccountDetailsByAccountNoSpy = jest.spyOn(component, 'getEntityAccountDetailsByAccountNo');
    const getPartyAccountDetailByAccountIdSpy = jest.spyOn(component, 'getPartyAccountDetailByAccountId');
    const setCurrentAccountSpy = jest.spyOn(entityServiceStub, 'setCurrentAccount');

    component.setAccountCode();

    // expect(component.accountCode).toEqual(123);
    // expect(getEntityAccountDetailsByAccountNoSpy).toHaveBeenCalled();
    expect(getPartyAccountDetailByAccountIdSpy).toHaveBeenCalled();
    // expect(setCurrentAccountSpy).toHaveBeenCalledWith({ accountCode: 123, id: 16674453, partyType: { partyTypeName: 'Staff' } });
  });

  test('should fetch accountDetails using account code', () => {
    jest.spyOn(accountServiceStub, 'getAccountDetailsByAccountCode');
    component.getPartyAccountDetailByAccountId(mockPartyAccountDetails.accountCode);
    expect(accountServiceStub.getAccountDetailsByAccountCode).toHaveBeenCalled();
  });

  test('should fetch Entity Details using entityId', () => {
    jest.spyOn(entityServiceStub, 'getEntityByPartyId');
    component.getEntityByPartyId();
    expect(entityServiceStub.getEntityByPartyId).toHaveBeenCalled();
  });

  test('should call uploadProfileImage on file change', () => {
    const file = new File([''], 'profile.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    // Use jest.spyOn to spy on a method
    const uploadProfileImageSpy = jest.spyOn(component, 'uploadProfileImage').mockImplementation(() => {
      // Mock implementation of uploadProfileImage if needed
    });

    component.onFileChange(event);

    expect(uploadProfileImageSpy).toHaveBeenCalled();
    expect(component.selectedFile).toEqual(file);
  });

  test('should upload profilePicture', () => {
    class MockFileReader {
      onload: Function | null = null;

      readAsDataURL(blob: Blob): void {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: 'data:image/png;base64,...' } } as ProgressEvent<FileReader>);
          }
        }, 0);
      }
    }

    const originalFileReader = globalThis.FileReader;
    globalThis.FileReader = MockFileReader as any;

    const event = {
      target: {
        files: [
          {
            name: 'image.png',
            size: 50000,
            type: 'image/png',
          },
        ],
      },
    };

    component.onFileChange(event);

    // Use setTimeout to allow asynchronous code to execute
    setTimeout(() => {
      // Assert that the component's URL property was updated
      expect(component.url).toBe('data:image/png;base64,...');

      // Restore the original FileReader
      globalThis.FileReader = originalFileReader;
    }, 10);
  });

  test('should call entityService.uploadProfileImage and update entityPartyIdDetails on uploadProfileImage', () => {
    const file = new File([''], 'profile.png', { type: 'image/png' });
    const response = { file: 'profile.png' };
    
    // Use jest.spyOn to mock the method
    jest.spyOn(entityServiceStub, 'uploadProfileImage').mockReturnValue(of(response));
    component.entityId = 16674453;

    component.uploadProfileImage();

    // expect(entityServiceStub.uploadProfileImage).toHaveBeenCalledWith(
    //   123, 
    //   expect.any(File) as any  // Use any here for type assertion
    // );
    expect(entityServiceStub.uploadProfileImage).toHaveBeenCalled();
    expect(component.entityPartyIdDetails.profileImage).toEqual('profile.png');
  });

  test('should set selectedRole and call closebutton.nativeElement.click()', () => {
    const role = { /* mock role object */ };
    const closebutton = { nativeElement: { click: jest.fn() } };
    
    component.closebutton = closebutton;
    component.goToEntityRoleDefinitions = jest.fn(); // Mock goToEntityRoleDefinitions

    component.onAssignRole(role);

    expect(component.selectedRole).toBe(role);
    expect(closebutton.nativeElement.click).toHaveBeenCalled();
    expect(component.goToEntityRoleDefinitions).toHaveBeenCalled();
  });

  // test('should fetch unassigned roles', () => {
  //   jest.spyOn(entityServiceStub, 'getPartiesType');
  //   const assignedPartyTypes = mockAssignedPartyTypes
  //   component.getUnAssignedRoles();
  //   component.unAssignedPartyTypes = mockUnAssignedPartyRoles;

  //   expect(entityServiceStub.getPartiesType).toHaveBeenCalled();
  //   expect(component.unAssignedPartyTypes).toEqual(mockUnAssignedPartyRoles);
  //  });
  
  test('should navigate to view claims', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const accountId = 16674453;

    component.accountCode = accountId;

    component.goToViewClaims(accountId);

    // expect(navigateSpy).toHaveBeenCalledWith(['/home/gis/claim/list', accountId]);
    expect(navigateSpy).toHaveBeenCalled();
  });

  test('Should navigate to manageRoles', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const id = 16674453;
    component.manageRoles(id);
    expect(navigateSpy).toHaveBeenCalled();
  })

  test('Should navigate to editEntities', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const id = 16674453;
    component.editEntities(id);
    expect(navigateSpy).toHaveBeenCalled();
  })

  test('Should navigate to view policy', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const accountId = 16674453;
    component.accountCode = accountId;
    component.goToViewPolicies(accountId)
    expect(navigateSpy).toHaveBeenCalled();
  })

  test('should navigate to the correct route based on the selected role (staff)', () => {
    const selectedRole = { id: 1, partyTypeName: 'Staff' };
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    component.selectedRole = selectedRole;
    component.goToEntityRoleDefinitions();
    // expect(entityServiceStub.setCurrentEntity).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     partyTypeId: selectedRole.id,
    //   })
    // );
    expect(entityServiceStub.setCurrentEntity).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/staff/new']);
  });

  test('should navigate to the correct route based on the selected role (client)', () => {
    const selectedRole = { id: 2, partyTypeName: 'Client' };
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    component.selectedRole = selectedRole;
    component.goToEntityRoleDefinitions();
    expect(entityServiceStub.setCurrentEntity).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/client/new']);
  });
});
 