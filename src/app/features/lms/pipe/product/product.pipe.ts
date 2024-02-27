import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'product'
})
export class ProductPipe implements PipeTransform {

  transform(productList: any[], code: number): string {
    if(productList?.length>0){
    const product = productList.find(data => data['code'] === code);
    if (product) {
      return product['description'];
    }
    return 'NULL';
  }
  return 'NULL';
}

}
