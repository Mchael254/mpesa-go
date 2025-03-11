import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PdSlipPreviewComponent } from './pd-slip-preview.component';
import { ReportsService } from '../../../../shared/services/reports/reports.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { ReceiptService } from '../../services/receipt.service';
import { Router } from '@angular/router';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReceiptPreviewComponent', () => {
  let component: PdSlipPreviewComponent;
  let fixture: ComponentFixture<PdSlipPreviewComponent>;
  let mockReportService: any;
  let mockGlobalMessagingService: any;
  let mockRouter: any;
  let mockReceiptDataService: any;
  let mockSessionStorageService: any;
  let mockReceiptService: any;
  let mockTranslateService: any;

  beforeEach(async () => {
    mockReportService = {
      generateReport: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockReceiptDataService = {
      clearReceiptData: jest.fn(),
    };
    mockSessionStorageService = {
      getItem: jest.fn().mockImplementation((key: string) => {
        if (key === 'receiptNo') return '123';
        if (key === 'OrgId') return '456';
        if (key === 'defaultOrg') return JSON.stringify({ id: 1, name: 'Default Org' }); // Mock defaultOrg
        if (key === 'selectedOrg') return JSON.stringify({ id: 2, name: 'Selected Org' }); // Mock selectedOrg
        return null;
      }),
    };
    mockReceiptService = {
      updateReceiptStatus: jest.fn(),
    };
    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn(),
      instant: jest.fn().mockReturnValue('translated value') // Mock instant
    };

    await TestBed.configureTestingModule({
      declarations: [PdSlipPreviewComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),HttpClientTestingModule], // Import TranslateModule
      providers: [
        { provide: ReportsService, useValue: mockReportService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: Router, useValue: mockRouter },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PdSlipPreviewComponent);
    component = fixture.componentInstance;

     // Trigger ngOnInit
    component.ngOnInit();

    // Trigger change detection *AFTER* ngOnInit and mock setup
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getReceipt on ngOnInit', () => {
    mockSessionStorageService.getItem.mockReturnValue('123');
    jest.spyOn(component, 'getReceipt');
    component.ngOnInit();
    expect(component.getReceipt).toHaveBeenCalled();
  });

  it('should load and set receiptNo and OrgId on OnInit', () => {
    mockSessionStorageService.getItem.mockImplementation((key: string) => {
      if (key === 'receiptNo') return '123';
      if (key === 'OrgId') return '456';
      return null;
    });

    component.ngOnInit();

    expect(component.receiptResponse).toBe(123);
    expect(component.orgId).toBe(456);
  });

  it('should generate report on getReceipt', () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    const mockUrl = 'mockURL';
    window.URL.createObjectURL = jest.fn().mockReturnValue(mockUrl);
    mockReportService.generateReport.mockReturnValue(of(new Blob()));
    mockSessionStorageService.getItem.mockReturnValue('123');
      mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:1,country:{id:1}}))
    component.ngOnInit();
    expect(component.filePath).toEqual(mockUrl);
  });

  it('should call displayErrorMessage if generateReport errors', () => {
    mockReportService.generateReport.mockReturnValue(
      throwError(() => ({ error: { status: 'error' } }))
    );

    component.getReceipt();

    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'error'
    );
  });

  it('should clear reciept data and navigate to next screen', () => {
    component.navigateToReceiptCapture();

    expect(mockReceiptDataService.clearReceiptData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-capture']);
  });

  it('should clear receipt data and navigate to receipt capture on onBack', () => {
    component.onBack();
    expect(mockReceiptDataService.clearReceiptData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-capture']);
  });

  it('should update print status successfully', () => {
    const mockMessage = 'Update successful';
    mockReceiptService.updateReceiptStatus.mockReturnValue(of({ message: mockMessage }));
    component.receiptResponse = '123';
    component.updatePrintStatus();

    expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([123]);
    expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('success:', mockMessage);
  });

  it('should display error message on updatePrintStatus error', () => {
    const mockError = { error: { msg: 'Update failed' } };
    mockReceiptService.updateReceiptStatus.mockReturnValue(throwError(() => mockError));
    component.receiptResponse = '123';
    component.updatePrintStatus();

    expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([123]);
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('failed', mockError.error.msg);
  });

   it('should download success', () => {
      const mockElement = document.createElement('a');
      const mockUrl = 'mockURL';

      mockElement.href=mockUrl;
      mockElement.download = 'receipt';

       const clickSpy = jest.spyOn(mockElement, 'click');

      component.filePath=mockUrl;
        component.download()
     });
      it('should display error if filepath is invalid during download', () => {
        component.filePath='';
       component.download();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('failed!','Download failed: Invalid file URL');
     });
});