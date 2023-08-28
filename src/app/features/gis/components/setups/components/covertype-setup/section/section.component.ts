import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoverTypeService } from '../../../services/cover-type/cover-type.service';
import { Logger } from 'src/app/shared/shared.module';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Sections } from '../../../data/gisDTO';

const log = new Logger('ScreenCodesComponent');

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  public sectionForm: FormGroup;
  public sectionsList: Sections[];
  public filteredSection: Sections[];
  public selected :any;
  public sectionDetails: any
  public isUpdate: boolean = true;

  constructor(
    public coverTypesService: CoverTypeService,
    private globalMessagingService: GlobalMessagingService,
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) { }
  
  ngOnInit(): void {
    this.createSectionForm();
    this.spinner.show();
    this.loadAllSections();
  }

  createSectionForm() {
    this.sectionForm = this.fb.group({
      code: null,
      shortDescription: new FormControl(''),
      description: new FormControl(''),
      type: new FormControl(''),
      classCode: 100,
      excessDetails: null,
      section: null,
      webDescription: "SUM INSURED",
      dtlDescription: null,
      organizationCode: 2
    })
  }

  filterSections(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredSection = this.sectionsList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }
  
  loadAllSections (){
    this.coverTypesService.getAllSections().subscribe(data =>{
      this.sectionsList = data;
      this.filteredSection = data;
      log.info(`Sections List`, this.sectionsList)
      this.spinner.hide();
      this.cdr.detectChanges();
    })
  }

  selectedSection(code:any,item: any){
    this.coverTypesService.getSectionId(code).subscribe(response =>{
      this.sectionDetails = response
      this.sectionForm.patchValue(this.sectionDetails)
      this.cdr.detectChanges();
    })
  }
  updateSection(){
    const requestBody: Sections = this.sectionForm.value;
    const sectionCode = requestBody.code
    requestBody.code = null;
    requestBody.organizationCode = 2;
    try {
      this.coverTypesService.saveSection(requestBody,  sectionCode).subscribe(data =>{
        this.globalMessagingService.displaySuccessMessage('success', 'Section successfully Updated!');
      })
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('error', 'Section Failed to Update!');
    }
  }
  createNewSection(){
    this.sectionForm.reset({
      code: null,
      classCode: 100,
      excessDetails: null,
      section: null,
      webDescription: "SUM INSURED",
      dtlDescription: null,
      organizationCode: 2
    });
    this.isUpdate = false;
   
  }
  createSection(){
    log.info(this.sectionForm.value)
    try {
      this.coverTypesService.createSection(this.sectionForm.value).subscribe(data =>{
        this.globalMessagingService.displaySuccessMessage('success', 'Section successfully Created');
      })
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('error', 'Section Failed to Create!');
    }
  }
  save(){
    if (this.isUpdate) {
      // Update existing product
      this.updateSection()
    } else {
      // Create new product
       this.createSection();
    }
  }

}
