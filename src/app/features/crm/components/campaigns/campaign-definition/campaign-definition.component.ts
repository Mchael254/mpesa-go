import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('CampaignDefinitionComponent');
@Component({
  selector: 'app-campaign-definition',
  templateUrl: './campaign-definition.component.html',
  styleUrls: ['./campaign-definition.component.css']
})
export class CampaignDefinitionComponent implements OnInit {
  products: any[];
  pageSize: 5;
  campaignTargetData: any[];
  selectedCampaignTarget: any[] = [];

  editMode: boolean = false;

  url = ""
  selectedFile: File;

  navigationLinks: any[] = [
    {
      id: 0,
      url: 'campaignDetails',
      title: 'Campaign details'
    },
    {
      id: 1,
      url: 'targets',
      title: 'Targets'
    },
    {
      id: 2,
      url: 'activities',
      title: 'Activities'
    },
    {
      id: 3,
      url: 'messages',
      title: 'Messages'
    },
    {
      id: 4,
      url: 'performance',
      title: 'Performance'
    }
  ];
  currentTab: any = this.navigationLinks[0];
  buttonText:string = 'Next';
  @Output() onClickSave: EventEmitter<any> = new EventEmitter<any>();
  basicData: any;

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.products = [
      {
        name: 'Private motor',
        id: 1
      },
      {
        name: 'Marine cargo',
        id: 2
      },
      {
        name: 'test 3',
        id: 3
      }
    ];
    this.basicData = {
      labels: ['Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20'],
      datasets: [
        {
          label: 'Engagements',
          data: [550, 570, 600, 760, 800, 255, 250, 990, 0, 120]
        }
      ]
    };
  }

  selectProduct(product: any) {

  }

  deleteProduct(product: any) {

  }

  openTargetModal() {
    const modal = document.getElementById('targetSearchModal');
    if (modal && this.selectedCampaignTarget) {
      modal.classList.add('show');
      modal.style.display = 'block';
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No target is selected!'
      );
    }
  }

  closeTargetModal() {
    this.editMode = false;
    const modal = document.getElementById('targetSearchModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openCampaignActivityModal() {
    const modal = document.getElementById('campaignActivityModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCampaignActivityModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignActivityModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openNewCampaignActivityModal() {
    const modal = document.getElementById('newCampaignActivityModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeNewCampaignActivityModal() {
    this.editMode = false;
    const modal = document.getElementById('newCampaignActivityModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openCampaignMessageModal() {
    const modal = document.getElementById('campaignMessageModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCampaignMessageModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignMessageModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openTrackerUrlModal() {
    const modal = document.getElementById('trackerUrlModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeTrackerUrlModal() {
    this.editMode = false;
    const modal = document.getElementById('trackerUrlModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  onFileChange(event) {
    if (event.target.files) {
      var reader = new FileReader()
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
        log.info(this.url);
      }
    }
  }

  goToNext() {
    let index = this.currentTab.id;
    if (index === this.navigationLinks.length-1) {
      index = 0;
      this.onClickSave.emit(index);
    }
    else {
      index++;
    }

    this.currentTab = this.navigationLinks[index];
    log.info(this.currentTab)

    this.buttonText = this.navigationLinks.length-1 === this.currentTab.id ? 'Back to campaigns' : 'Next';

  }

  tabNavigation(index:number) {
    this.currentTab = this.navigationLinks[index];
    this.buttonText = this.navigationLinks.length-1 === this.currentTab.id ? 'Back to campaigns' : 'Next';
  }
}
