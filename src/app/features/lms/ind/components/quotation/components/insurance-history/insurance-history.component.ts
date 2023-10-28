import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import stepData from '../../data/steps.json';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { ClientHistoryService } from 'src/app/features/lms/service/client-history/client-history.service';
import { PartyService } from 'src/app/features/lms/service/party/party.service';

@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css']
})
@AutoUnsubscribe
export class InsuranceHistoryComponent implements OnInit, OnDestroy {
  steps = stepData
  products = []
  insuranceHistoryForm: FormGroup;
  insuranceHistoryFormOne: FormGroup;
  insuranceHistoryFormTwo: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list'
    },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history'
    },
  ];

  policyListTwo: any[] = [];
  policyListOne: any[] = [];
  editEntity: boolean;
  coverStatusTypeList: any[] = [];
  // insuranceHistoryForm: FormGroup;



  constructor(private fb: FormBuilder, private client_history_service:ClientHistoryService){
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      responseOne: [],
      question2: ['N'],
      responseTwo: []
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
      pol_code: [''], // You can set initial values or validations as needed
      prp_code: [''],
      prem: [''],
      sum_assured: [''],
      status: ['']
    });
  }

  get responseOneControls() {
    return this.insuranceHistoryForm.get('responseOne') as FormArray;
  }

  addResponseOne(x) {
    let r = this.insuranceHistoryFormOne.value;
    r['isEdit'] = false
    this.policyListOne = this.policyListOne.map((data, i) =>{
      if(i===x){
        let temp = this.insuranceHistoryFormOne.value;
        temp['isEdit'] = false
        return temp;
      }
      return data;
    })
    this.insuranceHistoryFormOne.reset();

  }
  addResponseTwo(x) {
    let r = this.insuranceHistoryFormTwo.value;
    r['isEdit'] = false
    this.policyListTwo = this.policyListTwo.map((data, i) =>{
      if(i===x){
        let temp = this.insuranceHistoryFormTwo.value;
        temp['isEdit'] = false
        return temp;
      }
      return data;
    })
    this.insuranceHistoryFormTwo.reset();
  }
  editPolicyOne(x){
    let pol = this.policyListOne.filter((data, i) =>{return i === x}).map(data=>{
      let temp =data;
      temp['isEdit'] = true
      return temp;
    });
    this.policyListOne.indexOf(pol, x);
    this.insuranceHistoryFormOne.patchValue(pol.length>0? pol[0]: {});
  }

  createPolicyFormGroup(item): FormGroup {
    return this.fb.group({
      policyNo: [item.policyNo, Validators.required],
      insuranceCompany: [item.insuranceCompany, Validators.required],
      annualPremium: [item.annualPremium],
      sumAssured: [item.sumAssured],
      status: [item.status],
      isEdit: [false] // This property tracks whether the row is in edit mode
    });
  }

  addEmptyPolicyList(policyListOne:any[]) {
    policyListOne.push({ isEdit: true });
  }

  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }


  deletepolicyListOne( i: number) {
    this.policyListOne = this.policyListOne.filter((data,x) => {return i!==x})
  };
  deletepolicyListTwo( i: number) {
    this.policyListTwo = this.policyListTwo.filter((data,x) => {return i!==x})
  };
  editPolicyTwo(x){
    let pol = this.policyListTwo.filter((data, i) =>{return i === x}).map(data=>{
      let temp =data;
      temp['isEdit'] = true
      return temp;
    });

    this.policyListTwo.indexOf(pol, x);
    this.insuranceHistoryFormTwo.patchValue(pol.length>0? pol[0]: {});
  }
  // addEmptyPolicyList(policyList: any[]) {
  //   this.addEntity(policyList);
  // }

  getLmsInsHistList(){
    this.client_history_service.getLmsInsHistList().subscribe((data)=>{
      console.log(data);

    })
  }

  getAllCoverStatusTypes(){
    this.client_history_service.getAllCoverStatusTypes().subscribe((data: any[]) =>{
      console.log(data);
      this.coverStatusTypeList = [...data]

    })
  }

  filterCoverStatusType(s:string){
    return this.coverStatusTypeList.filter(data=>data['name']===s).map(data =>data['value'])

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
