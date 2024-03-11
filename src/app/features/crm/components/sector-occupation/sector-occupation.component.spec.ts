import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { SectorOccupationComponent } from './sector-occupation.component';
import { SectorService } from '../../../../shared/services/setups/sector/sector.service';
import { OccupationService } from '../../../../shared/services/setups/occupation/occupation.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SharedModule } from '../../../../shared/shared.module';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { SectorDTO } from '../../../../shared/data/common/sector-dto';
import { OccupationDTO } from '../../../../shared/data/common/occupation-dto';
import { UtilService } from '../../../../shared/services/util/util.service';

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 1,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'shortDescription',
    screenName: '',
    groupId: '',
    module: '',
  },
];

const mockSectorsData: SectorDTO[] = [
  {
    id: 1,
    shortDescription: 'TS',
    name: 'Test Sector',
    sectorWefDate: '',
    sectorWetDate: '',
    organizationId: 2,
  },
  {
    id: 2,
    shortDescription: 'TS-2',
    name: 'Test Sector 2',
    sectorWefDate: '',
    sectorWetDate: '',
    organizationId: 2,
  },
];

const mocksectorData: SectorDTO = {
  id: 1,
  shortDescription: 'TS',
  name: 'Test Sector',
  sectorWefDate: '',
  sectorWetDate: '',
  organizationId: 2,
};

const mockOcuppationsData: OccupationDTO[] = [
  {
    id: 1,
    shortDescription: 'TO',
    name: 'Test Occupation',
    wefDate: '',
    wetDate: '',
    organizationId: 2,
  },
  {
    id: 2,
    shortDescription: 'TO-2',
    name: 'Test Occupation 2',
    wefDate: '',
    wetDate: '',
    organizationId: 2,
  },
];

const mockOccupationData: OccupationDTO = {
  id: 1,
  shortDescription: 'TO',
  name: 'Test Occupation',
  wefDate: '',
  wetDate: '',
  organizationId: 2,
};

export class MockSectorService {
  getSectors = jest.fn().mockReturnValue(of(mockSectorsData));
  createSector = jest.fn().mockReturnValue(of(mocksectorData));
  updateSector = jest.fn().mockReturnValue(of(mocksectorData));
  deleteSector = jest.fn().mockReturnValue(of(mocksectorData));
}

export class MockOccupationService {
  getOccupations = jest.fn().mockReturnValue(of(mockOcuppationsData));
  createOccupation = jest.fn().mockReturnValue(of(mockOccupationData));
  updateOccupation = jest.fn().mockReturnValue(of(mockOccupationData));
  deleteOccupation = jest.fn().mockReturnValue(of(mockOccupationData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}
export class MockUtilService {
  findScrollContainer(control: any) {
    return document.createElement('div');
  }
}

describe('SectorOccupationComponent', () => {
  let component: SectorOccupationComponent;
  let fixture: ComponentFixture<SectorOccupationComponent>;
  let sectorServiceStub: SectorService;
  let occupationServiceStub: OccupationService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;
  let utilServiceStub: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectorOccupationComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        SharedModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: SectorService,
          useClass: MockSectorService,
        },
        {
          provide: OccupationService,
          useClass: MockOccupationService,
        },
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
        {
          provide: UtilService,
          useClass: MockUtilService,
        },
      ],
    });
    fixture = TestBed.createComponent(SectorOccupationComponent);
    component = fixture.componentInstance;
    sectorServiceStub = TestBed.inject(SectorService);
    occupationServiceStub = TestBed.inject(OccupationService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    utilServiceStub = TestBed.inject(UtilService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should filter Sectors on filterSectors', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.sectorTable, 'filterGlobal');

    component.filterSectors(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should filter Occupations on filterOccupations', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.occupationTable,
      'filterGlobal'
    );

    component.filterOccupations(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should set the selected Sector when a Sector is selected', () => {
    expect(component.selectedSector).toBeUndefined();
    component.onSectorsRowSelect(mocksectorData);

    expect(component.selectedSector).toEqual(mocksectorData);
  });

  test('should set the selected Occupation when a Occuption is selected', () => {
    expect(component.selectedOccupation).toBeUndefined();
    component.onOccupationsRowSelect(mockOccupationData);

    expect(component.selectedOccupation).toEqual(mockOccupationData);
  });

  test('should open Sector Modal', () => {
    component.openSectorModal();

    const modal = document.getElementById('sectorModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Sector', () => {
    const modal = document.getElementById('sectorModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeSectorModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Occupation Modal', () => {
    component.openOccupationModal();

    const modal = document.getElementById('occupationModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Occupation Modal', () => {
    const modal = document.getElementById('occupationModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeOccupationModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should handle error when sector form is invalid', () => {
    component.submitted = true;
    component.createSectorForm.markAllAsTouched();

    const mockInvalidControl1: HTMLInputElement =
      document.createElement('input');
    mockInvalidControl1.classList.add('is-invalid');
    mockInvalidControl1.value = '';
    document.body.appendChild(mockInvalidControl1);

    const mockInvalidControl2: HTMLInputElement =
      document.createElement('input');
    mockInvalidControl2.classList.add('is-invalid');
    mockInvalidControl2.value = 'Some Value';
    document.body.appendChild(mockInvalidControl2);

    const focusSpy = jest.spyOn(mockInvalidControl1, 'focus');

    jest.spyOn(utilServiceStub, 'findScrollContainer').mockReturnValue(null);

    component.saveSector();

    expect(focusSpy).toHaveBeenCalled();

    expect(document.documentElement.scrollTop).toBe(0);
  });

  test('should save a new Sector', () => {
    jest.spyOn(component, 'fetchSectors');
    component.createSectorForm.setValue({
      shortDescription: 'TS',
      name: 'Test Sector',
    });

    component.saveSector();

    expect(sectorServiceStub.createSector).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created a Sector'
    );
    expect(component.fetchSectors).toHaveBeenCalled();
  });

  test('should handle error when saving a Sector', () => {
    component.createSectorForm.setValue({
      shortDescription: 'TS',
      name: 'Test Sector',
    });
    const errorMessage = 'Failed to save a Sector';
    jest
      .spyOn(sectorServiceStub, 'createSector')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveSector();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to save a Sector');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save a Sector'
    );
  });

  test('should update a Sector', () => {
    jest.spyOn(component, 'fetchSectors');
    const formData = {
      shortDescription: 'TS-Update',
      name: 'Test Sector Updated',
    };
    const selectedSector = mocksectorData;

    component.selectedSector = selectedSector;
    const sectorId = selectedSector.id;
    component.createSectorForm.setValue({
      shortDescription: 'TS-Update',
      name: 'Test Sector Updated',
    });

    component.createSectorForm.patchValue(formData);

    jest.spyOn(sectorServiceStub, 'updateSector');

    component.saveSector();

    expect(sectorServiceStub.updateSector).toHaveBeenCalledWith(sectorId, {
      id: sectorId,
      shortDescription: formData.shortDescription,
      name: formData.name,
      sectorWefDate: selectedSector.sectorWefDate,
      sectorWetDate: selectedSector.sectorWetDate,
      organizationId: selectedSector.organizationId,
    });
    expect(sectorServiceStub.updateSector).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated a Sector'
    );
    expect(component.fetchSectors).toHaveBeenCalled();
  });

  test('should handle error when updating a Sector', () => {
    jest.spyOn(component, 'fetchSectors');

    const formData = {
      shortDescription: 'TS-Update',
      name: 'Test Sector Updated',
    };
    const selectedSector = mocksectorData;

    component.selectedSector = selectedSector;
    const sectorId = selectedSector.id;
    component.createSectorForm.setValue(formData);
    component.createSectorForm.patchValue(formData);

    const errorMessage = 'Failed to update a Sector';
    jest
      .spyOn(sectorServiceStub, 'updateSector')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));

    component.saveSector();

    expect(sectorServiceStub.updateSector).toHaveBeenCalledWith(sectorId, {
      id: sectorId,
      shortDescription: formData.shortDescription,
      name: formData.name,
      sectorWefDate: selectedSector.sectorWefDate,
      sectorWetDate: selectedSector.sectorWetDate,
      organizationId: selectedSector.organizationId,
    });

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe(errorMessage);
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      errorMessage
    );
    expect(component.fetchSectors).not.toHaveBeenCalled();
  });

  test('should open Sector modal and patch form values when a sector is selected', () => {
    jest.spyOn(component, 'openSectorModal');
    const selectedSector = mocksectorData;
    component.selectedSector = selectedSector;

    component.editSector();

    expect(component.openSectorModal).toHaveBeenCalled();
    expect(component.createSectorForm.value).toEqual({
      shortDescription: selectedSector.shortDescription,
      name: selectedSector.name,
    });
  });

  test('should display error message if no Sector is selected', () => {
    component.editSector();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Sector is selected!.'
    );
  });

  test('should delete Sector and display success message in confirmSectorDelete', () => {
    jest.spyOn(component, 'fetchSectors');
    jest.spyOn(sectorServiceStub, 'deleteSector');

    const selectedSector = mocksectorData;

    component.selectedSector = selectedSector;

    component.confirmSectorDelete();

    expect(sectorServiceStub.deleteSector).toHaveBeenCalledWith(
      selectedSector.id
    );
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a Sector'
    );
    expect(component.selectedSector).toBeNull();
    expect(component.fetchSectors).toHaveBeenCalled();
  });

  test('should display error message if no Sector is selected in confirmSectorDelete', () => {
    component.confirmSectorDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Sector is selected!.'
    );
  });

  test('should handle error when occupation form is invalid', () => {
    component.submitted = true;
    component.createOccupationForm.controls['shortDescription'].markAsTouched();
    component.createOccupationForm.controls['shortDescription'].setValue('');
    component.createOccupationForm.controls['name'].markAsTouched();
    component.createOccupationForm.controls['name'].setValue('');

    const focusSpy = jest
      .spyOn(component['utilService'], 'findScrollContainer')
      .mockReturnValueOnce(null);

    component.saveOccupation();

    expect(focusSpy).toHaveBeenCalled();
  });

  test('should save a new Occupation', () => {
    jest.spyOn(component, 'fetchOccupations');
    component.createOccupationForm.setValue({
      shortDescription: 'TO',
      name: 'Test Occupation',
    });

    component.saveOccupation();

    expect(occupationServiceStub.createOccupation).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created an Occupation'
    );
    expect(component.fetchOccupations).toHaveBeenCalled();
  });

  test('should handle error when saving an Occupation', () => {
    component.createOccupationForm.setValue({
      shortDescription: 'TO',
      name: 'Test Occupation',
    });
    const errorMessage = 'Failed to save an Occupation';
    jest
      .spyOn(occupationServiceStub, 'createOccupation')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveOccupation();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to save an Occupation');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save an Occupation'
    );
  });

  test('should update an Occupation', () => {
    jest.spyOn(component, 'fetchOccupations');
    const formData = {
      shortDescription: 'TO-Update',
      name: 'Test Occupation Updated',
    };
    const selectedOccupation = mockOccupationData;

    component.selectedOccupation = selectedOccupation;
    const occupationId = selectedOccupation.id;
    component.createSectorForm.setValue({
      shortDescription: 'TO-Update',
      name: 'Test Occupation Updated',
    });

    component.createOccupationForm.patchValue(formData);

    jest.spyOn(occupationServiceStub, 'updateOccupation');

    component.saveOccupation();

    expect(occupationServiceStub.updateOccupation).toHaveBeenCalledWith(
      occupationId,
      {
        id: occupationId,
        shortDescription: formData.shortDescription,
        name: formData.name,
        wefDate: selectedOccupation.wefDate,
        wetDate: selectedOccupation.wetDate,
        organizationId: selectedOccupation.organizationId,
      }
    );
    expect(occupationServiceStub.updateOccupation).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated an Occupation'
    );
    expect(component.fetchOccupations).toHaveBeenCalled();
  });

  test('should handle error when updating an Occupation', () => {
    jest.spyOn(component, 'fetchOccupations');

    const formData = {
      shortDescription: 'TO-Update',
      name: 'Test Occupation Updated',
    };
    const selectedOccupation = mockOccupationData;

    component.selectedOccupation = selectedOccupation;
    const occupationId = selectedOccupation.id;
    component.createOccupationForm.setValue(formData);
    component.createOccupationForm.patchValue(formData);

    const errorMessage = 'Failed to update an Occupation';
    jest
      .spyOn(occupationServiceStub, 'updateOccupation')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));

    component.saveOccupation();

    expect(occupationServiceStub.updateOccupation).toHaveBeenCalledWith(
      occupationId,
      {
        id: occupationId,
        shortDescription: formData.shortDescription,
        name: formData.name,
        wefDate: selectedOccupation.wefDate,
        wetDate: selectedOccupation.wetDate,
        organizationId: selectedOccupation.organizationId,
      }
    );

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe(errorMessage);
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      errorMessage
    );
    expect(component.fetchOccupations).not.toHaveBeenCalled();
  });

  test('should open Occupation modal and patch form values when a occupation is selected', () => {
    jest.spyOn(component, 'openOccupationModal');
    const selectedOccupation = mockOccupationData;
    component.selectedOccupation = selectedOccupation;

    component.editOccupation();

    expect(component.openOccupationModal).toHaveBeenCalled();
    expect(component.createOccupationForm.value).toEqual({
      shortDescription: selectedOccupation.shortDescription,
      name: selectedOccupation.name,
    });
  });

  test('should display error message if no Occupation is selected', () => {
    component.editOccupation();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Occupation is selected!.'
    );
  });

  test('should delete Occupation and display success message in confirmOccupationDelete', () => {
    jest.spyOn(component, 'fetchOccupations');
    jest.spyOn(occupationServiceStub, 'deleteOccupation');

    const selectedOccupation = mockOccupationData;

    component.selectedOccupation = selectedOccupation;

    component.confirmOccupationDelete();

    expect(occupationServiceStub.deleteOccupation).toHaveBeenCalledWith(
      selectedOccupation.id
    );
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted Occupation'
    );
    expect(component.selectedOccupation).toBeNull();
    expect(component.fetchOccupations).toHaveBeenCalled();
  });

  test('should display error message if no Occupation is selected in confirmOccupationDelete', () => {
    component.confirmOccupationDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Occupation is selected!.'
    );
  });
});
