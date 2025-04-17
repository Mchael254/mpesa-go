import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import {PolicyService} from '../../services/policy.service';
import {GlobalMessagingService} from 'src/app/shared/services/messaging/global-messaging.service';
import {Logger, untilDestroyed} from '../../../../../../shared/shared.module'
import {PolicyContent} from '../../data/policy-dto';
import {ClientService} from 'src/app/features/entities/services/client/client.service';
import {ClientDTO} from 'src/app/features/entities/data/ClientDTO';
import {catchError, forkJoin, map, mergeMap, of, tap} from 'rxjs';
import {ProductService} from 'src/app/features/gis/services/product/product.service';
import {Router} from '@angular/router';
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";

const log = new Logger("PolicySummary");


@Component({
  selector: 'app-policy-summary',
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.css']
})
export class PolicySummaryComponent implements OnInit, OnDestroy {
  steps = underwritingSteps
  policyDetails: any
  computationDetails: Object;
  premiumResponse: any;
  premium: number = 0;
  selectedItem: number = 1;
  show: boolean = true;
  errorMessage: string;
  errorOccurred: boolean;
  batchNo: any;
  policyDetailsData: PolicyContent;
  product: any
  clientDetails: ClientDTO;
  allClients: any;

  insureds: any;

  policySummary: any

  convertedQuotebatchNo: number

  constructor(
    public policyService: PolicyService,
    private globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    public productService: ProductService,
    private router: Router,
    private branchService: BranchService
  ) {
    this.convertedQuotebatchNo = JSON.parse(sessionStorage.getItem('convertedQuoteBatchNo'));
  }

  ngOnInit(): void {
    this.getPolicy();
  }

  ngOnDestroy(): void {
  }

  selectItem(item: number) {
    this.selectedItem = item;
  }


  getPolicy() {
    const batchNo = this.batchNo || this.convertedQuotebatchNo
    log.debug("Batch No:", batchNo)
    this.policyService
      .getPolicy(batchNo)
      .pipe(
        map(policy => policy.content[0]),
        tap((policy) => {
          const policyType = policy.policyType;
          if (policyType === 'A') {
            policy.policyType = 'ACCRUAL'
          }
        }),
        mergeMap((policy) => {
          return forkJoin(([
            of(policy),
            this.branchService.getBranchById(policy.branchCode),
            this.clientService.getClientById(policy.clientCode)
          ]))
        }),
        untilDestroyed(this))
      .subscribe({
        next: ([policy, branchDetails,clientDetails]) => {
          if (policy) {
            clientDetails.clientFullName = clientDetails?.firstName + ' '  + clientDetails?.lastName
            policy.branch = branchDetails
            policy.client = clientDetails
            this.policyDetailsData = policy;
            this.premium = policy.totalPremium
            this.policyDetailsData = policy
            log.debug("Policy Details data get policy", this.policyDetailsData)
            log.debug("Insureds", this.insureds)
            this.insureds = this.insureds.client.firstName + " " + this.insureds.client.lastName
            log.debug("Insureds", this.insureds)
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
            if (data) {
              log.debug('Client Details', data)
              this.clientDetails = data;

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
            if (data) {
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
          log.debug('ALL CLIENTS', this.allClients)

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

/*  getPolicyDetails() {
    this.policyService.getbypolicyNo(this.policyDetails?.policyNumber).subscribe({
      next: (res) => {
        this.policySummary = res
        const productCode = this.policySummary.proCode
        this.productService.getProductByCode(productCode).subscribe({
          next: (res) => {
            this.product = res

          }
        })

        console.log(res)
      }
    })
  }*/

  editPolicyDetails() {
    this.router.navigate([`/home/gis/policy/policy-product/edit/${this.policyDetails.batchNumber}`]);

  }

  previous() {
    this.router.navigate(['/home/gis/policy/risk-details']);
  }

}
