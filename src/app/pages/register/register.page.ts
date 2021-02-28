import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Hotspot, HotspotConnectionInfo } from '@ionic-native/hotspot/ngx';
import { ToastService, ToastType } from 'src/app/@core/services/toast.service';

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
  id;
  constructor(private authSvc: AuthService,
     private fb: FormBuilder,
     private router: Router,
     private geolocation: Geolocation,
     private toast: ToastService,
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
      this.authSvc.register(email,password,displayName,this.latitude,this.longitude,this.id).then(()=>{
        this.router.navigate(['/login']);
      });
    });
  }
 

 

}
