import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { MedicalsService } from 'src/app/features/lms/service/medicals/medicals.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmsService } from 'src/app/features/lms/service/dms/dms.service';

@Component({
  selector: 'app-result-processing',
  templateUrl: './result-processing.component.html',
  styleUrls: ['./result-processing.component.css'],
})
export class ResultProcessingComponent implements OnInit {
  steps = stepData;
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
      label: 'Medical Tests',
      url: '/home/lms/ind/quotation/lifestyle-details',
    },
  ];
  dynamicAccordionId: any;
  diseases: any[] = [];
  diseaseForms: FormGroup[] = [];
  // medicalResultForm : FormGroup;
  medicalReports:any[] = [];

  constructor(
    private router: Router,
    private medical_service: MedicalsService,
    private dmsService: DmsService,
    private spinner_service:NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void { 
    this.getClientMedicalTest();
    // this.medicalResultForm = this.fb.group({
    //   checked: [],
    //   cheque_date: [],
    //   facilitator: [],
    //   limit: [],
    //   claim_amt: [], //invoiceAmount
    //   payable_amt: [],
    //   invoice_no: [],
    //   invoice_date: [],
    //   remarks: [],
    // });
  };

  private initForms(): void {

    this.diseaseForms = this.diseases.map((disease) =>
      { return this.createForm(disease);}
    );

  }

  getListOfMedicalDocuments() : any[]{

    return this.medicalReports = [
      {
        rpt_code:329560,
        document:'MEDICAL LETTER'
      },
      {
        rpt_code:3926,
        document:'MEDICAL FORM'
      },
      {
        rpt_code:789053,
        document:'MEDICAL SENT LIST'
      },
      {
        rpt_code:789187,
        document:'MEDICAL LETTER TO CLIENT'
      },
      {
        rpt_code:789188 ,
        document:'MEDICAL LETTER TO DOCTOR'
      }


  ]

  }

  downloadReport(item: any){
    this.medical_service.downloadMedicalTestFile(item.rpt_code)
    .subscribe(data =>{
      // this.dmsService.downloadFile(data, item.document);
    },
    err=>{
      console.log(err);
      
    })

  }

  private createForm(disease: any): FormGroup {
    console.log(disease);
    
    return this.fb.group({
      checked: [disease.checked],
      cheque_date: [disease.cheque_date],
      facilitator: [disease.facilitator],
      limit: [disease.limit],
      claim_amt: [disease.claim_amt], //invoiceAmount
      payable_amt: [disease.payable_amt],
      invoice_no: [disease.invoice_no],
      invoice_date: [disease.invoice_date],
      remarks: [disease.remarks],
    });
  }

  getClientMedicalTest() {
    this.spinner_service.show('medical_test_results_view');
    this.medical_service
      .getListOfClientMedicalTests()
      .subscribe((data: any[]) => {
        this.diseases = data[0]?.medical_tests;
        this.initForms();
        this.spinner_service.hide('medical_test_results_view');
      },
      err =>{
        this.spinner_service.hide('medical_test_results_view');
      });
  }

  updateClientMedicalTest(payload: any) {
    this.medical_service.updateClientMedicalTest(payload).subscribe((data) => {
      console.log(data);
    });
  }

  saveMedicalResult(index: number): void {
    const form = this.diseaseForms[index];
    console.log(form.value);
    
    if (form.valid) {
      const formData = form.value;
      // Update disease object with form data
      // For example:
      this.diseases[index].checked = formData.checked;
      this.diseases[index].checkedDate = formData.checkedDate;
      this.diseases[index].facilitator = formData.facilitator;
      this.diseases[index].limitAmount = formData.limitAmount;
      this.diseases[index].invoiceAmount = formData.invoiceAmount;
      this.diseases[index].payableAmount = formData.payableAmount;
      this.diseases[index].invoiceNo = formData.invoiceNo;
      this.diseases[index].invoiceDate = formData.invoiceDate;
      this.diseases[index].remarks = formData.remarks;

      // Call your save method here, passing the updated disease object
      console.log('Disease updated:', this.diseases[index]);
      // this.medical_service.updateClientMedicalTest(form.value).subscribe((data: any)=> {
      //   console.log(data);
        
      // })
    } else {
      // Mark all fields as touched to display validation messages
      form.markAllAsTouched();
    }
  }

  nextPage() {
    this.router.navigate(['/home/lms/ind/policy/underwriting']);
  }
}
