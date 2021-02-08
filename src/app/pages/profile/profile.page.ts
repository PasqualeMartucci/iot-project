import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/@core/services/auth.service';
import { ToastService, ToastType } from 'src/app/@core/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
     public auth: AuthService,
     private alertController: AlertController,
     private toast: ToastService) { }

  ngOnInit() {
  }

  async editName(displayName: string) {
    let alert = await this.alertController.create({
      header: 'Inserisci nome e cognome',
      backdropDismiss: false,
      cssClass: 'custom-alert',
      inputs: [
        {
          id: 'displayName',
          name: 'displayName',
          placeholder: 'Nome e Cognome',
          type: 'text',
          value: displayName,
          attributes: {
            minLength: 1,
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Salva',
          handler: data => {
            const displayNameInput: HTMLInputElement = document.querySelector('#displayName');
            if (displayNameInput.checkValidity()) {
             if (data.displayName !== displayName) this.auth.updateUserData3(data).then(()=>{
             this.toast.makeToast("Modifica effettuata con successo!",ToastType.Success);
             });
            } else {
              this.toast.makeToast('Compila correttamente i campi nome e cognome.',ToastType.Error);
              return false;
            }
          }
        }
      ]
    });
  
    alert.present().then(() => {
      const displayNameInput: HTMLInputElement = document.querySelector('#displayName');
      displayNameInput.onblur = (() => {
        if (!!displayNameInput.value) {
          displayNameInput.value =displayNameInput.value.toLowerCase().trim().replace(/ +(?= )/g, '').split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        }
      })
      displayNameInput.focus();
    }).finally(() => {
      
    })
  }
  




}
