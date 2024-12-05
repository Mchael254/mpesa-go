import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickQuoteFormComponent } from './quick-quote-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserStorage } from "../../../../../../shared/services/storage";
import { APP_BASE_HREF, CommonModule, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { SharedModule, untilDestroyed } from '../../../../../../shared/shared.module';
import { ProductsService } from '../../../setups/services/products/products.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';


class MockNgxSpinnerService {
  show = jest.fn();
  hide = jest.fn();
}

export class MockBrowserStorage {
  getItem = jest.fn();
  setItem = jest.fn();
}
export class mockQuotationService {
  getAllQuotationSources = jest.fn().mockReturnValue(of());
  getFormFields = jest.fn().mockReturnValue(of());
  createQuotationRisk = jest.fn().mockReturnValue(of());
  premiumComputationEngine = jest.fn().mockReturnValue(of());
}
export class mockProductService {
  getAllProducts = jest.fn().mockReturnValue(of());
  getCoverToDate = jest.fn().mockReturnValue(of());
  getYearOfManufacture = jest.fn().mockReturnValue(of());
  getProductSubclasses = jest.fn().mockReturnValue(of());

}
export class mockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue(of());
  getCurrentUser = jest.fn().mockReturnValue(of());
}
export class mockBranchService {
  getAllBranches = jest.fn().mockReturnValue(of());
}
export class mockClientService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById = jest.fn().mockReturnValue(of());
}
export class mockCountryService {
  getCountries = jest.fn().mockReturnValue(of());
}
export class mockSubclassService {
  getAllSubclasses = jest.fn().mockReturnValue(of());
}
export class mockBinderService {
  getAllBindersQuick = jest.fn().mockReturnValue(of());
}
export class mockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of());
}
export class mockSubclassCovertypeService {
  getSubclassCovertypeBySCode = jest.fn().mockReturnValue(of());
}
export class mockSubclassSectionCovertypeService {
  getSubclassCovertypeSections = jest.fn().mockReturnValue(of());
}
export class mockSectionService {
  getSectionByCode = jest.fn().mockReturnValue(of());
}
export class mockPremiumRateService {
  getAllPremiums = jest.fn().mockReturnValue(of());
}
// jest.mock('ng2-pdf-viewer', () => ({
//   PdfViewerModule: jest.fn().mockImplementation(() => {}),
// }));
jest.mock('ng2-pdf-viewer', () => ({
  PdfViewerComponent: jest.fn(),
}));
describe('QuickQuoteFormComponent', () => {
  let component: QuickQuoteFormComponent;
  let fixture: ComponentFixture<QuickQuoteFormComponent>;
  // let crm_client_service: ClientService;
  let spinner_service: NgxSpinnerService;
  let router: Router;
  let globalMessagingService: GlobalMessagingService;
  let quotationService: QuotationsService;
  let productService: ProductsService;
  let authService: AuthService;
  let branchService: BranchService;
  let clientService: ClientService;
  let countryService: CountryService;
  let subclassService: SubclassesService;
  let binderService: BinderService;
  let currencyService: CurrencyService;
  let subclassCoverTypesService: SubClassCoverTypesService;
  let subclassSectionCovertypeService: SubClassCoverTypesSectionsService;
  let sectionService: SectionsService;
  let premiumRateService: PremiumRateService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickQuoteFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule
      ],
      providers: [
        { provide: QuotationsService, useClass: mockQuotationService },
        { provide: ProductsService, useClass: mockProductService },
        { provide: AuthService, useClass: mockAuthService },
        { provide: BranchService, useClass: mockBranchService },
        { provide: ClientService, useClass: mockClientService },
        { provide: CountryService, useClass: mockCountryService },
        { provide: SubclassesService, useClass: mockSubclassService },
        { provide: BinderService, useClass: mockBinderService },
        { provide: CurrencyService, useClass: mockCurrencyService },
        { provide: SubClassCoverTypesService, useClass: mockSubclassCovertypeService },
        { provide: SubClassCoverTypesSectionsService, useClass: mockSubclassSectionCovertypeService },
        { provide: SectionsService, useClass: mockSectionService },
        { provide: PremiumRateService, useClass: mockPremiumRateService },
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: APP_BASE_HREF, useValue: '/' },


        GlobalMessagingService, MessageService,
        FormBuilder, DatePipe


      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
     

    fixture = TestBed.createComponent(QuickQuoteFormComponent);
    component = fixture.componentInstance;
    // crm_client_service = TestBed.inject(ClientService);
    spinner_service = TestBed.inject(NgxSpinnerService);
    globalMessagingService = TestBed.inject(GlobalMessagingService);
    quotationService = TestBed.inject(QuotationsService);
    productService = TestBed.inject(ProductsService);
    authService = TestBed.inject(AuthService);
    branchService = TestBed.inject(BranchService);
    clientService = TestBed.inject(ClientService);
    countryService = TestBed.inject(CountryService);
    subclassService = TestBed.inject(SubclassesService);
    binderService = TestBed.inject(BinderService);
    currencyService = TestBed.inject(CurrencyService);
    subclassCoverTypesService = TestBed.inject(SubClassCoverTypesService);
    subclassSectionCovertypeService = TestBed.inject(SubClassCoverTypesSectionsService);
    sectionService = TestBed.inject(SectionsService);
    premiumRateService = TestBed.inject(PremiumRateService);
    component.personalDetailsForm = new FormGroup({});
    component.clientForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);

    fixture.detectChanges();

  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
