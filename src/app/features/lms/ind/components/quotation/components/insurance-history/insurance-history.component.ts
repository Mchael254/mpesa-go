import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import stepData from '../../data/steps.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import { Util } from 'leaflet';
import { AutoUnsubscribe } from "../../../../../../../shared/services/AutoUnsubscribe";
import { BreadCrumbItem } from "../../../../../../../shared/data/common/BreadCrumbItem";
import { Utils } from "../../../../../util/util";
import { ClientHistoryService } from "../../../../../service/client-history/client-history.service";
import { SessionStorageService } from "../../../../../../../shared/services/session-storage/session-storage.service";

/**
 * Component for displaying and editing insurance history details in the quotation module.
 */
@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css'],
})

@AutoUnsubscribe

export class InsuranceHistoryComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard', },
    { label: 'Quotation', url: '/home/lms/quotation/list', },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history',
    },
  ];
  steps = stepData;
  products = [];
  insuranceHistoryForm: FormGroup;
  insuranceHistoryFormOne: FormGroup;
  insuranceHistoryFormTwo: FormGroup;
  policyListOne: any[] = [];
  policyListTwo: any[] = [];
  editEntity: boolean;
  coverStatusTypeList: any[] = [];
  coverStatusTypeListOne: any[] = [];
  coverStatusTypeListTwo: any[] = [];
  util: Utils;
  editFirstForm: boolean;
  showModal: boolean = false; // Tracks modal visibility
  showPolicyTwoModal: boolean = false; // Tracks if the modal is visible
  editingPolicy: boolean = false; // Determines if modal is for editing
  editingPolicyTwo: boolean = false; // Tracks if editing mode is active
  editingIndex: number | null = null; // Index of policy being edited
  editingIndexTwo: number | null = null; // Tracks the index being edited in policyListTwo

  constructor(
    private fb: FormBuilder, // For creating and managing reactive forms
    private client_history_service: ClientHistoryService, // Service to handle insurance history-related API calls
    private session_storage: SessionStorageService, // Service to manage session storage
    private spinner_service: NgxSpinnerService, // Service to display loading spinners
    private toast: ToastService // Service to show toast notifications
  ) {
    // Utility instance for accessing session-related utilities
    this.util = new Utils(this.session_storage)

    // Main form to manage responses to the "question1" and "question2" fields
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N', Validators.required], // Initial value: 'N', required field
      responseOne: [], // Placeholder for policies related to "question1"
      question2: ['N', Validators.required], // Initial value: 'N', required field
      responseTwo: [], // Placeholder for policies related to "question2"
    });

    // Form groups for detailed insurance data input
    this.insuranceHistoryFormOne = this.createInsuranceHistoryFormFormGroup();
    this.insuranceHistoryFormTwo = this.createInsuranceHistoryFormFormGroup();
  }

  ngOnInit(): void {
    // Fetch all cover status types to populate dropdown options in the forms
    this.getAllCoverStatusTypes(); 
    // Fetch the client's insurance history data and populate the table
    this.getLmsInsHistList(); 
  }

  /**
   * Creates a form group for capturing insurance policy details.
   * Each field includes validations to ensure data integrity.
   */
  createInsuranceHistoryFormFormGroup() {
    return this.fb.group({
      code: [], // Optional: Unique identifier for the policy (not required for form validation)
      policy_no: ['', Validators.required], // Required: The unique policy number for the insurance record.
      provider: ['', Validators.required], // Required: The insurance provider's name.
      premium: ['', [Validators.required, Validators.min(0)]], // Required: The annual premium amount. Must be a non-negative number
      sum_assured: ['', [Validators.required, Validators.min(0)]], // Required: The sum assured amount for the policy. Must be a non-negative number.
      cover_status: ['', Validators.required], // Required: The current status of the insurance cover (e.g., active, expired).
    });
  }

  /**
   * Getter for accessing the 'responseOne' form array from the main insurance history form.
   * This allows dynamic manipulation of the array, such as adding, removing, or updating entries.
   * 
   * @returns {FormArray} - The 'responseOne' form array, which holds the insurance policy data related to 'question1'.
   */
  get responseOneControls() {
    return this.insuranceHistoryForm.get('responseOne') as FormArray;
  }

  /**
   * Adds or updates an insurance policy entry in response to 'question1'.
   * Validates the policy data before saving and updates the policy list upon success.
   * 
   * @param {any} x - The index of the policy being added or updated in the `policyListOne` array.
   */
  addResponseOne(x: any) {
    this.spinner_service.show('ins_view');

    // Retrieve the policy data at the specified index
    let pol_data = this.policyListOne.filter((data, i) => {
      return i === x;
    })[0];

    // Get the values from the insurance form
    let data  = this.insuranceHistoryFormOne.value;
    console.log(data);

    // Validation: Ensure a cover status is selected
    if (!data?.cover_status || data['cover_status'] === '') {
      this.toast.danger('Select cover status', 'Insurance history'.toUpperCase());
      this.spinner_service.hide('ins_view');
      return;
    }

    // Validation: Ensure the premium does not exceed the sum assured
    if (data['premium'] > data['sum_assured']) {
      this.toast.danger(
        'The Premium amount exceeds the sum assured', 
        'Insurance history'.toUpperCase()
      )
      this.spinner_service.hide('ins_view');
      return;
    }

    // Prepare the data and call the save API
    this.saveInsuranceHistory({
      ...pol_data, // Existing policy data (if any)
      ...this.insuranceHistoryFormOne.value, // Form data
    })
    .pipe(
      // Hide the spinner when the operation is complete
      finalize(() =>  this.spinner_service.hide('ins_view')
    ))
    .subscribe(
      (pol_sub_data) => {
        // Update the policy list upon successful save
        this.editFirstForm = false;
        this.policyListOne = this.policyListOne.map((data, i) => {
          if (i === x) {
            // let temp = this.insuranceHistoryFormOne.value;
            let temp = pol_sub_data['data']; // Use the saved policy data from the response
            temp['isEdit'] = false; // Mark as non-editable
            return temp;
          }
          return data;
        });
        this.spinner_service.hide('ins_view');

        // Reset the form and show success notification
        this.insuranceHistoryFormOne.reset();
        this.toast.success('Save Data Successfully', 'Insurance history'.toUpperCase());
      },
      err => {
        // Show error notification in case of failure
        this.toast.danger('Failed to save Data Successfully', 'Insurance history'.toUpperCase());
      }
    );
  }

  /**
   * Adds or updates an insurance policy entry in response to 'question2'.
   * Validates the policy data before saving and updates the policy list upon success.
   * 
   * @param {any} x - The index of the policy being added or updated in the `policyListTwo` array.
   */
  addResponseTwo(x: any) {
    this.spinner_service.show('ins_view');

    // Retrieve the policy data at the specified index
    let pol_data = this.policyListTwo.filter((data, i) => {
      return i === x;
    })[0];

    // Get the values from the insurance form
    let data = {...this.insuranceHistoryFormTwo.value};
    console.log(data);

    // Validation: Ensure a cover status is selected
    if (!data?.cover_status || data['cover_status']==='') {
      this.toast.danger('Select cover status', 'Insurance history'.toUpperCase());
      this.spinner_service.hide('ins_view');
      return;
    }

    // Validation: Ensure the premium does not exceed the sum assured
    if (data['premium'] > data['sum_assured']) {
      this.toast.danger(
        'The Premium amount exceeds the sum assured', 
        'Insurance history'.toUpperCase()
      )
      this.spinner_service.hide('ins_view');
      return;
    }

    // Prepare the data and call the save API
    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormTwo.value,
    })
    .pipe(
      finalize(() => this.spinner_service.hide('ins_view')
    ))
    .subscribe(
      (pol_sub_data) => {
        // Update the policy list upon successful save
        this.editFirstForm = false;
        this.policyListTwo = this.policyListTwo.map((data, i) => {
          console.log(pol_sub_data);

          if (i === x) {
            let temp = pol_sub_data['data'];
            temp['isEdit'] = false;
            return temp;
          }
          return data;
        });
        
        this.spinner_service.hide('ins_view');
        this.insuranceHistoryFormTwo.reset();
        this.toast.success('Save Data Successfully', 'Insurance history'.toUpperCase());
      },
      err => {
        this.toast.danger('Failed to save Data Successfully', 'Insurance history'.toUpperCase());
      }
    );
  }

  /**
   * Enables edit mode for a specific insurance policy in `policyListOne` and populates the form with the policy's data.
   * 
   * @param {number} x - The index of the policy in the `policyListOne` array to be edited.
   */
  editPolicyOne(x) {
    this.editFirstForm = true;

    // Filter the policy list to find the policy at the given index
    let pol = this.policyListOne
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });
      // Ensure the policy is updated in the `policyListOne` array
      this.policyListOne.indexOf(pol, x);

      // Populate the form with the selected policy's data
      this.insuranceHistoryFormOne.patchValue(pol.length > 0 ? pol[0] : {});
  }

  /**
   * Creates a reactive form group for an individual insurance policy.
   * This form group is used to manage policy data dynamically in a table or modal.
   * 
   * @param {any} item - An object containing the initial values for the policy fields.
   * @returns {FormGroup} - A reactive form group configured with the provided values and validations.
   */
  createPolicyFormGroup(item): FormGroup {
    return this.fb.group({
      policyNo: [item.policyNo, Validators.required], // Required: The policy number, unique identifier for the insurance policy.
      insuranceCompany: [item.insuranceCompany, Validators.required], // Required: The name of the insurance provider.
      annualPremium: [item.annualPremium], // Optional: The annual premium amount for the policy.
      sumAssured: [item.sumAssured], // Optional: The sum assured amount for the policy.
      status: [item.status], // Optional: The current status of the insurance policy (e.g., active, expired).
      isEdit: [false], // This property tracks whether the policy is in edit mode
    });
  }

  /**
   * Prepares the form and opens the modal for adding a new policy in `policyListOne`.
   * Resets the form and ensures no existing policy is being edited.
   */
  addEmptyPolicyList(): void {
    //this.editFirstForm = true;
    this.editingPolicy = false; // Indicates this is a new policy, not an edit.
    this.editingIndex = null; // No index is being edited
    this.insuranceHistoryFormOne.reset(); // Resets the form to clear any previous data.
    this.showModal = true; // Displays the modal for policy input.
  }

  /**
   * Prepares the form and opens the modal for adding a new policy in `policyListTwo`.
   * Resets the form and ensures no existing policy is being edited.
   */
  openAddPolicyTwoModal() {
    this.editingPolicyTwo = false;
    this.editingIndexTwo = null;
    this.insuranceHistoryFormTwo.reset();
    this.showPolicyTwoModal = true; 
  }

  /**
   * Closes the modal for `policyListOne` without saving changes.
   */
  closePolicyModal(): void {
    this.showModal = false; // Hides the modal.
  }

  /**
   * Closes the modal for `policyListTwo` without saving changes.
   */
  closePolicyModalTwo(): void {
    this.showPolicyTwoModal = false; // Hides the modal.
  }

  /**
   * Saves the policy data from `insuranceHistoryFormOne` to `policyListOne`.
   * Handles both adding new policies and editing existing ones.
   */
  savePolicy() {
    // Validate the form; show an error toast if invalid
    if (this.insuranceHistoryFormOne.invalid) {
      this.toast.danger('Please fill all required fields.', 'Policy Details');
      return;
    }

    // Extract the form values
    const policyData = this.insuranceHistoryFormOne.value;

    if (this.editingPolicy && this.editingIndex !== null) {
      // Update existing policy
      this.policyListOne[this.editingIndex] = { ...policyData, isEdit: false };
    } else {
      // Add a new policy
      this.policyListOne.push({ ...policyData, isEdit: false });
    }

    this.closePolicyModal(); // Close the modal after saving
  }

  /**
   * Saves the policy data from `insuranceHistoryFormTwo` to `policyListTwo`.
   * Handles both adding new policies and editing existing ones.
   */
  savePolicyTwo(): void {
    if (this.insuranceHistoryFormTwo.invalid) {
      this.toast.danger('Please fill all required fields.', 'Policy Details');
      return;
    }

    const policyData = this.insuranceHistoryFormTwo.value;

    if (this.editingPolicyTwo && this.editingIndexTwo !== null) {
      // Update an existing policy
      const updatedList = [...this.policyListTwo]; // Clone the list for immutability
      updatedList[this.editingIndexTwo] = { ...policyData, isEdit: false };
      this.policyListTwo = updatedList;
    } else {
      // Add a new policy
      this.policyListTwo = [...this.policyListTwo, { ...policyData, isEdit: false }];
    }

    this.closePolicyModalTwo();
  }

  /**
   * Retrieves the value of a specified control from the `insuranceHistoryForm`.
   * 
   * @param name - The name of the form control. Defaults to 'question1'.
   * @returns The value of the specified form control.
   */
  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }

  /**
   * Deletes a policy from `policyListOne` by its index and calls the backend service to remove it.
   * 
   * @param i - The index of the policy to delete in the `policyListOne` array.
   * 
   * @remarks
   * - This method displays a spinner (`ins_view`) during the deletion process.
   * - It identifies the policy to delete using the provided index and retrieves its `code`.
   * - The `deleteInsuranceHistory` method of the `client_history_service` is invoked to delete the policy from the backend.
   */
  deletePolicyListOne(i: number) {
    this.spinner_service.show('ins_view');

    const deleted_pol = this.policyListOne[i];
    console.log('Policy to delete:', deleted_pol);

    if (!deleted_pol || !deleted_pol['code']) {
      console.error('Invalid policy or missing code at index:', i);
      this.spinner_service.hide('ins_view');
      this.toast.danger('Policy not found or invalid.', 'INSURANCE HISTORY');
      return;
    }

    this.client_history_service.deleteInsuranceHistory(deleted_pol['code'])
    .pipe(finalize(() => this.spinner_service.hide('ins_view')))
    .subscribe(
      () => {
        console.log('Deletion successful for policy:', deleted_pol);
        this.policyListOne = [...this.policyListOne.filter((_, x) => i !== x)];
        this.toast.success('Delete Data Successfully', 'INSURANCE HISTORY');
      },
      err => {
        console.error('Deletion failed:', err);
        this.toast.danger('Failed to Delete Data', 'INSURANCE HISTORY');
      }
    );
  }

  /**
   * Cancels edit mode for all policies in `policyListOne` and filters out entries without a valid `code`.
   * 
   * @param {number} i - The index of the policy in `policyListOne` (unused but required for consistency).
   */
  cancelPolicyListOne(i: number) {
    this.policyListOne = this.policyListOne
    .map((data, x) => {
      data['isEdit'] = false
      return data;
    })
    .filter(data => { return data?.code }); // Retain only policies with valid `code`
    this.editFirstForm = true; // Reset the form state
  }

  /**
   * Deletes a policy from `policyListTwo` and updates the list upon successful deletion.
   * 
   * @param {number} i - The index of the policy in `policyListTwo` to delete.
   */
  deletepolicyListTwo(i: number) {
    this.spinner_service.show('ins_view');
    
    // Find the policy to delete using the provided index
    let deleted_pol = this.policyListTwo.find((data, x) => { 
      return i === x 
    });

    // Call API to delete the policy
    this.client_history_service.deleteInsuranceHistory(deleted_pol['code'])
      .pipe(finalize(() => this.spinner_service.hide('ins_view')))
      .subscribe(
        data => {
          // Remove the deleted policy from the list
          this.policyListTwo = this.policyListTwo.filter((data, x) => {
            return i !== x;
          });
          this.toast.success('Delete Data Successfully', 'Insurance history'.toUpperCase())
          this.spinner_service.hide('ins_view')
        },
        err => {
          this.toast.danger('Failed to Delete Data', 'Insurance history'.toUpperCase())
        }
      )
  }

  /**
   * Cancels edit mode for all policies in `policyListTwo` and filters out entries without a valid `code`.
   * 
   * @param {number} i - The index of the policy in `policyListTwo` (unused but required for consistency).
   */
  cancelPolicyListTwo(i: number) {
    this.policyListTwo = this.policyListTwo.map((data, x) => {
      data['isEdit'] = false; // Reset edit mode for each policy
      return data;
    }).filter(data => { return data?.code}); // Retain only policies with valid `code`
    this.editFirstForm = true; // Reset the form state
  }

  /**
   * Enables edit mode for a specific policy in `policyListTwo` and populates the form with the policy's data.
   * 
   * @param {number} x - The index of the policy in `policyListTwo` to be edited.
   */
  editPolicyTwo(x) {
    // Find the policy at the specified index and set it to edit mode
    let pol = this.policyListTwo
      .filter((data, i) => {
        return i === x; // Match the policy at index `x`
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true; // Mark the policy as editable
        return temp;
      });

      // Update the list with the edited policy
      this.policyListTwo.indexOf(pol, x);

      // Populate the form with the policy data or reset it if no match is found
      this.insuranceHistoryFormTwo.patchValue(pol.length > 0 ? pol[0] : {});
  }

  /**
   * Opens the modal for editing a specific policy in `policyListOne`.
   * Populates the form with the policy's data.
   * 
   * @param {number} index - The index of the policy in `policyListOne` to be edited.
   */
  openEditPolicyModalOne(index: number): void {
    //this.showModal = true; // Show the modal
    this.editingPolicy = true; // Indicates that an existing policy is being edited
    this.editingIndex = index; // Store the index of the policy being edited
    
    const policy = this.policyListOne[index]; // Retrieve the selected policy
    this.insuranceHistoryFormOne.patchValue(policy); // Populate the form with the policy's data
    this.showModal = true;
  }

  /**
   * Opens the modal for editing a specific policy in `policyListTwo`.
   * Populates the form with the policy's data.
   * 
   * @param {number} index - The index of the policy in `policyListTwo` to be edited.
   */
  openEditPolicyModalTwo (index: number): void {
    this.editingPolicyTwo = true;
    this.editingIndexTwo = index;

    const policy = this.policyListTwo[index];
    this.insuranceHistoryFormTwo.patchValue(policy);
    this.showPolicyTwoModal = true;
  }

  /**
   * Fetches the insurance history data for the client and categorizes policies into `policyListOne` and `policyListTwo`.
   * Updates the form and displays a success toast upon successful data retrieval.
   */
  getLmsInsHistList() {
    this.spinner_service.show('ins_view');
    // let clientCode = this.session_storage.get(SESSION_KEY.CLIENT_CODE);

    // Fetch the insurance history using the client code
    this.client_history_service
      .getLmsInsHistList(this.util.getClientCode())
      .pipe(finalize(() => this.spinner_service.hide('ins_view')))
      .subscribe((data: any) => {
        if (data['data']!==null) {
          // Process policies for `policyListOne`
          this.policyListOne = data['data']
            .map((data_one: any) => {
              data_one['isEdit'] = false; // Mark policies as non-editable by default
              return data_one;
            })
            .filter((data_filter: any) => {
              return ['A', 'S', 'PU', 'L'].includes(data_filter['cover_status']); // Include only relevant statuses
            });
            
            // Set form value if `policyListOne` has entries
            if (this.policyListOne.length > 0)
            this.insuranceHistoryForm.get('question1').setValue('Y');

            this.policyListTwo = data['data']
              .map((data_two) => {
                data_two['isEdit'] = false;
                return data_two;
              })
              .filter((data_two_filter) => {
                return ['w', 'D', 'W', 'V', 'J'].includes(data_two_filter['cover_status']); // Include only relevant statuses
              });

              // Set form value if `policyListTwo` has entries
              if (this.policyListTwo.length > 0) 
                this.insuranceHistoryForm.get('question2').setValue('Y');
                this.toast.success(data['message'], 'Insurance History')
        }

        this.spinner_service.hide('ins_view');
      });
  }

  /**
   * Fetches all available insurance cover status types and categorizes them into lists for policies.
   */
  getAllCoverStatusTypes() {
    this.client_history_service
      .getAllCoverStatusTypes()
      .subscribe((data: any[]) => {
        this.coverStatusTypeList = [...data]; // Store all status types

        // Filter statuses for `policyListOne`
        this.coverStatusTypeListOne = this.coverStatusTypeList.filter(data => {
          if(data['name']==='A' ||data['name']==='S'||data['name']==='L'||data['name']==='PU'){
            return data
          }
        })

        // Filter statuses for `policyListTwo`
        this.coverStatusTypeListTwo = this.coverStatusTypeList.filter(data => {
          if(data['name']==='J' ||data['name']==='V'||data['name']==='W'){
            return data
          }
        })
      });
  }

  /**
   * Filters and retrieves the display value for a specific cover status.
   * 
   * @param {string} s - The status name to filter.
   * @returns {string[]} - The matching status display value(s).
   */
  filterCoverStatusType(s: string) {
    return this.coverStatusTypeList
      .filter((data) => data['name'] === s) // Match the status by name
      .map((data) => data['value']); // Return the display value for the matching status
  }

  /**
   * Saves insurance history data by preparing the payload and invoking the appropriate service method.
   * Filters out unnecessary fields like `code` before sending the request.
   * 
   * @param {any} data - The insurance history data to be saved.
   * @returns {Observable<any>} - An observable returned by the save service method.
   */
  saveInsuranceHistory(data: any) {
    const ins = { ...data }; // Clone the input data
    ins['clnt_code'] = this.util.getClientCode(); // Add client code to the payload
    ins['prp_code'] = null; // Set proposal code to `null`

    // Filter out unnecessary fields (like `code`)
    const { code, ...filteredData } = ins;

    console.log('Final Payload:', filteredData); // Log the filtered data
    return this.client_history_service.saveInsuranceHistory(filteredData);
  }

  /**
   * Deletes an insurance history entry based on a hardcoded `insCode`.
   * (Currently a placeholder implementation.)
   */
  deleteInsuranceHistory() {
    let insCode = 0;  // Placeholder insurance code for deletion
    this.client_history_service
      .deleteInsuranceHistory(insCode)
      .subscribe((data) => {
        console.log(insCode);
      });
  }

  /**
   * Clears all policies from the `policyListOne` array by invoking `deletePolicyListOne` for each item.
   * @remarks
   * - This method checks if `policyListOne` contains any elements before iterating.
   * - Each policy is removed through the `deletePolicyListOne` method, which handles the deletion process.
   */
  selectFirstQuestion() {
    if (this.policyListOne.length > 0 ) {
      this.policyListOne.forEach((m, i)=>{
        this.deletePolicyListOne(i)
      });
    }
  }

  /**
   * Clears all policies from the `policyListTwo` array by invoking `deletepolicyListTwo` for each item.
   * @remarks
   * - This method checks if `policyListTwo` contains any elements before iterating.
   * - Each policy is removed through the `deletepolicyListTwo` method, which handles the deletion process.
   */
  selectSecondQuestion(){
    if(this.policyListTwo.length>0) {
      this.policyListTwo.forEach((m, i) => {
        this.deletepolicyListTwo(i)
      });
    }
  }

  // private addEntity(d: FormGroup) {
  //   this.editEntity = true;
  //   this.responseOneControls.push({ isEdit: true });
  //   this.editEntity = false;
  //   return this.responseOneControls;
  // };
  // private deleteEntity(d: any[], i) {
  //   this.editEntity = true;
  //      d = d.filter((data, x) => {
  //       return i !== x;
  //     });
  //     this.editEntity = false
  //     return d;
  // };
  // private returnLowerCase(data: any) {
  //   let mapData = data.map((da) => {
  //     da['name'] = da['name'].toLowerCase();
  //     return da;
  //   });
  //   return mapData;
  // }

  /**
   * Lifecycle hook invoked when the component is destroyed.
   * Used for cleanup or debugging.
   */
  ngOnDestroy(): void {
    console.log('InsuranceHistoryComponent UNSUBSCRIBE');
  }
}