import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminClaimsListingComponent } from './admin-claims-listing.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { Logger } from '../../../../../../../../shared/services';
import { ClaimsListingDTO } from '../../../models/admin-policies';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminClaimsListingComponent', () => {
  let component: AdminClaimsListingComponent;
  let fixture: ComponentFixture<AdminClaimsListingComponent>;
  let mockRouter: Partial<Router>;
  let mockDashboardService: Partial<DashboardService>;

  const clientCode = 2422853;
  const claimsListingMock: ClaimsListingDTO[] = [
    {
      claim_number: 'C001',
      policy_code: 765865,
      product_desc: 'GLA',
      member_number: '786',
      member_name: 'James Olchore',
      clm_paid_amount: 60000,
      clm_amt_claimed: 58000,
      clm_amt_to_pay: 0
    }
  ];

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    };

    mockDashboardService = {
      getClaimsListing: jest.fn().mockReturnValue(of(claimsListingMock)),
    };

    await TestBed.configureTestingModule({
      declarations: [AdminClaimsListingComponent],
      imports: [
              HttpClientTestingModule,
              TranslateModule.forRoot(),
            ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DashboardService, useValue: mockDashboardService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminClaimsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should populate breadcrumb items correctly', () => {
    component.populateBreadCrumbItems();
    expect(component.breadCrumbItems).toEqual([
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Claims', url: '/home/lms/grp/dashboard/admin-claims-listing' },
    ]);
  });

  test('should initialize column options and selected columns correctly', () => {
    component.policyListingColumns();
    expect(component.columnOptions).toEqual([
      { label: 'Product', value: 'product' },
      { label: 'Claim number', value: 'claim_number' },
      { label: 'Member', value: 'member' },
      { label: 'Member number', value: 'mem_no' },
      { label: 'Claim amount', value: 'claim_amnt' },
    ]);
    expect(component.selectedColumns).toEqual([
      'product',
      'claim_number',
      'member',
      'mem_no',
      'claim_amnt',
    ]);
  });

  test('should fetch claims listing', () => {
    component.getClaimsListing();

    expect(mockDashboardService.getClaimsListing).toHaveBeenCalledWith(clientCode);
    expect(component.claimListing).toEqual(claimsListingMock);
  });
});
