import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.css']
})
export class ProductAttributesComponent implements OnInit{
  productData: any;
  selectedProduct: any;
  productAttributesData: any;
  selectedProductAttributes: any;
  pageSize: 5;

  editMode: boolean = false;

  createProductAttributesForm: FormGroup;
  createProductForm: FormGroup;

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

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.campaignProductAttrCreateForm();
    this.campaignProductCreateForm();
  }

  /**
   * The function `campaignProductAttrCreateForm` creates a form with specific attributes and sets
   * validators based on mandatory fields retrieved from an API response.
   */
  campaignProductAttrCreateForm() {
    this.createProductAttributesForm = this.fb.group({
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
   * The function `campaignProductCreateForm` creates a form with specific fields, sets validators for
   * mandatory fields based on response data, and updates the form accordingly.
   */
  campaignProductCreateForm() {
    this.createProductForm = this.fb.group({
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
          for (const key of Object.keys(this.createProductForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createProductForm.controls[key].addValidators(Validators.required);
                this.createProductForm.controls[key].updateValueAndValidity();
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
    return this.createProductAttributesForm.controls;
  }

  /**
   * The function returns the controls of a createProductForm in TypeScript.
   * @returns The `g()` function is returning the controls of the `createProductForm` form group.
   */
  get g() {
    return this.createProductForm.controls;
  }

  /**
   * The function `openDefineProductModal` displays a modal with the id 'campaignClientProduct' by
   * adding the 'show' class and setting the display style to 'block'.
   */
  openDefineProductModal() {
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
  closeDefineProductModal() {
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
  openDefineProductAttributesModal() {
    const modal = document.getElementById('campaignClientProductAttributes');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeDefineProductAttributesModal` sets `editMode` to false and hides the modal with
   * the id 'campaignClientProductAttributes'.
   */
  closeDefineProductAttributesModal() {
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
  editProduct() {
    this.editMode = !this.editMode;
    this.openDefineProductModal();
  }

  /**
   * The function `editProductAttribute` toggles the edit mode and opens a modal for defining product
   * attributes.
   */
  editProductAttribute() {
    this.editMode = !this.editMode;
    this.openDefineProductAttributesModal();
  }

  ngOnDestroy(): void {}
}
