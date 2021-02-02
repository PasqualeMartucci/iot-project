import { Component } from '@angular/core';
import { IonToggle } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
    
  }

 
 onChange(event){

if(event.detail.checked){
  document.body.setAttribute('color-theme','dark');
}
else{
  document.body.setAttribute('color-theme','light');
}
  }


}
