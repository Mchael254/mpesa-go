import { Component } from '@angular/core';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { QuotationDetails, ReportParams, ReportResponse } from '../../data/quotationsDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger, UtilService } from "../../../../../../shared/services";
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DmsDocument } from 'src/app/shared/data/common/dmsDocument';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';

const log = new Logger('QuotationReportComponent');


@Component({
  selector: 'app-quotation-report',
  templateUrl: './quotation-report.component.html',
  styleUrls: ['./quotation-report.component.css'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        height: '*', // Expand to fit content
        opacity: 1,
        overflow: 'hidden',
      })),
      state('closed', style({
        height: '0', // Collapse to 0 height
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out') // Smooth transition
      ]),
    ]),
  ],
})
export class QuotationReportComponent {
  reports: any[] = [];
  selectedReports: ReportResponse[] = [];
  fetchedReports: ReportResponse[] = [];
  currentIndex: number = 0;
  currentReport!: ReportResponse;
  activeIndex: number = 1;
  reportBlobs: { [code: string]: Blob } = {};
  quotationCodeString: string;
  quotationCode: number
  filePath: string = '';
  zoomLevel = 1;
  public isClientCardDetailsOpen = false;
  showClients: boolean = true;
  showClientColumnModal = false;
  columnModalPosition = { top: '0px', left: '0px' };
  clientDocColumns: { field: string; header: string; visible: boolean, filterable: boolean }[] = [];
  quotationDetails: QuotationDetails;
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  errorMessage = '';
  successMessage = '';
  loggedInUser: string;
  clientCode: string;
  clientDetails: ClientDTO;
  clientDocuments: DmsDocument[];
  selectedClientDoc: DmsDocument;

  constructor(
    public quotationService: QuotationsService,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
    private dmsService: DmsService,


  ) { }
  ngOnInit(): void {

    this.quotationCodeString = sessionStorage.getItem('quotationCode');
    this.quotationCode = Number(sessionStorage.getItem('quotationCode'));
    log.debug("two codes", this.quotationCode, this.quotationCodeString)
    log.debug('quotationCode', this.quotationCodeString)
    this.fetchReports()
    const quotationDetails = JSON.parse(sessionStorage.getItem("quotationDetails"));
    log.debug("Quotation details:", quotationDetails)
    this.quotationDetails = quotationDetails
    const clientCode = this.quotationDetails.clientCode
    this.clientCode = clientCode.toString()
    const clientDetails = JSON.parse(sessionStorage.getItem('clientDetails'))
    this.clientDetails = clientDetails
    this.fetchClientDoc(clientCode)
    this.loggedInUser = this.quotationDetails.preparedBy
  }

  fetchReports() {
    const system = 37;
    const applicationLevel = "QUOTE"
    this.quotationService.fetchReports(system, applicationLevel)
      .subscribe({
        next: (res: any[]) => {
          this.fetchedReports = res
          if (res) {

            if (this.fetchedReports?.length) {
              this.currentIndex = 0;
              this.currentReport = this.fetchedReports[0];
              this.selectedReports = [this.currentReport]; // show first as checked
              this.loadAndShowReport(this.currentReport);
            }

          }
        },
        error: (err: any) => {
          const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);
          this.globalMessagingService.displayErrorMessage("Error", backendMsg);
        }
      });
  }
  onReportClick(report: ReportResponse) {
    const isSelected = this.selectedReports?.some(r => r.code === report.code);

    // Simulate checkbox toggle behavior
    const event = { checked: !isSelected };

    if (!isSelected) {
      // Add to selected reports
      this.selectedReports = [...(this.selectedReports || []), report];
    } else {
      // Remove from selected reports
      this.selectedReports = this.selectedReports.filter(r => r.code !== report.code);
    }

    // Call your existing toggle logic
    this.onReportToggle(event, report);
  }

  onReportToggle(event: any, report: ReportResponse) {

    if (event.checked) {
      this.currentIndex = this.fetchedReports.findIndex(r => r.code === report.code);
      this.currentReport = report;
      this.loadAndShowReport(report);
    } else {

      if (this.currentReport && this.currentReport.code === report.code) {
        if (this.selectedReports && this.selectedReports.length) {
          this.currentReport = this.selectedReports[0];
          this.currentIndex = this.fetchedReports.findIndex(r => r.code === this.currentReport.code);
          this.loadAndShowReport(this.currentReport);
        } else {
          this.currentReport = null;
          this.filePath = null;
        }
      }
    }
  }


  toggleReport(direction: 'prev' | 'next') {
    if (!this.fetchedReports || this.fetchedReports.length === 0) return;

    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next' && this.currentIndex < this.fetchedReports.length - 1) {
      this.currentIndex++;
    } else {
      return;
    }

    this.currentReport = this.fetchedReports[this.currentIndex];

    // visually select only the active report (this will uncheck others)
    this.selectedReports = [this.currentReport];

    // generate and preview
    this.loadAndShowReport(this.currentReport);
  }


  private loadAndShowReport(report: ReportResponse) {
    this.quotationService.fetchReportParams(report.code).subscribe({
      next: (res: ReportParams) => this.generateReport(res),
      error: (err: any) => {
        const backendMsg = err.error?.message || err.message || 'An unexpected error occurred';
        this.globalMessagingService.displayErrorMessage("Error", backendMsg);
      }
    });
  }
  generateReport(selectedReportDetails: ReportParams) {
    const reportCode = selectedReportDetails.rptCode;

    // Check if report is already generated and cached
    if (this.reportBlobs[reportCode]) {
      console.log("Report already generated, downloading from cache...");
      this.filePath = URL.createObjectURL(this.reportBlobs[reportCode]);
      // this.downloadReportByCode(reportCode, selectedReportDetails.reportName);
      return;
    }

    // Build payload for backend
    const value = this.quotationCode;
    const reportPayload = {
      params: selectedReportDetails.params.map(param => ({
        name: param.name,   // transform if needed
        value: value
      })),
      rptCode: reportCode,
      system: "GIS",
      reportFormat: "PDF",
      encodeFormat: "RAW"
    };

    console.log("Generating report payload:", reportPayload);

    // Call backend
    this.quotationService.generateReports(reportPayload).subscribe({
      next: (res: Blob) => {
        // Create PDF blob
        const blob = new Blob([res], { type: 'application/pdf' });
        this.filePath = URL.createObjectURL(blob);
        log.debug("Blob URL:", this.filePath);
        // Cache the blob
        this.reportBlobs[reportCode] = blob;

        console.log("Report generated and cached:", reportCode);

        // this.downloadReportByCode(reportCode, selectedReportDetails.reportName);
      },
      error: (err: any) => {
        const backendMsg = err.error?.message || err.message || 'An unexpected error occurred';
        console.error("Error generating report:", backendMsg);
        this.globalMessagingService.displayErrorMessage("Error", backendMsg);
      }
    });
  }

  downloadReports(reports: any[]) {
    if (!reports || reports.length === 0) return;

    reports.forEach(report => {
      const reportCode = report.rptCode || report.code;
      this.downloadReportByCode(reportCode, report.description);
    });
  }

  downloadReportByCode(reportCode: number, fileName?: string) {
    const blob = this.reportBlobs[reportCode];
    if (!blob) {
      console.warn("No cached blob found for report:", reportCode);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'report'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Report downloaded:", reportCode);
  }


  printReport(report: any) {
    const reportCode = report.rptCode || report.code;
    const blob = this.reportBlobs[reportCode];

    if (!blob) {
      console.warn("No cached blob found for report:", reportCode);
      this.globalMessagingService.displayInfoMessage('Info', 'Select a report to continue');
      return;
    }

    this.spinner.show();

    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        this.spinner.hide();
      }

      iframe.contentWindow?.addEventListener("afterprint", () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      });
    };

    document.body.appendChild(iframe);
  }
  toggleClientCardDetails() {
    this.isClientCardDetailsOpen = !this.isClientCardDetailsOpen;
  }
  onDragStart(event: MouseEvent): void {
    this.dragging = true;
    this.dragOffset.x = event.clientX - parseInt(this.columnModalPosition.left, 10);
    this.dragOffset.y = event.clientY - parseInt(this.columnModalPosition.top, 10);
  }

  onDragMove(event: MouseEvent): void {
    if (this.dragging) {
      this.columnModalPosition.top = `${event.clientY - this.dragOffset.y}px`;
      this.columnModalPosition.left = `${event.clientX - this.dragOffset.x}px`;
    }
  }

  onDragEnd(): void {
    this.dragging = false;
  }
  toggleClientCard(iconElement: HTMLElement): void {
    this.showClients = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + 30;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showClientColumnModal = true;
  }

  setClientDocColumns(doc: any) {
    const excludedFields = [
    ];
    const defaultVisibleClientDocFields = ['name', 'docType', 'dateCreated', 'modifiedBy', 'actions'];

    const keys = Object.keys(doc).filter(key => !excludedFields.includes(key));

    // Separate default fields and the rest
    const defaultFields = defaultVisibleClientDocFields.filter(f => keys.includes(f));
    const otherFields = keys.filter(k => !defaultVisibleClientDocFields.includes(k));

    // Strictly order = defaults first, then others
    const orderedKeys = [...defaultFields, ...otherFields];

    this.clientDocColumns = orderedKeys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleClientDocFields.includes(key),
      truncate: defaultVisibleClientDocFields.includes(key),
      filterable: true,
      sortable: true
    }));

    this.clientDocColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false });
    log.debug("Client doc Columns", this.clientDocColumns)
    // Restore from sessionStorage if exists
    const saved = sessionStorage.getItem('clientDocColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.clientDocColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }
  }


  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
  fetchClientDoc(clientCode: any) {
    log.debug("Selected Client code:", clientCode)
    this.dmsService.fetchDocumentsByClientCode(clientCode)
      .subscribe({
        next: (res: DmsDocument[]) => {
          log.debug('Response after fetching clients DOCS:', res)
          this.clientDocuments = res
          if (this.clientDocuments && this.clientDocuments.length > 0) {
            this.setClientDocColumns(this.clientDocuments[0]);
          }
        },
        error: (err: any) => {
          const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);
          this.globalMessagingService.displayErrorMessage("Error", backendMsg);
        }
      });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.validateAndSetFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  validateAndSetFile(file: File): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Check if file exists
    if (!file) {
      return;
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'File size exceeds the maximum limit of 10MB';
      return;
    }

    // Check file type (optional - you can customize accepted types)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];


    if (!allowedTypes.includes(file.type)) {
      this.errorMessage =
        'Please upload a valid document type (PDF, DOC, DOCX, TXT, PNG, JPG, JPEG)';
      return;
    }

    this.selectedFile = file;
    this.selectedFile && this.addClientDocuments(this.selectedFile);
  }
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'pi pi-image';
      case 'txt':
      case 'log':
        return 'pi pi-file';
      default:
        return 'pi pi-file'; // fallback
    }
  }
  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';

    ;
  }
  addClientDocuments(selectedFile: any) {
    const file = selectedFile
    const reader = new FileReader();

    reader.onload = () => {
      // Convert to base64 string (remove prefix like "data:application/pdf;base64,")
      const base64String = (reader.result as string).split(',')[1];
      const clientName = (this.clientDetails?.firstName ?? '') + ' ' + (this.clientDetails?.lastName ?? '')
      let clientDocPayload: DmsDocument = {
        actualName: selectedFile.name,
        userName: this.loggedInUser,
        docType: file.type,
        docData: base64String,
        originalFileName: file.name,
        clientName: clientName,
        clientCode: this.clientCode,
      }

      this.dmsService.saveClientDocs(clientDocPayload).subscribe({
        next: (res: any) => {
          log.info(`document uploaded successfully!`, res);
          this.globalMessagingService.displaySuccessMessage('Success', 'Document uploaded successfully');
          this.fetchClientDoc(this.clientCode)
        },
        error: (err) => {
          log.info(`upload failed!`, err)
        }
      });
    }
    reader.readAsDataURL(file);
  }
  onSelectClientDoc(event: any) {
    this.selectedClientDoc = event;
    log.info("Selected client doc", this.selectedClientDoc)
  }
}
