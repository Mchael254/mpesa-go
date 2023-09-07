import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPoliciesComponent } from './list-policies.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import {AppConfigService} from '../../../../../../core/config/app-config-service'
import {PoliciesService} from '../../../../../../features/gis/services/policies/policies.service'
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service'
import { MockAppConfigService } from '../../../setups/services/parameters/parameters.service.spec';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('ListPoliciesComponent', () => {
  let component: ListPoliciesComponent;
  let fixture: ComponentFixture<ListPoliciesComponent>;
  let service: PoliciesService;
  let cdr: ChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPoliciesComponent],
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
    fixture = TestBed.createComponent(ListPoliciesComponent);
    service = TestBed.inject(PoliciesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set listFilter and call searchPolicies', () => {
    // Arrange
    const value = 'testFilter';
    const searchPoliciesSpy = jest.spyOn(component, 'searchPolicies');

    // Act
    component.listFilter = value;
    fixture.detectChanges();

    // Assert
    expect(component['_listFilter']).toBe(value); // Check if _listFilter was set correctly
    expect(searchPoliciesSpy).toHaveBeenCalledWith(value); // Check if searchPolicies was called with the correct value
  });
  
  it('should fetch policies and update the component', () => {
    // Arrange
    const pageIndex = 1;
    const dateFrom = '2023-01-01';
    const dateTo = '2023-12-31';
    const accountCode = 123;
    const policiesData = { /* mock policies data here */ }as any;

    // Mock the getPolicies method of your service to return an observable with mock data
    jest.spyOn(service, 'getPolicies').mockReturnValue(of(policiesData)as any);

    // Act
    component.getPoliciesByClientId(pageIndex, dateFrom, dateTo, accountCode);

    // Assert
    expect(service.getPolicies).toHaveBeenCalledWith(pageIndex, dateFrom, dateTo, accountCode);
    // expect(cdr.detectChanges).toHaveBeenCalled();
    expect(component.policies).toEqual(policiesData);
  });

});
