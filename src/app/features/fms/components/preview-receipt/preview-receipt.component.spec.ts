import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import {OrganizationDTO} from '../../../../features/crm/data/organization-dto';
import { GlobalMessagingService} from '../../../../shared/services/messaging/global-messaging.service';

import {ReportsService} from '../../../../shared/services/reports/reports.service';

import {SessionStorageService} from '../../../../shared/services/session-storage/session-storage.service';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { ReceiptService } from '../../services/receipt.service';

import { PreviewReceiptComponent } from './preview-receipt.component';





import { Pipe, PipeTransform } from '@angular/core'; // <-- Import Pipe and PipeTransform



// ======================================================================
//        *** THE FIRST PART OF THE FIX IS HERE: Create a Mock Pipe ***
// This is a simple dummy pipe that takes any value and just returns it.
// It allows the template to compile without needing the full ngx-translate module.
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
// ======================================================================


describe('PreviewReceiptComponent', () => {
  let component: PreviewReceiptComponent;
  let fixture: ComponentFixture<PreviewReceiptComponent>;

  let mockSessionStorageService: Partial<jest.Mocked<SessionStorageService>>;
  let mockGlobalMessagingService: Partial<jest.Mocked<GlobalMessagingService>>;
  let mockReportsService: Partial<jest.Mocked<ReportsService>>;
  let mockRouter: Partial<jest.Mocked<Router>>;
  let mockTranslateService: Partial<jest.Mocked<TranslateService>>;
  let mockReceiptService: Partial<jest.Mocked<ReceiptService>>;
  let mockReceiptManagementService: Partial<jest.Mocked<ReceiptManagementService>>;

  const mockOrg: OrganizationDTO = { id: 101, name: 'Test Org' } as OrganizationDTO;

  beforeEach(async () => {
    mockSessionStorageService = { /*...*/ };
    // ... all other mock service initializations remain the same
    mockSessionStorageService = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      };
      mockGlobalMessagingService = {
        displaySuccessMessage: jest.fn(),
        displayErrorMessage: jest.fn(),
      };
      mockReportsService = {
        generateReport: jest.fn(),
      };
      mockRouter = {
        navigate: jest.fn(),
      };
      mockTranslateService = {
        instant: jest.fn(),
      };
      mockReceiptService = {
        updateReceiptStatus: jest.fn(),
      };
      mockReceiptManagementService = {
        shareReceipt: jest.fn(),
      };

    await TestBed.configureTestingModule({
      // ======================================================================
      //        *** THE SECOND PART OF THE FIX IS HERE: Declare the Mock Pipe ***
      declarations: [PreviewReceiptComponent, MockTranslatePipe],
      // ======================================================================
      imports: [RouterTestingModule],
      providers: [
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: ReceiptManagementService, useValue: mockReceiptManagementService },
      ],
    }).compileComponents();

    // --- Default Mock Setups ---
    mockTranslateService.instant.mockReturnValue('Translated Error Message');
    window.URL.createObjectURL = jest.fn();
    jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock-url');

    fixture = TestBed.createComponent(PreviewReceiptComponent);
    component = fixture.componentInstance;
    
    (component as any).reportService = mockReportsService;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ... All your 'it' blocks will now work ...
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize properties from session storage and call getReceiptToPrint', () => {
      // Arrange
      mockSessionStorageService.getItem.mockImplementation((key: string) => {
        switch (key) {
          case 'defaultOrg': return JSON.stringify(mockOrg);
          case 'receiptNo': return '12345';
          case 'recipient': return 'test@example.com';
          case 'shareType': return 'EMAIL';
          case 'printed': return 'N';
          default: return null;
        }
      });
      mockReportsService.generateReport.mockReturnValue(of(new Blob()));

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.defaultOrg).toEqual(mockOrg);
      expect(component.receiptNo).toBe(12345);
      expect(component.recipient).toBe('test@example.com');
      expect(component.shareMethod).toBe('EMAIL');
      expect(component.printStatus).toBe('N');
      expect(mockReportsService.generateReport).toHaveBeenCalled();
    });
  });

  describe('getReceiptToPrint', () => {
    it('should set filePath on successful report generation', () => {
      // Arrange
      const mockBlob = new Blob(['pdf-content'], { type: 'application/pdf' });
      mockReportsService.generateReport.mockReturnValue(of(mockBlob));

      // Act
      component.getReceiptToPrint();

      // Assert
      expect(component.filePath).toBe('blob:http://localhost/mock-url');
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });

    it('should show error and navigate on failed report generation', () => {
      // Arrange
      mockReportsService.generateReport.mockReturnValue(throwError(() => ({ error: { msg: 'PDF Generation Failed' } })));

      // Act
      component.getReceiptToPrint();

      // Assert
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-management']);
    });
  });

  describe('postClientDetails', () => {
    beforeEach(() => {
      component.receiptNo = 12345;
      component.recipient = 'test@example.com';
      component.shareMethod = 'EMAIL';
    });

    it('should call shareReceipt, updatePrintStatus, show success, and navigate if printStatus is "N"', () => {
      // Arrange
      component.printStatus = 'N';
      mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Shared successfully' }));
      mockReceiptService.updateReceiptStatus.mockReturnValue(of({ msg: 'Status updated' }));

      // Act
      component.postClientDetails();

      // Assert
      expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalled();
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('success', 'Shared successfully');
      expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([12345]);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-management']);
    });

    it('should call shareReceipt, show success, and navigate but NOT updatePrintStatus if printStatus is "Y"', () => {
      // Arrange
      component.printStatus = 'Y';
      mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Shared successfully' }));

      // Act
      component.postClientDetails();

      // Assert
      expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalled();
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('success', 'Shared successfully');
      expect(mockReceiptService.updateReceiptStatus).not.toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-management']);
    });

    it('should show an error message and NOT navigate if shareReceipt fails', () => {
      // Arrange
      mockReceiptManagementService.shareReceipt.mockReturnValue(throwError(() => ({ error: { msg: 'Sharing failed' } })));

      // Act
      component.postClientDetails();

      // Assert
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalled();
      expect(mockReceiptService.updateReceiptStatus).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('navigateToReceiptManagement', () => {
    it('should navigate to the receipt management page', () => {
      // Act
      component.navigateToReceiptManagement();

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-management']);
    });
  });

});