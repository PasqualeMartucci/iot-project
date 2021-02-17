import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/@core/models/user.model';
import { AuthService } from 'src/app/@core/services/auth.service';
import { SearchUtils } from 'src/app/@core/utils/search';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {
  subscription: Subscription;
  filteredUsers: User[] = [];
  users: User[] = [];
  searchQueryText = '';
  constructor(private modalCtrl: ModalController,public auth: AuthService,public alertController: AlertController) { }

  ngOnInit() {
    this.subscription= this.auth.users.subscribe((response)=> {
      this.users = [...response];
      this.updateFilter(this.searchQueryText);
    });
  }
  
  updateFilter(event) {
    if(event.detail == undefined){
      this.filteredUsers = this.users;
    }else{
      this.searchQueryText= event.detail.value;
    }
  
    if (!this.searchQueryText) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => SearchUtils.searchInObj(user, this.searchQueryText));
    } 
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
  
   onActivate(event) {
    if (event.type == "click") {
     this.presentAlert(event.row);
  }
  }
  
  async presentAlert(user) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'ATTENZIONE',
      message: 'Sei sicuro di aggiungere questo membro?',
      buttons: 
      [
       {
        text: 'ACCETTA',
        handler: ()=> this.addMember(user)
       },
       
      {
        text: 'ANNULLA',
        role: 'cancel',
      }
       
      ]
    });
    await alert.present();
  }

  addMember(user){
   this.auth.addMembro(user["uid"]);
     
  }

}
