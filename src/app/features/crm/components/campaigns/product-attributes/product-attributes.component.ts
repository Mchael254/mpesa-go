import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {
  AggregatedProduct,
  ClientAttributesDTO,
  ProductAttributesDTO,
  ProductClientAttributesDTO
} from "../../../data/campaignsDTO";
import {CampaignsService} from "../../../services/campaigns..service";
import {NgxSpinnerService} from "ngx-spinner";
import {Logger} from "../../../../../shared/services";
import {ProductsService} from "../../../../gis/components/setups/services/products/products.service";
import {ProductService as LmsProductService} from "../../../../lms/service/product/product.service";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {take} from "rxjs";
import {map} from "rxjs/internal/operators/map";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {Table} from "primeng/table";

const log = new Logger('ProductAttributesComponent');
@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.css']
})
export class ProductAttributesComponent implements OnInit{
  productAttributesData: ProductAttributesDTO[];
  selectedProductAttributes: ProductAttributesDTO;
  productClientAttributesData: any;
  selectedProductClientAttributes: any;

  clientAttributesData: ClientAttributesDTO[] = [];
  pageSize: 5;

  editMode: boolean = false;

  createProductClientAttributesForm: FormGroup;
  createProductAttributesForm: FormGroup;

  visibleStatus: any = {
    selectAttribute: 'Y',
    productAttributeCheck: 'Y',
    minValue: 'Y',
    maxValue: 'Y',
  //
    sysName: 'Y',
    productName: 'Y',
    shortDescription: 'Y',
    description: 'Y',
    narration: 'Y'
  }
  groupIdProductAttributes: string = 'campaignProductAttributesTab';

  productList: AggregatedProduct[] = [];
  systems: SystemsDto[];
  selectedSystem: any;

  @ViewChild('productAttributesTable') productAttributesTable: Table;
  @ViewChild('productClientAttributesTable') productClientAttributesTable: Table;
  selectedClientAttribute: ClientAttributesDTO;
  // selectedClientAttribute$: Observable<ClientAttributesDTO>;

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private campaignsService: CampaignsService,
    private spinner: NgxSpinnerService,
    private gisProductService: ProductsService,
    private lmsProductService: LmsProductService,
    private systemsService: SystemsService,
  ) {}

  ngOnInit(): void {
    this.campaignProductClientAttrCreateForm();
    this.campaignProductAttributesCreateForm();
    this.fetchAllSystems();
    this.fetchClientAttributes();
    this.fetchProductAttributes();
  }

  /**
   * The function `campaignProductAttrCreateForm` creates a form with specific attributes and sets
   * validators based on mandatory fields retrieved from an API response.
   */
  campaignProductClientAttrCreateForm() {
    this.createProductClientAttributesForm = this.fb.group({
      selectAttribute: [''],
      productAttributeCheck: [''],
      minValue: [''],
      maxValue: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdProductAttributes).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createProductClientAttributesForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createProductClientAttributesForm.controls[key].addValidators(Validators.required);
                this.createProductClientAttributesForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * The function `campaignProductCreateForm` creates a form with specific fields, sets validators for
   * mandatory fields based on response data, and updates the form accordingly.
   */
  campaignProductAttributesCreateForm() {
    this.createProductAttributesForm = this.fb.group({
      sysName: [''],
      productName: [''],
      shortDescription: [''],
      description: [''],
      narration: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdProductAttributes).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createProductAttributesForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createProductAttributesForm.controls[key].addValidators(Validators.required);
                this.createProductAttributesForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * The function returns the controls of a form for creating product attributes.
   * @returns The `get f()` function is returning the controls of the `createProductAttributesForm`
   * form group.
   */
  get f() {
    return this.createProductClientAttributesForm.controls;
  }

  /**
   * The function returns the controls of a createProductForm in TypeScript.
   * @returns The `g()` function is returning the controls of the `createProductForm` form group.
   */
  get g() {
    return this.createProductAttributesForm.controls;
  }

  /**
   * The function `openDefineProductModal` displays a modal with the id 'campaignClientProduct' by
   * adding the 'show' class and setting the display style to 'block'.
   */
  openDefineProductAttributesModal() {
    const modal = document.getElementById('campaignClientProduct');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeDefineProductModal` sets `editMode` to false and hides the modal with the id
   * 'campaignClientProduct'.
   */
  closeDefineProductAttributesModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignClientProduct');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openDefineProductAttributesModal` displays a modal for defining product attributes
   * if it exists in the DOM.
   */
  openDefineProductClientAttributesModal() {
    const modal = document.getElementById('campaignClientProductAttributes');
    if (modal && this.selectedProductAttributes) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
    else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No product is selected.'
      )
    }
  }

  /**
   * The function `closeDefineProductAttributesModal` sets `editMode` to false and hides the modal with
   * the id 'campaignClientProductAttributes'.
   */
  closeDefineProductClientAttributesModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignClientProductAttributes');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `editProduct` function toggles the edit mode and opens a modal to define a product.
   */
  editProductAttribute() {
    this.editMode = !this.editMode;
    this.selectedSystem = this.selectedProductAttributes.system;
    this.onSystemChange();
    log.info("select>>", this.selectedProductAttributes, this.productList)

    if (this.selectedProductAttributes) {
      this.openDefineProductAttributesModal();
      this.createProductAttributesForm.patchValue({
        sysName: this.selectedProductAttributes.system,
        productName: this.selectedProductAttributes.productCode,
        shortDescription: this.selectedProductAttributes.shortDescription,
        description: this.selectedProductAttributes.description,
        narration: this.selectedProductAttributes.narration
      })
    }
    else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No product attribute is selected.'
      )
    }
  }

  /**
   * The function `editProductAttribute` toggles the edit mode and opens a modal for defining product
   * attributes.
   */
  editProductClientAttribute() {
    this.editMode = !this.editMode;
    if (this.selectedProductClientAttributes) {
      this.openDefineProductClientAttributesModal();
      this.createProductClientAttributesForm.patchValue({
        selectAttribute: this.selectedProductClientAttributes.clientAttributeCode,
        productAttributeCheck: this.selectedProductClientAttributes.fixedValue,
        minValue: this.selectedProductClientAttributes.min,
        maxValue: this.selectedProductClientAttributes.max
      })
    }
    else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No product client attribute is selected.'
      )
    }
  }

  /**
   * The function `fetchProductAttributes` fetches all product attributes and stores them in the
   * component's `productAttributesData` property.
   */
  fetchProductAttributes() {
    this.spinner.show();
    this.campaignsService.getProductAttributes()
      .subscribe((data) => {
        this.productAttributesData = data;
        this.spinner.hide();

        log.info("product attributes>>", data);
      });
  }

  /**
   * The function `saveProductAttribute` is called when the user clicks the save button in the
   * create product attribute modal. It creates or updates a product attribute based on whether
   * the `selectedProductAttributes` property is truthy or falsy.
   */
  saveProductAttribute() {
    this.createProductAttributesForm.markAllAsTouched();
    if (this.createProductAttributesForm.invalid) return;

    const productAttributeFormValues = this.createProductAttributesForm.getRawValue();
    const productAttributeCode = this.selectedProductAttributes?.code ? this.selectedProductAttributes?.code : null;

    const saveProductAttributePayload: ProductAttributesDTO = {
      code: productAttributeCode,
      description: productAttributeFormValues.description,
      narration: productAttributeFormValues.narration,
      productCode: productAttributeFormValues.productName,
      shortDescription: productAttributeFormValues.shortDescription,
      system: productAttributeFormValues.sysName
    }
    log.info("attr>", saveProductAttributePayload);

    const productAttributeServiceCall = this.selectedProductAttributes
      ? this.campaignsService.updateProductAttribute(productAttributeCode, saveProductAttributePayload)
      : this.campaignsService.createProductAttribute(saveProductAttributePayload);

    return productAttributeServiceCall.subscribe({
      next: (data) => {
        this.globalMessagingService.displaySuccessMessage('Success', `Successfully ${this.selectedProductAttributes ? 'updated' : 'created'} a product`);

        this.createProductAttributesForm.reset();
        this.closeDefineProductAttributesModal();
        this.fetchProductAttributes();
        this.selectedProductAttributes = null;
      },
      error: (err) => {
        log.info('>>>>>>>>>', err.error.message)
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      }
    });

  }

  /**
   * Deletes a product attribute.
   */
  deleteProductAttribute() {
    if (this.selectedProductAttributes) {
      const productAttributeId = this.selectedProductAttributes?.code;
      this.campaignsService.deleteProductAttribute(productAttributeId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a product attribute'
          );
          this.selectedProductAttributes = null;
          this.fetchProductAttributes();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No product attribute is selected.'
      );
    }
  }

  /**
   * Fetches all product client attributes related to a product attribute
   */
  fetchProductClientAttributes(productAttribute) {
    this.spinner.show();
    this.campaignsService.getProductClientAttributes(productAttribute?.code)
      .subscribe((data) => {
        this.productClientAttributesData = data;
        this.spinner.hide();

        log.info("product client attributes>>", data);
      });
  }

  /**
   * Save a product client attribute.
   *
   * When called, the method checks if the form is valid. If the form is invalid, it
   * does nothing. If the form is valid, it creates or updates a product client
   * attribute based on whether the `selectedProductClientAttributes` property is
   * truthy or falsy. It then calls the `CampaignsService` to create or update the
   * product client attribute.
   */
  saveProductClientAttribute() {
    this.createProductClientAttributesForm.markAllAsTouched();
    if (this.createProductClientAttributesForm.invalid) return;

    const productClientAttributeFormValues = this.createProductClientAttributesForm.getRawValue();
    const productClientAttributeCode = this.selectedProductClientAttributes?.code ? this.selectedProductClientAttributes?.code : null;

    const saveProductClientAttributePayload: ProductClientAttributesDTO = {
      code: productClientAttributeCode,
      productAttributeCode: this.selectedProductAttributes?.code,
      clientAttributeCode: productClientAttributeFormValues.selectAttribute,
      min: productClientAttributeFormValues.minValue,
      max: productClientAttributeFormValues.maxValue,
      fixedValue: productClientAttributeFormValues.productAttributeCheck
    }
    log.info("attr>", saveProductClientAttributePayload);

    const productAttributeServiceCall = this.selectedProductClientAttributes
      ? this.campaignsService.updateProductClientAttribute(productClientAttributeCode, saveProductClientAttributePayload)
      : this.campaignsService.createProductClientAttribute(saveProductClientAttributePayload);

    return productAttributeServiceCall.subscribe({
      next: (data) => {
        this.globalMessagingService.displaySuccessMessage('Success', `Successfully ${this.selectedProductClientAttributes ? 'updated' : 'created'} a product attribute`);

        this.createProductClientAttributesForm.reset();
        this.closeDefineProductClientAttributesModal();
        this.fetchProductClientAttributes(this.selectedProductAttributes);
        this.selectedProductClientAttributes = null;
      },
      error: (err) => {
        log.info('>>>>>>>>>', err.error.message)
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      }
    });

  }

  /**
   * Deletes a product client attribute.
   *
   * This method is called when the user clicks the delete button in the product client attributes table.
   * It deletes the selected product client attribute and fetches the updated product client attributes.
   * If no product client attribute is selected, it displays an error message.
   */
  deleteProductClientAttribute() {
    if (this.selectedProductClientAttributes) {
      const productClientAttributeId = this.selectedProductClientAttributes?.code;
      this.campaignsService.deleteProductClientAttribute(productClientAttributeId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a product client attribute'
          );
          this.selectedProductClientAttributes = null;
          this.fetchProductClientAttributes(this.selectedProductAttributes);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No product client attribute is selected.'
      );
    }
  }

  /**
   * The function fetches all systems from the server, and assigns them to the `systems` property of the component.
   * It uses the `untilDestroyed` pipe to cancel the subscription when the component is destroyed.
   * If the service call fails, an error message is displayed to the user.
   */
  fetchAllSystems() {
    this.systemsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.systems = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function checks the short description of a selected system and fetches corresponding products based on the
   * description.
   */
  onSystemChange() {
    const sysId = this.selectedSystem;
    log.info("gis",sysId)
    if (sysId === 37) {
      log.info("system",sysId)
      this.fetchGisProducts();

    } else if (sysId === 27) {
      log.info("lms",this.selectedSystem)
      this.fetchLmsProducts();

    } else {
      this.productList = [];
    }

  }

  /**
   * The fetchGisProducts function retrieves all products from the GIS product service and stores them in the productList
   * array.
   */
  fetchGisProducts() {
    this.productList = [];
    this.gisProductService.getAllProducts()
      .pipe(
        take(1),
        map(data => {
          const allProducts: AggregatedProduct[] = [];
          data.forEach(product => {
            const combinedProduct: AggregatedProduct = {
              code: product.code,
              description: product.description,
              shortDescription: product.shortDescription
            }
            allProducts.push(combinedProduct);
          })
          return allProducts;
        })
      )
      .subscribe(
        (data) => {
          this.productList = data;
          log.info('gis products:', this.productList);
        })
  }

  /**
   * The fetchLmsProducts function retrieves a list of products from an LMS service and assigns it to the productList
   * variable.
   */
  fetchLmsProducts() {
    this.productList = [];
    this.lmsProductService.getListOfProduct()
      .pipe(
        take(1),
        map(data => {
          const allProducts: AggregatedProduct[] = [];
          data.forEach(product => {
            const combinedProduct: AggregatedProduct = {
              code: product.code,
              description: product.description,
              shortDescription: product.type
            }
            allProducts.push(combinedProduct);
          })
          return allProducts;
        })
      )
      .subscribe(
        (data) => {
          this.productList = data;
          log.info('lms products:', this.productList);
        })
  }

  /**
   * Patches the createProductAttributesForm with the selected product's details.
   */
  onProductSelect(product: AggregatedProduct) {
    this.createProductAttributesForm.patchValue({
      shortDescription: product.shortDescription,
      description: product.description
    });
  }

  /**
   * Event handler for the product code dropdown.
   * Retrieves the selected product based on the product code and patches the form with its details.
   */
  onProductChange(productCode) {
    // Find the selected product based on the product code from the dropdown
    const selectedProduct = this.productList.find(product => product.code === productCode);

    if (selectedProduct) {
      this.onProductSelect(selectedProduct);
    }
  }

  /**
   * Retrieves the system name for a given system id or short description.
   */
  getSystemName(system: string | number | undefined) {
    if (!system) {
      return undefined;
    }

    const selectedSystem = this.systems.find(s => s.id === +system || s.shortDesc === system);
    return selectedSystem?.systemName;
  }

  /**
   * Filters the product attributes table based on the input value from an HTML input element.
   */
  filterProductAttributes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productAttributesTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * Filters the product client attributes table based on the input value from an HTML input element.
   */
  filterProductClientAttributes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productClientAttributesTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * Fetches all client attributes from the Campaigns service and stores them in the
   * component's `clientAttributesData` property.
   */
  fetchClientAttributes() {
    this.campaignsService.getClientAttributes()
      .subscribe((data) => {
        this.clientAttributesData = data;

        log.info("client attributes>>", data);
      });
  }

  /**
   * Retrieves a client attribute based on the given code.
   */
  getClientAttribute(code: string | number | undefined) {
    if (!code) {
      return undefined;
    }

    const selectedProductAttr = this.clientAttributesData.find(s => s.code === +code || s.name === code);
    if (selectedProductAttr) {
      return {
        name: selectedProductAttr.name,
        range: selectedProductAttr.range
      };
    }
    return undefined;
  }

  onSelectClientAttribute(code: number) {
    this.selectedClientAttribute = this.clientAttributesData.find(option => option.code === code);

    const minValueLabel = document.querySelector(`label[for=minValue]`);
    const maxValueLabel = document.querySelector(`label[for=maxValue]`);

    if (this.selectedClientAttribute?.range === 'N') {
      this.createProductClientAttributesForm.get('minValue').clearValidators();
      this.createProductClientAttributesForm.get('maxValue').clearValidators();

      if (minValueLabel) {
        const minValueAsterisk = minValueLabel.querySelector('span');
        if (minValueAsterisk) {
          minValueLabel.removeChild(minValueAsterisk);
        }
      }

      if (maxValueLabel) {
        const maxValueAsterisk = maxValueLabel.querySelector('span');
        if (maxValueAsterisk) {
          maxValueLabel.removeChild(maxValueAsterisk);
        }
      }

      // log.info('clear>>', selectedObject)
    } else {
      this.createProductClientAttributesForm.get('minValue').addValidators(Validators.required);
      this.createProductClientAttributesForm.get('maxValue').addValidators(Validators.required);
      // log.info('add validator>>', selectedObject)
    }

    this.createProductClientAttributesForm.get('minValue').updateValueAndValidity();
    this.createProductClientAttributesForm.get('maxValue').updateValueAndValidity();
    this.cdr.detectChanges();
    // log.info('update>>', selectedObject)
  }

  ngOnDestroy(): void {}
}
