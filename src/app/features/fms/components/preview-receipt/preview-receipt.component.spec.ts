import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

import { PreviewReceiptComponent } from './preview-receipt.component';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReportsService } from '../../../../shared/services/reports/reports.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { ReceiptService } from '../../services/receipt.service';

// --- Mock Pipe for the template ---
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('PreviewReceiptComponent', () => {
  let component: PreviewReceiptComponent;
  let fixture: ComponentFixture<PreviewReceiptComponent>;

  // Use jest.Mocked<T> for strong typing of mocks
  let mockSessionStorageService: jest.Mocked<SessionStorageService>;
  let mockGlobalMessagingService: jest.Mocked<GlobalMessagingService>;
  let mockReportsService: jest.Mocked<ReportsService>;
  let mockRouter: jest.Mocked<Router>;
  let mockTranslateService: jest.Mocked<TranslateService>;
  let mockReceiptService: jest.Mocked<ReceiptService>;
  let mockReceiptManagementService: jest.Mocked<ReceiptManagementService>;
  let mockReceiptDataService: jest.Mocked<ReceiptDataService>;

  // Mock Data for the new structure
  const mockShareData = {
    shareType: 'WHATSAPP',
    recipientPhone: '254712345678',
    recipientEmail: null,
    clientName: 'Test Client',
  };

  beforeEach(async () => {
    // Initialize mocks
    mockSessionStorageService = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      get: jest.fn(),
    } as any;
    mockGlobalMessagingService = {
      displaySuccessMessage: jest.fn(),
      displayErrorMessage: jest.fn(),
    } as any;
    mockReportsService = {
      generateReport: jest.fn(),
    } as any;
    mockRouter = {
      navigate: jest.fn(),
    } as any;
    mockTranslateService = {
      instant: jest.fn().mockReturnValue('Translated Message'),
    } as any;
    mockReceiptService = {
      updateReceiptStatus: jest.fn(),
    } as any;
    mockReceiptManagementService = {
      shareReceipt: jest.fn(),
    } as any;
    mockReceiptDataService = {
      clearReceiptData: jest.fn(),
      clearFormState: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PreviewReceiptComponent, MockTranslatePipe],
      imports: [RouterTestingModule],
      providers: [
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: ReceiptManagementService, useValue: mockReceiptManagementService },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
      ],
    }).compileComponents();

    // Mock window functions
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/mock-url');

    fixture = TestBed.createComponent(PreviewReceiptComponent);
    component = fixture.componentInstance;
  });

  // Helper to centralize mock setup for `ngOnInit`
  const setupMocksForInit = (shareData: any = mockShareData, receiptingScreen: 'Y' | 'N' = 'N') => {
    mockSessionStorageService.getItem.mockImplementation((key: string) => {
      switch (key) {
        case 'defaultOrg': return JSON.stringify({ id: 1 });
        case 'selectedOrg': return null;
        case 'receiptNo': return '12345';
        case 'printed': return 'N';
        case 'receipting': return receiptingScreen;
        case 'sharePreviewData': return shareData ? JSON.stringify(shareData) : null;
        default: return null;
      }
    });
    mockReportsService.generateReport.mockReturnValue(of(new Blob()));
  };

  it('should create', () => {
    setupMocksForInit(null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize properties correctly from session storage', () => {
      setupMocksForInit();

      fixture.detectChanges();

      expect(component.receiptNo).toBe(12345);
      expect(component.printStatus).toBe('N');
      expect(component.receiptingScreen).toBe('N');
      expect(component.shareData).toEqual(mockShareData);
      expect(mockReportsService.generateReport).toHaveBeenCalled();
    });

    it('should handle missing sharePreviewData gracefully', () => {
      setupMocksForInit(null);
      fixture.detectChanges();
      expect(component.shareData).toBeNull();
    });
  });

  describe('ngOnInit - agent/account code handling', () => {
    it('should prioritize agentCode if available', () => {
      mockSessionStorageService.getItem.mockImplementation((key: string) => {
        switch (key) {
          case 'defaultOrg': return JSON.stringify({ id: 1 });
          case 'receiptNo': return '999';
          case 'agentCode': return '456';
          case 'accountCode': return '789';
          case 'printed': return 'N';
          case 'receipting': return 'N';
          default: return null;
        }
      });
      mockReportsService.generateReport.mockReturnValue(of(new Blob()));

      fixture.detectChanges();

      expect(component.agentCode).toBe(456);
      expect(component.accountCode).toBeNull();
      expect(component.code).toBe(456);
    });

    it('should fallback to accountCode if agentCode is missing', () => {
      mockSessionStorageService.getItem.mockImplementation((key: string) => {
        switch (key) {
          case 'defaultOrg': return JSON.stringify({ id: 1 });
          case 'receiptNo': return '999';
          case 'accountCode': return '789';
          case 'printed': return 'N';
          case 'receipting': return 'N';
          default: return null;
        }
      });
      mockReportsService.generateReport.mockReturnValue(of(new Blob()));

      fixture.detectChanges();

      expect(component.accountCode).toBe(789);
      expect(component.agentCode).toBeNull();
      expect(component.code).toBe(789);
    });
  });

  describe('getReceiptToPrint', () => {
    beforeEach(() => {
      setupMocksForInit();
      fixture.detectChanges();
    });

    it('should set filePath on successful report generation', () => {
      const mockBlob = new Blob(['pdf-content']);
      mockReportsService.generateReport.mockReturnValue(of(mockBlob));

      component.getReceiptToPrint();

      expect(component.filePath).toBe('blob:http://localhost/mock-url');
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });
  });

  describe('getReceiptToPrint - error path', () => {
    it('should show error and navigate on failed report generation', () => {
      mockReportsService.generateReport.mockReturnValue(
        throwError(() => ({ error: { msg: 'PDF Fail' } }))
      );
      const navSpy = jest.spyOn(component as any, 'navigateBackToPrintTab');

      component.getReceiptToPrint();

      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Translated Message',
        'PDF Fail'
      );
      expect(navSpy).toHaveBeenCalled();
    });
  });

  describe('postClientDetails', () => {
    beforeEach(() => {
      setupMocksForInit();
      fixture.detectChanges();
    });

    it('should build the correct payload from `shareData`', () => {
      mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Success' }));
      mockReceiptService.updateReceiptStatus.mockReturnValue(of({ msg: 'Updated' }));

      component.postClientDetails();

      const expectedBody = {
        shareType: mockShareData.shareType,
        recipientEmail: mockShareData.recipientEmail,
        recipientPhone: mockShareData.recipientPhone,
        clientName: mockShareData.clientName,
        receiptNumber: String(component.receiptNo),
        orgCode: String(component.defaultOrg.id),
      };

      expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalledWith(expectedBody);
    });

    it('should update status and navigate to Management if receiptingScreen is "N"', () => {
      const navSpy = jest.spyOn(component, 'navigateToReceiptManagement');
      component.receiptingScreen = 'N';
      mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Success' }));
      mockReceiptService.updateReceiptStatus.mockReturnValue(of({ msg: 'Updated' }));

      component.postClientDetails();

      expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalled();
      expect(navSpy).toHaveBeenCalled();
    });

    it('should update status and navigate to Capture if receiptingScreen is "Y"', () => {
      const navSpy = jest.spyOn(component, 'navigateToReceiptCapture');
      component.receiptingScreen = 'Y';
      mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Success' }));
      mockReceiptService.updateReceiptStatus.mockReturnValue(of({ msg: 'Updated' }));

      component.postClientDetails();

      expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalled();
      expect(navSpy).toHaveBeenCalled();
    });

    it('should NOT update status if printStatus is "Y"', () => {
      component.printStatus = 'Y';
      mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Success' }));

      component.postClientDetails();

      expect(mockReceiptService.updateReceiptStatus).not.toHaveBeenCalled();
    });
  });

  describe('postClientDetails - error path', () => {
    it('should display error if shareReceipt fails', () => {
      mockReceiptManagementService.shareReceipt.mockReturnValue(
        throwError(() => ({ error: { msg: 'Share failed' } }))
      );

      component.postClientDetails();

      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Translated Message',
        'Share failed'
      );
    });
  });

  describe('updatePrintStatus', () => {
    it('should display success message on success', () => {
      mockReceiptService.updateReceiptStatus.mockReturnValue(of({ msg: 'Updated!' }));

      component.receiptNo = 123;
      component.updatePrintStatus();

      expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([123]);
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        '',
        'Updated!'
      );
    });

    it('should display error message on failure', () => {
      mockReceiptService.updateReceiptStatus.mockReturnValue(
        throwError(() => ({ error: { msg: 'Update failed' } }))
      );

      component.receiptNo = 123;
      component.updatePrintStatus();

      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Translated Message',
        'Update failed'
      );
    });
  });

  describe('checkActiveScreen', () => {
    it('should navigate to Management if receiptingScreen is "N"', () => {
      const navSpy = jest.spyOn(component, 'navigateToReceiptManagement');
      component.receiptingScreen = 'N';

      component.checkActiveScreen();

      expect(navSpy).toHaveBeenCalled();
    });

    it('should navigate to Capture if receiptingScreen is "Y"', () => {
      const navSpy = jest.spyOn(component, 'navigateToReceiptCapture');
      component.receiptingScreen = 'Y';

      component.checkActiveScreen();

      expect(navSpy).toHaveBeenCalled();
    });
  });

  describe('Navigation Helpers', () => {
    it('navigateToReceiptManagement should clean up session and navigate', () => {
      component['navigateBackToPrintTab']();
      expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('printTabStatus', JSON.stringify(true));
      expect(mockSessionStorageService.removeItem).toHaveBeenCalledWith('sharePreviewData');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-management']);
    });

    it('navigateToReceiptCapture should clear services and navigate', () => {
      component.navigateToReceiptCapture();
      expect(mockReceiptDataService.clearReceiptData).toHaveBeenCalled();
      expect(mockReceiptDataService.clearFormState).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-capture']);
    });
  });
});
