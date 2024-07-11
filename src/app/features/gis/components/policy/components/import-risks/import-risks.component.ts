import { Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import * as Papa from 'papaparse';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Subclasses } from '../../../setups/data/gisDTO';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
const log = new Logger("ImportRiskDetailsComponent");
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {

  fileSelected: boolean = false;
  uploadedFileName: string = '';
  uploading: string = '';
  importedRisk:any;
  policyDetails:any;
  policyNumber:any;
  client:any
  clientDetails:any;
  coverFrom:any;
  coverTo:any;
  productCode:any;
  subClassList:any;
  allSubclassList: Subclasses[]
  allMatchingSubclasses = [];
  selectedSubclassCode: any;
  selectedSubclass: any;
  errorMessage: string;
  errorOccurred: boolean;


  constructor(
    public globalMessagingService: GlobalMessagingService,
    public clientService:ClientService,
    public productService:ProductsService,
    public subclassService: SubclassesService,
  ){

  }

  ngOnInit(): void {
    this.getPolicyDetails();
    this.getClientDetails();
    this.loadAllSubclass();
  
    
    
  }

  getPolicyDetails(){
    this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    this.policyNumber = this.policyDetails.policyNumber
    this.coverFrom = sessionStorage.getItem('coverFrom');
    this.coverTo = sessionStorage.getItem('coverTo');
    this.productCode = sessionStorage.getItem('productCode');

  }
  getClientDetails(){
    const clientCode = sessionStorage.getItem('clientCode')

    this.clientService.getClientById(Number(clientCode)).subscribe({
      next:(res)=>{
        this.clientDetails = res
        this.client = this.clientDetails.firstName + " " + this.clientDetails.lastName
        console.log(res)
      }
    })
  }

  downloadCSVTemplate(): void {
    console.log("TEST")
    const templateFilePath = '/assets/data/import-risks-template.csv';
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', templateFilePath);
    link.setAttribute('download', 'template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {

      this.uploading = 'progress';

      Papa.parse(file, {
        complete: (result: any) => {
         
          const expectedHeaders = ['clientId', 'clientName', 'WEF','WET', 'riskDuplicated', 'Class','coverType', 'Premium', 'Taxes'];
          const actualHeaders = result.meta.fields;
          console.log(actualHeaders)
          // Assuming CSV has header row, you can access data with result.data
          if (this.validateHeaders(expectedHeaders, actualHeaders)) {
            this.importedRisk = result.data;
            console.log(result.data);
  
            try {
              this.uploadedFileName = file.name;
              sessionStorage.setItem('uploadedFileName', this.uploadedFileName);
              this.uploading = 'success';
            } catch (e) {
              console.log(`file upload failed >>> `, e);
              this.uploading = 'error';
            }
          }else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'CSV headers do not match the required format.'
            );
          
            this.uploading = 'error';
          }
         
        },
        header: true // Set to true if CSV file has a header row
      });
    }else{
      this.fileSelected = false;
      this.uploadedFileName = '';
      this.uploading = '';
    }
  }
  validateHeaders(expectedHeaders: string[], actualHeaders: string[]): boolean {
    if (expectedHeaders.length !== actualHeaders.length) {
      return false;
    }
  
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (expectedHeaders[i] !== actualHeaders[i]) {
        return false;
      }
    }
  
    return true;
  }
  getProductSubclass() {
    this.productService
      .getProductSubclasses(this.productCode)
      .subscribe({
        next: (data) => {

          if (data) {
            this.subClassList = data._embedded.product_subclass_dto_list;
            log.debug(this.subClassList, 'Product Subclass List');
            log.debug(this.allSubclassList, 'All Subclass List');
            if (this.allSubclassList) {
              this.subClassList.forEach(element => {
                const matchingSubclasses = this.allSubclassList.filter(subCode => subCode.code === element.sub_class_code);
                this.allMatchingSubclasses.push(...matchingSubclasses);
              });

              log.debug("Retrieved Subclasses by code", this.allMatchingSubclasses);
            }
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  loadAllSubclass() {
    this.subclassService
      .getAllSubclasses()
      .subscribe({
        next: (data) => {
          console.log(data)
          if (data) {
            this.allSubclassList = data;
            console.log(this.allSubclassList, "All Subclass List");
            this.getProductSubclass();

         


          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });

  }
}
