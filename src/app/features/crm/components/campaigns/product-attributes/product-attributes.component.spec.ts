import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributesComponent } from './product-attributes.component';
import {CampaignsService} from "../../../services/campaigns..service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {createSpyObj} from "jest-createspyobj";
import {of, throwError} from "rxjs";
import {MandatoryFieldsDTO} from "../../../../../shared/data/common/mandatory-fields-dto";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {ProductsService} from "../../../../gis/components/setups/services/products/products.service";
import {ProductService} from "../../../../lms/service/product/product.service";
import {SharedModule} from "../../../../../shared/shared.module";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {ClientAttributesDTO, ProductAttributesDTO, ProductClientAttributesDTO} from "../../../data/campaignsDTO";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";

export class MockCampaignService {
  deleteProductAttribute = jest.fn().mockReturnValue(of());
  deleteProductClientAttribute = jest.fn().mockReturnValue(of());
  getClientAttributes = jest.fn().mockReturnValue(of());
  getProductAttributes = jest.fn().mockReturnValue(of());
  getProductClientAttributes = jest.fn().mockReturnValue(of());
  updateProductAttribute = jest.fn().mockReturnValue(of());
  createProductAttribute = jest.fn().mockReturnValue(of());
  updateProductClientAttribute = jest.fn().mockReturnValue(of());
  createProductClientAttribute = jest.fn().mockReturnValue(of());
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockSystemsService {
  getSystems = jest.fn().mockReturnValue(of());
}

const mandatoryField: MandatoryFieldsDTO = {
  "id": 1,
  "fieldName": "username",
  "fieldLabel": "Username",
  "mandatoryStatus": "required",
  "visibleStatus": "Y",
  "disabledStatus": "enabled",
  "frontedId": "field-username",
  "screenName": "loginScreen",
  "groupId": "authGroup",
  "module": "authentication"
}

const mockProductAttribute: ProductAttributesDTO[] = [
  {
    "code": 0,
    "productCode": 10,
    "description": "Product 1",
    "shortDescription": "Product desc",
    "narration": "narration 1",
    "system": 12
  }
]

const mockProductClientAttribute: ProductClientAttributesDTO[] = [
  {
    "code": 0,
    "productAttributeCode": 10,
    "clientAttributeCode": 20,
    "min": "15",
    "max": "20",
    "fixedValue": "Percent"
  }
]

const mockClientAttribute: ClientAttributesDTO[] = [
  {
    "code": 1,
    "name": "Client attribute",
    "description": "client attr desc",
    "prompt": "trial",
    "range": "Y",
    "inputType": "null",
    "columnName": "first name",
    "tableName": "Clients"
  }
]

const mockSystem: SystemsDto[] = [
  {
    "id": 1,
    "shortDesc": "GIS",
    "systemName": "General Insurance"
  }
]

describe('ProductAttributesComponent', () => {
  let component: ProductAttributesComponent;
  let fixture: ComponentFixture<ProductAttributesComponent>;
  let campaignsServiceStub: CampaignsService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let gisProductServiceStub: ProductsService
  let lmsProductServiceStub: ProductService;
  let systemsServiceStub: SystemsService;

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', ['getMandatoryFieldsByGroupId'])

  beforeEach(() => {
    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));

    TestBed.configureTestingModule({
      declarations: [ProductAttributesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: CampaignsService, useClass: MockCampaignService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: NgxSpinnerService },
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub },
        { provide: SystemsService, useClass: MockSystemsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ProductAttributesComponent);
    component = fixture.componentInstance;
    campaignsServiceStub = TestBed.inject(CampaignsService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    gisProductServiceStub = TestBed.inject(ProductsService)
    lmsProductServiceStub = TestBed.inject(ProductService);
    systemsServiceStub = TestBed.inject(SystemsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open product attribute Modal', () => {
    component.openDefineProductAttributesModal();

    const modal = document.getElementById('campaignClientProduct');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should open product client attribute Modal', () => {
    component.openDefineProductClientAttributesModal();

    const modal = document.getElementById('campaignClientProductAttributes');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close client attribute Modal', () => {
    const modal = document.getElementById('campaignClientProduct');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefineProductAttributesModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should close product client attribute Modal', () => {
    const modal = document.getElementById('campaignClientProductAttributes');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefineProductClientAttributesModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open the product attribute modal and set form values when a product attribute is selected', () => {
    const mockSelectedProductAttribute = mockProductAttribute[0];
    component.selectedProductAttributes = mockSelectedProductAttribute;
    const spyOpenClientAttributeModal = jest.spyOn(component, 'openDefineProductAttributesModal');
    const patchValueSpy = jest.spyOn(
      component.createProductAttributesForm,
      'patchValue'
    );

    component.editProductAttribute();

    expect(spyOpenClientAttributeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      sysName: mockSelectedProductAttribute.system,
      productName: mockSelectedProductAttribute.productCode,
      shortDescription: mockSelectedProductAttribute.shortDescription,
      description: mockSelectedProductAttribute.description,
      narration: mockSelectedProductAttribute.narration
    });
  });

  it('should open the product client attribute modal and set form values when a product client attribute is selected', () => {
    const mockSelectedProductClientAttribute = mockProductClientAttribute[0];
    component.selectedProductClientAttributes = mockSelectedProductClientAttribute;
    const spyOpenProductClientAttributeModal = jest.spyOn(component, 'openDefineProductClientAttributesModal');
    const patchValueSpy = jest.spyOn(
      component.createProductClientAttributesForm,
      'patchValue'
    );

    component.editProductClientAttribute();

    expect(spyOpenProductClientAttributeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      selectAttribute: mockSelectedProductClientAttribute.clientAttributeCode,
      productAttributeCheck: mockSelectedProductClientAttribute.productAttributeCode,
      minValue: mockSelectedProductClientAttribute.min,
      maxValue: mockSelectedProductClientAttribute.max
    });
  });

  it('should display an error message when no product attribute is selected during edit', () => {
    component.selectedProductAttributes = null;

    component.editProductAttribute();

    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No product attribute is selected.'
    );
  });

  it('should display an error message when no product client attribute is selected during edit', () => {
    component.selectedProductClientAttributes = null;

    component.editProductClientAttribute();

    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No product client attribute is selected.'
    );
  });

  it('should fetch product attributes data', () => {
    jest.spyOn(campaignsServiceStub, 'getProductAttributes').mockReturnValue(of(mockProductAttribute));
    component.ngOnInit();
    component.fetchProductAttributes();
    expect(campaignsServiceStub.getProductAttributes).toHaveBeenCalled();
    expect(component.productAttributesData).toEqual(mockProductAttribute);
  });

  it('should fetch systems data', () => {
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of(mockSystem));
    component.ngOnInit();
    component.fetchAllSystems();
    expect(systemsServiceStub.getSystems).toHaveBeenCalled();
    expect(component.systems).toEqual(mockSystem);
  });

  it('should fetch client attributes data', () => {
    jest.spyOn(campaignsServiceStub, 'getClientAttributes').mockReturnValue(of(mockClientAttribute));
    component.ngOnInit();
    component.fetchClientAttributes();
    expect(campaignsServiceStub.getClientAttributes).toHaveBeenCalled();
    expect(component.clientAttributesData).toEqual(mockClientAttribute);
  });

  it('should fetch product client attributes data', () => {
    jest.spyOn(campaignsServiceStub, 'getProductClientAttributes').mockReturnValue(of(mockProductClientAttribute));
    component.fetchProductClientAttributes(2);
    expect(campaignsServiceStub.getProductClientAttributes).toHaveBeenCalled();
    expect(component.productClientAttributesData).toEqual(mockProductClientAttribute);
  });

  it('should save product attributes', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveProdAttr');
    button.click();
    fixture.detectChanges();
    expect(campaignsServiceStub.createProductAttribute.call).toBeTruthy();
    expect(campaignsServiceStub.createProductAttribute.call.length).toBe(1);
  });

  it('should save product client attributes', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveProdClientAttr');
    button.click();
    fixture.detectChanges();
    expect(campaignsServiceStub.createProductClientAttribute.call).toBeTruthy();
    expect(campaignsServiceStub.createProductClientAttribute.call.length).toBe(1);
  });

  it('should delete when a product attribute is selected', () => {
    component.selectedProductAttributes = mockProductAttribute[0];
    const selectedProdAttrId = mockProductAttribute[0].code;

    const spydeleteProductAttr = jest.spyOn(campaignsServiceStub, 'deleteProductAttribute');

    const spydisplaySuccessMessage = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spydeleteProductAttribute = jest.spyOn(component, 'deleteProductAttribute');
    component.deleteProductAttribute();

    const button = fixture.debugElement.nativeElement.querySelector('#deleteProductAttr');
    button.click();

    expect(spydeleteProductAttribute).toHaveBeenCalled();
    expect(spydeleteProductAttr).toHaveBeenCalledWith(selectedProdAttrId);
  });

  it('should delete when a product client attribute is selected', () => {
    component.selectedProductClientAttributes = mockProductClientAttribute[0];
    const selectedProdClientAttrId = mockProductClientAttribute[0].code;

    const spydeleteProductAttr = jest.spyOn(campaignsServiceStub, 'deleteProductClientAttribute');

    const spydisplaySuccessMessage = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spydeleteProductAttribute = jest.spyOn(component, 'deleteProductClientAttribute');
    component.deleteProductClientAttribute();

    const button = fixture.debugElement.nativeElement.querySelector('#deleteProdClientAttr');
    button.click();

    expect(spydeleteProductAttribute).toHaveBeenCalled();
    expect(spydeleteProductAttr).toHaveBeenCalledWith(selectedProdClientAttrId);
  });

  it('should throw error when delete product attribute fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(campaignsServiceStub, 'deleteProductAttribute').mockReturnValueOnce(throwError(() => error));

    component.selectedProductAttributes = mockProductAttribute[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteProductAttr');
    button.click();
    fixture.detectChanges();
    expect(component.deleteProductAttribute.call).toBeTruthy();
  });

  it('should throw error when delete product client attribute fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(campaignsServiceStub, 'deleteProductClientAttribute').mockReturnValueOnce(throwError(() => error));

    component.selectedProductClientAttributes = mockProductClientAttribute[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteProdClientAttr');
    button.click();
    fixture.detectChanges();
    expect(component.deleteProductClientAttribute.call).toBeTruthy();
  });

  it('should call fetchGisProducts when selectedSystem is 37', () => {
    component.selectedSystem = 37;

    jest.spyOn(component, 'fetchGisProducts');
    jest.spyOn(component, 'fetchLmsProducts');

    component.onSystemChange();

    expect(component.fetchGisProducts).toHaveBeenCalled();
    expect(component.fetchLmsProducts).not.toHaveBeenCalled();
    expect(component.productList).toEqual([]);
  });

  it('should call fetchLmsProducts when selectedSystem is 27', () => {
    component.selectedSystem = 27;
    jest.spyOn(component, 'fetchGisProducts');
    jest.spyOn(component, 'fetchLmsProducts');

    component.onSystemChange();

    expect(component.fetchLmsProducts).toHaveBeenCalled();
    expect(component.fetchGisProducts).not.toHaveBeenCalled();
    expect(component.productList).toEqual([]);
  });

  it('should set productList to an empty array when selectedSystem is neither 37 nor 27', () => {
    component.selectedSystem = 99;

    jest.spyOn(component, 'fetchGisProducts');
    jest.spyOn(component, 'fetchLmsProducts');

    component.onSystemChange();

    expect(component.fetchGisProducts).not.toHaveBeenCalled();
    expect(component.fetchLmsProducts).not.toHaveBeenCalled();

    expect(component.productList).toEqual([]);
  });
});
