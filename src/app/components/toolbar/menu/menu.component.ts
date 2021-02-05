import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UserPreferencesService } from 'src/app/@core/services/user-preferences.service';
import { InfoComponent } from '../../info/info.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
  public userPreferences: UserPreferencesService,
  private modalController: ModalController,
  public auth: AuthService ) { }

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: InfoComponent,
    });
    return await modal.present();
  }

}
