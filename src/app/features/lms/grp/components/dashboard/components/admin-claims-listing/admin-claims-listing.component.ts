import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-admin-claims-listing',
  templateUrl: './admin-claims-listing.component.html',
  styleUrls: ['./admin-claims-listing.component.css']
})
export class AdminClaimsListingComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.policyListingColumns();

  }

  ngOnDestroy(): void {

  }

  claimListing = [
    {
      product: "Health Insurance",
      claim_number: "CLM123456",
      member: "John Doe",
      mem_no: "M12345",
      claim_amnt: 1200.50
    },
    {
      product: "Life Insurance",
      claim_number: "CLM123457",
      member: "Jane Smith",
      mem_no: "M12346",
      claim_amnt: 2500.75
    },
    {
      product: "Auto Insurance",
      claim_number: "CLM123458",
      member: "James Brown",
      mem_no: "M12347",
      claim_amnt: 980.00
    },
    {
      product: "Home Insurance",
      claim_number: "CLM123459",
      member: "Emily Davis",
      mem_no: "M12348",
      claim_amnt: 4300.60
    },
    {
      product: "Travel Insurance",
      claim_number: "CLM123460",
      member: "Michael Johnson",
      mem_no: "M12349",
      claim_amnt: 600.20
    }
  ];

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

}

