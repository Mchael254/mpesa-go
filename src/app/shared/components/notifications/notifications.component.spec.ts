import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import {
  MessageModule,
  MessageService,
  MessagesModule,
  ToastModule,
} from 'primeng';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ToastModule, MessageModule, MessagesModule],
      declarations: [NotificationsComponent],
      providers: [MessageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
