import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-admin-policy-details',
  templateUrl: './admin-policy-details.component.html',
  styleUrls: ['./admin-policy-details.component.css']
})
export class AdminPolicyDetailsComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedPolicyNumber: string = 'PL/009/IUIU';
  columnOptionsMemberDets: SelectItem[];
  selectedColumnsMemberDets: string[];
  selectedRowIndex: number;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.memberDetailsColumns();
    
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Policies', url: '/home/lms/grp/dashboard/admin-policy-listing' },
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/admin-policy-details' },
    ];
  }

  memberDetailsColumns() {
    this.columnOptionsMemberDets = [
      { label: 'Surname', value: 'surname' },
      { label: 'Other names', value: 'other_names' },
      { label: 'Sum Assured', value: 'total_sum_assured' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'Gender', value: 'gender' },
      { label: 'Payroll/Member no.', value: 'member_number' },
      { label: 'Category', value: 'description' },
      { label: 'Dependant type', value: 'dty_description' },
  ];

  this.selectedColumnsMemberDets = this.columnOptionsMemberDets.map(option => option.value);
  }


  memberPolicies = [
    { status: 'Member details', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life',
    multipleOfEarning: 1, shortDesc: 'Afya bora group'
     },
    { status: 'Cover types', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life', 
    multipleOfEarning: 3, shortDesc: 'Nairobi trade group'
     },
    { status: 'Category summary', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life',
    multipleOfEarning: 3, shortDesc: 'Nairobi trade group'
     },
  ];

  membersDetails = [
    {
        surname: 'Smith',
        other_names: 'John Michael',
        premium: 100000,
        total_sum_assured: 100000,
        date_of_birth: '1985-05-15',
        gender: 'Male',
        member_number: 'M001',
        description: 'Senior Manager',
        dty_description: 'Duty Manager'
    },
    {
        surname: 'Doe',
        other_names: 'Jane Ann',
        premium: 160000,
        total_sum_assured: 150000,
        date_of_birth: '1990-07-22',
        gender: 'Female',
        member_number: 'M002',
        description: 'Software Engineer',
        dty_description: 'Project Lead'
    },
    {
        surname: 'Brown',
        other_names: 'Charlie James',
        premium: 140000,
        total_sum_assured: 120000,
        date_of_birth: '1978-12-01',
        gender: 'Male',
        member_number: 'M003',
        description: 'Product Manager',
        dty_description: 'Team Lead'
    }
];


memberCoverTypeSummaryDto = [
  {
      cvt_desc: 'Basic Coverage',
      premium: 2000.50,
      sum_assured: 100000
  },
  {
      cvt_desc: 'Extended Coverage',
      premium: 3500.75,
      sum_assured: 200000
  },
  {
      cvt_desc: 'Premium Coverage',
      premium: 5000.99,
      sum_assured: 300000
  }
];


  showMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  //Enables modal to close on click of anywhere outside the modal
  onBackdropClick(event: MouseEvent) {
    // Check if the clicked element is the backdrop of the modal
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeMembersSummary();
      this.closeCategorySummary();
    }
  }

  onMemberTableRowClick(membersDetails, index: number) {
    this.selectedRowIndex = index;
    if(membersDetails){
      // this.memberCode = membersDetails.member_code;
      // console.log("this.memberCode", this.memberCode)
      // this.summaryService.memberCoverSummary(this.quotationCode, this.memberCode).subscribe((memCvtTypes: MemberCoverTypeSummaryDto[]) => {
      //   console.log("memCvtTypes", memCvtTypes)
      //   this.memberCoverTypeSummaryDto = memCvtTypes;
  
      // });
    }
  }

}
