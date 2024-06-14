import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { DashboardService } from '../../services/dashboard.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';
import { ClaimsListingDTO } from '../../models/admin-policies';

const log = new Logger("AdminClaimsListingComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-admin-claims-listing',
  templateUrl: './admin-claims-listing.component.html',
  styleUrls: ['./admin-claims-listing.component.css']
})
export class AdminClaimsListingComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  breadCrumbItems: BreadCrumbItem[] = [];
  clientCode: number = 2422853;
  claimListing: ClaimsListingDTO[];

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.policyListingColumns();
    this.getClaimsListing();

  }

  ngOnDestroy(): void {

  }

  
  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Claims', url: '/home/lms/grp/dashboard/admin-claims-listing' },
    ];
  }


  policyListingColumns() {
    this.columnOptions = [
      { label: 'Product', value: 'product' },
      { label: 'Claim number', value: 'claim_number' },
      { label: 'Member', value: 'member' },
      { label: 'Member number', value: 'mem_no' },
      { label: 'Claim amount', value: 'claim_amnt' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  getClaimsListing() {
    this.dashboardService.getClaimsListing(this.clientCode).subscribe((res: ClaimsListingDTO[]) => {
      this.claimListing = res;
      log.info("getClaimsListing", this.claimListing)
    });
  }

}

