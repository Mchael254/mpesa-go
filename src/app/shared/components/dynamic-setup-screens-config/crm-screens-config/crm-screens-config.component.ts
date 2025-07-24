import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../data/common/BreadCrumbItem";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../services";
import {GlobalMessagingService} from "../../../services/messaging/global-messaging.service";
import {LANGUAGES, LanguagesDto} from "../../../data/common/languages-dto";
import {TranslateService} from "@ngx-translate/core";
import {DynamicScreensSetupService} from "../../../services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, MultilingualText,
  ScreenFormsDto,
  ScreensDto,
  SubModulesDto, Validation
} from "../../../data/common/dynamic-screens-dto";
import {Table} from "primeng/table";

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

  subModules: SubModulesDto[] = [];
  screens: ScreensDto[] = [];
  sections: ScreenFormsDto[] = [];
  subSections: FormGroupsDto[] = [];
  fields: ConfigFormFieldsDto[] = [];
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
  showFields: boolean = false;
  showScreens: boolean = false;
  showSections: boolean = false;
  showSubSections: boolean = false;
  @ViewChild('dt2') dt2: Table | undefined;
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
      originalFieldLabel: [{ value: '', disabled: true }],
      placeholder: [''],
      currentFieldLabel: [''],
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
    const field = this.selectedTableRecordDetails;

    this.updateMultilingualLabel(field, this.fieldsForm, 'currentFieldLabel');
    this.saveValidationsMessages();

    const payload: ConfigFormFieldsDto = {
      ...field,
      code: field.code,
      conditions: field.conditions,
      defaultValue: field.defaultValue,
      disabled: data.disabled === 'Y',
      dynamicLabel: null,
      fieldId: field.fieldId,
      formCode: field.formCode,
      formGroupingCode: field.formGroupingCode,
      formSubGroupingCode: field.formSubGroupingCode,
      label: field.label,
      mandatory: data.mandatory === 'Y',
      options: data.options,
      order: data.order,
      placeholder: data.placeholder,
      screenCode: field.screenCode,
      subModuleCode: field.subModuleCode,
      tooltip: undefined, //Todo: add tooltip
      type: field.type,
      validations: field.validations,
      visible: data.visible === 'Y'

    }

    const index = this.tableData.findIndex(item => item.code === payload.code);
    if (index !== -1) {
      this.tableData[index] = { ...this.tableData[index], ...payload };
    }


    log.info('Saving fields:', payload);
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save fields changes.');
    this.closeFieldsModal();
  }

  editSubModule(subModule?: any) {
    if (subModule) {
      this.editMode = !this.editMode;
      this.openSubModulesModal();
      this.selectedSubModule = subModule;
      this.subModulesForm.patchValue({
        originalSubModulesLabel: subModule.originalLabel,
        module: subModule.moduleName,
        currentSubModulesLabel: subModule.label?.[this.language],
        visible: subModule.visible === true ? 'Y' : 'N',
        subModuleLevel: subModule.order,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No sub module is selected'
      );
    }
    this.cdr.detectChanges();
  }

  editScreens(screen?: any) {
    if (screen) {
      this.editMode = !this.editMode;
      this.openScreensModal();
      this.selectedScreen = screen;
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
    if (section) {
      this.editMode = !this.editMode;
      this.openSectionsModal();
      this.selectedSection = section;
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
    if (subSection) {
      this.editMode = !this.editMode;
      this.openSubSectionsModal();
      this.selectedSubSection = subSection;
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

  editSelectedRecord(selectedRecord?: any) {
    this.selectedTableRecordDetails = selectedRecord;
    log.info('selectedTableRecordDetails', this.selectedTableRecordDetails)
    if (this.selectedTableRecordDetails) {
      this.editMode = !this.editMode;
      this.openFieldsModal();
      this.fieldsForm.patchValue({
        originalFieldLabel: this.selectedTableRecordDetails.originalLabel,
        placeholder: this.selectedTableRecordDetails.placeholder?.[this.language],
        currentFieldLabel: this.selectedTableRecordDetails.label?.[this.language],
        inputType: this.selectedTableRecordDetails.type,
        visible: this.selectedTableRecordDetails.visible === true ? 'Y' : 'N',
        mandatory: this.selectedTableRecordDetails.mandatory === true ? 'Y' : 'N',
        disabled: this.selectedTableRecordDetails.disabled === true ? 'Y' : 'N',
        section: this.selectedTableRecordDetails.formCode,
        order: this.selectedTableRecordDetails.order,
        tooltips: this.selectedTableRecordDetails.tooltips,
        tooltipWords: this.selectedTableRecordDetails.tooltipWords?.[this.language],
      });

      // Clear existing validations
      while (this.validations.length) {
        this.validations.removeAt(0);
      }

      // Add validations if they exist
      if (this.selectedTableRecordDetails.validations) {
        this.selectedTableRecordDetails.validations.forEach(validation => {
          const group = this.fb.group({
            type: [validation.type],
            value: [validation.value],
            message: [validation.message?.[this.language]],
          });
          this.validations.push(group);
        });
      }
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

    if (this.selectedTableRecordDetails) {
      this.patchCurrentLabel(this.fieldsForm, this.selectedTableRecordDetails, 'currentFieldLabel');
      this.fieldsForm.patchValue({
        tooltipWords: this.selectedTableRecordDetails.tooltipWords?.[this.language] || '',
        placeholder: this.selectedTableRecordDetails.placeholder?.[this.language] || '',
      });

      this.patchValidationsMessages(this.selectedTableRecordDetails.validations);
    }

    // this.utilService.setLanguage(value.code);
  }

  patchValidationsMessages(validations: Validation[]) {
    const validationsFA = this.fieldsForm.get('validations') as FormArray;
    validationsFA.clear();

    validations.forEach(v => {
      validationsFA.push(this.fb.group({
        type: [v.type],
        value: [v.value],
        message: [v.message?.[this.language] || '']
      }));
    });
  }

  updateMultilingualLabel(
    dto: { label: MultilingualText },
    form: FormGroup,
    labelField: string
  ) {
    log.info('labelField', labelField, dto);
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

  saveValidationsMessages() {
    const validationsFA = this.fieldsForm.get('validations') as FormArray;
    const formValidations = validationsFA.getRawValue();

    this.selectedTableRecordDetails.validations = formValidations.map((v, i) => {
      const msg = this.selectedTableRecordDetails.validations?.[i]?.message || {
        en: '', ke: '', fr: ''
      };
      msg[this.language] = v.message;

      return {
        type: v.type,
        value: v.value,
        message: msg
      };
    });
  }

  publishChanges() {
    const payload: DynamicScreenSetupDto = {
      fields: this.tableData,
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
      message: [{ value: '', disabled: true }, Validators.required],
    });

    group.get('type')?.valueChanges.subscribe(selected => {
      if (selected) {
        group.get('value')?.enable();
        group.get('message')?.enable();
      } else {
        group.get('value')?.disable();
        group.get('message')?.disable();
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

  onClickSubModule(subModule: SubModulesDto) {
    this.selectedSubModule = subModule;
    this.selectedScreen = null;
    this.fetchScreens(subModule.code);
    this.fetchFormFields(subModule.code);
    this.tableTitle = subModule.label[this.language];
    this.showFields = true;
    this.showScreens = true;
  }

  onClickScreen(screen: ScreensDto) {
    this.selectedScreen = screen;
    this.selectedSection = null;
    this.fetchSections(screen.code);
    if (screen?.hasFields === true) {
      this.fetchFormFields(this.selectedSubModule?.code, screen.code);
      this.tableTitle = screen.label[this.language];
    }
    this.showFields = screen?.hasFields;
    this.showSections = true;
  }

  onClickSection(section: ScreenFormsDto) {
    this.selectedSection = section;
    this.fetchSubSections(this.selectedSubModule.code, null, section.code);
    if (section?.hasFields === true) {
      this.fetchFormFields(this.selectedSubModule?.code, this.selectedScreen?.code, section.code);
      this.tableTitle = section.label[this.language];
    }
    this.showFields = section?.hasFields;
    this.showSubSections = true;
  }

  onClickSubSection(subSection: FormGroupsDto) {
    this.selectedSubSection = subSection;
    if (subSection?.hasFields === true) {
      this.fetchFormFields(this.selectedSubModule?.code, this.selectedScreen?.code, this.selectedSection?.code, subSection.code);
      this.tableTitle = subSection.label[this.language];
    }
    this.showFields = subSection?.hasFields;
  }

  filterFields(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt2.filter(filterValue, 'label.' + this.language, 'contains');
  }

  getValidationTypes(validations: any[]): string {
    if (!validations || validations.length === 0) return '';
    return validations.map(v => v.type).join(', ');
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
