import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQuotationsComponent } from './list-quotations.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import {AppConfigService} from '../../../../../../core/config/app-config-service'
import {QuotationsService} from '../../../../../../features/gis/services/quotations/quotations.service'
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service'

import { MockAppConfigService } from '../../../setups/services/parameters/parameters.service.spec';
import { of } from 'rxjs';

describe('ListQuotationsComponent', () => {
  let component: ListQuotationsComponent;
  let fixture: ComponentFixture<ListQuotationsComponent>;
  let service: QuotationsService;
  let cdr: ChangeDetectorRef;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListQuotationsComponent],
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
    fixture = TestBed.createComponent(ListQuotationsComponent);
    service = TestBed.inject(QuotationsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set listFilter and call searchQuotations', () => {
    // Arrange
    const value = 'testFilter';
    const searchQuotationsSpy = jest.spyOn(component, 'searchQuotations');

    // Act
    component.listFilter = value;

    // Assert
    expect(component['_listFilter']).toBe(value); // Check if _listFilter was set correctly
    expect(searchQuotationsSpy).toHaveBeenCalledWith(value); // Check if searchQuotations was called with the correct value
  });
  it('should fetch quotations and update the component', () => {
    // Arrange
    const pageIndex = 1;
    const dateFrom = '2023-01-01';
    const dateTo = '2023-12-31';
    const accountCode = 123;
    const quotationsData = { /* mock quotations data here */ }as any;

    // Mock the getQuotations method of your service to return an observable with mock data
    jest.spyOn(service, 'getQuotations').mockReturnValue(of(quotationsData))as any;

    // Act
    component.getQuotationsByClientId(pageIndex, dateFrom, dateTo, accountCode);

    // Assert
    expect(service.getQuotations).toHaveBeenCalledWith(pageIndex, dateFrom, dateTo, accountCode);
    // expect(cdr.detectChanges).toHaveBeenCalled();
    expect(component.quotations).toEqual(quotationsData);
  });
  
});
