import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, switchMap } from 'rxjs';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { CoverTypeService } from 'src/app/features/lms/service/cover-type/cover-type.service';
import { PartyService } from 'src/app/features/lms/service/party/party.service';
import { ProductOptionService } from 'src/app/features/lms/service/product-option/product-option.service';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { QuotationService } from 'src/app/features/lms/service/quotation/quotation.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { Utils } from 'src/app/features/lms/util/util';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

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
      switchMap((web_quote_res: any) =>{ 
        console.log(web_quote_res);
        
        this.proposalSummaryData = web_quote_res;
        return this.product_service.getProductByCode(web_quote_res?.product_code)
      }),
      switchMap((product_res : any) =>{ 
        // console.log(product_res);
        
        this.proposalSummaryData['product'] = product_res
        return this.product_option_service.getProductOptionByCode(this.proposalSummaryData?.pop_code)
      }),
      switchMap((prod_option_res : any) =>{ 
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
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.QUOTE_CODE));
    let proposal_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.PROPOSAL_CODE));
    this.party_service
      // .getListOfBeneficariesByQuotationCode(20235318, proposal_code)
      .getListOfBeneficariesByQuotationCode(quote_code, proposal_code)
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
