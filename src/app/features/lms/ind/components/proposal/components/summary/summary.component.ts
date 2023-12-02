import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, switchMap } from 'rxjs';
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

  constructor(private router:Router, 
    private session_service: SessionStorageService, 
    private quotation_service:QuotationService,
    private product_service: ProductService,
    private product_option_service: ProductOptionService,
    private party_service: PartyService,
    private spinner_service:NgxSpinnerService,
    private toast_service: ToastService){}
  ngOnInit(): void {
    this.spinner_service.show('summary_view');
    this.quotation_service
    .getLmsIndividualQuotationWebQuoteByCode(this.session_service.get(SESSION_KEY.QUICK_CODE))
    .pipe(
      switchMap((data: any) =>{ 
        console.log(data);
        
        this.proposalSummaryData = data;
        return this.product_service.getProductByCode(data?.product_code)
      }),
      switchMap((data_1 : any) =>{ 
        this.proposalSummaryData['product'] = data_1
        return this.product_option_service.getProductOptionByCode(this.proposalSummaryData?.pop_code)
        // return of(data_1)
      }),
      switchMap((data_2 : any) =>{ 
        this.proposalSummaryData['product_option'] = data_2
        // return this.product_option_service.getProductOptionByCode(this.proposalSummaryData?.pop_code)
        return of(data_2)
      }),  
    )
    .subscribe(
      (data) => 
      {
        console.log(data);
        this.spinner_service.hide('summary_view');
        this.toast_service.success('Successfull!!', 'Proposal Summary')
      },
      err=>{
        console.log(err);
        this.spinner_service.hide('summary_view');
      }
    )

    let quote_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.QUOTE_CODE));
    let proposal_code = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.PROPOSAL_CODE));
    this.party_service
      .getListOfBeneficariesByQuotationCode(quote_code, proposal_code)
      .subscribe((data) => {
        console.log(data);
        
        // this.beneficiaryList = data;
      });
    
  }

  returnFreqOfPayment(data: string){
    return Utils.returnFreqOfPayment(data);
  }


  nextPage(){
    this.router.navigate(['/home/lms/medicals/test'])

  }

}
