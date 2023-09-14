import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ListEntityComponent } from './list-entity.component';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { EntityService } from '../../../services/entity/entity.service';
import { DynamicBreadcrumbComponent } from '../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { DynamicTableComponent } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';

const IdentityMode: IdentityModeDTO = {
  id: 0,
  name: '',
  identityFormat: '',
  identityFormatError: '',
  organizationId: 0,
}

const entity: EntityDto[] = [
  {
  categoryName: '',
  countryId: 0,
  dateOfBirth: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
  id: 0,
  modeOfIdentity: IdentityMode,
  modeOfIdentityName: '',
  identityNumber: 0,
  name: '',
  organizationId: 0,
  pinNumber: '',
  profilePicture: '',
  profileImage: '',
  partyTypeId: 0,
  }
]

export class MockEntityService {
  getEntities = jest.fn().mockReturnValue(of(entity));
}

describe('ListEntityComponent', () => {
  let component: ListEntityComponent;
  let fixture: ComponentFixture<ListEntityComponent>;
  let entityServiceStub: EntityService;
  let routeStub: Router;
  let spinnerStub: NgxSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListEntityComponent,
        DynamicBreadcrumbComponent,
        DynamicTableComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NgxSpinnerModule.forRoot(),
      ],
      providers: [
        { provide: EntityService, useClass: MockEntityService },
      ]
    });
    fixture = TestBed.createComponent(ListEntityComponent);
    component = fixture.componentInstance;
    entityServiceStub = TestBed.inject(EntityService);
    routeStub = TestBed.inject(Router)
    spinnerStub = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should return entity data when getEntities is called', () => {
    jest.spyOn(entityServiceStub, 'getEntities');
    component.ngOnInit();
    fixture.detectChanges();
    expect(entityServiceStub.getEntities.call).toBeTruthy();
  });

  test('should call getEntities with correct arguments', () => {
    const pageIndex = 1;
    const sortField = 'createdDate';
    const sortOrder = 'desc';

    component.getEntities(pageIndex, sortField, sortOrder);

    expect(entityServiceStub.getEntities).toHaveBeenCalledWith(pageIndex, component.pageSize, sortField, sortOrder);
  });

  test('should load entities in descending order', () => {
    const event: LazyLoadEvent = {
      first: 0,
      rows: 10,
      sortField: 'name',
      sortOrder: 1, // 'asc'
    };
    component.ngOnInit();

    const hideSpinnerSpy = jest.spyOn(spinnerStub, 'hide');


    component.lazyLoadEntity(event);

    expect(entityServiceStub.getEntities).toHaveBeenCalledWith(0, component.pageSize, event.sortField, 'desc');
    // expect(component.tableDetails.rows).toEqual(component.entities.content);
    // expect(hideSpinnerSpy).toHaveBeenCalled();
  });

  test('should route to create new entity', () =>{
    const navigateSpy = jest.spyOn(routeStub,'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#newEntityButton');
    button.click();
    expect(component.createEntity.call).toBeTruthy();
    expect(navigateSpy).toHaveBeenCalledWith(['/home/entity/new']);
  });
});
