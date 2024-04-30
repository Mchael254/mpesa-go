import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, of, switchMap } from 'rxjs';
import {Utils} from "../../../../../util/util";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {QuotationService} from "../../../../../service/quotation/quotation.service";
import {ProductService} from "../../../../../service/product/product.service";
import {ProductOptionService} from "../../../../../service/product-option/product-option.service";
import {PartyService} from "../../../../../service/party/party.service";
import {CoverTypeService} from "../../../../../service/cover-type/cover-type.service";
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import {ClientService} from "../../../../../../entities/services/client/client.service";
import {StringManipulation} from "../../../../../util/string_manipulation";
import {SESSION_KEY} from "../../../../../util/session_storage_enum";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  proposalSummaryData: any = {};
  coverTypeList: any[] = [];
  beneficiaryList: any[] = [];
  client_info: any;
  util: Utils;

  constructor(private router:Router,
    private session_service: SessionStorageService,
    private quotation_service:QuotationService,
    private product_service: ProductService,
    private product_option_service: ProductOptionService,
    private party_service: PartyService,
    private spinner_service:NgxSpinnerService,
    private cover_type_service: CoverTypeService,
    private crm_client_service: ClientService,
    private toast_service: ToastService){
      this.util = new Utils(this.session_service);
    }


  ngOnInit(): void {
    this.getProposalSummaryInfo();
    this.getBeneficiariesByQuotationCode();
    this.getCoverType();

    let client_code = this.util.getClientCode();
    if(client_code){
      this.crm_client_service.getClientById(client_code).subscribe(data => {
        console.log(data);

        this.client_info = data;
      })
    }

  }

  getCoverType(){
    let web = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.WEB_QUOTE_DETAILS));

    this.cover_type_service.getCoverTypeListByProduct(web['product_code']).subscribe((cover_types:any[]) =>{
      // console.log(cover_types);
      this.coverTypeList = cover_types;

    })
  }

  getProposalSummaryInfo(){
    this.spinner_service.show('summary_view');
    this.quotation_service
    .getLmsIndividualQuotationWebQuoteByCode(this.session_service.get(SESSION_KEY.WEB_QUOTE_DETAILS)['code'])
    .pipe(
      concatMap((web_quote_res: any) =>{
        console.log(web_quote_res);
        let quote  = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.QUOTE_DETAILS));
        quote['endr_code']= web_quote_res['proposal_details']['endr_code'];
        quote['pol_code']= web_quote_res['proposal_details']['pol_code'];
        this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);
        this.proposalSummaryData = web_quote_res;
        return this.product_service.getProductByCode(web_quote_res?.product_code)
      }),
      concatMap((product_res : any) =>{
        this.proposalSummaryData['product'] = product_res
        return this.product_option_service.getProductOptionByCode(this.proposalSummaryData?.pop_code)
      }),
      concatMap((prod_option_res : any) =>{
        this.proposalSummaryData['product_option'] = prod_option_res
        // return this.cover_type_service.getCoverTypeByCode(this.proposalSummaryData?.pop_code)
        return of(prod_option_res)

      })
    )
    .subscribe(
      (data) =>
      {
        this.spinner_service.hide('summary_view');
        this.toast_service.success('Fetched all necessary data successfully', 'Proposal Summary')
      },
      err=>{
        // console.log(err);
        this.spinner_service.hide('summary_view');
      }
    )
  }


  getBeneficiariesByQuotationCode() {
    let quote_code: any = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.QUOTE_DETAILS));
    // let proposal_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.PROPOSAL_CODE));
    this.party_service
      .getListOfBeneficariesByQuotationCode(quote_code?.tel_quote_code, quote_code?.proposal_no)
      .subscribe((data: any[] ) => {
        this.beneficiaryList = data;
      });
  }

  returnFreqOfPayment(data: string){
    return Utils.returnFreqOfPayment(data);
  }


  nextPage(){
    if(!!this.proposalSummaryData?.proposal_no){
      this.router.navigate(['/home/lms/medicals/test']);
    }else{
      this.toast_service.danger('Proposal No. is not defined yet!', 'PROPOSAL DETAILS')
    }

  }

}
