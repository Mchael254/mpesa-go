import { TestBed } from '@angular/core/testing';
import { AdminPolicyListingComponent } from './admin-policy-listing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { PoliciesListingDTO } from '../../../models/admin-policies';

const mockDashboardService = {
  getAdminPolicies: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('AdminPolicyListingComponent', () => {
  let component: AdminPolicyListingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPolicyListingComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminPolicyListingComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should populate breadCrumbItems correctly', () => {
    component.populateBreadCrumbItems();

    expect(component.breadCrumbItems).toEqual([
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Policies', url: '/home/lms/grp/dashboard/admin-policy-listing' },
    ]);
  });

  it('should set policiesListing correctly when getAdminPolicies is called', () => {
    const mockResponse = {
      count: 2,
      total_sum_assured: 500000,
      policies_list: [
        { policyCode: 1, policyName: 'Policy A' },
        { policyCode: 2, policyName: 'Policy B' },
      ] as unknown as PoliciesListingDTO[],
    };

    jest.spyOn(mockDashboardService, 'getAdminPolicies').mockReturnValue(of(mockResponse));

    component.getAdminPolicies();

    expect(component.policiesListing).toEqual(mockResponse.policies_list);
  });

  it('should navigate to the correct route in navigateToPolDets', () => {
    const mockPolicyCode = 123;

    component.investment = true;
    component.navigateToPolDets(mockPolicyCode);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/lms/grp/dashboard/investment'], {
      queryParams: { policyCode: mockPolicyCode },
    });

    component.investment = false;
    component.creditLife = true;
    component.navigateToPolDets(mockPolicyCode);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/lms/grp/dashboard/credit-life'], {
      queryParams: { policyCode: mockPolicyCode },
    });

    component.creditLife = false;
    component.navigateToPolDets(mockPolicyCode);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/lms/grp/dashboard/admin-policy-details'], {
      queryParams: { policyCode: mockPolicyCode },
    });
  });

  it('should return the correct status description for given status codes', () => {
    expect(component.getStatusDescription('A')).toBe('Active');
    expect(component.getStatusDescription('D')).toBe('Draft');
    expect(component.getStatusDescription('X')).toBe('Unknown');
  });
});
