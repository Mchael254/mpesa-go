import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { of, throwError } from 'rxjs';

import { ProspectsComponent } from './prospects.component';
import { ProspectService } from '../../../../../features/entities/services/prospect/prospect.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { ProspectDto } from '../../../../../features/entities/data/prospectDto';

describe('ProspectsComponent', () => {
  let component: ProspectsComponent;
  let fixture: ComponentFixture<ProspectsComponent>;
  let prospectServiceStub: Partial<ProspectService>;
  let messagingServiceStub: Partial<GlobalMessagingService>;

  beforeEach(async () => {
    prospectServiceStub = {
      getAllProspects: jest.fn().mockReturnValue(
        of(<Pagination<ProspectDto>>{
          content: [
            {
              id: 1,
              surname: 'Doe',
              otherNames: 'John',
              emailAddress: 'john.doe@example.com',
            },
          ],
          totalElements: 1,
        })
      ),
      deleteProspect: jest.fn().mockReturnValue(of(true)),
    };

    messagingServiceStub = {
      displaySuccessMessage: jest.fn(),
      displayErrorMessage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ProspectsComponent],
      providers: [
        { provide: ProspectService, useValue: prospectServiceStub },
        { provide: GlobalMessagingService, useValue: messagingServiceStub },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProspectsComponent);
    component = fixture.componentInstance;
    component.prospectTable = { filterGlobal: jest.fn() } as unknown as Table;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should load prospects on lazy load', () => {
    const mockEvent = {
      first: 0,
      rows: 10,
      sortField: 'surname',
      sortOrder: 1,
    } as any;
    component.lazyLoadProspects(mockEvent);

    expect(prospectServiceStub.getAllProspects).toHaveBeenCalledWith(
      0,
      10,
      'surname',
      'desc'
    );
    expect(component.prospectsData.content.length).toBe(1);
  });

  test('should filter prospects on filterProspects', () => {
    component.prospectTable = {
      filterGlobal: jest.fn(),
    } as unknown as Table;

    const mockEvent = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;

    const filterGlobalSpy = jest.spyOn(component.prospectTable, 'filterGlobal');

    component.filterProspects(mockEvent);

    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should select a prospect on row click', () => {
    const mockProspect = {
      id: 1,
      surname: 'Doe',
      otherNames: 'John',
    } as ProspectDto;
    component.onProspectRowSelect(mockProspect);

    expect(component.selectedProspect).toBe(mockProspect);
  });

  test('should display success message on prospect deletion', () => {
    component.selectedProspect = { id: 1 } as ProspectDto;
    component.confirmProspectDelete();

    expect(prospectServiceStub.deleteProspect).toHaveBeenCalledWith(1);
    expect(messagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a prospect'
    );
    expect(component.selectedProspect).toBeNull();
  });

  test('should display error message if no prospect is selected for deletion', () => {
    component.selectedProspect = null;
    component.confirmProspectDelete();

    expect(messagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Prospect is selected!.'
    );
  });

  test('should display error message if prospect deletion fails', () => {
    prospectServiceStub.deleteProspect = jest
      .fn()
      .mockReturnValue(throwError({ error: { errors: ['Deletion failed'] } }));
    component.selectedProspect = { id: 1 } as ProspectDto;
    component.confirmProspectDelete();

    expect(messagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Deletion failed'
    );
  });

  test('should call createProspect when add icon is clicked', () => {
    jest.spyOn(component, 'createProspect');
    component.createProspect();

    expect(component.createProspect).toHaveBeenCalled();
  });

  test('should call editProspect when edit icon is clicked', () => {
    jest.spyOn(component, 'editProspect');
    component.editProspect();

    expect(component.editProspect).toHaveBeenCalled();
  });

  test('should show confirmation modal when delete icon is clicked', () => {
    component.prospectConfirmationModal = { show: jest.fn() } as any;
    jest.spyOn(component.prospectConfirmationModal, 'show');
    component.deleteProspect();

    expect(component.prospectConfirmationModal.show).toHaveBeenCalled();
  });
});
