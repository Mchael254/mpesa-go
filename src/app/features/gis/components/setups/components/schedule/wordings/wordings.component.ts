import { Component } from '@angular/core';
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import {Logger} from "../../../../../../../shared/services/logger/logger.service";

const log = new Logger('WordingsComponent');

@Component({
  selector: 'app-wordings',
  templateUrl: './wordings.component.html',
  styleUrls: ['./wordings.component.css']
})
export class WordingsComponent {

  public wordings = ['ADVANCE PAYMENT BOND', 'ADVANCE PAYMENT BOND', 'ADVANCE PAYMENT BOND', 'ADVANCE PAYMENT BOND'];
  public modalTitle: string = '';

  public breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'GIS Setups',
      url: '/home/gis/setup/schedule/wordings',
    },
    {
      label: 'Schedule Wordings',
      url: '/home/gis/setup/schedule/wordings'
    }
  ];

  filterWordings($event: KeyboardEvent) {

  }

  callActionsModal(action: string) {
    log.info(`called action >>>`, action);
    this.modalTitle = action === 'add' ? 'add' : action === 'edit' ? 'edit' : '';
  }
}
