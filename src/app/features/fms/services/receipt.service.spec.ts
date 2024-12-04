import { TestBed } from '@angular/core/testing';
import { ReceiptService } from './receipt.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { API_CONFIG } from 'src/environments/api_service_config';
import { API_CONFIG} from '../../../../environments/api_service_config';
import {
  DrawersBankDTO,
  NarrationDTO,
  CurrencyDTO,
  
  PaymentModesDTO,
  ReceiptNumberDTO,
  BankDTO,
  GenericResponse,
  ManualExchangeRateResponseDTO,
  ChargesDTO,
  ExistingChargesResponseDTO,
  ChargeManagementDTO,
} from '../data/receipting-dto';
import { environment } from '../../../../environments/environment';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReceiptService],
    });

    service = TestBed.inject(ReceiptService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no unmatched requests are outstanding
  });

  // Test: Service should be created
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch receipting points for a branch', () => {
    const branchCode = 1;
    const mockResponse = { data: [{ id: 1, name: 'Point A', autoManual: 'Auto', printerName: null, userRestricted: 'No' }] };
  
    service.getReceiptingPoints(branchCode).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
  
    const req = httpTestingController.expectOne(
      `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/points?branchCode=${branchCode}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
  // Test: getDrawersBanks()
it('should fetch drawer banks', async () => {
  const mockResponse: DrawersBankDTO[] = [
    {
      bankName: 'Bank 1',
      branchName: 'Branch 1',
      refCode: 'REF01',
      code: 101,
    },
    {
      bankName: 'Bank 2',
      branchName: null,
      refCode: null,
      code: 102,
    },
  ];

  service.getDrawersBanks().subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/drawer-banks`
  );
  expect(req.request.method).toBe('GET');
  await req.flush(mockResponse);
  
  
});


// Test: getNarrations()
it('should fetch narrations', () => {
  const mockResponse: { data: NarrationDTO[] } = {
    data: [
      {
        code: 1,
        narration: 'Narration 1',
      },
    ],
  };

  service.getNarrations().subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });
  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/narrations`

  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});



//  // Test: getCurrencies(branchCode)
it('should fetch currencies for a branch', () => {
  const branchCode = 123;
  const mockResponse: { data: CurrencyDTO[] } = {
    data: [
      {
        code: 840,
        symbol: '$',
        desc: 'Dollar',
        roundOff: 0.01,
      },
    ],
  };

  service.getCurrencies(branchCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/currencies?branchCode=${branchCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

//   // Test: getReceiptNumber(branchCode, userCode)
it('should fetch receipt numbers', () => {
  const branchCode = 1;
  const userCode = 10;
  const mockResponse: ReceiptNumberDTO[] = [
    {
      bankAccountCode: 1001,
      bankAccountBranchCode: 2001,
      bankAccountName: 'Main Account',
      bankAccountType: 'Current',
      receiptingPointId: 1,
      receiptingPointName: 'Point A',
      receiptingPointAutoManual: 'Manual',
      branchReceiptNumber: 123,
      receiptNumber: 'REC12345',
      newCurrencyExchangeRateAmount: 1.5,
    },
  ];

  service.getReceiptNumber(branchCode, userCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/receipts/get-receipt-no?branchCode=${branchCode}&userCode=${userCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});


 // Test: getPaymentModes()
it('should fetch payment modes', () => {
  const mockResponse: { data: PaymentModesDTO[] } = {
    data: [
      {
        code: 'PM01',
        desc: 'Cash',
        clearingRequired: 'No',
        collectAcc: 'ACC01',
        minAmt: 0,
        maxAmt: 10000,
        grossRctngAllowed: 'Yes',
        docRqrd: 'No',
        amtEditable: 'Yes',
        rate: 0,
        accNumber: '123456',
        accName: 'Main Account',
        accountType: 'Current',
        refUnique: 'No',
        refLength: 0,
        emailApplicable: 'Yes',
        bnkRateType: 'Fixed',
      },
    ],
  };

  service.getPaymentModes().subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/payment-methods`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});


  // Test: getBanks(branchCode, currCode)
it('should fetch banks for branch and currency', () => {
  const branchCode = 1;
  const currCode = 840;
  const mockResponse: { data: BankDTO[] } = {
    data: [
      {
        code: 101,
        branchCode: branchCode,
        name: 'Bank A',
        type: 'Savings',
        defaultBank: 'Y',
      },
    ],
  };

  service.getBanks(branchCode, currCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/banks?branchCode=${branchCode}&currCode=${currCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

it('should fetch existing charges based on receipt number', () => {
  const receiptNo = 12345;

  // Mock response matching ExistingChargesResponseDTO structure
  const mockResponse = {
    data: [
      {
        id: 1,
        receiptChargeId: 101,
        amount: 500,
        receiptNO: receiptNo,
        receiptChargeName: 'Charge A',
      },
      {
        id: 2,
        receiptChargeId: 102,
        amount: 750,
        receiptNO: receiptNo,
        receiptChargeName: 'Charge B',
      },
    ],
  };

  service.getExistingCharges(receiptNo).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/charges/expenses?receiptNo=${receiptNo}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

it('should post charge management data', () => {
  // Mock data matching the ChargeManagementDTO interface
  const data: ChargeManagementDTO = {
    addEdit: 'ADD',
    receiptExpenseId: 101,
    receiptNo: 12345,
    receiptChargeId: 678,
    receiptChargeAmount: 500,
    suspenseRct: 'N',
  };

  // Mock response
  const mockResponse = { message: 'Charge management updated successfully' };

  service.postChargeManagement(data).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/charges/manage`
  );
  
  // Validating HTTP request details
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(data);

  // Mocking backend response
  req.flush(mockResponse);
});

//fetch org' charges
it('should fetch charges for an organization and branch', () => {
  const orgCode = 1;
  const brhCode = 2;

  // Mock response (ChargesDTO[] now correctly typed as an array)
  const mockChargesData: ChargesDTO[] = [
    {
      id: 1,
      name: 'Charge 1',
      accNo: '123456',
      branchCode: brhCode,
      orgCode: orgCode,
      tempReceiptExpensesList: [
        { id: 101, receiptCharge: 'Charge Item 1', amount: 500, receiptNo: 1111 },
      ],
    },
    {
      id: 2,
      name: 'Charge 2',
      accNo: '789012',
      branchCode: brhCode,
      orgCode: orgCode,
      tempReceiptExpensesList: [
        { id: 201, receiptCharge: 'Charge Item 2', amount: 300, receiptNo: 1112 },
      ],
    },
  ];


  const mockResponse = { data: mockChargesData }; // Use the correctly typed array
  service.getCharges(orgCode, brhCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/charges?orgCode=${orgCode}&brhCode=${brhCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
 
});


//should handle API errors correctly when fetching charges
it('should handle API errors correctly when fetching charges', () => {
  const orgCode = 1;
  const brhCode = 2;

  service.getCharges(orgCode, brhCode).subscribe({
    next: () => fail('Expected an error, but got a success response'),
    error: (error) => {
      expect(error.status).toBe(500); // Verify the error status
      expect(error.error).toBe('Internal Server Error'); // Verify the error message
    },
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/charges?orgCode=${orgCode}&brhCode=${brhCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
});
it('should fetch charges using the correct query parameters', () => {
  const orgCode = 10;
  const brhCode = 20;
  const mockChargesData: ChargesDTO[] = [
    {
      id: 1,
      name: 'Charge 1',
      accNo: '123456',
      branchCode: brhCode,
      orgCode: orgCode,
      tempReceiptExpensesList: [
        { id: 101, receiptCharge: 'Charge Item 1', amount: 500, receiptNo: 1111 },
      ],
    },
    {
      id: 2,
      name: 'Charge 2',
      accNo: '789012',
      branchCode: brhCode,
      orgCode: orgCode,
      tempReceiptExpensesList: [
        { id: 201, receiptCharge: 'Charge Item 2', amount: 300, receiptNo: 1112 },
      ],
    },
  ];


  const mockResponse = { data: mockChargesData }; // Use the correctly typed array

  service.getCharges(orgCode, brhCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/charges?orgCode=${orgCode}&brhCode=${brhCode}`
  );
  expect(req.request.params.get('orgCode')).toBe(`${orgCode}`);
  expect(req.request.params.get('brhCode')).toBe(`${brhCode}`);
  req.flush(mockResponse);
});

//should handle charges with null values in optional fields
it('should handle charges with null values in optional fields', () => {
  const orgCode = 1;
  const brhCode = 2;
  const mockChargesData: ChargesDTO[] = [
    {
      id: 1,
      name: 'Charge 1',
      accNo: '123456',
      branchCode: brhCode,
      orgCode: orgCode,
      tempReceiptExpensesList: [
        { id: 101, receiptCharge: 'Charge Item 1', amount: 500, receiptNo: 1111 },
      ],
    },
    {
      id: 2,
      name: 'Charge 2',
      accNo: '789012',
      branchCode: brhCode,
      orgCode: orgCode,
      tempReceiptExpensesList: [
        { id: 201, receiptCharge: 'Charge Item 2', amount: 300, receiptNo: 1112 },
      ],
    },
  ];


  const mockResponse = { data: mockChargesData }; // Use the correctly typed array

  service.getCharges(orgCode, brhCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
    expect(res.data[0].accNo).toBeNull();
    expect(res.data[0].tempReceiptExpensesList[0].receiptNo).toBeNull();
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/charges?orgCode=${orgCode}&brhCode=${brhCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

//  // Test: getManualExchangeRateParameter(paramName)
it('should fetch manual exchange rate parameter', () => {
  const paramName = 'param1';
  const mockResponse: GenericResponse<string> = {
    data: 'Enabled',
    msg: 'Parameter fetched successfully',
    success: true,
  };

  service.getManualExchangeRateParameter(paramName).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/parameters/get-param-status?paramName=${paramName}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

//it should fetch exchange rates that are already defined
it('should fetch exchange rate for a currency and organization', () => {
  const selectedCurrency = 840;
  const orgCode = 123;
  const mockResponse = { data: '1.2', msg: 'Success', success: true };

  service.getExchangeRate(selectedCurrency, orgCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/currencies/get-exchange-rate?selectedCurrency=${selectedCurrency}&orgCode=${orgCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

it('should post a manual exchange rate', () => {
  const selectedCurrency = 840;
  const branchCode = 1;
  const userName = 'testUser';
  const newCurrencyExchangeRateAmount = 1.25;

  // Updated mockResponse to match ManualExchangeRateResponseDTO
  const mockResponse: ManualExchangeRateResponseDTO = {
    msg: 'Exchange rate set successfully',
    success: true,
    data: {}, // Adjust `data` as per your requirements (e.g., a specific object or string)
  };

  service.postManualExchangeRate(selectedCurrency, branchCode, userName, newCurrencyExchangeRateAmount).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/currencies/set-manual-rate`
  );
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual({
    selectedCurrency,
    branchCode,
    userName,
    newCurrencyExchangeRateAmount,
  });
  req.flush(mockResponse);
});

//it should handle error when fetching banks
it('should handle error for getBanks', () => {
  const branchCode = 1;
  const currCode = 840;
  const errorMessage = 'Network error';

  service.getBanks(branchCode, currCode).subscribe({
    next: () => fail('Should have failed with error'),
    error: (error) => {
      expect(error).toBeTruthy();
      expect(error).toEqual(errorMessage);
    },
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/banks?branchCode=${branchCode}&currCode=${currCode}`
  );
  req.error(new ErrorEvent('Network error'), { status: 500, statusText: errorMessage });
});


//it should post manual exchange rate entered by user
it('should post a manual exchange rate', () => {
  const selectedCurrency = 840;
  const branchCode = 1;
  const userName = 'testUser';
  const newCurrencyExchangeRateAmount = 1.25;
  const mockResponse = { success: true, msg: 'Exchange rate set successfully',data:'Y' };

  service.postManualExchangeRate(selectedCurrency, branchCode, userName, newCurrencyExchangeRateAmount).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/currencies/set-manual-rate`
  );
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual({
    selectedCurrency,
    branchCode,
    userName,
    newCurrencyExchangeRateAmount,
  });
  req.flush(mockResponse);
});

it('should fetch clients based on search criteria and value', () => {
  // Input parameters
  const systemCode = 1;
  const acctCode = 2;
  const searchCriteria = 'name';
  const searchValue = 'JohnDoe';

  // Mock response based on ClientsDTO interface
  const mockResponse = {
    data: [
      {
        tableUsed: 'ClientTable',
        code: 1,
        accountCode: acctCode,
        shortDesc: 'JD',
        name: 'John Doe',
        acctNo: '12345',
        systemCode: systemCode,
        systemShortDesc: 'SYS1',
        receiptType: 'Normal',
      },
      {
        tableUsed: 'ClientTable',
        code: 2,
        accountCode: acctCode,
        shortDesc: 'JS',
        name: 'Jane Smith',
        acctNo: '67890',
        systemCode: systemCode,
        systemShortDesc: 'SYS1',
        receiptType: 'Normal',
      },
    ],
  };

  service
    .getClients(systemCode, acctCode, searchCriteria, searchValue)
    .subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/clients?systemCode=${systemCode}&acctCode=${acctCode}&searchCriteria=${searchCriteria}&searchValue=${searchValue}`
  );

  // Validating the HTTP request details
  expect(req.request.method).toBe('GET');

  // Simulating backend response
  req.flush(mockResponse);
});

//should fetch account types for an organization
it('should fetch account types for an organization, user, and branch', () => {
  const orgCode = 1;
  const userCode = 2;
  const branchCode = 3;

  // Mock response matching the AccountTypeDTO structure
  const mockResponse = {
    data: [
      {
        branchCode: 3,
        userCode: 2,
        code: 101,
        systemCode: 11,
        accCode: 1001,
        name: 'Savings',
        coaAccNumber: '12345',
        coaAccOrgCode: 1,
        coaBranchCode: 3,
        receiptBank: 0,
        chequeBank: 1,
        subClass: 'General',
        active: 'Y',
        receiptAccount: 'RA123',
        restrictGrossDebitRcpt: 'N',
        vatApplicable: 'Y',
        rateApplicable: 16,
        actTypeShtDesc: 'SAV',
        systemName: 'Finance System',
      },
      {
        branchCode: 3,
        userCode: 2,
        code: 102,
        systemCode: 11,
        accCode: 1002,
        name: 'Checking',
        coaAccNumber: '67890',
        coaAccOrgCode: 1,
        coaBranchCode: 3,
        receiptBank: 1,
        chequeBank: 0,
        subClass: 'General',
        active: 'Y',
        receiptAccount: 'RA456',
        restrictGrossDebitRcpt: 'N',
        vatApplicable: 'N',
        rateApplicable: 0,
        actTypeShtDesc: 'CHK',
        systemName: 'Finance System',
      },
    ],
  };

  service.getAccountTypes(orgCode, userCode, branchCode).subscribe((res) => {
    expect(res).toEqual(mockResponse);
  });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/account-types?orgCode=${orgCode}&usrCode=${userCode}&branchCode=${branchCode}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

//it should get transactions
it('should fetch client transactions based on given parameters', () => {
  const systemShortDesc = 'SYS1';
  const clientCode = 123;
  const accountCode = 456;
  const receiptType = 'Normal';
  const clientShtDesc = 'C1';

  // Mock response matching TransactionDTO structure
  const mockResponse = {
    data: [
      {
        systemShortDescription: systemShortDesc,
        transactionNumber: 1001,
        transactionDate: new Date('2024-12-01'),
        referenceNumber: 'REF123',
        transactionType: 'Credit',
        clientCode: clientCode,
        amount: 500,
        balance: 0,
        commission: 50,
        withholdingTax: 5,
        transactionLevy: 10,
        serviceDuty: 15,
        settlementAmount: 420,
        narrations: 'Transaction 1',
        accountCode: 'ACC123',
        clientPolicyNumber: 'POL123',
        receiptType: receiptType,
        extras: 5,
        policyHolderFund: 100,
        agentDiscount: 20,
        policyBatchNumber: 1,
        propertyCode: 789,
        clientName: 'Client A',
        vat: 10,
        commissionPayable: 45,
        vatPayable: 8,
        healthFund: 2,
        roadSafetyFund: 1,
        clientVatAmount: 3,
        certificateCharge: 5,
        motorLevy: 6,
        originalInstallmentPremium: 200,
        outstandingPremiumBalance: 100,
        nextInstallmentNumber: 2,
        paidToDate: new Date('2024-11-30'),
        transmissionReferenceNumber: 'TRN123',
      },
      {
        systemShortDescription: systemShortDesc,
        transactionNumber: 1002,
        transactionDate: new Date('2024-12-02'),
        referenceNumber: 'REF456',
        transactionType: 'Debit',
        clientCode: clientCode,
        amount: 750,
        balance: 100,
        commission: 75,
        withholdingTax: 7.5,
        transactionLevy: 15,
        serviceDuty: 22.5,
        settlementAmount: 630,
        narrations: 'Transaction 2',
        accountCode: 'ACC456',
        clientPolicyNumber: 'POL456',
        receiptType: receiptType,
        extras: 10,
        policyHolderFund: 150,
        agentDiscount: 25,
        policyBatchNumber: 2,
        propertyCode: 890,
        clientName: 'Client B',
        vat: 15,
        commissionPayable: 70,
        vatPayable: 12,
        healthFund: 3,
        roadSafetyFund: 1.5,
        clientVatAmount: 4,
        certificateCharge: 6,
        motorLevy: 7,
        originalInstallmentPremium: 300,
        outstandingPremiumBalance: 150,
        nextInstallmentNumber: 3,
        paidToDate: new Date('2024-12-01'),
        transmissionReferenceNumber: 'TRN456',
      },
    ],
  };

  service
    .getTransactions(systemShortDesc, clientCode, accountCode, receiptType, clientShtDesc)
    .subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

  const req = httpTestingController.expectOne(
    `${environment.API_URLS.get(API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)}/clients/transactions?systemShortDesc=${systemShortDesc}&clientCode=${clientCode}&accountCode=${accountCode}&receiptType=${receiptType}&clientShtDesc=${clientShtDesc}`
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

});
