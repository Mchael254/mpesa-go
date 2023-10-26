import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beneficiary'
})
export class BeneficiaryPipe implements PipeTransform {

  transform(beneficiaryList: any[], code: number): string {
    const beneficiary = beneficiaryList.find(data => data['code'] === code);
    if (beneficiary) {
      return beneficiary['first_name'] + ' ' + beneficiary['other_name'];
    }
    return '';
  }
}
