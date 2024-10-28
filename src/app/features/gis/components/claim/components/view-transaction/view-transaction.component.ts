import { Component } from '@angular/core';
import claimSteps from '../../data/claims_steps.json'
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css']
})
export class ViewTransactionComponent {
  steps = claimSteps


  constructor(
    private router: Router,
  ){}

  previous(){
    this.router.navigate(['/home/gis/claim/claim-transaction']);
  }

}
