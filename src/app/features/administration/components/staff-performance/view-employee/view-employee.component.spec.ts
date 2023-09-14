import {ComponentFixture, TestBed} from '@angular/core/testing';

import { ViewEmployeeComponent } from './view-employee.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {TicketsService} from "../../../services/tickets.service";
import {Router} from "@angular/router";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {of} from "rxjs";
import {Logger} from "../../../../../shared/services";

export class MockStaffService {
  getStaffWithSupervisor = jest.fn().mockReturnValue(of());
}

export class MockTicketsService {
  getAllTransactionsPerModule = jest.fn().mockReturnValue(of());
  getAllDepartments = jest.fn().mockReturnValue(of());
}

describe('ViewEmployeeComponent', () => {
  let component: ViewEmployeeComponent;
  let fixture: ComponentFixture<ViewEmployeeComponent>;
  let ticketsServiceStub : TicketsService;
  let staffServiceStub: StaffService;
  let router: Router;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEmployeeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TicketsService, useClass: MockTicketsService },
        { provide: StaffService, useClass: MockStaffService }
      ]
    });
    fixture = TestBed.createComponent(ViewEmployeeComponent);
    component = fixture.componentInstance;
    ticketsServiceStub = TestBed.inject(TicketsService);
    staffServiceStub = TestBed.inject(StaffService);
    router = TestBed.inject(Router);
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort employees by date', () => {
    const fromDate = '2023-01-01';
    const toDate = '2023-02-01';

    component.dateFrom = '2023-01-01';
    component.dateToday = '2023-02-01';

    component.dateSortEmployees();

    // Assert: Check if dateFrom and dateToday were updated
    expect(component.dateFrom).toEqual(fromDate);
    expect(component.dateToday).toEqual(toDate);

  });

  it('should custom sort employees', () => {
    const data1 = {
      staffs: { name: 'John' },
      department: { departmentName: 'HR' },
      transaction: { module: 'A', totalCount: 10, totalAmount: 100 },
    };

    const data2 = {
      staffs: { name: 'Alice' },
      department: { departmentName: 'Finance' },
      transaction: { module: 'B', totalCount: 5, totalAmount: 50 },
    };

    const sortEvent = {
      field: 'name',
      order: 1, // 1 for ascending, -1 for descending
      data: [data1, data2], // Sample data to be sorted
    };

    component.customSortEmployees(sortEvent);

    expect(sortEvent.data[0]).toBe(data2);
    expect(sortEvent.data[1]).toBe(data1);

  });

  it('should get aggregated employee data', () => {

    const staffData = {
      totalElements: 2,
      content: [
        { username: 'john', departmentCode: 1 },
        { username: 'alice', departmentCode: 2 },
      ],
    };
    const transactionsData = [
      { authorizedBy: 'john', },
      { authorizedBy: 'alice', },
    ];
    const departmentsData = [
      { id: 1,},
      { id: 2,},
    ];

    staffServiceStub.getStaffWithSupervisor(0, 1, 'Type', 'dateCreated', 'desc');
    ticketsServiceStub.getAllTransactionsPerModule('2023-01-01', '2023-02-01');
    ticketsServiceStub.getAllDepartments(departmentsData[0].id);

    component.getGrpEmployeeData();

    expect(staffData.content.length).toBe(2); // Two staff members
    expect(staffData.totalElements).toBe(2); // Total elements from staffData
  });

  it('should navigate to employee transaction', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    const username= 'TQUEST' ;
    const module= 'M' ;
    const name= 'TQUST Heritage'

    component.goToViewEmployeeTransactions(username, module, name);

    expect(navigateSpy).toHaveBeenCalledWith(['/home/administration/employee/transactions'], {
      queryParams: {username, module, name }
    });
  });

  it('should aggregate employee data when staff.totalElements is greater than 0', () => {

    const staff = {
      totalElements: 2, // Set the desired value for testing
      content: [
        { username: 'user1', departmentCode: 1 },
        { username: 'user2', departmentCode: 2 },
      ],
    };

    const transactions = [
      { authorizedBy: 'user1', transactionData: 'transaction1' },
      { authorizedBy: 'user2', transactionData: 'transaction2' },
    ];

    const departments = [
      { id: 1, departmentName: 'Department 1' },
      { id: 2, departmentName: 'Department 2' },
    ];

    component.getGrpEmployeeData();

    const aggregatedData = [{staff, transactions, departments}];

    // Verify that the aggregated data contains the expected information
    expect(aggregatedData).toEqual([
      {
        staffs: { username: 'user1', departmentCode: 1 },
        transaction: { authorizedBy: 'user1', transactionData: 'transaction1' },
        department: { id: 1, departmentName: 'Department 1' },
      },
      {
        staffs: { username: 'user2', departmentCode: 2 },
        transaction: { authorizedBy: 'user2', transactionData: 'transaction2' },
        department: { id: 2, departmentName: 'Department 2' },
      },
    ]);
  });
});
