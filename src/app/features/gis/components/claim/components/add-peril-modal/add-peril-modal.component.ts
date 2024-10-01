import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-peril-modal',
  templateUrl: './add-peril-modal.component.html',
  styleUrls: ['./add-peril-modal.component.css']
})
export class AddPerilModalComponent {
  @Input() showModal = false;
  @Output() savePeril = new EventEmitter<{ peril: string; estimate: string }>();
  @Output() closeModal = new EventEmitter<void>();

  // Peril details (Now with 'label' and 'value')
  @Input() perils: { label: string; value: string }[] = []; // Input from parent component
  peril: string = '';
  claimEstimate = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSavePeril() {
    // Emit the peril details to the parent component
    this.savePeril.emit({ peril: this.peril, estimate: this.claimEstimate });
  }

  onCloseModal() {
    // Close the modal
    this.closeModal.emit();
  }
}
