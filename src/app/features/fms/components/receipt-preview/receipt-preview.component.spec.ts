import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ReceiptPreviewComponent } from './receipt-preview.component';
import { ReportsService } from 'src/app/shared/services/reports/reports.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Router } from '@angular/router';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportDto } from 'src/app/shared/data/common/reports-dto';

describe('ReceiptPreviewComponent', () => {
  let component: ReceiptPreviewComponent;
  let fixture: ComponentFixture<ReceiptPreviewComponent>;
  let mockReportService: any;
  let mockGlobalMessagingService: any;
  let mockRouter: any;
  let mockReceiptDataService: any;

  beforeEach(async () => {
    mockReportService = {
      generateReport: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockReceiptDataService = {
      clearReceiptData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ReceiptPreviewComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ReportsService, useValue: mockReportService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: Router, useValue: mockRouter },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Provide mock implementation for localStorage methods
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    // Assign it to the window object
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getReceipt on ngOnInit', () => {
    jest.spyOn(component, 'getReceipt');
    component.ngOnInit();
    expect(component.getReceipt).toHaveBeenCalled();
  });

  it('should load and set receiptNo and OrgId on OnInit', () => {
    const localStorageMock = window.localStorage;
     localStorageMock.getItem = jest.fn()
    //localStorageMock.getItem.mockReturnValueOnce('123');
     //localStorageMock.getItem.mockReturnValueOnce('1');
      component.ngOnInit()
        expect(component.receiptResponse).toBe(123);
         expect(component.orgId).toBe(1);
  });
  
  it('should call generateReport and set filePath on getReceipt success', () => {
      const mockBlob = new Blob(['mock data'], { type: 'application/pdf' });
     mockReportService.generateReport.mockReturnValue(of(mockBlob));
    const mockReceiptNumber = 123;
    const mockOrgId = 1;

    const expectedReportPayload: ReportDto = {
      encodeFormat: 'RAW',
      params: [
        { name: 'UP_RCT_NO', value: String(mockReceiptNumber) },
        { name: 'UP_ORG_CODE', value: String(mockOrgId) },
      ],
      reportFormat: 'PDF',
      rptCode: 300,
      system: 'CRM',
    };
    // Set the localStorage values before calling the method
    const localStorageMock = window.localStorage;
    localStorageMock.getItem = jest.fn()
   // localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockReceiptNumber));
    // localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockOrgId));
    component.ngOnInit();
    component.getReceipt();

    expect(mockReportService.generateReport).toHaveBeenCalledWith(expectedReportPayload);
  });

  it('should call displayErrorMessage if generateReport errors', () => {
      mockReportService.generateReport.mockReturnValue(throwError(() => new Error('Test error')));
    component.getReceipt();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalled();
  });
   it('should clear reciept data and navigate to next screen', () => {
       component.onBack()
        expect(mockReceiptDataService.clearReceiptData).toHaveBeenCalled();
         expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/screen1']);

   });
});