import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsComponent } from './personal-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import { of } from 'rxjs/internal/observable/of';
import { BranchService } from '../../../../../../../shared/services/setups/branch/branch.service';
import { ClientTypeService } from '../../../../../../../shared/services/setups/client-type/client-type.service';
import { ClientService } from '../../../../../../../features/entities/services/client/client.service';
import { PartyService } from '../../../../../../../features/lms/service/party/party.service';
import { RelationTypesService } from '../../../../../../../features/lms/service/relation-types/relation-types.service';
import { BankService } from '../../../../../../../shared/services/setups/bank/bank.service';
import { CurrencyService } from '../../../../../../../shared/services/setups/currency/currency.service';
import { OccupationService } from '../../../../../../../shared/services/setups/occupation/occupation.service';
import { SectorService } from '../../../../../../../shared/services/setups/sector/sector.service';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicBreadcrumbComponent } from '../../../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { StepperComponent } from '../../../../../../../shared/components/stepper/stepper.component';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ClientDTO } from '../../../../../../../features/entities/data/ClientDTO';
import { CountryDto } from '../../../../../../../shared/data/common/countryDto';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of([]));
  getMainCityStatesByCountry = jest.fn((countryId) => {
    return [];
  });
  getTownsByMainCityState = jest.fn((stateId) => {
    return [];
  });
}
export class MockBranchService {
  getBranches = jest.fn().mockReturnValue(of([]));
}

export class MockRelationTypeService {
  getRelationTypes = jest.fn().mockReturnValue(of([]));
}
export class MockSectorService {
  getSectors = jest.fn().mockReturnValue(of([]));
}

export class MockOccupationService {
  getOccupations = jest.fn().mockReturnValue(of([]));
}

export class MockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of([]));
}

export class MockBankService {
  getBanks = jest.fn().mockReturnValue(of([]));
  getBankBranch = jest.fn().mockReturnValue(of([]));
}

export class MockPartyService {
  getListOfBeneficariesByQuotationCode = jest.fn().mockReturnValue(of([]));
  getAllBeneficiaryTypes = jest.fn().mockReturnValue(of([]));
}
export class MockClientTypeService {
  getClientTypes = jest.fn().mockReturnValue(of([]));
  getIdentifierTypes = jest.fn().mockReturnValue(of([]));
}

export class MockClientService {
  getClients = jest.fn().mockReturnValue(of([]));
  getClientTitles = jest.fn().mockReturnValue(of([]));
  searchClients = jest.fn((clients) => {return []});
}

export class MockSessionStorageService {
  set = jest.fn((value) => {
    return;
  });
  get = jest.fn((value) => {
    return value;
});
}
describe('PersonalDetailsComponent', () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;
  let fb: FormBuilder;
  let countryServiceStub: CountryService;
  let relationTypeServiceStub: RelationTypesService;
  let beneficiaryTypeServiceStub: PartyService;
  let clientServiceStub: ClientService;
  let branchServiceStub: BranchService;
  let clientTypeServiceStub: ClientTypeService;
  let bankServiceStub: BankService;
  let occupationServiceStub: OccupationService;
  let currencyServiceStub: CurrencyService;
  let sectorServiceStub: SectorService;
  let sessionStorageServiceStub: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        CalendarModule,
        DropdownModule,
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: BranchService, useClass: MockBranchService },
        { provide: ClientTypeService, useClass: MockClientTypeService },
        { provide: ClientService, useClass: MockClientService },
        { provide: BankService, useClass: MockBankService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: OccupationService, useClass: MockOccupationService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: ToastService },
        { provide: PartyService, useClass: MockPartyService },
        { provide: RelationTypesService, useClass: MockRelationTypeService },
        { provide: SessionStorageService, useClass: MockSessionStorageService },
      ],
      declarations: [
        PersonalDetailsComponent,
        DynamicBreadcrumbComponent,
        StepperComponent
      ],
    });
    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    fb = new FormBuilder();
    countryServiceStub = TestBed.inject(CountryService);
    relationTypeServiceStub = TestBed.inject(RelationTypesService);
    beneficiaryTypeServiceStub = TestBed.inject(PartyService);
    clientServiceStub = TestBed.inject(ClientService);
    branchServiceStub = TestBed.inject(BranchService);
    clientTypeServiceStub = TestBed.inject(ClientTypeService);
    bankServiceStub = TestBed.inject(BankService);
    occupationServiceStub = TestBed.inject(OccupationService);
    currencyServiceStub = TestBed.inject(CurrencyService);
    sectorServiceStub = TestBed.inject(SectorService);
    sessionStorageServiceStub = TestBed.inject(SessionStorageService); // Get a reference to the session storage service

    fixture.detectChanges();
  });

  it('should create personal details component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties and fetch data on ngOnInit', () => {
    const mockClientTitles = [];
    const mockFormData: FormGroup = fb.group({
      control1: ['Initial Value 1'],
      control2: ['Initial Value 2'],
    });
    jest.spyOn(clientServiceStub, 'getClientTitles').mockReturnValue(of(mockClientTitles));
    jest.spyOn(component, 'getClientDetailsForm').mockReturnValue(mockFormData);
    jest.spyOn(component, 'getUploadForm').mockReturnValue(mockFormData);
    jest.spyOn(component, 'getBeneficiaryForm').mockReturnValue(mockFormData);
    component.ngOnInit();
    expect(component.clientDetailsForm).toEqual(mockFormData);
    expect(component.uploadForm).toEqual(mockFormData);
    expect(component.beneficiaryForm).toEqual(mockFormData);

    expect(component.countryList).toBeDefined();
    expect(component.branchList).toBeDefined();
    expect(clientServiceStub.getClientTitles).toHaveBeenCalledWith(2);
  });

  it('should create a beneficiary form', () => {
    // Act: Call the getBeneficiaryForm method
    const beneficiaryForm = component.getBeneficiaryForm();

    // Assert: Check if the form is correctly created
    expect(beneficiaryForm).toBeTruthy();

    // Check form control existence
    expect(beneficiaryForm.get('first_name')).toBeTruthy();
    expect(beneficiaryForm.get('other_name')).toBeTruthy();
    expect(beneficiaryForm.get('date_of_birth')).toBeTruthy();
    expect(beneficiaryForm.get('percentage_benefit')).toBeTruthy();

    // Check form control initial values
    expect(beneficiaryForm.get('first_name').value).toEqual('');
    expect(beneficiaryForm.get('other_name').value).toEqual('');
    expect(beneficiaryForm.get('date_of_birth').value).toEqual('');
    expect(beneficiaryForm.get('percentage_benefit').value).toEqual('');

    // Check form control validity (you can add more specific validations as needed)
    expect(beneficiaryForm.get('first_name').valid).toBe(true);
    expect(beneficiaryForm.get('other_name').valid).toBe(true);
    expect(beneficiaryForm.get('date_of_birth').valid).toBe(true);
    expect(beneficiaryForm.get('percentage_benefit').valid).toBe(true);

    // You can add more expectations here as needed
  });

  it('should create the client details form with the expected form controls and validators', () => {
    const formGroup: FormGroup = component.getClientDetailsForm();
    expect(formGroup).toBeInstanceOf(FormGroup);

    expect(formGroup.get('beneficiary')).toBeDefined();
    expect(formGroup.get('guardian')).toBeDefined();
    expect(formGroup.get('question')).toBeDefined();

    expect(formGroup.get('emailAddress').hasValidator(Validators.required)).toBeTruthy();
    expect(formGroup.get('pinNumber').hasValidator(Validators.required)).toBeTruthy();

    expect(formGroup.get('emailAddress').hasValidator(Validators.email)).toBeTruthy();
    expect(formGroup.get('maritalStatus').value).toBe('');
    expect(formGroup.get('gender').value).toBe('M');
    expect(formGroup.get('firstName').value).toBe('');
    expect(formGroup.get('county').value).toBe('');
    expect(formGroup.get('house_no').value).toBe('');
  });
  it('should set isTableOpen to true', () => {
    component.openTable();
    expect(component.isTableOpen).toBe(true);
  });
  it('should set isTableClose to false', () => {
    component.closeTable();
    expect(component.isTableOpen).toBe(false);
  });

  it('should fetch and set relation types list', () => {
    const mockRelationTypes = [];
    jest
      .spyOn(relationTypeServiceStub, 'getRelationTypes')
      .mockReturnValue(of(mockRelationTypes));
    component.getRelationTypes();
    expect(component.relationTypeList).toEqual(mockRelationTypes);
  });
  it('should fetch and set beneficiary types list', () => {
    const mockReturns = [];
    jest
      .spyOn(beneficiaryTypeServiceStub, 'getAllBeneficiaryTypes')
      .mockReturnValue(of(mockReturns));
    component.getRelationTypes();
    expect(component.beneficiaryTypeList).toEqual(mockReturns);
  });

  it('should fetch and set beneficiary types list', () => {
    const mockReturns = [];
    jest
      .spyOn(beneficiaryTypeServiceStub, 'getAllBeneficiaryTypes')
      .mockReturnValue(of(mockReturns));
    component.getRelationTypes();
    expect(component.beneficiaryTypeList).toEqual(mockReturns);
  });

  it('should update the client details form and session storage when a client is selected', () => {
    const mockClient = {
      lastName: 'Doe',
      firstName: 'John',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      emailAddress: 'john.doe@example.com',
      pinNumber: '1234',
      idNumber: 'ABC123',
      clientType: { code: '123' },
      phoneNumber: '555-555-5555',
    };

    jest.spyOn(sessionStorageServiceStub, 'set');
    component.selectClient(mockClient);

    const formValue = component.clientDetailsForm.value;

    expect(formValue.lastName).toBe('Doe');
    expect(formValue.firstName).toBe('John');
    expect(sessionStorageServiceStub.set).toHaveBeenCalledWith('client_code', 'ABC123');
  });

  it('should search for clients', (() => {
    const mockClientData: Pagination<ClientDTO> = {
      content: [],
      last: false,
      totalPages: 0,
      totalElements: 0,
      size: 0,
      number: 0,
      first: false,
      numberOfElements: 0,
    };
    component.clientList = [];
    jest.spyOn(clientServiceStub, 'searchClients').mockReturnValue(of(mockClientData));
    expect(component.isCLientListPresent).toBe(true);
    expect(component.clientList).toEqual(mockClientData.content);
  }));

  it('should calculate age correctly for dates before the current date', () => {
    // Arrange: Set up the date of birth (DOB) and the current date
    const dob = new Date('1990-01-15');
    const today = new Date('2023-10-18');

    // Act: Call the calculateAge function
    const age = component.calculateAge(dob);

    // Assert: Check if the age is calculated correctly
    expect(age).toBe(33); // Adjust the expected age based on your current date
  });

  it('should fetch and set beneficiary types list', () => {
    const mockReturns = [];
    jest
      .spyOn(beneficiaryTypeServiceStub, 'getAllBeneficiaryTypes')
      .mockReturnValue(of(mockReturns));
    component.getRelationTypes();
    expect(component.beneficiaryTypeList).toEqual(mockReturns);
  });

  it('should set isClientListPresent to true and populate clientList', () => {
    // Arrange: Mock the HttpClient request

    const mockClientData: Pagination<ClientDTO> = {
      content: [],
      last: false,
      totalPages: 0,
      totalElements: 0,
      size: 0,
      number: 0,
      first: false,
      numberOfElements: 0,
    };
    jest
      .spyOn(clientServiceStub, 'getClients')
      .mockReturnValue(of(mockClientData));
    component.getClientList();
    expect(component.isCLientListPresent).toBe(true);
    expect(component.clientList).toEqual(mockClientData.content);
  });

  it('should return the correct value from the form control', () => {
    const controlName = 'country';
    jest.spyOn(component, 'getValue').mockReturnValue('');
    const value = component.getValue(controlName);
    expect(value).toBe('');
  });

  it('should fetch and set stateList when selectCountry is called', () => {
    const mockCountryId = 1;
    const mockStates = [];
    const countryServiceSpy = jest
      .spyOn(countryServiceStub, 'getMainCityStatesByCountry')
      .mockReturnValue(of(mockStates));

    const event = { target: { value: mockCountryId } };
    component.selectCountry(event);
    component.showStateSpinner = true;

    // expect(component.showStateSpinner).toBe(true);

    fixture.detectChanges();

    expect(countryServiceSpy).toHaveBeenCalledWith(mockCountryId);
    expect(component.stateList).toEqual(mockStates);
    expect(component.townList).toEqual([]);
    // expect(component.showStateSpinner).toBe(false);
  });

  it('should set townList based on the selected state', () => {
    // Arrange: Set up the mock for the service method
    const mockTowns = [];
    jest.spyOn(countryServiceStub, 'getTownsByMainCityState').mockReturnValue(of(mockTowns));

    const event = { target: { value: '1' } };
    component.selectState(event);

    // expect(component.showTownSpinner).toBe(true);

      expect(component.townList).toEqual(mockTowns);
  });

  it('should fetch and process the list of countries', () => {
    // Arrange: Set up the mock for the service method
    const mockCountries: CountryDto[] = [];
    jest.spyOn(countryServiceStub, 'getCountries').mockReturnValue(of(mockCountries));

    // Act: Call the method that triggers the service call
    component.getCountryList();
    const expectedProcessedCountries = mockCountries.map((country) => ({
      ...country,
      name: country.name.toLowerCase(),
    }));
    expect(component.countryList).toEqual(expectedProcessedCountries);
  });


  it('should fetch and set branch list with lowercase names', () => {
    const mockBranches = [];
    jest.spyOn(branchServiceStub, 'getBranches').mockReturnValue(of(mockBranches));
    component.getBranchList();
    const expectedBranchList = mockBranches.map(branch => ({ ...branch, name: branch.name.toLowerCase() }));
    expect(component.branchList).toEqual(expectedBranchList);
  });

  it('should fetch and set client types', () => {
    const mockClientTypes = [{ id: 1, name: 'Type 1' }, { id: 2, name: 'Type 2' }];
    jest.spyOn(clientTypeServiceStub, 'getClientTypes').mockReturnValue(of(mockClientTypes));
    component.getClientypeList();
    expect(component.clientTypeList).toEqual(mockClientTypes);
  });

  it('should fetch and set identifier types', () => {
    const mockIdentifierTypes = ['IDType1', 'IDType2'];
    jest.spyOn(clientTypeServiceStub, 'getIdentifierTypes').mockReturnValue(of(mockIdentifierTypes));
    component.getIdentifierTypeList();
    expect(component.identifierTypeList).toEqual(mockIdentifierTypes);
  });

  it('should fetch and set bank list', () => {
    const mockBankList = [];
    jest.spyOn(bankServiceStub, 'getBanks').mockReturnValue(of(mockBankList));
    component.getBankList();

    expect(component.bankList).toEqual(mockBankList);
  });

  it('should fetch and set bank branch list', () => {
    const bankBranchList = [];
    jest.spyOn(bankServiceStub, 'getBankBranch').mockReturnValue(of(bankBranchList));
    component.getBankBranchList();

    expect(component.bankBranchList).toEqual(bankBranchList);
  });

  it('should fetch and set currency list', () => {
    const currencyList = [];
    jest.spyOn(currencyServiceStub, 'getAllCurrencies').mockReturnValue(of(currencyList));
    component.getCurrencyList();

    expect(component.currencyList).toEqual(currencyList);
  });

  it('should fetch and set occupation list', () => {
    const mockOccupationList: any[] = [{ id: 1, name: 'Occupation 1' }, { id: 2, name: 'Occupation 2' }];
    jest.spyOn(occupationServiceStub, 'getOccupations').mockReturnValue(of(mockOccupationList));
    component.getOccupationList();
    expect(component.occupationList).toEqual(mockOccupationList);
    expect(occupationServiceStub.getOccupations).toHaveBeenCalledTimes(2);
    expect(occupationServiceStub.getOccupations).toHaveBeenCalledWith(2);
  });

  it('should fetch and set sector list', () => {
    const sectorList = [];
    jest.spyOn(sectorServiceStub, 'getSectors').mockReturnValue(of(sectorList));
    component.getSectorList();

    expect(component.sectorList).toEqual(sectorList);
  });

  it('should close the modal', () => {
    component._openModal = true;

    component.closeModal();

    expect(component._openModal).toBe(true);
    const modal = document.getElementById('newClientModal');
    if (modal) {
      expect(modal.classList.contains('show')).toBe(false);
      expect(modal.style.display).toBe('none');
    } else {
      fail('Modal element not found');
    }
  });

});

