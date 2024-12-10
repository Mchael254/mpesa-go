import { Component } from '@angular/core';

@Component({
  selector: 'app-base-fms',
  templateUrl: './base-fms.component.html',
  styleUrls: ['./base-fms.component.css']
})
export class BaseFmsComponent {
/* The `items` property is an array of objects. Each object represents a menu item in a CRM (Customer
Relationship Management) application. Each object has the following properties: */
GLledger: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Gl-Parameters',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },

    ],
  },
  {
    label: 'Gl-Transactions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
    ],
  },
  {
    label: 'Gl-Inquiries',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
  {
    label: 'Gl-Final Reports',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
 
];

creditors: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Parameters',
    showSubItems: false,
    subItems: [
      
      { label: '', link: '' },
    ],
  },
  {
    label: 'Transactions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
   
    ],
  },
  {
    label: 'Invoices/Dr Notes',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
    ],
  },
  {
    label: 'Inquires',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
];

cashbook: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Parameters',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Transactions' ,
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Requistions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Cheques' ,
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Petty cash' ,
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Receipts',
    showSubItems: false,
    subItems: [
      { label: 'Receipting Points', link: '/home/fms/' },
      
      { label: 'Narrations', link: '/home/fms/' },
      { label: 'Manage Receipts', link: '/home/fms/' },
      { label: 'Receipting', link: '/home/fms/receipt' },
      { label: 'Receipting Exceptions', link: '/home/fms/' },
      { label: 'Receipt Authorization', link: '/home/fms/' },
      { label: 'Receipt Upload', link: '/home/fms/' },
      { label: 'Premium Suspense', link: '/home/fms/' },
     
      { label: 'Direct Debits', link: '/home/fms/' },
     
    

    ],
  },
  {
    label: 'Reconciliation',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Inquires',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  }
];
debtors: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Parameters',
    showSubItems: false,
    subItems: [
      
      { label: '', link: '' },
    ],
  },
  {
    label: 'Transactions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
   
    ],
  },
  {
    label: 'Invoices/cr Notes',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
    ],
  },
  {
    label: 'Inquires',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
];
constructor() {}

ngOnInit(): void {}

/**
 * The function toggles the visibility of sub-items for a given item.
 * @param {any} item - The parameter "item" is of type "any", which means it can be any data type.
 */
toggleItem(item: any) {
  item.showSubItems = !item.showSubItems;
}
}
