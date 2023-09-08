import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeTransactionsComponent } from './view-employee-transactions.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {TicketsService} from "../../../services/tickets.service";
import {of} from "rxjs";
import {Router} from "@angular/router";

export class MockTicketsService {
  getAllTransactions = jest.fn().mockReturnValue(of());
  getSystems = jest.fn().mockReturnValue(of());
  dateSortEmployeesTransactions = jest.fn().mockReturnValue(of());
  getTicketModules = jest.fn().mockReturnValue(of());
  getBusinessTransactions = jest.fn().mockReturnValue(of());
}


describe('ViewEmployeeTransactionsComponent', () => {
  let component: ViewEmployeeTransactionsComponent;
  let fixture: ComponentFixture<ViewEmployeeTransactionsComponent>;
  let ticketsServiceStub : TicketsService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEmployeeTransactionsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TicketsService, useClass: MockTicketsService },
      ]
    });
    fixture = TestBed.createComponent(ViewEmployeeTransactionsComponent);
    component = fixture.componentInstance;
    ticketsServiceStub = TestBed.inject(TicketsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call get transactions', () => {
    const pageIndex = 1;
    const queryColumn = 'createdDate';
    const username = 'desc';
    const module = 'M'
    component.getAllTransactions(pageIndex, queryColumn, username, module);

    expect(ticketsServiceStub.getAllTransactions).toHaveBeenCalledWith(pageIndex, null, component.dateFrom,
      component.dateToday, username, module, queryColumn);
  });

  test('should fetch ticket modules', () => {

    component.getAllTicketModules();

    expect(ticketsServiceStub.getTicketModules).toHaveBeenCalled();
    expect(ticketsServiceStub.getTicketModules().subscribe((data) =>{
      component.ticketModules= data;
    })).toBeTruthy();
  });

  test('should fetch business transactions', () => {

    component.ngOnInit();

    expect(ticketsServiceStub.getBusinessTransactions).toHaveBeenCalled();
    expect(ticketsServiceStub.getBusinessTransactions().subscribe((data) =>{
      component.businessTransactions= data;
    })).toBeTruthy();
  });

  it('should navigate back to the expected route', () => {

    const expectedRoute = '/home/administration/employees/';
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith([expectedRoute]);
  });

  it('should sort employee transactions', () => {
    // Arrange: Define test data
    const sortValues = {
      fromDate: '2023-01-01',
      toDate: '2023-02-01',
      amount: 100,
      module: 'A',
      system: 'B',
      transactionType: 'C',
      filterColumn: 'W'
    };

    // Mock the service response
    const expectedTransactions = [component.page, component.pageSize, sortValues.fromDate, sortValues.toDate, component.username, sortValues.module,
      sortValues.amount, sortValues.filterColumn, sortValues.transactionType];
    // ticketsServiceStub.dateSortEmployeesTransactions = jest.fn(() => of(expectedTransactions));

    // Act: Call the sortEmployeeTransactions method
    component.sortEmployeeTransactions();

    // Assert: Check if the transactions property is correctly populated
    expect(ticketsServiceStub.dateSortEmployeesTransactions).toEqual(expectedTransactions);

  });
});
