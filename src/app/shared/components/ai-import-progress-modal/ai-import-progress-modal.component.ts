import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Logger, UtilService } from '../../services';


const log = new Logger('AiImportProgressModalComponent');

@Component({
  selector: 'app-ai-import-progress-modal',
  templateUrl: './ai-import-progress-modal.component.html',
  styleUrls: ['./ai-import-progress-modal.component.css'],
  standalone: false,

})
export class AiImportProgressModalComponent {
  @Input() progress: number = 0;
  @Input() visible: boolean = false;
  @Input() errorMessage: string | null = null;

  @Output() dismiss = new EventEmitter<void>();

  stepMessages: string[] = [
    'Scanning file',
    'Extracting file details',
    'Filling form'
  ];
  get currentStepMessage(): string {
    if (this.progress < 34) return this.stepMessages[0];
    if (this.progress < 67) return this.stepMessages[1];
    return this.stepMessages[2];
  }
  onDismiss(): void {
    this.dismiss.emit();
  }
}
