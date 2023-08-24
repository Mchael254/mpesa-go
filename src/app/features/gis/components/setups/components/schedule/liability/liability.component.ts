import { Component } from '@angular/core';

@Component({
  selector: 'app-liability',
  templateUrl: './liability.component.html',
  styleUrls: ['./liability.component.css']
})
export class LiabilityComponent {

  public liabilities = ['private motors', 'private motors', 'private motors', 'private motors', 'private motors']

  filterLiabilities($event: KeyboardEvent) {

  }
}
