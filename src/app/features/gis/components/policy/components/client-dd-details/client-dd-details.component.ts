import { ChangeDetectorRef, Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { PolicyService } from '../../services/policy.service';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { BankBranchDTO } from 'src/app/shared/data/common/bank-dto';

const log = new Logger("ClientDDDetailsComponent ");
@Component({
  selector: 'app-client-dd-details',
  templateUrl: './client-dd-details.component.html',
  styleUrls: ['./client-dd-details.component.css']
})
export class ClientDdDetailsComponent {

  branchList: BankBranchDTO[];
  user: any;
  userDetails: any
  userBranchId: any;
  userBranchName: any;
  selectedBranchCode: any;
  selectedBranchDescription: any;
  errorOccurred: boolean;
  errorMessage: string;
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  clientDDList: any;
  selectedClientDD: any;
  clientDDDetailsForm: FormGroup;


  constructor(
    public branchService: BranchService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public authService: AuthService,
    public policyService: PolicyService,
    public fb: FormBuilder,
    public bankService:BankService,



  ) { }

  ngOnInit(): void {
    this.fetchBranches();
    this.getUtil();
    this.editClientDDDetailsForm();
  }
  ngOnDestroy(): void { }

  getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    const passedUserDetailsString = JSON.stringify(this.userDetails);
    sessionStorage.setItem('passedUserDetails', passedUserDetailsString);
    this.userBranchId = this.userDetails?.branchId;
    log.debug("Branch Id", this.userBranchId);
    // this.fetchBranches();

  }

  fetchBranches() {
    this.bankService.getBankBranchListByBankId(24).subscribe({
      next: (data) => {

        if (data) {
          this.branchList = data;
          log.info('Fetched Bank Branches', this.branchList);
          
          this.cdr.detectChanges();

        } else {
          this.errorOccurred = true;
          this.errorMessage = 'Something went wrong. Please try Again';
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get Bank branches details.Try again later');

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
  onBranchSelected(selectedValue: any) {
    this.selectedBranchCode = selectedValue;
    const selectedBranch = this.branchList.find(branch => branch.id === selectedValue);
    if (selectedBranch) {
      console.log("Selected Branch Data:", selectedBranch);

      const selectedBranchCode = selectedBranch.id;
      const selectedBranchName = selectedBranch.name;

      console.log("Selected Agent Code:", selectedBranchCode);
      console.log("Selected Agent Name:", selectedBranchName);
      this.selectedBranchCode = selectedBranchCode;
      this.selectedBranchDescription = selectedBranchCode;

    } else {
      console.log("Branch not found in agentList");
    }

  }
  getUtil() {
    this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    this.getPolicyDetails();
    log.debug("Policy Details", this.policyDetails);


  }

  getPolicyDetails() {
    this.batchNo = this.policyDetails.batchNumber;
    log.debug("Policy Batch Number:", this.batchNo)
    this.policyService
      .getPolicy(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.policyResponse = response;
          this.policyDetailsData = this.policyResponse.content[0]
          log.debug("Policy Details Data:", this.policyDetailsData)
          if (this.policyDetailsData) {
            this.fetchClientDDdetails()
          }
          this.cdr.detectChanges();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  policy details.Try again later');
        }
      })
  }
  fetchClientDDdetails() {
    this.policyService
      .getClientDDdetails(this.policyDetailsData.insureds[0].client.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.clientDDList = response._embedded
          log.debug('Client DD List:', this.clientDDList);


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get Client DD  details.Try again later');
        }
      });
  }
  editClientDDDetailsForm() {
    this.clientDDDetailsForm = this.fb.group({
      accountName: [''],
      accountNo: [''],
      bankBranchCode: [''],
      clientCode:[''],
    });
  }
  OnSelectClientDD(clientDD: any) {
    log.debug(" Selected client DD", clientDD)
    this.selectedClientDD = clientDD;
    this.clientDDDetailsForm.patchValue({

      accountName: clientDD.clientDdAccountName,
      accountNo:clientDD.clientDdAccountNo,
      // bankBranchCode:clientDD.code,
      clientCode: clientDD.clientOtherNames
    });
    if (this.selectedClientDD) {
      // this.addPolicyTaxes()
    }
  }

}