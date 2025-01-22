import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-setup-search-list-screen',
  templateUrl: './dynamic-setup-search-list-screen.component.html',
  styleUrls: ['./dynamic-setup-search-list-screen.component.css'],
  standalone : false
})
export class DynamicSetupSearchListScreenComponent {

  @Input() dynamicTitle: string = 'Default Title';
  @Input() placeHolder: string = 'Search Parameters';
  @Input() dynamicButtonLabel: string = 'New';
  @Input() paramsList: {name:string, code:string}[] = [];
  @Output() newButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadParamAction: EventEmitter<any> = new EventEmitter<any>();

  filterBy: any;
  searchForm:FormGroup;

  constructor(
    public fb: FormBuilder,
  ) { }
  onNewButtonClick() {
    this.newButtonClick.emit(true);
  }
  createClassForm(){
     this.searchForm = this.fb.group({
      search:['']
    })
   }
   loadParam(item: any){

    this.loadParamAction.emit(item)

   }
}
