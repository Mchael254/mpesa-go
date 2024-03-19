import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoverTypeService } from 'src/app/features/lms/service/cover-type/cover-type.service';
import { PartyService } from 'src/app/features/lms/service/party/party.service';
import { ProductOptionService } from 'src/app/features/lms/service/product-option/product-option.service';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { QuotationService } from 'src/app/features/lms/service/quotation/quotation.service';
import { switchMap } from 'rxjs';
import { MedicalsService } from 'src/app/features/lms/service/medicals/medicals.service';
import { PoliciesService } from 'src/app/features/lms/service/policies/policies.service';
import { Utils } from 'src/app/features/lms/util/util';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit {
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
  quotation_details: any;
  product: any;
  date_full = new Date();
  isTestFormSelected: boolean;
  medicalTestList: any[];
  clientMedicalTestList: any = {};
  util: Utils;
  policySummaryDetails: any = {};
  medicalReports: any[] = [];
  testForm: FormGroup;
  filePath: any;
  fileName: any;

  constructor(
    private router: Router,
    private session_service: SessionStorageService,
    private quotation_service: QuotationService,
    private product_service: ProductService,
    private product_option_service: ProductOptionService,
    private party_service: PartyService,
    private spinner_service: NgxSpinnerService,
    private cover_type_service: CoverTypeService,
    private medical_service: MedicalsService,
    private toast_service: ToastService,
    private policies_service: PoliciesService,
    private fb: FormBuilder
  ) {
    this.util = new Utils(this.session_service);
  }

  ngOnInit(): void {
    this.quotation_details = StringManipulation.returnNullIfEmpty(
      this.session_service.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );
    this.medicalSummaryResults();
    this.getClientMedicalTest();
    this.getPolMedicalTest();

    this.testForm = this.fb.group({
      lien: ['N'],
    });
  }

  getListOfMedicalDocuments(): any[] {
    return (this.medicalReports = [
      {
        rpt_code: 329560,
        document: 'MEDICAL LETTER',
      },
      {
        rpt_code: 3926,
        document: 'MEDICAL FORM',
      },
      {
        rpt_code: 789053,
        document: 'MEDICAL SENT LIST',
      },
      {
        rpt_code: 789187,
        document: 'MEDICAL LETTER TO CLIENT',
      },
      {
        rpt_code: 789188,
        document: 'MEDICAL LETTER TO DOCTOR',
      },
    ]);
  }

  downloadReport(item: any) {
    this.spinner_service.show('test_report_view');
    console.log(item);
    this.medical_service.downloadMedicalTestFile(item.rpt_code).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.filePath = window.URL.createObjectURL(blob);
        this.fileName = item.document;
        this.spinner_service.hide('test_report_view');
        this.toast_service.success(
          'Successfully Preview Medical Report',
          'Medical Report'.toUpperCase()
        );
      },
      (err) => {
        this.filePath = null;
        this.spinner_service.hide('test_report_view');
        console.log(err);

        this.toast_service.danger(
          'Fail to Preview Medical Report',
          'Preview Medical Report'.toUpperCase()
        );
        console.log(err);
      }
    );
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

  medicalSummaryResults() {
    this.spinner_service.show('medical_view');
    this.product_service
      .getProductByCode(this.quotation_details['product_code'])
      .pipe(
        switchMap((product_res: any) => {
          // this.spinner_service.hide('medical_view');
          this.product = product_res;
          console.log(this.product);
          let pol_code = this.util.getPolCode();
          let endr_code = this.util.getEndrCode();

          // return this.quotation_service
          // .getLmsIndividualQuotationWebQuoteByCode(this.quotation_details['code'])
          return this.policies_service.listPolicySummaryByPolCodeAndEndrCode(
            pol_code,
            endr_code
          );
        })
      )

      .subscribe(
        (policy_summary: any) => {
          // this.quotation_details = web_quote_res
          this.policySummaryDetails = policy_summary;
          this.spinner_service.hide('medical_view');
          this.toast_service.success(
            'Fetch record successfully',
            'MEDICAL SUMMARY'
          );
        },
        (err: any) => {
          this.spinner_service.hide('medical_view');
          this.toast_service.success(
            'Fail fetch record successfully',
            'MEDICAL SUMMARY'
          );
        }
      );
  }

  getClientMedicalTest() {
    this.spinner_service.show('test_view');
    this.medical_service.getListOfClientMedicalTests().subscribe(
      (data: any[]) => {
        this.clientMedicalTestList = data[0];
        this.spinner_service.hide('test_view');
        this.toast_service.success(
          'Fetch record successfully',
          'MEDICAL TESTS'
        );
      },
      (err) => {
        this.spinner_service.hide('test_view');
        this.toast_service.danger(
          'Fail to fetch record successfully',
          'MEDICAL TESTS'
        );
      }
    );
  }

  getPolMedicalTest() {
    this.spinner_service.show('test_view');
    this.medical_service.getListOfTests(1).subscribe(
      (data: any[]) => {
        this.medicalTestList = data;
        this.toast_service.success(
          'Fetch Record Successfully',
          'MEDICAL TESTS'
        );
        console.log(data);
      },
      (err) => {
        this.spinner_service.hide('test_view');
        this.toast_service.danger(
          'Fail to fetch record successfully',
          'MEDICAL TESTS'
        );
      }
    );
  }

  deleteMedicalTest(test: any) {
    this.spinner_service.show('test_view');
    let cml_code = test?.cml_code === undefined ? 0 : test?.cml_code;
    this.medical_service.deleteClientMedicalTest(cml_code).subscribe((data) => {
      this.toast_service.success('Delete Record Successfully', 'MEDICAL TESTS');
      this.clientMedicalTestList['medical_tests'] =
        this.clientMedicalTestList?.medical_tests.filter(
          (data: any) => data['cml_code'] != cml_code
        );
      this.spinner_service.hide('test_view');
    });
  }

  selectTestForm(status = true) {
    console.log(status);

    this.isTestFormSelected = status;
  }

  saveTestForm(status: any) {
    this.spinner_service.show('test_view');
    let mtl_code = StringManipulation.returnNullIfEmpty(status.target.value);
    let pol_code = this.util.getPolCode();
    let endr_code = this.util.getEndrCode();

    console.log(pol_code);
    console.log(status);

    let testValue = {
      pol_code: pol_code,
      endr_code: endr_code,
      mtl_code: mtl_code,
      type: 'A',
    };

    this.medical_service.saveClientMedicalTest(testValue).subscribe(
      (data) => {
        console.log(data);
        this.isTestFormSelected = false;
        this.toast_service.success('Save Record Successfully', 'MEDICAL TESTS');

        // this.toast_service.success('Delete Record Successfully', 'MEDICAL TESTS');
        // this.clientMedicalTestList['medical_tests'] = this.clientMedicalTestList?.medical_tests.filter((data: any) => data['cml_code']!=cml_code);

        this.getClientMedicalTest();
      },
      (err) => {
        this.toast_service.danger(err?.message, 'Data Not Found');
      }
    );
  }
  nextPage() {
    if (this.testForm.get('lien').value === 'Y') {
      this.router.navigate(['/home/lms/ind/policy/underwriting']);
      return;
    }
    this.router.navigate(['/home/lms/medicals/result-processing']);
  }
}
