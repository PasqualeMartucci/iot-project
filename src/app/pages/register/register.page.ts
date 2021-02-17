import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Feature, MapService } from 'src/app/@core/services/map.service';
import { Hotspot, HotspotConnectionInfo } from '@ionic-native/hotspot/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [Hotspot]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  latitude: number; 
  longitude: number;
  addresses: string[] = [];
  selectedAddress = null;
  id;
  constructor(private authSvc: AuthService,
     private fb: FormBuilder,
     private router: Router,
     private geolocation: Geolocation,
     private mapSvc: MapService,
     private hotspot: Hotspot) { }

 

   getCoordinate(){
    return this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude=resp.coords.latitude;
      this.longitude=resp.coords.longitude;
     }).catch((error) => {
     });
   }

  ngOnInit() {
    this.registerForm= this.fb.group({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',Validators.minLength(6)),
      displayName: new FormControl('',Validators.required),
    });

    this.hotspot.getConnectionInfo().then((networks: HotspotConnectionInfo) => {
      this.id= networks.SSID;
    });
  }

  onRegister() {
    var {email,password,displayName} = this.registerForm.value;
    this.getCoordinate().then(()=>{
      this.authSvc.register(email,password,displayName,this.latitude,this.longitude,this.selectedAddress,this.id).then(()=>{
        this.router.navigate(['/login']);
      });
    });
  }
 

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapSvc
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat.place_name);
        });
      } else {
        this.addresses = [];
      }
  }
  
  onSelect(address: string) {
    this.selectedAddress = address;
    this.addresses = [];
  }

}
