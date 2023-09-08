import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientComponent } from './list-client.component';
import {Router} from "@angular/router";
import {ClientService} from "../../../services/client/client.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {of} from "rxjs";
import {LazyLoadEvent} from "primeng/api";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {
  DynamicBreadcrumbComponent
} from "../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {DynamicTableComponent} from "../../../../../shared/components/dynamic-table/dynamic-table.component";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {ClientDTO} from "../../../data/ClientDTO";


export class MockClientService {
  getClients = jest.fn().mockReturnValue(of());
}
describe('ListClientComponent', () => {
  let component: ListClientComponent;
  let fixture: ComponentFixture<ListClientComponent>;
  let routeStub: Router;
  let clientsServiceStub: ClientService;
  let appConfigService: AppConfigService;
  let spinnerStub: NgxSpinnerService;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        ListClientComponent,
        DynamicBreadcrumbComponent,
        DynamicTableComponent],
      imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          NgxSpinnerModule.forRoot(),
      ],
      providers: [
          { provide: ClientService, useClass: MockClientService},
          { provide: AppConfigService}
      ]
    });
    fixture = TestBed.createComponent(ListClientComponent);
    component = fixture.componentInstance;
    clientsServiceStub = TestBed.inject(ClientService);
    appConfigService = TestBed.inject(AppConfigService);
    routeStub = TestBed.inject(Router);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should route to create new entity', () =>{
    jest.spyOn(routeStub,'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#btn-new-client');
    button.click();
    expect(component.gotoEntityPage.call).toBeTruthy();
  });

  test('should call getClients with correct arguments', () => {
    const pageIndex = 1;
    const sortField = 'createdDate';
    const sortOrder = 'desc';

    component.getClients(pageIndex, sortField, sortOrder);
    expect(clientsServiceStub.getClients).toHaveBeenCalledWith(pageIndex, component.pageSize, sortField, sortOrder);

  });

  it('should load clients in descending order', () => {
    const event: LazyLoadEvent = {
      first: 0,
      rows: 10,
      sortField: 'clientName',
      sortOrder: 1, // 'asc'
    };
    component.ngOnInit();

    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');
    // spyOn(clientsServiceStub, 'getClients').and.returnValue(of({}));


    component.lazyLoadClients(event);

    expect(clientsServiceStub.getClients).toHaveBeenCalledWith(0, component.pageSize, event.sortField, 'desc');
    expect(component.tableDetails.rows).toEqual(component.clientsData.content);
    // expect(hideSpinnerSpy).toHaveBeenCalled();
  });

  it('should fetch clients and set client properties', () => {

    const clientsData: {} = {
      firstName: 'John',
      lastName: 'Doe',
      clientType: {
        clientTypeName: 'Client',
      },
    }
    const sampleData: Pagination<ClientDTO> = {
      first: true, last: true, number: 1, numberOfElements: 1, size: 5, totalPages: 1,
      content: [clientsData[0]],
      totalElements: 1
    };

    const getClientsSpy = jest.spyOn(clientsServiceStub, 'getClients');
    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');

    component.getClients(0, 'sortField', 'asc');

    expect(getClientsSpy).toHaveBeenCalledWith(0, component.pageSize, 'sortField', 'asc');
    expect(component.clientsData).toEqual(sampleData);
    expect(component.tableDetails.rows).toEqual(sampleData.content);
    expect(component.tableDetails.totalElements).toBe(sampleData.totalElements);
    expect(hideSpinnerSpy).toHaveBeenCalled();
    // expect(component.cdr.detectChanges).toHaveBeenCalled(); // Ensure change detection is called
  });
});
