import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoverTypeService } from '../../../services/cover-type/cover-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from 'src/app/shared/shared.module';

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

  ngOnInit(): void {
    this.createCoverForm();
    this.spinner.show();
    this.loadAllCovertypes();
  }

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

  loadAllCovertypes(){
    this.coverTypesService.getAllCovertypes().subscribe((data)=>{
      this.coverTypeData = data._embedded.cover_type_dto_list;
      this.filteredCover = data._embedded.cover_type_dto_list;
      log.info(`coverType >>>`, this.coverTypeData);
      this.spinner.hide();
      this.cdr.detectChanges();
      
    })
  }

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



  filterCovers(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredCover = this.coverTypeData.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

  newCover(){
    this.coverForm.reset()
    this.new = true
  }
  
  save(){
    if(this.new==true){
      this.addCover();
    }else{
      this.updateCover();
    }
  
  }

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
