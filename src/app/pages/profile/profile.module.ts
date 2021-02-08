import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { NgLetModule } from 'src/app/@core/directives/ng-let';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    NgLetModule,
    
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
