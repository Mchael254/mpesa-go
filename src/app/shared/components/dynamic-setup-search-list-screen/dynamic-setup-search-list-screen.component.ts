import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-setup-search-list-screen',
  templateUrl: './dynamic-setup-search-list-screen.component.html',
  styleUrls: ['./dynamic-setup-search-list-screen.component.css']
})
export class DynamicSetupSearchListScreenComponent {

  @Input() dynamicTitle: string = 'Default Title';
  @Input() placeHolder: string = 'Search Parameters';
  @Input() dynamicButtonLabel: string = 'New';
  @Input() paramsList: any[] = [];
  @Output() newButtonClick: EventEmitter<void> = new EventEmitter<void>();
  
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

  onNewButtonClick() {
    this.newButtonClick.emit();
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
