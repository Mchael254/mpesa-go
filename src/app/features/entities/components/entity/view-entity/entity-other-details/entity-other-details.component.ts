import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';

const log = new Logger('EntityOtherDetails');

@Component({
  selector: 'app-entity-other-details',
  templateUrl: './entity-other-details.component.html',
  styleUrls: ['./entity-other-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityOtherDetailsComponent implements OnInit{

  @Input() partyAccountDetails: any;

  constructor() {
  }
  ngOnInit(): void {
  }

}
