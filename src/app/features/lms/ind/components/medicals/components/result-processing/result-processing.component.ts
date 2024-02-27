import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { MedicalsService } from 'src/app/features/lms/service/medicals/medicals.service';

@Component({
  selector: 'app-result-processing',
  templateUrl: './result-processing.component.html',
  styleUrls: ['./result-processing.component.css'],
})
export class ResultProcessingComponent implements OnInit {
  steps = stepData;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list',
    },
    {
      label: 'Medical Tests',
      url: '/home/lms/ind/quotation/lifestyle-details',
    },
  ];
  dynamicAccordionId: any;
  diseases: any[] = [];

  constructor(private router:Router, private medical_service: MedicalsService){}

  ngOnInit(): void {
    this.getClientMedicalTest();
  }

  getClientMedicalTest(){
    this.medical_service.getListOfClientMedicalTests().subscribe((data:any[]) =>{
      this.diseases = data[0]?.medical_tests
      console.log(data);
      
    })
  }

  nextPage(){
    this.router.navigate(['/home/lms/ind/policy/underwriting'])
    
  }
}
