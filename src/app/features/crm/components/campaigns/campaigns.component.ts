import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../shared/services";

const log = new Logger('CampaignsComponent');
@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  pageSize: 5;
  campaignData: any[];
  selectedCampaign: any[] = [];

  isLoadingAuthExc: boolean = false;
  isLoadingMakeUndo: boolean = false;

  showCampaignTable: boolean = true;
  showDefinitionMode: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleCampaignDefinition() {
    this.showCampaignTable = false;
    log.info('toggle is called');
  }

  showDefinition() {
    this.showCampaignTable = false;
    this.showDefinitionMode = true;
    console.log('Showing campaign definition');
  }

  // Toggle function for analytics mode
  showAnalytics() {
    this.showCampaignTable = false;
    this.showDefinitionMode = false;
    console.log('Showing campaign analytics');
  }

  toggleCampaign() {
    this.showCampaignTable = true;
  }
}
