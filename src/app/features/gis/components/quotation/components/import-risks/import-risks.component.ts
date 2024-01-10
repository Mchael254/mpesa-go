import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { SubclassesDTO } from '../../../setups/data/gisDTO';
import { Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
const log = new Logger('ImportRiskComponent');
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  steps = quoteStepsData;
  subclassList:any
  quotationNum:any
  quotationDetails:any

  constructor(
    public subclassService:SubclassesService,
    public router:Router
  ){}

  ngOnInit(): void {
    this.getSubclass()
    this.quotationNum = sessionStorage.getItem('quotationNum');
    this.quotationDetails = sessionStorage.getItem('quotationFormDetails')
    log.debug(this.quotationDetails.productCode)
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
