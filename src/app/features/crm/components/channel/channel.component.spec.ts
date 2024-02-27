import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';

import { ChannelComponent } from './channel.component';
import { ChannelService } from '../../services/channel.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SharedModule } from '../../../../shared/shared.module';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { ChannelsDTO } from '../../data/channels';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';

const mockChannelsData: ChannelsDTO[] = [
  {
    channelDesc: '',
    channelName: '',
    id: 0,
  },
];

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'description',
    screenName: '',
    groupId: '',
    module: '',
  },
];

export class MockChannelService {
  getChannels = jest.fn().mockReturnValue(of(mockChannelsData));
  createChannel = jest.fn().mockReturnValue(of(mockChannelsData));
  updateChannel = jest.fn().mockReturnValue(of(mockChannelsData));
  deleteChannel = jest.fn().mockReturnValue(of());
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

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;
  let channelServiceStub: ChannelService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        {
          provide: ChannelService,
          useClass: MockChannelService,
        },
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    channelServiceStub = TestBed.inject(ChannelService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch channels successfully', () => {
    jest.spyOn(channelServiceStub, 'getChannels');
    component.fetchChannels();
    expect(channelServiceStub.getChannels).toHaveBeenCalled();
    expect(component.channelsData).toEqual(mockChannelsData);
  });

  test('should handle error when fetching channels', () => {
    const errorMessage = 'Failed to fetch channels';
    jest
      .spyOn(channelServiceStub, 'getChannels')
      .mockReturnValue(throwError({ message: errorMessage }));
    component.fetchChannels();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to fetch channels');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to fetch channels'
    );
  });

  test('should open Channel Modal', () => {
    component.openChannelModal();

    const modal = document.getElementById('channelModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Channel Modal', () => {
    const modal = document.getElementById('channelModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeChannelModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should filter channels on filterChannels', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.channelTable, 'filterGlobal');

    component.filterChannels(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should set the selected channel when a channel is selected', () => {
    const mockChannel: ChannelsDTO = {
      id: 1,
      channelDesc: 'CHN1',
      channelName: 'Channel 1',
    };
    expect(component.selectedChannel).toBeUndefined();
    component.onChannelRowSelect(mockChannel);

    expect(component.selectedChannel).toEqual(mockChannel);
  });

  test('should save a new channel', () => {
    jest.spyOn(component, 'fetchChannels');
    component.createChannelForm.setValue({
      description: 'Test Description',
      name: 'Test Name',
    });

    component.saveChannel();

    expect(channelServiceStub.createChannel).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created a Channel'
    );
    expect(component.fetchChannels).toHaveBeenCalled();
  });

  test('should handle error when saving a channel', () => {
    component.createChannelForm.setValue({
      description: 'Test Description',
      name: 'Test Name',
    });
    const errorMessage = 'Failed to save a channel';
    jest
      .spyOn(channelServiceStub, 'createChannel')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveChannel();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to save a channel');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save a channel'
    );
  });

  test('should update a channel', () => {
    jest.spyOn(component, 'fetchChannels');
    const formData = {
      description: 'Updated Test Description',
      name: 'Updated Test Name',
    };
    const selectedChannel: ChannelsDTO = {
      channelDesc: 'Test Description',
      channelName: 'Test Name',
      id: 24,
    };

    component.selectedChannel = selectedChannel;
    const channelId = selectedChannel.id;
    component.createChannelForm.setValue({
      description: 'Updated Test Description',
      name: 'Updated Test Name',
    });

    component.createChannelForm.patchValue(formData);

    jest.spyOn(channelServiceStub, 'updateChannel');

    component.saveChannel();

    expect(channelServiceStub.updateChannel).toHaveBeenCalledWith(
      selectedChannel.id,
      {
        channelDesc: formData.description,
        channelName: formData.name,
        id: selectedChannel.id,
      }
    );
    expect(channelServiceStub.updateChannel).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated a Channel'
    );
    expect(component.fetchChannels).toHaveBeenCalled();
  });

  test('should open channel modal and patch form values when a channel is selected', () => {
    jest.spyOn(component, 'openChannelModal');
    const selectedChannel = {
      id: 1,
      channelName: 'Test Channel',
      channelDesc: 'Test Description',
    };
    component.selectedChannel = selectedChannel;

    component.editChannel();

    expect(component.openChannelModal).toHaveBeenCalled();
    expect(component.createChannelForm.value).toEqual({
      name: selectedChannel.channelName,
      description: selectedChannel.channelDesc,
    });
  });

  test('should display error message if no channel is selected', () => {
    component.editChannel();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Channel is selected!.'
    );
  });

  test('should display error message if no channel is selected in confirmChannelDelete', () => {
    component.confirmChannelDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Channel is selected!.'
    );
  });

  test('should delete channel and display success message in confirmChannelDelete', () => {
    jest.spyOn(component, 'fetchChannels');

    const selectedChannel: ChannelsDTO = {
      channelDesc: 'Delete Description',
      channelName: 'Deleted Channel',
      id: 24,
    };

    component.selectedChannel = selectedChannel;

    const deleteChannelResponse = selectedChannel;

    jest
      .spyOn(channelServiceStub, 'deleteChannel')
      .mockReturnValue(of(deleteChannelResponse));

    component.confirmChannelDelete();

    expect(channelServiceStub.deleteChannel).toHaveBeenCalledWith(
      selectedChannel.id
    );
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a channel'
    );
    expect(component.selectedChannel).toBeNull();
    expect(component.fetchChannels).toHaveBeenCalled();
  });
});
