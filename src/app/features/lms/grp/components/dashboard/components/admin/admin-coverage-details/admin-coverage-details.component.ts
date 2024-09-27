import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-admin-coverage-details',
  templateUrl: './admin-coverage-details.component.html',
  styleUrls: ['./admin-coverage-details.component.css']
})
export class AdminCoverageDetailsComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  uploadProgress: number = 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.coverTableColumns();
  }

  ngOnDestroy(): void {

  }

  coverTableColumns() {
    this.columnOptions = [
      { label: 'Name', value: 'contact_person_name' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'ID number', value: 'identification_number' },
      { label: 'Position', value: 'position' },
      { label: 'Physical address', value: 'contact_person_physical_address' },
      { label: 'Contact', value: 'phone_number' },
      { label: 'Email', value: 'contact_person_email' },
      { label: 'With effect from', value: 'wef' },
      { label: 'With effect to', value: 'wet' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  dummyData = [
    { a: 'Text', b: 'Text', c: 'Text', d: 'Text', e: 'Text', f: 'Text' },
    { a: 'Text', b: 'Text', c: 'Text', d: 'Text', e: 'Text', f: 'Text' },
    { a: 'Text', b: 'Text', c: 'Text', d: 'Text', e: 'Text', f: 'Text' },
  ]

  showAdminDetailsModal() { }

  handleFileChange(event) { }

  downloadMemberUploadTemplate() { }

  onBack() {
    this.router.navigate(['/home/lms/grp/dashboard/normal-quote']);
  }

  onProceed() {
    this.router.navigate(['/home/lms/grp/dashboard/quote-summary']);
  }

}
