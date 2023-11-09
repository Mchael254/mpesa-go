import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { SubclassesDTO } from '../../../setups/data/gisDTO';
import { Router } from '@angular/router';
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  steps = quoteStepsData;
  subclassList:any

  constructor(
    public subclassService:SubclassesService,
    public router:Router
  ){}

  ngOnInit(): void {
    this.getSubclass()
  }

  getSubclass(){
    this.subclassService.getAllSubclasses().subscribe(data=>{
      this.subclassList = data
    })
  }

  finish(){
    this.router.navigate(['/home/gis/quotation/risk-section-details'])
  }
}
