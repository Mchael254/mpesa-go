import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LandingDashboardComponent } from './landing-dashboard.component';
import { DashboardService } from '../../../services/dashboard.service';
import { SessionStorageService } from '../../../../../../../../shared/services/session-storage/session-storage.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserProfileDTO, MemberPolicies } from '../../../models/member-policies';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('LandingDashboardComponent', () => {
  let component: LandingDashboardComponent;
  let fixture: ComponentFixture<LandingDashboardComponent>;
  let router: Router;
  let sessionStorageService: SessionStorageService;
  let dashboardService: DashboardService;
  let changeDetectorRef: ChangeDetectorRef;

  const mockPolicies: MemberPolicies[] = [
    {
      policy_number: '12345',
      policy_code: 1,
      endorsement_code: 2,
      product_type: 'Type',
      policy_member_code: 3,
      product_code: 4,
      effective_date: '2023-01-01',
      status: 'Active',
      description: 'Test Policy',
      agent_name: 'Agent Smith',
      branch_name: 'Main Branch',
      total_premium: 1000,
      total_sum_assured: 100000,
      other_names: 'John',
      surname: 'Doe',
      scheme_name: 'Test Scheme',
      member_number: 'MEM001',
      if_group_life_rider: 'Yes',
      fund_value: 5000,
    },
  ];

  beforeEach(() => {
    const mockSessionStorage = {
      get: jest.fn()
    };
    const mockDashboardService = {
      getMemberPolicies: jest.fn().mockReturnValue(of([]))
    };
    const mockChangeDetectorRef = { detectChanges: jest.fn() };
    const mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [LandingDashboardComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionStorageService, useValue: mockSessionStorage },
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    sessionStorageService = TestBed.inject(SessionStorageService);
    dashboardService = TestBed.inject(DashboardService);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize data on ngOnInit', () => {
    const getDataSpy = jest.spyOn(component, 'getData');
    const getMemberPoliciesSpy = jest.spyOn(component, 'getMemberPolicies');

    component.ngOnInit();

    expect(getDataSpy).toHaveBeenCalled();
    expect(getMemberPoliciesSpy).toHaveBeenCalled();
  });

  test('should get data from session storage', () => {
    const mockMemberProfile: UserProfileDTO = {
      code: 123,
      emailAddress: 'test@example.com',
      fullName: 'John Doe',
      idNo: 456,
      teleponeNo: '1234567890',
      userName: 'johndoe'
    };
    jest.spyOn(sessionStorageService, 'get').mockReturnValueOnce('ENTITY_TYPE_VALUE')
      .mockReturnValueOnce(mockMemberProfile);

    component.getData();

    expect(component.entityType).toBe('ENTITY_TYPE_VALUE');
    expect(component.userProfileData).toEqual(mockMemberProfile);
    expect(component.entityCode).toBe(123);
    expect(component.entityIdNo).toBe(456);
  });

  test('should return correct status description', () => {
    expect(component.getStatusDescription('A')).toBe('Active');
    expect(component.getStatusDescription('X')).toBe('Unknown');
  });

  test('should navigate to policy details', () => {

    component.entityCode = 100;
    component.navigateToPolDets(mockPolicies[0]);

    expect(router.navigate).toHaveBeenCalledWith(
      ['/home/lms/grp/dashboard/policy-details'],
      {
        queryParams: {
          entityCode: 100,
          policyNumber: '12345',
          policyCode: 1,
          endorsementCode: 2,
          productType: 'Type',
          policyMemberCode: 3,
          productCode: 4
        }
      }
    );
  });

  test('should fetch member policies', () => {

    jest.spyOn(dashboardService, 'getMemberPolicies').mockReturnValue(of(mockPolicies));

    component.entityIdNo = 456;
    component.getMemberPolicies();

    expect(dashboardService.getMemberPolicies).toHaveBeenCalledWith(456);
    expect(component.memberPolicies).toEqual(mockPolicies);
  });

});