import { Component, OnInit } from '@angular/core';

/* The BaseCrmComponent class is a component in a CRM application that manages menu items and their
sub-items. */
@Component({
  selector: 'app-base-crm',
  templateUrl: './base-crm.component.html',
  styleUrls: ['./base-crm.component.css']
})
export class BaseCrmComponent implements OnInit {

/* The `items` property is an array of objects. Each object represents a menu item in a CRM (Customer
Relationship Management) application. Each object has the following properties: */
  items: Array<{ label: string; link?: string; showSubItems: boolean; subItems?: Array<{ label: string; link?: string }> }> = [
    {
      label: 'Organogram',
      showSubItems: false,
      subItems: [
        { label: 'Organizations', link: '/home/crm/organization',  },
        { label: 'Countries & Holidays', link: '/home/crm/country',  },
        { label: 'Hierarchy', link: '',  }
      ]
    },
    {
      label: 'Org Parameters',
      link: '',
      showSubItems: false,
      subItems: [
        { label: 'Org Parameters', link: '/home/crm/user-parameters',  },
        { label: 'Currencies', link: '/home/crm/currencies',  },
        { label: 'Payment Modes', link: '/home/crm/payment-modes',  },
      ]
    },
    { label: 'Account Management', link: '', showSubItems: false, subItems: [] },
    { label: 'Bank Setups', link: '', showSubItems: false, subItems: [
        { label: 'Banks', link: '/home/crm/bank',  }
      ] },
    { label: 'Administration', link: '',  showSubItems: false, subItems: [] },
    { label: 'Messaging', link: '', showSubItems: false, subItems: [
        { label: 'Message Template', link: '/home/crm/messaging-template',  }
      ] },
    { label: 'System Reports', link: '',  showSubItems: false, subItems: [] }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * The function toggles the visibility of sub-items for a given item.
   * @param {any} item - The parameter "item" is of type "any", which means it can be any data type.
   */
  toggleItem(item: any) {
    item.showSubItems = !item.showSubItems;
  }

}
