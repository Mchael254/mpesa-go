import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { MedicalsService } from 'src/app/features/lms/service/medicals/medicals.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmsService } from 'src/app/features/lms/service/dms/dms.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { Utils } from 'src/app/features/lms/util/util';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';

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
  decisionsFormOne: FormGroup;
  decisionsFormTwo: FormGroup;
  decisionsFormThree: FormGroup;
  // medicalResultForm : FormGroup;
  medicalReports:any[] = [];
  facilitatorList: any[] = [];
  util: Utils;
  filePath: any;
  fileName: any;
  possibleDecisionList: any[];
  loadTypeList: any[];

  constructor(
    private router: Router,
    private medical_service: MedicalsService,
    private dmsService: DmsService,
    private spinner_service:NgxSpinnerService,
    private fb: FormBuilder,
    private storage_service:SessionStorageService,
    private toast_service: ToastService,

  ) {
    this.util = new Utils(this.storage_service);
  }

  ngOnInit(): void { 
    this.decisionsFormOne = this.fb.group({
      ud_code : [],
      load_type: [],
      load_div_factor: [],
      load_rate: [],
      notes: []
    })
    this.decisionsFormTwo = this.fb.group({
      ud_code : [],
      load_type: [],
      load_div_factor: [],
      load_rate: [],
      notes: []
    })
    this.decisionsFormThree = this.fb.group({
      ud_code : [],
      load_type: [],
      load_div_factor: [],
      load_rate: [],
      notes: []
    })
    this.getClientMedicalTest();
    this.medical_service.serviceProvider().subscribe(data =>{
      this.facilitatorList = data;
      
    });
    this.medical_service.getUnderwritingDecisons(this.util.getPolCode()).subscribe((data: any[]) =>{
      this.possibleDecisionList = data;
      
    });
    this.medical_service.getLoadType().subscribe((data: any[]) =>{
      this.loadTypeList = data;
      
    })
  };

  private initForms(): void {

    this.diseaseForms = this.diseases.map((disease) =>
    
      { 
        disease['checked'] = disease['received'];
        disease['invoice_date'] = new Date(disease['invoice_date']);
        disease['cheque_date'] = new Date(disease['date_received']);
        disease['limit'] = disease['limit'];
        disease['facilitator'] = disease['spr_code'];
        
        return this.createForm(disease);}
    );

  }

  saveMedicalDecisionOne(){
    this.spinner_service.show('decisionsFormOne');

    let val = {
      "pol_code": this.util.getPolCode(),
      "type": "R",
      "decision": "A",
      "load_type": "N",
      "load_rate": 0,
      "load_div_factor": 0,
      "notes": "",
      ...this.decisionsFormOne.value
    }

    console.log(val);

    this.medical_service.saveRIMedicalDecison(val).subscribe(data =>{
      console.log(data);
      this.spinner_service.hide('decisionsFormOne');
      this.toast_service.success('save data successfully', 'Medical Decision'.toUpperCase());


      
    },
    err =>{
      this.spinner_service.hide('decisionsFormOne');
      this.toast_service.danger('fail to save data successfully', 'Medical Decision'.toUpperCase());

    })
    
  }

  saveMedicalDecisionTwo(){
    this.spinner_service.show('decisionsFormTwo');

    let val = {
      "pol_code": this.util.getPolCode(),
      "type": "R",
      "decision": "A",
      "load_type": "N",
      "load_rate": 0,
      "load_div_factor": 0,
      "notes": "",
      ...this.decisionsFormTwo.value
    }

    console.log(val);

    this.medical_service.saveRIMedicalDecison(val).subscribe(data =>{
      console.log(data);
      this.spinner_service.hide('decisionsFormTwo');
      this.toast_service.success('save data successfully', 'Medical Decision'.toUpperCase());


      
    },
    err =>{
      this.spinner_service.hide('decisionsFormTwo');
      this.toast_service.danger('fail to save data successfully', 'Medical Decision'.toUpperCase());

    })
    
  }

  saveMedicalDecisionThree(){
    this.spinner_service.show('decisionsFormThree');

    let val = {
      "pol_code": this.util.getPolCode(),
      "type": "R",
      "decision": "A",
      "load_type": "N",
      "load_rate": 0,
      "load_div_factor": 0,
      "notes": "",
      ...this.decisionsFormThree.value
    }

    console.log(val);

    this.medical_service.saveRIMedicalDecison(val).subscribe(data =>{
      console.log(data);
      this.spinner_service.hide('decisionsFormThree');
      this.toast_service.success('save data successfully', 'Medical Decision'.toUpperCase());

      
    },
    err =>{
      this.spinner_service.hide('decisionsFormThree');
      this.toast_service.danger('fail to save data successfully', 'Medical Decision'.toUpperCase());

    })
    
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

  // downloadReport(item: any){
  //   console.log(item);
  //   this.medical_service.downloadMedicalTestFile(item.rpt_code)
  //   .subscribe(
  //     (response: Blob) => {
  //       // Create a blob from the response data
  //       const blob = new Blob([response], { type: 'application/pdf' });

  //       // Create a URL for the blob
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a link element and set its href to the URL of the blob
  //       const link = document.createElement('a');
  //       link.href = url;

  //       // Set the filename for the downloaded file
  //       link.download = `${item.document}.pdf`;

  //       // Append the link to the document body and click it to trigger the download
  //       document.body.appendChild(link);
  //       link.click();

  //       // Clean up by revoking the URL
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(link);
  //   // .subscribe(data =>{
  //   //   // this.dmsService.downloadFile(data, item.document);
  //   },
  //   err=>{
  //     console.log(err);
      
  //   })

  // }

  downloadReport(item: any){
    this.spinner_service.show('test_report_view');
    console.log(item);
    this.medical_service.downloadMedicalTestFile(item.rpt_code)
    .subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.filePath  = window.URL.createObjectURL(blob);
        this.fileName = item.document;
        this.spinner_service.hide('test_report_view');
        this.toast_service.success('Successfully Preview Medical Report', 'Medical Report'.toUpperCase())

    },
    err=>{
      this.filePath= null;
      this.spinner_service.hide('test_report_view');
      console.log(err);
      
      this.toast_service.danger('Fail to Preview Medical Report', 'Preview Medical Report'.toUpperCase())
      console.log(err);
      
    })

  }


  private createForm(disease: any): FormGroup {   
    return this.fb.group({
      checked: [disease.checked],
      cheque_date: [disease.cheque_date],
      facilitator: [disease.facilitator],
      limit: [disease.limit],
      claim_amt: [disease.claim_amt], //invoiceAmount
      payable_amt: [disease.payable_amt],
      invoice_no: [disease.invoice_no],
      cml_code: [disease.cml_code],
      invoice_date: [disease.invoice_date],
      remarks: [disease.remarks],
    });
  }

  getClientMedicalTest() {
    this.spinner_service.show('medical_test_results_view');

    this.medical_service
      .getListOfClientMedicalTests(this.util.getPolCode())
      .subscribe((data: any[]) => {
        // console.log(data);
        
        this.diseases = data[0]?.medical_tests;
        this.initForms();
        this.spinner_service.hide('medical_test_results_view');
      },
      err =>{
        this.spinner_service.hide('medical_test_results_view');
      });
  }

  // updateClientMedicalTest(payload: any) {
  //   this.medical_service.updateClientMedicalTest(payload).subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  saveMedicalResult(index: number): void {
    this.spinner_service.show('medical_test_results_view');

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
      // console.log('Disease updated:', this.diseases[index]);
    //   let val = {
    //     "cml_code": formData?.cml_code,
    //     // "description": formData?.remarks,
    //     "limit": formData?.limitAmount,
    //     // "request_date": formData,
    //     // "spr_name": null,
    //     // "claim_amt": formData,
    //     "payable_amt": formData?.payableAmount,
    //     "received": formData?.checked,
    //     "date_received": formData?.checkedDate,
    //     "invoice_no": formData?.invoiceNo,
    //     "invoice_date": formData?.invoiceDate,
    //     // "cheque_no": formData,
    //     "cheque_date": formData?.checkedDate,
    //     "remarks": formData?.remarks,
    //     // "spr_code": null,
    //     // "validity_period": 24,
    //     "endr_code": this.util.getEndrCode()
    // }

      let val = {
        
        "claim_amt": formData?.payable_amt,
        "received": formData?.checked,
        "date_received": formData?.cheque_date,
        "invoice_no": formData?.invoice_no,
        "invoice_date": formData?.invoice_date,
        "request_date": formData?.invoice_date,
        "remarks": formData?.remarks,
        "spr_code": StringManipulation.returnNullIfEmpty(formData?.facilitator),
        "endr_code": this.util.getEndrCode()
    }
      this.medical_service.updateClientMedicalTest(val, formData?.cml_code).subscribe((data: any)=> {
        console.log(data);
        this.spinner_service.hide('medical_test_results_view');
        this.toast_service.success('Save Record Successfully','Capture Medical Test Results'.toUpperCase())
      },
      (err: any)=>{
        this.toast_service.danger(err?.error?.errors[0], 'Capture Medical Test Results'.toUpperCase() )
        this.spinner_service.hide('medical_test_results_view');
      })
    } else {
      // Mark all fields as touched to display validation messages
      form.markAllAsTouched();
      this.spinner_service.hide('medical_test_results_view');

    }
  }

  downloadFile() {
    if (!(this.filePath === null || this.filePath === '')) {
      const link = document.createElement('a');
      link.href = this.filePath;
      link.download = `${this.fileName}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the URL
      window.URL.revokeObjectURL(this.filePath);
      document.body.removeChild(link);
      this.toast_service.info('downloaded', 'Medical Reports'.toUpperCase())
    }
  }

  clearFile() {
    this.filePath = null;
    this.toast_service.success('remove preview file successfully', 'Medical Reports'.toUpperCase())

  }

  nextPage() {
    this.router.navigate(['/home/lms/ind/policy/underwriting']);
  }
}
