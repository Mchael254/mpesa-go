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


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent  implements OnInit{
  steps = stepData
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list'
    },
    {
      label: 'Medical Tests',
      url: '/home/lms/ind/quotation/lifestyle-details'
    },
  ];
  quotation_details: any;
  product: any;
  date_full = new Date();

  constructor(private router:Router,  
    private session_service: SessionStorageService, 
    private quotation_service:QuotationService,
    private product_service: ProductService,
    private product_option_service: ProductOptionService,
    private party_service: PartyService,
    private spinner_service:NgxSpinnerService,
    private cover_type_service: CoverTypeService,
    private toast_service: ToastService){}

  ngOnInit(): void {
    this.quotation_details = StringManipulation.returnNullIfEmpty(this.session_service.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    this.medicalSummaryResults();
  }



  medicalSummaryResults(){
    this.product_service
    .getProductByCode(this.quotation_details['product_code'])
    .pipe(switchMap((product_res:any)=>{
      this.product = product_res
      console.log(this.product);
      
      return this.quotation_service
      .getLmsIndividualQuotationWebQuoteByCode(this.quotation_details['code'])
    }))
    
    .subscribe((web_quote_res:any) => {
      this.quotation_details = web_quote_res

      console.log(web_quote_res);
      

    }, (err: any) =>{})
  }

  nextPage(){
    this.router.navigate(['/home/lms/medicals/result-processing'])
  }

}
