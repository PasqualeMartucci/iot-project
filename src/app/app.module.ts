import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgLetModule } from './@core/directives/ng-let';
import {NFC, Ndef} from '@ionic-native/nfc/ngx';
import { MenuModule } from './components/toolbar/menu/menu.module';
import { InfoModule } from './components/info/info.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ToolbarModule, 
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgLetModule,
    MenuModule,
    InfoModule,
    GooglePlaceModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [{ 
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy,
   },
  NFC,
  Ndef,
 Geolocation],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
