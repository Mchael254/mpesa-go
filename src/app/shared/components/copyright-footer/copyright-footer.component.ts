import { Component } from '@angular/core';
import {UtilService} from "../../services";

@Component({
  selector: 'app-copyright-footer',
  templateUrl: './copyright-footer.component.html',
  styleUrls: ['./copyright-footer.component.css'],
  standalone : false
})
export class CopyrightFooterComponent {

  constructor(
    public utilService: UtilService,
  ){

  }
}
