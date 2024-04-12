import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Products, introducers } from '../../../setups/data/gisDTO';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { QuotationsService } from '../../../quotation/services/quotations/quotations.service';
import { IntermediaryService } from '../.../../../../../../entities/services/intermediary/intermediary.service';
import { Observable } from 'rxjs';
import { AgentDTO } from '../../../../../entities/data/AgentDTO';
import { IntroducersService } from '../../../setups/services/introducers/introducers.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { ContractNamesService } from '../../services/contract-names/contract-names.service';
import { PolicyService } from '../../services/policy.service';
import { Router } from '@angular/router';

const log = new Logger("PolicyProductComponent");

@Component({
  selector: 'app-policy-product',
  templateUrl: './policy-product.component.html',
  styleUrls: ['./policy-product.component.css']
})
export class PolicyProductComponent {

  clientData: ClientDTO[];
  clientDetails: ClientDTO;
  clientType: any;
  clientList: any;
  clientName: any;
  clientCode: any;

  jointAccountData: ClientDTO[] = [];
  jointAccountCode: any;
  jointAccountName: any;
  jointAccountDetails: ClientDTO;

  productList: Products[];
  ProductDescriptionArray: any = [];
  selectedProduct: Products[];
  selectedProductCode: any;

  policyProductForm: FormGroup;
  policyForm: FormGroup;
  errorMessage: string;
  errorOccurred: boolean;

  showIntermediaryFields: boolean = false;
  showFacultativeFields: boolean = false;

  branchList: OrganizationBranchDto[];
  user: any;
  userDetails: any
  userBranchId: any;
  userBranchName: any;
  selectedBranchCode: any;
  selectedBranchDescription: any;

  sourceList: any;
  sourceDetail: any;
  selectedSourceCode: any;
  selectedSource: any;

  agentList: AgentDTO[];
  selectedAgentCode: any;
  selectedAgentDesc: any;
  marketerList: any;
  selectedMarketerCode: any;

  introducersList: introducers[];
  selectedIntroducer: any;
  introducerCode: any;
  introducerName: any;
  currency: any;

  contractNamesList: any;
  contractDetails: any;
  binderType: any;

  policyDetails:any;
  policyResponse:any;

  selectedTransactionType:any;

  enableSelect: boolean = false;
  show: boolean = true;
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @ViewChild('dt3') dt3: Table | undefined;


  @ViewChild('clientModal') clientModal: any;
  @ViewChild('introducersModal') introducersModal: any;
  @ViewChild('jointAccountModal') jointAccountModal: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonIntroducers') closebuttonIntroducers;
  @ViewChild('closebuttonJointAccount') closebuttonJointAccount;


  constructor(
    public fb: FormBuilder,
    private clientService: ClientService,
    public productService: ProductsService,
    public branchService: BranchService,
    public authService: AuthService,
    public quotationService: QuotationsService,
    private intermediaryService: IntermediaryService,
    private introducerService: IntroducersService,
    private currencyService: CurrencyService,
    private contractNamesService: ContractNamesService,
    private policyService:PolicyService,
    public globalMessagingService: GlobalMessagingService,
    private router: Router,
    public cdr: ChangeDetectorRef,


  ) { }

  ngOnInit(): void {

    this.selectedTransactionType = sessionStorage.getItem('selectedTransactionType');
    log.debug("Passed Transaction type:", this.selectedTransactionType);
    this.loadAllClients();
    this.createPolicyProductForm();
    this.loadAllproducts();
    // this.fetchBranches();
    this.getCurrencies()
    this.getuser();
    this.loadPolicySources();
    this.getMarketers(0, 1000, "createdDate");
    this.getIntroducers();

  }
  ngOnDestroy(): void { }
  ngAfterViewInit(): void {
    // Disable the select element after the view has been initialized
    this.toggleJointAccountSelect(false);
    this.toggleContractSelect(false);

  }
  
  createPolicyProductForm() {
    this.policyProductForm = this.fb.group({
      action_type: [''],
      add_edit: [''],
      agent_code: [null],
      agent_short_description: [''],
      batch_number: [0],
      bdiv_code: [0],
      bind_code: [0],
      branch_code: [0, Validators.required],
      branch_short_description: [''],
      client_code: [0, Validators.required],
      client_type: [''],
      coin_leader_combined: [''],
      coinsurance_facultative_cession: [''],
      comments: [''],
      cons_code: [''],
      currency_code: [0],
      currency_symbol: [''],
      fequency_of_payment: [''],
      internal_comments: [''],
      introducer_code: [0],
      is_admin_fee_allowed: [''],
      is_binder_policy: [''],
      is_cashback_applicable: [''],
      is_coinsurance: [''],
      is_commission_allowed: [''],
      is_exchange_rate_fixed: [''],
      is_open_cover: [''],
      payment_mode: [''],
      pro_interface_type: ['', Validators.required],
      product_code: [0, Validators.required],
      source: [''],
      transaction_type: ['', Validators.required],
      with_effective_from_date: [''],
      with_effective_to_date: [''],

      cover_days: [''],
      currency_rate: [''],

    });

  }
  get f() {
    return this.policyProductForm.controls;
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

  /**
  * - Get A specific client's details on select.
  * - populate the relevant fields with the client details.
  * - Retrieves and logs client type and country.
  * - Invokes 'getCountries()' to fetch countries data.
  * - Calls 'saveClient()' and closes the modal.
  * @method loadClientDetails
  * @param {number} id - ID of the client to load.
  * @return {void}
  */
  loadClientDetails(id) {
    log.info("Client Id:", id)
    this.clientService.getClientById(id).subscribe(data => {
      this.clientDetails = data;
      log.debug("Selected Client Details:", this.clientDetails)
      // this.getCountries();
      this.saveclient()
      this.closebutton.nativeElement.click();
      this.updateJointAccountData();
    })
  }
  /**
   * Saves essential client details for further processing.
   * - Assigns client ID, name, email, and phone from 'clientDetails'.
   * @method saveClient
   * @return {void}
   */
  saveclient() {
    this.clientCode = this.clientDetails.id;
    this.clientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    sessionStorage.setItem('clientCode', this.clientCode);
    log.debug("Client Code:", this.clientCode)
  }
  /**
   * Applies a global filter to a DataTable.
   * - Retrieves the input value from the event target.
   * - Calls the DataTable's 'filterGlobal' method with the input value and a specified string value.
   * @method applyFilterGlobal
   * @param {Event} $event - The event triggering the filter application.
   * @param {string} stringVal - The specified string value for filtering.
   * @return {void}
   */
  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  loadAllproducts() {
    const productDescription = [];
    const modifiedArray = [];
    this.productService
      .getAllProducts()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.productList = data;
            log.info(this.productList, "this is a product list")
            this.productList.forEach(product => {
              // Access each product inside the callback function
              let capitalizedDescription = product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase();
              productDescription.push({
                code: product.code,
                description: capitalizedDescription
              });
            });

            // Combine the characters back into words
            const combinedWords = productDescription.join(',');
            this.ProductDescriptionArray.push(...productDescription)

            // Now 'combinedWords' contains the result with words instead of individual characters
            log.info("modified product description", this.ProductDescriptionArray);

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
  /**
  * Handles the selection of a product.
  * - Retrieves the selected product code from the event.
  * - Fetches and loads product subclasses.
  * - Loads dynamic form fields based on the selected product.
  * @method onProductSelected
  * @param {any} event - The event triggered by product selection.
  * @return {void}
  */
  onProductSelected(selectedValue: any) {
    this.selectedProductCode = selectedValue.code;
    log.debug("Selected Product Code:", this.selectedProductCode);
  }
  onPolicyInterfaceTypeChange(value: string): void {
    log.info('SELECTED VALUE:', value)

    this.showIntermediaryFields = value === 'N';
    this.showFacultativeFields = value === 'F';


    if (!this.showIntermediaryFields) {
      this.policyProductForm.get('agent_code').reset();
      // this.policyProductForm.get('underwritersOnly').reset(false);
      this.policyProductForm.get('is_commission_allowed').reset();
      this.policyProductForm.get('is_admin_fee_allowed').reset();
    }

    if (!this.showFacultativeFields) {
      this.policyProductForm.get('agent_code').reset();
      // this.policyProductForm.get('selectRiAgent').reset();
      // this.policyProductForm.get('underwritersOnlyFacultative').reset(false);
      this.policyProductForm.get('is_commission_allowed').reset();
      this.policyProductForm.get('is_admin_fee_allowed').reset();
      // ... reset other fields for facultative business
    }
  }
  getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails?.branchId;
    log.debug("Branch Id", this.userBranchId);
    this.fetchBranches();

  }
  fetchBranches(organizationId?: number, regionId?: number) {
    this.branchService
      .getAllBranches(organizationId, regionId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.branchList = data;
            log.info('Fetched Branches', this.branchList);
            const branch = this.branchList.filter(branch => branch.id == this.userBranchId)
            log.debug("branch", branch);
            this.userBranchName = branch[0]?.name;
            log.debug("branch name", this.userBranchName);
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
  onBranchSelected(selectedValue: any) {
    this.selectedBranchCode = selectedValue;
    const selectedBranch = this.branchList.find(branch => branch.id === selectedValue);
    if (selectedBranch) {
      console.log("Selected Branch Data:", selectedBranch);

      const selectedBranchCode = selectedBranch.id;
      const selectedBranchName = selectedBranch.name;

      console.log("Selected Agent Code:", selectedBranchCode);
      console.log("Selected Agent Name:", selectedBranchName);
      this.selectedBranchCode = selectedBranchCode;
      this.selectedBranchDescription = selectedBranchCode;

    } else {
      console.log("Branch not found in agentList");
    }


  }

  loadPolicySources() {
    this.quotationService
      .getAllQuotationSources()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.sourceList = data;
            this.sourceDetail = data.content;
            log.debug(this.sourceDetail, "Source list")
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
  onSourceSelected(event: any) {
    this.selectedSourceCode = event.target.value;
    log.debug("Selected Source Code:", this.selectedSourceCode);
    this.selectedSource = this.sourceDetail.filter(source => source.code == this.selectedSourceCode);
    log.debug("Selected Source :", this.selectedSource);

  }
  getMarketers(pageIndex: number,
    pageSize: number,
    sortField: any = 'createdDate',
    sortOrder: string = 'desc') {
    this.intermediaryService
      .getAgents(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.agentList = data.content;
            log.debug("Agent list", this.agentList)
            this.marketerList = this.agentList.filter(agent => agent.accountTypeId == 10)
            log.debug("Marketer list", this.marketerList)

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
  onMarketerSelected(selectedValue: any) {
    this.selectedMarketerCode = selectedValue.id;
    log.debug("Selected Marketer Code:", this.selectedMarketerCode);
  }
  onAgentSelected(selectedValue: any) {
    log.debug("Selected Agent Code:", selectedValue);

    const selectedAgent = this.agentList.find(agent => agent.id === selectedValue);

    if (selectedAgent) {
      console.log("Selected Agent Data:", selectedAgent);

      const selectedAgentCode = selectedAgent.id;
      const selectedAgentName = selectedAgent.name;

      console.log("Selected Agent Code:", selectedAgentCode);
      console.log("Selected Agent Name:", selectedAgentName);
      this.selectedAgentCode = selectedAgentCode;
      this.selectedAgentDesc = selectedAgentName;

      this.getContractNames();
    } else {
      console.log("Agent not found in agentList");
    }
  }
  getIntroducers() {
    this.introducerService
      .getAllIntroducers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.introducersList = data;
            log.debug("Introducers  list", this.introducersList)


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
  applyIntroducersFilterGlobal($event, stringVal) {
    this.dt2.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  loadIntroducerDetails(code) {
    log.info("Introducer Code:", code);
    this.selectedIntroducer = this.introducersList.filter(introducer => introducer.code == code);
    if (this.selectedIntroducer.length > 0) {
      this.saveIntroducer();
      this.closebuttonIntroducers.nativeElement.click();
    } else {
      log.error("No introducer found with code:", code);
    }


  }
  saveIntroducer() {
    this.introducerCode = this.selectedIntroducer[0].code;
    log.debug("Introducer Code:", this.introducerCode);

    this.introducerName = this.selectedIntroducer[0].surName;
    log.debug("Introducer Name:", this.introducerName);
  }

  toggleContractSelect(contractChecked: boolean) {
    log.info("I HAVE BEEN CALLED")
    const selectContractElement = document.getElementById('contractNameInput') as HTMLSelectElement;
    selectContractElement.disabled = !contractChecked;
  }
  toggleJointAccountSelect(checked: boolean) {
    log.info("JOINT ACCOUNT HAS BEEN CALLED")

    const selectElement = document.getElementById('jointAccountInput') as HTMLSelectElement;
    selectElement.disabled = !checked;
  }
  applyJointAccountFilterGlobal($event, stringVal) {
    this.dt3.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  updateJointAccountData() {
    if (this.clientCode !== null) {
      this.jointAccountData = this.clientData.filter(client => client.id !== this.clientCode);
      log.debug("Joint Account Client", this.jointAccountData)
    } else {
      this.jointAccountData = [];
    }
  }
  loadJointAccountDetails(id) {
    log.info("Joint Account Id:", id)
    this.clientService.getClientById(id).subscribe(data => {
      this.jointAccountDetails = data;
      log.debug("Selected Joint Account Details:", this.jointAccountDetails)
      this.saveJointAccount()
      this.closebuttonJointAccount.nativeElement.click();
    })
  }
  saveJointAccount() {
    this.jointAccountCode = this.jointAccountDetails.id;
    log.debug("JOINT ACCOUNT NO:", this.jointAccountCode)
    this.jointAccountName = this.jointAccountDetails.firstName + ' ' + this.jointAccountDetails.lastName;
    log.debug("JOINT ACCOUNT NAME:", this.jointAccountName)
  }
  getCurrencies() {
    this.currencyService.getAllCurrencies().subscribe({
      next: (res => {
        this.currency = res
        console.log("Currency", res)
      })
    })
  }
  updateCoverTo(): void {

    const fromDate = new Date(this.policyProductForm.get('with_effective_from_date').value);
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() + 365);
    this.policyProductForm.controls['with_effective_to_date'].setValue(this.formatDate(toDate));
    this.updateCoverDays();
  }

  updateCoverDays(): void {
    const fromDate = new Date(this.policyProductForm.get('with_effective_from_date').value);
    const toDate = new Date(this.policyProductForm.get('with_effective_to_date').value);
    const differenceInTime = toDate.getTime() - fromDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    this.policyProductForm.controls['cover_days'].setValue(differenceInDays);
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  getContractNames() {
    this.binderType = "M"
    this.contractNamesService
      .getContractNames(this.selectedAgentCode, this.binderType, this.selectedProductCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {

          if (data) {
            this.contractNamesList = data;
            log.debug("Contract Name  list", this.contractNamesList)
            this.contractDetails = this.contractNamesList.embedded[0]
            log.debug("Contract Name details", this.contractDetails)

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
  onContractSelected(event: any) {
    //   this.selectedSourceCode = event.target.value;
    //  log.debug("Selected Binder Code:", this.selectedSourceCode);
    //   this.selectedSource = this.sourceDetail.filter(source => source.code == this.selectedSourceCode);
    //   log.debug("Selected Source :", this.selectedSource);

  }
  createPolicy() {
    this.policyProductForm.get('action_type').setValue("A");
    this.policyProductForm.get('add_edit').setValue("A");
    this.policyProductForm.get('client_code').setValue(this.clientCode);
    this.policyProductForm.get('agent_short_description').setValue(this.selectedAgentDesc);
    this.policyProductForm.get('branch_code').setValue(this.selectedBranchCode);
    this.policyProductForm.get('branch_short_description').setValue(this.selectedBranchDescription);

    // Transform the checkbox value to 'Y' or 'N' based on whether it's checked
    const isCoinsuranceChecked = this.policyProductForm.get('is_coinsurance').value ? 'Y' : 'N';
    this.policyProductForm.get('is_coinsurance').setValue(isCoinsuranceChecked);

    const isAdminFeeAllowedChecked = this.policyProductForm.get('is_admin_fee_allowed').value ? 'Y' : 'N';
    this.policyProductForm.get('is_admin_fee_allowed').setValue(isAdminFeeAllowedChecked);
    const isCashApplicableChecked = this.policyProductForm.get('is_cashback_applicable').value ? 'Y' : 'N';
    this.policyProductForm.get('is_cashback_applicable').setValue(isCashApplicableChecked);
    log.debug("Is coinsuaranace Checked:", isCoinsuranceChecked)
    log.debug("IsAdmin Fee Checked:", isAdminFeeAllowedChecked)
    log.debug("Is Cash Applicable Checked:", isCashApplicableChecked)
       // Transform the transaction type based on the selected value
   let transactionTypeValue = '';
   switch (this.selectedTransactionType) {
       case 'new-business':
           transactionTypeValue = 'NB';
           break;
       case 'endorsement':
           transactionTypeValue = 'ED';
           break;
           case 'contra-transaction':
           transactionTypeValue = 'CT';
           break;
       // Add more cases for other transaction types as needed
       default:
           // Handle any other case or set a default value if necessary
           break;
   }
   this.policyProductForm.get('transaction_type').setValue(transactionTypeValue);


    log.debug("MY FORM", JSON.stringify(this.policyProductForm.value))
    const policyForm = this.policyProductForm.value;
    this.policyService
    .createPolicy(policyForm,this.user)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (data) => {

        if (data) {
          this.policyResponse = data;
          log.debug("Create Policy Endpoint Response", this.policyResponse)
          this.policyDetails = this.policyResponse.embedded[0]
          log.debug("Policy Details", this.policyDetails)
          this.globalMessagingService.displaySuccessMessage('Success', 'Policy has been created' );

          const passedPolicyDetailsString = JSON.stringify(this.policyDetails);
          sessionStorage.setItem('passedPolicyDetails', passedPolicyDetailsString);
          this.router.navigate(['/home/gis/policy/risk-details']);

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
  
}
