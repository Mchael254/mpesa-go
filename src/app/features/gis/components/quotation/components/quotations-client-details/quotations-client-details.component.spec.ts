import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsClientDetailsComponent } from './quotations-client-details.component';
import { ClientService } from '../../../../../entities/services/client/client.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { of } from 'rxjs';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { BankService } from '../../../../../../shared/services/setups/bank/bank.service';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}
describe('QuotationsClientDetailsComponent', () => {
  let component: QuotationsClientDetailsComponent;
  let fixture: ComponentFixture<QuotationsClientDetailsComponent>;
  let clientService: ClientService;
  let countryService: CountryService; 
  let bankService: BankService; 
  let branchService: BranchService; 
  let currencyService: CurrencyService; 
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationsClientDetailsComponent],
      providers: [
        ClientService,
        { provide: AppConfigService, useClass: MockAppConfigService },
        CountryService,
        BankService,
        BranchService,
        CurrencyService
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });
    fixture = TestBed.createComponent(QuotationsClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    clientService = TestBed.inject(ClientService);
    countryService = TestBed.inject(CountryService);
    bankService = TestBed.inject(BankService);
    branchService = TestBed.inject(BranchService);
    currencyService = TestBed.inject(CurrencyService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set clientType when getClientType is called', () => {
    const clientTypeData:any = {
      category: 'Some Category',
      clientTypeName: 'Client Type Name',
      code: 123,
      description: 'Description of the client type',
      organizationId: 456,
      person: 'Some Person',
      type: 'Some Type',
     };
    jest.spyOn(clientService, 'getClientType').mockReturnValue(of(clientTypeData));

    component.getClientType();

    expect(component.clientType).toEqual(clientTypeData);
  });
  it('should set identifierType when getIdentifierType is called', () => {
    const identifierTypeData:any = [];
    jest.spyOn(clientService, 'getIdentityType').mockReturnValue(of(identifierTypeData));

    component.getIdentifierType();

    expect(component.identifierType).toEqual(identifierTypeData);
  });
  it('should set country when getCountry is called', () => {
    const countryData:any = [];
    jest.spyOn(countryService, 'getCountries').mockReturnValue(of(countryData));

    component.getCountry();

    expect(component.country).toEqual(countryData);
  });
  it('should set county when getCounty is called', () => {
    const selectedValue = 'SomeValue';
    const countyData:any = [];
    const event = { target: { value: selectedValue } };
    jest.spyOn(countryService, 'getMainCityStatesByCountry').mockReturnValue(of(countyData));

    component.getCounty(event);

    expect(component.selected).toEqual(selectedValue);
    expect(component.county).toEqual(countyData);
  });

  it('should set town when getTown is called', () => {
    const selectedValue = 'SomeValue';
    const townData:any = [];
    const event = { target: { value: selectedValue } };
    jest.spyOn(countryService, 'getTownsByMainCityState').mockReturnValue(of(townData));

    component.getTown(event);

    expect(component.selected).toEqual(selectedValue);
    expect(component.town).toEqual(townData);
  });

  it('should set bank when getBank is called', () => {
    const selectedValue = 'SomeValue';
    const bankData:any = [];
    const event = { target: { value: selectedValue } };
    jest.spyOn(bankService, 'getBanks').mockReturnValue(of(bankData));

    component.getBank(event);

    expect(component.selected).toEqual(selectedValue);
    expect(component.bank).toEqual(bankData);
  });

  it('should set branch when getbranch is called', () => {
    const branchData:any = [];
    jest.spyOn(branchService, 'getBranches').mockReturnValue(of(branchData));

    component.getbranch();

    expect(component.branch).toEqual(branchData);
  });

  it('should set currency when getCurrency is called', () => {
    const currencyData:any = [];
    jest.spyOn(currencyService, 'getAllCurrencies').mockReturnValue(of(currencyData));

    component.getCurrency();

    expect(component.currency).toEqual(currencyData);
  });
  it('should set client and clientList when getClient is called', () => {
    const clientData:any = [];
    jest.spyOn(clientService, 'getClients').mockReturnValue(of(clientData));

    component.getClient();

    expect(component.client).toEqual(clientData);
    expect(component.clientList).toEqual(clientData.content);
  });

  it('should set clientDetails when getClientDetails is called', () => {
    const clientId = 123; 
    const clientDetailsData:any = { };
    jest.spyOn(clientService, 'getClientById').mockReturnValue(of(clientDetailsData));
   

    component.getClientDetails(clientId);

    expect(component.clientDetails).toEqual(clientDetailsData);

  });

});
