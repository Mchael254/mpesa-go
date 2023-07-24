import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  apps = [
    {
      'card-body-class': 'appStore',
      systemName: 'GIS/Non Life',
      systemCode: 37,
      desc: 'Lorium ipsum is a dummy text',
      imageSrc: 'surface1.png',
      clicked: false,
    },
    {
      'card-body-class': 'appStore',
      systemName: 'Individual Life',
      systemCode: 26,
      desc: 'Lorium ipsum is a dummy text',
      imageSrc: 'Page.png',
      clicked: false,
    },
    {
      'card-body-class': 'appStore',
      systemName: 'Group Life',
      systemCode: 26,
      desc: 'Lorium ipsum is a dummy text',
      imageSrc: 'Frame.png',
      clicked: false,
    },
    {
      'card-body-class': 'appStore',
      systemName: 'PORTAL',
      systemCode: 43,
      desc: 'Lorium ipsum is a dummy text',
      imageSrc: 'portal.png',
      clicked: false,
    },
    // {
    //   'card-body-class': 'appStore',
    //   systemName: 'CRM',
    //   systemCode: 0,
    //   desc: 'Lorium ipsum is a dummy text',
    //   imageSrc: '../../../../assets/images/Group.png',
    //   clicked: false,
    // },
    // {
    //   'card-body-class': 'appStore',
    //   systemName: 'Medical',
    //   systemCode: 38,
    //   desc: 'Lorium ipsum is a dummy text',
    //   imageSrc: '../../../../assets/images/surface.png',
    //   clicked: false,
    // },
    // {
    //   'card-body-class': 'appStore',
    //   systemName: 'FMS',
    //   systemCode: 1,
    //   desc: 'Lorium ipsum is a dummy text',
    //   imageSrc: '../../../../assets/images/fms.png',
    //   clicked: false,
    // },
    // {
    //   'card-body-class': 'appStore',
    //   systemName: 'DMS',
    //   systemCode: 50,
    //   desc: 'Lorium ipsum is a dummy text',
    //   imageSrc: '../../../../assets/images/dms.png',
    //   clicked: false,
    // },
    // {
    //   'card-body-class': 'appStore',
    //   systemName: 'BI',
    //   systemCode: 47,
    //   desc: 'Lorium ipsum is a dummy text',
    //   imageSrc: '../../../../assets/images/surface1.png',
    //   clicked: false,
    // },
  ];

  constructor() { }

  getApps(): any{
      return this.apps;
  }
}
