import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ViewEntityComponent } from './view-entity.component';
import { EntityService } from '../../../services/entity/entity.service';
import { StaffService } from '../../../services/staff/staff.service';
import { ClientService } from '../../../services/client/client.service';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { IntermediaryService } from '../../../services/intermediary/intermediary.service';
import { AccountReqPartyId, ReqPartyById } from '../../../data/entityDto';
import { StaffResDto } from '../../../data/StaffDto';
import { AgentDTO } from '../../../data/AgentDTO';
import { ClientDTO, ClientTypeDTO } from '../../../data/ClientDTO';
import { ServiceProviderRes } from '../../../data/ServiceProviderDTO';
import { PartyTypeDto } from '../../../data/partyTypeDto';
import { Subject, of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../../services/account/account.service';
import {ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { MessageService } from 'primeng/api';

const mockEntityData: ReqPartyById = {
  id: 16674453,
  modeOfIdentity: {
    id: 1,
    name: 'NATIONAL_ID',
    organizationId: 2,
    identityFormat: null,
    identityFormatError: null,
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
  profileImage: null,
};

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
  activatedBy: '',
  city: 0,
  countryCode: 0,
  dateCreated: '',
  department: '',
  departmentCode: 0,
  emailAddress: '',
  granter: '',
  id: 0,
  manager: '',
  name: '',
  otherPhone: '',
  personelRank: '',
  phoneNumber: '',
  physicalAddress: '',
  postalCode: '',
  profilePicture: '',
  status: '',
  telNo: '',
  townCode: 0,
  updateBy: '',
  userType: '',
  username: '',
};

const mockAgentAccountData: AgentDTO = {};

const client: ClientTypeDTO = {
  category: '',
  clientTypeName: '',
  code: 0,
  description: '',
  organizationId: 0,
  person: '',
  type: '',
};

const mockClientAccountData: ClientDTO = {
  branchCode: 0,
  category: "",
  clientFullName: "",
  clientTitle: "",
  clientType: undefined,
  clientTypeName: "",
  code: 0,
  country: 0,
  createdBy: "",
  dateOfBirth: "",
  emailAddress: "",
  firstName: "",
  gender: "",
  id: 0,
  idNumber: "",
  lastName: "",
  mobileNumber: "",
  modeOfIdentity: "",
  occupation: {id: 0, name: "", sector_id: 0, short_description: ""},
  passportNumber: "",
  phoneNumber: "",
  physicalAddress: "",
  pinNumber: "",
  shortDescription: "",
  state: "",
  status: "",
  town: "",
  withEffectFromDate: ""
  /*branchCode: 0,
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
    short_description: '',
  },
  passportNumber: '',
  phoneNumber: '',
  physicalAddress: '',
  pinNumber: '',
  shortDescription: '',
  status: '',
  withEffectFromDate: '',
  clientTypeName: '',
  clientFullName: '',*/
};

const mockServiceProviderAccountData: ServiceProviderRes = {
  category: '',
  country: undefined,
  createdBy: '',
  dateCreated: '',
  effectiveDateFrom: '',
  emailAddress: '',
  gender: '',
  id: 0,
  idNumber: '',
  modeOfIdentity: '',
  modeOfIdentityDto: undefined,
  name: '',
  parentCompany: '',
  partyId: 0,
  phoneNumber: '',
  physicalAddress: '',
  pinNumber: '',
  postalAddress: '',
  providerLicenseNo: '',
  providerStatus: '',
  providerType: undefined,
  shortDescription: '',
  smsNumber: '',
  system: '',
  systemCode: 0,
  title: '',
  tradeName: '',
  type: '',
  vatNumber: '',
};

const mockAllPartyTypes: PartyTypeDto[] = [
  {
    id: 1,
    organizationId: 2,
    partyTypeName: 'Staff',
    partyTypeShtDesc: 'STAFF',
    partyTypeVisible: null,
    partyTypeLevel: 1,
  },
  {
    id: 2,
    organizationId: 2,
    partyTypeName: 'Client',
    partyTypeShtDesc: 'CLIENT',
    partyTypeVisible: null,
    partyTypeLevel: 1,
  },
  {
    id: 3,
    organizationId: 2,
    partyTypeName: 'Agent',
    partyTypeShtDesc: 'AGENT',
    partyTypeVisible: null,
    partyTypeLevel: 1,
  },
  {
    id: 4,
    organizationId: 2,
    partyTypeName: 'Service Provider',
    partyTypeShtDesc: 'SPR',
    partyTypeVisible: null,
    partyTypeLevel: 1,
  },
  {
    id: 33977485,
    organizationId: 2,
    partyTypeName: 'Creditor',
    partyTypeShtDesc: 'CRD',
    partyTypeVisible: null,
    partyTypeLevel: 2,
  },
  {
    id: 33977493,
    organizationId: 2,
    partyTypeName: 'Debtoris',
    partyTypeShtDesc: 'DPRS',
    partyTypeVisible: 'Y',
    partyTypeLevel: 2,
  },
];

const mockUnAssignedPartyRoles: PartyTypeDto[] = [
  {
    id: 4,
    organizationId: 2,
    partyTypeName: 'Service Provider',
    partyTypeShtDesc: 'SPR',
    partyTypeVisible: null,
    partyTypeLevel: 1,
  },
];

const mockJson = [
  {
    section_id: 'prime_details',
    order: 2,
    tabs: [
      { title: 'Tab A', order: 2 },
      { title: 'Tab B', order: 1 }
    ]
  },
  {
    section_id: 'additional_information',
    order: 1,
    tabs: [
      { title: 'Tab C', order: 3 },
      { title: 'Tab D', order: 2 }
    ]
  }
];


export class MockEntityService {
  getEntityByPartyId = jest.fn().mockReturnValue(of(mockEntityData));
  getAccountById = jest.fn().mockReturnValue(of());
  getPartiesType = jest.fn().mockReturnValue(of(mockAllPartyTypes));
  uploadProfileImage = jest.fn().mockReturnValue(of({ file: 'uploaded-profile-image.jpg' }));
  setCurrentAccount = jest.fn();
  setCurrentEntity = jest.fn();
}

export class MockAccountService {
  getAccountDetailsByAccountCode = jest.fn();
  getPartyAccountById = jest.fn();
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
  getServiceProviderById = jest
    .fn()
    .mockReturnValue(of(mockServiceProviderAccountData));
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
  let cdr: ChangeDetectorRef;
  let http: HttpTestingController;

  const mySubject = new Subject();

  let activatedRoute: ActivatedRoute;
  let routeStub: Router;

  const mockPrimeIdentityComponent = {
    openEditPrimeIdentityDialog: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEntityComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: ViewEntityComponent },
        ]),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: Router, useValue: mockRouter },
        { provide: AccountService, useClass: MockAccountService },
        // { provide: AccountService, useValue: {currentAccount$: mySubject.asObservable()}},
        { provide: StaffService, useClass: MockStaffService },
        { provide: ClientService, useClass: MockClientService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        {
          provide: ServiceProviderService,
          useClass: MockServiceProviderService,
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 16674453 } } },
        },
        MessageService,
        ChangeDetectorRef,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ViewEntityComponent);
    component = fixture.componentInstance;
    entityServiceStub = TestBed.inject(EntityService);
    staffServiceStub = TestBed.inject(StaffService);
    clientServiceStub = TestBed.inject(ClientService);
    serviceProviderServiceStub = TestBed.inject(ServiceProviderService);
    intermediaryServiceStub = TestBed.inject(IntermediaryService);

    routeStub = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    http = TestBed.inject(HttpTestingController);
    cdr = TestBed.inject(ChangeDetectorRef);

    fixture.detectChanges();


    // Set sample tabs
    component.primaryTabs = ['Overview', 'Reports', 'Transactions'];
    component.secondaryTabs = ['Prime identity', 'Contact', 'Address'];

    // Set default selections
    component.selectedTab = 'Overview';
    component.selectedSubTab = 'Prime identity';

    component.primeIdentityComponent = mockPrimeIdentityComponent;

    component.entityPartyIdDetails = {
      categoryName: 'TestCat',
      countryId: 1,
      dateOfBirth: '1990-01-01',
      effectiveDateFrom: '2023-01-01',
      effectiveDateTo: '2025-01-01',
      id: 101,
      modeOfIdentity: null,
      identityNumber: 123,
      name: 'John Doe',
      organizationId: 99,
      pinNumber: 'PIN123',
      profileImage: 'img.png'
    };

    component.entityAccountIdDetails = [
      { partyType: {
          id: 1,
          organizationId: 2,
          partyTypeName: 'Staff',
          partyTypeShtDesc: 'STAFF',
          partyTypeVisible: null,
          partyTypeLevel: 1,
        }},
    ] as any;


  });

  afterEach(() => {
    jest.clearAllMocks();
    // http.verify();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize the component', () => {
    const createEntitySummaryFormSpy = jest.spyOn(
      component,
      'createEntitySummaryForm'
    );
    const createSelectRoleFormSpy = jest.spyOn(
      component,
      'createSelectRoleForm'
    );
    const getEntityByPartyIdSpy = jest.spyOn(component, 'getEntityByPartyId');
    const getEntityAccountByIdSpy = jest.spyOn(
      component,
      'getEntityAccountById'
    );

    component.ngOnInit();

    expect(createEntitySummaryFormSpy).toHaveBeenCalled();
    expect(createSelectRoleFormSpy).toHaveBeenCalled();
    expect(getEntityByPartyIdSpy).toHaveBeenCalled();
    expect(getEntityAccountByIdSpy).toHaveBeenCalled();
    expect(component.entityId).toEqual(16674453);
  });

  // test('should set the account code', () => {
  //   // const getEntityAccountDetailsByAccountNoSpy = jest.spyOn(component, 'getEntityAccountDetailsByAccountNo');
  //   const getPartyAccountDetailByAccountIdSpy = jest.spyOn(
  //     component,
  //     'getPartyAccountDetailByAccountId'
  //   );
  //   const setCurrentAccountSpy = jest.spyOn(
  //     entityServiceStub,
  //     'setCurrentAccount'
  //   );

  //   component.setAccountCode();

  //   expect(component.accountCode).toEqual(123);
  //   // expect(getEntityAccountDetailsByAccountNoSpy).toHaveBeenCalled();
  //   expect(getPartyAccountDetailByAccountIdSpy).toHaveBeenCalled();
  //   expect(setCurrentAccountSpy).toHaveBeenCalledWith({
  //     accountCode: 123,
  //     id: 16674453,
  //     partyType: { partyTypeName: 'Staff' },
  //   });
  // });

  // test('should fetch staff details', () => {
  //   const getStaffByIdSpy = jest.spyOn(staffServiceStub, 'getStaffById');

  //   component.fetchStaffDetails(123);

  //   expect(getStaffByIdSpy).toHaveBeenCalledWith(123);
  //   expect(component.entityDetails).toBeDefined(); // Adjust the expectation based on your mock data
  // });

  test('should create entitySummaryForm', () => {
    component.createEntitySummaryForm();

    expect(component.entitySummaryForm).toBeDefined();
  });

  test('should create selectRoleModalForm', () => {
    component.createSelectRoleForm();

    expect(component.selectRoleModalForm).toBeDefined();
  });

  /*test('should call uploadProfileImage on file change', () => {
    console.log(`testing onFile change...`)
    const file = new File([''], 'profile.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    // Use jest.spyOn to spy on a method
    const uploadProfileImageSpy = jest
      .spyOn(component, 'uploadProfileImage')
      .mockImplementation(() => {
        // Mock implementation of uploadProfileImage if needed
      });

    component.onFileChange(event);

    expect(uploadProfileImageSpy).toHaveBeenCalled();
    expect(component.selectedFile).toEqual(file);
  });*/

  test('should call entityService.uploadProfileImage and update entityPartyIdDetails on uploadProfileImage', () => {
    const file = new File([''], 'profile.png', { type: 'image/png' });
    const response = { file: 'profile.png' };

    // Use jest.spyOn to mock the method
    jest
      .spyOn(entityServiceStub, 'uploadProfileImage')
      .mockReturnValue(of(response));
    component.entityId = 16674453;

    component.uploadProfileImage();

    // expect(entityServiceStub.uploadProfileImage).toHaveBeenCalledWith(
    //   123,
    //   expect.any(File) as any  // Use any here for type assertion
    // );
    expect(entityServiceStub.uploadProfileImage).toHaveBeenCalled();
    expect(component.entityPartyIdDetails.profileImage).toEqual('profile.png');
  });

  // test('should set selectedRole and call closebutton.nativeElement.click()', () => {
  //   const role = { /* mock role object */ };
  //   const closebutton = { nativeElement: { click: jest.fn() } };
  //
  //   component.closebutton = closebutton;
  //   component.goToEntityRoleDefinitions = jest.fn(); // Mock goToEntityRoleDefinitions
  //
  //   component.onAssignRole(role);
  //
  //   expect(component.selectedRole).toBe(role);
  //   expect(closebutton.nativeElement.click).toHaveBeenCalled();
  //   expect(component.goToEntityRoleDefinitions).toHaveBeenCalled();
  // });

  // test('should fetch unassigned roles', () => {
  //   // const entityAccountIdDetails = [
  //   //   { partyType: { partyTypeName: 'Staff' } },
  //   //   { partyType: { partyTypeName: 'Client' } },
  //   // ];
  //   const getPartiesTypeSpy = jest.spyOn(entityServiceStub, 'getPartiesType');

  //   // component.entityAccountIdDetails = mockAllPartyTypes;

  //   component.getUnAssignedRoles();

  //   expect(getPartiesTypeSpy).toHaveBeenCalled();
  // });

  test('should navigate to view claims', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const accountId = 16674453; // Set the expected accountId here

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
  });

  test('Should navigate to editEntities', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const id = 16674453;
    component.editEntities(id);
    expect(navigateSpy).toHaveBeenCalled();
  });

  test('Should navigate to view policy', () => {
    const navigateSpy = jest.spyOn(routeStub, 'navigate');
    const accountId = 16674453;
    component.accountCode = accountId;
    component.goToViewPolicies(accountId);
    expect(navigateSpy).toHaveBeenCalled();
  });

  test('should test file changes onSelect', () => {
    console.log('testing file select')

    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [mockFile] } };

    const readerMock = {
      readAsDataURL: jest.fn(),
      onload: null as any,
      result: 'data:image/png;base64,dummybase64'
    };

    (window as any).FileReader = jest.fn(() => readerMock);
    component.onFileChange(event as any);
    readerMock.onload({ target: { result: readerMock.result } });

    // Give it time to execute async code
    setTimeout(() => {
      expect(component.selectedFile).toBe(mockFile);
      expect(component.url).toBe('data:image/png;base64,dummybase64');
      expect(component.uploadProfileImage).toHaveBeenCalled();
    }, 10)
  });

  test('should update selectedTab if tab title is in primaryTabs', () => {
    const tab = { title: 'Transactions' };
    component.selectTab(tab);
    expect(component.selectedTab).toBe('Transactions');
    expect(component.selectedSubTab).toBe('Prime identity'); // unchanged
  });

  // does not increase coverage
  /*test('should update selectedSubTab if tab title is in secondaryTabs', () => {
    const tab = { title: 'Contact' };
    component.selectTab(tab);
    expect(component.selectedTab).toBe('Overview'); // unchanged
    expect(component.selectedSubTab).toBe('Contact');
  });

  test('should update both selectedTab and selectedSubTab if title is in both', () => {
    component.primaryTabs.push('Contact'); // add overlap
    const tab = { title: 'Contact' };
    component.selectTab(tab);
    expect(component.selectedTab).toBe('Contact');
    expect(component.selectedSubTab).toBe('Contact');
  });

  test('should not update anything if title is not in any tab list', () => {
    const tab = { title: 'Unknown' };
    component.selectTab(tab);
    expect(component.selectedTab).toBe('Overview');
    expect(component.selectedSubTab).toBe('Prime identity');
  });*/

  test('should call openEditPrimeIdentityDialog when tabTitle is "prime_identity"', () => {
    component.openEditModal('prime_identity');
    expect(mockPrimeIdentityComponent.openEditPrimeIdentityDialog).toHaveBeenCalled();
  });


  test('should assign role and navigate to staff URL', () => {
    const role: AccountReqPartyId = {
      accountCode: 0,
      accountTypeId: 0,
      category: "",
      effectiveDateFrom: "",
      effectiveDateTo: "",
      id: 0,
      organizationGroupId: 0,
      organizationId: 0,
      partyId: 0,
      partyType: undefined
    };
    component.onAssignRole(role);

    expect(component.selectedRole).toEqual(role);
    expect(entityServiceStub.setCurrentEntity).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  test('should load unassigned party types correctly', () => {
    component.getUnAssignedRoles();
    expect(entityServiceStub.getPartiesType).toHaveBeenCalled();
    // expect(component.unAssignedPartyTypes).toEqual(mockAllPartyTypes);
  });

  test('should fetch and sort dynamic display config, and set primary/secondary tabs', () => {
    component.fetchDynamicDisplayConfig();

    const req = http.match('assets/data/dynamicDisplay360View.json');
    expect(req.length).toBe(2);
    /*expect(req.request.method).toBe('GET');
    req.flush(mockJson);*/

    req.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush(mockJson);
    });

    expect(component.dynamicDisplay.length).toBe(2);
    expect(component.dynamicDisplay[0].section_id).toBe('additional_information'); // sorted by order
    expect(component.primaryTabs).toEqual(['Tab B', 'Tab A']); // sorted internally
    expect(component.secondaryTabs).toEqual(['Tab D', 'Tab C']);
  });

});
