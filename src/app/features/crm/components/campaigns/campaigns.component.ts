import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Logger} from "../../../../shared/services";
import {CampaignsService} from "../../services/campaigns..service";
import {AggregatedCampaignsDTO, CampaignsDTO} from "../../data/campaignsDTO";
import {NgxSpinnerService} from "ngx-spinner";
import {Table} from "primeng/table";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {OrganizationService} from "../../services/organization.service";
import {OrganizationDTO} from "../../data/organization-dto";
import {CurrencyService} from "../../../../shared/services/setups/currency/currency.service";
import {CurrencyDTO} from "../../../../shared/data/common/currency-dto";
import {StaffService} from "../../../entities/services/staff/staff.service";
import {StaffDto} from "../../../entities/data/StaffDto";
import {forkJoin} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {CampaignDefinitionComponent} from "./campaign-definition/campaign-definition.component";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";

const log = new Logger('CampaignsComponent');
@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  pageSize: 5;
  campaignData: CampaignsDTO[];
  selectedCampaign: any;

  isLoadingAuthExc: boolean = false;
  isLoadingMakeUndo: boolean = false;

  showCampaignTable: boolean = true;
  showDefinitionMode: boolean = false;
  campaignProductsData: any;
  campaignClientsData: any;
  systemsData: SystemsDto[];
  userData: StaffDto;

  @ViewChild('campaignsTable') campaignsTable: Table;
  organizationData: OrganizationDTO[];
  currencyData: CurrencyDTO[];
  aggregatedCampaignsData : Pagination<AggregatedCampaignsDTO> = <Pagination<AggregatedCampaignsDTO>>{};

  @ViewChild(CampaignDefinitionComponent) campaignDefinitionComp: CampaignDefinitionComponent;

  @ViewChild('campaignConfirmationModal')
  campaignConfirmationModal!: ReusableInputComponent;

  constructor(
    private campaignsService: CampaignsService,
    private spinner: NgxSpinnerService,
    private systemsService: SystemsService,
    private organizationService: OrganizationService,
    private currencyService: CurrencyService,
    private staffService: StaffService,
    private cdr: ChangeDetectorRef,
    private globalMessagingService: GlobalMessagingService
  ) {
  }

  ngOnInit(): void {
    this.getGrpCampaignsData();
  }

  /**
   * Toggles the visibility of the campaign table and campaign definition mode
   * When called, the campaign table is hidden and the campaign definition mode is shown
   */
  toggleCampaignDefinition() {
    this.showCampaignTable = false;
    log.info('toggle is called');
  }

  /**
   * Shows the campaign definition mode and hides the campaign table.
   * This method is called when the user clicks on the 'Define Campaign' button.
   * It sets the component's properties to show the campaign definition mode
   * and hides the campaign table.
   */
  showDefinition() {
    this.showCampaignTable = false;
    this.showDefinitionMode = true;
    console.log('Showing campaign definition');
  }

  /**
   * Shows the campaign definition edit mode and hides the campaign table.
   * This method is called when the user clicks on the 'Edit Campaign' button.
   * It sets the component's properties to show the campaign definition edit mode
   * and hides the campaign table. If no campaign is selected, it displays an
   * error message.
   */
  showEditDefinition() {
    if (this.selectedCampaign) {
      this.showCampaignTable = false;
      this.showDefinitionMode = true;
      log.info('Showing campaign definition edit>>', this.selectedCampaign);
      setTimeout( () => {
        this.campaignDefinitionComp.editCampaign();
      },5000)

    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign is selected!'
      );
    }
  }

  // Toggle function for analytics mode
  showAnalytics() {
    this.showCampaignTable = false;
    this.showDefinitionMode = false;
    log.info('Showing campaign analytics');
  }

  /**
   * Toggles the campaign table mode on and off. If the campaign table is
   * hidden, it shows it. If it is shown, it hides it.
   */
  toggleCampaign() {
    this.showCampaignTable = true;
  }

  /**
   * Fetches campaigns from the server and populates the campaignData variable.
   * Shows a spinner while fetching the campaigns and hides it after the campaigns are received.
   */
  fetchCampaigns() {
    this.spinner.show();
    this.campaignsService.getCampaigns()
      .subscribe((data) => {
        this.campaignData = data;
        this.spinner.hide();

        log.info("campaigns>>", data);
      });
  }


  /**
   * Filters the campaigns table based on the value entered in the HTMLInputElement.
   * Called when the user enters a search criteria and value in the search form.
   */
  filterCampaigns(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.campaignsTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * Fetches campaigns, staff, currencies, organization, and systems from the server and
   * populates the aggregatedCampaignsData, systemsData, organizationData, and currencyData
   * variables. Shows a spinner while fetching the data and hides it after the data is
   * received. If there is an error while fetching the data, it displays the error message
   * in a global error message box.
   */
  getGrpCampaignsData() {
    this.spinner.show();
    forkJoin(([
      this.campaignsService.getCampaigns(),
      this.staffService.getStaff(0, 200, null, 'dateCreated', 'desc', null),
      this.currencyService.getCurrencies(),
      this.organizationService.getOrganization(),
      this.systemsService.getSystems()
    ]))
      .subscribe({
        next: ([campaign, staff, currencies, organization, system]) => {
          if (campaign.length > 0) {
            const result: AggregatedCampaignsDTO[] = [];
            for (const campaignData of campaign) {
              const staffFilter = staff.content.filter(value => value.id === campaignData.user);
              const currencyFilter = currencies.find(value => value.id === campaignData.currencies);
              const organizationFilter = organization.find(value => value.id === campaignData.organization);
              const systemFilter = system.find(value => value.id === campaignData.system);

              result.push({
                campaign: campaignData,
                staffs: staffFilter,
                system: systemFilter,
                organization: organizationFilter,
                currency: currencyFilter
              });
            }
            log.info('aggregated data', result);
            this.systemsData = system;
            this.organizationData = organization;
            this.currencyData = currencies;
            this.aggregatedCampaignsData.content = result;
            this.aggregatedCampaignsData.numberOfElements = campaign?.length;
            this.spinner.hide();
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          let errorMessage = '';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else {
            errorMessage = err.message;
          }
          this.globalMessagingService.displayErrorMessage('Error', errorMessage);
          this.spinner.hide();
        }
      });
  }

  /**
   * Sets the selectedCampaign variable with the selected campaign.
   */
  onCampaignSelect(campaign: AggregatedCampaignsDTO) {
    this.selectedCampaign = campaign;
    log.info('campaign select', this.selectedCampaign)
  }

  /**
   * Shows a confirmation modal to delete a campaign.
   */
  deleteCampaign() {
    this.campaignConfirmationModal.show();
  }

  /**
   * Confirms the deletion of a campaign and calls the deleteCampaign method from the service
   * to delete the campaign. If the campaign is deleted successfully, it shows a success message
   * and resets the selectedCampaign variable. If there is no campaign selected, it shows an
   * error message.
   */
  confirmCampaignDelete() {
    if (this.selectedCampaign) {
      const campaignId = this.selectedCampaign?.campaign?.code;
      this.campaignsService.deleteCampaign(campaignId).subscribe({
        next: (data) => {
          {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a campaign'
            );
            this.selectedCampaign = null;
            this.getGrpCampaignsData();
          }
        },
        error:(err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
      log.info('delete>', campaignId)
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No campaign is selected.'
      );
    }
  }
}
