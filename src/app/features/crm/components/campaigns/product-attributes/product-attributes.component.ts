import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.css']
})
export class ProductAttributesComponent implements OnInit{
  productData: any;
  selectedProduct: any;
  productAttributesData: any;
  selectedProductAttributes: any;
  pageSize: 5;

  editMode: boolean = false;


  constructor() {
  }

  ngOnInit(): void {
  }

  openDefineProductModal() {
    const modal = document.getElementById('campaignClientProduct');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDefineProductModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignClientProduct');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openDefineProductAttributesModal() {
    const modal = document.getElementById('campaignClientProductAttributes');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDefineProductAttributesModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignClientProductAttributes');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
