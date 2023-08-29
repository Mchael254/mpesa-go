import { ChangeDetectorRef,Component } from '@angular/core';
import { territories } from '../../../data/gisDTO';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TerritoriesService } from '../../../services/perils-territories/territories/territories.service';
@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.css']
})
export class TerritoryComponent {

  territoryList: territories[];
  territory:any;
  isDisplayed:boolean;
  new:boolean;
  territoryForm:FormGroup;
  selected :any;
  filteredTerritories: territories[]=[];
  searchText = '';

  constructor(
    public service:TerritoriesService,
    public cdr: ChangeDetectorRef,
    public fb:FormBuilder,
    private messageService: MessageService,
  ) { 
  }

  ngOnInit(): void {
    this.createForm()
    this.loadAllTerritories()
  }

  loadAllTerritories(){
    return this.service.getAllTerritories().pipe(tap(() => (this.isDisplayed = true)),).subscribe((data) => {
     this.territoryList = data;
     this.cdr.detectChanges();
     this.isDisplayed = true; 
     this.filteredTerritories = data
     console.log(this.territoryList)
   })   }
   loadTerritory(id:any,item: any){
    
    return this.service.getTerritory(id).subscribe(res=>{
      this.territory = res;
      console.log(this.territory);
      this.territoryForm.patchValue(this.territory) 
      this.selected = item; 
      this.cdr.detectChanges();
      this.new = false;
    });
    
   }

   isActive(item: any) {
    return this.selected === item;
  }
  createForm(){
    this.territoryForm = this.fb.group({
      code:['',Validators.required],
      description:['',Validators.required],
      details:['',Validators.required],
      organizationCode:['',Validators.required],
    })

  
   }

   New(){
    this.territoryForm.reset()
    this.new = true;
    this.territoryForm.removeControl('code')

   }

   save(){
    this.territoryForm.controls['organizationCode'].setValue('2')
    if(this.new == true){
      this.service.createTerritory(this.territoryForm.value).subscribe((data: {}) => {
      
        try{
          console.log(this.territoryForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          console.log(this.territoryForm.value)
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })
    }
    else{
      this.service.updateTerritory(this.territoryForm.value,this.territory.code).subscribe((data: {}) => {
      
        try{
          console.log(this.territoryForm.value)
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        }catch(error){
          console.log(this.territoryForm.value)
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        
        }
      })
    }
   }
   filter(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredTerritories = this.territoryList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

}
