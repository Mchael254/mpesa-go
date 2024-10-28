import { Component } from '@angular/core';
import { ClaimsService } from '../../services/claims.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

@Component({
  selector: 'app-revision-summary',
  templateUrl: './revision-summary.component.html',
  styleUrls: ['./revision-summary.component.css']
})
export class RevisionSummaryComponent {

   // Example data to display (Replace with actual data)
   transactionType = 'LOP';
   revisionDate = '12/08/2024';
   revisionOwnPercentage = 100;
   ownGrossAmount = 30000000.00;
   ownShare = 30000000.00;
   revisionAuthorized = 'N';

   undoMakeReady:boolean = false;
   transactionDetails:any;
   revisionDetails:any
  user: string;
  userDetails: any

   constructor(
    public claimService:ClaimsService,
    public authService:AuthService,
    private spinner: NgxSpinnerService,
    public globalmessagingservice:GlobalMessagingService
   ){

   }

   ngOnInit(): void {
    this.spinner.show()
     this.getRevisionDetails();
     this.getCurrentUser()

   }
 
   getRevisionDetails(){
     this.transactionDetails = sessionStorage.getItem('transactionDetails')
     this.transactionDetails = JSON.parse(this.transactionDetails)
     console.log(this.transactionDetails.transactionNo)
     console.log(this.transactionDetails.claimNo)
     this.claimService.getRevisionDetails(this.transactionDetails.claimNo,this.transactionDetails.transactionNo).subscribe({
      next:(res=>{
        this.revisionDetails = res
        this.revisionDetails = this.revisionDetails.embedded[0][0]
        console.log(this.revisionDetails,'revision details')
        this.spinner.hide()
      })
     })
   }
   getCurrentUser(){
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    console.info('Login UserDetails', this.userDetails);
    const passedUserDetailsString = JSON.stringify(this.userDetails);
    sessionStorage.setItem('passedUserDetails', passedUserDetailsString);
  }

   
   makeReady() {
    const payload = {
      "claim_no": this.transactionDetails.claimNo,
      "transaction_no": this.transactionDetails.transactionNo,
      "transaction_type": this.transactionDetails.transactionType,
      "user": this.userDetails.username
    }
    console.log(payload)
    this.claimService.makeReady(payload).subscribe({
      next:(res=>{
        console.log(res)
      }),
      error:(err=>{
        this.globalmessagingservice.displayErrorMessage('Error',err.message)
      })
    })
    this.undoMakeReady = true


  }

 undo(){
  this.undoMakeReady = false
 }
  authorize() {
    console.log('Authorize clicked');
  }

  dispatchDocuments() {
    console.log('Dispatch Documents clicked');
  }

  printVoucher() {
    console.log('Print Voucher clicked');
  }

  back() {
    console.log('Back clicked');
  }

  reassign() {
    console.log('Re-Assign clicked');
  }

  sendEmail() {
    console.log('Send Email clicked');
  }

  sendSMS() {
    console.log('Send SMS clicked');
  }
}
