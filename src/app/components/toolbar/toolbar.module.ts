import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from './toolbar.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CommonModule
  ],
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
