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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../../../services/account/account.service';

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

export class MockEntityService {
  getEntityByPartyId = jest.fn().mockReturnValue(of(mockEntityData));
  getAccountById = jest.fn().mockReturnValue(of());
  getPartiesType = jest.fn().mockReturnValue(of(mockAllPartyTypes));
  uploadProfileImage = jest.fn();
  setCurrentAccount = jest.fn();
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
        // { provide: AccountService, useValue: {currentAccount$: mySubject.asObservable()}},
        { provide: StaffService, useClass: MockStaffService },
        { provide: ClientService, useClass: MockClientService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        { provide: ServiceProviderService, useClass: MockServiceProviderService },
        { provide: ActivatedRoute, useValue: {snapshot: {params: {'id': 16674453}}}, },
      ]
    });
    fixture = TestBed.createComponent(ViewEntityComponent);
    component = fixture.componentInstance;
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

  test('should set the account code', () => {
    // const getEntityAccountDetailsByAccountNoSpy = jest.spyOn(component, 'getEntityAccountDetailsByAccountNo');
    const getPartyAccountDetailByAccountIdSpy = jest.spyOn(component, 'getPartyAccountDetailByAccountId');
    const setCurrentAccountSpy = jest.spyOn(entityServiceStub, 'setCurrentAccount');

    component.setAccountCode();

    expect(component.accountCode).toEqual(123);
    // expect(getEntityAccountDetailsByAccountNoSpy).toHaveBeenCalled();
    expect(getPartyAccountDetailByAccountIdSpy).toHaveBeenCalled();
    expect(setCurrentAccountSpy).toHaveBeenCalledWith({ accountCode: 123, id: 16674453, partyType: { partyTypeName: 'Staff' } });
  });

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

   test('should fetch unassigned roles', () => {
    // const entityAccountIdDetails = [
    //   { partyType: { partyTypeName: 'Staff' } },
    //   { partyType: { partyTypeName: 'Client' } },
    // ];
    const getPartiesTypeSpy = jest.spyOn(entityServiceStub, 'getPartiesType');
    
    // component.entityAccountIdDetails = mockAllPartyTypes;

    component.getUnAssignedRoles();

    expect(getPartiesTypeSpy).toHaveBeenCalled();
   });
  
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
});
 