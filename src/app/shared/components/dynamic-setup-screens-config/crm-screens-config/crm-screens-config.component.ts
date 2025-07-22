import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BreadCrumbItem} from "../../../data/common/BreadCrumbItem";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../services";
import {GlobalMessagingService} from "../../../services/messaging/global-messaging.service";
import {LANGUAGES, LanguagesDto} from "../../../data/common/languages-dto";
import {TranslateService} from "@ngx-translate/core";
import {DynamicScreensSetupService} from "../../../services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {
  DynamicScreenSetupDto,
  FormGroupsDto, MultilingualText,
  ScreenFormsDto,
  ScreensDto,
  SubModulesDto
} from "../../../data/common/dynamic-screens-dto";

const log = new Logger('CrmScreensConfigComponent');
@Component({
  selector: 'app-crm-screens-config',
  templateUrl: './crm-screens-config.component.html',
  styleUrls: ['./crm-screens-config.component.css']
})
export class CrmScreensConfigComponent implements OnInit {
  editMode: boolean = false;

  subModulesForm: FormGroup;
  screensForm: FormGroup;
  sectionsForm: FormGroup;
  subSectionsForm: FormGroup;
  fieldsForm: FormGroup;

  selectedSubModule: SubModulesDto = null;
  selectedScreen: ScreensDto = null;
  selectedSection: ScreenFormsDto = null;
  selectedSubSection: FormGroupsDto = null;
  selectedField: any = null;

  subModules: SubModulesDto[] = [];
  screens: ScreensDto[] = [];
  sections: ScreenFormsDto[] = [];
  subSections: FormGroupsDto[] = [];
  /*subSections = [
    { label: 'Prime identity', editable: true },
    { label: 'Contact details', editable: true },
    { label: 'Address details', editable: true },
    { label: 'Financial details', editable: false },
    { label: 'Wealth and AML details', editable: true },
    { label: 'Privacy policy and consent', editable: false },
  ];*/
  columnDialogVisible: boolean = false;
  tableData: any;
  selectedTableRecordIndex: number | null = null;
  pageSize: number;
  columns: any = [
    { field: 'label', header: 'Label', visible: true },
    { field: 'visible', header: 'Visible', visible: true },
    { field: 'disabled', header: 'Disabled', visible: true },
    { field: 'mandatory', header: 'Mandatory', visible: true },
    { field: 'order', header: 'Order', visible: true },
    { field: 'type', header: 'Type', visible: true },
    { field: 'validations', header: 'Validations', visible: true },
  ];
  selectedTableRecordDetails: any;
  tableTitle: string = 'Table';

  languages: LanguagesDto[] = LANGUAGES;
  defaultLanguage: string = 'fi fi-gb fis';
  language: string = 'en'

  // All possible validations
  availableValidations: string[] = ['min', 'max', 'pattern', 'required'];

  dynamicConfigBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Administration',
      url: '/home/screen-setup',
    },
    {
      label: 'Dynamic Setup',
      url: '/home/screen-setup',
    },
    {
      label: 'CRM',
      url: '/home/screen-setup',
    },
    {
      label: 'Entities',
      url: '/home/crm-screen-setup',
    },
  ];

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private utilService: UtilService,
    private dynamicScreensSetupService: DynamicScreensSetupService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createSubModuleForm();
    this.createScreensForm();
    this.createSectionsForm();
    this.createSubSectionsForm();
    this.createFieldsForm();
    /*this.tableData = [
      {
        label: 'Field 1',
        visible: 'Yes',
        disabled: 'No',
        mandatory: 'Yes',
        value: 'Value 1',
        section: 'Section 1',
        order: '1',
        type: 'Text',
        min: '0',
        max: '100'
      }
    ];*/
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
    this.fetchSubModules();
  }

  createSubModuleForm(): void {
    this.subModulesForm = this.fb.group({
      originalSubModulesLabel: [{ value: '', disabled: true }],
      module: [{ value: '', disabled: true }],
      currentSubModulesLabel: [''],
      visible: [''],
      subModuleLevel: [''],
      alignment: [''],
    });
  }

  createScreensForm(): void {
    this.screensForm = this.fb.group({
      originalScreenLabel: [{ value: '', disabled: true }],
      subModule: [{ value: '', disabled: true }],
      currentScreenLabel: [''],
      visible: [''],
      screenLevel: [''],
    });
  }

  createSectionsForm(): void {
    this.sectionsForm = this.fb.group({
      originalSectionLabel: [{ value: '', disabled: true }],
      screen: [{ value: '', disabled: true }],
      currentSectionLabel: [''],
      visible: [''],
      sectionLevel: [''],
    });
  }

  createSubSectionsForm(): void {
    this.subSectionsForm = this.fb.group({
      originalSubSectionLabel: [{ value: '', disabled: true }],
      section: [{ value: '', disabled: true }],
      currentSubSectionLabel: [''],
      visible: [''],
      subSectionLevel: [''],
    });
  }

  createFieldsForm(): void {
    this.fieldsForm = this.fb.group({
      originalSectionLabel: [{ value: '', disabled: true }],
      placeholder: [''],
      currentSectionLabel: [''],
      inputType: [{ value: '', disabled: true }],
      visible: [''],
      mandatory: [''],
      disabled: [''],
      section: [{ value: '', disabled: true }],
      order: [''],
      tooltips: [''],
      tooltipWords: [''],
      validations: this.fb.array([]),
    });
  }

  get validations() {
    return this.fieldsForm.get('validations') as FormArray;
  }

  openSubModulesModal() {
    const modal = document.getElementById('subModuleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeSubModulesModal() {
    this.editMode = false;
    const modal = document.getElementById('subModuleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openScreensModal() {
    const modal = document.getElementById('screensModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeScreensModal(){
    this.editMode = false;
    const modal = document.getElementById('screensModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openSectionsModal() {
    const modal = document.getElementById('sectionsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeSectionsModal(){
    this.editMode = false;
    const modal = document.getElementById('sectionsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openSubSectionsModal() {
    const modal = document.getElementById('subSectionsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeSubSectionsModal(){
    this.editMode = false;
    const modal = document.getElementById('subSectionsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openFieldsModal(screen?: any) {
    const modal = document.getElementById('fieldsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
    /*this.screensForm.patchValue({
      originalScreenLabel: screen
    });
    log.info('screens', screen);*/
  }

  closeFieldsModal(){
    this.editMode = false;
    const modal = document.getElementById('fieldsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveSubModules() {
    const data = this.subModulesForm.getRawValue();
    log.info('subModules', data);

    const subModule = this.selectedSubModule;

    this.updateMultilingualLabel(subModule, this.subModulesForm, 'currentSubModulesLabel');

    const payload: SubModulesDto = {
      code: subModule.code,
      label: subModule.label,
      moduleCode: subModule.moduleCode,
      moduleName: subModule.moduleName,
      order: data.subModuleLevel,
      originalLabel: subModule.originalLabel,
      subModuleId: subModule.subModuleId,
      visible: data.visible === 'Y',

    }
    log.info('payload', payload);
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save sub module changes.');
    this.closeSubModulesModal();
  }

  saveScreens() {
    const data = this.screensForm.getRawValue();
    const screen = this.selectedScreen;
    log.info('screens', data);

    this.updateMultilingualLabel(screen, this.screensForm, 'currentScreenLabel');

    const payload: ScreensDto = {
      ...screen,
      code: screen.code,
      subModuleCode: screen.subModuleCode,
      screenId: screen.screenId,
      originalLabel: screen.originalLabel,
      label: screen.label,
      visible: data.visible === 'Y',
      order: data.screenLevel
    };

    log.info('Saving screen:', payload);
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save screen changes.');
    this.closeScreensModal();
  }

  saveSections() {
    const data = this.sectionsForm.getRawValue();
    log.info('sections', data);
    const section = this.selectedSection;

    this.updateMultilingualLabel(section, this.sectionsForm, 'currentSectionLabel');

    const payload: ScreenFormsDto = {
      ...section,
      code: section.code,
      formId: section.formId,
      label: section.label,
      order: data.sectionLevel,
      originalLabel: section.originalLabel,
      screenCode: section.screenCode,
      visible: data.visible === 'Y'

    };

    log.info('Saving section:', payload);
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save section changes.');
    this.closeSectionsModal();
  }

  saveSubSections() {
    const data = this.subSectionsForm.getRawValue();
    log.info('subSections', data);
    const subSection = this.selectedSubSection;

    this.updateMultilingualLabel(subSection, this.subSectionsForm, 'currentSubSectionLabel');

    const payload: FormGroupsDto = {
      ...subSection,
      code: subSection.code,
      formCode: subSection.formCode,
      groupId: subSection.groupId,
      originalLabel: subSection.originalLabel,
      label: subSection.label,
      order: data.subSectionLevel,
      screenCode: subSection.screenCode,
      subModuleCode: subSection.subModuleCode,
      visible: data.visible === 'Y',
      subGroup: []
    };

    log.info('Saving sub section:', payload);
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save sub section changes.');
    this.closeSubSectionsModal();
  }

  saveFieldProperties() {
    const data = this.fieldsForm.getRawValue();
    log.info('fields form', data);
  }

  editSubModule(subModule?: any) {
    if (this.selectedSubModule) {
      this.editMode = !this.editMode;
      this.openSubModulesModal();
      this.subModulesForm.patchValue({
        originalSubModulesLabel: subModule.originalLabel,
        module: subModule.moduleName,
        currentSubModulesLabel: subModule.label?.[this.language],
        visible: subModule.visible === true ? 'Y' : 'N',
        subModuleLevel: subModule.order,
        alignment: null,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No sub module is selected'
      );
    }
    this.cdr.detectChanges();
  }

  editScreens(screen?: any) {
    if (this.selectedScreen) {
      this.editMode = !this.editMode;
      this.openScreensModal();
      this.screensForm.patchValue({
        originalScreenLabel: screen.originalLabel,
        subModule: screen.subModuleCode,
        currentScreenLabel: screen.label?.[this.language],
        visible: screen.visible === true ? 'Y' : 'N',
        screenLevel: screen.order
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No screen is selected'
      );
    }
    this.cdr.detectChanges();
  }

  editSections(section?: any) {
    if (this.selectedSection) {
      this.editMode = !this.editMode;
      this.openSectionsModal();
      this.sectionsForm.patchValue({
        originalSectionLabel: section.originalLabel,
        screen: section.screenCode,
        currentSectionLabel: section.label?.[this.language],
        visible: section.visible === true ? 'Y' : 'N',
        sectionLevel: section.order,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No section is selected'
      );
    }
    this.cdr.detectChanges();
  }

  editSubSections(subSection?: any) {
    if (this.selectedSubSection) {
      this.editMode = !this.editMode;
      this.openSubSectionsModal();
      this.subSectionsForm.patchValue({
        originalSubSectionLabel: subSection.originalLabel,
        section: subSection.formCode,
        currentSubSectionLabel: subSection.label?.[this.language],
        visible: subSection.visible === true ? 'Y' : 'N',
        subSectionLevel: subSection.order,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No sub module is selected'
      );
    }
    this.cdr.detectChanges();
  }

  onRowSelect(event: any) {
    this.selectedTableRecordDetails = event.data;
  }

  editSelectedRecord() {

    log.info('selectedTableRecordDetails', this.selectedTableRecordDetails)
    if (this.selectedTableRecordDetails) {
      this.editMode = !this.editMode;
      this.openFieldsModal();
      this.fieldsForm.patchValue({
        originalSectionLabel: this.selectedTableRecordDetails.originalLabel,
        placeholder: this.selectedTableRecordDetails.placeholder?.[this.language],
        currentSectionLabel: this.selectedTableRecordDetails.label?.[this.language],
        inputType: this.selectedTableRecordDetails.type,
        visible: this.selectedTableRecordDetails.visible === true ? 'Y' : 'N',
        mandatory: this.selectedTableRecordDetails.mandatory === true ? 'Y' : 'N',
        section: this.selectedTableRecordDetails.formCode,
        order: this.selectedTableRecordDetails.order,
        tooltips: this.selectedTableRecordDetails.tooltips?.[this.language],
        tooltipWords: this.selectedTableRecordDetails.tooltipWords,
        validationMessage: this.selectedTableRecordDetails.validationMessage,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No field is selected'
      );
    }
  }

  selectLanguage(value){
    // this.translate.use(value.code)
    this.defaultLanguage = value.class;
    this.language = value.code;

    // Patch the form field to show the text for the new language
    /*if (this.selectedSubModule?.label) {
      this.subModulesForm.patchValue({
        currentSubModulesLabel: this.selectedSubModule.label[this.language] || ''
      });
    }*/

    if (this.selectedSubModule) {
      this.patchCurrentLabel(this.subModulesForm, this.selectedSubModule, 'currentSubModulesLabel');
    }

    if (this.selectedScreen) {
      this.patchCurrentLabel(this.screensForm, this.selectedScreen, 'currentScreenLabel');
    }

    if (this.selectedSection) {
      this.patchCurrentLabel(this.sectionsForm, this.selectedSection, 'currentSectionLabel');
    }

    if (this.selectedSubSection) {
      this.patchCurrentLabel(this.subSectionsForm, this.selectedSubSection, 'currentSubSectionLabel');
    }

    if (this.selectedField) {
      this.patchCurrentLabel(this.fieldsForm, this.selectedField, 'currentSectionLabel');
    }

    // this.utilService.setLanguage(value.code);
  }

  updateMultilingualLabel(
    dto: { label: MultilingualText },
    form: FormGroup,
    labelField: string
  ) {
    if (!dto.label) {
      dto.label = { en: '', ke: '', fr: '' };
    }
    dto.label[this.language] = form.get(labelField)?.value || '';
  }

  patchCurrentLabel(
    form: FormGroup,
    dto: { label: MultilingualText },
    labelField: string
  ) {
    if (dto?.label) {
      form.patchValue({
        [labelField]: dto.label[this.language] || ''
      });
    }
  }

  publishChanges() {
    const payload: DynamicScreenSetupDto = {
      // fields: this.fields,
      groups: this.subSections,
      forms: this.sections,
      screens: this.screens,
      subModules: this.subModules,
    };

    log.info('Publishing final payload:', payload);

    this.dynamicScreensSetupService.updateScreenSetup(payload)
      .subscribe({
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success', 'Changes published successfully!'
          );
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error', 'Failed to publish changes.'
          );
        }
      });
  }

  addSection() {
    const group = this.fb.group({
      type: [null, Validators.required],
      value: [{ value: '', disabled: true }, Validators.required],
      errorMessage: [{ value: '', disabled: true }, Validators.required],
    });

    group.get('type')?.valueChanges.subscribe(selected => {
      if (selected) {
        group.get('value')?.enable();
        group.get('errorMessage')?.enable();
      } else {
        group.get('value')?.disable();
        group.get('errorMessage')?.disable();
      }
    });

    this.validations.push(group);
  }


  removeSection(index: number) {
    this.validations.removeAt(index);
  }

  getRemainingValidations(currentType?: string | null) {
    const selected = this.validations.controls
      .map(ctrl => ctrl.get('type')?.value)
      .filter((t: string | null) => t && t !== currentType);
    return this.availableValidations.filter(v => !selected.includes(v));
  }

  onClickSubModule(subModule: any) {
    this.selectedSubModule = subModule;
    this.selectedScreen = null;
    this.fetchScreens(subModule.code);
    this.fetchFormFields(subModule.code)
  }

  onClickScreen(screen: any) {
    this.selectedScreen = screen;
    this.selectedSection = null;
    this.fetchSections(screen.code)
  }

  onClickSection(section: any) {
    this.selectedSection = section;
    this.fetchSubSections(this.selectedSubModule.code, null, section.code)
  }

  onClickSubSection(subSection: any) {
    this.selectedSubSection = subSection
  }

  fetchSubModules() {
    this.dynamicScreensSetupService.fetchSubModules(null, "account_management")
      .subscribe({
        next: (data) => {
          this.subModules = data.sort((a, b) => a.order - b.order);
          log.info("sub modules>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  fetchScreens(subModuleCode?: number) {
    this.dynamicScreensSetupService.fetchScreens(subModuleCode)
      .subscribe({
        next: (data) => {
          this.screens = data.sort((a, b) => a.order - b.order);
          log.info("screens>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  fetchSections(screenCode?: number) {
    this.dynamicScreensSetupService.fetchSections(screenCode)
      .subscribe({
        next: (data) => {
          this.sections = data.sort((a, b) => a.order - b.order);
          log.info("sections>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  fetchSubSections(subModuleCode?: number, screenCode?: number, formCode?: number) {
    this.dynamicScreensSetupService.fetchGroups(subModuleCode, screenCode, formCode)
      .subscribe({
        next: (data) => {
          this.subSections = data.sort((a, b) => a.order - b.order);
          log.info("sub sections>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  fetchFormFields(subModuleCode?: number, screenCode?: number, formCode?: number, formGroupingsCode?: number, formSubGroupCode?: number) {
    this.dynamicScreensSetupService.fetchFormFields(subModuleCode, screenCode, formCode, formGroupingsCode, formSubGroupCode)
      .subscribe({
        next: (data) => {
          this.tableData = data;
          log.info("fields>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }
}
