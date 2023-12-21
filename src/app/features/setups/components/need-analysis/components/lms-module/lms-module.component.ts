import { Component } from '@angular/core';

@Component({
  selector: 'app-lms-module',
  templateUrl: './lms-module.component.html',
  styleUrls: ['./lms-module.component.css']
})
export class LmsModuleComponent {

  accordionItems = [
    { id: '1', title: 'Quotation', contents: [{name:'New Business', url: '/home/setups/need-analysis/new-bussiness'}] },
    { id: '2', title: 'Proposal', contents: [{name:'New Business', url: '/home/setups/need-analysis/new-bussiness'}]  },
    { id: '3', title: 'Underwriting', contents: [{name:'New Business', url: '/home/setups/need-analysis/new-bussiness'}]  },
  ];


  // accordionItems = [
  //   { id: 'item1', title: 'First', content: 'Content for Underwriting item' },
  //   // Add more items as needed
  // ];

  // Define your dynamic content using ng-template
  firstItemContent(): any {
    return `<ng-template>Content for the first item</ng-template>`;
  }

}
