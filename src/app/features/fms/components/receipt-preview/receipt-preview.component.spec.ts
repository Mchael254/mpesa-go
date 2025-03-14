import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ReceiptPreviewComponent } from './receipt-preview.component';
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

import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-dynamic-breadcrumb',
  template: ''
})
class MockDynamicBreadcrumbComponent {
  @Input() breadCrumbItems: any[]; // Define the input property
}

describe('ReceiptPreviewComponent', () => {
  let component: ReceiptPreviewComponent;
  let fixture: ComponentFixture<ReceiptPreviewComponent>;
  let mockReportService: any;
  let mockGlobalMessagingService: any;
  let mockRouter: any;
  let mockReceiptDataService: any;
  let mockSessionStorageService: any;
  let mockReceiptService: any;
  let mockTranslateService: any;

  beforeEach(async () => {
    mockReportService = {
      generateReport: jest.fn().mockReturnValue(of(new Blob())),
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
        if (key === 'defaultOrg') return JSON.stringify({ id: 1, name: 'Default Org' });
        if (key === 'selectedOrg') return JSON.stringify({ id: 2, name: 'Selected Org' });
        return null;
      }),
    };
    mockReceiptService = {
      updateReceiptStatus: jest.fn().mockReturnValue(of({ message: 'Update successful' })),
    };
    mockTranslateService = {
      setDefaultLang: jest.fn(),
      use: jest.fn(),
      instant: jest.fn().mockReturnValue('translated value'),
      get: jest.fn().mockReturnValue(of('translated message')),
    };

    await TestBed.configureTestingModule({
      declarations: [ReceiptPreviewComponent,MockDynamicBreadcrumbComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        PdfViewerModule
      ],
      providers: [
        { provide: ReportsService, useValue: mockReportService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: Router, useValue: mockRouter },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptPreviewComponent);
    component = fixture.componentInstance;

    // Initialize component and trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();
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
    component.ngOnInit();
     expect(component.receiptResponse).toBe(123);
      expect(component.orgId).toBe(456);
  });

    it('should call displayErrorMessage if generateReport errors', () => {
     mockReportService.generateReport.mockReturnValue(throwError(() => ({ error: { status: 'error' } })));

        component.getReceipt();
     fixture.detectChanges();

     expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'error');
      });

    it('should clear receipt data and navigate to receipt capture on navigateToReceiptCapture', () => {
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
     component.receiptResponse = 123; // Ensure it's a number
     component.updatePrintStatus();
        fixture.detectChanges();

    expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([123]);
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalled();
     });

    it('should display error message on updatePrintStatus error', () => {
       mockReceiptService.updateReceiptStatus.mockReturnValue(throwError(() => ({ error: { msg: 'Update failed' } })));
         component.receiptResponse = 123; // Ensure it's a number
     component.updatePrintStatus();
     fixture.detectChanges();

         expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([123]);
         expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('failed', 'Update failed');
     });
 it('should download success', () => {
        // Mocking document object
         const mockLink = {
             href: 'test',
               download: 'receipt',
            click: jest.fn(),
       };
      document.createElement = jest.fn().mockReturnValue(mockLink);
         component.filePath = 'test';
       component.download();

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      });

    it('should display error if filepath is invalid during download', () => {
         component.filePath = '';
      component.download();
       expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('failed!', 'Download failed: Invalid file URL');
    });
});