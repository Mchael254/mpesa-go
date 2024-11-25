import { Component, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, finalize, first, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { SessionStorageService } from "../../../../../../../shared/services/session-storage/session-storage.service";
import { ProductService } from "../../../../../service/product/product.service";
import { ToastService } from "../../../../../../../shared/services/toast/toast.service";
import { PayFrequencyService } from "../../../../../grp/components/quotation/service/pay-frequency/pay-frequency.service";
import { QuotationService } from "../../../../../service/quotation/quotation.service";
import { ClientService } from "../../../../../../entities/services/client/client.service";
import { Utils} from "../../../../../util/util";
import { StringManipulation } from "../../../../../util/string_manipulation";
import { SESSION_KEY } from "../../../../../util/session_storage_enum";
import { EscalationRateDTO } from '../../models/escalation-rate';
import { LeaderOptionDTO } from '../../models/leader-option';
import { CoinsurerOptionDTO } from '../../models/coinsurer-option';

/**
 * Component for displaying and editing product details in the quotation module.
 */
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
    {
      label: 'Client Details(Data Entry)',
      url: '/home/lms/ind/quotation/client-details',
    },
  ];
  steps = stepData;
  validationData: any[];
  productForm: FormGroup;
  productList: any[] = []; // List of products to choose from
  coverTypeList = signal([]); // Dynamic cover type list based on product selection
  productOptionList: any[]; // Options for the selected product
  isOptionReady: boolean;
  isTermReady: boolean;
  option_product_code: number = 0;
  productTermList = signal([]); // Term list that may be dependent on the product
  agentList: any[] = [];
  paymentOfFrequencyList: any[];
  util: any;
  web_quote: any = null;
  getQuotationSubscribe: Observable<any>;
  escalationRate: EscalationRateDTO[];
  leaderOption: LeaderOptionDTO[] = [];
  coinsurerOption: CoinsurerOptionDTO[] = [];
  pop_code: number = 2021415;
  endr_code: number = 2024642021;
  coverageOptionLabel: string = 'Coverage Option';  // Default label
  calculateFrom: string = '';  // Store the value of calculate_from
  isEscalationAllowed: boolean = false;

  escalationOption: { value: string, label: string }[] = [
    { value: 'PREMIUM ESCALATION', label: 'Premium Escalation' },
    { value: 'SUM ASSURED ESCALATION', label: 'Sum Assured Escalation' }
  ];

  constructor(
    private session_storage: SessionStorageService,
    private route: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private product_service: ProductService,
    private toast: ToastService,
    private Payment_freq_service: PayFrequencyService,
    private quotation_service: QuotationService,
    private crm_client_service: ClientService,
    private cdr: ChangeDetectorRef
  ) {
    this.util = new Utils(this.session_storage);

    this.productForm = this.fb.group ({
      escalation_question: [''],
      coinsurance_question: ['']
    });
  }

  get isEscalationYes(): boolean {
    return this.productForm.get('escalation_question').value === 'Y';
  }

  get isCoinsuranceYes(): boolean {
    return this.productForm.get('coinsurance_question').value === 'Y';
  }

  ngOnInit(): void {
    let quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );
    this.productForm = this.getproductForm();
    this.getPayFrequencies();
    this.getAgentList();
    this.getEscalationRate();
    this.getLeaderOption();
    this.getCoinsurerOption();
    console.log(quote);

    if (!quote) {
      this.getQuotationSubscribe = this.getProduct().pipe(
        concatMap((products) => {
          this.productList = [...products];
          return this.getTelQuote(); // Telephone-based quote if no existing quote
        }),
        finalize(() => this.spinner.hide('product_view'))
      );
    } else {
      this.getQuotationSubscribe = this.getProduct().pipe(
        concatMap((products) => {

          this.productList = [...products];
          return this.getWebQuote(); // Web-based quote if quote exists
        }),
        finalize(() => this.spinner.hide('product_view'))
      );
    }
    this.getQuotationSubscribe
    .pipe(concatMap((data: any)=>{
      // Check if agent code exists, fetch agent details if found
      if(data?.agent_code){
        return this.getAgentByCode(data?.agent_code).pipe(concatMap(agent_details =>{
          this.productForm.get('agent').patchValue(agent_details);

          return of(data);
        }))

      }
      this.toast.info('Agent is not defined', 'Product Selection'.toUpperCase())
      return of(data);

    }))
    .subscribe((final_quote) => {
      // Patch the form with the final quote data
      this.productForm.get('freq_payment').patchValue(final_quote['payment_frequency']);
      this.productForm.get('term').patchValue(final_quote['policy_term']);
      this.productForm.get('agent').patchValue(final_quote['agent_code']);

      if (quote?.sum_insured && quote?.sum_insured>0) {
        this.productForm.get('sa_prem_select').patchValue('SA'); 
        this.productForm.get('sa_prem_amount').patchValue(final_quote['sum_insured']);
      }else{
        this.productForm.get('sa_prem_select').patchValue('P'); 
      }
      this.toast.success('Fetch data successfully', 'Product Selection'.toUpperCase())
    },
    err =>{
      // Handle fetch failure
      this.toast.danger('Fail to fetch data successfully, try again!', 'Product Selection'.toUpperCase())

    });

  }

  /**
   * Fetches and processes a web quote from session storage.
   * Retrieves a web quote stored in session storage under the key `SESSION_KEY.WEB_QUOTE_DETAILS`.
   * If a valid quote exists:
   * - It fetches the web quote details from the server.
   * - Patches the retrieved data into the `productForm`.
   * - Triggers related logic for product and product option selection.
   * 
   * @returns {Observable<any | null>} An observable emitting the processed web quote or `null` if no quote is found in session storage.
   */
  getWebQuote() {
    // Retrieve the quote from session storage
    let quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );
    // If a valid quote exists
    if (quote) {
      return this.quotation_service
        .getLmsIndividualQuotationWebQuoteByCode(quote['code']) // Fetch web quote details by code
        .pipe(
          // Process the fetched web quote
          concatMap((web_quote: any) => {
            this.web_quote = web_quote; // Store the fetched web quote
            let product = web_quote['product_code']; // Extract the product code
            // Patch the web quote data into the form
            this.productForm.patchValue(web_quote);
            this.productForm.get('product').patchValue(product);

            // Trigger product selection logic
            this.selectProduct({ target: { value: product } });
            return of(web_quote);
          }),
          // Process the product option based on the web quote
          concatMap((web_quote) => {
            return this.product_service
              .getProductOptionByCode(web_quote['pop_code']) // Fetch product option details by code
              .pipe(
                concatMap((product_option) => {
                  let option = product_option['code']; // Extract the product option code

                  // Patch the product option into the form
                  this.productForm.get('option').patchValue(option);
                  
                  // Trigger product option selection logic
                  this.selectProductOption({
                    target: { value: product_option['code'] },
                  });

                  // Return the web quote for consistency
                  return of(web_quote);

                })
              );

          })
        );
    } else {
      // Return null if no quote is found in session storage
      return of(null);
    }
  }

  /**
   * Fetches and processes a telephone quote from session storage.
   * 
   * Retrieves a telephone quote stored in session storage under the key `SESSION_KEY.QUOTE_DETAILS`.
   * If a valid quote exists:
   * - It fetches the telephone quote details from the server.
   * - Patches the retrieved data into the `productForm`.
   * - Triggers related logic for product and product option selection.
   * 
   * @returns {Observable<any | null>} An observable emitting the processed telephone quote or `null` if no quote is found in session storage.
   */
  getTelQuote() {
    // Retrieve the quote from session storage
    let quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.QUOTE_DETAILS)
    );
    // If a valid quote exists
    if (quote) {
      return this.quotation_service
        .getLmsIndividualQuotationTelQuoteByCode(quote['tel_quote_code']) // Fetch telephone quote details by code
        .pipe(
          // Process the fetched telephone quote
          switchMap((tel_quote: any) => {
            // console.log(tel_quote);

            this.web_quote = tel_quote; // Store the fetched telephone quote
            let product = tel_quote['product_code']; // Extract the product code

            // Patch the telephone quote data into the form
            this.productForm.patchValue(tel_quote);
            this.productForm.get('product').patchValue(product);

            // Trigger product selection logic
            this.selectProduct({ target: { value: product } });
            return of(tel_quote);
          }),
          // Process the product option based on the telephone quote
          switchMap((tel_quote) => {
            this.product_service
              .getProductOptionByCode(tel_quote['pop_code']) // Fetch product option details by code
              .pipe(
                switchMap((data) => {
                  let option = data['code']; // Extract the product option code

                  // Patch the product option into the form
                  this.productForm.get('option').patchValue(option);

                  // Trigger product option selection logic
                  this.selectProductOption({ target: { value: data['code'] } });
                  return of(tel_quote);
                })
              );

            return of(tel_quote);
          })
        );
    } else {
      return of(null);
    }
  }

  /**
   * Fetches the list of agents from the CRM client service and processes the data.
   * Retrieves a list of agents and maps their details into a more readable format
   * The processed agent list is stored in the `agentList` property.
   */
  getAgentList() {
    this.crm_client_service.getAgents().subscribe((data) => {
      this.agentList = data['content']?.map((d) => {
        d['details'] = `${d?.name} - ${d?.emailAddress ? d?.emailAddress : ''}`; // Format agent details
        return d;
      });
    });
  }

  /**
   * Fetches agent details by their unique code.
   * @param {any} code - The unique identifier for the agent.
   * @returns {Observable<any>} An observable emitting the agent's details.
   */
  getAgentByCode(code: any) {
    return this.crm_client_service.getAgentById(code);
  }

  /**
   * Toggles the selection state of a specific cover type in the cover type list.
   * Modifies the `selected` property of the cover type object with the specified ID.
   * @param {any} cover - The cover type object containing the ID of the cover to be toggled.
   */
  coverTypeState(cover: any) {
    this.coverTypeList.mutate((data) => {
      return data.map((d) => {
        if (d['id'] === cover['id']) {
          d['selected'] = !cover['selected'];
        }
        return d;
      });
    });
  }

  /**
   * Fetches the list of payment frequencies and stores it in `paymentOfFrequencyList`.
   * Retrieves available payment frequencies and assigns the response to `paymentOfFrequencyList`.
   */
  getPayFrequencies() {
    this.Payment_freq_service.getPayFrequencies().subscribe((freqs: any) => {
      this.paymentOfFrequencyList = freqs;
    });
  }

  /**
   * Simulates the selection of a date while showing and hiding a spinner.
   * Triggers the spinner for a short duration to provide a loading indicator for the date selection process.
   */
  selectDate() {
    this.spinner.show('whole');
    this.spinner.hide('whole');
  }

  /**
   * Creates and returns a reactive form group for managing product-related data.
   * @returns {FormGroup} A reactive form group with predefined controls and validators.
   */
  getproductForm() {
    return this.fb.group({
      // Product-related fields
      product: ['', Validators.required], // Product selection (required)
      option: ['', Validators.required], // Product option selection (required)
      term: ['', Validators.required], // Product term selection (required)

      // Sum Assured / Premium selection
      sa_prem_select: ['', Validators.required], // Selection between Sum Assured or Premium
      sa_prem_amount: ['', [Validators.required, Validators.min(0)]], // Ensures non-negative values

      // Frequency of payment and agent
      freq_payment: ['', Validators.required], // Frequency of payment (required)
      agent: ['', Validators.required], // Agent details (required)

       // Proposal dates
      proposal_date: ['', Validators.required], // Proposal date (required)
      proposal_sign_date: ['', Validators.required], // Proposal sign date (required)
      
      // Escalation and coinsurance
      escalation_question: ['', Validators.required], // Escalation option question
    coinsurance_question: ['', Validators.required], // Coinsurance option question
    escalationOption: ['', Validators.required], // Escalation option (required if allowed)
    escalationRate: ['', Validators.required], // Escalation rate (required if allowed)
    leaderOption: ['', Validators.required], // Leader option (required)
    leaderShare: ['', Validators.required], // Leader share percentage (required)
    coinsurerShare: ['', Validators.required], // Coinsurer share percentage (required)

    // Dynamic array for cover types
    coverTypes: this.fb.array([])
    });
  }

  /**
   * Adds a new cover type to the 'coverTypes' FormArray.
   * Each cover type is represented by a form group with its name and selection status.
   * @param {any} coverType - The cover type object to be added to the form array.
   */
  addCoverType(coverType: any) {
    const control = this.fb.group({
      coverTypeName: [coverType.name, Validators.required], // Cover type name (required)
      selected: [false] // Checkbox for selection (default: false)
    });
    (this.productForm.get('coverTypes') as FormArray).push(control);
  }

  /**
   * Fetches the list of available products and displays a loading spinner during the process.
   * This method uses a service to retrieve the list of products and handles any loading states.
   * @returns {Observable<any>} An observable that emits the list of products.
   */
  getProduct() {
    this.spinner.show('product_view');
    return this.product_service.getListOfProduct();
  }

  /**
   * Handles the selection of a product and updates dependent fields and labels accordingly.
   * Fetches product options, updates escalation settings, and prepares cover types.
   * @param {any} event - The selection event containing the selected product's value.
   */
  selectProduct(event) {
    // this.quickQuoteSummary_ = { ...this.quickQuoteSummaryDefault };
    // this.productForm.get('option').setValue(-1);
    // this.productForm.get('term').setValue(-1);
    // this.productForm.get('sa_prem_amount').setValue(0);
    let productCode = +event.target.value; // Get the selected product code
    if (productCode > 0) {
      this.spinner.show('product_view');
      this.product_service
        .getListOfProductOptionByProductCode(productCode) // Fetch product options
        .pipe(
          finalize(() => {
            this.spinner.hide('product_view');
          })
        )
        .subscribe((productOptions) => {
          this.productOptionList = [...productOptions];
          this.isOptionReady = true;

          // Find the selected product from the product list
          let selectedProduct = this.productList.find((m) => m['code'] === productCode);
          this.calculateFrom = selectedProduct?.calculate_from || '';  // Capture the calculate_from value

          // Extract the calculate_from field
          let calculateFrom = selectedProduct?.calculate_from;

          // Set the label based on the calculate_from value
          if (calculateFrom === 'S') {
            this.coverageOptionLabel = 'Sum Assured';
          } else if (calculateFrom === 'P') {
            this.coverageOptionLabel = 'Premium';
          } else if (calculateFrom === 'B') {
            this.coverageOptionLabel = 'Coverage Option';
          } else  {
            this.coverageOptionLabel = 'Coverage Option';  
          }

          // Handle escalation visibility
        this.isEscalationAllowed = selectedProduct?.is_escalation_allowed || false;

        if (!this.isEscalationAllowed) {
          this.productForm.patchValue({
            escalationOption: '',
            escalationRate: '',
            escalation_question: null,
          });

          this.productForm.get('escalationOption')?.clearValidators();
          this.productForm.get('escalationRate')?.clearValidators();
        } else {
          this.productForm.get('escalationOption')?.setValidators([Validators.required]);
          this.productForm.get('escalationRate')?.setValidators([Validators.required]);
        }

        this.productForm.get('escalationOption')?.updateValueAndValidity();
        this.productForm.get('escalationRate')?.updateValueAndValidity();

          // Clear the cover type list (if needed)
          this.coverTypeList.set([]);
          this.cdr.markForCheck(); 
          this.spinner.hide('product_view');
        });
    } else {
      this.isOptionReady = false;
      this.isTermReady = false;
      this.spinner.hide('product_view');
      this.cdr.markForCheck();
    }
  }

/**
 * Handles the selection of a product option and updates dependent fields such as product terms and cover types.
 * This method: Fetches product terms, Retrieves cover types for the selected product code, Updates the UI by opening an accordion
 * if cover types are available
 * @param {any} pCode - The selection event containing the selected option's value.
 */
  selectProductOption(pCode: any) {
    let pPopItem = +pCode.target.value; // Parse the selected option value
    if (pPopItem > 0) {
      this.spinner.show('product_view');
      let age = 30; // Default age for calculations (replace with dynamic age if required)
      // new Date().getFullYear() -
      // new Date(this.productForm.get('date_of_birth').value).getFullYear();

      // Filter the selected option from the product options list
      let option;
      option = this.productOptionList.filter((m) => {
        return m['code'] === pPopItem;
      });

      this.option_product_code = option.length > 0 ? option[0]['prod_code'] : 0;
      
      // Fetch product terms and cover types
      this.product_service
        .getListOfProductTermByProductCode(
          this.option_product_code,
          pPopItem,
          age > 0 ? age : 0 // Ensure age is valid
        )
        .pipe(
          // Process product terms
          tap((data) => {
            let d = data['prod_terms']; 
            data['prod_terms'] = [...d]; // Clone the terms list
            this.productTermList.set(data); // Update the product term list
          }),
          first(), // Take the first emitted value
          mergeMap(() => {
            return this.product_service.getListOfProductCoverTypeByProductCode(
              this.option_product_code
            );
          }),

          finalize(() => {
            this.spinner.hide('product_view');
            this.isTermReady = true; // Mark terms as ready
          })
        )
        .subscribe(
          // Process fetched cover types
          (covers) => {
            this.coverTypeList.set(covers); // Update coverTypeList with fetched data

            // Automatically open accordion when cover types are available
            if (covers && covers.length > 0) {
            document.getElementById('flush-collapseOne')?.classList.add('show');
          }
          
            this.spinner.hide('product_view');
          },
          (err: any) => {
            this.spinner.hide('product_view');
            this.cdr.detectChanges();
          }
        );
    }
  }

  /**
   * Handles the selection of a product term.
   * Captures the selected product term value from the event and triggers change detection
   * @param {any} pCode - The event object containing the selected product term value.
   */
  selectProductTerm(pCode: any) {
    let pTermVal = +pCode.target.value; // Parse the selected term value
    this.cdr.detectChanges();
  }

  /**
   * Fetches the escalation rate for the currently selected product.
   * The escalation rate is retrieved using the product service and stored in the `escalationRate` property.
   */
  getEscalationRate() {
    this.product_service
      .getProductEscalationRate(this.pop_code).subscribe((data) => {
      this.escalationRate = data;
    })
  }
  
  /**
   * Fetches the leader option for the currently selected product.
   * The leader option is retrieved using the product service and stored in the `leaderOption` property.
   */
  getLeaderOption() {
    this.product_service.getProductLeaderOption(this.endr_code).subscribe((data) => {
      this.leaderOption = data;
    })
  }

  /**
   * Fetches the coinsurer option for the currently selected product.
   * The coinsurer option is retrieved using the product service and stored in the `coinsurerOption` property.
   */
  getCoinsurerOption() {
    this.product_service.getProductCoinsurerOption(this.endr_code).subscribe((data) => {
      this.coinsurerOption = data;
    })
  }

  /**
   * Retrieves validation data for a given form control name.
   * Searches through the `validationData` array for an object matching the specified name.
   * Returns the matching object or `null` if no match is found.
   * @param {string} name - The name of the form control to find validation data for.
   * @returns {any} The validation data object or `null` if not found.
   */
  getFormData(name: string) {
    const foundData = this.validationData.find((data) => data['name'] === name);
    return foundData !== undefined ? foundData : null;
  }

  /**
   * Checks if a form control is required or has a pattern error.
   * This method determines if a form control has a 'required' or 'pattern' error and whether the control has been touched.
   * @param {string} name - The name of the form control to check.
   * @returns {boolean} `true` if the control has a required or pattern error and has been touched; otherwise, `false`.
   */
  isRequired(name: string) {
    let control = this.productForm.get(name);
    return (
      (control.hasError('required') || control.hasError('pattern')) &&
      control.touched
    );
  }

  /**
   * Retrieves a specific value (default is 'prem').
   * Placeholder and returns an empty string by default.
   * @param {string} [name='prem'] - The name of the value to retrieve (default is 'prem').
   * @returns {string} An empty string (placeholder implementation).
   */
  getValue(name = 'prem') {
    return '';
  }
  
  selectClient(event: any) {
    // console.log('select client');
    // console.log(event?.value);
    // let val = this.clientForm.get('client');
    // this.productForm.patchValue(event?.value);
  }

  /**
   * Handles the navigation to the next page in the quotation process.
   * Performs multiple operations, including validating client code presence
   */
  nextPage() {
    // Validate the presence of a client code
    if (!this.util.getClientCode()) {
      this.toast.danger('ÍNCOMPLETE DATA', 'INCOMPLETE_DATA');
    }
    // Show loading spinner for the product view
    this.spinner.show('product_view');
    let quote = {}; // Initialize the quote object
    // let quote_details = StringManipulation.returnNullIfEmpty(
    //   this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    // );

    // Extract form values
    let formValue = this.productForm.value;

    // Validate the selection of either Premium or Sum Assured
    if(formValue['sa_prem_select']===null){
      this.toast.danger('select either PREMIUM or SUM ASSURED', 'PRODUCT DETAILS')
    }
    // Filter and map selected cover types
    let cover_list = this.coverTypeList()
      .filter((data) => data?.selected === true)
      .map((data) => data?.id);
    // Construct the quote object
    quote = {
      code: this.web_quote === null ? null : this.web_quote['code'],
      quote_no: this.util.getTelQuoteCode(),
      proposal_no: this.util.getProposalCode(),
      premium:
        formValue['sa_prem_select'] === 'P'
          ? formValue['sa_prem_amount']
          : null,
      sum_insured:
        formValue['sa_prem_select'] === 'SA'
          ? formValue['sa_prem_amount']
          : null,
      client_code: this.util.getClientCode(),
      client_type: 'C', // Client type
      policy_term: formValue['term'],
      product_code: formValue['product'],
      agent_code: formValue?.agent?.id | 0, // Default agent code to 0 if undefined
      payment_frequency: formValue['freq_payment'],
      pop_code: formValue['option'],
      quote_type: 'PR', // Quotation type
      quote_status: 'DR', // Draft status
      payout_frequency: 'D', // Default payout frequency
      payment_status: 'PENDING', // Default payment status
      life_cover: 'Y', // Default life cover
      auto_esc: 'Y', // Default auto escalation
      cover_type_codes: cover_list,
      created_at: new Date(), // Creation timestamp
      updated_at: new Date(), // Update timestamp
    };
    // Save the quotation through the quotation service
    this.quotation_service.saveWebQuote(quote).subscribe(
      (data) => {
        // Save the quotation details to session storage
        this.session_storage.set(SESSION_KEY.WEB_QUOTE_DETAILS, data);

        // Show success toast notification
        this.toast.success(
          'succesfully create/update quote',
          'QUOTATION CREATION/UPDATE'
        );
        // Navigate to the Beneficiaries and Dependents page
        this.route.navigate(['/home/lms/ind/quotation/beneficiaries-dependents'])
        this.spinner.hide('product_view');
      },
      (err) => {
        this.spinner.hide('product_view');
        this.toast.danger(err?.error?.errors[0], 'QUOTATION CREATION/UPDATE');
      }
    );
  }
}