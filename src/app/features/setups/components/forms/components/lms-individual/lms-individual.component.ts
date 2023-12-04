import { Component } from '@angular/core';

@Component({
  selector: 'app-lms-individual',
  templateUrl: './lms-individual.component.html',
  styleUrls: ['./lms-individual.component.css']
})
export class LmsIndividualComponent {
  screenData:any = {}

  constructor(){}

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
