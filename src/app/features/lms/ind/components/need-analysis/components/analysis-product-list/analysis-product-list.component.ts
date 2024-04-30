import { Component, Input, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {ProductService} from "../../../../../service/product/product.service";

@Component({
  selector: 'app-analysis-product-list',
  templateUrl: './analysis-product-list.component.html',
  styleUrls: ['./analysis-product-list.component.css']
})
export class AnalysisProductListComponent implements OnInit{

  @Input() products: number[];
  productList: any[] = []
  constructor(private product_service:ProductService, private spinner_service: NgxSpinnerService){}

  ngOnInit(): void {
    this.spinner_service.show()
    console.log(this.products);
    this.product_service.getListOfProduct().subscribe((data) => {
      this.productList = data;
      this.spinner_service.hide();
    });

  }



}
