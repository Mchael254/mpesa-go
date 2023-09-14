import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoverTypeService } from '../../../services/cover-type/cover-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';

const log = new Logger('CoverComponent');

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.css']
})
export class CoverComponent implements OnInit {

  public coverForm: FormGroup;
  public searchForm:FormGroup;
  public editCoverForm:FormGroup;

  public filteredCover: any;
  public coverDetails: any;
  public coverTypeData: any;
  public selected :any;
  public new:boolean =true;

  constructor(
    public fb: FormBuilder,
    public coverTypesService: CoverTypeService,
    public cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
  ) {

  }

  /**
   * The ngOnInit function initializes the component by creating a cover form, showing a spinner, and
   * loading all cover types.
   */
  ngOnInit(): void {
    this.createCoverForm();
    this.spinner.show();
    this.loadAllCovertypes();
  }

  /**
   * The function creates a form with various fields and validators for a cover form and a search form.
   */
  createCoverForm(){
    this.coverForm = this.fb.group({
      short_description: ['', Validators.required],
      details:  ['', Validators.required],
      description:  ['', Validators.required],
      minimum_sum_insured:  ['', Validators.required], 
      downgrade_on_suspension:[null],
      downgrade_on_suspension_to:[null],
      organization_code:['2', {nonNullable: true}],
      version: [0, {nonNullable: true}],
    })
    this.searchForm = this.fb.group({
      search:['']
    })
  }

 /**
  * The function "loadAllCovertypes" loads all cover types from a service and assigns the data to the
  * "coverTypeData" and "filteredCover" variables.
  */
  loadAllCovertypes(){
    this.coverTypesService.getAllCovertypes().subscribe((data)=>{
      this.coverTypeData = data._embedded.cover_type_dto_list;
      this.filteredCover = data._embedded.cover_type_dto_list;
      log.info(`coverType >>>`, this.coverTypeData);
      this.spinner.hide();
      this.cdr.detectChanges();
      
    })
  }

  /**
   * The function "loadCoverType" loads cover type details from a service and updates the cover form
   * with the retrieved data.
   * @param {any} id - The id parameter is the identifier of the cover type that needs to be loaded. It
   * is used to fetch the cover type details from the coverTypesService.
   * @param {any} item - The "item" parameter is a variable that represents the item being loaded. It
   * is used to set the "selected" property in the function.
   */
  loadCoverType(id:any,item: any){
    this.coverTypesService.getCoverType(id).subscribe(res=>{
      this.coverDetails = res;
      this.coverForm.patchValue(this.coverDetails) 
      this.coverForm.controls['organization_code'].setValue(2);
      this.coverForm.controls['version'].setValue(0);
      this.selected = item; 
      this.new = false;
      this.cdr.detectChanges();
     
    });
   }



 /**
  * The function filters a list of cover types based on a search value entered by the user.
  * @param {any} event - The event parameter is an object that represents the event that triggered the
  * function. It could be an input event, such as a keyup or change event, or any other event that can
  * be triggered by user interaction.
  */
  filterCovers(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredCover = this.coverTypeData.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

  /**
   * The function "newCover()" resets the cover form and sets the "new" flag to true.
   */
  newCover(){
    this.coverForm.reset()
    this.new = true
  }
  
  /**
   * The "save" function checks if a new cover needs to be added or an existing cover needs to be
   * updated.
   */
  save(){
    if(this.new==true){
      this.addCover();
    }else{
      this.updateCover();
    }
  
  }

  /**
   * The addCover function logs the coverForm value, creates a cover using the coverForm value, and
   * displays a success message if the cover is created successfully or an error message if it fails.
   */
  addCover(){
    console.log(this.coverForm.value)
    this.coverTypesService.createCover(this.coverForm.value).subscribe((data: {}) => {
    
      try{
        log.info(this.coverForm.value)
        this.globalMessagingService.displaySuccessMessage('success', 'Cover successfully created');
      }catch(error){
        log.info(this.coverForm.value)
        this.globalMessagingService.displayErrorMessage('error', 'Cover failed to create!');
      
      }
    });
  }
  /**
   * The function `updateCover()` updates a cover using the cover form values and displays success or
   * error messages accordingly.
   */
  updateCover(){
    log.info(this.coverDetails)
    let id = this.coverDetails.code
    this.coverTypesService.updateCover(this.coverForm.value,id).subscribe((data)=>{
      try{
        this.coverForm.reset(); 
        log.info(this.coverForm.value)
        this.globalMessagingService.displaySuccessMessage('success', 'Cover successfully Updated');
      }catch(error){
        log.info(this.coverForm.value)
        this.globalMessagingService.displayErrorMessage('error', 'Cover failed to Update!');
      
      }
    })
  }

 /**
  * The function `deleteCover()` checks if a cover is selected and then deletes it, displaying success
  * or error messages accordingly.
  */
  deleteCover() { 
    if(this.selected==undefined){
      this.globalMessagingService.displayErrorMessage('error', 'Select a Cover to Continue!');
    }else{
        this.coverTypesService.deleteCover(this.coverDetails.code).subscribe(
          (res)=>{
            this.globalMessagingService.displaySuccessMessage('success', 'Cover of code ${this.coverDetails.cod} successfully Deleted');
            this.loadAllCovertypes();
        },
          (error: HttpErrorResponse) => {
            log.info(error);
            this.globalMessagingService.displayErrorMessage('error', 'You cannot delete this Cover type!');
            this.coverForm.reset(); 
          }
        )
   }
  }

}
