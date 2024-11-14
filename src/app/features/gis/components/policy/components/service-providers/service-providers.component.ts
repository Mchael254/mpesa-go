import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyResponseDTO, PolicyContent, ExternalClaimExp, Coinsurance } from '../../data/policy-dto';
import { PolicyService } from '../../services/policy.service';
const log = new Logger("ServiceProvidersComponent ");

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-providers.component.html',
  styleUrls: ['./service-providers.component.css']
})

export class ServiceProvidersComponent {

  errorOccurred: boolean;
  errorMessage: string;
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  serviceProviderList: any[] = [];
  addedServiceProviderList: any[] = [];
  selectedServiceProviders: any;
  selectedPolicyServiceProvider: any;
  insurersDetailsForm: FormGroup;
  insuranceList: Coinsurance[] = [];
  clientCode: number;

  @ViewChild('closebutton') closebutton;
  @ViewChild('closeEditClaimButton') closeEditClaimButton;


  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public authService: AuthService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }

  ngOnInit(): void {
   
  }
  ngOnDestroy(): void { }

  openServiceProviderDeleteModal() {
    log.debug("Selected service provider", this.selectedServiceProviders)
    if (!this.selectedServiceProviders) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a service provider to continue');
    } else {
      document.getElementById("openServiceProviderModalButtonDelete").click();

    }
  }
}
