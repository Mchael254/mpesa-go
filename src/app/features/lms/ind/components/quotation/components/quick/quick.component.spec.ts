import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickComponent } from './quick.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ProductService } from '../../../../service/product/product.service';
import { of } from 'rxjs/internal/observable/of';
import { DebugElement } from '@angular/core';

describe('QuickComponent', () => {
  let component: QuickComponent;
  let fixture: ComponentFixture<QuickComponent>;

  let spinner_service: NgxSpinnerService;
  let router: Router;
  let session_storage: SessionStorageService;
  let fb: FormBuilder;
  let product_service: ProductService;
  let toast: ToastService;
  let debug: DebugElement;


  beforeEach(() => {

    const spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn(),
    };

    const productServiceMock = {
      getListOfProductOptionByProductCode: jest.fn(() => of([])), // You can adjust the return value
    };

    TestBed.configureTestingModule({
      declarations: [QuickComponent],
      providers: [
        { provide: SessionStorageService },
        { provide: Router},
        { provide: FormBuilder},
        { provide: NgxSpinnerService, useValue: spinnerServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: ToastService},
      ],
    });
    fixture = TestBed.createComponent(QuickComponent);
    component = fixture.componentInstance;
    spinner_service = TestBed.inject(NgxSpinnerService);
    session_storage = TestBed.inject(SessionStorageService);
    router = TestBed.inject(Router);
    fb = TestBed.inject(FormBuilder);
    product_service = TestBed.inject(ProductService);
    toast = TestBed.inject(ToastService);
    debug = fixture.debugElement;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return default value when no argument is provided', () => {
    const result = component.getValue();
    expect(result).toEqual('default-value');
  });

  it('should return value of specified form control', () => {
    const result = component.getValue('sa_prem_select');
    expect(result).toEqual('default-value'); // Adjust the expected value as needed
  });

  it('should return value of specified form control', () => {
    const result = component.getValue('sa_prem_select');
    expect(result).toEqual('default-value'); // Adjust the expected value as needed
  });

  it('should call selectDate', () => {
    component.selectDate();
    expect(spinner_service.show).toHaveBeenCalledWith('whole');
    expect(component.isProductReady).toBe(true);
    expect(spinner_service.hide).toHaveBeenCalledWith('whole');
  });

  it('should call ProductService and update component properties', () => {

    const event = { target: { value: '1' } };
    const productOptionsMock = [{ code: 1, product_code: 1, desc: 'Option 1' }];

    jest.spyOn(product_service, 'getListOfProductOptionByProductCode').mockReturnValue(of(productOptionsMock))
      component.selectProduct(event);

    expect(spinner_service.show).toHaveBeenCalledWith('whole');
    expect(product_service.getListOfProductOptionByProductCode).toHaveBeenCalledWith(1);
    expect(component.productOptionList).toEqual([{ code: 0, product_code: 0, desc: 'SELECT PRODUCT OPTION' }, ...productOptionsMock]);
    expect(component.isOptionReady).toBe(true);
  });




});
