import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CommonModule
  ],
  declarations: [MenuComponent],
  exports: [MenuComponent]
})
export class MenuModule {}
