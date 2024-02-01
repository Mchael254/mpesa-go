import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-reinsurance-selection',
  templateUrl: './reinsurance-selection.component.html',
  styleUrls: ['./reinsurance-selection.component.css']
})
export class ReinsuranceSelectionComponent implements OnInit, OnDestroy{
  label= "label";
  columnOptions: SelectItem[];
  selectedColumns: string[];

  constructor (
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  proceed() {
    this.router.navigate(['/home/lms/grp/reinsurance/summary'])
  }

}
