import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  styleUrls: ['./download-modal.component.css'],
  standalone : false
})
export class DownloadModalComponent implements OnInit{
  ngOnInit(): void {
  }

  closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
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
