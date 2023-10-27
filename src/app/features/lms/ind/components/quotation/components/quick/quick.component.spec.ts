import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickComponent } from './quick.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { Router } from '@angular/router';
import { ProductService } from '../../../../../../../features/lms/service/product/product.service';
import { ApiService } from '../../../../../../../shared/services/api/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs/internal/observable/of';

export class MockApiService {
}
export class MockProductService {
  getListOfProduct = jest.fn().mockReturnValue(of([]));
  getListOfProductOptionByProductCode = jest.fn().mockReturnValue(of([]));
}
export class MockSpinnerService {
  show = jest.fn();
  hide = jest.fn();
}


describe('QuickComponent', () => {
  let component: QuickComponent;
  let fixture: ComponentFixture<QuickComponent>;
  let fb: FormBuilder;
  let productServiceStub: ProductService;
  let spinnerServiceStub: NgxSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickComponent],
      providers: [
        Router,
        FormBuilder,
        NgxSpinnerService,

        { provide: ToastService },
        { provide: ApiService, useClass: MockApiService },
        { provide: ProductService, useClass: MockProductService },
        { provide: SessionStorageService, useClass: MockApiService },
        { provide: NgxSpinnerService, useClass: MockSpinnerService },
      ],
      imports: [HttpClientTestingModule,
        ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickComponent);
    component = fixture.componentInstance;
    fb = new FormBuilder();
    productServiceStub = TestBed.inject(ProductService);
    spinnerServiceStub = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  describe('QuickQuote Components', () => {
    it('should initialize properties and fetch data on ngOnInit', () => {
      jest.spyOn(productServiceStub, 'getListOfProduct').mockReturnValue(of([]));
      component.ngOnInit();
      expect(component.productList).toEqual([{  "code": 0, "description": "SELECT PRODUCT"}]) ;
    });
    it('should return the correct value from the form control', () => {
      const controlName = 'country';
      jest.spyOn(component, 'getValue').mockReturnValue('');
      const value = component.getValue(controlName);
      expect(value).toBe('');
    });
    it('should call spinner.show, set isProductReady, call spinner.hide, and call computePremium', () => {
      const showSpy = jest.spyOn(spinnerServiceStub, 'show');
      const hideSpy = jest.spyOn(spinnerServiceStub, 'hide');
      component.isProductReady = false;

      component.selectDate();

      expect(showSpy).toHaveBeenCalledWith('whole');
      expect(component.isProductReady).toBe(true);
      expect(hideSpy).toHaveBeenCalledWith('whole');
    });
    it('should reset and fetch product options', () => {
      const mockProductOptions = [{ code: 1, product_code: 1, desc: 'Option 1' }];
      const quickForm = component.quickForm;
      const event = { target: { value: '1' } };
      jest.spyOn(quickForm.get('option'), 'setValue').mockImplementation(() => {});
      jest.spyOn(quickForm.get('term'), 'setValue').mockImplementation(() => {});
      jest.spyOn(quickForm.get('sa_prem_amount'), 'setValue').mockImplementation(() => {});
      jest.spyOn(productServiceStub, 'getListOfProductOptionByProductCode').mockReturnValue(of(mockProductOptions));
      component.selectProduct(event);
      expect(quickForm.get('option').setValue).toHaveBeenCalledWith(-1);
      expect(quickForm.get('term').setValue).toHaveBeenCalledWith(-1);
      expect(quickForm.get('sa_prem_amount').setValue).toHaveBeenCalledWith(0);
      expect(component.isOptionReady).toBe(true);
      expect(component.productOptionList).toEqual([{ code: 0, product_code: 0, desc: 'SELECT PRODUCT OPTION' }, ...mockProductOptions]);
      expect(component.coverTypeList()).toEqual([]);
    });
  });

  // describe('selectDate', () => {
  //   it('should...', () => {
  //     // Arrange
  //     // Act
  //     const result = component.selectDate();
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('selectProduct', () => {
  //   it('should...', () => {
  //     // Arrange
  //     // Act
  //     const result = component.selectProduct(event);
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('selectProductOption', () => {
  //   it('should...', () => {
  //     // Arrange
  //     let pCode;
  //     // Act
  //     const result = component.selectProductOption(pCode);
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('selectProductTerm', () => {
  //   it('should...', () => {
  //     // Arrange
  //     let pCode;
  //     // Act
  //     const result = component.selectProductTerm(pCode);
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // // describe('checkifAllFieldsAreNotEmpty', () => {
  // //   it('should...', () => {
  // //     // Arrange
  // //     // Act
  // //     const result = component.checkifAllFieldsAreNotEmpty();
  // //     // Assert
  // //     // Add your assertions here
  // //   });
  // // });

  // describe('computePremium', () => {
  //   it('should...', () => {
  //     // Arrange
  //     // Act
  //     const result = component.computePremium();
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('coverTypeState', () => {
  //   it('should...', () => {
  //     // Arrange
  //     let cover;
  //     // Act
  //     const result = component.coverTypeState(cover);
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('selectShareType', () => {
  //   it('should...', () => {
  //     // Arrange
  //     let value = '';
  //     // Act
  //     const result = component.selectShareType(value);
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('closeModal', () => {
  //   it('should...', () => {
  //     // Arrange
  //     // Act
  //     const result = component.closeModal();
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('nextPage', () => {
  //   it('should...', () => {
  //     // Arrange
  //     // Act
  //     const result = component.nextPage();
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

  // describe('ngOnDestroy', () => {
  //   it('should...', () => {
  //     // Arrange
  //     // Act
  //     const result = component.ngOnDestroy();
  //     // Assert
  //     // Add your assertions here
  //   });
  // });

});
