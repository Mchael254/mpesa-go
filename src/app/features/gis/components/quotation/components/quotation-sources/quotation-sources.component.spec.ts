import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QuotationSourcesComponent } from './quotation-sources.component';
import { MenuService } from '../../../../../base/services/menu.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';

describe('QuotationSourcesComponent', () => {
  let component: QuotationSourcesComponent;
  let fixture: ComponentFixture<QuotationSourcesComponent>;
  let menuService: jest.Mocked<MenuService>;
  let router: jest.Mocked<Router>;
  let quotationService: jest.Mocked<QuotationsService>;
  let globalMessagingService: jest.Mocked<GlobalMessagingService>;
  let translateService: TranslateService;

  const mockQuotationSubMenuList = [
    { name: 'menu1', link: '/link1' },
    { name: 'menu2', link: '/link2' },
    { name: 'menu3', link: '/link3' },
    { name: 'menu4', link: '/link4' },
    { name: 'menu5', link: '/link5' },
    { name: 'menu6', link: '/link6' },
    { name: 'menu7', link: '/link7' }
  ];

  const mockSources = {
    content: [
      { code: 1, description: 'Source 1', applicableModule: 'Q' },
      { code: 2, description: 'Source 2', applicableModule: 'U' }
    ]
  };

  beforeEach(async () => {
    // Create mock services
    menuService = {
      quotationSubMenuList: jest.fn().mockReturnValue(mockQuotationSubMenuList),
      updateSidebarMainMenu: jest.fn()
    } as any;

    router = {
      navigate: jest.fn()
    } as any;

    quotationService = {
      getAllQuotationSources: jest.fn().mockReturnValue(of(mockSources)),
      addQuotationSources: jest.fn().mockReturnValue(of({})),
      deleteQuotationSource: jest.fn().mockReturnValue(of({})),
      editQuotationSource: jest.fn().mockReturnValue(of({}))
    } as any;

    globalMessagingService = {
      displaySuccessMessage: jest.fn(),
      displayErrorMessage: jest.fn(),
      displayInfoMessage: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ QuotationSourcesComponent ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: MenuService, useValue: menuService },
        { provide: Router, useValue: router },
        { provide: QuotationsService, useValue: quotationService },
        { provide: GlobalMessagingService, useValue: globalMessagingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationSourcesComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    // Setup default language and translations
    translateService.setDefaultLang('en');
    translateService.use('en');

    // Mock translation service methods if needed
    jest.spyOn(translateService, 'instant').mockImplementation((key: string) => key);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component correctly', () => {
      component.ngOnInit();
      expect(menuService.quotationSubMenuList).toHaveBeenCalled();
      expect(component.quotationSubMenuList).toEqual(mockQuotationSubMenuList);
      expect(component.sourcesForm).toBeTruthy();
      expect(quotationService.getAllQuotationSources).toHaveBeenCalled();
    });
  });

  describe('dynamicSideBarMenu', () => {
    it('should navigate to the correct link if a menu has a link', () => {
      const menu = { name: 'Test Menu', link: '/test-link', value: 'test' } as SidebarMenu;
      component.dynamicSideBarMenu(menu);
      expect(router.navigate).toHaveBeenCalledWith(['/test-link']);
    });

    it('should update sidebar menu', () => {
      const menu = { name: 'Test Menu', link: '/test-link', value: 'test' } as SidebarMenu;
      component.dynamicSideBarMenu(menu);
      expect(menuService.updateSidebarMainMenu).toHaveBeenCalledWith('test');
    });
  });

  describe('createSourcesForm', () => {
    it('should create a form with required fields', () => {
      component.createSourcesForm();
      expect(component.sourcesForm.get('code')).toBeTruthy();
      expect(component.sourcesForm.get('description')).toBeTruthy();
      expect(component.sourcesForm.get('applicableModule')).toBeTruthy();
    });

    it('should validate required fields', () => {
      component.createSourcesForm();
      const form = component.sourcesForm;
      expect(form.get('description').errors?.['required']).toBeTruthy();
      expect(form.get('applicableModule').errors?.['required']).toBeTruthy();
    });
  });

  describe('sourceModalAction', () => {
    it('should call addSources when no source is selected', () => {
      jest.spyOn(component, 'addSources');
      component.selectedSource = null;
      component.sourceModalAction();
      expect(component.addSources).toHaveBeenCalled();
    });

    it('should call editQuotationSource when a source is selected', () => {
      jest.spyOn(component, 'editQuotationSource');
      component.selectedSource = { code: 1, description: 'Test Source', applicableModule: 'Q' };
      component.sourceModalAction();
      expect(component.editQuotationSource).toHaveBeenCalled();
    });
  });

  describe('addSources', () => {
    it('should not proceed if form is invalid', () => {
      component.addSources();
      expect(quotationService.addQuotationSources).not.toHaveBeenCalled();
      expect(globalMessagingService.displayErrorMessage).not.toHaveBeenCalled();
    });

    it('should add source successfully when form is valid', () => {
      const mockSource = {
        code: 0,
        description: 'Test Source',
        applicableModule: 'Q'
      };

      component.sourcesForm.patchValue(mockSource);
      component.closebutton = { nativeElement: { click: jest.fn() } };

      component.addSources();

      expect(quotationService.addQuotationSources).toHaveBeenCalledWith(mockSource);
      expect(globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        'Success',
        'Source added successfully'
      );
    });

    it('should handle error when adding source fails', () => {
      const mockError = new Error('Add failed');
      quotationService.addQuotationSources = jest.fn().mockReturnValue(throwError(() => mockError));

      component.sourcesForm.patchValue({
        description: 'Test Source',
        applicableModule: 'Q'
      });
      component.closebutton = { nativeElement: { click: jest.fn() } };

      component.addSources();

      expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to add source...Try again later'
      );
    });
  });

  describe('fetchSources', () => {
    it('should fetch sources successfully', () => {
      component.fetchSources();
      expect(quotationService.getAllQuotationSources).toHaveBeenCalled();
      expect(component.sources).toEqual(mockSources.content);
      expect(globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        'Success',
        'Sources fetched successfully'
      );
    });

    it('should handle error when fetching sources fails', () => {
      const mockError = new Error('Fetch failed');
      quotationService.getAllQuotationSources = jest.fn().mockReturnValue(throwError(() => mockError));

      component.fetchSources();

      expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to fetch sources...Try again later'
      );
    });
  });

  describe('onSourceSelect', () => {
    it('should update selectedSource when a source is selected', () => {
      const source = { code: 1, description: 'Test Source', applicableModule: 'Q' };
      component.onSourceSelect(source);
      expect(component.selectedSource).toEqual(source);
    });
  });

  describe('getApplicableModuleLabel', () => {
    it('should return correct label for valid module value', () => {
      expect(component.getApplicableModuleLabel('Q')).toBe('Quotation');
      expect(component.getApplicableModuleLabel('U')).toBe('Underwriting');
      expect(component.getApplicableModuleLabel('B')).toBe('Underwriting & Quotation');
    });

    it('should return value if module not found', () => {
      expect(component.getApplicableModuleLabel('X')).toBe('X');
    });
  });

  describe('openSourceDeleteModal', () => {
    it('should show error message if no source is selected', () => {
      component.selectedSource = null;
      component.openSourceDeleteModal();
      expect(globalMessagingService.displayInfoMessage).toHaveBeenCalledWith('Error', 'Select a quotation source to continue');
    });

    it('should open delete modal if a source is selected', () => {
      document.body.innerHTML = '<button id="openSourceDeleteButton"></button>';
      const modalButton = document.getElementById("openSourceDeleteButton");
      jest.spyOn(modalButton, 'click');

      component.selectedSource = { code: 1, description: 'Test Source', applicableModule: 'Q' };
      component.openSourceDeleteModal();
      expect(modalButton.click).toHaveBeenCalled();
    });
  });

  describe('deleteQuotationSource', () => {
    it('should delete source successfully', () => {
      component.selectedSource = { code: 1, description: 'Source 1', applicableModule: 'Q' };
      component.deleteQuotationSource();

      expect(quotationService.deleteQuotationSource).toHaveBeenCalledWith(1);
      expect(globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        'Success',
        'Quotation source deleted successfully'
      );
    });

    it('should handle error when deleting source fails', () => {
      const mockError = new Error('Delete failed');
      quotationService.deleteQuotationSource = jest.fn().mockReturnValue(throwError(() => mockError));

      component.selectedSource = { code: 1, description: 'Source 1', applicableModule: 'Q' };
      component.deleteQuotationSource();

      expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to delete the quotation source...Try again later'
      );
    });
  });

  describe('openSourceEditModal', () => {
    it('should show error message if no source is selected', () => {
      component.selectedSource = null;
      component.openSourceEditModal();
      expect(globalMessagingService.displayInfoMessage).toHaveBeenCalledWith('Error', 'Select a quotation source to continue');
    });

    it('should populate form if a source is selected', () => {
      const source = { code: 1, description: 'Test Source', applicableModule: 'Q' };
      component.selectedSource = source;
      jest.spyOn(component, 'populateForm');

      component.openSourceEditModal();
      expect(component.populateForm).toHaveBeenCalled();
    });
  });

  describe('editQuotationSource', () => {
    it('should edit source successfully when form is valid', () => {
      const mockSource = {
        code: 1,
        description: 'Updated Source',
        applicableModule: 'Q'
      };

      component.sourcesForm.patchValue(mockSource);
      component.closebutton = { nativeElement: { click: jest.fn() } };

      component.editQuotationSource();

      expect(quotationService.editQuotationSource).toHaveBeenCalledWith(mockSource);
      expect(globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        'Success',
        'Source edited successfully'
      );
    });

    it('should handle error when editing source fails', () => {
      const mockError = new Error('Edit failed');
      quotationService.editQuotationSource = jest.fn().mockReturnValue(throwError(() => mockError));

      component.sourcesForm.patchValue({
        code: 1,
        description: 'Updated Source',
        applicableModule: 'Q'
      });
      component.closebutton = { nativeElement: { click: jest.fn() } };

      component.editQuotationSource();

      expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to edit source...Try again later'
      );
    });
  });

  describe('clearForm', () => {
    it('should reset form to initial state', () => {
      const resetSpy = jest.spyOn(component.sourcesForm, 'reset');
      component.clearForm();
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('translations', () => {
    it('should translate text using translate pipe', () => {
      const translatedText = translateService.instant('some.translation.key');
      expect(translatedText).toBeDefined();
    });
  });
});
