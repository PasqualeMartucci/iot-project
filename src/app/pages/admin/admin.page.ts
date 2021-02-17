import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/@core/models/user.model';
import { AuthService } from 'src/app/@core/services/auth.service';
import { SearchUtils } from 'src/app/@core/utils/search';
import { AddMemberPage } from './add-member/add-member.page';

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
  constructor(private auth: AuthService,private modalCtrl: ModalController) { }

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


}
