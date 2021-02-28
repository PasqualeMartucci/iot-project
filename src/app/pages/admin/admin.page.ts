import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/@core/models/user.model';
import { AuthService } from 'src/app/@core/services/auth.service';
import { SearchUtils } from 'src/app/@core/utils/search';
import { AddMemberPage } from './add-member/add-member.page';
import firebase from 'firebase/app';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  subscription: Subscription;
  filteredUsers: User[] = [];
  users: User[] = [];
  searchQueryText = '';

  constructor(private auth: AuthService,private modalCtrl: ModalController,private alertController: AlertController) { }

  ngOnInit() {
      this.subscription= this.auth.users_family.subscribe((response)=> {
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

  presentModal() {
    this.modalCtrl.create({
      component: AddMemberPage,
      swipeToClose: true
    }).then(modal => {
      modal.present();
    })
  } 

  onActivate(event) {
    if (event.type == "click") {
     this.presentAlert(event.row["uid"]);
  }
  }



  async presentAlert(uid) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'ATTENZIONE',
      message: 'Sei sicuro di rimuovere questo membro?',
      buttons: 
      [
       {
        text: 'ACCETTA',
        handler: ()=> this.auth.deleteUser(uid)
       },
       
      {
        text: 'ANNULLA',
        role: 'cancel',
      }
       
      ]
    });
    await alert.present();
  }

}
