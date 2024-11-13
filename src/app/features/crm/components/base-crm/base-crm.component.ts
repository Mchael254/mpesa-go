import { Component, OnInit } from '@angular/core';

/* The BaseCrmComponent class is a component in a CRM application that manages menu items and their
sub-items. */
@Component({
  selector: 'app-base-crm',
  templateUrl: './base-crm.component.html',
  styleUrls: ['./base-crm.component.css'],
})
export class BaseCrmComponent implements OnInit {
  /* The `items` property is an array of objects. Each object represents a menu item in a CRM (Customer
Relationship Management) application. Each object has the following properties: */
  items: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'Organogram',
      showSubItems: false,
      subItems: [
        { label: 'Organizations', link: '/home/crm/organization' },
        { label: 'Countries & Holidays', link: '/home/crm/country' },
        { label: 'Hierarchy', link: '/home/crm/hierarchy' },
      ],
    },
    {
      label: 'Org Parameters',
      link: '',
      showSubItems: false,
      subItems: [
        { label: 'Org Parameters', link: '/home/crm/user-parameters' },
        { label: 'Currencies', link: '/home/crm/currencies' },
        { label: 'Payment Modes', link: '/home/crm/payment-modes' },
      ],
    },
    {
      label: 'Account Management',
      link: '',
      showSubItems: false,
      subItems: [],
    },
    {
      label: 'Bank Setups',
      link: '',
      showSubItems: false,
      subItems: [{ label: 'Banks', link: '/home/crm/bank' }],
    },
    {
      label: 'Administration',
      link: '',
      showSubItems: false,
      subItems: [{ label: 'System Roles', link: '/home/crm/system-roles' }],
    },
    {
      label: 'Messaging',
      link: '',
      showSubItems: false,
      subItems: [
        { label: 'Message Template', link: '/home/crm/messaging-template' },
        { label: 'Messages History', link: '/home/crm/messages' },
        { label: 'Scheduler', link: '/home/crm/scheduler' },
      ],
    },
    {
      label: 'System Reports',
      link: '',
      showSubItems: false,
      subItems: [],
    },
  ];

  campaignMngtItems: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'Campaign Management',
      showSubItems: false,
      subItems: [
        { label: 'Campaigns', link: '/home/crm/campaigns' },
        { label: 'Client Attributes', link: '/home/crm/client-attributes' },
        { label: 'Product Attributes', link: '/home/crm/product-attributes' },
      ],
    },
    {
      label: 'Leads and Potentials',
      link: '',
      showSubItems: false,
      subItems: [
        {
          label: 'Leads',
          link: '/home/crm',
        },
        {
          label: 'Lead Sources & Statuses',
          link: '/home/crm/lead-sources-statuses',
        },
      ],
    },
    {
      label: 'Activity Management',
      link: '',
      showSubItems: false,
      subItems: [
        { label: 'Activities', link: '/home/crm/activities' },
        { label: 'Activity Types', link: '/home/crm/activity-types' },
        {
          label: 'Priority Level & Activity Status',
          link: '/home/crm/priority-level-activity-status',
        },
      ],
    },
  ];

  serviceDeskItems: Array<{
    label: string;
    link?: string;
    showSubItems: boolean;
    subItems?: Array<{ label: string; link?: string }>;
  }> = [
    {
      label: 'Service Desk Request',
      showSubItems: false,
      subItems: [
        { label: 'Service Desk', link: '/home/crm/service-desk' },
        { label: 'Request Tracking', link: '/home/crm/request-tracking' },
        { label: 'Request Report', link: '/home/crm/' },
        { label: 'Request Categories', link: '/home/crm/request-categories' },
        { label: 'Request Status', link: '/home/crm/request-status' },
      ],
    }
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
