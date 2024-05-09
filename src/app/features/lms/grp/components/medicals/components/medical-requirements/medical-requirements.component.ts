import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json'
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-medical-requirements',
  templateUrl: './medical-requirements.component.html',
  styleUrls: ['./medical-requirements.component.css']
})
export class MedicalRequirementsComponent implements OnInit, OnDestroy {
  steps = stepData;
  breadCrumbItems: BreadCrumbItem[] = [];
  policySelected: string = 'PL/56656'
  columnOptions: SelectItem[];
  medReqColumnOptions: SelectItem[];
  selectedColumns: string[];

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.membersAbvFCLColumns();
    this.medicalReqColumns();
    
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Policy', url: '/home/lms/grp/medicals/policy-listing' },
      { label: this.policySelected, url: '/home/lms/grp/medicals/requirements' },
    ];
  }

  data = [
    { polNum: 'ABC123', prod: 'Life Insurance', status: 'Active', date: '2022-03-15', premium: 1500, sumAssured: 100000 },
    { polNum: 'DEF456', prod: 'Health Insurance', status: 'Expired', date: '2021-12-10', premium: 2000, sumAssured: 50000 },
    { polNum: 'GHI789', prod: 'Car Insurance', status: 'Cancelled', date: '2023-05-20', premium: 1200, sumAssured: 30000 },
    { polNum: 'JKL012', prod: 'Home Insurance', status: 'Active', date: '2022-08-05', premium: 1800, sumAssured: 200000 },
    { polNum: 'MNO345', prod: 'Travel Insurance', status: 'Active', date: '2024-01-30', premium: 1000, sumAssured: 75000 }
  ];

  membersAbvFCLColumns() {
    this.columnOptions = [
      { label: 'Surname', value: 'polNum' },
      { label: 'Other name', value: 'prod' },
      { label: 'Payroll/member number', value: 'status' },
      { label: 'Age', value: 'date' },
      { label: 'Sum assured', value: 'premium' },
      { label: 'FCL limit', value: 'sumAssured' },
      { label: 'Medical group', value: 'sumAssured' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  medicalReqColumns() {
    this.medReqColumnOptions = [
      { label: 'Test description', value: 'polNum' },
      { label: 'Limit amount', value: 'prod' },
      { label: 'Request date', value: 'status' },
      { label: 'Due date', value: 'date' },
    ];

    this.selectedColumns = this.medReqColumnOptions.map(option => option.value);
  }

}
