import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BreadCrumbItem} from "../../../data/common/BreadCrumbItem";
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../services";
import {GlobalMessagingService} from "../../../services/messaging/global-messaging.service";
import {LANGUAGES, LanguagesDto} from "../../../data/common/languages-dto";
import {DynamicScreensSetupService} from "../../../services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto, DynamicSetupImportDto,
  FormGroupsDto, FormSubGroupsDto, MultilingualText,
  ScreenFormsDto,
  ScreensDto,
  SubModulesDto, Validation
} from "../../../data/common/dynamic-screens-dto";
import {Table} from "primeng/table";
import {SessionStorageService} from "../../../services/session-storage/session-storage.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {FieldModel, Group} from "../../../../features/entities/data/form-config.model";

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
  showExportScreens: boolean = false;
  showExportSections: boolean = false;
  showExportSubSections: boolean = false;
  showExportSubSectionsTwo: boolean = false;
  modalId: string = '';
  exportSelected: any;
  selectedExportSubmodule: SubModulesDto;
  selectedExportScreen: ScreensDto;
  selectedExportSection: ScreenFormsDto;
  selectedExportSubSection: FormGroupsDto;
  selectedExportSubSectionTwo: FormSubGroupsDto;
  exportData: DynamicSetupImportDto;

  private fieldsCacheByKey: Record<string, ConfigFormFieldsDto[]> = {};
  private currentFieldsKey: string | null = null;

  uploadForm!: FormGroup;
  entityForm!: FormGroup;
  updatedFormFields: any;
  dynamicSetupData: any = [];
  newEntityFieldsData: any = [];
  formGroupSections: any[];
  idType: string = 'NATIONAL_ID'
  collapsedGroups: Set<string> = new Set();

  protected readonly SearchCountryField = SearchCountryField;
  protected readonly CountryISO = CountryISO;
  protected readonly PhoneNumberFormat = PhoneNumberFormat;

  wealthAmlFormFields: any[] = [];
  corporateContactDetailsFormField: any[] = [];
  corporateAddressDetailsFormField: any[] = [];
  corporateFinancialDetailsFormField: any[] = [];
  corporateWealthAmlFormFieldsDetailsFormField: any[] = [];
  corporateWealthCR12DetailsFormField: any[] = [];
  corporateWealthOwnershipDetailsFormField: any[] = [];
  branchDetailsFormFields: any[] = [];
  privacyFormFields: any[] = [];

  selectedTab: string = 'otp_phone_number';
  shouldShowFields: boolean = false;

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
    private utilService: UtilService,
    private dynamicScreensSetupService: DynamicScreensSetupService,
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
  ) {
    this.uploadForm = this.fb.group({});
  }

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
    this.createEntityForm();
  }

  createEntityForm():void {
    this.entityForm = this.fb.group({
      fields: this.fb.array([])
    });
    this.collapsedGroups.add('prime_identity');
  }

  /**
   * Creates the form for the sub modules.
   */
  createSubModuleForm(): void {
    this.subModulesForm = this.fb.group({
      originalSubModulesLabel: [{ value: '', disabled: true }],
      module: [{ value: '', disabled: true }],
      currentSubModulesLabel: [''],
      visible: [''],
      subModuleLevel: [''],
    });
  }

  /**
   * Creates the form for the screens.
   */
  createScreensForm(): void {
    this.screensForm = this.fb.group({
      originalScreenLabel: [{ value: '', disabled: true }],
      subModule: [{ value: '', disabled: true }],
      currentScreenLabel: [''],
      visible: [''],
      screenLevel: [''],
    });
  }

  /**
   * Creates the form for the sections.
   */
  createSectionsForm(): void {
    this.sectionsForm = this.fb.group({
      originalSectionLabel: [{ value: '', disabled: true }],
      screen: [{ value: '', disabled: true }],
      currentSectionLabel: [''],
      visible: [''],
      sectionLevel: [''],
    });
  }

  /**
   * Creates the form for the sub sections.
   */
  createSubSectionsForm(): void {
    this.subSectionsForm = this.fb.group({
      originalSubSectionLabel: [{ value: '', disabled: true }],
      section: [{ value: '', disabled: true }],
      currentSubSectionLabel: [''],
      visible: [''],
      subSectionLevel: [''],
    });
  }

  /**
   * Creates the form for the sub sections two.
   */
  createSubSectionsTwoForm(): void {
    this.subSectionTwoForm = this.fb.group({
      originalSubSectionTwoLabel: [{ value: '', disabled: true }],
      section: [{ value: '', disabled: true }],
      currentSubSectionTwoLabel: [''],
      visible: [''],
      subSectionTwoLevel: [''],
    });
  }

  /**
   * Creates the form for the fields.
   */
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

  /**
   * Returns the validations form array.
   */
  get validations() {
    return this.fieldsForm.get('validations') as FormArray;
  }

  /**
   * Opens the sub modules modal.
   */
  openSubModulesModal() {
    const modal = document.getElementById('subModuleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the sub modules modal.
   */
  closeSubModulesModal() {
    this.editMode = false;
    const modal = document.getElementById('subModuleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the screens modal.
   */
  openScreensModal() {
    const modal = document.getElementById('screensModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the screens modal.
   */
  closeScreensModal(){
    this.editMode = false;
    const modal = document.getElementById('screensModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the sections modal.
   */
  openSectionsModal() {
    const modal = document.getElementById('sectionsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the sections modal.
   */
  closeSectionsModal(){
    this.editMode = false;
    const modal = document.getElementById('sectionsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the sub sections modal.
   */
  openSubSectionsModal() {
    const modal = document.getElementById('subSectionsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the sub sections modal.
   */
  closeSubSectionsModal(){
    this.editMode = false;
    const modal = document.getElementById('subSectionsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the sub sections two modal.
   */
  openSubSectionTwoModal() {
    const modal = document.getElementById('subSectionTwoModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the sub sections two modal.
   */
  closeSubSectionTwoModal(){
    this.editMode = false;
    const modal = document.getElementById('subSectionTwoModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the fields modal.
   */
  openFieldsModal() {
    const modal = document.getElementById('fieldsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the fields modal.
   */
  closeFieldsModal() {
    this.editMode = false;
    const modal = document.getElementById('fieldsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the export setup modal.
   */
  openExportSetupModal() {
    const modal = document.getElementById('exportSetupModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the export setup modal.
   */
  closeExportSetupModal() {
    this.editMode = false;
    const modal = document.getElementById('exportSetupModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the multilingual modal.
   */
  openMultilingualModal() {
    const modal = document.getElementById('multilingualModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the multilingual modal.
   * @param yesClicked - A boolean value indicating whether the yes button was clicked or not.
   */
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

  /**
   * Opens the preview modal.
   */
  openPreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the preview modal.
   * This function removes the 'show' class from the modal and sets its display style to 'none'.
   */
  closePreviewModal(){
    this.editMode = false;
    const modal = document.getElementById('previewModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Saves the changes made to the sub modules.
   */
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

  /**
   * Saves the changes made to the screens.
   */
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

  /**
   * Saves the changes made to the sections.
   */
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

  /**
   * Saves the changes made to the sub sections.
   */
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

  /**
   * Saves the changes made to the sub sections two.
   */
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

  /**
   * Saves the changes made to the fields.
   */
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
    };

    // Update currently displayed table
    if (Array.isArray(this.tableData)) {
      const idx = this.tableData.findIndex(item => item.code === payload.code);
      if (idx !== -1) this.tableData[idx] = { ...this.tableData[idx], ...payload };
    }

    // Keep all keyed caches in sync (replace by code)
    this.updateFieldInAllCaches(payload);

    log.info('Saving fields:', payload);
    this.globalMessagingService.displayInfoMessage('Info', 'Publish to save fields changes.');
    this.modalId = 'fieldsModal';
    this.openMultilingualModal();
  }

  /**
   * Updates the cache of fields with the provided updated field.
   *
   * @param updated - The updated field to be merged into the cache.
   */
  private updateFieldInAllCaches(updated: ConfigFormFieldsDto) {
    Object.keys(this.fieldsCacheByKey).forEach(k => {
      const arr = this.fieldsCacheByKey[k];
      if (!Array.isArray(arr)) return;
      const i = arr.findIndex(f => f.code === updated.code);
      if (i !== -1) {
        arr[i] = { ...arr[i], ...updated };
      }
    });
  }

  /**
   * Retrieves all fields from the keyed caches.
   *
   * @returns An array of all fields from the caches.
   */
  private getAllFieldsFromKeyedCaches(): ConfigFormFieldsDto[] {
    const all: ConfigFormFieldsDto[] = [];
    Object.values(this.fieldsCacheByKey).forEach(list => {
      if (Array.isArray(list)) all.push(...list);
    });
    const byCode = new Map<number | string, ConfigFormFieldsDto>();
    all.forEach(f => {
      if (f?.code != null) byCode.set(f.code, f); // last write wins
    });
    return Array.from(byCode.values());
  }

  /**
   * Generates a unique key for a set of field parameters.
   *
   * @param subModuleCode - The sub module code.
   * @param screenCode - The screen code.
   * @param formCode - The form code.
   * @param formGroupingsCode - The form groupings code.
   * @param formSubGroupCode - The form sub group code.
   * @returns A unique key for the field parameters.
   */
  private getFieldsKey(
    subModuleCode?: number,
    screenCode?: number,
    formCode?: number,
    formGroupingsCode?: number,
    formSubGroupCode?: number
  ): string {
    const parts: string[] = [];
    if (subModuleCode != null) parts.push(`sm:${subModuleCode}`);
    if (screenCode != null) parts.push(`sc:${screenCode}`);
    if (formCode != null) parts.push(`fc:${formCode}`);
    if (formGroupingsCode != null) parts.push(`gc:${formGroupingsCode}`);
    if (formSubGroupCode != null) parts.push(`sgc:${formSubGroupCode}`);
    return parts.join('|');
  }

  /**
   * Edits the selected sub module.
   * @param subModule The selected sub module to edit.
   */
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

  /**
   * Edits the selected screen.
   * @param screen The selected screen to edit.
   */
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

  /**
   * Edits the selected section.
   * @param section The selected section to edit.
   */
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

  /**
   * Edits the selected sub section.
   * @param subSection The selected sub section to edit.
   */
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

  /**
   * Edits the selected sub section 2.
   * @param subSectionTwo The selected sub section 2 to edit.
   */
  editSubSectionsTwo(subSectionTwo?: any) {
    if (subSectionTwo) {
      this.editMode = !this.editMode;
      this.openSubSectionTwoModal();
      this.selectedSubSectionTwo = subSectionTwo;
      this.subSectionTwoForm.patchValue({
        originalSubSectionTwoLabel: subSectionTwo.originalLabel,
        section: subSectionTwo.formGroupingCode,
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

  /**
   * Patches the current validations messages from the provided validations to the form.
   * @param validations The validations containing the messages.
   */
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

  /**
   * Selects the language for the current application.
   * @param value The language object containing the code and class.
   */
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

  /**
   * Patches the current validations messages from the provided validations to the form.
   * @param validations The validations containing the messages.
   */
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

  /**
   * Updates the multilingual label of the provided dto with the current value from the form.
   * @param dto The dto containing the label to update.
   * @param form The form containing the current value.
   * @param labelField The name of the label form control.
   */
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

  /**
   * Patches the current label value from the provided dto to the form.
   * @param form The form to patch the value to.
   * @param dto The dto containing the label to patch.
   * @param labelField The name of the label form control.
   */
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

  /**
   * Updates the multilingual placeholder of the provided dto with the current value from the form.
   * @param dto The dto containing the placeholder to update.
   * @param form The form containing the current value.
   * @param placeholderField The name of the placeholder form control.
   */
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

  /**
   * Patches the current placeholder value from the provided dto to the form.
   * @param form The form to patch the value to.
   * @param dto The dto containing the placeholder to patch.
   * @param placeholderField The name of the placeholder form control.
   */
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

  /**
   * Updates the multilingual tooltip words of the provided dto with the current value from the form.
   * @param dto The dto containing the tooltip words to update.
   * @param form The form containing the current value.
   * @param tooltipField The name of the tooltip words form control.
   */
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

  /**
   * Patches the current tooltip words value from the provided dto to the form.
   * @param form The form to patch the value to.
   * @param dto The dto containing the tooltip words.
   * @param tooltipField The name of the tooltip words form control.
   */
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

  /**
   * Saves the current validation messages from the form to the selected table record details.
   */
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

  /**
   * Publishes the changes to the dynamic screens setup.
   */
  publishChanges() {
    const payload: DynamicScreenSetupDto = {
      fields: this.getAllFieldsFromKeyedCaches(),// use merged caches
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

  /**
   * Adds a new section to the form.
   * The section is initialized with a group containing three controls: type, value, and message.
   * The type control is required and its value is used to enable or disable the value and message controls.
   */
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

  /**
   * Removes the section at the given index from the form.
   * @param index The index of the section to remove.
   */
  removeSection(index: number) {
    this.validations.removeAt(index);
  }

  /**
   * Returns the list of available validations excluding the one selected.
   * @param currentType the type of the validation to exclude
   * @returns the list of available validations
   */
  getRemainingValidations(currentType?: string | null) {
    const selected = this.validations.controls
      .map(ctrl => ctrl.get('type')?.value)
      .filter((t: string | null) => t && t !== currentType);
    return this.availableValidations.filter(v => !selected.includes(v));
  }

  /**
   * Handles the selection of a sub-module.
   * Fetches the screens and form fields for the selected sub-module.
   * @param subModule - The selected sub-module.
   */
  onClickSubModule(subModule: SubModulesDto) {
    this.selectedSubModule = subModule;
    this.selectedScreen = null;
    this.selectedSection = null;
    this.fetchScreens(subModule.code);
    // Use cache if available, otherwise fetch
    this.showFieldsFromCacheOrFetch({ subModuleCode: subModule.code });
    this.tableTitle = subModule.label[this.language];
    this.showFields = true;
    this.showScreens = true;
  }

  /**
   * Handles the selection of a screen.
   * Fetches the sections and form fields for the selected screen.
   * @param screen - The selected screen.
   */
  onClickScreen(screen: ScreensDto) {
    this.selectedScreen = screen;
    this.selectedSection = null;
    this.fetchSections(screen.code);
    if (screen?.hasFields === true) {
      // Use cache if available, otherwise fetch
      this.showFieldsFromCacheOrFetch({
        subModuleCode: this.selectedSubModule?.code,
        screenCode: screen.code
      });
      this.tableTitle = screen.label[this.language];
    }
    this.showFields = screen?.hasFields;
    this.showSections = true;
  }

  /**
   * Handles the selection of a section.
   * Fetches the sub-sections and form fields for the selected section.
   * @param section - The selected section.
   */
  onClickSection(section: ScreenFormsDto) {
    this.selectedSection = section;
    this.fetchSubSections(this.selectedSubModule.code, null, section.code);
    if (section?.hasFields === true) {
      // Use cache if available, otherwise fetch
      this.showFieldsFromCacheOrFetch({
        subModuleCode: this.selectedSubModule?.code,
        screenCode: this.selectedScreen?.code,
        formCode: section.code
      });
      this.tableTitle = section.label[this.language];
    }
    this.showFields = section?.hasFields;
    this.showSubSections = true;
    this.showSubSectionsTwo = false;
    this.selectedSubSection = null;
    this.selectedSubSectionTwo = null;
  }

  /**
   * Handles the selection of a sub-section.
   * Fetches the sub-sections two and form fields for the selected sub-section.
   * @param subSection - The selected sub-section.
   */
  onClickSubSection(subSection: FormGroupsDto) {
    this.selectedSubSection = subSection;
    if (subSection?.hasFields === true) {
      // Use cache if available, otherwise fetch
      this.showFieldsFromCacheOrFetch({
        subModuleCode: this.selectedSubModule?.code,
        screenCode: this.selectedScreen?.code,
        formCode: this.selectedSection?.code,
        formGroupingsCode: subSection.code
      });
      this.tableTitle = subSection.label[this.language];
    }
    this.fetchSubSectionsTwo(subSection.code);
    this.showFields = subSection?.hasFields;
    this.showSubSectionsTwo = true;
  }

  /**
   * Handles the selection of a sub-section two.
   * Fetches the form fields for the selected sub-section two.
   * @param subSectionTwo - The selected sub-section two.
   */
  onClickSubSectionTwo(subSectionTwo: FormSubGroupsDto) {
    this.selectedSubSectionTwo = subSectionTwo;
    if (subSectionTwo?.hasFields === true) {
      // Use cache if available, otherwise fetch
      this.showFieldsFromCacheOrFetch({
        subModuleCode: this.selectedSubModule?.code,
        screenCode: this.selectedScreen?.code,
        formCode: this.selectedSection?.code,
        formGroupingsCode: this.selectedSubSection?.code,
        formSubGroupCode: subSectionTwo.code
      });
      this.tableTitle = subSectionTwo.label[this.language];
    }
    this.showFields = subSectionTwo?.hasFields;
  }

  /**
   * Show fields from cache for the detected scope; if not cached (or forceRefresh), fetch from API.
   */
  private showFieldsFromCacheOrFetch(params: {
    subModuleCode?: number;
    screenCode?: number;
    formCode?: number;
    formGroupingsCode?: number;
    formSubGroupCode?: number;
    forceRefresh?: boolean;
  }) {
    const { subModuleCode, screenCode, formCode, formGroupingsCode, formSubGroupCode, forceRefresh = false } = params;
    const key = this.getFieldsKey(subModuleCode, screenCode, formCode, formGroupingsCode, formSubGroupCode);
    this.currentFieldsKey = key;

    const cached = this.fieldsCacheByKey[key];
    if (!forceRefresh && Array.isArray(cached) && cached.length > 0) {
      this.tableData = cached;
      this.disableProtectedFields();
      this.cdr.detectChanges();
      return;
    }
    this.fetchFormFields(subModuleCode, screenCode, formCode, formGroupingsCode, formSubGroupCode);
  }

  /**
   * Exports the selected submodule setup data as a JSON file.
   */
  onClickExportSubModule() {
    if (this.selectedExportSubmodule) {
      this.fetchScreens(this.selectedExportSubmodule.code);
      this.exportScreenSetupJson(this.selectedExportSubmodule.code);
      this.exportSelected = this.selectedExportSubmodule.label[this.language];
      this.showExportScreens = true;
    }
  }

  /**
   * Exports the selected screen setup data as a JSON file.
   */
  onClickExportScreen() {
    if (this.selectedExportScreen) {
      this.fetchSections(this.selectedExportScreen.code);
      this.exportScreenSetupJson(this.selectedExportSubmodule.code, this.selectedExportScreen.code);
      this.exportSelected = this.selectedExportScreen.label[this.language];
      this.showExportSections = true;
    }
  }

  /**
   * Exports the selected section setup data as a JSON file.
   */
  onClickExportSection() {
    if (this.selectedExportSection) {
      this.fetchSubSections(this.selectedSubModule.code, null, this.selectedExportSection.code);
      this.exportScreenSetupJson(this.selectedExportSubmodule.code, this.selectedExportScreen.code, this.selectedExportSection.code);
      this.exportSelected = this.selectedExportSection.label[this.language];
      this.showExportSubSections = true;
      this.showExportSubSectionsTwo = false;
    }
  }

  /**
   * Exports the selected subsection setup data as a JSON file.
   */
  onClickExportSubSection() {
    if (this.selectedExportSection) {
      this.fetchSubSectionsTwo(this.selectedExportSubSection.code);
      this.exportSelected = this.selectedExportSubSection.label[this.language];
      this.exportScreenSetupJson(this.selectedExportSubmodule.code, this.selectedExportScreen.code, this.selectedExportSection.code, this.selectedExportSubSection.code);
      this.showExportSubSectionsTwo = true;
    }
  }

  /**
   * Exports the selected subsection two setup data as a JSON file.
   */
  onClickExportSubSectionTwo() {
    if (this.selectedExportSubSectionTwo) {
      this.exportSelected = this.selectedExportSubSectionTwo.label[this.language];
      this.exportScreenSetupJson(this.selectedExportSubmodule.code, this.selectedExportScreen.code, this.selectedExportSection.code, this.selectedExportSubSection.code, this.selectedExportSubSectionTwo.code);
    }
  }

  /**
   * Filters the field table based on the input value.
   * @param event - The input event
   */
  filterFields(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt2.filter(filterValue, 'label.' + this.language, 'contains');
  }

  /**
   * Returns a comma-separated string of the validation types for a given field.
   * @param validations - The list of validations
   */
  getValidationTypes(validations: any[]): string {
    if (!validations || validations.length === 0) return '';
    return validations.map(v => v.type).join(', ');
  }

  /**
   * Imports a setup file (JSON) from the user's local machine.
   *
   * @remarks
   * This function creates a hidden file input element and programmatically
   * clicks it to open the file dialog. When a file is selected, it reads the
   * file content using the FileReader API and calls the importScreenSetupCall
   * function to import the setup data. If the file is not a valid JSON file,
   * it displays an error message.
   */
  importSetup() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = JSON.parse(e.target?.result as string);
            log.info('Imported setup file:', content);
            this.importScreenSetupCall(content);

          } catch (err) {
            this.globalMessagingService.displayErrorMessage('Error', 'Invalid setup file format');
          }
        };
        reader.readAsText(file);
      }
    };

    fileInput.click();
  }

  /**
   * Fetches the sub modules based on the given parameters.
   *
   * @remarks
   * This function fetches the sub modules based on the given parameters and
   * assigns the result to the subModules property.
   */
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

  /**
   * Fetches the screens based on the given parameters.
   *
   * @remarks
   * This function fetches the screens based on the given parameters and
   * assigns the result to the screens property.
   */
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

  /**
   * Fetches the sections based on the given parameters.
   *
   * @remarks
   * This function fetches the sections based on the given parameters and
   * assigns the result to the sections property.
   */
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

  /**
   * Fetches the sub sections based on the given parameters.
   *
   * @remarks
   * This function fetches the sub sections based on the given parameters and
   * assigns the result to the subSections property.
   */
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

  /**
   * Fetches the sub sections 2 based on the given parameters.
   *
   * @remarks
   * This function fetches the sub sections 2 based on the given parameters and
   * assigns the result to the subSectionsTwo property.
   */
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

  /**
   * Fetches the form fields based on the given parameters.
   *
   * @remarks
   * This function fetches the form fields based on the given parameters and
   * assigns the result to the tableData property.
   */
  fetchFormFields(subModuleCode?: number, screenCode?: number, formCode?: number, formGroupingsCode?: number, formSubGroupCode?: number) {
    const key = this.getFieldsKey(subModuleCode, screenCode, formCode, formGroupingsCode, formSubGroupCode);
    this.currentFieldsKey = key;

    this.dynamicScreensSetupService.fetchFormFields(subModuleCode, screenCode, formCode, formGroupingsCode, formSubGroupCode)
      .subscribe({
        next: (data) => {
          // Save to keyed cache
          this.fieldsCacheByKey[key] = data || [];
          this.tableData = this.fieldsCacheByKey[key];
          log.info("fields>>", data);
          this.disableProtectedFields();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
        }
      });
  }

  /**
   * Exports the screen setup data as a JSON blob.
   *
   * @remarks
   * This function fetches the export data for the given parameters and assigns
   * the result to the exportData property.
   */
  exportScreenSetupJson(subModuleCode: number, screenCode?: number, formCode?: number, formGroupCode?: number, formSubGroupCode?: number) {
    this.dynamicScreensSetupService.exportScreenSetup(subModuleCode, screenCode, formCode, formGroupCode, formSubGroupCode)
      .subscribe({
        next: (data) => {
          this.exportData = data;
          log.info("export>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  /**
   * Downloads the export data as a JSON file.
   *
   * @remarks
   * This function creates a blob from the export data, creates a URL for the blob,
   * creates a link element, sets the href attribute of the link to the blob URL,
   * sets the download attribute of the link to 'setup.json', clicks the link to
   * trigger the download, and then revokes the blob URL.
   */
  exportJson() {
    if (this.exportData) {
      const blob = new Blob([JSON.stringify(this.exportData)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'setup.json';
      a.click();
      window.URL.revokeObjectURL(url);
      this.closeExportSetupModal();
    }
  }

  /**
   * Imports a screen setup from the given data.
   *
   * @remarks
   * This function makes a request to the import screen setup endpoint and passes
   * the given data as the request body. If the request is successful, it reloads
   * the page. If the request fails, it displays an error message using the global
   * messaging service.
   *
   * @param data - The data to import.
   */
  importScreenSetupCall(data: any) {
    this.dynamicScreensSetupService.importScreenSetup(data)
      .subscribe({
        next: (data) => {
          log.info("import>>", data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Setup imported successfully.');
          // window.location.reload();
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

  /**
   * Previews the screen setup by creating a payload object with the necessary data
   * and storing it in session storage. It then fetches the dynamic setup for the
   * selected screen and updates the form fields. Lastly, it opens the preview modal.
   *
   * @returns {void}
   */
  previewSetup() {
    const payload: any = {
      fields: this.getAllFieldsFromKeyedCaches(),
      groups: this.subSections,
      forms: this.selectedSection,
      screens: this.selectedScreen,
      subModules: this.subModules,
    };

    log.info('Preview payload:', payload);
    this.sessionStorageService.setItem("PREVIEW_SCREEN_SETUP", payload);
    this.fetchDynamicSetup(this.selectedScreen.code);
    this.updatedFormFields = payload;
    this.openPreviewModal();
  }

  /**
   * Toggles the collapsed state of a group based on its ID. If the group is already
   * collapsed, it is expanded. If the group is already expanded, it is collapsed.
   *
   * @param {any} id - The ID of the group to toggle.
   * @return {void}
   */
  toggleCollapse(id: any): void {
    if (this.collapsedGroups.has(id)) {
      this.collapsedGroups.delete(id);
    } else {
      this.collapsedGroups.add(id);
    }
  }

  /**
   * Checks if a group with the given ID is currently collapsed.
   *
   * @param {any} id - The ID of the group to check.
   * @return {boolean} True if the group is collapsed, false otherwise.
   */
  isCollapsed(id: any): boolean {
    return this.collapsedGroups.has(id);
  }

  /**
   * Shows the selected tab by updating the selectedTab property and setting
   * shouldShowFields to true.
   *
   * @param {string} selectedTab - The ID of the tab to show.
   * @return {void}
   */
  showSelectedTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
    this.shouldShowFields = true;
  }

  /**
   * Adds the new entity fields data to the upload form.
   *
   * @remarks
   * This function filters the dynamic setup data fields to only include fields
   * with a screen code of null and creates a form group for the upload form.
   *
   * @returns {void}
   */
  addUploadFormFields(): void {
    this.newEntityFieldsData = this.dynamicSetupData.fields.filter(field => field.screenCode === null);

    const group: { [key: string]: FormControl } = {};

    this.newEntityFieldsData.forEach((field: any) => {

      const validators: ValidatorFn[] = [];

      if (field.mandatory) {
        validators.push(Validators.required);
      }
      group[field.fieldId] = new FormControl('', validators);
    });

    this.uploadForm = this.fb.group(group);
  }

  /**
   * Publishes the changes made to the preview screen setup.
   *
   * @remarks
   * This function creates a payload object with the necessary data and makes a
   * request to the update screen setup endpoint. If the request is successful,
   * it displays a success message using the global messaging service. If the
   * request fails, it displays an error message.
   *
   * @returns {void}
   */
  publishPreviewChanges() {
    const payload: DynamicScreenSetupDto = {
      fields: this.dynamicSetupData.fields,
      groups: this.dynamicSetupData.groups,
      forms: this.dynamicSetupData.forms,
      screens: [this.dynamicSetupData.screen],
      subModules: [this.dynamicSetupData.subModule],
    };

    log.info('Publishing preview payload:', payload);

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

  /**
   * Fetches the dynamic setup data for the given screen code.
   * If the request is successful, it updates the form fields.
   * If the request fails, it displays an error message.
   *
   * @param screenCode - The code of the screen to fetch the setup data for.
   * @return {void}
   */
  fetchDynamicSetup(screenCode?: number) {
    this.dynamicScreensSetupService.fetchDynamicSetupByScreen(screenCode, null)
      .subscribe({
        next: (data) => {
          this.dynamicSetupData = data;
          log.info("dynamic setup>>", data);
          if (this.dynamicSetupData) {
            this.updateFormFields();
          }
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  /**
   * Fetches the form fields setup for the current dynamic setup data.
   * Sorts the form groups and fields by their order and assigns fields to groups.
   */
  fetchFormFieldsSetup(): void {
    const groups: Group[] = this.dynamicSetupData?.groups.filter(
      group => group.formCode === this.updatedFormFields.forms.code
    );

    const fields: FieldModel[] = this.dynamicSetupData?.fields;
    this.orderFormGroup(groups, fields);
  }

  /**
   * Sorts the form groups and fields by their order and assigns fields to groups.
   * @param groups - The form groups to be sorted and assigned fields.
   * @param fields - The form fields to be sorted and assigned to groups.
   */
  orderFormGroup(groups: any[], fields: FieldModel[]) : void {
    const formGroupSections: any[] = groups?.sort(
      (a: { order: number; }, b: { order: number; }) => a.order - b.order
    );

    const fieldOrder: any[] = fields?.sort(
      (a: { order: number; }, b: { order: number; }) => a.order - b.order
    );

    this.assignFieldsToGroupByGroupId(fieldOrder, formGroupSections);
  }

  /**
   * Assigns the fields to the groups based on their order and form codes.
   * Sorts the form groups and fields by their order and assigns fields to groups.
   * @param fields - The form fields to be sorted and assigned to groups.
   * @param formGroupSections - The form groups to be sorted and assigned fields.
   */
  assignFieldsToGroupByGroupId(fields: any[], formGroupSections: any[]): void {
    let visibleFormFields: any[];

    if (this.updatedFormFields.forms.formId === 'cnt_individual') {
      visibleFormFields = fields.filter((field: any) => field.visible && field.formCode === 35
        && field.formGroupingCode !== 113 && field.formSubGroupingCode !== 126 );

    } else if(this.updatedFormFields.forms.formId === 'cnt_corporate') {
      visibleFormFields = fields.filter((field: any) => field.visible &&  field.formCode === 34 &&
        field.formSubGroupingCode !== 112  &&
        field.formSubGroupingCode !== 115 && field.formSubGroupingCode !== 117 &&
        field.formGroupingCode !== 107 && field.formSubGroupingCode !== 113);
    }

    formGroupSections.forEach(section => {
      section.fields = [];
    })

    visibleFormFields.forEach(field => {
      formGroupSections.forEach(section => {
        if (field.formGroupingCode === section.code) {
          section.fields.push(field);
        }
      })
    });

    this.formGroupSections = formGroupSections;
    log.info('Form group sections', this.formGroupSections);
    this.addFieldsToSections(formGroupSections);

    this.wealthAmlFormFields = fields.filter(field => field.formSubGroupingCode === 125);
    this.corporateContactDetailsFormField = fields.filter(field => field.formSubGroupingCode === 112);
    this.corporateAddressDetailsFormField = fields.filter(field => field.formSubGroupingCode === 117);
    this.corporateFinancialDetailsFormField = fields.filter(field => field.formSubGroupingCode === 115);
    this.corporateWealthAmlFormFieldsDetailsFormField = fields.filter(field => field.formSubGroupingCode === 118);
    this.corporateWealthCR12DetailsFormField = fields.filter(field => field.formSubGroupingCode === 119);
    this.corporateWealthOwnershipDetailsFormField = fields.filter(field => field.formSubGroupingCode === 120);
    this.privacyFormFields = fields.filter(field => field.formSubGroupingCode === 113 );
    this.branchDetailsFormFields = fields.filter(field => field.formSubGroupingCode === 'branch_details');

    log.info(`wealthAmlFormFields >>> `, this.wealthAmlFormFields);
    log.info(`formGroupSections >>> `, this.formGroupSections);
    log.info(`branchDetailsFormFields >>> `, this.branchDetailsFormFields);
    log.info(`privacyFormFields >>> `, this.privacyFormFields);
  }

  /**
   * Adds the fields to the form groups based on their order.
   * @param formGroupSection - The form groups to be assigned fields.
   */
  addFieldsToSections(formGroupSection: any[]): void {
    formGroupSection.forEach(section => {
      const group = this.fb.group({});

      section.fields.forEach(field => {
        const control = field.mandatory
          ? this.fb.control('', Validators.required)
          : this.fb.control('');

        group.addControl(field.fieldId, control);
      });

      this.entityForm.addControl(section.groupId, group);
    });
    log.info('Adding fields to sections', this.entityForm);
  }

  /**
   * Updates the form fields with the updated form fields data.
   * Replaces the fields in the dynamic setup data with the matched fields from the updated form fields.
   * Adds the fields to the form groups based on their order.
   * Detects changes in the component.
   */
  updateFormFields() {
    this.dynamicSetupData.fields = this.dynamicSetupData.fields.map(field => {
      const matchedField = this.updatedFormFields.fields.find(formField => formField.code === field.code);
      if (matchedField) {
        return matchedField;
      }
      return field;
    });
    log.info('Updated form fields', this.dynamicSetupData.fields);
    this.addUploadFormFields();
    this.fetchFormFieldsSetup();
    this.cdr.detectChanges();
  }
}
