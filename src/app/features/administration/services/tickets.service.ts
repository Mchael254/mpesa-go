import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {SystemsDto} from "../../../shared/data/common/systemsDto";
import {Pagination} from "../../../shared/data/common/pagination";
import {DepartmentDto} from "../../../shared/data/common/departmentDto";
import {
  BusinessTransactionsDTO,
  NewTicketDto, TicketCountDTO,
  TicketModuleDTO,
  TicketReassignDto,
  TicketsDTO,
  TicketTypesDTO, TransactionsCountDTO, TransactionsDTO,
  TransactionsRoutingDTO
} from "../data/ticketsDTO";
import {AuthService} from "../../../shared/services/auth.service";
import {AppConfigService} from "../../../core/config/app-config-service";
import {GeneralTicketApiResponse} from "../data/generalTicketApiResponse";
import {Logger} from "../../../shared/services/logger/logger.service";
import {UtilService} from "../../../shared/services/util/util.service";

const log = new Logger('TicketsService');


@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  // private ticketsDetail$ = new BehaviorSubject<TicketsDTO[]>([]);
  private ticketsDetail$ = new BehaviorSubject<NewTicketDto[]>([]);
  private selectedTicket: TicketsDTO | null = null;

  currentTicket$ = this.ticketsDetail$.asObservable();
  currentTicketDetail = signal<NewTicketDto>({});

  setSelectedTicket(ticket: TicketsDTO) {
    this.selectedTicket = ticket;
  }

  getSelectedTicket(): TicketsDTO | null {
    return this.selectedTicket;
  }

  // private tickets: TicketsDTO[] = [];


  baseUrl = this.appConfig.config.contextPath.ticket_services;
  baseUrlAcc = this.appConfig.config.contextPath.accounts_services;
  baseUrlGis = this.appConfig.config.contextPath.gis_services;
  private transanctionsRouting$ = new BehaviorSubject<TransactionsRoutingDTO>({
    username: null,
    module: null,
    name: null
})
  transanctionsRoutingData$ = this.transanctionsRouting$.asObservable();

  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
    private authService: AuthService,
    private utilService: UtilService
  ) { }

  setTransactionsRoutingData(transactionsRouting: TransactionsRoutingDTO){
    this.transanctionsRouting$.next(transactionsRouting);
  }
  setCurrentTickets(ticketsDetail: NewTicketDto[]) {
  this.ticketsDetail$.next(ticketsDetail);
}

  // setTickets(tickets: TicketsDTO[]) {
  //   this.tickets = tickets;
  // }

  // getTickets(): TicketsDTO[] {
  //   return this.tickets;
  // }

  getTicketModules(): Observable<TicketModuleDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<TicketModuleDTO[]>(`/${this.baseUrl}/workflow/api/v1/ticket-modules`,{headers:headers});
  }

  getTicketTypes(): Observable<TicketTypesDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<TicketTypesDTO[]>(`/${this.baseUrl}/workflow/api/v1/ticket-types`,{headers:headers});
  }

  getSystems(): Observable<SystemsDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);

    return this.http.get<SystemsDto[]>(`/${this.baseUrlAcc}/setups/systems`,
      {
        headers:headers,
        params: params
      });
  }

  // get all tickets for the logged in user
  getAllTickets(
    pageNo: number = 0,
    pageSize: number = 5,
    fromDate: string,
    toDate: string,
    sort: string,
    module: string,
    queryColumn: string,
  ): Observable<Pagination<TicketsDTO>> {

    const assignee = this.authService.getCurrentUserName()

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    // const params = new HttpParams()
    //   .set('pageNo', `${pageNo}`)
    //   .set('pageSize', `${pageSize}`)
    //   .set('assignee', `${assignee}`)
    //   .set('query', `${query}`)
    //   // .set('queryColumn', `${queryColumn}`)

    // let queryparamObject = this.utilService.removeNullValuesFromQueryParams(params);

    let params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
      .set('assignee', `${assignee}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)
      .set('sort', `${sort}`)
      .set('module', `${module}`)
      .set('queryColumn', `${queryColumn}`)

    // Call the removeNullValuesFromQueryParams method from the UtilsService
    params = new HttpParams({ fromObject: this.utilService.removeNullValuesFromQueryParams(params) });

    return this.http.get<Pagination<TicketsDTO>>(`/${this.baseUrl}/workflow/api/v1/tickets`,
      {
        headers: headers,
        params: params,
      });
  }

  reassignTickets(ticketsToReassign: TicketReassignDto[]): Observable<GeneralTicketApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const ticketsData = JSON.stringify(ticketsToReassign);
    return this.http.post<GeneralTicketApiResponse>(`/${this.baseUrl}/workflow/api/v1/tickets`, ticketsData, { headers })
  }

  authorizeTicket(data: any, username: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const params = new HttpParams()
      .set('username', `${username}`);

    return this.http.post<any>(`/${this.baseUrl}/workflow/api/v1/tickets/authorize/`, data,
      {
        headers: headers,
        params: params,
      });

  }

  // get ticket count per module for the logged in user
  getTicketCount(): Observable<TicketCountDTO[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const assignee = this.authService.getCurrentUserName();
    const params = new HttpParams()
      .set('assignee', `${assignee}`)

    return this.http.get<TicketCountDTO[]>(`/${this.baseUrl}/workflow/api/v1/tickets/count-per-module`,
      {
        headers: headers,
        params: params,
      });
  }

  // get all transactions for a supervisor
  getAllTransactions(
    pageNo: number = 0,
    pageSize: number,
    fromDate: string,
    toDate: string,
    doneBy: string,
    module: string,
    sortColumn: string = 'doneBy'
  ): Observable<TransactionsDTO[]> {

    const loggedInUser = this.authService.getCurrentUser();
    let id:number;
    if (this.utilService.isUserAdmin(loggedInUser)) {
      id = loggedInUser.id;

    }
    const supervisor = id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
      .set('fromDate', `${fromDate}`)
      .set('supervisor', `${supervisor}`)
      .set('toDate', `${toDate}`)
      .set('doneBy', `${doneBy}`)
      .set('module', `${module}`)
      .set('sortColumn', `${sortColumn}`)

    let queryparamObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<TransactionsDTO[]>(`/${this.baseUrl}/workflow/api/v1/tickets/manager-report`,
      {
        headers: headers,
        params: queryparamObject,
      });
  }

  // get all transactions aggregate per module
  getAllTransactionsPerModule(
    // authorizedBy: string = 'AKANYIRU',
    fromDate: string,
    toDate: string,
  ): Observable<TransactionsCountDTO[]> {

    const loggedInUser = this.authService.getCurrentUser();
    let id:number;
    if (this.utilService.isUserAdmin(loggedInUser)) {
      id = loggedInUser.id;

    }
    const supervisor = id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('fromDate', `${fromDate}`)
      .set('supervisor', `${supervisor}`)
      .set('toDate', `${toDate}`)


    let queryparamObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<TransactionsCountDTO[]>(`/${this.baseUrl}/workflow/api/v1/gis-transactions/count-per-module`,
      {
        headers: headers,
        params: queryparamObject,
      });
  }

  // get all departments
  getAllDepartments(
    organizationId : number = 2
  ): Observable<DepartmentDto[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`)

    return this.http.get<DepartmentDto[]>(`/${this.baseUrlAcc}/setups/departments`,
      {
        headers: headers,
        params: params,
      });
  }

  /*dateSortEmployees(
    fromDate: string,
    toDate: string
  ): Observable<Pagination<StaffDto>> {

    const loggedInUser = this.authService.getCurrentUser();
    let id:number;
    if (this.utilService.isUserAdmin(loggedInUser)) {
      id = loggedInUser.id;

    }
    const supervisor = id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)
      .set('supervisor', `${supervisor}`)

    let queryparamObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<Pagination<StaffDto>>(`/${this.baseUrl}/workflow/api/v1/gis-transactions/count-per-module`,
      {
        headers: headers,
        params: queryparamObject,
      });
  }*/

  dateSortEmployeesTransactions(
    pageNo: number,
    pageSize: number,
    fromDate: string,
    toDate: string,
    doneBy: string,
    module: string,
    amount: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<TransactionsDTO[]> {

    const loggedInUser = this.authService.getCurrentUser();
    let id:number;
    if (this.utilService.isUserAdmin(loggedInUser)) {
      id = loggedInUser.id;

    }
    const supervisor = id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)
      .set('supervisor', `${supervisor}`)
      .set('doneBy', `${doneBy}`)
      .set('module', `${module}`)
      .set('amount', `${amount}`)
      .set('filterColumn', `${filterColumn}`)
      .set('filterQuery', `${filterQuery}`)

    let queryparamObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<TransactionsDTO[]>(`/${this.baseUrl}/workflow/api/v1/tickets/manager-report`,
      {
        headers: headers,
        params: queryparamObject,
      });
  }

  sortTickets(
    pageNo: number = 0,
    pageSize: number = 5,
    fromDate: string,
    toDate: string,
    type: string,
    module: string,

  ): Observable<Pagination<TicketsDTO>> {

    const assignee = this.authService.getCurrentUserName()

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    let params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
      .set('assignee', `${assignee}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)
      .set('type', `${type}`)
      .set('module', `${module}`)

    // Call the removeNullValuesFromQueryParams method from the UtilsService
    params = new HttpParams({ fromObject: this.utilService.removeNullValuesFromQueryParams(params) });

    return this.http.get<Pagination<TicketsDTO>>(`/${this.baseUrl}/workflow/api/v1/tickets`,
      {
        headers: headers,
        params: params,
      });
  }

  getBusinessTransactions(): Observable<BusinessTransactionsDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<BusinessTransactionsDTO[]>(`/${this.baseUrlGis}/setups/api/v1/business-transactions`,
      {
        headers:headers
      });
  }

  getClaims(claimNo: string): Observable<any[]>{
    const  baseUrl = this.appConfig.config.contextPath.gis_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)

    return this.http.get<any[]>(`/${baseUrl}/claims/api/v1/claims/view`,
      {
        headers: headers,
        params: params,
      });

  }
  getAllClaims(): Observable<any[]>{
    const  baseUrl = this.appConfig.config.contextPath.gis_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    return this.http.get<any[]>(`/${baseUrl}/claims/api/v1/claims/view`,
      {
        headers: headers,
      });

  }

  getUnderWriting(batchNo: string) {
    const  baseUrl = this.appConfig.config.contextPath.gis_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    return this.http.get<any[]>(`/${baseUrl}/underwriting/api/v1/policies/` + batchNo, {headers: headers});
   }

  getQuotation(quotationNo: string) {
    const  baseUrl = this.appConfig.config.contextPath.gis_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    const params = new HttpParams()
      .set('quotationNo', `${quotationNo}`)

    return this.http.get<any[]>(`/${baseUrl}/quotation/api/v1/quotations/view`,
      {
        headers: headers,
        params: params,
      });
  }

  getPolicyDetails(batchNumber: number): Observable<any> {
    const  baseUrl = this.appConfig.config.contextPath.gis_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.get<any>(`/${baseUrl}/underwriting/api/v1/policies/${batchNumber}`, { headers })
  }

  getTransactionTypes(): Observable<any> {
    const  baseUrl = this.appConfig.config.contextPath.gis_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.get<any>(`/${baseUrl}/setups/api/v1/transaction-types?pageNo=0&pageSize=50`, { headers })
  }

}
