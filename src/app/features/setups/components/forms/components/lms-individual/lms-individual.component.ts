import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../service/forms/forms.service';
import { DataManipulation } from 'src/app/shared/utils/data-manipulation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-lms-individual',
  templateUrl: './lms-individual.component.html',
  styleUrls: ['./lms-individual.component.css']
})
export class LmsIndividualComponent implements OnInit {
  formsForm: FormGroup
  screenData: any = {}
  formList: any[] = [];
  systemList: Set<string> = new Set<string>();
  moduleList: Set<string> = new Set<string>();
  pagesList: any[] = [];
  selectedHeader: { name: any; visible: boolean; }[];

  constructor(private form_service: FormsService, private fb: FormBuilder, private spinner_Service:NgxSpinnerService,
    private toast_service: ToastService){}


  ngOnInit(): void {
    this.getlmsIndForms();
    this.getFormsForm();
  }

  getFormsForm() {
    this.formsForm = this.fb.group({
      code: [],
      label: [],
      place_holder: [],
      value: [],
      min: [0],
      max: [0],
      visible: [],
      type: [],
      required: [],
      is_disabled: [],
      hint: [] 
    })
  
  }

  private getlmsIndForms(){
    this.form_service.getAllForms().subscribe((data: any) =>{
      this.formList = data['data']
      let temp = this.formList.map((data: any) =>{
        return data['system_name'];
      })
      this.systemList = new Set<string>(temp);
      
    })
  }

  headers: string[] = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];
  
  // Define the number of rows
  numRows: number = 6;

  // Generate rows with dynamic content
  rows: any[] = []

  selectModule(module: string){
    this.screenData['system'] = module;    
    let temp_module = this.formList.filter((data: any) =>     
      {return data['system_name']===module}).map(data=>data['module']);
    this.moduleList = new Set<string>(temp_module);
    this.pagesList = [];
    }

  addForm(){

    this.selectForm(null)

  }

  selectPage(page: any){
    
    this.screenData['module'] = page;
     this.pagesList = this.formList.filter((data: any) => {
       return (data['system_name']===this.screenData['system'] && data['module']===this.screenData['module'])
    }).map(data =>{
      let tr =  data['inputs']['en'];
      tr['code'] = data['code'];
      return tr;
    });
    let temp_set = new Set<any>();    
    this.pagesList.filter(data => { DataManipulation.getKeysFromObjects(data).forEach(se => { temp_set.add(se); }) });
    this.selectedHeader = Array.from(temp_set.values()).map(data => {return {"name":data, 'visible': true}});
    
    
    
    
  }

  public readerHeaderstatus(header:string){
    return this.selectedHeader.find(data => data['name']===header)?.visible;
  }

  selectForm(form: any, is_empty=false) {
    if(is_empty){
      this.formsForm.reset();
    }else{
      this.formsForm.patchValue(form)
    }

    const modal = document.getElementById('formsFormId');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeModal() {
    const modal = document.getElementById('formsFormId');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  saveForm(){
    this.spinner_Service.show('form_modal_view')
    let val = {...this.formsForm.value};

    this.form_service.saveForm(val).subscribe(data =>{
      console.log(data);
      this.closeModal()
      this.spinner_Service.hide('form_modal_view');
      this.toast_service.success('Save Succesfully!!', 'FORM UPDATE')
      
    },
    err =>{
      this.spinner_Service.hide('form_modal_view');
      this.toast_service.danger('Error!!', 'FORM UPDATE')

    });

  }

  // selectForm(form: any){
  //   this.screenData['form_name'] = form['form_name'];
    
  // }

}
