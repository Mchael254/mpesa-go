import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BankBranchDTO } from 'src/app/shared/data/common/bank-dto';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';

@Component({
  selector: 'app-external-claims',
  templateUrl: './external-claims.component.html',
  styleUrls: ['./external-claims.component.css']
})
export class ExternalClaimsComponent {

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
  externalClaimList: any[] = [];
  selectedExternalClaim: any;
  clientDDDetailsForm: FormGroup;
  clientData:any
  passedClientName:any;
}
