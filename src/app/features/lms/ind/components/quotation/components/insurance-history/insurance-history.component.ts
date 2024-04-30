import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import stepData from '../../data/steps.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import { Util } from 'leaflet';
import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import {Utils} from "../../../../../util/util";
import {ClientHistoryService} from "../../../../../service/client-history/client-history.service";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";

@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css'],
})
@AutoUnsubscribe
export class InsuranceHistoryComponent implements OnInit, OnDestroy {
  steps = stepData;
  products = [];
  insuranceHistoryForm: FormGroup;
  insuranceHistoryFormOne: FormGroup;
  insuranceHistoryFormTwo: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list',
    },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history',
    },
  ];

  policyListTwo: any[] = [];
  policyListOne: any[] = [];
  editEntity: boolean;
  coverStatusTypeList: any[] = [];
  coverStatusTypeListOne: any[] = [];
  coverStatusTypeListTwo: any[] = [];

  util: Utils;
  editFirstForm: boolean;
  // insuranceHistoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private client_history_service: ClientHistoryService,
    private session_storage: SessionStorageService,
    private spinner_service: NgxSpinnerService,
    private toast: ToastService
  ) {
    this.util = new Utils(this.session_storage)
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      responseOne: [],
      question2: ['N'],
      responseTwo: [],
    });
    this.insuranceHistoryFormOne = this.createInsuranceHistoryFormFormGroup();
    this.insuranceHistoryFormTwo = this.createInsuranceHistoryFormFormGroup();
  }
  ngOnInit(): void {
    this.getAllCoverStatusTypes();
    this.getLmsInsHistList();
  }

  createInsuranceHistoryFormFormGroup() {
    return this.fb.group({
      code: [],
      policy_no: [''], // You can set initial values or validations as needed
      provider: [''],
      premium: [''],
      sum_assured: [''],
      cover_status: [''],
    });
  }

  get responseOneControls() {
    return this.insuranceHistoryForm.get('responseOne') as FormArray;
  }

  addResponseOne(x: any) {
    this.spinner_service.show('ins_view');
    let pol_data = this.policyListOne.filter((data, i) => {
      return i === x;
    })[0];
    let data  = this.insuranceHistoryFormOne.value;
    console.log(data);

    if(!data?.cover_status || data['cover_status']===''){
      this.toast.danger('Select cover status', 'Insurance history'.toUpperCase());
      this.spinner_service.hide('ins_view');
      return;
    }

    if(data['premium'] > data['sum_assured']){
      this.toast.danger('The Premium amount exceeds the sum assured', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view');
      return;
    }

    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormOne.value,
    })
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe((pol_sub_data) => {
      this.editFirstForm = false;
      this.policyListOne = this.policyListOne.map((data, i) => {
        if (i === x) {
          // let temp = this.insuranceHistoryFormOne.value;
          let temp = pol_sub_data['data'];
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });
      this.spinner_service.hide('ins_view');

      this.insuranceHistoryFormOne.reset();
      this.toast.success('Save Data Successfully', 'Insurance history'.toUpperCase());

    },
    err =>{
      this.toast.danger('Failed to save Data Successfully', 'Insurance history'.toUpperCase());

    });
  }
  addResponseTwo(x: any) {
    this.spinner_service.show('ins_view');
    let pol_data = this.policyListTwo.filter((data, i) => {
      return i === x;
    })[0];
    let data = {...this.insuranceHistoryFormTwo.value};
    console.log(data);

    if(!data?.cover_status || data['cover_status']===''){
      this.toast.danger('Select cover status', 'Insurance history'.toUpperCase());
      this.spinner_service.hide('ins_view');
      return;
    }


    if(data['premium'] > data['sum_assured']){
      this.toast.danger('The Premium amount exceeds the sum assured', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view');
      return;
    }

    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormTwo.value,
    })
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe((pol_sub_data) => {
      this.editFirstForm = false;
      this.policyListTwo = this.policyListTwo.map((data, i) => {
        console.log(pol_sub_data);

        if (i === x) {
          let temp = pol_sub_data['data'];
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });
      this.spinner_service.hide('ins_view');
      this.insuranceHistoryFormTwo.reset();
      this.toast.success('Save Data Successfully', 'Insurance history'.toUpperCase());

    },
    err =>{
      this.toast.danger('Failed to save Data Successfully', 'Insurance history'.toUpperCase());

    });
  }
  editPolicyOne(x) {
    this.editFirstForm = true;
    let pol = this.policyListOne
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });
    this.policyListOne.indexOf(pol, x);
    this.insuranceHistoryFormOne.patchValue(pol.length > 0 ? pol[0] : {});
  }

  createPolicyFormGroup(item): FormGroup {
    return this.fb.group({
      policyNo: [item.policyNo, Validators.required],
      insuranceCompany: [item.insuranceCompany, Validators.required],
      annualPremium: [item.annualPremium],
      sumAssured: [item.sumAssured],
      status: [item.status],
      isEdit: [false], // This property tracks whether the row is in edit mode
    });
  }

  addEmptyPolicyList(policyListOne: any[]) {
    this.editFirstForm = true;
    policyListOne.push({ isEdit: true });
  }

  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }

  deletePolicyListOne(i: number) {
    this.spinner_service.show('ins_view');
    let deleted_pol = this.policyListOne.find((data, x) => {return i === x});
    this.client_history_service.deleteInsuranceHistory(deleted_pol['code'])
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe(data =>{
      this.policyListOne = this.policyListOne.filter((data, x) => {
        return i !== x;
      });
      this.toast.success('Delete Data Successfully', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view')

    },
    err=>{
      this.toast.danger('Failed to Delete Data', 'Insurance history'.toUpperCase())

    })
  }

  cancelPolicyListOne(i: number) {
    this.policyListOne = this.policyListOne.map((data, x) => {
      data['isEdit'] = false
      return data;
    }).filter(data => { return data?.code});
    this.editFirstForm = true;


  }


  deletepolicyListTwo(i: number) {
    this.spinner_service.show('ins_view');
    let deleted_pol = this.policyListTwo.find((data, x) => {return i === x});
    this.client_history_service.deleteInsuranceHistory(deleted_pol['code'])
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe(data =>{
      this.policyListTwo = this.policyListTwo.filter((data, x) => {
        return i !== x;
      });
      this.toast.success('Delete Data Successfully', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view')

    },
    err=>{
      this.toast.danger('Failed to Delete Data', 'Insurance history'.toUpperCase())

    })
  }

  cancelPolicyListTwo(i: number) {
    this.policyListTwo = this.policyListTwo.map((data, x) => {
      data['isEdit'] = false;
      return data;
    }).filter(data => { return data?.code});
    this.editFirstForm = true;

  }
  editPolicyTwo(x) {
    let pol = this.policyListTwo
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });

    this.policyListTwo.indexOf(pol, x);
    this.insuranceHistoryFormTwo.patchValue(pol.length > 0 ? pol[0] : {});
  }

  getLmsInsHistList() {
    this.spinner_service.show('ins_view');
    // let clientCode = this.session_storage.get(SESSION_KEY.CLIENT_CODE);
    this.client_history_service
      .getLmsInsHistList(this.util.getClientCode())
      .pipe(finalize(() => this.spinner_service.hide('ins_view')))
      .subscribe((data: any) => {
        if(data['data']!==null){
          this.policyListOne = data['data']
            .map((data_one: any) => {
              data_one['isEdit'] = false;
              return data_one;
            })
            .filter((data_filter: any) => {
              return ['A', 'S', 'PU', 'L'].includes(data_filter['cover_status']);
            });
          if (this.policyListOne.length > 0)
            this.insuranceHistoryForm.get('question1').setValue('Y');

          this.policyListTwo = data['data']
            .map((data_two) => {
              data_two['isEdit'] = false;
              return data_two;
            })
            .filter((data_two_filter) => {
              return ['w', 'D', 'W', 'V', 'J'].includes(data_two_filter['cover_status']);
            });
          if (this.policyListTwo.length > 0)
            this.insuranceHistoryForm.get('question2').setValue('Y');
          this.toast.success(data['message'], 'Insurance History')
        }
        this.spinner_service.hide('ins_view');
      });
  }



  getAllCoverStatusTypes() {
    this.client_history_service
      .getAllCoverStatusTypes()
      .subscribe((data: any[]) => {
        this.coverStatusTypeList = [...data];
        this.coverStatusTypeListOne = this.coverStatusTypeList.filter(data => {
          if(data['name']==='A' ||data['name']==='S'||data['name']==='L'||data['name']==='PU'){
            return data
          }
        })

        this.coverStatusTypeListTwo = this.coverStatusTypeList.filter(data => {
          if(data['name']==='J' ||data['name']==='V'||data['name']==='W'){
            return data
          }
        })
      });
  }

  filterCoverStatusType(s: string) {
    return this.coverStatusTypeList
      .filter((data) => data['name'] === s)
      .map((data) => data['value']);
  }

  saveInsuranceHistory(data: any) {
    let ins = { ...data };
    ins['clnt_code'] = this.util.getClientCode();
    // ins['prp_code'] = this.util.getClientCode();
    ins['prp_code'] = null;
    console.log(ins);
    return this.client_history_service.saveInsuranceHistory(ins);
  }

  deleteInsuranceHistory() {
    let insCode = 0;
    this.client_history_service
      .deleteInsuranceHistory(insCode)
      .subscribe((data) => {
        console.log(insCode);
      });
  }

  selectFirstQuestion(){
    if(this.policyListOne.length>0){
      this.policyListOne.forEach((m, i)=>{
        this.deletePolicyListOne(i)

      });
    }

  }

  selectSecondQuestion(){
    if(this.policyListTwo.length>0){

    this.policyListTwo.forEach((m, i)=>{
      this.deletepolicyListTwo(i)

    });
  }
  }

  // private addEntity(d: FormGroup) {
  //   this.editEntity = true;
  //   this.responseOneControls.push({ isEdit: true });
  //   this.editEntity = false;
  //   return this.responseOneControls;
  // };
  // private deleteEntity(d: any[], i) {
  //   this.editEntity = true;
  //      d = d.filter((data, x) => {
  //       return i !== x;
  //     });
  //     this.editEntity = false
  //     return d;
  // };
  // private returnLowerCase(data: any) {
  //   let mapData = data.map((da) => {
  //     da['name'] = da['name'].toLowerCase();
  //     return da;
  //   });
  //   return mapData;
  // }
  ngOnDestroy(): void {
    console.log('InsuranceHistoryComponent UNSUBSCRIBE');
  }
}
