import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubclassesDTO} from "../../../../data/gisDTO";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ClassesSubclassesService} from "../../../../services/classes-subclasses/classes-subclasses.service";
import {tap} from "rxjs/operators";
import {Logger} from "../../../../../../../../shared/services";

const log = new Logger('SubClassListingComponent');

@Component({
  selector: 'app-sub-class-listing',
  templateUrl: './sub-class-listing.component.html',
  styleUrls: ['./sub-class-listing.component.css']
})
export class SubClassListingComponent implements OnInit {
  @Output() selectedSubclassEvent: EventEmitter<number> = new EventEmitter<number>();

  subclassList: SubclassesDTO[];

  isDisplayed:boolean;
  filterBy: any

  subclassForm: FormGroup

  constructor(public fb: FormBuilder,
              public cdr: ChangeDetectorRef,
              public gisClassesService: ClassesSubclassesService) {}

  ngOnInit(): void {
    this.createForm();
    this.loadAllSubclasses();
  }

  /**
   * Create the small form for the subclass to show the Subclass details
   */
  createForm() {
    this.subclassForm = this.fb.group({
      code: new FormControl(''),
      description: new FormControl(''),
    })

  }

  /**
   * Get the selected subclass and emit it to the parent component
   * @param subClassCode of the selected subclass
   * @param data
   */
  selectedSubclass(data: any) {
    this.subclassForm.patchValue({
      code: data?.code,
      description: data?.description,
    })
    this.selectedSubclassEvent.emit(data?.code);
  }

  /**
   * Load all subclasses to be listed
   */
  loadAllSubclasses() {
    return this.gisClassesService.getSubclasses1()
      .pipe(
      tap(() => (this.isDisplayed = true))
      )
      .subscribe(
        (data: SubclassesDTO[]) => {
      this.subclassList = data;
      this.isDisplayed = true;
      this.cdr.detectChanges();
    })
  }


}
