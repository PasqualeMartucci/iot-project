import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from './toolbar.component';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  
  ],
  declarations: [ToolbarComponent,MenuComponent],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
