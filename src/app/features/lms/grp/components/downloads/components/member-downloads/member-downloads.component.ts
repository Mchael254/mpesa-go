import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

const log = new Logger("MemberDownloadsComponent");
@AutoUnsubscribe
@Component({
  selector: 'app-member-downloads',
  templateUrl: './member-downloads.component.html',
  styleUrls: ['./member-downloads.component.css']
})
export class MemberDownloadsComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/dashboard-screen' },
      { label: 'Downloads', url: '/home/lms/grp/downloads/member-downloads' },
    ];
  }

}
