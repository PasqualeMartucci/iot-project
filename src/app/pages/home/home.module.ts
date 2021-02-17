import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GeoapifyGeocoderAutocompleteModule } from '@geoapify/angular-geocoder-autocomplete';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxDatatableModule,
    GeoapifyGeocoderAutocompleteModule.withConfig('599d00cd13b64df4bfcd7b560124b833')

  ],
  declarations: [HomePage]
})
export class HomePageModule {}
