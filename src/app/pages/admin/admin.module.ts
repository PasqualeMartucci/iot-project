import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgLetModule } from 'src/app/@core/directives/ng-let';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    NgxDatatableModule,
    NgLetModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
