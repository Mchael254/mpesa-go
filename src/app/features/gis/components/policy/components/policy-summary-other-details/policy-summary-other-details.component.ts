import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import { PolicyService } from '../../services/policy.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Sidebar } from 'primeng/sidebar';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyContent, PolicyResponseDTO, RiskInformation } from '../../data/policy-dto';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { PersonalDetailsUpdateDTO } from 'src/app/features/entities/data/accountDTO';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuotationsService } from '../../../../components/quotation/services/quotations/quotations.service'

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
  selectedInsured: ClientDTO;
  selectedFollower: any;
  policyNumber: any;
  endorsementNo: any;
  selectedClientCode: any;

  filteredClients: any[] = [];
  columns: any[] = [
    { label: 'Name', value: 'firstName' },
    { label: 'Address', value: 'physicalAddress' },
    { label: 'Town', value: 'town' },
    { label: 'Pin', value: 'pinNumber' },
    { label: 'Passport no.', value: 'passportNumber' },
    { label: 'Business', value: 'business' },
    { label: 'Other interested parties', value: 'otherParties' },
    { label: 'ID no.', value: 'idNumber' }
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

  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;


  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;
  policyInsuredCode: number;
  




  constructor(
    public policyService: PolicyService,
    private globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    public productService: ProductService,
    private router: Router,
    public fb: FormBuilder,
    public quotationService: QuotationsService,



  ) { }
  ngOnInit(): void {
    this.getUtil();
    this.loadAllClients();
    this.createScheduleDetailsForm();

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

  getPolicy() {
    this.batchNo = this.policyDetails.batchNumber;
    log.debug("Batch No:", this.batchNo)
    this.policyService
      .getPolicy(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {

          if (data && data.content && data.content.length > 0) {
            this.policyResponse = data;
            log.debug("Get Policy Endpoint Response", this.policyResponse)
            this.policyDetailsData = this.policyResponse.content[0]
            log.debug("Policy Details data get policy", this.policyDetailsData)
            this.insureds = this.policyDetailsData.insureds
            log.debug("Insureds", this.insureds)
            if (this.insureds) {
              this.getClient()
            }
            this.riskDetails = this.policyDetailsData.riskInformation
            log.debug("RISK INFORMATION", this.riskDetails)

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
  getoClient() {
    for (const insured of this.insureds) {
      const clientRequests = [];
      const prpCode = insured.prpCode; // Assuming each insured object has prpCode
      log.debug("PRPCODE", prpCode)
      this.clientService
        .getClientById(prpCode)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (data: any) => {
            if (data) {
              log.debug('Client Details', data)
              this.clientDetails = data;

              // Process clientDetails as needed

              this.cdr.detectChanges(); // Trigger change detection if needed
            } else {
              // Handle case where client details are not found
              console.error(`Client details not found for prpCode: ${prpCode}`);
            }
          },
          error: (err) => {
            // Handle error fetching client details
            console.error(`Error fetching client details for prpCode ${prpCode}:`, err);
          },
        });
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
      this.allClients = this.allClients.concat(this.clientDetails);
      this.filteredClients = this.allClients;

      log.debug("Added Insured:", this.allClients)

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

  filterTable() {
    log.debug("SELECTED COLUMN:", this.selectedColumn);
    log.debug("SEARCH Query:", this.searchQuery);

    if (this.selectedColumn && this.searchQuery) {
      if (this.selectedColumn === 'name') {
        this.filteredClients = this.allClients.filter(client => {
          const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
          return (
            fullName.includes(this.searchQuery.toLowerCase()) ||
            client.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            client.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
      } else {
        this.filteredClients = this.allClients.filter(client => {
          return client[this.selectedColumn]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }
    } else {
      this.filteredClients = this.allClients;
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
  addInsured(){
    this.policyNumber= this.policyDetailsData.policyNo;
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
        
       
  
        try {
  
          this.scheduleDetailsForm.reset()
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
        } catch (error) {
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
  
          this.scheduleDetailsForm.reset()
        }
      })
  }
  deleteInsured(){
    this.policyInsuredCode = this.selectedInsured.id;

    this.policyService
    .deleteInsured(this.policyInsuredCode)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (data) => {

        if (data) {

          log.debug("Response Deleting Risk:", data);
          this.globalMessagingService.displaySuccessMessage('Success', '"Successfully  deleted Insured"');
            // Remove the deleted risk from the riskDetails array
        // const index = this.riskDetails.findIndex(risk => risk.riskIpuCode === this.riskCode);
        // if (index !== -1) {
        //   this.riskDetails.splice(index, 1);
        // }
        // // Clear the selected risk
        // this.selectedRisk = null;

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
}



