import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMemberPageRoutingModule } from './add-member-routing.module';

import { AddMemberPage } from './add-member.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgLetModule } from 'src/app/@core/directives/ng-let';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMemberPageRoutingModule,
    NgxDatatableModule,
    NgLetModule
  ],
  declarations: [AddMemberPage]
})
export class AddMemberPageModule {}
