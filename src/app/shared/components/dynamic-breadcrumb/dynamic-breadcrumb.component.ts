import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BreadCrumbItem} from "../../data/common/BreadCrumbItem";

@Component({
  selector: 'app-dynamic-breadcrumb',
  templateUrl: './dynamic-breadcrumb.component.html',
  styleUrls: ['./dynamic-breadcrumb.component.css'],
  standalone : false
})
export class DynamicBreadcrumbComponent implements OnInit  {
  @Input() breadCrumbItems: BreadCrumbItem[];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }
}
