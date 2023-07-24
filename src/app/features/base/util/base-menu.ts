export const MENU_ITEMS: MENU_MODEL[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/home/dashboard',
    home: true,
  },
  {
    title: 'Summary',
    icon: 'browser-outline',
    link: '/home/my-activities',
    children: [
      {
        title: 'My Tasks',
        link: '/home/my-tasks',
      },
      {
        title: 'My Dashboard',
        link: '/home/my-dashboard',
      },
      {
        title: 'My Transactions',
        link: '/home/my-transactions',
      },
      {
        title: 'My Policies',
        link: '/home/my-policies',
      },
      {
        title: 'My Quatations',
        link: '/home/my-quatations',
      },
      {
        title: 'My Renewals',
        link: '/home/my-renewals',
      },
    ],
  }
  // {
  //   title: 'Setups',
  //   icon: 'npm-outline',
  //   link: '/home/dashboard',
  //   children: [
  //   ]
  // },
  // {
  //   title: 'Service Provider',
  //   icon: 'npm-outline',
  //   link: '/home/service-providers',
  // }
  // {
  //   title: 'Staff',
  //   icon: 'person-outline',
  //   link: '/home/staff',
  //   // children: [
  //   // ]
  // },
  // {
  //   title: 'Clients/Customers',
  //   icon: 'briefcase-outline',
  //   link: '/home/clients',
  //   // children: [
  //   // ]
  // },
  // {
  //   title: 'Clients',
  //   icon: 'settings-2-outline',
  //   link: '/home/client',
  //   // children: [
  //   // ]
  // },
  // {
  //   title: 'Business Partner',
  //   icon: 'checkmark-square-2-outline',
  //   link: '/home/intermediary',
  //   // children: [
  //   // ]
  // },
  /*{
    title: 'Tasks',
    icon: 'checkmark-square-2-outline',
    link: '/pages/manage-apps',
  },
  {
    title: 'Calendar',
    icon: 'calendar-outline',
    link: '/pages/manage-apps',
  },
  {
    title: 'Calls',
    icon: 'phone-outline',
    link: '/pages/manage-apps',
  },
  {
    title: 'Cases',
    icon: 'message-circle-outline',
    link: '/pages/manage-apps',
  },
  {
    title: 'Setups',
    icon: 'settings-2-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: 'SETTINGS',
        group: true,
      },
      {
        title: 'Organization Profile',
        icon: 'briefcase-outline',
        link: '/pages/layout/setups',
        children: [
          {
            title: 'Organisation',
            link: '/pages/layout/organization',
          },
          {
            title: 'Countries',
            link: '/pages/layout/edit',
          },
          {
            title: 'Branches',
            link: '/pages/layout/branch',
          },
          {
            title: 'Regions',
            link: '/pages/layout/region',
          },
          {
            title: 'Divisions',
            link: '/pages/modal-overlays/dialog',
          },
          {
            title: 'Hierarchy',
            link: '/pages/layout/setups',
          },
          {
            title: 'Countries',
            link: '/pages/extra-components/chat',
          },
        ],
      },
      {
        title: 'Organization Parameter',
        icon: 'npm-outline',
        link: '/pages/layout/setups',
        //children: [],
      },
      {
        title: 'USERS',
        group: true,
      },
      {
        title: 'User Management',
        icon: 'people-outline',
        link: '/pages/layout/users-setup',
        children: [
          {
            title: 'Users',
            link: '/pages/layout/users-setup',
          },
          {
            title: 'Group users',
            link: '/pages/layout/users-setup',
          },
        ],
      },

    ],
  },*/
];


interface MENU_MODEL {
  title:string,
  icon:string,
  link: string,
  home?:boolean,
  children?: {title:string, link:string}[]
}[]
