import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-client-attributes',
  templateUrl: './client-attributes.component.html',
  styleUrls: ['./client-attributes.component.css']
})
export class ClientAttributesComponent implements OnInit {
  clientAttributesData: any;
  selectedClientAttributes: any;
  pageSize: 5;

  editMode: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
  }

  openDefineClientAttributesModal() {
    const modal = document.getElementById('campaignClientAttribute');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDefineClientAttributesModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignClientAttribute');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
