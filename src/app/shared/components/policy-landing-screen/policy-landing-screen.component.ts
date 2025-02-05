import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';

@Component({
  selector: 'app-policy-landing-screen',
  templateUrl: './policy-landing-screen.component.html',
  styleUrls: ['./policy-landing-screen.component.css'],
  standalone : false
})
export class PolicyLandingScreenComponent {
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
    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }
}
