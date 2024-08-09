import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import { PolicyService } from '../../services/policy.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Sidebar } from 'primeng/sidebar';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { Insured, PolicyContent, PolicyResponseDTO, RiskInformation } from '../../data/policy-dto';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { PersonalDetailsUpdateDTO } from 'src/app/features/entities/data/accountDTO';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuotationsService } from '../../../../components/quotation/services/quotations/quotations.service'
import { Clause, subclassClauses, subclassCoverTypeSection } from '../../../setups/data/gisDTO';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { RequiredDocumentService } from '../../../setups/services/required-documents/required-document.service';
import { PerilsService } from '../../../setups/services/perils-territories/perils/perils.service';

const log = new Logger("PolicySummaryOtherDetails");

@Component({
  selector: 'app-policy-summary-other-details',
  templateUrl: './policy-summary-other-details.component.html',
  styleUrls: ['./policy-summary-other-details.component.css']
})
export class PolicySummaryOtherDetailsComponent {
  steps = underwritingSteps
  policyDetails: any
  computationDetails: Object;
  premiumResponse: any;
  premium: number = 0;
  selectedItem: number = 1;
  show: boolean = true;
  policySectionDetails: any;
  errorMessage: string;
  errorOccurred: boolean;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  product: any
  clientDetails: ClientDTO;
  allClients: any;
  clientList: any;
  clientName: any;
  clientCode: any;
  clientData: ClientDTO[];

  insureds: any;

  policySummary: any;
  // insureds: any;
  selectedInsured: any;
  selectedFollower: any;
  policyNumber: any;
  endorsementNo: any;
  selectedClientCode: any;

  filteredClients: any[] = [];

  columns = [
    { label: 'Name', value: 'name' },
    { label: 'Address', value: 'address' },
    { label: 'Town', value: 'town' },
    { label: 'Pin', value: 'pinNo' },
    { label: 'Passport no.', value: 'passportNumber' },
    { label: 'Business', value: 'business' },
    { label: 'Other interested parties', value: 'otherParties' },
    { label: 'ID no.', value: 'idNo' }
  ];
  selectedColumn: any;
  searchQuery: any;
  riskDetails: RiskInformation[];
  selectedRisk: any;
  riskCode: any;
  productCode: any;

  scheduleDetailsForm: FormGroup;
  scheduleData: any;
  scheduleList: any;
  selectedSchedule: any;
  updatedSchedule: any;
  updatedScheduleData: any;
  sectionsDetails: any;

  selectedClauseList: Clause[];
  selectedRiskClause: Clause;
  clauseList: Clause[];
  SubclauseList: subclassClauses[];
  selectedSubClauseList: subclassClauses[];
  selectedClauseCode: any;
  // clauseDetail:any;
  selectedClauses: any
  modalHeight: number = 200; // Initial height

  policyInsuredCode: number;
  // insuredResponse:  any[] = [];
  insuredDetails: Insured[] = [];
  filteredInsuredDetails: any[] = [];

  subclassSectionCoverList: subclassCoverTypeSection[];
  allMatchingSections: any;
  mandatorySections: any;
  filteredMandatorySections: any;
  filteredAllMatchingSections: any;

  sectionList:any;
  selectedSection: any;
  SelectedRiskCode:any;
  selectedSubclassCode: any;
  selectedCoverTypeDesc: any;
  selectedCoverTypeCode:any;
  covertypeSections:any;
  searchText: string = '';
  selectedSections: any[] = [];
  allTransformedSections: any;

  selectedBindercode:any;
  premiumList: any[] = [];
  premiumListIndex = 0;
  sectionArray: any;
  sectionDetailsForm: FormGroup;
  selectedPremiumItem:any;

  filteredRequiredDocs:any[]=[];
  selectedDocument:any;
  selectedCertificate:any;
  remarkDetailsForm: FormGroup;
  selectedRemark:any;
  action: any;
  premiumItemCode:any;
  selectedTransaction:any;
  subperils:any;

  policyRiskPeril:any[]=[]


  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;


  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;





  constructor(
    public policyService: PolicyService,
    private globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    public productService: ProductService,
    private router: Router,
    public fb: FormBuilder,
    public quotationService: QuotationsService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public sectionService: SectionsService,
    public premiumRateService: PremiumRateService,
    public subclassService:SubclassesService,
    public riskClauseService:RiskClausesService,
    public requiredDocumentService: RequiredDocumentService,
    public perilService:PerilsService


  ) { }
  public isCollapsibleOpen = false;
  public isScheduleDetailOpen = false;
  public isRiskClauseDetailsOpen = false;
  public isRiskDetailsOpen = false;
  public isPremiumDetailOpen = false;
  public isRequiredDocDetailOpen = false;
  public isCertificatesDetailOpen = false;
  public isRemarkDetailsOpen = false;
  public isCommissionTranscDetailsOpen = false;
  public isRelatedRiskDetailsOpen = false;


  public riskPerils = false;

  ngOnInit(): void {
    this.getUtil();
    this.loadAllClients();
    this.createScheduleDetailsForm();
    this.getAllSection();
    this.createSectionDetailsForm();
    this.getRequiredDocuments();
    this.createRemarkDetailsForm();
  }
  ngOnDestroy(): void { }

  selectItem(item: number) {
    this.selectedItem = item;
  }


  getUtil() {
    this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    this.getPolicy();

    this.policyService.policyUtils(this.policyDetails.batchNumber).subscribe({
      next: (res) => {
        this.computationDetails = res
        console.log('computation details', this.computationDetails)
        log.debug("Policy Details", this.policyDetails);
      }
    })
  }

  // getPolicy() {
  //   this.batchNo = this.policyDetails.batchNumber;
  //   log.debug("Batch No:", this.batchNo)
  //   if (this.batchNo) {
  //     log.debug("CALLED GET INSURED")
  //     this.getInsureds()
  //   }
  //   this.policyService
  //     .getPolicy(this.batchNo)
  //     .pipe(untilDestroyed(this))
  //     .subscribe({
  //       next: (data: any) => {

  //         if (data && data.content && data.content.length > 0) {
  //           this.policyResponse = data;
  //           log.debug("Get Policy Endpoint Response", this.policyResponse)
  //           this.policyDetailsData = this.policyResponse.content[0]
  //           log.debug("Policy Details data get policy", this.policyDetailsData)
  //           // this.insureds = this.policyDetailsData.insureds
  //           // log.debug("Insureds", this.insureds)
  //           // if (this.insureds) {
  //           //   this.getClient()
  //           //   this.getInsureds()
  //           // }
  //           this.riskDetails = this.policyDetailsData.riskInformation
  //           this.sectionsDetails = this.riskDetails[0].sections
  //           // log.debug("RISK INFORMATION", this.sectionsDetails)
            
  //           this.cdr.detectChanges();

  //         } else {
  //           this.errorOccurred = true;
  //           this.errorMessage = 'Something went wrong. Please try Again';
  //           this.globalMessagingService.displayErrorMessage(
  //             'Error',
  //             'Something went wrong. Please try Again'
  //           );
  //         }
  //       },
  //       error: (err) => {

  //         this.globalMessagingService.displayErrorMessage(
  //           'Error',
  //           this.errorMessage
  //         );
  //         log.info(`error >>>`, err);
  //       },
  //     });
  // }
  async getPolicy() {
    this.batchNo = this.policyDetails.batchNumber;
    console.debug("Batch No:", this.batchNo); // Changed from log.debug to console.debug
    if (this.batchNo) {
        console.debug("CALLED GET INSURED"); // Changed from log.debug to console.debug
        this.getInsureds();
    }

    try {
        const data:any = await this.policyService.getPolicy(this.batchNo)
            .pipe(untilDestroyed(this))
            .toPromise();

        if (data && data.content && data.content.length > 0) {
            this.policyResponse = data;
            console.debug("Get Policy Endpoint Response", this.policyResponse); // Changed from log.debug to console.debug
            this.policyDetailsData = this.policyResponse.content[0];
            console.debug("Policy Details data get policy", this.policyDetailsData); // Changed from log.debug to console.debug

            this.riskDetails = this.policyDetailsData.riskInformation;
            // this.sectionsDetails = this.riskDetails[0].sections;

            this.cdr.detectChanges();
        } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage('Error', 'Something went wrong. Please try Again');
        }
    } catch (err) {
        this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
        console.info(`error >>>`, err); // Changed from log.info to console.info
    }
}

 
  getClient() {
    const clientRequests = [];

    for (const insured of this.insureds) {
      const prpCode = insured.prpCode; // Assuming each insured object has prpCode

      const clientRequest = this.clientService.getClientById(prpCode)
        .pipe(
          map((data: any) => {
            if (data) {
              return data; // Assuming only one client is expected
            } else {
              throw new Error(`Client details not found for prpCode: ${prpCode}`);
            }
          }),
          catchError(err => {
            console.error(`Error fetching client details for prpCode ${prpCode}:`, err);
            return of(null); // Return null or appropriate fallback value on error
          })
        );

      clientRequests.push(clientRequest);
    }

    // Use forkJoin to combine all requests into a single observable
    forkJoin(clientRequests)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (clients: any[]) => {
          console.log('All client details fetched:', clients);

          // Process the array of client details as needed
          // For example, assign it to a component property
          this.allClients = clients;
          log.debug('ALL CLIENTS', this.allClients)
          this.filteredClients = this.allClients;

          this.cdr.detectChanges(); // Trigger change detection if needed
        },
        error: (err) => {
          // Handle error fetching any client details
          console.error('Error fetching client details:', err);

          this.errorOccurred = true;
          this.errorMessage = 'Error fetching client details';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
        }
      });
  }
  onInsuredEditSave(insured) {
    log.debug("SELECTED CLIENT", insured)
    this.selectedInsured = insured

    function transformToDTO(data: any): PersonalDetailsUpdateDTO {
      return {
        accountId: data.id,
        dob: data.dateOfBirth,
        emailAddress: data.emailAddress,
        identityNumber: data.idNumber,
        // Assuming modeOfIdentityId is mapped from modeOfIdentity
        modeOfIdentityId: data.modeOfIdentity === "NATIONAL_ID" ? 1 : undefined,
        name: `${data.firstName} ${data.lastName}`,
        passportNo: data.passportNumber,
        phoneNumber: data.phoneNumber,
        physicalAddress: data.physicalAddress,
        pinNumber: data.pinNumber,
        titleShortDescription: data.shortDescription,
        // title: { /* Map to ClientTitleDTO if needed */ },
        category: data.category,
        modeOfIdentity: { /* Map to IdentityModeDTO if needed */ },
        // occupation: { /* Map to OccupationDTO if needed */ }
      };
    }

    // Transform the input data to DTO format
    const personalDetailsUpdateDTO = transformToDTO(this.selectedInsured);
    console.log("Transformed Data", personalDetailsUpdateDTO);
    this.clientService
      .updateClient(this.selectedInsured.id, this.selectedInsured)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {

          if (data) {
            log.debug("Client Edited", data)
            this.cdr.detectChanges();

          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  loadAllClients() {
    this.clientService
      .getClients(0, 100)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.clientList = data;
            log.debug("CLIENT DATA:", this.clientList)
            this.clientData = this.clientList.content
            log.debug("CLIENT DATA:", this.clientData)


          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  loadClientDetails(id) {
    log.info("Client Id:", id)
    this.clientService.getClientById(id).subscribe(data => {
      this.clientDetails = data;
      log.debug("Selected Client Details:", this.clientDetails)
      // this.allClients = this.allClients.concat(this.clientDetails);
      // this.filteredClients = this.allClients;

      // log.debug("Added Insured:", this.allClients)

      // this.getCountries();
      this.addInsured();
      this.saveclient()
      this.closebutton.nativeElement.click();
    })
  }
  saveclient() {
    this.clientCode = this.clientDetails.id;
    this.clientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    sessionStorage.setItem('clientCode', this.clientCode);
    log.debug("Client Code:", this.clientCode)
  }
  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  openDeleteModal() {
    log.debug("Selected insured", this.selectedInsured)
    if (!this.selectedInsured) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Insured to continue');
    } else {
      document.getElementById("openModalButtonDelete").click();

    }
  }

  // filterTable() {
  //   log.debug("SELECTED COLUMN:", this.selectedColumn);
  //   log.debug("SEARCH Query:", this.searchQuery);

  //   if (this.selectedColumn && this.searchQuery) {
  //     if (this.selectedColumn === 'name') {
  //       this.filteredClients = this.allClients.filter(client => {
  //         const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
  //         return (
  //           fullName.includes(this.searchQuery.toLowerCase()) ||
  //           client.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
  //           client.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
  //         );
  //       });
  //     } else {
  //       this.filteredClients = this.allClients.filter(client => {
  //         return client[this.selectedColumn]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
  //       });
  //     }
  //   } else {
  //     this.filteredClients = this.allClients;
  //   }
  // }

  filterTable() {
    log.debug("SELECTED COLUMN:", this.selectedColumn);
    log.debug("SEARCH Query:", this.searchQuery);

    if (this.selectedColumn && this.searchQuery) {
      if (this.selectedColumn === 'name') {
        this.filteredInsuredDetails = this.insuredDetails.filter(insured => {
          const fullName = `${insured.newInsured} ${insured.otherNames}`.toLowerCase();
          return (
            fullName.includes(this.searchQuery.toLowerCase()) ||
            insured.newInsured.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            insured.otherNames.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
      } else {
        this.filteredInsuredDetails = this.insuredDetails.filter(insured => {
          return insured[this.selectedColumn]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }
    } else {
      this.filteredInsuredDetails = this.insuredDetails;
    }
  }



  addAnotherRisk() {
    this.router.navigate([`/home/gis/policy/risk-details/`]);

  }
  applyFilterGlobalRisk($event, stringVal) {
    this.dt2.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  openRiskDeleteModal() {
    log.debug("Selected Risk", this.selectedRisk)
    if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
    } else {
      document.getElementById("openRiskModalButtonDelete").click();

    }
  }
  deleteRisk() {
    this.productCode = this.policyDetailsData.product.code
    log.debug('PRODUCT CODE:', this.productCode)
    this.riskCode = this.selectedRisk.riskIpuCode;
    log.debug('Risk CODE:', this.riskCode)

    this.policyService
      .deleteRisk(this.riskCode, this.batchNo, this.productCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {

            log.debug("Response Deleting Risk:", data);
            this.globalMessagingService.displaySuccessMessage('Success', '"Successfully  deleted risk"');
            // Remove the deleted risk from the riskDetails array
            const index = this.riskDetails.findIndex(risk => risk.riskIpuCode === this.riskCode);
            if (index !== -1) {
              this.riskDetails.splice(index, 1);
            }
            // Clear the selected risk
            this.selectedRisk = null;

          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  editRisk() {
    log.debug("SELECTED RISK", this.selectedRisk)
    const passedPolicyRiskString = JSON.stringify(this.selectedRisk);
    sessionStorage.setItem('passedRiskPolicyDetails', passedPolicyRiskString);
    this.router.navigate([`/home/gis/policy/risk-details/`]);

  }
  // EDIT SCHEDULE DETAILS FUNCTIONALITY 

  // This method Clears the Schedule Detail form by resetting the form model
  clearForm() {
    this.scheduleDetailsForm.reset();

  }

  updateSchedule() {
    const schedule = this.scheduleDetailsForm.value;
    schedule.riskCode = this.riskCode;
    schedule.transactionType = "Q";
    schedule.version = 0;
    this.quotationService.updateSchedule(schedule).subscribe(data => {
      this.updatedScheduleData = data;
      console.log('Updated Schedule Data:', this.updatedScheduleData);
      this.updatedSchedule = this.updatedScheduleData._embedded;
      console.log('Updated Schedule  nnnnn:', this.updatedSchedule);
      const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
      if (index !== -1) {
        this.scheduleList[index] = this.updatedSchedule;
        this.cdr.detectChanges();
      }

      try {

        this.scheduleDetailsForm.reset()
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
      } catch (error) {
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

        this.scheduleDetailsForm.reset()
      }
    })
    this.cdr.detectChanges();

  }
  createScheduleDetailsForm() {
    this.scheduleDetailsForm = this.fb.group({
      details: this.fb.group({
        level1: this.fb.group({
          bodyType: [''],
          yearOfManufacture: [''],
          color: [''],
          engineNumber: [''],
          cubicCapacity: [''],
          Make: [''],
          coverType: [''],
          registrationNumber: [''],
          chasisNumber: [''],
          tonnage: [''],
          carryCapacity: [''],
          logBook: [''],
          value: [''],
        }),
      }),
      riskCode: [''],
      transactionType: [''],
      version: [''],
    });
  }
  openRiskEditModal() {
    log.debug("Selected Risk", this.selectedSchedule)
    if (!this.selectedSchedule) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Schedule to continue');
    } else {
      document.getElementById("openRiskModalButtonEdit").click();

    }
  }
  addInsured() {
    this.policyNumber = this.policyDetailsData.policyNo;
    this.endorsementNo = this.policyDetailsData.endorsementNo;
    this.selectedClientCode = this.clientDetails.id;
    // this.policyService
    // .addInsured(this.batchNo, this.endorsementNo, this.policyNumber, this.selectedClientCode)
    // .pipe(untilDestroyed(this))
    // .subscribe({
    //   next: (data) => {

    //     if (data) {

    //       log.debug("Response Adding Insured:", data);
    //       this.globalMessagingService.displaySuccessMessage('Success', '"Successfully  Added Insured"');


    //     } else {
    //       this.errorOccurred = true;
    //       this.errorMessage = 'Something went wrong. Please try Again';
    //       this.globalMessagingService.displayErrorMessage(
    //         'Error',
    //         'Something went wrong. Please try Again'
    //       );
    //     }
    //   },
    //   error: (err) => {

    //     this.globalMessagingService.displayErrorMessage(
    //       'Error',
    //       this.errorMessage
    //     );
    //     log.info(`error >>>`, err);
    //   },
    // });
    this.policyService.addInsured(this.batchNo, this.endorsementNo, this.policyNumber, this.selectedClientCode).subscribe(data => {

      console.log('Added client Insured Data:', data);
      this.getInsureds()


      try {

        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully added Insured');
      } catch (error) {
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');


      }
    })
  }
  deleteInsured() {
    this.policyInsuredCode = this.selectedInsured.code;
    log.debug("INSURED CODE:", this.policyInsuredCode)
    this.policyService
      .deleteInsured(this.policyInsuredCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {

            log.debug("Response Deleting Insured:", data);
            this.globalMessagingService.displaySuccessMessage('Success', '"Successfully  deleted Insured"');
            // Remove the deleted Insured from the Insured Details array
            const index = this.insuredDetails.findIndex(insured => insured.code === this.policyInsuredCode);
            if (index !== -1) {
              this.insuredDetails.splice(index, 1);
            }
            // Clear the selected risk
            this.selectedInsured = null;

          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  toggleRiskClauseDetails() {
    this.isRiskClauseDetailsOpen = !this.isRiskClauseDetailsOpen;
  }
  toggleScheduleDetails() {
    this.isScheduleDetailOpen = !this.isScheduleDetailOpen;
  }
  toggleRiskDetails() {
    this.isRiskDetailsOpen = !this.isRiskDetailsOpen;
  }
  onSelectRiskClauses(event: any) {
    this.selectedRiskClause = event;
    // log.info("Patched Risk Section",this.selectedRiskClause);
    // this.selectedRiskClauseCode=this.selectedRiskClause.code;
    // log.debug("SELECTED RISK CLAUSE CODE:",this.selectedRiskClauseCode);
    // log.debug("SELECTED PRODUCT CODE:",this.selectProductCode);
    // log.debug("SELECTED RISK CODE:",this.riskCode);
    // log.debug("SELECTED Quote CODE:",this.quotationCode);

    // this.captureRiskClause();
  }
  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }
  onResize(event: any) {
    this.modalHeight = event.height;
  }
  // getInsureds() {
  //   this.policyService.getInsureds(this.batchNo).subscribe(data => {

  //     log.debug('Added client Insured Data:', data);
  //     if (data.status === 'SUCCESS') {
  //       this.insuredDetails = data._embedded[0];
  //       log.debug("INSURED DETAILS LIST:", this.insuredDetails)

  //     }


  //     try {

  //       // this.scheduleDetailsForm.reset()
  //       // this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
  //     } catch (error) {
  //       this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

  //     }
  //   })
  // }
  getInsureds() {
    this.policyService.getInsureds(this.batchNo).subscribe(data => {
      log.debug('Added client Insured Data:', data);
      if (data.status === 'SUCCESS') {
        this.insuredDetails = data._embedded[0];
        this.filteredInsuredDetails = this.insuredDetails; // Initialize filtered list
        log.debug("INSURED DETAILS LIST:", this.insuredDetails);
      }

      try {
        // Handle success
      } catch (error) {
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
      }
    });
  }
  editInsureds(data) {
    log.debug("Insured Data Edited", data)
    const payload = {
      clientCode: data.prpCode,
      idNo: data.idNo,
      passportNo: data.passPortNumber,
      pinNo: data.pinNo,
      // type: string
    };
    console.log(payload);
    this.policyService
      .editInsureds(payload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Insured details updated successfully');

          console.log('Success:', response);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to update Insured details.Try again later');
        }
      });
  }
//   togglePremiumDetails() {
//     console.log("selected risk", this.selectedRisk);
//     if (!this.selectedRisk) {
//       this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
//     } else {
//       this.SelectedRiskCode = this.selectedRisk.riskIpuCode;
//       const risk = this.riskDetails.filter(risk => risk.riskIpuCode === this.SelectedRiskCode);
//       log.debug('FILTERED RISK',risk)
//       this.sectionsDetails = risk[0].sections
//      log.debug("SELECTED RISK SECTION DETAILS", this.sectionsDetails);

//       this.isPremiumDetailOpen = !this.isPremiumDetailOpen; // Toggle collapse state
//     }
  
// }
togglePremiumDetails() {
  console.log("selected risk", this.selectedRisk);
  
  if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
      return; // Exit function early if selectedRisk is not defined
  }
  
  this.SelectedRiskCode = this.selectedRisk.riskIpuCode;
  const risk = this.riskDetails.find(risk => risk.riskIpuCode === this.SelectedRiskCode);
  
  if (!risk) {
      console.error('Risk not found for SelectedRiskCode:', this.SelectedRiskCode);
      return; // Exit function early if corresponding risk is not found
  }
  
  this.sectionsDetails = risk.sections;
  console.log("SELECTED RISK SECTION DETAILS", this.sectionsDetails);
  this.selectedSubclassCode = risk.subClassCode;
            log.debug("subclass code:", this.selectedSubclassCode)
            if (this.selectedSubclassCode) {
              this.loadSubclassSectionCovertype()
            }
            this.selectedCoverTypeDesc = risk.coverTypeShortDescription
            log.debug("subclass covertype:", this.selectedCoverTypeDesc)
            this.selectedCoverTypeCode = risk.coverTypeCode;
            this.selectedBindercode = risk.binderCode


  // Toggle collapse state only if both selectedRisk and corresponding risk are valid
  this.isPremiumDetailOpen = !this.isPremiumDetailOpen;
}



  
  
  getAllSection() {
    this.sectionService
      .getAllSections()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.sectionList = data;
            log.debug("Section List", this.sectionList)
            this.cdr.detectChanges();


          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  loadSubclassSectionCovertype() {
    this.subclassSectionCovertypeService
      .getSubclassCovertypeSections()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.subclassSectionCoverList = data;
            log.debug("Subclass Section Covertype:", this.subclassSectionCoverList);
            this.mandatorySections = this.subclassSectionCoverList.filter(section => section.subClassCode == this.selectedSubclassCode && section.isMandatory == "Y");
            log.debug("Mandatory Section Covertype:", this.mandatorySections);

            this.covertypeSections = this.subclassSectionCoverList?.filter(sectionCover => sectionCover.coverTypeCode === this.selectedCoverTypeCode )
            log.debug("All section for a selected Cover Type:", this.covertypeSections)

            if (this.sectionList && this.covertypeSections) {
              this.allMatchingSections = [];
              this.covertypeSections.forEach(element => {
                const matchingSections = this.sectionList.filter(section => section.code === element.sectionCode);
                this.allMatchingSections.push(...matchingSections);
              });
        
              log.debug("Retrieved All matching sections", this.allMatchingSections);
            }
           if(this.allMatchingSections){
            this.filterMandatorySections()
           } 
          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })

  }
  filterMandatorySections() {
    log.debug("selectedCover  coverdesc", this.selectedCoverTypeDesc)
    // const coverType = this.selectedCoverType?.coverTypeShortDescription
    if (this.selectedCoverTypeDesc) {
      // this.filteredMandatorySections = this.mandatorySections.filter(section =>
      //   section.coverTypeShortDescription === (this.selectedCoverTypeDesc === "COMP" ? "COMP" : this.selectedCoverTypeDesc));
      // log.debug("Filtered Section", this.filteredMandatorySections);

      // this.filteredAllMatchingSections = this.allMatchingSections.filter(section =>
      //   !this.filteredMandatorySections.some(filteredSection => filteredSection.sectionCode === section.code)
      // );
      this.filteredAllMatchingSections = this.allMatchingSections.filter(section =>
        !this.sectionsDetails.some(detail => detail.sectionCode === section.code)
      );
      console.log('Filtered Matching Sections:', this.filteredAllMatchingSections);

      // this.getPremium(this.filteredMandatorySections);
    } else {
      this.filteredMandatorySections = this.mandatorySections;
    }
  }

  matchesSearch(description: string): boolean {
    return description.toLowerCase().includes(this.searchText.toLowerCase());
  }
  
  isSelected(section: any): boolean {
    return this.selectedSections.some((s) => s.code === section.code);

  }
  onCheckboxChange(section: any) {
    const index = this.selectedSections.findIndex((s) => s.code === section.code);

    if (index === -1) {
      // Section is not yet selected, add it to the array
      this.selectedSections.push(section);
      log.debug("Checked Sections Data", this.selectedSections);
      this.allTransformedSections = [];

      // Filter sections based on the selected cover type
      this.selectedSections.forEach(element => {
        const changedSections = this.covertypeSections?.filter(section =>
          section.sectionCode === element.code &&
          section.coverTypeShortDescription === "COMP"
        );

        if (changedSections) {
          this.allTransformedSections.push(...changedSections);
          log.debug("Transformed Sections Data", this.allTransformedSections);
        } else {
          log.debug("No matching sections found for", element);
        }
      });

      this.getPremium(this.selectedSections);
      // this.createRiskSection();
    } else {
      // Section is already selected, remove it from the array
      this.selectedSections.splice(index, 1);
    }
  }
  getPremium(passedSections: any[]) {
    // this.selectedBinder = parseInt(selectedBinder);

    log.debug("Selected Binder:", this.selectedBindercode);
    log.debug("Selected Subclass code:", this.selectedSubclassCode);

    const sections = passedSections;
    log.debug("Sections passed to premium service:", sections);

    // Create an array to store observables returned by each service call
    const observables = sections?.map(section => {
      return this.premiumRateService.getAllPremiums(section.code, this.selectedBindercode, this.selectedSubclassCode);
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe((data: any[]) => {
      // data is an array containing the results of each service call
      const newPremiumList = data.flat(); // Flatten the array if needed
      log.debug("New Premium List", newPremiumList);

      // Check if premiumList is an array (safeguard against initialization issues)
      if (!Array.isArray(this.premiumList)) {
        this.premiumList = [];
      }

      // Append newPremiumList to existing premiumList
      this.premiumList = [...this.premiumList, ...newPremiumList];
      log.debug("Updated Premium List", this.premiumList);
    });
  }
  createSectionDetailsForm() {
    this.sectionDetailsForm = this.fb.group({
      bindCode: [''],
      coverTypeCode: [''],
      group: [''],
      limit: [''],
      ncdLevel: [''],
      renewal: [''],
      riskCode: [''],
      row: [''],
      sectionCode: [''],
      subClassCode: ['']
    });
  }
  createRiskSection() {
    const section = this.sectionDetailsForm.value;
    log.debug("Premium List:", this.premiumList);
    // Check if premiumList has data and if the index is within bounds
    if (this.premiumList.length > 0 && this.premiumListIndex < this.premiumList.length) {
      console.log(`Using sectionCode: ${this.premiumList[this.premiumListIndex].sectionCode} (Premium List Index: ${this.premiumListIndex})`);

      // Log the current premiumListIndex before incrementing
      console.log(`Current premiumListIndex before increment: ${this.premiumListIndex}`);

      // Increment the premiumListIndex and wrap around using modulo
      this.premiumListIndex = (this.premiumListIndex + 1) % this.premiumList.length;

      // Log the updated premiumListIndex after incrementing
      console.log(`Updated premiumListIndex after increment: ${this.premiumListIndex}`);

      section.sectionCode = this.premiumList[this.premiumListIndex].sectionCode;
    } else {
      // Handle scenario when premiumList is empty or index is out of bounds
      console.error('Premium list is empty or index is out of bounds.');
      return; // or throw an error, handle as per your requirement
    }

    // Set other properties for section
    this.sectionArray = [section];
    section.bindCode = this.selectedBindercode;
    section.coverTypeCode = this.selectedCoverTypeCode;
    section.group = 1;
    section.limit = 0;
    section.ncdLevel = null;
    section.renewal = null;
    section.riskCode = this.selectedRisk.riskIpuCode;
    section.row = 0;
    section.subClassCode = this.selectedSubclassCode;

    this.policyService
      .createRiskSection(this.sectionArray)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: async (data: any) => {
          if (data) {
            console.log("Risk Section Created data:", data);
            this.globalMessagingService.displaySuccessMessage('Success', 'Risk Section has been added');
        
            await this.getPolicy(); // Wait for getPolicy() to finish
        
            if (this.riskDetails) {
                const risk = this.riskDetails.find(risk => risk.riskIpuCode === this.SelectedRiskCode);
                const sections = risk.sections;
                this.sectionsDetails = sections;
                console.debug("SECTIONS:", this.sectionsDetails); // Changed from log.debug to console.debug
            }
        
        
        
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', 'An error occurred.');
          console.error(`Error >>>`, err);
        },
      });
  }
//   addPremiumItem(){

// }

getRiskClauses(){

  
  console.log("selected risk", this.selectedRisk);
  this.selectedSubclassCode = this.selectedRisk.subClassCode;
  console.log('SELECTED SUBCLASS CODE',this.selectedSubclassCode)
  
  if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
      return; // Exit function early if selectedRisk is not defined
  }
 
  
  this.SelectedRiskCode = this.selectedRisk.riskIpuCode;
  const risk = this.riskDetails.find(risk => risk.riskIpuCode === this.SelectedRiskCode);
  
  if (!risk) {
      console.error('Risk not found for SelectedRiskCode:', this.SelectedRiskCode);
      return; // Exit function early if corresponding risk is not found
  }
  this.subclassService.getSubclassClauses(this.selectedSubclassCode).subscribe(data =>{
    this.SubclauseList=data;
    // this.selectedSubClauseList=this.SubclauseList.filter(clause=>clause.subClassCode == code);
    // this.selectedClauseCode=this.selectedSubClauseList[0].clauseCode;

    log.debug('subclass ClauseList#####',this.SubclauseList)
    this.loadAllClauses()
  })

  // this.policyService.getRiskClauses(this.selectedRisk.riskIpuCode).subscribe({
  //   next:(res)=>{
  //     console.log(res)
  //   }
  // })
}
loadAllClauses() {
  // Extract clause codes from selectedSubClauseList
  const subClauseCodes = this.SubclauseList.map(subClause => subClause.clauseCode);
  log.debug('Retrived Clause Codes',subClauseCodes)

  // Check if there are any subClauseCodes before making the request
  if (subClauseCodes.length === 0) {
    // Handle the case when there are no subClauseCodes
    return;
  }

  // Make the request to get all clauses based on the subClauseCodes
  this.subclassService.getAllClauses().subscribe(data => {
    this.clauseList = data._embedded.clause_dto_list;

    // Filter clauseList based on subClauseCodes
    this.selectedClauseList = this.clauseList.filter(clause => subClauseCodes.includes(clause.code));
    sessionStorage.setItem("riskClauses",JSON.stringify(this.selectedClauseList))
    log.debug('All ClauseList', this.clauseList);
    log.debug('ClauseSelectdList', this.selectedClauseList);
  });
}
openPremiumDeleteModal() {
  log.debug("Selected PremiumItem", this.selectedPremiumItem)
  if (!this.selectedPremiumItem) {
    this.globalMessagingService.displayInfoMessage('Error', 'Select Premium item to continue');
  } else {
    document.getElementById("openModalPremiumButtonDelete").click();

  }
}

toggleRiskPerils(){
  this.riskPerils = !this.riskPerils
 
}


   
  toggleRequiredDocDetails() {
    this.isRequiredDocDetailOpen = !this.isRequiredDocDetailOpen;
  }
  getRequiredDocuments(){
    this.requiredDocumentService
      .getRequiredDoc()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {

            log.debug("Required document list:", data);
            this.filteredRequiredDocs= data.filter(doc => doc.isNewBusinessDocument === "Y");
            log.debug("New Business Documents",this.filteredRequiredDocs)
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  openRequiredDocDeleteModal() {
    log.debug("Selected Document", this.selectedDocument)
    if (!this.selectedDocument) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a document to continue');
    } else {
      document.getElementById("openRequiredDocModalButtonDelete").click();

    }
  }
  toggleCertificatesDetails() {
    this.isCertificatesDetailOpen = !this.isCertificatesDetailOpen;
  }
  openRequiredcertifcateDeleteModal() {
    log.debug("Selected Document", this.selectedCertificate)
    if (!this.selectedCertificate) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a certificate to continue');
    } else {
      document.getElementById("openCertificateModalButtonDelete").click();

    }
  }
  toggleRemarksDetails() {
    console.log("selected risk", this.selectedRisk);
  
    if (!this.selectedRisk) {
        this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
        return; // Exit function early if selectedRisk is not defined
    }
    
    this.SelectedRiskCode = this.selectedRisk.riskIpuCode;
    const risk = this.riskDetails.find(risk => risk.riskIpuCode === this.SelectedRiskCode);
    
    if (!risk) {
        console.error('Risk not found for SelectedRiskCode:', this.SelectedRiskCode);
        return; // Exit function early if corresponding risk is not found
    }
    
    
  
    // Toggle collapse state only if both selectedRisk and corresponding risk are valid
    this.isRemarkDetailsOpen = !this.isRemarkDetailsOpen;
  }
  createRemarkDetailsForm() {
    this.remarkDetailsForm = this.fb.group({
      action: [''],
      code: [],
      ipuCode: [],
      polBatchNo: [],
      schedule: [''],
    });
  }
  addRemark(){
 log.debug("rrisk code:", this.SelectedRiskCode)
    this.remarkDetailsForm.get('action').setValue("A");
    this.remarkDetailsForm.get('code').setValue(0);
    this.remarkDetailsForm.get('ipuCode').setValue(this.SelectedRiskCode);
    this.remarkDetailsForm.get('polBatchNo').setValue(this.batchNo);
       // Convert the value of 'schedule' to a number
    const scheduleText = this.remarkDetailsForm.get('schedule').value;
    log.debug("Schedules not converted to hash",scheduleText)

    
    
     const remarkForm = this.remarkDetailsForm.value;
     log.debug('Remark Form:', remarkForm);
    this.policyService
      .addRemarks(remarkForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: async (data: any) => {
          if (data) {
           log.debug(" Added Remark", data);
            this.globalMessagingService.displaySuccessMessage('Success', 'Remark has been added');
        
           
        
        
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', 'An error occurred.');
          console.error(`Error >>>`, err);
        },
      });
  }
  
  editRemark(data){
    log.debug("Insured Data Edited", data)
    this.remarkDetailsForm.get('action').setValue("A");
    this.remarkDetailsForm.get('code').setValue(0);
    this.remarkDetailsForm.get('ipuCode').setValue(this.SelectedRiskCode);
    this.remarkDetailsForm.get('polBatchNo').setValue(this.batchNo);
       // Convert the value of 'schedule' to a number
    const scheduleText = this.remarkDetailsForm.get('schedule').value;
    const updateRemarkForm = this.remarkDetailsForm.value;
    log.debug('Update Remark Form:', updateRemarkForm);   
       this.policyService
      .editRemarks(updateRemarkForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Remark details updated successfully');

          console.log('Success:', response);
        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to update Remark details.Try again later');
        }
      });
  }
  openRemarkDeleteModal() {
    log.debug("Selected remark", this.selectedRemark)
    if (!this.selectedRemark) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select remark to continue');
    } else {
      document.getElementById("openModalRemarkButtonDelete").click();

    }
  }
deleteRemark(){
  log.debug("Selected Remark", this.selectedRemark)
  this.action= "D"
  this.policyService
  .deleteRemarks(this.selectedRemark)
  .pipe(untilDestroyed(this))
  .subscribe({
    next: (data) => {

      if (data) {

        log.debug("Response Deleting Remark:", data);
        this.globalMessagingService.displaySuccessMessage('Success', '"Successfully  deleted Remark"');
        // Remove the deleted Insured from the Insured Details array
        const index = this.insuredDetails.findIndex(insured => insured.code === this.policyInsuredCode);
        if (index !== -1) {
          this.insuredDetails.splice(index, 1);
        }
        // Clear the selected risk
        this.selectedRemark = null;

      } else {
        this.errorOccurred = true;
        this.errorMessage = 'Something went wrong. Please try Again';
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Something went wrong. Please try Again'
        );
      }
    },
    error: (err) => {

      this.globalMessagingService.displayErrorMessage(
        'Error',
        this.errorMessage
      );
      log.info(`error >>>`, err);
    },
  });
}
deletePremiumItem(){
  log.debug("Selected premium item", this.selectedPremiumItem)
  this.premiumItemCode = this.selectedPremiumItem.sectCode;
  log.debug("Premium Item Section code", this.premiumItemCode)
  this.policyService
  .deletePremiumItem(this.batchNo,this.premiumItemCode )
  .pipe(untilDestroyed(this))
  .subscribe({
    next: (data) => {

      if (data) {

        log.debug("Response Deleting Remark:", data);
        this.globalMessagingService.displaySuccessMessage('Success', '"Successfully  deleted Premium Item"');
        // Remove the deleted Insured from the Insured Details array
        const index = this.sectionsDetails.findIndex(premiumItem => premiumItem.sectCode === this.premiumItemCode);
        if (index !== -1) {
          this.sectionsDetails.splice(index, 1);
        }
        // Clear the selected risk
        this.selectedRemark = null;

      } else {
        this.errorOccurred = true;
        this.errorMessage = 'Something went wrong. Please try Again';
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Something went wrong. Please try Again'
        );
      }
    },
    error: (err) => {

      this.globalMessagingService.displayErrorMessage(
        'Error',
        this.errorMessage
      );
      log.info(`error >>>`, err);
    },
  });
}
toggleRelatedRiskDetails() {
  this.isRelatedRiskDetailsOpen = !this.isRelatedRiskDetailsOpen;
}
// toggleCommissionTranscDetails() {
//   this.isCommissionTranscDetailsOpen = !this.isCommissionTranscDetailsOpen;
// }
toggleCommissionTranscDetails() {
  console.log("selected risk", this.selectedRisk);
  
  if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
      return; // Exit function early if selectedRisk is not defined
  }
  
  this.SelectedRiskCode = this.selectedRisk.riskIpuCode;
  const risk = this.riskDetails.find(risk => risk.riskIpuCode === this.SelectedRiskCode);
  
  if (!risk) {
      console.error('Risk not found for SelectedRiskCode:', this.SelectedRiskCode);
      return; // Exit function early if corresponding risk is not found
  }
  
  

  // Toggle collapse state only if both selectedRisk and corresponding risk are valid
  this.isCommissionTranscDetailsOpen = !this.isCommissionTranscDetailsOpen;
}

openCommissionTranscDeleteModal() {
  log.debug("Selected Commission Transaction", this.selectedTransaction)
  if (!this.selectedTransaction) {
    this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
  } else {
    document.getElementById("openCommissionModalButtonDelete").click();

  }
}

  getSubclassPerils(){
    this.policyService.getSubsclassPerils(this.selectedSubclassCode).subscribe({
      next:(res)=>{
        this.subperils = res
        this.subperils = this.subperils.content
        console.log(this.subperils)
        this.subperils.forEach(element => {
          this.perilService.getPeril(element.perilCode).subscribe({
            next:(res)=>{
              console.log(res)
            }
          })
       
        });
      }
    })
  }
  
getRiskPeril(){
  console.log("selected risk (Risk Peril)", this.selectedRisk);
  
  if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
      return; // Exit function early if selectedRisk is not defined
  }else{
    this.SelectedRiskCode = this.selectedRisk.riskIpuCode;

    const risk = this.riskDetails.find(risk => risk.riskIpuCode === this.SelectedRiskCode);
    if (!risk) {
      console.error('Risk not found for SelectedRiskCode:', this.SelectedRiskCode);
      return; // Exit function early if corresponding risk is not found
  }
    this.policyService.getRiskPerils().subscribe({
      next:(res)=>{
        this.subperils = res
        this.subperils = this.subperils._embedded
        console.log(this.batchNo)
        
          this.subperils.forEach(perilArray => {   
              perilArray.forEach(element => {
                // console.log(element.ipuCode, "perils");
                //  console.log(this.SelectedRiskCode)
                
                if(element.polBatchNo === 233471313){
                 
                  if(element.ipuCode === 20235954513){
                    this.policyRiskPeril.push(element)
                    this.subperils =element 
                    console.log(element,'risk perils')
                  }
                }
              });
            
          });
        
      }
    });
  }
  

   
    }
  }



