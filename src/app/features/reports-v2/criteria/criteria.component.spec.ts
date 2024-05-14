import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaComponent } from './criteria.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Criteria} from "../../../shared/data/reports/criteria";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateModule} from "@ngx-translate/core";

describe('CriteriaComponent', () => {
  const reportServiceStub = createSpyObj('ReportService', ['fetchFilterConditions']);

  let component: CriteriaComponent;
  let fixture: ComponentFixture<CriteriaComponent>;

  const criteria: Criteria[] = [
    {
      category: 'metrics',
      categoryName: 'Metrics',
      subcategory: 'premiumAmounts',
      subCategoryName: 'Premium Amounts',
      transaction: 'General_Policy_Transactions',
      query: 'yAgoPremium',
      queryName: 'Year Ago Premium',
    },
    {
      category: 'whofilters',
      categoryName: 'Who Filters',
      subcategory: 'agent',
      subCategoryName: 'Intermediary',
      transaction: 'General_Insurance_Agents',
      query: 'agentName',
      queryName: 'Agent Name',
    },
  ]

  beforeEach(() => {
    jest.spyOn(reportServiceStub, 'fetchFilterConditions' ).mockReturnValue(of({}))

    TestBed.configureTestingModule({
      declarations: [CriteriaComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CriteriaComponent);
    component = fixture.componentInstance;
    component.criteria = criteria;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should select a criteria', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#selectCriteriaBtn');
    button.click();
    fixture.detectChanges();

    expect(component.conditions.length).toEqual(7);
    expect(component.selectedCriterion).toBe(criteria[0]);
  });

  test('should add filter', () => {
    const selectCriteriaBtn = fixture.debugElement.nativeElement.querySelector('#selectCriteriaBtn');
    selectCriteriaBtn.click();

    const button = fixture.debugElement.nativeElement.querySelector('#addFilterBtn');
    button.click();
    fixture.detectChanges();
    expect(component.selectedCriterion.filter).toBe("Year Ago Premium gt ")
  });

  test('should add sorting', () => {
    const selectCriteriaBtn = fixture.debugElement.nativeElement.querySelector('#selectCriteriaBtn');
    selectCriteriaBtn.click();

    const button = fixture.debugElement.nativeElement.querySelector('.sorting');
    button.click();
    fixture.detectChanges();
    expect(component.selectedCriterion.sort).toBe("Sort order: asc")
  });

  test('should remove sorting', () => {
    const removeSortingBtn = fixture.debugElement.nativeElement.querySelector('#removeSorting');
    removeSortingBtn.click();
    fixture.detectChanges();
    expect(component.removeSorting.call).toBeTruthy();
  });

});
