import { Component, OnInit } from '@angular/core';
import { ToastService, ToastType } from 'src/app/@core/services/toast.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/@core/services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

constructor(public toast: ToastService,
  public alertController: AlertController,
  private auth: AuthService) { }





ngOnInit(){


}






}






