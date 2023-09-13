import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Field, FormScreen, Product_group, Products, productDocument } from '../../../data/gisDTO';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../../../services/product/product.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-definition',
  templateUrl: './product-definition.component.html',
  styleUrls: ['./product-definition.component.css']
})
export class ProductDefinitionComponent implements OnInit {

  showParent = true;
  showsubclass = true;
  showdocument = true;
  filterby: any;
  detailsDone: boolean = true;
  productGroupCode: Product_group
  subclassform: FormGroup
  productGroupForm: FormGroup
  productForm: FormGroup
  productDetails: any = [];
  showOptionalFields: boolean = false;
  mandatoryFrontendScreens: Field[] = [];
  optionalFrontendScreens: Field[] = [];
  show: boolean = true;
  subclassDone: boolean = true;
  updateFormFields!: FormScreen
  response: any = [];
  prodGroup: any;
  isUpdate: boolean = true;
  isUpdateProduct: boolean = true;
  productCode: Products
  page: any;
  productdocumentform: FormGroup
  prodGCode: number;
  allScheduleReports: any
  allScreens: any
  unAssignedSubclasses: any;
  selected: any;
  productDocument: any
  prodCode: number;
  allSubclasses: any;
  productList: any = [];
  file: File
  report: any;
  base64Data: string;
  singleSubclass: any
  selectedCard: number = 0;
  productSubclassResponse: any;
  allProducts: Products[]
  testForm: FormGroup = new FormGroup<any>({});
  constructor(
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private gisService: ProductService
  ) { }
  ngOnInit(): void {
    this.loadAllProductGroupWithProducts()
    this.createProductForm()
    this.createProductGroupForm()
    this.getForms()
    this.getAllScheduleReports()
    this.getAllScreens()
    this.getAllProducts()
    this.createProductSubClassForm()
    this.createProductDocument()
    this.getAllSubclasses()
  }

  /**
 * Handles the selection of a node in a tree or hierarchical structure.
 *
 * This method is typically triggered when a node is selected in a tree or hierarchical structure, such as a navigation tree.
 * It performs different actions based on the type of selected node (e.g., product group or product subclass).
 *
 * @param event - The event object representing the selected node.
 *
 * @returns void
 */
  SelectNode(event: any) {
    const selectedNode = event.node;

    if (selectedNode.code) {
      this.getProductGroup(selectedNode.code);
      this.prodGCode = selectedNode.code
    } else if (selectedNode.code2) {
      this.getProduct(selectedNode.code2);
      // this.getProductFormFields(selectedNode.code2)
      this.prodCode = selectedNode.code2
      this.getProductDocument(this.prodCode)
    }
    this.getSubclasses(this.prodCode, this.prodGCode);

  }
  /**
 * Retrieves product details by code and updates the component's view.
 *
 * This method makes an HTTP request to the GIS service to fetch product details based on the provided product code.
 * It stores the retrieved product details in the 'productDetails' property and updates the corresponding form with the data.
 *
 * @param code - The code of the product for which details are to be retrieved.
 *
 * @returns void
 */
  getProduct(code: any) {

    this.gisService.getProductByCode(code).subscribe(data => {
      this.productDetails = data;
      console.log(this.productDetails, "product details")
      this.productForm.patchValue(this.productDetails)
      this.cdr.detectChanges();
    })
  }
  /**
 * Retrieves product documents by code and updates the corresponding form.
 *
 * This method makes an HTTP request to the GIS service to fetch product documents based on the provided product code.
 * It stores the retrieved product documents in the 'productDocument' property and updates the corresponding form with the data.
 *
 * @param code - The code of the product for which documents are to be retrieved.
 *
 * @returns void
 */
  getProductDocument(code: any) {
    this.gisService.getProductDocument(code).subscribe(data => {
      this.productDocument = data;
      this.productdocumentform.patchValue(this.productDocument)
      this.cdr.detectChanges();
    })
  }

  /**
 * Retrieves product group details by code and updates the component's view.
 *
 * This method makes an HTTP request to the GIS service to fetch product group details based on the provided product group code.
 * It stores the retrieved product group details in the 'prodGroup' property, updates the corresponding form, and sets 'productGroupCode'.
 *
 * @param code - The code of the product group for which details are to be retrieved.
 *
 * @returns void
 */
  getProductGroup(code: any) {
    this.gisService.getProductGroupByCode(code).subscribe(data => {
      this.prodGroup = data;
      this.productGroupCode = this.prodGroup.code
      this.productGroupForm.patchValue(this.prodGroup)
      this.cdr.detectChanges();
    })
  }
  hideParent() {
    this.showParent = !this.showParent;
  }
  hideSubclass() {
    this.showsubclass = !this.showsubclass;
  }
  hideProductDocument() {
    this.showdocument = !this.showdocument;
  }
  selectCard(trackCard: number): void {
    this.selectedCard = trackCard;
  }
  selectedScreen(cardNumber: string): void {

    this.page = cardNumber
    this.cdr.detectChanges();
    console.log(this.page)
  }
  onRowSelect(code: number) {
    this.getsubclasseswithCode(code)
  }
  createProductSubClassForm() {
    this.subclassform = this.fb.group({
      code: ['', Validators.required],
      is_mandatory: ['', Validators.required],
      sub_class_code: ['', Validators.required],
      policyDocumentOrderNumber: 2,
      product_group_code: this.prodGCode,
      product_code: this.prodCode,
      product_short_description: null,
      underwriting_screen_code: ['', Validators.required],
      date_with_effect_from: ['', Validators.required],
      date_with_effect_to: ['', Validators.required],
      version: 1,

    })
  }

  /**
 * Retrieves subclass data from the GIS service based on a provided code and updates the subclass form.
 *
 * @param code - The code used to retrieve subclass data.
 * @returns void
 */
  getsubclasseswithCode(code: any) {
    this.gisService.getsubclassByCode(code).subscribe(data => {
      this.singleSubclass = data;
      this.subclassform.patchValue(this.singleSubclass)
      console.log(this.singleSubclass);
      this.cdr.detectChanges();
    })

  }

  /**
 * Initializes a product document form with default values and validators.
 *
 * This method creates and initializes an Angular FormGroup named `productdocumentform` for managing product document data.
 * It sets default values and applies validation rules for form fields.
 */
  createProductDocument() {
    this.productdocumentform = this.fb.group({
      dateWithEffectFrom: ['', Validators.required],
      dateWithEffectTo: ['', Validators.required],
      document: "path",
      isDefault: "Y",
      name: ['', Validators.required],
      precedence: ['', Validators.required],
      productCode: ['', Validators.required],
      version: 1
    })
  }

  /**
 * Creates a new product using the data from the product form and sends a request to the GIS service.
 *
 * This method collects the data entered in the product form, adds additional information such as the product group code and organization code, and makes an HTTP request to create a new product.
 * @returns void
 */
  createProduct() {
    console.log(this.productForm.value)
    const requestBody: any = this.productForm.value
    requestBody.code = null
    requestBody.productGroupCode = this.productGroupCode
    requestBody.organizationCode = 2
    console.log(this.productGroupCode, "Product group code")
    this.gisService.createProducts(requestBody).subscribe((data: any) => {
      this.productCode = data.code
      try {
        console.log(this.productForm.value)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      } catch (error) {
        console.log(this.productForm.value)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

      }
    })
  }

  /**
 * Handles the upload of a file selected by the user.
 *
 * @param event - The file input change event triggered when the user selects a file.
 */

  handleUpload(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.base64Data = reader.result as string;
      // console.log(this.base64Data);
    };
  }

  /**
   * Saves a product document by sending a request to the GIS service.
   *
   * This method extracts relevant data from the product document form and file upload, then makes an HTTP request to save the document.
   */
  saveProductDocument() {

    const doc = this.productdocumentform.value
    doc.document = this.base64Data
    doc.name = this.file?.name;
    // console.log(doc)
    try {
      this.gisService.saveProductDocument(doc).subscribe(data => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully uploaded Document' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }
  }

  /**
 * Creates product subclasses based on the selected elements and sends requests to the GIS service.
 *
 * This method takes an array of selected elements, prepares the data for each element, and makes multiple HTTP requests to create product subclasses.
 */
  createProductSubclass() {
    console.log(this.selected)
    const observables = this.selected.map(element => {

      const sectionsArray: any = {
        code: null,
        isMandatory: element.isMandatory,
        sub_class_code: element.code,
        policyDocumentOrderNumber: 2,
        product_group_code: this.prodGCode,
        product_code: this.prodCode,
        product_short_description: null,
        underwriting_screenCode: element.underwritingScreenCode,
        date_with_effect_from: element.withEffectFrom,
        date_with_effect_to: element.withEffectTo,
        version: 1,
      }
      return this.gisService.createProductSubclasses(sectionsArray);
    });

    forkJoin(observables).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
      }
    );

  }

  /**
 * Initializes a product group form with default values and validators.
 *
 * This method creates and initializes an Angular FormGroup named `productGroupForm` for managing product group data.
 * It sets default values and applies validation rules for form fields.
 */
  createProductGroupForm() {
    this.productGroupForm = this.fb.group({
      code: null,
      description: ['', Validators.required],
      type: ['', Validators.required],
      organizationCode: ['2', { nonNullable: true }],
    })
  }

  /**
 * Initializes a product form with default values and validators.
 *
 * This method creates and initializes an Angular FormGroup named `productForm` for managing product data.
 * It sets default values and applies validation rules for form fields.
 */
  createProductForm() {
    this.productForm = this.fb.group({
      code: null,
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      productGroupCode: ['', Validators.required],
      withEffectFrom: ['', Validators.required],
      withEffectTo: ['', Validators.required],
      policyPrefix: ['', Validators.required],
      organizationCode: ['2', { nonNullable: true }],
      claimPrefix: ['', Validators.required],
      underwritingScreenCode: ['', Validators.required],
      claimScreenCode: null,
      expires: "Y",
      doesCashBackApply: "Y",
      minimumSubClasses: 1,
      acceptsMultipleClasses: "N",
      minimumPremium: null,
      isRenewable: "Y",
      allowAccommodation: "N",
      openCover: "N",
      productReportGroupsCode: 1,
      policyWordDocument: null,
      shortName: "AVIATION HULL",
      endorsementMinimumPremium: null,
      showSumInsured: "Y",
      showFAP: "Y",
      policyCodePages: null,
      policyDocumentPages: null,
      isPolicyNumberEditable: "N",
      policyAccumulationLimit: null,
      insuredAccumulationLimit: null,
      totalCompanyAccumulationLimit: null,
      enableSpareParts: "N",
      prerequisiteProductCode: null,
      allowMotorClass: "N",
      allowSameDayRenewal: "N",
      acceptUniqueRisks: null,
      industryCode: null,
      webDetails: null,
      showOnWebPortal: "N",
      areInstallmentAllowed: "Y",
      interfaceType: "ACCRUAL",
      isMarine: null,
      allowOpenPolicy: "N",
      order: null,
      isDefault: "N",
      prorataType: null,
      doFullRemittance: null,
      productType: null,
      checkSchedule: null,
      scheduleOrder: 1,
      isPinRequired: "Y",
      maximumExtensions: null,
      autoGenerateCoverNote: "N",
      commissionRate: null,
      autoPostReinsurance: "N",
      insuranceType: null,
      years: null,
      enableWeb: null,
      doesEscalationReductionApply: null,
      isLoanApplicable: null,
      isAssignmentAllowed: null,
      minimumAge: null,
      maximumAge: null,
      minimumTerm: null,
      maximumTerm: null,
      termDistribution: null,
    })
  }

  /**
 * Updates a product group by sending a request to the GIS service.
 *
 * This method extracts data from the product group form, prepares a request body, and makes an HTTP request to update the product group.
 *
 * @returns void
 */
  updateproductGroup() {
    const requestBody = this.productGroupForm.value;
    requestBody.code = null
    try {
      this.gisService.updateProductGroupbyCode(requestBody, this.prodGCode).subscribe(data => {
        console.log("Updated successfully here")
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }

  }

  /**
* Updates a product by sending a request to the GIS service.
*
* This method extracts data from the product form, prepares a request body, and makes an HTTP request to update the product.
*
* @returns void
*/
  updateproduct() {
    console.log(this.productForm.value)
    const requestBody: any = this.productForm.value
    requestBody.code = null
    requestBody.productGroupCode = this.productGroupCode
    requestBody.organizationCode = 2
    console.log(this.productGroupCode, "Product group code")
    try {
      this.gisService.editProducts(requestBody, this.prodCode).subscribe(data => {
        console.log("Updated successfully here")
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }

  }

  /**
* Saves a product by either updating an existing product or creating a new one, depending on the value of `isUpdateProduct`.
*
* This method checks the value of `isUpdateProduct` and calls either the `updateProduct()` method for an existing product or the `createProduct()` method for a new product.
*
* @returns void
*/
  saveProduct() {
    if (this.isUpdateProduct) {
      this.updateproduct();
    } else {
      this.createProduct();
    }
  }

  /**
* Saves a product group by either updating an existing group or creating a new one, depending on the value of `isUpdate`.
*
* This method checks the value of `isUpdate` and calls either the `updateProductGroup()` method for an existing group or the `createProdGroup()` method for a new group.
*
* @returns void
*/
  save() {
    if (this.isUpdate) {
      this.updateproductGroup();
    } else {
      this.createProdGroup();
    }
  }
  /**
 * Handles the click event when the "New" button is clicked, resetting form states for creating new entries.
 *
 * This method is typically invoked when a user intends to create a new product group or product entry.
 * It resets relevant form states and sets flags (`isUpdate` and `isUpdateProduct`) to indicate that a new entry is being created.
 *
 * @returns void
 */
  onNewButtonClick() {
    this.isUpdate = false; // Set isUpdate to false when "New" button is clicked
    this.isUpdateProduct = false
    this.productGroupForm.reset();
    this.productForm.reset();
  }

  /**
 * Loads all product groups with their associated products and organizes them into a hierarchical tree structure.
 *
 * This method retrieves grouped data from the GIS service and organizes it into a tree structure where product groups are parent nodes
 * and their associated products are child nodes. It populates the `response` property with the resulting tree data.
 *
 * @returns void
 */
  loadAllProductGroupWithProducts() {
    return this.gisService.getGroupedData().subscribe((data: {}) => {
      this.productList = data;
      const nodes = {};
      this.productList.forEach((item: any) => {
        if (item.pGroupCode) {
          const parentNode = nodes[item.pGroupCode.code] || (nodes[item.pGroupCode.code] = {
            //name: item.pGroupCode.description, 
            label: item.pGroupCode.description,
            // initialize name to empty string
            code: item.pGroupCode.code,
            children: []
          });
          parentNode.children.push({ label: item.shortName, code2: item.code });
          //parentNode.name = `${item.pGroupCode.description} (${item.pGroupCode.code})`; // update name property
          parentNode.label = `${item.pGroupCode.description}`;
        }
      });

      // convert the map into an array of top-level nodes
      const treeData = Object.values(nodes) as any;

      // set the tree data as the response array
      this.response = treeData;
      console.log("This is tree", this.response);
    });
  }
  /**
 * Retrieves and stores a list of all products from the GIS service.
 *
 * This method makes an HTTP request to the GIS service to fetch a list of all products and stores the retrieved data in the 'allProducts' property.
 *
 * @returns void
 */
  getAllProducts() {
    this.gisService.getAllProducts().subscribe(data => {
      return this.allProducts = data;
    })
  }
  /**
 * Retrieves and stores a list of all schedule reports from the GIS service.
 *
 * This method makes an HTTP request to the GIS service to fetch a list of all schedule reports and stores the retrieved data in the 'allScheduleReports' property.
 *
 * @returns void
 */
  getAllScheduleReports() {
    this.gisService.getAllScheduleReports().subscribe(data => {
      this.allScheduleReports = data;
      console.log(this.allScheduleReports, "all reports")
    })
  }
  /**
* Retrieves and stores a list of all screens from the GIS service.
*
* This method makes an HTTP request to the GIS service to fetch a list of all screens and stores the retrieved data in the 'allScreens' property.
*
* @returns void
*/
  getAllScreens() {
    this.gisService.getAllScreens().subscribe(data => {
      this.allScreens = data._embedded.screen_dto_list;
    })
  }

  /**
* Retrieves form fields for a specific screen and initializes a dynamic reactive form.
*
* This method fetches form field data for a specified screen from the GIS service and dynamically initializes a reactive form
* based on the received field definitions. It also categorizes fields as mandatory or optional and populates relevant properties.
*
* @returns void
*/
  getForms() {
    const screenId = 15
    this.gisService.getFormScreen(screenId).subscribe(data => {

      this.updateFormFields = data
      let fields = this.updateFormFields.fields;

      let controls = {};
      fields.forEach(field => {
        controls = { ...controls, [field.name]: new FormControl({ value: '', disabled: field.isEnabled == 'N' }) }
      })

      this.productForm = new FormGroup<any>(controls) // instantiate the reactive form controls

      this.mandatoryFrontendScreens = fields.filter(field => field.isMandatory === 'Y');
      this.optionalFrontendScreens = fields.filter(field => field.isMandatory === 'N');
      console.log(fields)
    });
  }
  /**
 * Retrieves product subclasses for a specific product and product group.
 *
 * This method makes an HTTP request to the GIS service to fetch product subclasses and filters the results
 * to obtain subclasses associated with a particular product and product group.
 *
 * @param productCode - The code of the product for which subclasses are to be retrieved.
 * @param productGroupCode - The code of the product group to which the product belongs.
 *
 * @returns void
 */
  getSubclasses(productCode: any, productGroupCode: any) {
    this.gisService.getASubclasses().subscribe(data => {
      this.allSubclasses = data._embedded.product_subclass_dto_list
      this.productSubclassResponse = this.allSubclasses.filter(prod => prod.product_code == productCode && prod.product_group_code == productGroupCode)
      // this.unAssignedSubclasses = this.allSubclasses.filter(prod => prod.product_code != productCode && prod.product_group_code != productGroupCode)
      this.cdr.detectChanges();
    })
  }

  /**
 * Retrieves and stores a list of all product subclasses from the GIS service.
 *
 * This method makes an HTTP request to the GIS service to fetch a list of all product subclasses and stores the retrieved data in the 'unAssignedSubclasses' property.
 *
 * @returns void
 */
  getAllSubclasses() {

    return this.gisService.getSubclasses1().subscribe((data: any) => {
      this.unAssignedSubclasses = data
      console.log(this.unAssignedSubclasses, "HTML")
      this.cdr.detectChanges();
    })
  }

  /**
* Creates a new product group using data from the product group form.
*
* This method sends a request to the GIS service to create a new product group with the data provided in the 'productGroupForm'.
* After successfully creating the product group, it stores the generated product group code and displays a success message.
*
* @returns void
*/
  createProdGroup() {

    //const requestBody: Product_group = this.productGroupForm.value
    this.productGroupForm.removeControl('code');

    // requestBody.code = null
    this.gisService.createProductgroup(this.productGroupForm.value).subscribe((data: any) => {
      this.productGroupCode = data.code
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      } catch (error) {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

      }
    })
  }

  /**
* Updates a product subclass using data from the subclass form.
*
* This method sends a request to the GIS service to update a product subclass with the data provided in the 'subclassform'.
* After successfully updating the product subclass, it displays a success message.
*
* @returns void
*/
  updateProductSubclass() {
    const requestBody = this.subclassform.value;
    const updateCode = requestBody.code
    console.log(requestBody)
    requestBody.code = null
    requestBody.product_short_description = null
    try {
      this.gisService.updateSubclass(requestBody, updateCode).subscribe(data => {
        console.log("Updated successfully here")
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }

  }
}
