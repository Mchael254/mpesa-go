import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-setup-search-list-screen',
  templateUrl: './dynamic-setup-search-list-screen.component.html',
  styleUrls: ['./dynamic-setup-search-list-screen.component.css']
})
export class DynamicSetupSearchListScreenComponent {
  paramsList:any = [];
  paramDetails:any = []; 
  selected :any;
  filterBy: any;
  searchForm:FormGroup;

  constructor(
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAllParams();
  }
  loadAllParams(){
     }
   loadParam(id:any,item: any){
    
   }
   isActive(item: any) {
  }
  createClassForm(){
     this.searchForm = this.fb.group({
      search:['']
    })
   }

  

}
