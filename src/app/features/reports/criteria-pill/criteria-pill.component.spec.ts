import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaPillComponent } from './criteria-pill.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ReactiveFormsModule} from "@angular/forms";

describe('CriteriaPillComponent', () => {
  let component: CriteriaPillComponent;
  let fixture: ComponentFixture<CriteriaPillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaPillComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    });
    fixture = TestBed.createComponent(CriteriaPillComponent);
    component = fixture.componentInstance;
    component.queryObject = {
      category: '',
      categoryName: '',
      subcategory: '',
      subCategoryName: '',
      transaction: '',
      query: '',
      queryName: '',
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
