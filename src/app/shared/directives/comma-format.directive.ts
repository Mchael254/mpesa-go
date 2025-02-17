import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appCommaFormat]',
  standalone: false
})
export class CommaformatDirective implements OnInit {
  private currencyDelimiter: string;

  constructor(private el: ElementRef) {
    this.currencyDelimiter = sessionStorage.getItem('currencyDelimiter') || ',';
  }

  ngOnInit() {
    // Format the initial value
    this.formatContent();

    // Set up MutationObserver to watch for content changes
    const observer = new MutationObserver(() => {
      this.formatContent();
    });

    observer.observe(this.el.nativeElement, {
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  private formatContent() {
    const value = this.el.nativeElement.textContent;
    if (value) {
      const numberValue = Number(value.replace(new RegExp(`\\${this.currencyDelimiter}`, 'g'), ''));

      if (!isNaN(numberValue)) {
        const formattedValue = numberValue.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).replace(/,/g, this.currencyDelimiter);

        this.el.nativeElement.textContent = formattedValue;
      }
    }
  }
}
