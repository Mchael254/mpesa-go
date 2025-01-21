import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reusable-input',
  template: `
    <div class="modal" [id]="modalId" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              (click)="close()"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close()">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" (click)="confirm()">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: [],
  standalone : false
})
export class ReusableInputComponent {
  @Input() modalId!: string;
  @Input() title!: string;
  @Input() message!: string;
  @Output() confirmed = new EventEmitter<boolean>();

  // Method to show the modal
  show() {
    const modalElement: HTMLElement | null = document.getElementById(
      this.modalId
    );
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
    }
  }

  // Method to close the modal
  close() {
    const modalElement: HTMLElement | null = document.getElementById(
      this.modalId
    );
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  // Method to confirm the action
  confirm() {
    // Emit the confirmed event and close the modal
    this.confirmed.emit(true);
    this.close();
  }
}
