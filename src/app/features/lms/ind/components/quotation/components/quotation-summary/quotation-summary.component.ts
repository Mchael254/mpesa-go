import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { concatMap, finalize, switchMap, timer } from 'rxjs';
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
import { Utils } from 'src/app/features/lms/util/util';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';

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
  relationTypeList: any[] = [];
  documentList: any[] = [];
  coverTypeList: any[];
  client_details: any;
  countryList: any[] = [];
  util: Utils;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private route: Router,
    private quotation_service: QuotationService,
    private session_storage_service: SessionStorageService,
    private product_service: ProductService,
    private client_service: ClientService,
    private cover_type_service: CoverTypeService,
    private party_service: PartyService,
    private relation_type_service: RelationTypesService,
    private spinner: NgxSpinnerService,
    private dms_service: DmsService,
    private country_service: CountryService
  ) {
    this.util = new Utils(this.session_storage_service);
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
    this.getClientById();
    this.getCoverType();
    this.getProductList();
    this.getLmsIndividualQuotationWebQuoteByCode();
    this.getBeneficiariesByQuotationCode();
    this.getRelationTypes();
    this.getDocumentsByClientId();
    this.getCountryList();
  }
  ngOnDestroy(): void {
    console.log('OnDestroy QuotationSummaryComponent');
  }

  getCountryList(){
    this.country_service.getCountries().subscribe((data:any) =>{      
      this.countryList = data;
    })
  }

  getDocumentsByClientId() {
    let client_code =this.util.getClientCode();

    this.dms_service
      .getClientDocumentById(this.util.getClientCode())
      .subscribe((data) => {
        this.documentList = data['content'];
      });
  }

  downloadBase64File(url: string) {
    this.spinner.show('download_view');
    this.dms_service
      .downloadFileById(url)
      .pipe(
        finalize(() => {
          this.spinner.hide('download_view');
        })
      )
      .subscribe(() => {
        this.spinner.hide('download_view');
      });
  }

  getRelationTypes() {
    this.relation_type_service.getRelationTypes().subscribe((data: any[]) => {
      this.relationTypeList = data;
    });
  }

  // getClientById(code: any){
  //   this.spinner_Service.show('client_details_view');
  //   this.crm_client_service.getClientById(code).subscribe(data =>{
  //     this.clientForm.patchValue(data);
  //     this.clientForm.get('dateOfBirth').patchValue(new Date(data['dateOfBirth']));
  //     this.clientForm.get('modeOfIdentityNumber').patchValue(data['idNumber']);
  //     this.clientForm.get('countryId').patchValue(data['country']);
  //     this.clientForm.get('pinNumber').patchValue(data['pinNumber']);
  //     this.clientForm.get('modeOfIdentityId').patchValue(data['modeOfIdentity']);
  //     this.clientForm.get('contactDetails').get('branchId').patchValue(data['branchCode']);
  //     this.clientForm.get('contactDetails').get('emailAddress').patchValue(data['emailAddress']?.toLocaleLowerCase());
  //     this.clientForm.get('contactDetails').get('phoneNumber').patchValue(data['phoneNumber']);
  //     this.clientForm.get('contactDetails').get('titleShortDescription').patchValue(data['clientTitle']);
  //     this.clientForm.get('address').get('physical_address').patchValue(data['physicalAddress']);
  //     this.clientForm.get('paymentDetails').get('effective_from_date').patchValue(new Date(data['withEffectFromDate']));

  //     this.toast.success('Fetch Client Details Successfull', 'CLIENT DETAILS');
  //     this.spinner_Service.hide('client_details_view');

  //   },
  //   err => {
  //     console.log(err);
  //     // this.toast.danger('Unable to Fetch Client Details', 'CLIENT DETAILS');
  //     this.toast.danger(err?.error?.errors[0], 'CLIENT DETAILS');
  //     this.spinner_Service.hide('client_details_view');

  //   })
  // }


  getClientById() {
    this.client_service
      .getClientById(this.util.getClientCode())
      .pipe(
        concatMap((data) => {
          this.client_details = data;
          return this.client_details;
        }),
        concatMap((data: any) => {
          return this.country_service.getCountryById(data['country']).pipe(
            concatMap((data_r: any) => {
              return data;
            })
          );
        })
      )
      .subscribe((data: any) =>{
        console.log(data);
        
      });
  }

  getProductList() {
    this.product_service.getListOfProduct().subscribe((data: any[]) => {
      this.productList = data;
    });
  }

  getLmsIndividualQuotationWebQuoteByCode() {
    let web_quote_details = StringManipulation.returnNullIfEmpty(this.session_storage_service.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    // console.log(web_quote_details['payment_status']);
    this.summaryRecord = { ...web_quote_details };

    this.getCoverType()
      .pipe(
        switchMap((cover_types: any[]) => {
          this.coverTypeList = cover_types;

          return this.quotation_service.getLmsIndividualQuotationTelQuoteByCode(
            web_quote_details['quote_no']
          );
        }),
        switchMap((tel_quote_res: any[]) => {
          // console.log('tel_quote_res');
        // console.log(tel_quote_res);

          this.summaryRecord = {...this.summaryRecord, ...tel_quote_res };

          return this.quotation_service.getLmsIndividualQuotationWebQuoteByCode(
            web_quote_details['code']
          );
        })
      )
      .subscribe((web_quote_res: any) => {
        if(web_quote_details)  this.session_storage_service.set(SESSION_KEY.WEB_QUOTE_DETAILS,  web_quote_details); 

        this.summaryRecord = { ...this.summaryRecord, ...web_quote_res };
      });
  }

  getBeneficiariesByQuotationCode() {
    this.spinner.show('summary_screen');
    let quote_code =
      StringManipulation.returnNullIfEmpty(
        this.session_storage_service.get(SESSION_KEY.QUICK_QUOTE_DETAILS)[
          'quote_code'
        ]
      ) ||
      StringManipulation.returnNullIfEmpty(
        this.session_storage_service.get(SESSION_KEY.WEB_QUOTE_DETAILS)[
          'quote_no'
        ]
      );
    let proposal_code = StringManipulation.returnNullIfEmpty(
      this.session_storage_service.get(SESSION_KEY.WEB_QUOTE_DETAILS)[
        'proposal_no'
      ]
    );
    this.party_service
      .getListOfBeneficariesByQuotationCode(quote_code, proposal_code)
      .pipe(
        finalize(() => {
          this.spinner.hide('summary_screen');
        })
      )
      .subscribe((data) => {
        this.beneficiaryList = data;
        // console.log(data);
        this.spinner.hide('summary_screen');
      });
  }

  selectShareType(value: string) {
    this.shareInputType = value === 'email' ? 'email' : 'phone';
  }

  getCoverType() {
    let web = StringManipulation.returnNullIfEmpty(
      this.session_storage_service.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );
    return this.cover_type_service.getCoverTypeListByProduct(
      web?.product_code
    );
  }

  nextPage() {
    this.spinner.show('summary_screen');
    let web_quote = StringManipulation.returnNullIfEmpty(
      this.session_storage_service.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );

    if (web_quote?.proposal_no) {
      this.toast.success(
        'The above Quotation is already converted to Proposal',
        'PROPOSAL'
      );
      this.route.navigate(['/home/lms/ind/proposal/summary']);
    } else {
      this.quotation_service
        .convert_quotation_to_proposal(web_quote['code'])
        .subscribe(
          (data: any) => {
            if (data?.error_type === 'WARNING') {
              this.toast.danger(data?.message, 'Incomplete Data Input');
              this.spinner.hide('summary_screen');
              return;
            }
            this.toast.success(
              'Successfully Convert Quotation To Proposal',
              'PROPOSAL PAGE'
            );
            let quote = this.session_storage_service.get(
              SESSION_KEY.QUOTE_DETAILS
            );            
            if (quote) {
              quote['endr_code'] = data?.proposal_details?.endr_code;
              quote['pol_code'] = data?.proposal_details?.pol_code;
              quote['pol_status'] = data?.proposal_details?.pol_status;
              quote['ppr_code'] = data?.proposal_details?.ppr_code;
              quote['proposal_no'] = data?.proposal_details?.proposal_no;

              this.session_storage_service.set(
                SESSION_KEY.QUOTE_DETAILS,
                quote
              );
            }

            this.route.navigate(['/home/lms/ind/proposal/summary']);
            console.log(web_quote);
            console.log(data)
            

            web_quote = { ...web_quote, ...data };
            this.session_storage_service.set(
              SESSION_KEY.WEB_QUOTE_DETAILS,
              web_quote
            );            
          },
          (err: any) => {
            this.toast.danger(err['error']['errors'][0], 'WARNING');
            this.spinner.hide('summary_screen');
          }
        );
    }
  }
}
