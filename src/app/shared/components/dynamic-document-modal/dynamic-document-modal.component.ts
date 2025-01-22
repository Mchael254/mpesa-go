import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dynamic-document-modal',
  templateUrl: './dynamic-document-modal.component.html',
  styleUrls: ['./dynamic-document-modal.component.css'],
  standalone : false
})
export class DynamicDocumentModalComponent {
  @Input() modalTitle: string;
  @Input() modalBody: string;
  @Input() modalButtonLabel: string;
  @Input() modalVisible: boolean;
  @Input() useDynamicContent = false;
  @Input() showModalButtons: boolean = true;
  @Input() zIndex: any;
  @Input() isDocument: boolean = false; //to control which pop up is shown under documents component

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
