import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';
import { MenuService } from '../../../../../base/services/menu.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import {Logger} from "../../../../../../shared/services";
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import { Sources } from '../../data/quotationsDTO';

const log = new Logger('QuotationSourcesComponent');

@Component({
  selector: 'app-quotation-sources',
  templateUrl: './quotation-sources.component.html',
  styleUrls: ['./quotation-sources.component.css']
})
export class QuotationSourcesComponent {
  @ViewChild('closebutton') closebutton;

  quotationSubMenuList: SidebarMenu[];
  sourcesForm: FormGroup;
  sources: Sources[];
  selectedSource: Sources;

  applicableModules = [
    { value: 'Q' , label: 'Quotation'},
    { value: 'U' , label: 'Underwriting'},
    { value: 'B' , label: 'Underwriting & Quotation' }
  ];

  constructor(
    private menuService: MenuService,
    private router: Router,
    public quotationService: QuotationsService,
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService


  ) {}

  ngOnInit() {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[6]);

    this.createSourcesForm();
    this.fetchSources();
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }

  createSourcesForm() {
    this.sourcesForm = this.fb.group({
      code: [0],
      description: ['', [Validators.required]],
      applicableModule: ['', [Validators.required]]

    });
  }

  addSources() {

    // Mark all fields as touched and validate the form
    this.sourcesForm.markAllAsTouched();
    this.sourcesForm.updateValueAndValidity();
    if (this.sourcesForm.invalid) {
      log.debug('Form is invalid, will not proceed');
      return;
    } else {
      log.debug("The valid form", this.sourcesForm);
    }
    Object.keys(this.sourcesForm.controls).forEach(control => {
      if (this.sourcesForm.get(control).invalid) {
        log.debug(`${control} is invalid`, this.sourcesForm.get(control).errors);
      }
    });

    // If form is valid, proceed
    log.debug('Form is valid, proceeding with premium computation...');

    // Extract only the form values
    const source = { ...this.sourcesForm.value};
    log.debug("quotationSource while adding source", source);

    this.closebutton.nativeElement.click();

    this.quotationService
      .addQuotationSources(source)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Source added successfully');

          log.debug("Response after adding source", response);
          this.fetchSources();

        },
        error: (error) => {
          log.debug("Error adding a source", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add source...Try again later');
        }
      }
    );
  }

  fetchSources() {
    this.quotationService
      .getAllQuotationSources()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          // this.globalMessagingService.displaySuccessMessage('Success', 'Sources fetched successfully');
          this.sources = response.content;
          log.debug("Response after fetching sources", this.sources);

        },
        error: (error) => {
          log.debug("Error fetching sources", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch sources...Try again later');
        }
      }
    );
  }

  // Function to get the label for a given applicableModule value
  getApplicableModuleLabel(value: string): string {
    const module = this.applicableModules.find(m => m.value === value);
    return module ? module.label : value; // Fallback to showing the value if not found
  }

  onSourceSelect(source: any): void {
    this.selectedSource = source;
    log.debug('Selected source item:', source);
  }

  openSourceDeleteModal() {
    log.debug("Selected Quotation source to delete", this.selectedSource)
    if (!this.selectedSource) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a quotation source to continue');
    } else {
      document.getElementById("openSourceDeleteButton").click();
    }
  }

  openSourceEditModal() {
    if(!this.selectedSource) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a quotation source to continue');
    } else {
      this.populateForm();
    }
  }

  sourceModalAction() {
    if(!this.selectedSource) {
      this.addSources();
    } else {
      this.editQuotationSource();
    }
  }

  deleteQuotationSource() {
    const code = this.selectedSource.code;
    log.debug("selected source item code", code);

    this.quotationService
      .deleteQuotationSource(code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug("Response after deleting an quotation source ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Quotation source deleted successfully');
          this.fetchSources();

        },
        error: (error) => {
          log.debug('Error deleteing a quotation source', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete the quotation source...Try again later');
        }
      }
    );
  }

  // Function to populate form fields with the provided object data
  populateForm(): void {
    this.sourcesForm.patchValue({
      code: this.selectedSource.code,
      description: this.selectedSource.description,
      applicableModule: this.selectedSource.applicableModule
    });
  }

  editQuotationSource() {

    // Mark all fields as touched and validate the form
    this.sourcesForm.markAllAsTouched();
    this.sourcesForm.updateValueAndValidity();
    if (this.sourcesForm.invalid) {
      log.debug('Form is invalid, will not proceed');
      return;
    } else {
      log.debug("The valid form", this.sourcesForm);
    }
    Object.keys(this.sourcesForm.controls).forEach(control => {
      if (this.sourcesForm.get(control).invalid) {
        log.debug(`${control} is invalid`, this.sourcesForm.get(control).errors);
      }
    });

    // If form is valid, proceed
    log.debug('Form is valid, proceeding with premium computation...');

    // Extract only the form values
    const source = { ...this.sourcesForm.value};
    log.debug("quotationSource", source);

    this.closebutton.nativeElement.click();

    this.quotationService
      .editQuotationSource(source)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Source edited successfully');

          log.debug("Response after editing source", response);
          this.fetchSources();
          this.selectedSource = null;

        },
        error: (error) => {
          log.debug("Error editing a source", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to edit source...Try again later');
        }
      }
    );
  }

  clearForm() {
    // Reset the form to its initial state
    this.sourcesForm.reset();


  }

  ngOnDestroy() {  }

}
