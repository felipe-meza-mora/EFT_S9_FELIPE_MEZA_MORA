import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRutFormat]'
})
export class RutFormatDirective {

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const value = this.el.nativeElement.value.replace(/[^0-9kK]/g, '');
    let formattedRut = this.formatRut(value);
    this.el.nativeElement.value = formattedRut;
    this.control.control?.setValue(formattedRut, { emitEvent: false });
  }

  formatRut(value: string): string {
    if (value.length <= 1) {
      return value;
    }
    let rut = value.slice(0, -1);
    let dv = value.slice(-1).toUpperCase();

    let formattedRut = '';
    while (rut.length > 3) {
      formattedRut = '.' + rut.slice(-3) + formattedRut;
      rut = rut.slice(0, -3);
    }
    formattedRut = rut + formattedRut + '-' + dv;

    return formattedRut;
  }
}