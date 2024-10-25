import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {FormBuilder} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('RequestTrackingComponent');
@Component({
  selector: 'app-request-tracking',
  templateUrl: './request-tracking.component.html',
  styleUrls: ['./request-tracking.component.css']
})
export class RequestTrackingComponent implements OnInit {
  pageSize: 5;
  requestTrackingData: any;

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
  }

}
