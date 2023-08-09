import {Component, OnInit} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'turnquestv6-fe';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.populate();
  }
}
