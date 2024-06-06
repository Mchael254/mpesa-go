import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
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

  constructor(
    public globalMessagingService: GlobalMessagingService,
  ){

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
}
