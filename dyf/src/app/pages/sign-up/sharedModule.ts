import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RutFormatDirective } from './rut-format.directive';

@NgModule({
  declarations: [RutFormatDirective],
  imports: [CommonModule],
  exports: [RutFormatDirective]
})
export class SharedModule { }