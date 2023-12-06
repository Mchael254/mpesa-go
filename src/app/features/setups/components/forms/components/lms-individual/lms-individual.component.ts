import { Component } from '@angular/core';

@Component({
  selector: 'app-lms-individual',
  templateUrl: './lms-individual.component.html',
  styleUrls: ['./lms-individual.component.css']
})
export class LmsIndividualComponent {
  screenData:any = {}

  constructor(){}

  headers: string[] = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];
  
  // Define the number of rows
  numRows: number = 6;

  // Generate rows with dynamic content
  rows: string[][] = Array.from({ length: this.numRows }, (_, index) =>
    Array.from({ length: this.headers.length }, (_, colIndex) =>
      `Row ${index + 1}, Col ${colIndex + 1}`
    )
  );

  selectModule(module: any){
    this.screenData['module_name'] = module['module_name'];
    
  }

  selectPage(page: any){
    this.screenData['page_name'] = page['screen_name'];
    
  }

  selectForm(form: any){
    this.screenData['form_name'] = form['form_name'];
    
  }

}
