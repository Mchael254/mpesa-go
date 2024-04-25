import { Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'

const log = new Logger("CoinsuaranceDetailsComponent");

@Component({
  selector: 'app-coinsuarance-details',
  templateUrl: './coinsuarance-details.component.html',
  styleUrls: ['./coinsuarance-details.component.css']
})
export class CoinsuaranceDetailsComponent {
  isCoinsuaranceLeader: boolean = false;

  constructor(){

  }
  ngOnInit(): void {

  }
  ngOnDestroy(): void { }



  onCheckboxChange(event: any) {
    log.debug("Value passed by the checkbox:", event.target.checked)
    this.isCoinsuaranceLeader = event.target.checked;
  }
}
