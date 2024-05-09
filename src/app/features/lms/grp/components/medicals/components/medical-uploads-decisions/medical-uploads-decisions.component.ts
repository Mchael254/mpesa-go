import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json'
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-medical-uploads-decisions',
  templateUrl: './medical-uploads-decisions.component.html',
  styleUrls: ['./medical-uploads-decisions.component.css']
})
export class MedicalUploadsDecisionsComponent implements OnInit, OnDestroy {
  steps = stepData;
  breadCrumbItems: BreadCrumbItem[] = [];
  policySelected: string = 'POL/12345';
  columnOptions: SelectItem[];
  medResultsColumnOptions: SelectItem[];
  coverTypesColumnOptions: SelectItem[];
  selectedColumns: string[];
  uploadProgress: number = 0;
  decisionsForm: FormGroup;

  constructor( private fb : FormBuilder) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.memsAboveFCLColumns();
    this.medResultsColumns();
    this.coverTypesColumns();
    this.getDecsisonsForm();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Policy', url: '/home/lms/grp/medicals/policy-listing' },
      { label: this.policySelected, url: '/home/lms/grp/medicals/uploads' },
    ];
  }

  dataa = [];

  data = [
    { polNum: 'ABC123', prod: 'Life Insurance', status: 'Active', date: '2022-03-15', premium: 1500, sumAssured: 100000 },
    { polNum: 'DEF456', prod: 'Health Insurance', status: 'Expired', date: '2021-12-10', premium: 2000, sumAssured: 50000 },
    { polNum: 'GHI789', prod: 'Car Insurance', status: 'Cancelled', date: '2023-05-20', premium: 1200, sumAssured: 30000 },
    { polNum: 'JKL012', prod: 'Home Insurance', status: 'Active', date: '2022-08-05', premium: 1800, sumAssured: 200000 },
    { polNum: 'MNO345', prod: 'Travel Insurance', status: 'Active', date: '2024-01-30', premium: 1000, sumAssured: 75000 }
  ];

  memsAboveFCLColumns() {
    this.columnOptions = [
      { label: 'Member number', value: 'polNum' },
      { label: 'Name', value: 'prod' },
      { label: 'Request date', value: 'status' },
      { label: 'Test description', value: 'date' },
      { label: 'Limit amount', value: 'premium' },
      { label: 'Date received', value: 'sumAssured' },
      { label: 'Invoice number', value: 'sumAssured' },
      { label: 'Invoice date', value: 'sumAssured' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  medResultsColumns() {
    this.medResultsColumnOptions = [
      { label: 'Test description', value: 'polNum' },
      { label: 'Limit amount', value: 'prod' },
      { label: 'Test status', value: 'status' },
      { label: 'Date received', value: 'date' },
      { label: 'Invoice number', value: 'premium' },
      { label: 'Invoice amount', value: 'sumAssured' },
      { label: 'Payable amount', value: 'sumAssured' },
      { label: 'Remarks', value: 'polNum' },
    ];

    this.selectedColumns = this.medResultsColumnOptions.map(option => option.value);
  }

  coverTypesColumns() {
    this.coverTypesColumnOptions = [
      { label: 'Cover type', value: 'polNum' },
      { label: 'Original sum assured', value: 'prod' },
      { label: 'Medical sum assured', value: 'status' },
      { label: 'Original premium', value: 'date' },
      { label: 'Medical premium', value: 'premium' },
      { label: 'Add ref premium', value: 'sumAssured' },
      { label: 'Load premium', value: 'sumAssured' },
    ];

    this.selectedColumns = this.coverTypesColumnOptions.map(option => option.value);
  }

  getDecsisonsForm() {
    this.decisionsForm = this.fb.group({
      decisionType: [""],
      decision: [""],
      loadType: [""],
      remarks: [""],
    });
  }
  showDecisionsModal() {
    const modal = document.getElementById('decisionsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDecisisonsModal() {
    const modal = document.getElementById('decisionsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

}
