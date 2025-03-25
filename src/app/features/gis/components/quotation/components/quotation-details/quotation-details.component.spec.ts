import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationDetailsComponent } from './quotation-details.component';

import { OrganizationBranchDto } from "../../../../../../shared/data/common/organization-branch-dto";
import { CurrencyDTO } from "../../../../../../shared/data/common/currency-dto";
import { Products } from '../../../setups/data/gisDTO';
import { introducersDTO } from '../../data/introducersDTO';
import { QuotationList, QuotationSource, UserDetail } from '../../data/quotationsDTO';


jest.mock('ng2-pdf-viewer', () => ({
  PdfViewerComponent: jest.fn(),
}));

// quotation-details.service.mocks.ts
import { of } from 'rxjs';

export class MockQuotationService {
  getAllQuotationSources = jest.fn().mockReturnValue(of([{
    code: 1,
    description: "Direct",
    applicableModule: "Quotations"
  }]));
  
  getFormFields = jest.fn().mockReturnValue(of({}));
  createQuotationRisk = jest.fn().mockReturnValue(of({ success: true }));
  premiumComputationEngine = jest.fn().mockReturnValue(of({ premium: 1000 }));
  getLimitsOfLiability = jest.fn().mockReturnValue(of([{ limit: 1000000 }]));
  getExcesses = jest.fn().mockReturnValue(of([{ excessType: "Fixed", amount: 500 }]));
  getClauses = jest.fn().mockReturnValue(of([{ clauseCode: 1, description: "Standard Clause" }]));
  getClientQuotations = jest.fn().mockReturnValue(of([{
    quotationNo: "QN-2023-0001",
    status: "Draft"
  }]));
  createQuotation = jest.fn().mockReturnValue(of({ quotationNo: "QN-2023-0001" }));
  processQuotation = jest.fn().mockReturnValue(of({ success: true }));
  deleteRisk = jest.fn().mockReturnValue(of({ success: true }));
  getExchangeRates = jest.fn().mockReturnValue(of({ rate: 1.0 }));
  getUserOrgId = jest.fn().mockReturnValue(of(1));
  updatePremium = jest.fn().mockReturnValue(of({ success: true }));
}

export class MockProductService {
  getAllProducts = jest.fn().mockReturnValue(of([{
    code: 101,
    description: "Motor Insurance"
  }]));
  
  getCoverToDate = jest.fn().mockReturnValue(of("2023-12-31"));
  getYearOfManufacture = jest.fn().mockReturnValue(of([2020, 2021, 2022]));
  getProductSubclasses = jest.fn().mockReturnValue(of([{
    code: 10101,
    description: "Private Vehicle"
  }]));
}

export class MockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue(of("john.underwriter"));
  getCurrentUser = jest.fn().mockReturnValue(of({
    id: 101,
    name: "John Underwriter"
  }));
}

export class MockBranchService {
  getAllBranches = jest.fn().mockReturnValue(of([{
    id: 1,
    name: "Main Branch"
  }]));
}

export class MockClientService {
  getClients = jest.fn().mockReturnValue(of([{
    code: 1001,
    name: "Test Client"
  }]));
  
  getClientById = jest.fn().mockReturnValue(of({
    code: 1001,
    name: "Test Client"
  }));
}

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of([{
    code: 1,
    name: "Kenya"
  }]));
}

export class MockSubclassService {
  getAllSubclasses = jest.fn().mockReturnValue(of([{
    code: 10101,
    description: "Private Vehicle"
  }]));
}

export class MockBinderService {
  getAllBindersQuick = jest.fn().mockReturnValue(of([{
    code: 1,
    description: "Motor Binder"
  }]));
}

export class MockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of([{
    id: 1,
    name: "US Dollar",
    symbol: "$"
  }]));
}

export class MockSubclassCovertypeService {
  getSubclassCovertypeBySCode = jest.fn().mockReturnValue(of([{
    code: 1,
    description: "Comprehensive Cover"
  }]));
}

export class MockSubclassSectionCovertypeService {
  getSubclassCovertypeSections = jest.fn().mockReturnValue(of([{
    sectionCode: 1,
    description: "Third Party Liability"
  }]));
}

export class MockSectionService {
  getSectionByCode = jest.fn().mockReturnValue(of({
    code: 1,
    description: "Third Party Liability"
  }));
}

export class MockPremiumRateService {
  getAllPremiums = jest.fn().mockReturnValue(of([{
    rate: 5.0,
    description: "Standard Rate"
  }]));
}

export class MockSharedQuotationsService {
  getQuotationFormDetails = jest.fn().mockReturnValue({
    clientId: 1001,
    productCode: 101
  });
  
  setQuotationFormDetails = jest.fn();
  getQuotationNo = jest.fn().mockReturnValue("QN-2023-0001");
}

export class MockProductSubclassService {
  getProductSubclasses = jest.fn().mockReturnValue(of([{
    code: 10101,
    description: "Private Vehicle"
  }]));
}

export class MockIntermediaryService {
  getIntermediaries = jest.fn().mockReturnValue(of([{
    code: 1001,
    name: "Test Agent"
  }]));
}

export class MockClauseService {
  getClauses = jest.fn().mockReturnValue(of([{
    clauseCode: 1,
    description: "Standard Clause"
  }]));
}

export class MockBankService {
  getBanks = jest.fn().mockReturnValue(of([{
    code: 1,
    name: "Test Bank"
  }]));
}

export class MockGlobalMessagingService {
  showSuccessMessage = jest.fn();
  showErrorMessage = jest.fn();
  showInfoMessage = jest.fn();
}

const mockOrganizationBranchDto: OrganizationBranchDto = {
  account: "1234567890",
  contact: "John Doe",
  country: 1,
  emailAddress: "branch@example.com",
  emailSource: "noreply@example.com",
  fax: "123456789",
  id: 1,
  logo: "logo.png",
  manager: 101,
  name: "Main Branch",
  organizationId: 1,
  physicalAddress: "123 Main St",
  postAddress: "PO Box 123",
  postalCode: "12345",
  region: {
    agentSeqNo: "A100",
    branchMgrSeqNo: "BM100",
    clientSequence: 1,
    code: 1,
    computeOverOwnBusiness: "Y",
    dateFrom: "2023-01-01",
    dateTo: "2023-12-31",
    managerAllowed: "Y",
    name: "Central Region",
    organization: "ABC Insurance",
    overrideCommissionEarned: "N",
    policySeqNo: 1,
    postingLevel: "Branch",
    preContractAgentSeqNo: 1,
    shortDescription: "Central"
  },
  shortDescription: "Main",
  sms_source: "12345",
  state: 1,
  telephoneNumber: "1234567890",
  town: 1
};

const mockCurrencyDTO: CurrencyDTO = {
  decimalWord: "cents",
  currencyDefault: 'Y',
  id: 1,
  name: "US Dollar",
  nameAndSymbol: "USD ($)",
  numberWord: "dollars",
  roundingOff: 2,
  symbol: "$"
};

const mockProducts: Products = {
  code: 101,
  shortDescription: "Motor Insurance",
  description: "Comprehensive Motor Vehicle Insurance",
  productGroupCode: 1,
  withEffectFrom: 20230101,
  withEffectTo: 20231231,
  doesCashBackApply: "N",
  policyPrefix: "MOT",
  claimPrefix: 101,
  underwritingScreenCode: "UW101",
  claimScreenCode: 101,
  expires: "Y",
  minimumSubClasses: 1,
  acceptsMultipleClasses: 1,
  minimumPremium: 50,
  isRenewable: "Y",
  allowAccommodation: "N",
  openCover: "N",
  productReportGroupsCode: 1,
  policyWordDocument: 1,
  shortName: "Motor",
  endorsementMinimumPremium: 10,
  showSumInsured: "Y",
  showFAP: "Y",
  policyCodePages: 5,
  policyDocumentPages: 10,
  isPolicyNumberEditable: "N",
  policyAccumulationLimit: 1000000,
  insuredAccumulationLimit: 500000,
  totalCompanyAccumulationLimit: 10000000,
  enableSpareParts: "N",
  prerequisiteProductCode: 0,
  allowMotorClass: "Y",
  allowSameDayRenewal: "Y",
  acceptUniqueRisks: 0,
  industryCode: 1,
  webDetails: 1,
  showOnWebPortal: "Y",
  areInstallmentAllowed: "Y",
  interfaceType: "API",
  isMarine: 0,
  allowOpenPolicy: "N",
  order: 1,
  isDefault: "N",
  prorataType: "Flat",
  doFullRemittance: 1,
  productType: 1,
  checkSchedule: 1,
  scheduleOrder: 1,
  isPinRequired: "N",
  maximumExtensions: 3,
  autoGenerateCoverNote: "Y",
  commissionRate: 15,
  autoPostReinsurance: "Y",
  insuranceType: "General",
  years: 1,
  enableWeb: 1,
  doesEscalationReductionApply: 0,
  isLoanApplicable: 0,
  isAssignmentAllowed: 0,
  minimumAge: 18,
  maximumAge: 70,
  minimumTerm: 1,
  maximumTerm: 12,
  termDistribution: 1,
  organizationCode: 1
};

const mockIntroducersDTO: introducersDTO = {
  agent_code: 1001,
  bru_code: 1,
  code: 101,
  date_of_birth: 19800101,
  email: "introducer@example.com",
  fee_allowed: "Y",
  group_company: "N",
  id_registration: "ID12345",
  introducer_town: "Nairobi",
  introducer_zip: "00100",
  introducer_zip_name: "Nairobi CBD",
  mobile_number: 712345678,
  other_names: "Jane",
  pin: "A123456789X",
  postal_address: 12345,
  remarks: "Top performer",
  staff_no: 1001,
  sur_name: "Smith",
  telephone_number: 202345678,
  type: "Individual",
  user_id: 101,
  wef: "20230101",
  wet: "20231231"
};

const mockQuotationSource: QuotationSource = {
  code: 1,
  description: "Direct",
  applicableModule: "Quotations"
};

const mockUserDetail: UserDetail = {
  id: 101,
  name: "John Underwriter",
  username: "junderwriter",
  emailAddress: "j.underwriter@example.com",
  dateOfBirth: "1980-01-01",
  status: "Active",
  userType: "Underwriter",
  telNo: "123456789",
  phoneNumber: "712345678",
  otherPhone: null,
  personelRank: "Senior",
  countryCode: 1,
  townCode: 1,
  physicalAddress: "123 Underwriter Lane",
  postalCode: "00100",
  departmentCode: "UW",
  activatedBy: "admin",
  updateBy: "admin",
  dateCreated: "2020-01-01",
  profilePicture: null,
  organizationId: 1,
  organizationGroupId: 1,
  supervisorId: 100,
  branchId: 1,
  gender: "Male",
  pinNumber: "A123456789X",
  idNumber: "12345678"
};

const mockQuotationFormDetails = {
  clientId: 1001,
  clientName: "Test Client",
  productCode: 101,
  currencyCode: 1,
  branchCode: 1,
  intermediaryCode: 1001,
  source: "Direct",
  expiryDate: "2023-12-31"
};

const mockClientPayload = {
  code: 1001,
  name: "Test Client",
  type: "Individual",
  idNumber: "12345678",
  pin: "A123456789X",
  phoneNumber: "712345678",
  email: "client@example.com",
  physicalAddress: "123 Client Street",
  postalAddress: "PO Box 123"
};

const mockQuoteStepsData = [
  { id: 1, name: "Client Details", completed: true },
  { id: 2, name: "Quotation Details", completed: false, active: true },
  { id: 3, name: "Risk Details", completed: false },
  { id: 4, name: "Premium Calculation", completed: false },
  { id: 5, name: "Summary", completed: false }
];

const mockProductSubclassList = [
  { code: 10101, description: "Private Vehicle" },
  { code: 10102, description: "Commercial Vehicle" }
];

const mockProductDetails = {
  code: 101,
  description: "Motor Insurance",
  subClasses: mockProductSubclassList
};

const mockQuotationsList = [
  {
    quotationNo: "QN-2023-0001",
    clientCode: 1001,
    clientName: "Test Client",
    productCode: 101,
    productName: "Motor Insurance",
    currency: "USD",
    status: "Draft",
    expiryDate: "2023-12-31"
  }
];

const mockQuickQuotationDetails = {
  quotationCode: "QN-2023-0001",
  quotationNo: "QN-2023-0001",
  clientCode: 1001,
  clientName: "Test Client"
};

const mockCampaignList = [
  { code: 1, description: "Summer Promotion" },
  { code: 2, description: "New Customer Discount" }
];

const mockQuotationList: QuotationList = {
  quotationCode: 67890,
  quotationNumber: 'QN-2023-0001',
  clientCode: 12345,
  clientName: 'henry morrow',
  fromDate: '2023-12-31',
  toDate: '2024-12-31',
  expiryDate: '2024-03-31',
  status: 'Pending',
  quotDate: '2023-12-31'
}

describe('QuotationDetailsComponent', () => {
  let component: QuotationDetailsComponent;
  let fixture: ComponentFixture<QuotationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationDetailsComponent]
    });
    fixture = TestBed.createComponent(QuotationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
