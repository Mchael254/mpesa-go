import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import fmsStepsData from '../../data/fms-step.json';
@Component({
  selector: 'app-process-batch',
  templateUrl: './process-batch.component.html',
  styleUrls: ['./process-batch.component.css'],
})
export class ProcessBatchComponent {
  steps=fmsStepsData.bankingSteps;
  //selectedBatch!:batch;
    batches: any[] = [];
  constructor(public translate:TranslateService,private router:Router) {}
  ngOnInit() {}
  navigateToDashboard():void{
    this.router.navigate(['/home/fms/banking-dashboard']);
  }
   get currentReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }
}
