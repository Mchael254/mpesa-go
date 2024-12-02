import {Directive, ElementRef, HostListener} from '@angular/core';
@Directive({
  selector: '[appCommaFormat]'
})
export class CommaformatDirective {
  private currencyDelimiter: string;
  constructor(private el: ElementRef) {
    this.currencyDelimiter = sessionStorage.getItem('currencyDelimiter') || ','; // Default to comma if not found

   }

  @HostListener('input')
  onInput() {
    const value = this.el.nativeElement.value;
    const formattedValue = this.formatNumber(value);
    this.el.nativeElement.value = formattedValue;
  }
  private formatNumber(value: string): string {
    // Remove existing commas and convert to number
    // const numberValue = Number(value.replace(/,/g, ''));
    const numberValue = Number(value.replace(new RegExp(`\\${this.currencyDelimiter}`, 'g'), ''));


     // Format the number using the specified delimiter (e.g., comma)
     if (!isNaN(numberValue) && numberValue >= 1000) {
      return numberValue.toLocaleString().replace(',', this.currencyDelimiter); // Replace the default comma with the specified delimiter
    }
        // Format the number with commas if it's greater than 1000
    // if (numberValue >= 1000) {
    //   return numberValue.toLocaleString();
    // }

    return value;
  }


}
