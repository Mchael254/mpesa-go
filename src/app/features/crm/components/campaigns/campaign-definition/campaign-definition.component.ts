import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

  navigationLinks: any[];

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
    this.navigationLinks = [
      {
        id: 1,
        url: 'campaignDetails'
      },
      {
        id: 2,
        url: 'targets'
      },
      {
        id: 3,
        url: 'activities'
      },
      {
        id: 4,
        url: 'messages'
      }
    ]
  }

  goNext() {
    document.addEventListener('DOMContentLoaded', () => {
      const buttons = document.querySelectorAll('.navigate-tab');

      log.info('here')
      buttons.forEach(button => {
        button.addEventListener('click', (event) => {
          const targetTabId = (event.target as HTMLElement).getAttribute('data-target');
          if (targetTabId) {
            const tabElement = document.querySelector(targetTabId) as HTMLElement;
            if (tabElement) {
              const bootstrapTab = new (window as any).bootstrap.Tab(tabElement);
              bootstrapTab.show();
            }
          }
        });
      });
    });

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
}
