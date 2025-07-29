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
  FormGroupsDto, FormSubGroupsDto, MultilingualText,
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
  subSectionTwoForm: FormGroup;
  fieldsForm: FormGroup;

  selectedSubModule: SubModulesDto = null;
  selectedScreen: ScreensDto = null;
  selectedSection: ScreenFormsDto = null;
  selectedSubSection: FormGroupsDto = null;
  selectedSubSectionTwo: FormSubGroupsDto = null;

  subModules: SubModulesDto[] = [];
  screens: ScreensDto[] = [];
  sections: ScreenFormsDto[] = [];
  subSections: FormGroupsDto[] = [];
  subSectionsTwo: FormSubGroupsDto[] = [];
  fields: ConfigFormFieldsDto[] = [];
  columnDialogVisible: boolean = false;
  tableData: any;
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

  availableValidations: string[] = ['min', 'max', 'pattern'];
  showFields: boolean = false;
  showScreens: boolean = false;
  showSections: boolean = false;
  showSubSections: boolean = false;
  showSubSectionsTwo: boolean = false;
  modalId: string = '';
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
    this.createSubSectionsTwoForm();
    this.createFieldsForm();
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

  createSubSectionsTwoForm(): void {
    this.subSectionTwoForm = this.fb.group({
      originalSubSectionTwoLabel: [{ value: '', disabled: true }],
      section: [{ value: '', disabled: true }],
      currentSubSectionTwoLabel: [''],
      visible: [''],
      subSectionTwoLevel: [''],
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
      tooltip: [''],
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

  openSubSectionTwoModal() {
    const modal = document.getElementById('subSectionTwoModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeSubSectionTwoModal(){
    this.editMode = false;
    const modal = document.getElementById('subSectionTwoModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openFieldsModal() {
    const modal = document.getElementById('fieldsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeFieldsModal(){
    this.editMode = false;
    const modal = document.getElementById('fieldsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openMultilingualModal() {
    const modal = document.getElementById('multilingualModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeMultilingualModal(yesClicked?: boolean) {
    this.editMode = false;
    const modal = document.getElementById('multilingualModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    log.info('modalId', this.modalId);
    if (!yesClicked) {
      switch (this.modalId) {
        case 'subModulesModal':
          this.closeSubModulesModal();
          break;
        case 'screensModal':
          this.closeScreensModal();
          break;
        case 'sectionsModal':
          this.closeSectionsModal();
          break;
        case 'subSectionsModal':
          this.closeSubSectionsModal();
          break;
        case 'subSectionTwoModal':
          this.closeSubSectionTwoModal();
          break;
        case 'fieldsModal':
          this.closeFieldsModal();
          break;
      }
    }
  }

  saveSubModules() {
    const data = this.subModulesForm.getRawValue();
    log.info('subModules', data);

    const subModule = this.selectedSubModule;

    this.updateMultilingualLabel(subModule, this.subModulesForm, 'currentSubModulesLabel');

    const payload: SubModulesDto = {
      ...subModule,
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
    // Replace it in the array
    this.subModules = this.subModules.map(sm =>
      sm.code === this.selectedSubModule?.code ? payload : sm
    );
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save sub module changes.');
    // this.closeSubModulesModal();
    this.modalId = 'subModulesModal';
    this.openMultilingualModal();
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
    this.screens = this.screens.map(sm =>
      sm.code === this.selectedScreen?.code ? payload : sm
    );
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save screen changes.');
    // this.closeScreensModal();
    this.modalId = 'screensModal';
    this.openMultilingualModal();
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
    this.sections = this.sections.map(sm =>
      sm.code === this.selectedSection?.code ? payload : sm
    );
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save section changes.');
    // this.closeSectionsModal();
    this.modalId = 'sectionsModal';
    this.openMultilingualModal();
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
      subGroup: subSection.subGroup
    };

    log.info('Saving sub section:', payload);
    this.subSections = this.subSections.map(sm =>
      sm.code === this.selectedSubSection?.code ? payload : sm
    );
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save sub section changes.');
    // this.closeSubSectionsModal();
    this.modalId = 'subSectionsModal';
    this.openMultilingualModal();
  }

  saveSubSectionTwo(): void {
    const data = this.subSectionTwoForm.getRawValue();
    log.info('subSections 2', data);

    const subSectionTwo = this.selectedSubSectionTwo;
    this.updateMultilingualLabel(subSectionTwo, this.subSectionTwoForm, 'currentSubSectionTwoLabel');

    const updatedSubGroup: FormSubGroupsDto = {
      ...subSectionTwo,
      code: subSectionTwo.code,
      formGroupingCode: subSectionTwo.formGroupingCode,
      originalLabel: subSectionTwo.originalLabel,
      subGroupId: subSectionTwo.subGroupId,
      label: subSectionTwo.label,
      addButtonTextLabel: subSectionTwo.addButtonTextLabel,
      visible: data.visible === 'Y',
      order: data.subSectionTwoLevel,
      hasFields: subSectionTwo.hasFields,
    };

    log.info('sub two', this.subSections);
    // updating the correct parent FormGroupsDto in `subSections[]`
    this.subSections = this.subSections.map(group => {

      if (group.code === updatedSubGroup.formGroupingCode) {
        log.info('code', group.code, updatedSubGroup.formGroupingCode);
        const updatedSubGroups = group.subGroup.map(sg =>
          sg.code === updatedSubGroup.code ? updatedSubGroup : sg
        );
        log.info('group', group, updatedSubGroups, group.code, updatedSubGroup.formGroupingCode);
        return { ...group, subGroup: updatedSubGroups };

      }
      return group;
    });

    this.closeSubSectionTwoModal();
  }


  saveFieldProperties() {
    const data = this.fieldsForm.getRawValue();
    log.info('fields form', data);
    const field = this.selectedTableRecordDetails;

    this.updateMultilingualLabel(field, this.fieldsForm, 'currentFieldLabel');
    this.updateMultilingualPlaceholder(field, this.fieldsForm, 'placeholder');
    this.updateMultilingualTooltipWords(field, this.fieldsForm, 'tooltip');
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
      placeholder: field.placeholder,
      screenCode: field.screenCode,
      subModuleCode: field.subModuleCode,
      showTooltip: data.tooltips === 'Y',
      tooltip: field.tooltip,
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
    // this.closeFieldsModal();
    this.modalId = 'fieldsModal';
    this.openMultilingualModal();
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
        'Error', 'No sub section is selected'
      );
    }
    this.cdr.detectChanges();
  }

  editSubSectionsTwo(subSectionTwo?: any) {
    if (subSectionTwo) {
      this.editMode = !this.editMode;
      this.openSubSectionTwoModal();
      this.selectedSubSectionTwo = subSectionTwo;
      this.subSectionTwoForm.patchValue({
        originalSubSectionTwoLabel: subSectionTwo.originalLabel,
        section: subSectionTwo.formCode,
        currentSubSectionTwoLabel: subSectionTwo.label?.[this.language],
        visible: subSectionTwo.visible === true ? 'Y' : 'N',
        subSectionTwoLevel: subSectionTwo.order,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error', 'No sub section 2 is selected'
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
        tooltips: this.selectedTableRecordDetails.showTooltip === true ? 'Y' : 'N',
        tooltip: this.selectedTableRecordDetails.tooltip?.[this.language],
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
      this.patchCurrentPlaceholder(this.fieldsForm, this.selectedTableRecordDetails, 'placeholder');
      this.patchCurrentTooltipWords(this.fieldsForm, this.selectedTableRecordDetails, 'tooltip');

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

  updateMultilingualPlaceholder(
    dto: { placeholder: MultilingualText },
    form: FormGroup,
    placeholderField: string
  ) {
    log.info('placeholder Field', placeholderField, dto);
    if (!dto.placeholder) {
      dto.placeholder = { en: '', ke: '', fr: '' };
    }
    dto.placeholder[this.language] = form.get(placeholderField)?.value || '';
  }

  patchCurrentPlaceholder(
    form: FormGroup,
    dto: { placeholder: MultilingualText },
    placeholderField: string
  ) {
    if (dto?.placeholder) {
      form.patchValue({
        [placeholderField]: dto.placeholder[this.language] || ''
      });
    }
  }

  updateMultilingualTooltipWords(
    dto: { tooltip: MultilingualText },
    form: FormGroup,
    tooltipField: string
  ) {
    log.info('tooltip words Field', tooltipField, dto);
    if (!dto.tooltip) {
      dto.tooltip = { en: '', ke: '', fr: '' };
    }
    dto.tooltip[this.language] = form.get(tooltipField)?.value || '';
  }

  patchCurrentTooltipWords(
    form: FormGroup,
    dto: { tooltip: MultilingualText },
    tooltipField: string
  ) {
    log.info('patch tool', dto)
    if (dto?.tooltip) {
      form.patchValue({
        [tooltipField]: dto.tooltip[this.language] || ''
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
    this.showSubSectionsTwo = false;
    this.selectedSubSection = null;
    this.selectedSubSectionTwo = null;
  }

  onClickSubSection(subSection: FormGroupsDto) {
    this.selectedSubSection = subSection;
    if (subSection?.hasFields === true) {
      this.fetchFormFields(this.selectedSubModule?.code, this.selectedScreen?.code, this.selectedSection?.code, subSection.code);
      this.tableTitle = subSection.label[this.language];
    }
    this.fetchSubSectionsTwo(subSection.code);
    this.showFields = subSection?.hasFields;
    this.showSubSectionsTwo = true;
  }

  onClickSubSectionTwo(subSectionTwo: FormSubGroupsDto) {
    this.selectedSubSectionTwo = subSectionTwo;
    if (subSectionTwo?.hasFields === true) {
      this.fetchFormFields(this.selectedSubModule?.code, this.selectedScreen?.code, this.selectedSection?.code, this.selectedSubSection?.code, subSectionTwo.code);
      this.tableTitle = subSectionTwo.label[this.language];
    }
    this.showFields = subSectionTwo?.hasFields;
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

  fetchSubSectionsTwo(groupCode?: number) {
    this.dynamicScreensSetupService.fetchSubGroups(groupCode)
      .subscribe({
        next: (data) => {
          this.subSectionsTwo = data.sort((a, b) => a.order - b.order);
          log.info("sub sections 2>>", data);
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
          this.disableProtectedFields();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  disableProtectedFields() {
    this.tableData.forEach(field => {
      if (field.isProtected) {
        this.fieldsForm.get('visible')?.clearValidators();
        this.fieldsForm.get('visible')?.disable();
        this.fieldsForm.get('mandatory')?.clearValidators();
        this.fieldsForm.get('mandatory')?.disable();
        this.fieldsForm.get('disabled')?.clearValidators();
        this.fieldsForm.get('disabled')?.disable();
        this.fieldsForm.get('tooltips')?.clearValidators();
        this.fieldsForm.get('tooltips')?.disable();
        this.fieldsForm.get('tooltipWords')?.clearValidators();
        this.fieldsForm.get('tooltipWords')?.disable();
      }
    });
  }
}
