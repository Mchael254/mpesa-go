import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css'],
  standalone : false
})
export class ShareModalComponent implements OnInit{

  ngOnInit(): void {
  }

  copyToClipboard() {
    /* Get the text field */
    const copyText = document.getElementById("copy-text") as HTMLInputElement;

    if (copyText) {
      const range = document.createRange();
      range.selectNode(copyText);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
    }

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
  }

  closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }
}
