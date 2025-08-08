import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmScreensConfigComponent } from './crm-screens-config.component';
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

  it('should update selectedSubModule data in subModules array', () => {
    component.subModules = [{ code: 1, label: {en: 'en', ke: 'ke', fr: 'fr'}, subModuleId: 'Entity', moduleCode: 1, moduleName: 'ModuleName', order: 1, visible: true, originalLabel: 'OriginalLabel' }];
    component.selectedSubModule = component.subModules[0];
    component.subModulesForm.patchValue({ visible: 'N', subModuleLevel: 3 });
    component.saveSubModules();
    expect(component.subModules[0].visible).toBe(false);
    expect(component.subModules[0].order).toBe(3);
  });

});
