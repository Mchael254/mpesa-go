import { ChangeDetectorRef, Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyService } from '../../services/policy.service';
import { Coinsurance, CoinsuranceDetail, PolicyContent, PolicyResponseDTO } from '../../data/policy-dto';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { FormBuilder, FormGroup } from '@angular/forms';

const log = new Logger("CoinsuaranceDetailsComponent");

@Component({
  selector: 'app-coinsuarance-details',
  templateUrl: './coinsuarance-details.component.html',
  styleUrls: ['./coinsuarance-details.component.css']
})
export class CoinsuaranceDetailsComponent {
  isCoinsuaranceLeader: boolean = false;
  coinsuranceList: Coinsurance[] = [];
  selectedCoinsurance: any;
  transformedCoinsurance: CoinsuranceDetail[] = [];
  coinsuranceData:any;

  policyDetails: PolicyContent;
  passedPolicyDetails: any;
  policyResponse: PolicyResponseDTO;

  batchNo: any;


  errorMessage: string;
  errorOccurred: boolean;

  coinsuranceForm: FormGroup;
  coinsForm: any;
  agentCode: any;
  agentDescription: any;
  isLeaderChecked:any;
  followerAgentCode:any;
  selectedFollower:any;


  constructor(
    private policyService: PolicyService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,



  ) {

  }
  ngOnInit(): void {

    const passedPolicyDetailsString = sessionStorage.getItem('passedPolicyDetails');
    this.passedPolicyDetails = JSON.parse(passedPolicyDetailsString);
    log.debug("Passed Policy Details:", this.passedPolicyDetails);
    this.agentCode = sessionStorage.getItem('agentCode');
    this.agentDescription = sessionStorage.getItem('agentDescription');
    log.debug("Passed Agent Code:", this.agentCode);
    log.debug("Passed Agent Desc:", this.agentDescription);
    

    this.getPolicy();
    this.getCoinsurance();
    this.createCoinsuranceForm();

  }
  ngOnDestroy(): void { }



  onCheckboxChange(event: any) {
    log.debug("Value passed by the checkbox:", event.target.checked)
    this.isCoinsuaranceLeader = event.target.checked;
  }
  getPolicy() {
    this.batchNo = this.passedPolicyDetails?.batchNumber;
    log.debug("Batch No:", this.batchNo)
    this.policyService
      .getPolicy(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {

          if (data && data.content && data.content.length > 0) {
            this.policyResponse = data;
            log.debug("Get Policy Endpoint Response", this.policyResponse)
            this.policyDetails = this.policyResponse.content[0]
            log.debug("Policy Details", this.policyDetails)

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
  getCoinsurance() {
    this.policyService
      .getCoinsurance(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            const coinsuranceResponse = data;
            log.debug("Coinsurance", coinsuranceResponse);
            this.coinsuranceList = coinsuranceResponse._embedded[0];
            log.debug("Coinsurance List", this.coinsuranceList);

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }
  saveSelectedCoinsurance() {
    log.debug("selected Coinsurance", this.selectedCoinsurance)
    this.transformedCoinsurance = this.selectedCoinsurance.map(item => this.mapToCoinsuranceDetail(item));
    log.debug("Transformed Coinsurance", this.transformedCoinsurance)

  }
  mapToCoinsuranceDetail(item: any): CoinsuranceDetail {
    return {
      name: item.name || '', // Map the 'name' field
      agaCode: null,
      agaShortDesc: '',
      agentCode: item.code,
      agentShortDesc:item.shortDescription,
      annualPremium: null,
      coinPolBatchNo: null,
      coinPolNo: '',
      commission: null,
      commissionRate: null,
      commissionType: '',
      duties: null,
      facPc: null,
      facSession: '',
      feeAmount: null,
      feeRate: null,
      feeType: '',
      forceSfCompute: '',
      glCode: '',
      lead: 'N',
      optionalCommision: '',
      percentage: null,
      policyNo: '',
      premium: null,
      premiumTax: null,
      proposalNo: '',
      renEndorsementNo: '',
      sumInsured: null,
      whtx: null
    };
  }
  createCoinsuranceForm() {
    this.coinsuranceForm = this.fb.group({
      agaCode: [''],
      agaShortDesc: [''],
      agentCode: [''],
      agentShortDesc: [''],
      annualPremium: [''],
      coinPolBatchNo: [''],
      coinPolNo: [''],
      commission: [''],
      commissionRate: [''],
      commissionType: [''],
      duties: [''],
      facPc: [''],
      facSession: [''],
      feeAmount: [''],
      feeRate: [''],
      feeType: [''],
      forceSfCompute: [''],
      glCode: [''],
      lead: [''],
      name: [''],
      optionalCommision: [''],
      percentage: [''],
      policyNo: [''],
      premium: [''],
      premiumTax: [''],
      proposalNo: [''],
      renEndorsementNo: [''],
      sumInsured: [''],
      whtx: [''],
    })
  }
  onRowEdit(data: any) {
    log.debug("EDITED DATA:", data);
    if (data) {
      this.coinsuranceData=data;
      log.debug("EDITED Coin DATA:", this.coinsuranceData);

      this.addCoinsurance();
    }
  }
  onLeaderCheckboxChange(event: any) {
    if (event.target.checked) {
        log.debug("This is the checked ", event.target)
    } else {
      log.debug("This is the checked test", event.target)
    }
}
  onLeaderChange(newValue: any){
    this.isLeaderChecked=this.transformedCoinsurance[0].lead = newValue ? 'Y' : 'N';
    // this.isLeaderChecked=transformedCoinsurance.lead = event.checked ? 'Y' : 'N';
    log.debug("IsLeaderChecked",this.transformedCoinsurance[0].lead)
  }
  addCoinsurance() {
    this.coinsuranceForm.get('agaCode').setValue(null);
    this.coinsuranceForm.get('agaShortDesc').setValue(null);
    this.coinsuranceForm.get('agentCode').setValue(this.coinsuranceData.agentCode);
    this.coinsuranceForm.get('agentShortDesc').setValue(this.coinsuranceData.agentShortDesc);
    this.coinsuranceForm.get('annualPremium').setValue('');
    this.coinsuranceForm.get('coinPolBatchNo').setValue(null);
    this.coinsuranceForm.get('coinPolNo').setValue(null);
    this.coinsuranceForm.get('commission').setValue(null);
    this.coinsuranceForm.get('commissionRate').setValue(null);
    this.coinsuranceForm.get('commissionType').setValue('R');
    this.coinsuranceForm.get('duties').setValue(null);
    this.coinsuranceForm.get('facPc').setValue(null);
    this.coinsuranceForm.get('facSession').setValue(null);
    this.coinsuranceForm.get('feeAmount').setValue(this.coinsuranceData.feeAmount);
    this.coinsuranceForm.get('feeRate').setValue(this.coinsuranceData.feeRate);
    this.coinsuranceForm.get('feeType').setValue(null);
    this.coinsuranceForm.get('forceSfCompute').setValue(null);
    this.coinsuranceForm.get('glCode').setValue(null);
    // this.coinsuranceForm.get('lead').getValue('Y');
    const isLeaderChecked = this.coinsuranceForm.get('lead').value ? 'Y' : 'N';
    this.coinsuranceForm.get('lead').setValue(this.isLeaderChecked);
    this.coinsuranceForm.get('name').setValue(null);
    this.coinsuranceForm.get('optionalCommision').setValue(null);
    this.coinsuranceForm.get('percentage').setValue(this.coinsuranceData.percentage);
    this.coinsuranceForm.get('policyNo').setValue(this.policyDetails.policyNo);
    this.coinsuranceForm.get('premium').setValue(this.coinsuranceData.premium);
    this.coinsuranceForm.get('premiumTax').setValue(null);
    this.coinsuranceForm.get('proposalNo').setValue(null);
    this.coinsuranceForm.get('renEndorsementNo').setValue(this.policyDetails.endorsementNo);
    this.coinsuranceForm.get('sumInsured').setValue(null);
    this.coinsuranceForm.get('whtx').setValue(null);
    const coinsuranceForm = this.coinsuranceForm.value;
    this.coinsForm = [coinsuranceForm];
    log.debug("COINSURANCE FORM",this.coinsForm)
    this.policyService
      .addCoinsurance(this.batchNo, this.coinsForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {

            log.debug("Coinsurance response", data);
            this.globalMessagingService.displaySuccessMessage('Success', 'Coinsurers  added successfully');

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }
  editCoinsurance(){
    
  }
  onRowSelect(Selectedfollower:any){
    this.selectedFollower=Selectedfollower
    log.debug("Follower Selected:",this.selectedFollower)
    this.followerAgentCode=this.selectedFollower.agentCode;

  }
  openDeleteModal(){
    if(!this.selectedFollower){
      this.globalMessagingService.displayInfoMessage('Error', 'Select a Coinsurer to continue');
    }else{
      document.getElementById("openModalButtonDelete").click();
  
    }
  }
  deleteCoinsurance(){
    this.policyService
    .deleteCoinsurance(this.followerAgentCode,this.batchNo)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (data: any) => {
        if (data) {

          const deletedIndex = this.transformedCoinsurance.findIndex(
            (item) => item.agentCode === this.followerAgentCode 
          );
          if (deletedIndex !== -1) {
            this.transformedCoinsurance.splice(deletedIndex, 1); // Remove the deleted item from the array
          }
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted Co-insurance');
        }
        else {
          this.errorOccurred = true;
          this.errorMessage = 'Empty response received from the server.';
          this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
        }

      },
      error: (err) => {

        this.globalMessagingService.displayErrorMessage(
          'Error',
          this.errorMessage
        );
        log.info(`error >>>`, err);
      },
    })
  }
}
