import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListServiceProviderComponent } from './list-service-provider.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { AppConfigService } from '../../../../../core/config/app-config-service';
import { of } from 'rxjs';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { TableLazyLoadEvent } from 'primeng/table';
import { ChangeDetectorRef } from '@angular/core';
import { TableDetail } from '../../../../../shared/data/table-detail';

export class MockServiceProviderService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById= jest.fn().mockReturnValue(of());
  saveServiceProvider = jest.fn();
}

describe('ListServiceProviderComponent', () => {
  let component: ListServiceProviderComponent;
  let fixture: ComponentFixture<ListServiceProviderComponent>;
  let serviceProviderServiceStub: ServiceProviderService;
  let cdrMock:any
  const spinnerServiceMock = {
    show: jest.fn(),
    hide: jest.fn(),
  };
  beforeEach(() => {
    cdrMock = {
      detectChanges: jest.fn(),
    };
    TestBed.configureTestingModule({
      declarations: [ListServiceProviderComponent],
      imports:[
        HttpClientTestingModule
      ],
      providers:[
        {provide: AppConfigService, useValue: {config:{contextPath: { 
          accounts_services: "crm",
          users_services: "user",
          auth_services: "oauth",
          setup_services: 'crm' } }}
        },
        { provide: ServiceProviderService},
        { provide: NgxSpinnerService, useValue: spinnerServiceMock },
        { provide: ChangeDetectorRef}
      ]
    });

    fixture = TestBed.createComponent(ListServiceProviderComponent);
    component = fixture.componentInstance;
    serviceProviderServiceStub = TestBed.inject(ServiceProviderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize tableDetails and show spinner on ngOnInit', () => {
    const expectedTableDetails = {
      cols: component.cols,
      rows: component.ServiceProviderDetails?.content,
      globalFilterFields: component.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true,
    };

    component.ngOnInit();

    expect(component.tableDetails).toEqual(expectedTableDetails);
    expect(spinnerServiceMock.show).toHaveBeenCalled();
  });
  

  it('should call getServiceProviders with expected arguments', () => {
    const pageIndex = 0;
    const sortField = 'createdDate';
    const sortOrder = 'desc';

  
    jest.spyOn(serviceProviderServiceStub, 'getServiceProviders').mockReturnValue(of());
    component.getServiceProviders(pageIndex, sortField, sortOrder).subscribe(() => {
      expect(serviceProviderServiceStub.getServiceProviders).toHaveBeenCalledWith(
        pageIndex,
        component.pageSize,
        sortField,
        sortOrder
      );
    });
  });
  it('should load service providers and update properties', async () => {
    const mockEvent: LazyLoadEvent = {
      first: 0,
      rows: component.pageSize,
      sortField: 'createdDate',
      sortOrder: 1,
    };

    // Mock the response from the getServiceProviders method
    const mockResponse: TableDetail = {
      cols: [
        { field: 'name', header: 'Name' },
        { field: 'category', header: 'Category' },
        { field: 'spEntityType', header: 'Entity Type' },
        { field: 'modeOfIdentity', header: 'Primary ID Type' },
        { field: 'pinNumber', header: 'ID Number' },
      ],
      rows: [
        {
          name: 'John Doe',
          category: 'Category A',
          spEntityType: 'Entity Type 1',
          modeOfIdentity: 'ID Type X',
          pinNumber: '12345',
        },
        {
          name: 'Jane Smith',
          category: 'Category B',
          spEntityType: 'Entity Type 2',
          modeOfIdentity: 'ID Type Y',
          pinNumber: '54321',
        },
      ],
      rowsPerPage: component.pageSize,
      globalFilterFields: component.globalFilterFields,
      showFilter: false,
      showSorting: true,
      showSearch: false, // Add this property if needed
      title: 'Table Title', // Add a title if needed
      paginator: true,
      url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true,
      totalElements: 10, // Total number of elements in the pagination
      showCustomModalOnView: false, // Add this property if needed
      noDataFoundMessage: 'No data found', // Add a custom message for no data
    };
    
    
    
    
    
    
    
    jest.spyOn(serviceProviderServiceStub, 'getServiceProviders').mockReturnValue(of());

    await component.lazyLoadServiceProviders(mockEvent);

 

    // expect(component.ServiceProviderDetails).toEqual(mockResponse);
    expect(component.tableDetails.rows).toEqual(mockResponse.rows);
    expect(component.tableDetails.totalElements).toEqual(mockResponse.totalElements);
    expect(cdrMock.detectChanges).toHaveBeenCalled();
    expect(spinnerServiceMock.hide).toHaveBeenCalled();
  });


});
