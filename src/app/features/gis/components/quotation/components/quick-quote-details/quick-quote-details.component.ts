import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import stepData from '../../data/steps.json'
@Component({
  selector: 'app-quick-quote-details',
  templateUrl: './quick-quote-details.component.html',
  styleUrls: ['./quick-quote-details.component.css']
})
export class QuickQuoteDetailsComponent implements  OnInit {
  steps = stepData;
  ngOnInit(): void {
  }
  
}
