import { Component } from '@angular/core';
import {Logger} from "../../../../../../../shared/services";

const log = new Logger('WordingsComponent');

@Component({
  selector: 'app-wordings',
  templateUrl: './wordings.component.html',
  styleUrls: ['./wordings.component.css']
})
export class WordingsComponent {

  public wordings = ['ADVANCE PAYMENT BOND', 'ADVANCE PAYMENT BOND', 'ADVANCE PAYMENT BOND', 'ADVANCE PAYMENT BOND'];
  public modalTitle: string = '';

  filterWordings($event: KeyboardEvent) {

  }

  callActionsModal(action: string) {
    log.info(`called action >>>`, action);
    this.modalTitle = action === 'add' ? 'add' : action === 'edit' ? 'edit' : '';
  }
}
