import { Directive, EventEmitter, Input, ChangeDetectorRef, Output, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appTrim]',
  providers: [NgModel]
})
export class TrimDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('blur') onBlur() {
    const value = this.elementRef.nativeElement.value;
    const valueTrim = value.trim();
    if (value !== valueTrim) {
      this.elementRef.nativeElement.value = valueTrim;
    }
  }
}
