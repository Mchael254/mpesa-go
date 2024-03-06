import { Component, Input } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-landing-screen',
  templateUrl: './quotation-landing-screen.component.html',
  styleUrls: ['./quotation-landing-screen.component.css'],
})
export class QuotationLandingScreenComponent {
  @Input() LMS_IND: any[];
  @Input() LMS_GRP: any[];
  @Input() GIS: any[];
  @Input() PEN: any[];
  constructor(
    private session_service: SessionStorageService,
    private router: Router
  ) {}

  selectLmsIndRow(i: any) {
    this.session_service.set(SESSION_KEY.QUOTE_CODE, i['quote_no']);
    this.session_service.set(SESSION_KEY.CLIENT_CODE, i['client_code']);
    this.session_service.set(SESSION_KEY.QUICK_CODE, i['code']);
    this.session_service.set(SESSION_KEY.PROPOSAL_CODE, i['proposal_no']);
    this.session_service.set(SESSION_KEY.WEB_QUOTE_DETAILS, i);
    let quote = {};
    quote['quote_no'] = i['quote_no'];
    quote['client_code'] = i['client_code'];
    quote['account_code'] = i['account_code'];
    quote['web_quote_code'] = i['code'];
    quote['proposal_no'] = i['proposal_no'];
    quote['tel_quote_code'] = i['quote_no'];

    this.session_service.set(SESSION_KEY.QUOTE_CODE, i['quote_no']);
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);

    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }
}
