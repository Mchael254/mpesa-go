import { Component, Input, OnInit } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
// import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';

import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-landing-screen',
  templateUrl: './quotation-landing-screen.component.html',
  styleUrls: ['./quotation-landing-screen.component.css']
})
export class QuotationLandingScreenComponent implements OnInit {

  @Input() LMS_IND: any[];
  @Input() LMS_GRP: any[];
  @Input() GIS: any[];
  @Input() PEN: any[];
  constructor(private session_service: SessionStorageService, private router: Router){}
  
  ngOnInit(): void {
    this.session_service.clear_store();
  }
  

  selectLmsIndRow(i: any) {   
    this.session_service.set(SESSION_KEY.WEB_QUOTE_DETAILS, i)
    let quote={};
    quote['client_code'] = i['client_code'];
    quote['account_code'] = i['account_code'];
    quote['web_quote_code'] = i['code'];
    quote['proposal_no'] = i['proposal_no'];
    quote['tel_quote_code'] = i['quote_no'];
    quote['page'] = 'WEB';
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);

    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }

  selectNormalQuotation(){
    let quote={};
    quote['page'] = 'NEW';
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);
    this.router.navigate(['/home/lms/ind/quotation/client-details']);

  }

  

}