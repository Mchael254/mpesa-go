import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTransactionsComponent } from './entity-transactions.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {createSpyObj} from "jest-createspyobj";
import {of} from "rxjs";
import {EntityService} from "../../../../services/entity/entity.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('EntityTransactionsComponent', () => {

  const entityServiceStub = createSpyObj('EntityService', [
    'fetchGisQuotationsByClientId', 'fetchGisClaimsByClientId', 'fetchGisPoliciesByClientId'
  ]);
  let component: EntityTransactionsComponent;
  let fixture: ComponentFixture<EntityTransactionsComponent>;

  beforeEach(() => {
    jest.spyOn(entityServiceStub, 'fetchGisQuotationsByClientId').mockReturnValue(of([]));
    jest.spyOn(entityServiceStub, 'fetchGisClaimsByClientId').mockReturnValue(of([]));
    jest.spyOn(entityServiceStub, 'fetchGisPoliciesByClientId').mockReturnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [EntityTransactionsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EntityService, useValue: entityServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(EntityTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch records', () => {
    component.fetchGisPoliciesByClientId(1111);
    component.fetchGisQuotationsByClientId(111);
    component.fetchGisClaimsByClientId(111);
    // write assertions
  });

  test('should getClaimsPremiumAndSumInsured', () => {
    component.getClaimsPremiumAndSumInsured([{}], 'grossPremium');
    // write assertions
  });

});
