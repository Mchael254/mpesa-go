import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json'
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-medical-uploads-decisions',
  templateUrl: './medical-uploads-decisions.component.html',
  styleUrls: ['./medical-uploads-decisions.component.css']
})
export class MedicalUploadsDecisionsComponent implements OnInit, OnDestroy {
  steps = stepData;
  breadCrumbItems: BreadCrumbItem[] = [];
  policySelected: string = 'POL/12345'

  constructor() {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Policy', url: '/home/lms/grp/medicals/policy-listing' },
      { label: this.policySelected, url: '/home/lms/grp/medicals/uploads' },
    ];
  }

}
