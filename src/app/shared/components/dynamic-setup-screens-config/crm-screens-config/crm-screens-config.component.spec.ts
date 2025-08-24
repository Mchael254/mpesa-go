import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CrmScreensConfigComponent} from './crm-screens-config.component';
import {UtilService} from "../../../services";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TranslateModule} from "@ngx-translate/core";
import {DynamicScreensSetupService} from "../../../services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {GlobalMessagingService} from "../../../services/messaging/global-messaging.service";

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
  displayInfoMessage = jest.fn((summary, detail) => {
    return;
  });
}

 export class MockUtilService {
   currentLanguage = of('en');
 }

export class MockDynamicScreensSetupService {
  updateScreenSetup = jest.fn().mockReturnValue(of([]))
  fetchSubModules = jest.fn().mockReturnValue(of([]))
  fetchScreens = jest.fn().mockReturnValue(of([]))
  fetchSections = jest.fn().mockReturnValue(of([]))
  fetchGroups = jest.fn().mockReturnValue(of([]))
  fetchSubGroups = jest.fn().mockReturnValue(of([]))
  fetchFormFields = jest.fn().mockReturnValue(of([]))
}

describe('CrmScreensConfigComponent', () => {
  let component: CrmScreensConfigComponent;
  let fixture: ComponentFixture<CrmScreensConfigComponent>;
  let utilServiceStub: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrmScreensConfigComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: UtilService, useClass: MockUtilService},
        {provide: DynamicScreensSetupService, useClass: MockDynamicScreensSetupService},
        {provide: GlobalMessagingService, useClass: MockGlobalMessageService}
      ]
    });
    fixture = TestBed.createComponent(CrmScreensConfigComponent);
    component = fixture.componentInstance;
    utilServiceStub = TestBed.inject(UtilService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open sub modules Modal', () => {
    component.openSubModulesModal();

    const modal = document.getElementById('subModuleModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close sub modules Modal', () => {
    const modal = document.getElementById('subModuleModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeSubModulesModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open sub modules Modal', () => {
    component.openScreensModal();

    const modal = document.getElementById('screensModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close sub modules Modal', () => {
    const modal = document.getElementById('screensModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeScreensModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open sections Modal', () => {
    component.openSectionsModal();

    const modal = document.getElementById('sectionsModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close sections Modal', () => {
    const modal = document.getElementById('sectionsModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeSectionsModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open sub sections Modal', () => {
    component.openSubSectionsModal();

    const modal = document.getElementById('subSectionsModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close sub sections Modal', () => {
    const modal = document.getElementById('subSectionsModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeSubSectionsModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open sub section two Modal', () => {
    component.openSubSectionTwoModal();

    const modal = document.getElementById('subSectionTwoModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close sub section two Modal', () => {
    const modal = document.getElementById('subSectionTwoModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeSubSectionTwoModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open fields Modal', () => {
    component.openFieldsModal();

    const modal = document.getElementById('fieldsModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close fields Modal', () => {
    const modal = document.getElementById('fieldsModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeFieldsModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open export setup Modal', () => {
    component.openExportSetupModal();

    const modal = document.getElementById('exportSetupModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close export setup Modal', () => {
    const modal = document.getElementById('exportSetupModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeExportSetupModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open multilingual Modal', () => {
    component.openMultilingualModal();

    const modal = document.getElementById('multilingualModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close multilingual Modal', () => {
    const modal = document.getElementById('multilingualModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeMultilingualModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open preview Modal', () => {
    component.openPreviewModal();

    const modal = document.getElementById('previewModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close preview Modal', () => {
    const modal = document.getElementById('previewModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closePreviewModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should not close associated modals if yesClicked is true', () => {
    const closeSubModulesModalSpy = jest.spyOn(component, 'closeSubModulesModal');
    const closeScreensModalSpy = jest.spyOn(component, 'closeScreensModal');

    component.modalId = 'subModulesModal';

    component.closeMultilingualModal(true);

    expect(closeSubModulesModalSpy).not.toHaveBeenCalled();
    expect(closeScreensModalSpy).not.toHaveBeenCalled();
  });

  it('should close associated modals if yesClicked is false', () => {
    const closeSubModulesModalSpy = jest.spyOn(component, 'closeSubModulesModal');
    const closeScreensModalSpy = jest.spyOn(component, 'closeScreensModal');
    const closeSectionsModalSpy = jest.spyOn(component, 'closeSectionsModal');

    component.modalId = 'subModulesModal';
    component.closeMultilingualModal(false);
    expect(closeSubModulesModalSpy).toHaveBeenCalled();

    component.modalId = 'screensModal';
    component.closeMultilingualModal(false);
    expect(closeScreensModalSpy).toHaveBeenCalled();

    component.modalId = 'sectionsModal';
    component.closeMultilingualModal(false);
    expect(closeSectionsModalSpy).toHaveBeenCalled();

    component.modalId = 'subSectionsModal';
    component.closeMultilingualModal(false);
    expect(closeSubModulesModalSpy).toHaveBeenCalled();

    component.modalId = 'subSectionTwoModal';
    component.closeMultilingualModal(false);
    expect(closeScreensModalSpy).toHaveBeenCalled();

    component.modalId = 'fieldsModal';
    component.closeMultilingualModal(false);
    expect(closeSectionsModalSpy).toHaveBeenCalled();
  });

  it('should call globalMessagingService.displayInfoMessage', () => {
    const displayInfoMessageSpy = jest.spyOn(component['globalMessagingService'], 'displayInfoMessage');
    component.selectedSubModule = { code: 1, label: { en: 'en', ke: 'ke', fr: 'fr' }, subModuleId: 'Entity', moduleCode: 1, moduleName: 'ModuleName', order: 1, visible: true, originalLabel: 'OriginalLabel' };
    component.subModulesForm.patchValue({ visible: 'Y', subModuleLevel: 2 });
    component.saveSubModules();
    expect(displayInfoMessageSpy).toHaveBeenCalledWith('Info', 'Publish to save sub module changes.');
  });

    it('should update selectedScreen data in screens array', () => {
        component.screens = [
            {
              code: 1,
              label: {en: 'en', ke: 'ke', fr: 'fr'},
              screenId: 'Screen1',
              subModuleCode: 1,
              order: 1,
              visible: true,
              originalLabel: 'OriginalLabel',
              hasFields: true
            }
        ];
        component.selectedScreen = component.screens[0];
        component.screensForm.patchValue({visible: 'N', screenLevel: 2});
        component.saveScreens();

        expect(component.screens[0].visible).toBe(false);
        expect(component.screens[0].order).toBe(2);
    });

    it('should call updateMultilingualLabel with correct parameters for screens', () => {
        const updateMultilingualLabelSpy = jest.spyOn(component, 'updateMultilingualLabel');
        component.screens = [
            {
              code: 1,
              label: {en: 'English', ke: 'Swahili', fr: 'French'},
              screenId: 'Screen1',
              subModuleCode: 1,
              order: 1,
              visible: true,
              originalLabel: 'OriginalLabel',
              hasFields: true
            }
        ];
        component.selectedScreen = component.screens[0];
        component.screensForm.patchValue({currentScreenLabel: 'Updated Label'});
        component.saveScreens();

        expect(updateMultilingualLabelSpy).toHaveBeenCalledWith(
            component.selectedScreen,
            component.screensForm,
            'currentScreenLabel'
        );
        expect(component.selectedScreen.label.en).toBe('Updated Label');
    });

    it('should invoke globalMessagingService.displayInfoMessage on successful save', () => {
        const displayInfoMessageSpy = jest.spyOn(component['globalMessagingService'], 'displayInfoMessage');
        component.selectedScreen = {
          code: 1,
          label: {en: 'English', ke: 'Swahili', fr: 'French'},
          screenId: 'Screen1',
          subModuleCode: 1,
          order: 1,
          visible: true,
          originalLabel: 'OriginalLabel',
          hasFields: true
        };
        component.screensForm.patchValue({visible: 'Y', screenLevel: 1});
        component.saveScreens();

        expect(displayInfoMessageSpy).toHaveBeenCalledWith('Info', 'Publish to save screen changes.');
    });

    it('should open multilingual modal after saving screens', () => {
        const openMultilingualModalSpy = jest.spyOn(component, 'openMultilingualModal');
        component.selectedScreen = {
          code: 1,
          label: {en: 'English', ke: 'Swahili', fr: 'French'},
          screenId: 'Screen1',
          subModuleCode: 1,
          order: 1,
          visible: true,
          originalLabel: 'OriginalLabel',
          hasFields: true
        };
        component.screensForm.patchValue({visible: 'Y', screenLevel: 1});

        component.saveScreens();

        expect(component.modalId).toBe('screensModal');
        expect(openMultilingualModalSpy).toHaveBeenCalled();
    });

  it('should update the selected section with correct multilingual label', () => {
    const updateMultilingualLabelSpy = jest.spyOn(component, 'updateMultilingualLabel');
    component.selectedSection = {
      code: 1,
      formId: 'form1',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      screenCode: 1,
      order: 1,
      visible: true,
      originalLabel: 'OriginalLabel',
      hasFields: true
    };
    component.sectionsForm.patchValue({ currentSectionLabel: 'Updated Label' });

    component.saveSections();

    expect(updateMultilingualLabelSpy).toHaveBeenCalledWith(
      component.selectedSection,
      component.sectionsForm,
      'currentSectionLabel'
    );
    expect(component.selectedSection.label.en).toBe('Updated Label');
  });

  it('should update sections array with modified selectedSection', () => {
    component.sections = [
      {
        code: 1,
        formId: 'form1',
        label: { en: 'English', ke: 'Swahili', fr: 'French' },
        screenCode: 1,
        order: 1,
        visible: true,
        originalLabel: 'OriginalLabel',
        hasFields: true,
      },
    ];
    component.selectedSection = component.sections[0];
    component.sectionsForm.patchValue({ sectionLevel: 2, visible: 'N' });

    component.saveSections();

    expect(component.sections[0].visible).toBe(false);
    expect(component.sections[0].order).toBe(2);
  });

  it('should call globalMessagingService.displayInfoMessage with correct parameters', () => {
    const displayInfoMessageSpy = jest.spyOn(component['globalMessagingService'], 'displayInfoMessage');
    component.selectedSection = {
      code: 1,
      formId: 'form1',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      screenCode: 1,
      order: 1,
      visible: true,
      originalLabel: 'OriginalLabel',
      hasFields: true,
    };
    component.sectionsForm.patchValue({ visible: 'Y', sectionLevel: 1 });

    component.saveSections();

    expect(displayInfoMessageSpy).toHaveBeenCalledWith('Info', 'Publish to save section changes.');
  });

  it('should set modalId to "sectionsModal" and call openMultilingualModal', () => {
    const openMultilingualModalSpy = jest.spyOn(component, 'openMultilingualModal');
    component.selectedSection = {
      code: 1,
      formId: 'form1',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      screenCode: 1,
      order: 1,
      visible: true,
      originalLabel: 'OriginalLabel',
      hasFields: true,
    };
    component.sectionsForm.patchValue({ visible: 'Y', sectionLevel: 1 });

    component.saveSections();

    expect(component.modalId).toBe('sectionsModal');
    expect(openMultilingualModalSpy).toHaveBeenCalled();
  });

  it('should call updateMultilingualLabel with the correct parameters', () => {
    const updateMultilingualLabelSpy = jest.spyOn(component, 'updateMultilingualLabel');
    component.selectedSubSection = {
      code: 1,
      formCode: 1,
      groupId: 'group1',
      originalLabel: 'OriginalLabel',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      screenCode: 1,
      subModuleCode: 1,
      order: 1,
      visible: true,
      hasFields: true,
      subGroup: []
    };
    component.subSectionsForm.patchValue({ currentSubSectionLabel: 'Updated Label' });

    component.saveSubSections();

    expect(updateMultilingualLabelSpy).toHaveBeenCalledWith(
      component.selectedSubSection,
      component.subSectionsForm,
      'currentSubSectionLabel'
    );
    expect(component.selectedSubSection.label.en).toBe('Updated Label');
  });

  it('should update the subSections array with modified selectedSubSection', () => {
    component.subSections = [
      {
        code: 1,
        formCode: 1,
        groupId: 'group1',
        originalLabel: 'OriginalLabel',
        label: { en: 'English', ke: 'Swahili', fr: 'French' },
        screenCode: 1,
        subModuleCode: 1,
        order: 1,
        visible: true,
        hasFields: true,
        subGroup: []
      }
    ];
    component.selectedSubSection = component.subSections[0];
    component.subSectionsForm.patchValue({ subSectionLevel: 2, visible: 'N' });

    component.saveSubSections();

    expect(component.subSections[0].visible).toBe(false);
    expect(component.subSections[0].order).toBe(2);
  });

  it('should call globalMessagingService.displayInfoMessage with correct parameters', () => {
    const displayInfoMessageSpy = jest.spyOn(component['globalMessagingService'], 'displayInfoMessage');
    component.selectedSubSection = {
      code: 1,
      formCode: 1,
      groupId: 'group1',
      originalLabel: 'OriginalLabel',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      screenCode: 1,
      subModuleCode: 1,
      order: 1,
      visible: true,
      hasFields: true,
      subGroup: []
    };
    component.subSectionsForm.patchValue({ visible: 'Y', subSectionLevel: 1 });

    component.saveSubSections();

    expect(displayInfoMessageSpy).toHaveBeenCalledWith('Info', 'Publish to save sub section changes.');
  });

  it('should set modalId to "subSectionsModal" and call openMultilingualModal', () => {
    const openMultilingualModalSpy = jest.spyOn(component, 'openMultilingualModal');
    component.selectedSubSection = {
      code: 1,
      formCode: 1,
      groupId: 'group1',
      originalLabel: 'OriginalLabel',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      screenCode: 1,
      subModuleCode: 1,
      order: 1,
      visible: true,
      hasFields: true,
      subGroup: []
    };
    component.subSectionsForm.patchValue({ visible: 'Y', subSectionLevel: 1 });

    component.saveSubSections();

    expect(component.modalId).toBe('subSectionsModal');
    expect(openMultilingualModalSpy).toHaveBeenCalled();
  });

  it('should call updateMultilingualLabel with the correct parameters', () => {
    const updateMultilingualLabelSpy = jest.spyOn(component, 'updateMultilingualLabel');
    component.selectedSubSectionTwo = {
      code: 1,
      formGroupingCode: 1,
      originalLabel: 'Original Label',
      subGroupId: 'subGroup1',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      addButtonTextLabel: null,
      visible: true,
      order: 1,
      hasFields: true
    };

    component.subSectionTwoForm.patchValue({ currentSubSectionTwoLabel: 'Updated Label' });
    component.saveSubSectionTwo();

    expect(updateMultilingualLabelSpy).toHaveBeenCalledWith(
      component.selectedSubSectionTwo,
      component.subSectionTwoForm,
      'currentSubSectionTwoLabel'
    );
    expect(component.selectedSubSectionTwo.label.en).toBe('Updated Label');
  });

  it('should call closeSubSectionTwoModal after saving', () => {
    const closeSubSectionTwoModalSpy = jest.spyOn(component, 'closeSubSectionTwoModal');
    component.selectedSubSectionTwo = {
      code: 1,
      formGroupingCode: 1,
      originalLabel: 'Original Label',
      subGroupId: 'subGroup1',
      label: { en: 'English', ke: 'Swahili', fr: 'French' },
      addButtonTextLabel: null,
      visible: true,
      order: 1,
      hasFields: true
    };

    component.subSectionTwoForm.patchValue({ visible: 'Y', subSectionTwoLevel: 1 });
    component.saveSubSectionTwo();

    expect(closeSubSectionTwoModalSpy).toHaveBeenCalled();
  });
});
