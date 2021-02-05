import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ValidationErrorComponent } from './validation-error.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FlexLayoutModule
  ],
  declarations: [ValidationErrorComponent],
  exports: [
    ValidationErrorComponent
  ]
})
export class ValidationErrorModule {}
