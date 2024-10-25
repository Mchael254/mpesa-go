import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SidebarMenu } from '../model/sidebar.menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private sidebarMenuList = {
    DEFAULT: [
      {
        name: 'Summary',
        nameSlug: 'summary',
        icon: 'fa-regular fa-newspaper',
        menuItems: [
          { name: 'My Tasks', link: '/my-tasks' },
          { name: 'My Dashboard', link: '/my-dashboard' },
          { name: 'My Transactions', link: '/my-transactions' },
          { name: 'My Policies', link: '/my-policies' },
          { name: 'My Quotations', link: '/my-quotations' },
          { name: 'My Renewals', link: '/my-renewals' },
        ],
        collapsed: true,
      },
    ],
    ACC_SETUP: [
      {
        name: 'Account',
        nameSlug: 'accountSetup',
        icon: 'fa-solid fa-gears',
        menuItems: [
          { name: 'Entities', link: '/home/entity/list' },
          { name: 'Staff', link: '/home/entity/staff/list' },
          { name: 'Clients', link: '/home/entity/client/list' },
          { name: 'Agents', link: '/home/entity/intermediary/list' },
          { name: 'Leads', link: '/home/entity/lead/list' },
          {
            name: 'Service Providers',
            link: '/home/entity/service-provider/list',
          },
        ],
        collapsed: true,
      },
    ],

    QUOTATION: [
      {
        name: 'Actions',
        nameSlug: 'actions',
        icon: 'fa-solid fa-gears',
        menuItems: [
          {
            name: 'New Quote',
            link: '',
            isModal: true,
            target: '#NewQuoteModal',
          },
          { name: 'Need Analysis', link: '/home/lms/need-analysis' },
        ],

        collapsed: true,
      },
      {
        name: 'Quotation',
        nameSlug: 'quotation',
        icon: 'fa-solid fa-quote-right',
        menuItems: [
          { name: 'Quotation List', link: '/home/lms/quotation/list' },
        ],
        collapsed: true,
      },
    ],
    STAFF_PERF: [
      {
        name: 'My Employees',
        nameSlug: 'employees',
        link: './home/entity/staff/list',
        icon: 'fa-solid fa-user-tie',
        svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
      },
      {
        name: 'Summary',
        nameSlug: 'summary',
        icon: 'fa-regular fa-newspaper',
        link: '/home/dashboard',
        svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
      },
      {
        name: 'My Activities',
        nameSlug: 'activities',
        icon: 'fa-solid fa-book',
        svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
      },
      // {
      //   name: 'My Policies',
      //   nameSlug: 'policies',
      //   icon: 'fa-solid fa-gavel',
      //   svgContent: `
      //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
      //       <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      //     </svg>
      //   `,
      // },{
      //   name: 'My Quotations',
      //   nameSlug: 'quotations',
      //   icon: 'fa-solid fa-clipboard-question',
      //   svgContent: `
      //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
      //       <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      //     </svg>
      //   `,
      // },
      {
        name: 'My Renewals',
        nameSlug: 'renewals',
        icon: 'fa-solid fa-recycle',
      },
      {
        name: 'Business Account',
        nameSlug: 'businessAccount',
        icon: 'fa-solid fa-suitcase',
      },
    ],
    CRM_SETUP: [
      {
        name: 'Organization Setups',
        nameSlug: 'org',
        icon: 'fa-solid fa-keyboard',
        menuItems: [
          {
            name: 'Organogram',
            nameSlug: 'gram',
            subList: [
              {
                name: 'Organization',
                link: '/home/crm/organization',
              },
              {
                name: 'Countries',
                link: '/home/crm/country',
              },
            ],
            collapsed: true,
          },
          {
            name: 'Org Parameters',
            nameSlug: 'par',
            subList: [
              {
                name: 'User Parameters',
                link: '/home/crm/user-parameters',
              },
              {
                name: 'Currencies & Currency Rates',
                link: '/home/crm/currencies',
              },
              {
                name: 'Required Documents',
                link: '/home/crm/required-documents',
              },
              {
                name: 'Payment Modes',
                link: '/home/crm/payment-modes',
              },
            ],
            collapsed: true,
          },
          {
            name: 'Account Management',
            nameSlug: 'accman',
            subList: [
              {
                name: 'Channels',
                link: '/home/crm/channel',
              },
              {
                name: 'Client Type',
                link: '/home/crm/client-type',
              },
              {
                name: 'Sectors & Occupation',
                link: '/home/crm/sectors-occupations',
              },
              {
                name: 'Service Provider Type',
                link: '/home/crm/service-provider-types',
              },
            ],
            collapsed: true,
          },
          {
            name: 'Bank Setups',
            nameSlug: 'banks',
            subList: [
              {
                name: 'Banks',
                link: '/home/crm/bank',
              },
            ],
            collapsed: true,
          },
          {
            name: 'Administration',
            nameSlug: 'admn',
            subList: [
              {
                name: 'System Roles',
                link: '/home/crm/system-roles',
              },
            ],
          },
          {
            name: 'Messaging',
            nameSlug: 'mess',
            subList: [
              {
                name: 'Scheduler',
                link: '/home/crm/scheduler',
              },
              {
                name: 'Message Template',
                link: '/home/crm/messaging-template',
              },
              {
                name: 'Messages History',
                link: '/home/crm/messages',
              },
            ],
            collapsed: true,
          },
          {
            name: 'System Reports',
            nameSlug: 'sysrpt',
            subList: [
              {
                name: 'Reports',
                link: '',
              },
            ],
            collapsed: true,
          },
        ],
        collapsed: true,
      },
      {
        name: 'Service Desk',
        nameSlug: 'desk',
        icon: 'fa-solid fa-gears',
        menuItems: [
          {
            name: 'Service Desk',
            nameSlug: 'servDesk',
            subList: [
              {
                name: 'Service Desk',
                link: '/home/crm/service-desk',
              },
              {
                name: 'Request Tracking',
                link: '/home/crm/request-tracking',
              },
              {
                name: 'Request Report',
                link: '/home/crm/',
              },
              {
                name: 'Request Categories',
                link: '/home/crm/request-categories',
              },
              {
                name: 'Request Status',
                link: '/home/crm/request-status',
              },
            ],
            collapsed: true,
          },
        ],
        collapsed: true,
      },
      {
        name: 'Campaign Management',
        nameSlug: 'campaign',
        icon: 'fa-solid fa-align-center',
        menuItems: [
          {
            name: 'Campaign Management',
            nameSlug: 'camp',
            subList: [
              {
                name: 'Campaigns',
                link: '/home/crm/campaigns',
              },
              {
                name: 'Client Attributes',
                link: '/home/crm/client-attributes',
              },
              {
                name: 'Product Attributes',
                link: '/home/crm/product-attributes',
              },
            ],
            collapsed: true,
          },
          {
            name: 'Leads and Potentials',
            nameSlug: 'leadmgt',
            subList: [
              {
                name: 'Leads',
                link: '/home/crm/organization',
              },
              {
                name: 'Lead Sources & Statuses',
                link: '/home/crm/lead-sources-statuses',
              },
            ],
            collapsed: true,
          },
          {
            name: 'Activity Management',
            nameSlug: 'activityMgnt',
            subList: [
              {
                name: 'Activities',
                link: '/home/crm/activities',
              },
              {
                name: 'Activity Types',
                link: '/home/crm/activity-types',
              },
              {
                name: 'Priority level & Activity status',
                link: '/home/crm/priority-level-activity-status',
              },
              {
                name: 'Prospects',
                link: '/home/crm',
              },
            ],
            collapsed: true,
          },
        ],
        collapsed: true,
      },
      {
        name: 'Portal Setups',
        nameSlug: 'portal',
        icon: 'fa-solid fa-magnifying-glass-chart',
        menuItems: [],
        collapsed: true,
      },
    ],
    GIS_SETUP: [
      {
        name: 'Actions',
        nameSlug: 'actions',
        icon: 'fa-solid fa-gears',
        menuItems: [],

        collapsed: true,
      },
      {
        name: 'General Parameters',
        nameSlug: 'generalSetup',
        icon: 'fa-solid fa-align-center',
        menuItems: [
          {
            name: 'System Parameters',
            link: '/home/gis/setup/general-parameter/system-parameters',
          },
          {
            name: 'System Sequences',
            link: '/home/gis/setup/general-parameter/system-sequences',
          },
        ],
        collapsed: true,
      },
      {
        name: 'Class',
        nameSlug: 'favoriteSetups',
        icon: 'fa-solid fa-magnifying-glass-chart',
        link: '/home/gis/setup/class-subclass/setup-wizard',
        collapsed: true,
      },
      {
        name: 'Products',
        nameSlug: 'pendingSetups',
        icon: 'fa-solid fa-peseta-sign',
        link: '/home/gis/setup/product/product-wizard',
        collapsed: true,
      },
      {
        name: 'Cover Types & Sections',
        nameSlug: 'CoverTypesSections',
        icon: 'fa-solid fa-sliders',
        menuItems: [
          {
            name: 'Covers',
            link: '/home/gis/setup/covertype-setup/covertypes',
          },
          {
            name: 'Sections',
            link: '/home/gis/setup/covertype-setup/sections',
          },
          {
            name: 'subclasses-sections-and-covertypes',
            link: '/home/gis/setup/covertype-setup/subclasses-sections-and-covertypes',
          },
        ],
        collapsed: true,
      },

      {
        name: 'Taxes',
        nameSlug: 'Taxes',
        icon: 'fa-solid fa-group-arrows-rotate',
        menuItems: [
          {
            name: 'Taxes Rates (NB on Subclass)',
            link: './home/gis/setup/tax/tax-rate',
          },
        ],
        collapsed: true,
      },

      {
        name: 'Client & Insured',
        nameSlug: 'ClientInsured',
        icon: 'fa-solid fa-sliders',
        menuItems: [
          {
            name: 'Interested Parties',
            link: './home/gis/setup/client-insured/interested-parties',
          },
          {
            name: 'Client Remarks',
            link: './home/gis/setup/client-insured/client-remarks',
          },
        ],
        collapsed: true,
      },
      {
        name: 'Premium Rates',
        nameSlug: 'PremiumRates',
        icon: 'fa-solid fa-sliders',
        menuItems: [
          {
            name: 'Premium Rates',
            link: './home/gis/setup/premium-rate/premium-rates',
          },
        ],
        collapsed: true,
      },
      {
        name: 'Perils & Territories',
        nameSlug: 'PerilsTerritories',
        icon: 'fa-solid fa-sliders',
        menuItems: [
          { name: 'Perils', link: 'home/gis/setup/peril-territory/perils' },
          {
            name: 'Territories',
            link: '/home/gis/setup/peril-territory/territories',
          },
          {
            name: 'Quake Zones',
            link: 'home/gis/setup/peril-territory/quake-zones',
          },
        ],
        collapsed: true,
      },
      {
        name: 'Schedules',
        nameSlug: 'Schedules',
        icon: 'fa-regular fa-calendar-days',
        menuItems: [],
        collapsed: true,
      },
      {
        name: 'Clauses',
        nameSlug: 'Clauses',
        icon: 'fa-solid fa-circle-nodes',
        menuItems: [
          { name: 'Clauses', link: 'home/gis/clauses' },
          { name: 'Subclass Clauses', link: 'home/gis/subclass-clauses' },
        ],
        collapsed: true,
      },
      {
        name: 'Short Period',
        nameSlug: 'ShortPeriod',
        icon: 'fa-solid fa-dumbbell',
        link: '/home/gis/setup/short-period/standard-short-period-rates',
        menuItems: [],
        collapsed: true,
      },
      {
        name: 'Reinsurance',
        nameSlug: 'Reinsurance',
        icon: 'fa-solid fa-ranking-star',
        menuItems: [],
        collapsed: true,
      },
    ],
    ANALYTICS: [
      {
        name: 'Actions',
        nameSlug: 'actions',
        icon: 'fa-solid fa-gears',
        menuItems: [
          {
            name: 'Create Report',
            link: '/home/reportsv2/create-report',
          },
          {
            name: 'Create Dashboard',
            link: '/home/reportsv2/create-dashboard',
          },
        ],

        collapsed: true,
      },
      {
        name: 'Analytics',
        nameSlug: 'analytics',
        icon: 'fa-solid fa-chart-pie',
        link: '',
        menuItems: [
          { name: 'Dashboards', link: 'home/reportsv2/create-dashboard' },
          { name: 'My Reports', link: 'home/reportsv2/report-management/M' },
          {
            name: 'Shared Reports',
            link: 'home/reportsv2/report-management/S',
          },
        ],

        collapsed: true,
      },
    ],
    SCREEN_SETUP: [
      {
        name: 'Actions',
        nameSlug: 'actions',
        icon: 'fa-solid fa-gears',
        menuItems: [
          {
            name: 'Create Report',
            link: '/home/reportsv2/create-report',
          },
          {
            name: 'Create Dashboard',
            link: '/home/reportsv2/create-dashboard',
          },
        ],

        collapsed: true,
      },
    ],
    FMS: [
      {
        name: 'Cheques',
        nameSlug: 'cheques',
        icon: 'fa-solid fa-money-check',
        link: 'home/fms/cheque-authorization',
        collapsed: true,
      },
      {
        name: 'Actions',
        nameSlug: 'actions',
        icon: 'fa-solid fa-gears',
        menuItems: [{ name: 'Cheque signing', link: '' }],
        collapsed: true,
      },
    ],
  };

  public _sidebarMainMenu = new BehaviorSubject<SidebarMenu[]>([
    {
      name: 'Summary',
      nameSlug: 'summary',
      icon: 'fa-regular fa-newspaper',
      menuItems: [
        { name: 'My Tasks', link: '/my-tasks' },
        { name: 'My Dashboard', link: '/my-dashboard' },
        { name: 'My Transactions', link: '/my-transactions' },
        { name: 'My Policies', link: '/my-policies' },
        { name: 'My Quotations', link: '/my-quotations' },
        { name: 'My Renewals', link: '/my-renewals' },
      ],
      collapsed: true,
    },
  ]);
  public readonly sidebarMainMenuRead: Observable<SidebarMenu[]> =
    this._sidebarMainMenu.asObservable();

  updateSidebarMainMenu(menu: string) {
    this._sidebarMainMenu.next(this.sidebarMenuList[menu]);
  }

  administationSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'Account Setup',
        link: '/home/administration',
        value: 'ACC_SETUP',
        isActive: true,
      },
      {
        name: 'Staff Performance',
        link: '/home/administration/employees',
        value: 'STAFF_PERF',
        isActive: true,
      },
      {
        name: 'CRM Setup',
        link: '/home/crm',
        value: 'CRM_SETUP',
        isActive: true,
      },
      {
        name: 'GIS Setup',
        link: '',
        value: 'GIS_SETUP',
        isActive: true,
      },
      {
        name: 'Screen Setup',
        link: '/home/setups/system',
        value: 'SCREEN_SETUP',
        isActive: true,
      },
      {
        name: 'Need Analysis Setup',
        link: '/home/setups/need-analysis',
        value: 'SCREEN_SETUP',
        isActive: true,
      },
    ];
  }
  teamSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'Create Team',
        link: '/Account/Details',
        value: 'ACC_SETUP',
      },
      {
        name: 'View Team',
        link: '/view-employees',
        value: 'STAFF_PERF',
      },
    ];
  }

  policySubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'Policies',
        link: '/home/lms/policy/list',
        // link: "/home/lms/grp/policy/policyListing",
        value: 'POLICY',
      },
    ];
  }
  reinsuranceSubMenuList() {
    return [
      {
        name: 'Reinsurance',
        link: '/home/lms/ind/reinsurance/initiation',
        value: 'REINSURANCE',
      },
    ];
  }
  claimSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'Report Claims',
        link: '/Account/Details',
        value: 'ACC_SETUP',
      },
      {
        name: 'View Claims',
        link: '/view-employees',
        value: 'STAFF_PERF',
      },
    ];
  }
  accountSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'View Account',
        link: 'home/entity/list',
        value: 'ACC_SETUP',
      },
      {
        name: 'Create Account',
        link: 'home/entity/new',
        value: 'ACC_SETUP',
      },
    ];
  }

  quotationSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'Create Quick Quote',
        link: '/home/lms/quotation/list',
        value: 'QUOTATION',
      },
      {
        name: 'View Quotations',
        link: '/home/lms/quotation/list',
        value: 'QUOTATION',
      },
    ];
  }

  analyticsSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'Create Report',
        link: '/home/reportsv2/create-report',
        value: 'ANALYTICS',
      },
      {
        name: 'Create Dashboard',
        link: '/home/reportsv2/create-dashboard',
        value: 'ANALYTICS',
      },
      {
        name: 'Dashboard',
        link: '/home/reportsv2',
        value: 'ANALYTICS',
      },
    ];
  }

  fmsSubMenuList(): SidebarMenu[] {
    return [
      {
        name: 'General ledger',
        link: '/home/fms/cheque-authorization',
        value: 'FMS',
        menuItems: [
          { name: 'Parameters', link: '' },
          { name: 'Transactions', link: '' },
          { name: 'Inquiries', link: '' },
          { name: 'Reports', link: '' },
        ],
      },
      {
        name: 'Cashbook',
        link: '',
        value: 'FMS',
        menuItems: [
          { name: 'Parameters', link: '' },
          { name: 'Transactions', link: '' },
          { name: 'Requisitions', link: '' },
          { name: 'Cheques', link: '' },
          { name: 'Receipts', link: '' },
          { name: 'Reconciliations', link: '' },
          { name: 'Inquiries', link: '' },
        ],
      },
    ];
  }
}
