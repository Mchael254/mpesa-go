/****************************************************************************
 **
 ** Author: Raphael Kimiti
 **
 ****************************************************************************/

export const menuConfigurations = {

  Setup: [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home/dashboard',
    },
    {
      title: 'Account Setup',
      icon: 'person-outline',
      link: 'home/Account/Details',
      home: true,
    }
  ],
  GIS: [
    {
        title: 'Home',
        icon: 'home-outline',
        link: '/home/dashboard',
    },
    {
        title: 'Actions',
        icon: 'arrow-circle-right',
        children: [
            {
                title: 'New Setup',
                link: '/home/create-setups'
            }
        ]
    },
    {
        title: 'General Setups',
        icon: 'briefcase-outline',
        link: '/home/gis/general-setup',
        home: true,
        children: [
            {
              title:'General Parameters',
              children:[
                {
                  title: 'System Parameters',
                  link: '/home/gis/parameters',
                },
                {
                  title: 'System Sequences',
                  link: '/home/gis/system-sequences',
                },
                {
                  title:'Form Fields setup',
                  link: '/home/gis/fieldsSetUp',
                }
              ]
            },
            {
              title: 'Class Setup',
              children:[
                {
                  title: 'Classes & Subclasses',
                  link: '/home/gis/classSetupsWizard',
                },
              ]
            },
            {
              title: 'Products Setup',
              children:[
                {
                  title: 'Products-Wizard',
                  link: '/home/gis/product',
                },
              ]
            },
            {
              title:'Cover Types & Sections',
              children:[
                {
                  title: 'Cover Types',
                  link: '/home/gis/cover-types',
                },
                {
                  title: 'Sections',
                  link: '/home/gis/sections',
                },
                {
                  title: 'Subclass Sections and Covertypes',
                  link: '/home/gis/subclasses-sections-and-covertypes',
                },
              ]
            },
            {
              title:'Taxes Setups',
              children:[

                {
                  title: 'Taxes Rates (NB on Subclass)',
                  link: '/home/gis/tax-rates',
                },

              ]
            },
            {
              title:'Client & Insured Setups',
              children:[

                {
                  title: 'Interested Parties',
                  link: '/home/gis/interested-parties',
                },
                {
                  title: 'Client Remarks',
                  link: '/home/gis/client-remarks',
                },
              ]
            },
            {
              title: 'Perils & Territories',
              children:[
                {
                  title: "Perils",
                  link:'/home/gis/perils'
                },
                {
                  title: "Territories",
                  children:[
                    {
                      title:"Territories",
                      link:'/home/gis/territories'
                    },
                    {
                      title:"Quake/Flood Zones",
                      link:'/home/gis/zones'
                    }
                  ]

                }
              ]
            },
            {
              title: 'Premium Rates',
              children:[
                {
                  title: "Premium Rates",
                  link:'/home/gis/premium-rates'
                },
                {
                  title: "Standard short period rates",
                  link:'/home/gis/shortPeriod'
                }
              ]
            },
            {
              title: 'Schedules Setups',
              children:[
                {
                  title:'Schedule Screen Codes',
                  link: '/home/gis/schedules',
                },
              ]
            },
            {
              title: 'Clauses Setups',
              children:[
                {
                  title:'Clauses',
                  link: '/home/gis/clauses',
                },
              ]
            },
            {
              title: 'Short Period Setups',
              children:[
                {
                  title:'Short Period Rates',
                  link: '/home/gis/shortPeriod',
                },
              ]
            },
            {
              title: 'Reinsurance',
              link: '/home/my-quatations',
            },
            {
              title: 'My Renewals',
              link: '/home/my-renewals',
            },
        ],
    },
    {
        title: 'Favourite Setups',
        icon: 'briefcase-outline',
        link: '/home/dashboard'
    },
    {
        title: 'Pending Setups',
        icon: 'briefcase-outline',
        link: '/home/dashboard'
    },
    {
        title: 'Frequently Viewed',
        icon: 'briefcase-outline',
        link: '/home/dashboard'
    },
  ],

  reports: [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home/dashboard',
    },
    {
      title: 'Analytics',
      icon: 'briefcase-outline',
      link: '/home/reports',
      home: true,
      children: [
        {
            title: 'New Report',
            icon: 'briefcase-outline',
            link: '/home/reports/create-report',
        },
        {
            title: 'My Reports',
            icon: 'briefcase-outline',
            link: '/home/reports/my-reports',
        },
        {
            title: 'Shared Reports',
            icon: 'briefcase-outline',
            link: '/home/reports/shared-reports',
        },
      ]
    }
  ],

  reportsv2: [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home/dashboard',
    },
    {
      title: 'Analytics',
      icon: 'briefcase-outline',
      link: '/home/reportsv2',
      home: true,
      children: [
        {
          title: 'New Report',
          icon: 'briefcase-outline',
          link: '/home/reportsv2/create-report',
        },
      ]
    }
  ],

  Accounts: [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home/dashboard',
    },
    {
      title: 'Actions',
      icon: 'arrow-circle-right',
      children: [
        {
            title: 'New Entity',
            icon: 'briefcase-outline',
            link: '/home/create-entity'
        },
        {
            title: 'New Clients',
            icon: 'briefcase-outline',
            link: '/home/create-entity'
        },
        {
            title: 'New Staff',
            icon: 'briefcase-outline',
            link: '/home/create-entity'
        },
        {
            title: 'New Service Provider',
            icon: 'briefcase-outline',
            link: '/home/create-entity'
        },
        {
            title: 'New Business Partner',
            icon: 'briefcase-outline',
            link: '/home/create-entity'
        },
      ]
    },
    {
        title: 'Accounts',
        icon: 'briefcase-outline',
        link: '/home/entity',
        home: true,
        children: [
            {
              title: 'Entities',
              icon: 'settings-2-outline',
              link: '/home/entity',
            },
            {
              title: 'Staff',
              icon: 'person-outline',
              link: '/home/staff',
            },
            {
              title: 'Clients',
              icon: 'people-outline',
              link: '/home/client',
            },
            {
              title: 'Agents',
              icon: 'npm-outline',
              link: '/home/intermediary',
            },
            {
              title: 'Service Providers',
              icon: 'checkmark-square-2-outline',
              link: '/home/service-providers'
            },
        ],
    },
    {
        title: 'Policies',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'Summary',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Activities',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Policies',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Quatations',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Renewals',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'Business Accounts',
        icon: 'checkmark-square-2-outline',
        link: '/home/dashboard',
    }
  ],

  Staffs: [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home/dashboard',
    },
    {
        title: 'My Employees',
        icon: 'briefcase-outline',
        link: '/home/view-employees',
        home: true,
    },
    {
        title: 'Summary',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Activities',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Policies',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Quatations',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'My Renewals',
        icon: 'briefcase-outline',
        link: '/home/dashboard',
    },
    {
        title: 'Business Accounts',
        icon: 'checkmark-square-2-outline',
        link: '/home/dashboard',
    }

  ]
};

