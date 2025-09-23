import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-process-batch',
  templateUrl: './process-batch.component.html',
  styleUrls: ['./process-batch.component.css'],
})
export class ProcessBatchComponent {
  selectedBatch!:batch;
    batches: batch[] = [
      {
        batchNo: 'BL11',
        amount: 3000,
        assignee: 'frank',
        date: new Date('2000-02-20'),
      },
      {
        batchNo: 'BL34',
        amount: 3400,
        assignee: 'frank',
        date: new Date('2000-02-20'),
      },
      {
        batchNo: 'BL34',
        amount: 1000,
        assignee: 'frank',
        date: new Date('2000-02-20'),
      },
      {
        batchNo: 'BL221',
      amount: 8889,
        assignee: 'frank',
        date: new Date('2000-02-20'),
      },
    ];
  constructor(public translate:TranslateService,private router:Router) {}
  ngOnInit() {}
  navigateToDashboard():void{
    this.router.navigate(['/home/fms/banking-dashboard']);
  }
}
export interface batch {
  batchNo: string;
 amount: number;
  date: Date;
  assignee: string;
  
}
