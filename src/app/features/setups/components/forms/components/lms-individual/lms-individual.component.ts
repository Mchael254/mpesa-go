import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsService } from '../../service/forms/forms.service';
import {ToastService} from "../../../../../../shared/services/toast/toast.service";
import {DataManipulation} from "../../../../../../shared/utils/data-manipulation";

@Component({
  selector: 'app-lms-individual',
  templateUrl: './lms-individual.component.html',
  styleUrls: ['./lms-individual.component.css']
})
export class LmsIndividualComponent implements OnInit {
  formsForm: FormGroup;
  screenForm: FormGroup;
  screenData: any = {}
  formList: any[] = [];
  systemList: Set<string> = new Set<string>();
  moduleList: Set<string> = new Set<string>();
  pagesList: any[] = [];
  selectedHeader: { name: any; visible: boolean; }[];
  name: string;

  constructor(private form_service: FormsService, private fb: FormBuilder, private spinner_Service:NgxSpinnerService,
    private toast_service: ToastService){}


  ngOnInit(): void {
    this.getlmsIndForms();
    // this.selectSystem('LMS_INDIVIDUAL');
    // this.selectModule(this.screenData['QUOTAION']);
    // this.selectPage(this.screenData['screen_name'])
    this.getFormsForm();
    this.screenForm = this.fb.group({
      name: []
    })
  }

  getFormsForm() {
    this.formsForm = this.fb.group({
      name: [],
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

    this.spinner_Service.show('form_modal_view')
    return this.form_service.getAllForms().subscribe((data: any) =>{
      this.formList = data['data'];

      let temp = this.formList.map((data: any) =>{
        return data['system_name'];
      })
      this.systemList = new Set<string>(temp);
      this.selectSystem("LMS_INDIVIDUAL")
      this.spinner_Service.hide('form_modal_view')


    }, err =>{
      this.spinner_Service.hide('form_modal_view')
    })
  }

  headers: string[] = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];

  // Define the number of rows
  numRows: number = 6;

  // Generate rows with dynamic content
  rows: any[] = []

  selectSystem(module: string){
    this.screenData['system'] = module;
    let temp_module = this.formList.filter((data: any) =>
      {return data['system_name']===module}).map(data=>data['module']);
    this.systemList = new Set<string>(temp_module);
    }

  selectModule(module: string){
    this.screenData['module'] = module;
    let temp_pages = this.formList.filter((data: any) =>
    {return (data['system_name']===this.screenData['system'] && data['module']===this.screenData['module'])}
      ).map(data=>data['screen_name']);
    this.moduleList = new Set<string>(temp_pages);
    this.pagesList = [];


    }



  addForm(){
    this.selectForm(null, true)
  }

  addScreenFrom(data:string){
    this.name = data;
    this.addModal('formScreenId')
  }

  selectPage(page: any){
    this.screenData['screen_name'] = page;
     this.pagesList = this.formList.filter((data: any) => {
       return (data['system_name']===this.screenData['system'] && data['module']===this.screenData['module'] && data['screen_name']===this.screenData['screen_name'])
    }).map(data =>{
      // console.log(data);

      let tr =  data['inputs']['en'];
      tr['name'] = data?.form_name
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
    console.log(form);

    if(is_empty){
      this.formsForm.reset();
    }else{
      this.formsForm.patchValue(form);
      this.formsForm.get('visible').setValue(form?.visible?'true':'false');
      this.formsForm.get('is_disabled').setValue(form?.visible?'true':'false');
      this.formsForm.get('required').setValue(form?.visible?'true':'false');
    }

    const modal = document.getElementById('formsFormId');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  addModal(name='formsFormId'){
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeModal(name='formsFormId') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  saveForm(){
    this.spinner_Service.show('form_modal_view')
    let val = {...this.formsForm.value};

    this.form_service.saveForm(val).subscribe(data =>{
      this.formList = this.formList.map(da => {
        if(da['code']=== data['data']['code']){
          return data['data']
        }
        return da
      })
      this.selectSystem(this.screenData['system']);
      this.selectModule(this.screenData['module']);
      this.selectPage(this.screenData['screen_name'])

      this.closeModal()
      this.spinner_Service.hide('form_modal_view');
      this.toast_service.success('Save Succesfully!!', 'FORM UPDATE')

    },
    err =>{
      this.spinner_Service.hide('form_modal_view');
      this.toast_service.danger('Error!!', 'FORM UPDATE')

    });

  }

  saveScreenForm(){
    console.log(this.screenData);
      console.log(this.formList);
  }

  // selectForm(form: any){
  //   this.screenData['form_name'] = form['form_name'];

  // }

}
