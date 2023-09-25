import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/* The ReportsComponent class is a TypeScript component that handles the functionality of a reports
page, including navigation, tab selection, and viewing reports. */

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit  {

  activeTab: string = 'myReports';

   myReportsList: { id: string, name: string }[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ];

  anotherTabList: { id: string, name: string }[] = [
    { id: 'A', name: 'Item A' },
    { id: 'B', name: 'Item B' },
    { id: 'C', name: 'Item C' }
  ];

  constructor(
    private router: Router,
  ) { }
  
  ngOnInit(): void {
  }


  /**
   * The function "createReports" navigates to the "create-report" page in the "/home/reportsv2" route.
   */
  createReports() {
    this.router.navigate(['/home/reportsv2/create-report'])
  }

  myReports() {
    this.activeTab = 'myReports';
  }

  sharedReports() {
    this.activeTab = 'sharedReports';
  }

  viewReports() {}

}
