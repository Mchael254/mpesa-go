import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import { PolicyService } from '../../services/policy.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Sidebar } from 'primeng/sidebar';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyContent, PolicyResponseDTO } from '../../data/policy-dto';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { catchError, forkJoin, map, of } from 'rxjs';

const log = new Logger("RiskDetailsComponent");


@Component({
  selector: 'app-policy-summary',
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.css']
})
export class PolicySummaryComponent {
  steps = underwritingSteps
  policyDetails:any
  computationDetails: Object;
  premiumResponse:any;
  premium:any;
  selectedItem: number = 1; 

  policySectionDetails:any;
  errorMessage: string;
  errorOccurred: boolean;
  batchNo:any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;

  clientDetails:ClientDTO;
  allClients:any;

  insureds:any;

  policySummary:any

  constructor(
    public policyService:PolicyService,
    private globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,


  ){}

  ngOnInit(): void {
    this.getUtil();
    this.getPolicyDetails();
  }
  ngOnDestroy(): void { }

  selectItem(item: number) {
    this.selectedItem = item;
  }


  getUtil(){
   this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
   this.getPolicy();

   this.policyService.policyUtils(this.policyDetails.batchNumber).subscribe({
    next :(res) =>{
     this.computationDetails = res
     console.log( 'computation details',this.computationDetails)
     log.debug("Policy Details", this.policyDetails);
    }
  })
}
computePremium(){
  this.policyService.computePremium(this.computationDetails).subscribe({
    next:(res)=>{
      this.premiumResponse = res
      this.premium = this.premiumResponse.premiumAmount
      this.globalMessagingService.displaySuccessMessage('Success','Premium computed successfully ')
      console.log(this.premium)
    }, error : (error) => {
     
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

      }
  })
}
getPolicy() {
  this.batchNo = this.policyDetails.batchNumber;
  log.debug("Batch No:", this.batchNo)
  this.policyService
    .getPolicy(this.batchNo)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (data: any) => {

        if (data && data.content && data.content.length > 0) {
          this.policyResponse = data;
          log.debug("Get Policy Endpoint Response", this.policyResponse)
          this.policyDetailsData = this.policyResponse.content[0]
          log.debug("Policy Details data get policy", this.policyDetailsData)
          this.insureds = this.policyDetailsData.insureds
          log.debug("Insureds", this.insureds)
          if (this.insureds){
            this.getClient()
          }

          // this.productCode = this.policyDetails.product.code;
          // log.debug("Product Code", this.productCode)
          // this.passedCoverFrom = this.policyDetails.wefDt;
          // log.debug("COVER FROM", this.passedCoverFrom);
          // this.passedCoverTo = this.policyDetails.wetDt;
          // log.debug("COVER TO", this.passedCoverTo);
          // this.passedClientCode = this.policyDetails.clientCode
          // log.debug("CLIENT CODE", this.passedClientCode);


          // Calculate cover days
       
          this.cdr.detectChanges();

        } else {
          this.errorOccurred = true;
          this.errorMessage = 'Something went wrong. Please try Again';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Something went wrong. Please try Again'
          );
        }
      },
      error: (err) => {

        this.globalMessagingService.displayErrorMessage(
          'Error',
          this.errorMessage
        );
        log.info(`error >>>`, err);
      },
    });
}
getoClient() {
  for (const insured of this.insureds) {
    const clientRequests = [];
    const prpCode = insured.prpCode; // Assuming each insured object has prpCode
    log.debug("PRPCODE", prpCode)
    this.clientService
      .getClientById(prpCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data ) {
            log.debug('Client Details',data)
          this.clientDetails =data;
            
            // Process clientDetails as needed
            
            this.cdr.detectChanges(); // Trigger change detection if needed
          } else {
            // Handle case where client details are not found
            console.error(`Client details not found for prpCode: ${prpCode}`);
          }
        },
        error: (err) => {
          // Handle error fetching client details
          console.error(`Error fetching client details for prpCode ${prpCode}:`, err);
        },
      });
  }
}
getClient() {
  const clientRequests = [];

  for (const insured of this.insureds) {
    const prpCode = insured.prpCode; // Assuming each insured object has prpCode

    const clientRequest = this.clientService.getClientById(prpCode)
      .pipe(
        map((data: any) => {
          if (data ) {
            return data; // Assuming only one client is expected
          } else {
            throw new Error(`Client details not found for prpCode: ${prpCode}`);
          }
        }),
        catchError(err => {
          console.error(`Error fetching client details for prpCode ${prpCode}:`, err);
          return of(null); // Return null or appropriate fallback value on error
        })
      );

    clientRequests.push(clientRequest);
  }

  // Use forkJoin to combine all requests into a single observable
  forkJoin(clientRequests)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (clients: any[]) => {
        console.log('All client details fetched:', clients);

        // Process the array of client details as needed
        // For example, assign it to a component property
        this.allClients = clients;
        log.debug('ALL CLIENTS',this.allClients)

        this.cdr.detectChanges(); // Trigger change detection if needed
      },
      error: (err) => {
        // Handle error fetching any client details
        console.error('Error fetching client details:', err);

        this.errorOccurred = true;
        this.errorMessage = 'Error fetching client details';
        this.globalMessagingService.displayErrorMessage(
          'Error',
          this.errorMessage
        );
      }
    });
}

getPolicyDetails(){
  this.policyService.getbypolicyNo(this.policyDetails.policyNumber).subscribe({
    next:(res)=>{
      this.policySummary = res
      console.log(res)
    }
  })
}
}
