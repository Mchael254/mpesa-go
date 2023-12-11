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
  clonedProducts: any;
  products: any;
  constructor(
    private fb: FormBuilder,
    private medical_history_service: MedicalHistoryService,
    private session_service: SessionStorageService,
    private spinner_service: NgxSpinnerService,
    private router: Router
  ) {
    this.medicalHistoryForm = this.fb.group({
      question1: [],
      question2: [],
      question3: [],
      question4: [],

      // code: ['', Validators.required],
      // tenant_id: ['', Validators.required],
      // client_code: ['', Validators.required],
      medical_personnel: this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        phone_no: ['', Validators.required],
        email_address: ['', [Validators.required, Validators.email]],
      }),
      pregnancy_due_date: ['', Validators.required],
      medication_intake: this.fb.array([]),
      physical_challenge: [false, Validators.required],
      health_history: this.fb.group({
        individual_name: ['', Validators.required],
        disease: ['', Validators.required],
        diagnosed_date: ['', Validators.required],
        description: [''],
      }),
    });
  }
  ngOnInit(): void {
    this.getMedicalHistoryByClientId();
  }

  getValue(name: string = 'question1') {
    return this.medicalHistoryForm.get(name).value;
  }

  getMedicalHistoryByClientId() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>');

    this.spinner_service.show('medical_history_screen');
    let client_code = '123456'; // this.session_service.get(SESSION_KEY.CLIENT_CODE);
    let tenant_id = environment.TENANT_ID;
    this.medical_history_service
      .getMedicalHistoryByTenantIdAndClientCode(tenant_id, client_code)
      .pipe(finalize(() => this.spinner_service.hide('medical_history_screen')))
      .subscribe(
        (data) => {
          console.log(data['data']);
          let data_ = data['data'];
          if(data_?.medical_personnel!=null){
            data_['question1'] = 'Y'
          }
          if(data_?.pregnancy_due_date!=null){
            data_['question2'] = 'Y'
            data_['pregnancy_due_date'] = new Date(data_?.pregnancy_due_date)
          }
          if(data_?.physical_challenge){
            data_['physical_challenge'] = 'Y'
          }else{
            data_['physical_challenge'] = 'N'
          }
          this.medicalHistoryForm.patchValue(data['data'])
          this.spinner_service.hide('medical_history_screen');
        },
        (err) => {
          this.spinner_service.hide('medical_history_screen');
        }
      );
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: any) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id as string];
      // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
  }

  onRowEditCancel(product: any, index: number) {
    this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }

  editBeneficiary(i) {}
  deleteMedicalListOne(i: number) {
    this.medicalListOne = this.deleteEntity(this.medicalListOne, i);
  }
  deleteMedicalListTwo(i: number) {
    this.medicalListTwo = this.deleteEntity(this.medicalListTwo, i);
  }
  updateBeneficiary(i) {}
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

  nextPage() {
    this.medical_history_service.saveMedicalHistory({}).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/home/lms/ind/quotation/summary']);
    });
  }

  ngOnDestroy(): void {
    console.log('MedicalHistoryComponent UNSUBSCRIBE');
  }
}
