import { Component } from '@angular/core';
import * as Papa from 'papaparse';
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {



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
  
}
