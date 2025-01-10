import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPensionListingComponent } from './admin-pension-listing.component';
import { DashboardService } from '../../../services/dashboard.service';
import { GlobalMessagingService } from '../../../../../../../../shared/services/messaging/global-messaging.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Logger } from '../../../../../../../../shared/services';

const log = new Logger("AdminPensionListingComponent");

describe('AdminPensionListingComponent', () => {
  let component: AdminPensionListingComponent;
  let fixture: ComponentFixture<AdminPensionListingComponent>;
  let mockDashboardService: any;
  let mockRouter: any;
  let mockGlobalMessagingService: any;

  beforeEach(async () => {
    mockDashboardService = {
      getAdminPensionListing: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [AdminPensionListingComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPensionListingComponent);
    component = fixture.componentInstance;
  });

  // it('should initialize with the correct breadcrumb items and call getAdminPensionListing on ngOnInit', () => {
  //   const mockResponse = {
  //     count: 2,
  //     pension_list: [
  //       { policyCode: 1, policyName: 'Pension A' },
  //       { policyCode: 2, policyName: 'Pension B' },
  //     ],
  //   };

  //   mockDashboardService.getAdminPensionListing.mockReturnValue(of(mockResponse));

  //   const getAdminPensionListingSpy = jest.spyOn(component, 'getAdminPensionListing');

  //   component.ngOnInit();

  //   expect(component.breadCrumbItems).toEqual([
  //     { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
  //     { label: 'Pension', url: '/home/lms/grp/dashboard/admin-pension-listing' },
  //   ]);

  //   expect(getAdminPensionListingSpy).toHaveBeenCalled();
  //   expect(component.pensionList).toEqual(mockResponse.pension_list);
  // });

  it('should handle errors in getAdminPensionListing using GlobalMessagingService', () => {
    const mockError = new Error('Failed to fetch pensions');
    mockDashboardService.getAdminPensionListing.mockReturnValue(throwError(() => mockError));

    component.getAdminPensionListing();

    expect(mockDashboardService.getAdminPensionListing).toHaveBeenCalledWith(2422853);
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error fetching pension listing', mockError);
  });

  it('should return the correct status description for known and unknown codes', () => {
    expect(component.getStatusDescription('A')).toBe('Active');
    expect(component.getStatusDescription('D')).toBe('Draft');
    expect(component.getStatusDescription('X')).toBe('Unknown');
  });

  it('should navigate to the pension details page with correct query params', () => {
    const policyCode = 1;
    const policyNumber = '12345';

    component.navigateToPensionDets(policyCode, policyNumber);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/lms/grp/dashboard/admin-pension-summary'], {
      queryParams: { policyCode, policyNumber },
    });
  });
});
