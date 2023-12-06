import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, timer } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { QuotationService } from 'src/app/features/lms/service/quotation/quotation.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { CoverTypeService } from 'src/app/features/lms/service/cover-type/cover-type.service';
import { PartyService } from 'src/app/features/lms/service/party/party.service';
import { RelationTypesService } from 'src/app/features/lms/service/relation-types/relation-types.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmsService } from 'src/app/features/lms/service/dms/dms.service';

@AutoUnsubscribe
@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quotation-summary.component.html',
  styleUrls: ['./quotation-summary.component.css'],
})
export class QuotationSummaryComponent implements OnInit, OnDestroy {
  contactDetailsForm: FormGroup;
  postalAddressForm: FormGroup;
  residentialAddressForm: FormGroup;

  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quick Quote',
      url: '/home/administration/ticket/details',
    },
    {
      label: 'Quotation Summary',
      url: '/home/lms/ind/quotation/quotation-details',
    },
  ];
  steps = stepData;
  // emailForm1: FormGroup;
  shareInputType: string;
  summaryRecord: {} = {};
  productList: any[] = [];
  clientRecord: ClientDTO;
  beneficiaryList: any[] = [];
  relationTypeList: any[] = []
  documentList: any[] = [];

  // constructor(private fb: FormBuilder){
  //   this.emailForm1 = this.fb.group({
  //     email_type:['']
  //   })
  // }

  // get emailTypeControl() {
  //   return this.emailForm1.get('email_type') as FormControl;
  // }

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private route: Router,
    private quotation_service: QuotationService,
    private session_storage_Service: SessionStorageService,
    private product_service: ProductService,
    private client_service: ClientService,
    private cover_type_service: CoverTypeService,
    private party_service: PartyService,
    private relation_type_service: RelationTypesService,
    private spinner: NgxSpinnerService,
    private dms_service: DmsService,

  ) {
    this.contactDetailsForm = this.fb.group({
      branch: [''],
      number: [''],
      title: [''],
      telephone: [''],
      email: [''],
      p_contact_channel: [''],
      edocs: [''],
    });

    this.postalAddressForm = this.fb.group({
      po_box: [''],
      country: [''],
      county: [''],
      town: [''],
      p_address: [''],
    });

    this.residentialAddressForm = this.fb.group({
      town: [''],
      road: [''],
      house_no: [''],
      u_bill: [''],
      u_u_bill: [''],
    });
  }
  ngOnInit(): void {
    this.getProductList();
    this.getLmsIndividualQuotationWebQuoteByCode();
    this.getClientById();
    this.getBeneficiariesByQuotationCode();
    this.getRelationTypes();
    this.getDocumentsByClientId();

  }
  ngOnDestroy(): void {
    console.log('OnDestroy QuotationSummaryComponent');
  }

  getDocumentsByClientId(){
    let client_code = this.session_storage_Service.get(SESSION_KEY.CLIENT_CODE);
    this.dms_service.getClientDocumentById(client_code)
    .subscribe(data =>{
      // console.log(data);
      this.documentList = data['content']
    });
  }

  downloadBase64File(url:string) {
    this.spinner.show('download_view');
    this.dms_service.downloadFileById(url).pipe(finalize(()=>{
      this.spinner.hide('download_view');
    })).subscribe(()=>{
      this.spinner.hide('download_view');
    })
  }

  getRelationTypes() {
    this.relation_type_service.getRelationTypes().subscribe((data: any[]) => {
      this.relationTypeList = data;
    });
  }

  getClientById() {
    let client_code = StringManipulation.returnNullIfEmpty(
      this.session_storage_Service.get(SESSION_KEY.CLIENT_CODE)
    );
    this.client_service
      .getClientById(client_code)
      .subscribe((data: ClientDTO) => {
        console.log(data);

        this.clientRecord = data;
      });
  }

  getProductList() {
    this.product_service.getListOfProduct().subscribe((data: any[]) => {
      this.productList = data;
    });
  }

  getLmsIndividualQuotationWebQuoteByCode() {
    let code = StringManipulation.returnNullIfEmpty(
      this.session_storage_Service.get(SESSION_KEY.QUOTE_CODE)
    );

    this.quotation_service
      .getLmsIndividualQuotationTelQuoteByCode(code)
      .subscribe((data: {}) => {
        this.summaryRecord = { ...data };
      });
  }

  getBeneficiariesByQuotationCode() {
    this.spinner.show('summary_screen');

    let quote_code = +this.session_storage_Service.get(SESSION_KEY.QUOTE_CODE);
    let proposal_code = +this.session_storage_Service.get(SESSION_KEY.PROPOSAL_CODE);
    this.party_service
      .getListOfBeneficariesByQuotationCode(quote_code, proposal_code)
      .subscribe((data) => {
        this.beneficiaryList = data
        // console.log(data);
        this.spinner.hide('summary_screen');
      });
  }

  selectShareType(value: string) {
    this.shareInputType = value === 'email' ? 'email' : 'phone';
  }

  nextPage() {
    this.spinner.show('summary_screen');

    let quick_quote_code = StringManipulation.returnNullIfEmpty(this.session_storage_Service.get(SESSION_KEY.QUICK_CODE));
    // this.quotation_service.convert_quotation_to_proposal(quick_quote_code).subscribe(data =>{
    //   this.toast.success('Next To Proposal Page', 'PROPOSAL');
      this.route.navigate(['/home/lms/ind/proposal/summary']);
    //   console.log(data);
    //   this.spinner.hide('summary_screen');
    //   // timer(1300).subscribe(() => {
    //   //   this.route.navigate(['/home/lms/ind/proposal/summary']);
    //   // });
    // },
    // err=> {
    //   this.toast.danger('Unable to Proceed to Proposal', 'WARNING');
    //   this.spinner.hide('summary_screen');
    //   // console.error(err);
      
    // })
    
  }
}
