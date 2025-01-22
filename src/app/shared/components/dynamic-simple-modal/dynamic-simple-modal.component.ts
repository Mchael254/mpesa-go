import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-simple-modal',
  templateUrl: './dynamic-simple-modal.component.html',
  styleUrls: ['./dynamic-simple-modal.component.css'],
  standalone : false
})
export class DynamicSimpleModalComponent {
  @Input() modalTitle: string;
  @Input() modalBody: string;
  @Input() modalButtonLabel: string;
  @Input() modalVisible: boolean;
  @Input() useDynamicContent = false;
  @Input() showModalButtons: boolean = true;
  @Input() zIndex: any;

  @Output() actionEmitter: EventEmitter<void> = new EventEmitter<void>();


  emitAction() {

    let forms:any = {
      first: "first",
      second: "2nd",
      third: "3rd"
    }
    this.actionEmitter.emit(forms);
    this.modalVisible = !this.modalVisible;
  }

}
