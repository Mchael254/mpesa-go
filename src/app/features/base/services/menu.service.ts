
import { Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { SidebarMenu } from '../model/sidebar.menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService{
  private sidebarMenuList = {

    "DEFAULT":[
      {
        name: 'Summary',
        nameSlug: 'summary',
        icon: 'fa-regular fa-newspaper',
        menuItems: [{name:'My Tasks', link:"/my-tasks"}, {name:'My Dashboard', link:"/my-dashboard"}, {name:'My Transactions', link:"/my-transactions"}, {name:'My Policies', link:"/my-policies"}, {name:'My Quotations', link:"/my-quotations"}, {name:'My Renewals', link:"/my-renewals"}],
        collapsed:true,
      }

    ],
    "ACC_SETUP":[
    {
      name: 'Account Setup',
      nameSlug: 'accountSetup',
      icon: 'fa-solid fa-gears',
      collapsed:true,
    }

  ],
    "STAFF_PERF":[{
    name: 'My Emloyees',
    nameSlug: 'emloyees',
    link:'./home/entity/staff/list',
    icon: 'fa-solid fa-user-tie',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
  },{
    name: 'Summary',
    nameSlug: 'summary',
    icon: 'fa-regular fa-newspaper',
    link: '/home/dashboard',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
  },{
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
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
  },{
    name: 'Business Account',
    nameSlug: 'businessAccount',
    icon: 'fa-solid fa-suitcase',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
  },],
    "CRM_SETUP":[{
    name: 'CRM',
    nameSlug: 'crm',
    icon: 'fa-solid fa-keyboard',
    menuItems: [{name:'My Tasks', link:""}, {name:'My Dashboard', link:""}, {name:'My Transactions', link:""}, {name:'My Policies', link:""}, {name:'My Quotations', link:""}, {name:'My Renewals', link:""}],
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
    collapsed:true,
  }],
    "GIS_SETUP":[
    {
    name: 'Actions',
    nameSlug: 'actions',
    icon: 'fa-solid fa-gears',
    menuItems: [{name:'My Tasks', link:""}, {name:'My Dashboard', link:""}, {name:'My Transactions', link:""}, {name:'My Policies', link:""}, {name:'My Quotations', link:""}, {name:'My Renewals', link:""}],
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
    collapsed:true,
  },
  {
    name: 'General Setup',
    nameSlug: 'generalSetup',
    icon: 'fa-solid fa-gears',
    menuItems: [{name:'My Tasks', link:""}, {name:'My Dashboard', link:""}, {name:'My Transactions', link:""}, {name:'My Policies', link:""}, {name:'My Quotations', link:""}, {name:'My Renewals', link:""}],
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
    collapsed:true,
  },
  {
    name: 'Favorite Setups',
    nameSlug: 'favoriteSetups',
    icon: 'fa-solid fa-list-check',
    menuItems: [{name:'My Tasks', link:""}, {name:'My Dashboard', link:""}, {name:'My Transactions', link:""}, {name:'My Policies', link:""}, {name:'My Quotations', link:""}, {name:'My Renewals', link:""}],
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
    collapsed:true,
  },
  {
    name: 'Pending Setups',
    nameSlug: 'pendingSetups',
    icon: 'fa-solid fa-screwdriver-wrench',
    menuItems: [{name:'My Tasks', link:""}, {name:'My Dashboard', link:""}, {name:'My Transactions', link:""}, {name:'My Policies', link:""}, {name:'My Quotations', link:""}, {name:'My Renewals', link:""}],
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
    collapsed:true,
  },
  {
    name: 'Frequently viewed',
    nameSlug: 'frequentlyViewed',
    icon: 'fa-solid fa-sliders',
    menuItems: [{name:'My Tasks', link:""}, {name:'My Dashboard', link:""}, {name:'My Transactions', link:""}, {name:'My Policies', link:""}, {name:'My Quotations', link:""}, {name:'My Renewals', link:""}],
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/>
      </svg>
    `,
    collapsed:true,
  },
  ]}

public _sidebarMainMenu = new BehaviorSubject<SidebarMenu[]>([
    {
      name: 'Summary',
      nameSlug: 'summary',
      icon: 'fa-regular fa-newspaper',
      menuItems: [{name:'My Tasks', link:"/my-tasks"}, {name:'My Dashboard', link:"/my-dashboard"}, {name:'My Transactions', link:"/my-transactions"}, {name:'My Policies', link:"/my-policies"}, {name:'My Quotations', link:"/my-quotations"}, {name:'My Renewals', link:"/my-renewals"}],
      svgContent: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"/></svg>`,
      collapsed:true,
    }

  ]);
public readonly sidebarMainMenuRead: Observable<SidebarMenu[]> = this._sidebarMainMenu.asObservable();

updateSidebarMainMenu(menu: string){
  this._sidebarMainMenu.next(this.sidebarMenuList[menu]);
}

administationSubMenuList() : SidebarMenu[]{
  return [
    {
      name:"Account Setup",
      link: "/Account/Details",
      value: "ACC_SETUP"
    },
    {
      name:"Staff Performance",
      link:"/view-employees",
      value: "STAFF_PERF"
    },
    {
      name:"CRM Setup",
      link:"/view-employees",
      value: "CRM_SETUP"
    },
    {
      name:"GIS Setup",
      link:"/gis/general-setup",
      value: "GIS_SETUP"
    }
  ];
}
teamSubMenuList() : SidebarMenu[]{
  return [
    {
      name:"Create Team",
      link: "/Account/Details",
      value: "ACC_SETUP"
    },
    {
      name:"View Team",
      link:"/view-employees",
      value: "STAFF_PERF"
    },
  ];
}
claimSubMenuList(): SidebarMenu[]{
  return [
    {
      name:"Report Claims",
      link: "/Account/Details",
      value: "ACC_SETUP"
    },
    {
      name:"View Claims",
      link:"/view-employees",
      value: "STAFF_PERF"
    }];
}
accountSubMenuList(): SidebarMenu[]{
  return  [
    {
      name:"Create Account",
      link: "home/entity/new",
      value: "ACC_SETUP"
    },
    {
      name:"View Account",
      link:"home/entity/list",
      value: "STAFF_PERF"
    },
  ]}
}
