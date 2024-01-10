import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.css']
})
export class ProductDataComponent {
  @Input() productId = 0;
  @Input() productList = []

  imageUrl =
  'https://www.productplan.com/uploads/2018/08/product-development.png'

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.setDynamicBackground();
  }

  setDynamicBackground() {
    // this.imageUrl =this.imageUrl
    // `./assets/images/${this.productId}.jpg`;
    console.log(this.imageUrl);

    const element = this.el.nativeElement.querySelector('.picture');
    this.renderer.setStyle(element, 'background-image', `url(${this.imageUrl})`);
  }

}
