import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-analysis-product-list',
  templateUrl: './analysis-product-list.component.html',
  styleUrls: ['./analysis-product-list.component.css']
})
export class AnalysisProductListComponent implements OnInit{

  @Input() products: number[];

  ngOnInit(): void {
    console.log(this.products);

  }



}
