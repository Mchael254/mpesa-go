import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone : false
})
export class ErrorComponent implements OnInit {
  @Input() message = '';

  constructor() { }

  ngOnInit(): void {
  }
}
