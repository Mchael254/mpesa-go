import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClaimsComponent } from './list-claims.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import {AppConfigService} from '../../../../../../core/config/app-config-service'
import {ViewClaimService} from '../../../../../../features/gis/services/claims/view-claim.service'
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service'
import { MockAppConfigService } from '../../../setups/services/parameters/parameters.service.spec';
import { of } from 'rxjs';
describe('ListClaimsComponent', () => {
  let component: ListClaimsComponent;
  let fixture: ComponentFixture<ListClaimsComponent>;
  let service: ViewClaimService;
  let cdr: ChangeDetectorRef;

  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListClaimsComponent],
      imports:[HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers:[
        { provide: AppConfigService, useClass: MockAppConfigService },
        GlobalMessagingService,
        MessageService,
      ]
    });
    fixture = TestBed.createComponent(ListClaimsComponent);
    service = TestBed.inject(ViewClaimService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set listFilter and call searchClaim', () => {
    // Arrange
    const value = 'testFilter';
    const searchClaimSpy = jest.spyOn(component, 'searchClaim');

    // Act
    component.listFilter = value;

    // Assert
    expect(component['_listFilter']).toBe(value); // Check if _listFilter was set correctly
    expect(searchClaimSpy).toHaveBeenCalledWith(value); // Check if searchClaim was called with the correct value
  });
  it('should fetch claims and update the component', () => {
    // Arrange
    const pageIndex = 1;
    const dateFrom = '2023-01-01';
    const dateTo = '2023-12-31';
    const accountCode = 123;
    const claimsData = { /* mock claims data here */ }as any;

    // Mock the getClaims method of your service to return an observable with mock data
    jest.spyOn(service, 'getClaims').mockReturnValue(of(claimsData)as any);

    // Act
    component.getClaimsByClientId(pageIndex, dateFrom, dateTo, accountCode);

    // Assert
    expect(service.getClaims).toHaveBeenCalledWith(pageIndex, dateFrom, dateTo, accountCode);
    // expect(cdr.detectChanges).toHaveBeenCalled();
    expect(component.claims).toEqual(claimsData);
  });
});
