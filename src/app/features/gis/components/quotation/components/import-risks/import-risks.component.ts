import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Router } from '@angular/router';
import { Logger } from '../../../../../../shared/services';
import * as XLSX from 'xlsx';
import { FormGroup, FormBuilder } from '@angular/forms';
import {QuotationsService} from '../../services/quotations/quotations.service';
import {untilDestroyed} from '../../../../../../shared/services/until-destroyed';
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('ImportRiskComponent');

@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  steps = quoteStepsData;
  subclassList: any;
  quotationNum: any;
  quotationDetails: any;
  columns: any;
  data: any = [];
  selectedRisks: any[] = [];
  importForm: FormGroup;
  quoteAction : string = "A";
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
    this.selectedProductCode = JSON.parse(sessionStorage.getItem("selectedProductCode"));
    log.debug("selectedProductCode", this.selectedProductCode);

    this.getProductSubclass(this.selectedProductCode);

  }

  // getSubclass() {
  //   this.subclassService.getAllSubclasses().subscribe(data => {
  //     this.subclassList = data;
  //   });
  // }

  finish() {
    if (this.selectedRisks.length === 0) {
      this.router.navigate(['/home/gis/quotation/risk-section-details']);
      return;
    }

    // Store selected risks in session storage to use in other components
    sessionStorage.setItem('selectedRisks', JSON.stringify(this.selectedRisks));
    log.debug('Selected risks stored:', this.selectedRisks);

    this.addRisk();

    // this.router.navigate(['/home/gis/quotation/risk-section-details']);
  }

  exportTemplate(): void {
    const data = [{
      BinderCode: '',
      PremiumBind: '',
      CoverTypeCode: '',
      CoverTypeShortDesc: '',
      WEF: '',
      WET: '',
      ClientCode: this.selectedClientCode,
      ClientName: '',
      IsNCDapplicable: '',
      ItemDesc: '',
      Location: '',
      NCDlevel: '',
      ProductCode: '',
      PropertyId: '',
      RiskPremAmount: '',
      SubclassCode: this.selectedSubclassCode,
      Town: '',
    }];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'template.xls');
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
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.data = this.parseData(parsedData);

        // Reset selections when new data is loaded
        this.selectedRisks = [];

        log.debug('Imported data:', this.data);
      };
      reader.readAsBinaryString(file);
    }
  }

  private parseData(parsedData: any): any[] {
    const columns = parsedData[0];
    const rows = parsedData.slice(1);
    return rows.map(row => {
      const rowData: any = {};
      columns.forEach((column, index) => {
        rowData[column] = row[index];
      });
      return rowData;
    });
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

    this.quotationService.createQuotationRisk(this.quotationCode, riskPayload).subscribe({
      next: (response) => {
        log.debug('Risk added successfully:', response);
        this.quotationRiskData = response;
        const quotationRiskDetails = this.quotationRiskData._embedded[0];
        if (quotationRiskDetails) {
          this.riskCode = quotationRiskDetails.riskCode
          this.quoteProductCode = quotationRiskDetails.quotProductCode
        }
        this.router.navigate(['/home/gis/quotation/quotation-summary']);
      },
      error: (error) => {
        log.error('Error adding risk:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add risks. Please try again.');
      }
    })



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
}
