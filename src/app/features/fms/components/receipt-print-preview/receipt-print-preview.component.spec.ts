import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptPrintPreviewComponent } from './receipt-print-preview.component';
import { Router } from '@angular/router';
import { OrganizationDTO } from '../../../crm/data/organization-dto';
import { ReportsDto } from '../../../../shared/data/common/reports-dto';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReportsService } from '../../../../shared/services/reports/reports.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { ReceiptService } from '../../services/receipt.service';
import { of, throwError } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
//mock all services here
const mockSessionStorageService = {
  getItem: jest.fn((key: string) => {
    switch (key) {
      case 'receiptNumber':
        return JSON.stringify(1244);
      case 'defaultOrg':
        return JSON.stringify({ id: 'ORG001' });
      case 'selectedOrg':
        return JSON.stringify({ ID: 'ORG002' });
      default:
        return null;
    }
  }),
};
const mockReportsService = {
  generateReport: jest
    .fn()
    .mockReturnValue(of(new Blob(['fake-pdf'], { type: 'application/pdf' }))),
};
const mockGlobalMessagingService = {
  displayErrorMessage: jest.fn(),
  displaySuccessMessage: jest.fn(),
};
const mockReceiptService = {
  updateReceiptStatus: jest
    .fn()
    .mockReturnValue(of({ message: 'updated successfully' })),
};
const mockRouter = {
  navigate: jest.fn(),
};
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ReceiptPrintPreviewComponent', () => {
  let component: ReceiptPrintPreviewComponent;
  let fixture: ComponentFixture<ReceiptPrintPreviewComponent>;

  beforeEach(async () => {
    (window.URL.createObjectURL as jest.Mock) = jest.fn();
    jest.clearAllMocks(); // Add this to reset spy calls between tests
    await TestBed.configureTestingModule({
      declarations: [ReceiptPrintPreviewComponent, MockTranslatePipe],

      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        {
          provide: GlobalMessagingService,
          useValue: mockGlobalMessagingService,
        },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: ReceiptService, useValue: mockReceiptService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReceiptPrintPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create a component', () => {
    expect(component).toBeTruthy();
  });
  it('should call getReceiptToPrint and set filepath on success', () => {
    expect(mockReportsService.generateReport).toHaveBeenCalled();
  });
  it('should navigate to receipt capture page', () => {
    component.navigateToReceiptCapture();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/home/fms/receipt-management',
    ]);
  });
  it('should update print status and navigate on success', () => {
    // Arrange
    const mockResponse = { message: 'Print status updated' };
    const updateStatusSpy = jest
      .spyOn(mockReceiptService, 'updateReceiptStatus')
      .mockReturnValue(of(mockResponse));
    component.receiptNumber = 123;

    // Act
    component.updatePrintStatus();

    // Assert
    expect(updateStatusSpy).toHaveBeenCalledWith([123]);
    expect(
      mockGlobalMessagingService.displaySuccessMessage
    ).toHaveBeenCalledWith('success:', mockResponse.message);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/home/fms/receipt-management',
    ]);
  });
  it('should show error message if updateReceiptStatus fails', () => {
    // Arrange
    const mockError = { error: { msg: 'Update failed' } };
    const updateStatusSpy = jest
      .spyOn(mockReceiptService, 'updateReceiptStatus')
      .mockReturnValue(throwError(() => mockError));
    component.receiptNumber = 456;

    // Act
    component.updatePrintStatus();

    // Assert
    expect(updateStatusSpy).toHaveBeenCalledWith([456]);
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'failed',
      'Update failed'
    );
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
  it('should call generateReport and set filePath on success', () => {
    const mockPdfResponse = new Blob(['test pdf'], { type: 'application/pdf' });
    const mockUrl = 'blob:http://test/123456';

    const reportSpy = jest
      .spyOn(mockReportsService, 'generateReport')
      .mockReturnValue(of(mockPdfResponse));

    const urlSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl);

    component.receiptNumber = 123;
    component.defaultOrg = { id: 'ORG001' } as any;
    component.selectedOrg = { id: 'ORG002' } as any;

    component.getReceiptToPrint();

    expect(reportSpy).toHaveBeenCalled();
    expect(component.filePath).toBe(mockUrl);
    expect(urlSpy).toHaveBeenCalledWith(mockPdfResponse);
  });
  it('should show error message if generateReport fails', () => {
    // Arrange
    component.receiptNumber = 999;
    component.defaultOrg = { id: 'ORG001' } as any;
    component.selectedOrg = { id: 'ORG002' } as any;

    const mockError = { error: { status: 'Error status text' } };
    jest
      .spyOn(mockReportsService, 'generateReport')
      .mockReturnValue(throwError(() => mockError));

    const messageSpy = jest.spyOn(
      mockGlobalMessagingService,
      'displayErrorMessage'
    );

    // Act
    component.getReceiptToPrint();

    // Assert
    expect(messageSpy).toHaveBeenCalledWith('Error', 'Error status text');
  });
  it('should call generateReport and set filePath on success', () => {
    const mockPdfResponse = new Blob(['PDF content'], {
      type: 'application/pdf',
    });
    const mockUrl = 'blob:http://test/receipt';

    const mockReportPayload = {
      encodeFormat: 'RAW',
      params: [
        { name: 'UP_RCT_NO', value: '123' },
        { name: 'UP_ORG_CODE', value: '456' },
      ],
      reportFormat: 'PDF',
      rptCode: 300,
      system: 'CRM',
    };

    component.receiptNumber = 123;
    component.defaultOrg = { id: 456 } as any;

    const generateReportSpy = jest
      .spyOn(mockReportsService, 'generateReport')
      .mockReturnValue(of(mockPdfResponse));

    const createObjectUrlSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue(mockUrl);

    // Act
    component.getReceiptToPrint();

    // Assert
    expect(generateReportSpy).toHaveBeenCalledWith(mockReportPayload);
    expect(createObjectUrlSpy).toHaveBeenCalledWith(mockPdfResponse);
    expect(component.filePath).toBe(mockUrl);
  });
});
