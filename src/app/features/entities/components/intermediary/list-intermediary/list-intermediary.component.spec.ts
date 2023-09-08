import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIntermediaryComponent } from './list-intermediary.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {of} from "rxjs";
import {
  DynamicBreadcrumbComponent
} from "../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {DynamicTableComponent} from "../../../../../shared/components/dynamic-table/dynamic-table.component";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {LazyLoadEvent} from "primeng/api";


export class MockIntermediaryService {
  getAgents = jest.fn().mockReturnValue(of());
}
describe('ListIntermediaryComponent', () => {
  let component: ListIntermediaryComponent;
  let fixture: ComponentFixture<ListIntermediaryComponent>;
  let routeStub: Router;
  let intermediaryServiceStub: IntermediaryService;
  let spinnerStub: NgxSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListIntermediaryComponent,
        DynamicBreadcrumbComponent,
        DynamicTableComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxSpinnerModule.forRoot(),
      ],
      providers: [
        { provide: IntermediaryService, useClass: MockIntermediaryService},
        { provide: AppConfigService}
      ]
    });
    fixture = TestBed.createComponent(ListIntermediaryComponent);
    component = fixture.componentInstance;
    intermediaryServiceStub = TestBed.inject(IntermediaryService);
    routeStub = TestBed.inject(Router);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call getAgents with correct arguments', () => {
    const pageIndex = 1;
    const sortField = 'createdDate';
    const sortOrder = 'desc';

    component.getAgents(pageIndex, sortField, sortOrder);

    expect(intermediaryServiceStub.getAgents).toHaveBeenCalledWith(pageIndex, component.pageSize, sortField, sortOrder);
  });

  test('should route to create new entity', () =>{
    jest.spyOn(routeStub,'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#newIntermediaryButton');
    button.click();
    expect(component.gotoEntityPage.call).toBeTruthy();
  });

  it('should load agents in descending order', () => {
    const event: LazyLoadEvent = {
      first: 0,
      rows: 10,
      sortField: 'clientName',
      sortOrder: 1, // 'asc'
    };
    component.ngOnInit();

    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');
    // spyOn(clientsServiceStub, 'getClients').and.returnValue(of({}));


    component.lazyLoadAgents(event);

    expect(intermediaryServiceStub.getAgents).toHaveBeenCalledWith(0, component.pageSize, event.sortField, 'desc');
    expect(component.tableDetails.rows).toEqual(component.intermediaries.content);
    expect(hideSpinnerSpy).toHaveBeenCalled();
  });

 /* it('should search intermediaries and update the component property', () => {
    // Arrange: Define sample data for the service response
    const searchData = any;

    // Mock the service method to return the sample data
    intermediaryServiceStub.searchAgent.and.returnValue(of(searchData));

    // Act: Call the searchIntermediary method
    const searchName = 'John Doe'; // Replace with a sample name
    component.searchIntermediary(searchName);

    // Assert: Check if the component's property is correctly updated based on the sample data
    expect(component.intermediaries).toEqual(searchData);
    // Additional assertions based on your component's behavior
  });*/
});
