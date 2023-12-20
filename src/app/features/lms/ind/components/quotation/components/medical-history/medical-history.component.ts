import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { MedicalHistoryService } from 'src/app/features/lms/service/medical-history/medical-history.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../../environments/environment';
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import {StringManipulation} from "../../../../../util/string_manipulation";
import {RelationTypesService} from "../../../../../service/relation-types/relation-types.service";

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css'],
})
@AutoUnsubscribe
export class MedicalHistoryComponent implements OnDestroy, OnInit {
  steps = stepData;
  buttonConfig: any;
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
      label: 'Medical History(Data Entry)',
      url: '/home/lms/ind/quotation/medical-history',
    },
  ];
  medicalListOne: any[] = [];
  medicalListTwo: any[] = [];
  editEntity: boolean = false;

  medicalHistoryForm: FormGroup;
  medicalHistoryTableOne: FormGroup;
  medicalHistoryTableTwo: FormGroup;
  clonedProducts: any;
  products: any;
  diseaseList: any[] =[]
  relationTypeList: any[] =[]
  constructor(
    private fb: FormBuilder,
    private medical_history_service: MedicalHistoryService,
    private session_service: SessionStorageService,
    private spinner_service: NgxSpinnerService,
    private router: Router,
    private relation_type_service: RelationTypesService,
    private toast: ToastService
  ) {
    this.medicalHistoryForm = this.fb.group({
      question1: [],
      question2: [],
      question3: [],
      question4: [],
      question5: [],
      hereditary_disease: [],

      id: [],
      code: ['', Validators.required],
      tenant_id: ['', Validators.required],
      client_code: ['', Validators.required],
      medical_personnel: this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        phone_no: ['', Validators.required],
        email_address: ['', [Validators.required, Validators.email]],
      }),
      pregnancy_due_date: ['', Validators.required],
      medication_intake: [],
      physical_challenge: [false, Validators.required],
      health_history: this.fb.group({
        individual_name: ['', Validators.required],
        disease: ['', Validators.required],
        diagnosed_date: ['', Validators.required],
        description: [''],
      }),
    });
    this.medicalHistoryTableOne = this.fb.group({
      code: [],
      relation_type_code:[],
      disease: [],
      diagnosis_date: [],
      diagnosis: []
    })
  }
  ngOnInit(): void {
    this.getMedicalHistoryByClientId();
    this.medical_history_service.getListOfDisease().subscribe((data)=>{
      this.diseaseList = data['data'];
    })
      this.relation_type_service.getRelationTypes().subscribe((data: any[]) => {
        this.relationTypeList = data;
      });

  }

  getValue(name: string = 'question1') {
    return this.medicalHistoryForm.get(name).value;
  }

  getMedicalHistoryByClientId() {
    this.spinner_service.show('medical_history_screen');
    let client_code = this.session_service.get(SESSION_KEY.CLIENT_CODE);
    let tenant_id = environment.TENANT_ID;
    this.medical_history_service
      .getMedicalHistoryByTenantIdAndClientCode(tenant_id, client_code)
      .pipe(finalize(() => this.spinner_service.hide('medical_history_screen')))
      .subscribe(
        (data) => {
          console.log(data['data']);
          let data_ = data['data'];
          if(data_ !== null){
            if(data_?.medical_personnel!=null){
              data_['question1'] = 'Y'
            }
            if(data_?.pregnancy_due_date!=null){
              data_['question2'] = 'Y'
              data_['pregnancy_due_date'] = new Date(data_?.pregnancy_due_date)
            }else{
              data_['question2'] = 'N'
            }
            if(data_?.medication_intake!=null){
              data_['question3'] = 'Y'
              data_['medication_intake'] = data_?.medication_intake;
            }
            if(data_?.hereditary_disease!=null){
              data_['question5'] = 'Y'
              data_['hereditary_disease'] = data_?.hereditary_disease;
            }
            if(data_?.physical_challenge){
              data_['physical_challenge'] = 'Y'
            }else{
              data_['physical_challenge'] = 'N'
            }


            this.medicalHistoryForm.patchValue(data['data'])
            console.log(data?.data?.dependants_info)
            if(data?.data?.dependants_info!==null){
              this.medicalListOne = data?.data?.dependants_info.map(da => {
                da['isEdit'] = false;
                return da;
              });
            }
          }
          this.toast.success(data?.message,"Medical History" );

          this.spinner_service.hide('medical_history_screen');
        },
        (err) => {
          this.spinner_service.hide('medical_history_screen');
        }
      );
  }

  editPolicyOne(x: any) {
    let pol = this.medicalListOne
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });

    this.medicalListOne.indexOf(pol, x);
    this.medicalHistoryTableOne.patchValue(pol.length > 0 ? pol[0] : {});
  }
  editPolicyTwo(x: any) {
    let pol = this.medicalListTwo
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });

    this.medicalListTwo.indexOf(pol, x);
    this.medicalHistoryTableTwo.patchValue(pol.length > 0 ? pol[0] : {});
  }
  // deleteMedicalListOne(i: number) {
  //   this.medicalListOne = this.deleteEntity(this.medicalListOne, i);
  // }
  deleteMedicalListOne(i: number) {
    let deleted_pol = this.medicalListOne.find((data, x) => {
      return i === x;
    });
    // this.medical_history_service.deleteMedicalHistory(deleted_pol['code']).subscribe(data =>{
    //   this.medicalListOne = this.medicalListOne.filter((data, x) => {
    //     return i !== x;
    //   });
    // })
  }

  cancelMedicalListOne(i: number) {
    this.medicalListOne = this.medicalListOne.map((data, x) => {
      data['isEdit'] = false;
      return data;
    }).filter((data, x) => x!==i);
  }
  deleteMedicalListTwo(i: number) {
    let deleted_pol = this.medicalListTwo.find((data, x) => {
      return i === x;
    });
    // this.medical_history_service.deleteMedicalHistory(deleted_pol['code']).subscribe(data =>{
    //   this.medicalListTwo = this.medicalListTwo.filter((data, x) => {
    //     return i !== x;
    //   });
    // })
  }

  cancelMedicalListTwo(i: number) {
    this.medicalListTwo = this.medicalListTwo.map((data, x) => {
      data['isEdit'] = false

      return data;
    }).filter((data, x) => x!==i);
  }
  addResponseOne(x: any) {
    let pol_data = this.medicalListOne.filter((data, i) => {
      return i === x;
    })[0];
    
    let record  = {...pol_data, ...this.medicalHistoryTableOne.value};
    let medical_record = {...record, meh_code: {...this.medicalHistoryForm.value}['code']};
    this.saveMedicalHistoryDependant(medical_record).subscribe((pol_sub_data) => {
      console.log(pol_sub_data);
      
      this.medicalListOne = this.medicalListOne.map((data, i) => {
        if (i === x) {
          let temp = this.medicalHistoryTableOne.value;
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });

      this.medicalHistoryTableOne.reset();
    });
  }
  addResponseTwo(x: any) {
    let pol_data = this.medicalListTwo.filter((data, i) => {
      return i === x;
    })[0];
    this.saveMedicalHistory({
      ...pol_data,
      ...this.medicalHistoryTableTwo.value,
    }).subscribe((pol_sub_data) => {
      this.medicalListTwo = this.medicalListTwo.map((data, i) => {
        if (i === x) {
          let temp = this.medicalHistoryTableTwo.value;
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });

      this.medicalHistoryTableTwo.reset();
    });
  }
  addEmptyMedicalList(medicalList: any[]) {
    this.addEntity(medicalList);
  }

  private addEntity(d: any[]) {
    this.editEntity = true;
    d.push({ isEdit: true });
    this.editEntity = false;
    return d;
  }
  private deleteEntity(d: any[], i) {
    this.editEntity = true;
    d = d.filter((data, x) => {
      return i !== x;
    });
    this.editEntity = false;
    return d;
  }

  saveMedicalHistory(data: any) {
    let client_code = StringManipulation.returnNullIfEmpty(
      this.session_service.get(SESSION_KEY.CLIENT_CODE)
    );
    //
    let ins = { ...data};    
    // ins['clnt_code'] = client_code;
    // ins['prp_code'] = client_code;
    // ins['prp_code'] = null;
    // console.log(ins);
    return this.medical_history_service.saveMedicalHistory(ins);
  }

  saveMedicalHistoryDependant(data: any) {
    return this.medical_history_service.saveMedicalHistoryDependant(data);
  }

  nextPage() {
    let val = {...this.medicalHistoryForm.value};
    val['physical_challenge'] = val['physical_challenge'] === 'Y';
    val['client_code'] = this.session_service.get(SESSION_KEY.CLIENT_CODE);
    val['tenant_id'] = environment.TENANT_ID;    
    if(this.medicalListOne.length>0){
      val = {...val, dependants_info:[...this.medicalListOne]}
    };
    this.medical_history_service.saveMedicalHistory(val).subscribe((data: any) => {
      this.toast.success(data?.message,"Medical History" );
      this.router.navigate(['/home/lms/ind/quotation/summary']);
    });
  }

  ngOnDestroy(): void {
    console.log('MedicalHistoryComponent UNSUBSCRIBE');
  }
}
