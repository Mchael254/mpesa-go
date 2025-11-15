import { Component, Input, SimpleChanges } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Router } from '@angular/router';
import { Logger } from '../../../../../../shared/services';
import * as XLSX from 'xlsx';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { PolicyElectronicDataDTO } from 'src/app/features/gis/data/quotations-dto';

const log = new Logger('ImportRiskComponent');
interface ColumnMapping {
  [systemField: string]: string;
}

interface SystemField {
  key: string;
  label: string;
  required: boolean;
}
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  @Input() selectedProduct!: any;




  steps = quoteStepsData;
  subclassList: any;
  quotationNum: any;
  quotationDetails: any;
  columns: any;
  data: any = [];
  selectedRisks: any[] = [];
  importForm: FormGroup;
  quoteAction: string = "A";
  quotationCode: number;
  quotationRiskData: any;
  riskCode: number;
  quoteProductCode: number;
  selectedClientCode: number;
  selectedCoverFromDate: any;
  selectedCoverToDate: any;
  allMatchingSubclasses = [];
  selectedProductCode: number;
  selectedSubclassCode: number;
  dynamicRegexPattern: any;
  regexPattern: any;


  // New properties for mapping functionality
  showMappingModal: boolean = false;
  userFileHeaders: string[] = []; // This should be string[], not {}
  userFileData: any[] = [];
  mapping: ColumnMapping = {};
  mappedData: any[] = [];
  // Define your system's expected fields
  systemFields = [
    { key: 'BinderCode', label: 'Binder Code', required: false },
    { key: 'PremiumBind', label: 'Premium Bind', required: false },
    { key: 'CoverTypeCode', label: 'Cover Type Code', required: false },
    { key: 'CoverTypeShortDesc', label: 'Cover Type Description', required: false },
    { key: 'WEF', label: 'WEF', required: false },
    { key: 'WET', label: 'WET', required: false },
    { key: 'ClientCode', label: 'Client Code', required: true },
    { key: 'ClientName', label: 'Client Name', required: false },
    { key: 'IsNCDapplicable', label: 'NCD Applicable', required: false },
    { key: 'ItemDesc', label: 'Item Description', required: false },
    { key: 'Location', label: 'Location', required: false },
    { key: 'NCDlevel', label: 'NCD Level', required: false },
    { key: 'ProductCode', label: 'Product Code', required: false },
    { key: 'PropertyId', label: 'Property ID', required: false },
    { key: 'RiskPremAmount', label: 'Risk Premium Amount', required: false },
    { key: 'SubclassCode', label: 'Subclass Code', required: true },
    { key: 'Town', label: 'Town', required: false }
  ];

  dragging = false;
  dragOffset = { x: 0, y: 0 };
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  errorMessage = '';
  successMessage = '';
  subclassSelected: boolean = false;
  policyData: any;

  allRisks: any[] = [];
  validRisks: any[] = [];
  needsReviewRisks: any[] = [];

  selectedAll: any[] = [];
  selectedValid: any[] = [];
  selectedReview: any[] = [];
  activeTab: 'ALL' | 'VALID' | 'REVIEW' = 'ALL';

  constructor(
    public subclassService: SubclassesService,
    public router: Router,
    private fb: FormBuilder,
    public quotationService: QuotationsService,
    private globalMessagingService: GlobalMessagingService

  ) {
    this.importForm = this.fb.group({
      subclass: [''],
      uploadFile: ['']
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct'] && this.selectedProduct) {
      console.log("Selected Product-risk details:", this.selectedProduct);
      const selectedProductCode = this.selectedProduct?.productCode
      this.selectedProductCode = selectedProductCode
      this.getProductSubclass(this.selectedProductCode);
      this.quotationCode = this.selectedProduct?.quotationCode
      this.quoteProductCode = this.selectedProduct?.code



    }
  }

  ngOnInit(): void {
    // this.getSubclass();

    this.quotationNum = sessionStorage.getItem('quotationNum');
    this.quotationCode = JSON.parse(sessionStorage.getItem("quotationCode"));
    this.quotationDetails = JSON.parse(sessionStorage.getItem('quotationFormDetails') || '{}');
    log.debug("Product code:", this.quotationDetails?.productCode);

    this.selectedClientCode = JSON.parse(sessionStorage.getItem("clientCode"));
    log.debug("selected clientcode", this.selectedClientCode);
    this.selectedCoverFromDate = sessionStorage.getItem("selectedCoverFromDate");
    this.selectedCoverToDate = sessionStorage.getItem("selectedCoverToDate");
    log.debug("selectedCoverFromDate", this.selectedCoverFromDate);
    log.debug("selectedCoverToDate", this.selectedCoverToDate);
    this.selectedProductCode = JSON.parse(sessionStorage.getItem("selectedProduct"));
    log.debug("selectedProductCode-import risk", this.selectedProductCode);

    // Initialize mapping with empty selections
    this.systemFields.forEach(field => {
      this.mapping[field.key] = '';
    });


  }

  // getSubclass() {
  //   this.subclassService.getAllSubclasses().subscribe(data => {
  //     this.subclassList = data;
  //   });
  // }

  finish() {
    // if (this.selectedRisks.length === 0) {
    //   this.router.navigate(['/home/gis/quotation/risk-section-details']);
    //   return;
    // }


    sessionStorage.setItem('selectedRisks', JSON.stringify(this.selectedRisks));
    log.debug('Selected risks stored:', this.selectedRisks);

    this.addRisk();
  }

  // exportTemplate(): void {
  //   const data = [{
  //     BinderCode: '',
  //     PremiumBind: '',
  //     CoverTypeCode: '',
  //     CoverTypeShortDesc: '',
  //     WEF: '',
  //     WET: '',
  //     ClientCode: this.selectedClientCode,
  //     ClientName: '',
  //     IsNCDapplicable: '',
  //     ItemDesc: '',
  //     Location: '',
  //     NCDlevel: '',
  //     ProductCode: '',
  //     PropertyId: '',
  //     RiskPremAmount: '',
  //     SubclassCode: this.selectedSubclassCode,
  //     Town: '',
  //   }];
  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   XLSX.writeFile(workbook, 'Motor_upload_template.xls');
  // }
  exportTemplate(): void {
    const link = document.createElement('a');
    link.href = '../../../../../../../assets/data/Motor_upload_template.csv';
    link.download = 'Motor_upload_template.csv';
    link.click();
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileData = e.target.result;
        const workbook = XLSX.read(fileData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Get all data including headers
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (parsedData && parsedData.length > 0) {
          // Ensure we have an array of strings for headers
          this.userFileHeaders = (parsedData[0] as any[]).map(header =>
            header !== null && header !== undefined ? header.toString() : ''
          ).filter(header => header !== '');

          this.userFileData = this.parseData(parsedData);


          // DEBUG: Check values
          console.log('Headers:', this.userFileHeaders);
          console.log('Data rows:', this.userFileData.length);
          console.log('About to show modal...');
          log.debug("userFileData", this.userFileData)


          // Show mapping modal instead of automatically parsing
          this.showMappingModal = true;

          console.log('showMappingModal is now:', this.showMappingModal);

          log.debug('File headers:', this.userFileHeaders);
          log.debug('File data sample:', this.userFileData.slice(0, 3));
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  private parseData(parsedData: any[]): any[] {
    if (!parsedData || parsedData.length === 0) {
      return [];
    }

    const columns = parsedData[0] as any[];
    const rows = parsedData.slice(1);

    return rows
      .filter((row: any) => row && Array.isArray(row))
      .map((row: any[]) => {
        const rowData: any = {};
        columns.forEach((column: any, index: number) => {
          if (column !== null && column !== undefined) {
            const columnName = column.toString();
            rowData[columnName] = row[index] !== undefined ? row[index] : '';
          }
        });
        return rowData;
      })
      .filter(row => Object.values(row).some(value =>
        value !== null && value !== undefined && value !== ''
      ));
  }

  // Handle mapping confirmation
  onMappingConfirmed(): void {
    // Validate required fields
    const missingRequiredFields = this.systemFields
      .filter(field => field.required && !this.mapping[field.key]);

    if (missingRequiredFields.length > 0) {
      alert(`Please map the following required fields: ${missingRequiredFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Transform the data based on mapping
    this.mappedData = this.userFileData.map(userRow => {
      const mappedRow: any = {};
      for (const [systemKey, userKey] of Object.entries(this.mapping)) {
        if (userKey && userRow[userKey] !== undefined) {
          mappedRow[systemKey] = userRow[userKey];
        } else {
          mappedRow[systemKey] = ''; // Set empty for unmapped fields
        }
      }
      return mappedRow;
    });

    this.data = this.mappedData;

    this.showMappingModal = false;

    // Reset selections when new data is loaded
    this.selectedRisks = [];

    log.debug('Mapped data:', this.mappedData);



  }

  onMappingCancelled(): void {
    this.showMappingModal = false;
    this.userFileHeaders = [];
    this.userFileData = [];
  }

  updateMapping(systemField: string, userColumn: string): void {
    this.mapping[systemField] = userColumn;
  }
  // Handle selection changes
  onSelectionChange(event: any): void {
    this.selectedRisks = event;
    log.debug('Selection changed:', this.selectedRisks);
  }

  // Get current selected risks count
  get selectedCount(): number {
    return this.selectedRisks.length;
  }


  getQuotationRiskPayload(): any[] {
    // Validate that the selectedRisks array is not empty
    if (!this.selectedRisks || this.selectedRisks.length === 0) {
      this.globalMessagingService.displayErrorMessage("Error", "No risks selected. Please select at least one risk.");
      return [];
    }

    // Track if all risks are valid
    let allRisksValid = true;

    const validRisks = this.selectedRisks.filter(risk => {
      // Validate client code
      if (risk.ClientCode !== this.selectedClientCode) {
        this.globalMessagingService.displayErrorMessage('Error', `Client code mismatch .`);
        allRisksValid = false;
        return false;
      }

      // Validate subclass code
      const isValidSubclass = this.allMatchingSubclasses.some(
        (subclass) => subclass.code === risk.SubclassCode
      );
      if (!isValidSubclass) {
        this.globalMessagingService.displayErrorMessage('Error', `Invalid subclass code .`);
        allRisksValid = false;
        return false;
      }

      // Validate propertyId against the regex pattern
      const isValidPropertyId = new RegExp(this.regexPattern).test(risk.PropertyId);
      if (!isValidPropertyId) {
        this.globalMessagingService.displayErrorMessage('Error', `Invalid Property ID format: ${risk.PropertyId}.`);
        allRisksValid = false;
        return false;
      }

      // Format and validate dates
      const wefDate = this.formatDate(risk.WEF);
      const wetDate = this.formatDate(risk.WET);

      // Convert dates to Date objects for comparison
      const wef = new Date(wefDate);
      const wet = new Date(wetDate);
      const coverFromDate = new Date(this.selectedCoverFromDate);
      const coverToDate = new Date(this.selectedCoverToDate);

      // Validate that WEF is within the selected date range
      if (wef < coverFromDate || wef > coverToDate) {
        this.globalMessagingService.displayErrorMessage('Error', `With Effect From Date  is outside the selected date range.`);
        allRisksValid = false;
        return false;
      }

      // Validate that WET is within the selected date range
      if (wet < coverFromDate || wet > coverToDate) {
        this.globalMessagingService.displayErrorMessage('Error', `With Effect To Date  is outside the selected date range.`);
        allRisksValid = false;
        return false;
      }

      return true; // Risk is valid
    });

    // If any risk is invalid, return an empty array and do not create the payload
    if (!allRisksValid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'One or more risks failed validation. Payload not created.');
      return [];
    }

    // Log the valid risks for debugging
    log.debug("Valid Risks:", validRisks);

    // Create the payload only if all risks are valid
    return validRisks.map(risk => {
      const wefDate = this.formatDate(risk.WEF);
      const wetDate = this.formatDate(risk.WET);

      return {
        coverTypeCode: risk.CoverTypeCode,
        action: this.quoteAction ? this.quoteAction : "A",
        productCode: 8293,
        propertyId: risk.PropertyId,
        value: risk.PremiumBind,
        coverTypeShortDescription: risk.CoverTypeShortDesc,
        premium: risk.RiskPremAmount,
        subclassCode: risk.SubclassCode,
        itemDesc: risk.ItemDesc,
        wef: wefDate, // Use formatted WEF
        wet: wetDate, // Use formatted WET
        prpCode: risk.ClientCode,
      };
    });
  }

  fetchRegexPatternForSelectedSubclass(): void {
    if (this.selectedSubclassCode) {
      // Fetch the regex pattern for the selected subclass
      this.quotationService
        .getRegexPatterns(this.selectedSubclassCode)
        .subscribe({
          next: (response: any) => {
            this.regexPattern = response._embedded?.riskIdFormat;
            log.debug('New Regex Pattern', this.regexPattern);
            this.dynamicRegexPattern = this.regexPattern;

          },
          error: (error) => {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              error.error.message
            );
          },
        }
        );
    } else {
      this.globalMessagingService.displayErrorMessage('Error', 'No subclass selected.');
    }
  }

  onSubclassChange(event: any): void {
    // Retrieve the selected subclass code from the event
    this.selectedSubclassCode = event.value;
    log.debug('Selected Subclass Code:', this.selectedSubclassCode);
    if (this.selectedSubclassCode) {
      this.subclassSelected = true;
    }

    // Optionally, you can call another method here to perform actions with the selected subclass code
    this.fetchRegexPatternForSelectedSubclass();
  }

  formatDate(dateString: string): string {
    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('/');

    // Return the date in the desired format (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
  }

  addRisk() {
    let riskPayload = this.getQuotationRiskPayload();
    log.debug("Risk payload", riskPayload);

    // Check if the risk payload is empty (indicating validation failure)
    if (!riskPayload || riskPayload.length === 0) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Cannot add risks. One or more fields are invalid.');
      return; // Exit the method early
    }

    riskPayload = riskPayload.map((risk) => {
      return {
        ...risk,
        quotationCode: this.quotationCode
      }
    })

    // this.quotationService.createQuotationRisk(this.quotationCode, riskPayload).subscribe({
    //   next: (response) => {
    //     log.debug('Risk added successfully:', response);
    //     this.quotationRiskData = response;
    //     const quotationRiskDetails = this.quotationRiskData._embedded[0];
    //     if (quotationRiskDetails) {
    //       this.riskCode = quotationRiskDetails.riskCode
    //       this.quoteProductCode = quotationRiskDetails.quotProductCode
    //     }
    //     this.router.navigate(['/home/gis/quotation/quotation-summary']);
    //   },
    //   error: (error) => {
    //     log.error('Error adding risk:', error);
    //     this.globalMessagingService.displayErrorMessage('Error', 'Failed to add risks. Please try again.');
    //   }
    // })



  }

  /**
   * Retrieves and matches product subclasses for a given product code.
   * - Makes an HTTP GET request to GISService for product subclasses.
   * - Matches and combines subclasses with the existing 'allSubclassList'.
   * - Logs the final list of matching subclasses.
   * - Forces change detection to reflect updates.
   * @method getProductSubclass
   * @param {number} code - The product code to fetch subclasses.
   * @return {void}
   */
  getProductSubclass(code: number) {
    this.subclassService.getProductSubclasses(code)
      .subscribe((subclasses) => {
        this.allMatchingSubclasses = subclasses.map((value) => {
          return {
            ...value,
            description: value.description,
          }
        })
      })
  }
  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   this.validateAndSetFile(file);
  // }
  async onFileSelected(event: any): Promise<void> {
    log.debug('File input event:', event);
    const file = event.target.files[0];
    log.debug('Selected file:', file);

    this.validateAndSetFile(file);

    if (!this.selectedFile) return;

    // Determine file extension
    const extension = this.selectedFile.name.split('.').pop()?.toLowerCase();
    log.debug('EXTENSION:', extension)
    if (extension === 'csv') {
      const jsonData = await this.convertCsvToJson(this.selectedFile);
      console.log("JSON output after uploading:", jsonData);
      const importedriskPaylod = this.mapCsvToFullPayload(jsonData)
      this.uploadImportedRisk(importedriskPaylod)

    }

    // You can also handle XLS/XLSX differently if needed
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
    this.errorMessage = '';
    this.successMessage = '';

    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'File size exceeds the maximum limit of 10MB';
      return;
    }

    // Check type via MIME
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const allowedExtensions = ['csv', 'xls', 'xlsx'];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      this.errorMessage = 'Please upload a valid Excel file (CSV, XLS, XLSX)';
      return;
    }

    this.selectedFile = file;
    this.successMessage = 'File selected successfully';
    log.debug("Selected File", this.selectedFile)
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
  uploadImportedRisk(data: PolicyElectronicDataDTO[]): void {


    log.debug('Policy Payload being sent:', data);

    this.quotationService.uploadImportRiskData(data).subscribe({
      next: (data) => {
        this.policyData = data;
        log.debug('Policy data uploaded successfully:', data);
        data && this.validateImportedRisk()
        this.successMessage = 'Policies uploaded successfully!';
        this.globalMessagingService.displaySuccessMessage('Success', 'Policies uploaded successfully!');
      },
      error: (err) => {
        console.error('Failed to load policy data', err);
        this.errorMessage = 'Failed to upload policies. Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to upload policies');
      }
    });
  }
  convertCsvToJson(file: File): Promise<any[]> {
    log.debug("Convert to csv called:")
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;

        // Split rows
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        // Extract header columns
        const headers = lines[0].split(',').map(h => h.trim());

        const jsonData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};

          headers.forEach((header, index) => {
            obj[header] = values[index] || null;
          });

          return obj;
        });

        resolve(jsonData);
      };

      reader.onerror = (err) => reject(err);

      reader.readAsText(file);
    });
  }
  mapCsvToFullPayload(csvData: any[]): any[] {
    return csvData.map(row => ({

      policyBatchNo: 0,
      transactionType: row["RISK TYPE"] || "",
      agentClientId: row["INSURED ID"] || "",
      agentClientName: row["INSURED NAME"] || "",
      agentClientSurname: "",
      withEffectFrom: new Date(row["EFF DATE"]) || "",
      agentPolicyId: "",
      insuranceClass: "",
      coverType: row["Cover Type"] || "",
      withEffectTo: new Date(row["EXP DATE"]) || "",
      transactionDateString: "",
      transactionNo: "",
      premium: Number(row["PREMIUM"]) || 0,
      taxes: Number(row["LEVIES"]) || 0,
      propertyId: "",
      make: row["Make/Model"] || "",
      model: row["Model /Type"] || "",
      yearOfManufacture: row["YOM"] ? Number(row["YOM"]) : 0,
      cubicCapacity: row["Body Type/CC rate"] || "",
      engineNumber: row["Engine No"] || "",
      chassisNumber: row["Chasis No."] || "",
      sumInsured: Number(row["SUM INSURED"]) || 0,
      sectionColumn1: 0, sectionColumn2: 0, sectionColumn3: 0, sectionColumn4: 0, sectionColumn5: 0,
      sectionColumn6: 0, sectionColumn7: 0, sectionColumn8: 0, sectionColumn9: 0, sectionColumn10: 0,
      sectionColumn11: 0, sectionColumn12: 0, sectionColumn13: 0, sectionColumn14: 0, sectionColumn15: 0,
      sectionColumn16: 0, sectionColumn17: 0, sectionColumn18: 0, sectionColumn19: 0, sectionColumn20: 0,
      sectionColumn1Rate: 0, sectionColumn2Rate: 0, sectionColumn3Rate: 0, sectionColumn4Rate: 0,
      sectionColumn5Rate: 0, sectionColumn6Rate: 0, sectionColumn7Rate: 0, sectionColumn8Rate: 0,
      sectionColumn9Rate: 0, sectionColumn10Rate: 0, sectionColumn11Rate: 0, sectionColumn12Rate: 0,
      sectionColumn13Rate: 0, sectionColumn14Rate: 0, sectionColumn15Rate: 0, sectionColumn16Rate: 0,
      sectionColumn17Rate: 0, sectionColumn18Rate: 0, sectionColumn19Rate: 0, sectionColumn20Rate: 0,
      propertyCode: 0,
      subclassCode: this.selectedSubclassCode,
      coverTypeCode: 0,
      coverTypeShortDesc: "",
      gisIpuPropertyId: "",
      transactOnlyCheck: "",
      transferred: "",
      gisClientCode: 0,
      gisIpuCode: 0,
      policyNumber: row["POL NO"] || "",
      notTransferredReason: "",
      authorized: "",
      authorizationDate: new Date().toISOString().split('T')[0],
      pdcTransferred: "",
      certificateNumber: row["Certificate No"] || "",
      clientTypeCode: 0,
      agentCode: 0,
      lotId: "",
      clientTypeShortDesc: "",
      quotationCode: this.quotationCode,
      quotationProductCode: this.quoteProductCode,
      binderCode: 0,
      productCode: this.selectedProductCode,
      newClientFlag: "",
      proRataFlag: "",
      duplicatedFlag: "",
      formMNumber: "",
      cfValue: "",
      marineValue: 0,
      color: row["Color"] || "",
      engine: row["Engine No"] || "",
      suspendCancelledFlag: "",
      dateSuspendCancelled: "",
      policyCoverFrom: "",
      policyCoverTo: "",
      currency: "",
      policyCoinsuranceFlag: "",
      policyCoinsuranceLeaderFlag: "",
      policyCoinsurancePercentage: 0,
      clientName: row["INSURED NAME"] || "",
      clientShortDesc: "",
      nationalId: row["NATIONAL ID"] || "",
      clientPin: row["PIN"] || "",
      postalAddress: row["POSTAL_ADDRS"] || "",
      postalTown: row["POSTAL_TOWN"] || "",
      postalCode: row["POSTAL_CODE"] || "",
      clientTelephoneNumber: row["TELEPHONE NO"] || "",
      clientMobileNumber: row["MOBILE NUMBER"] || "",
      clientCountry: row["COUNTRY"] || "",
      policyRenewableFlag: "",
      policySumInsured: 0,
      facultativePolicyFlag: "",
      branch: "",
      insuredName: row["INSURED NAME"] || "",
      insuredNationalId: row["NATIONAL ID"] || "",
      insuredPin: row["PIN"] || "",
      insuredPostalAddress: row["POSTAL_ADDRS"] || "",
      insuredPostalTown: row["POSTAL_TOWN"] || "",
      insuredPostalCode: row["POSTAL_CODE"] || "",
      insuredTelephoneNumber: row["TELEPHONE NO"] || "",
      insuredMobileNumber: row["MOBILE NUMBER"] || "",
      policyRiskCoverFrom: "",
      policyRiskCoverTo: "",
      policyLoadedFlag: "",
      commissionRate: 0,
      preparedBy: "",
      authorisedBy: "",
      stampDuty: 0,
      trainingLevy: 0,
      phf: 0,
      commission: 0,
      endorsementNumber: "",
      debitCreditNoteNumber: "",
      underwritingYear: row["UNDERWRITING YEAR"] ? Number(row["UNDERWRITING YEAR"]) : 0,
      riskDescription: row["RISK DESCRIPTION"] || "",
      temp: "",
      policyClientType: "",
      policyClientTitle: "",
      gisSubclassCode: 0,
      postedDate: "",
      loadedFlag: "",
      subclassShortDesc2: "",
      subclassShortDesc3: "",
      subclassShortDesc4: "",
      subclassShortDesc5: "",
      subclassShortDesc6: "",
      subclassPremium: 0,
      subclassPremium2: 0,
      subclassPremium3: 0,
      subclassPremium4: 0,
      subclassPremium5: 0,
      subclassPremium6: 0,
      totalPremium: Number(row["PREMIUM"]) || 0,
      totalSubclass: 0,
      policyUnderwritingYear: 0,
      transactionDate: "",
      transactionNumber: Number(row["TRANSACTION NO"]) || 0,
      policyUnderwritingOnlyFlag: "",
      ipuRiskNote: "",
      insuredEmailAddress: row["EMAIL"] || "",
      clientDateOfBirth: row["DOB"] || "",
      insuredDateOfBirth: row["DOB"] || "",
      awrCode: 0,
      awpCode: 0,
      emailAddress: row["EMAIL"] || "",
      origin: "",
      pecCarryCapacity: "",
      bodyType: row["Body Type"] || "",
      registrationNumber: row["REG NO"] || "",
      branchShortDesc: "",
      livestockOwnerMark: "",
      livestockInsurerTag: "",
      livestockPurpose: "",
      livestockStockType: "",
      livestockBreed: "",
      livestockSex: "",
      livestockAge: 0,
      livestockNumber: 0,
      livestockValue: 0,
      riskNote: "",
      carryingCapacity: 0,
      driverEmail: row["Driver Email"] || "",
      driverName: row["Driver Name"] || "",
      driverTelephoneNumber: row["Driver Tel No"] || "",
      insuredIsDriverFlag: row["Driver?"] || "",
      yearOfBuilt: row["Year of Built"] ? Number(row["Year of Built"]) : 0,
      vesselType: "",
      clause: "",
      category: "",
      conveyance: "",
      country: row["COUNTRY"] || "",
      proformaInvoiceValue: 0,
      proformaInvoiceNumber: "",
      proformaInvoiceDate: "",
      portOfDestination: "",
      paymentDate: "",
      certNo: "",
      tin: "",
      excess: "",
      subCategory: "",
      riskLocation: "",
      riskTown: "",
      territory: "",
      isNewRisk: "",
      partShipment: "",
      riskAddress: "",
      calcMaxExposure: "",
      maxExposureAmount: 0,
      surveyRisk: "",
      certificateDate: "",
      dischargePort: "",
      shipmentPercentage: 0,
      landingStatus: "",
      scheduleBasicRate: 0,
      scheduleCargoDescription: "",
      scheduleContainerizedFlag: "",
      scheduleCurrency: "",
      scheduleInvoicedValue: 0,
      scheduleMarinePolicyType: "",
      scheduleNatureOfCargo: "",
      scheduleSailingFrom: "",
      scheduleSailingTo: "",
      scheduleVesselName: "",
      sectionColumn1BaseAmount: 0,
      sectionColumn1BaseExchangeRate: 0,
      sectionColumn1LoadingRate: 0
    }));
  }
  fetchUploadedRisks() {
    log.debug("Quotation code:", this.quotationCode)
    this.quotationService.fetchUploadedRisk(this.quotationCode,).subscribe({
      next: (data) => {
        this.policyData = data;
        log.debug('Imported risk data:', data);

      },
      error: (err) => {
        log.error('Failed to load imported risk data', err);
        this.errorMessage = 'Failed to upload policies. Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to load imported risk data');
      }
    });
  }
  validateImportedRisk() {
    this.quotationService.validateUploadedRisk(this.quotationCode,).subscribe({
      next: (data) => {

        log.debug('Validated Imported risk data:', data);
        data && this.fetchUploadedRisks()

      },
      error: (err) => {
        log.error('Failed to load imported risk data', err);
        this.errorMessage = 'Failed to upload policies. Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to load imported risk data');
      }
    });
  }
  onRiskSelectionChange(event: any) {
    // Handle selection if needed
  }
  validateRisks() {
    // validation logic
  }

  deleteRisks() {
    // deletion logic
  }
}

